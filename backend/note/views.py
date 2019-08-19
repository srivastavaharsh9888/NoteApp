from django.db import models

from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.db.models import Q

from rest_framework import generics
from rest_framework import status
from rest_framework.response import Response

from rest_framework.authtoken.models import Token
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.views import APIView
from rest_framework.decorators import api_view,authentication_classes,permission_classes

from .serializers import UserSerializer,NoteSerializer,UserAllSerializer
from .models import Note

class Register(APIView):

    def post(self, request):
        password = request.data.get("password")
        cnf_pwd = request.data.get("confirm_pwd")
        mobile = request.data.get("username")
        name = request.data.get("name")
        user_serializer=UserSerializer(data=request.data)
        if user_serializer.is_valid():
        	user=User.objects.create_user(username=mobile,password=password,first_name=name)
        	user.is_active = True
        	user.save()
        	return Response({"message":"User created"},status=status.HTTP_200_OK)
        else:
        	return Response({"error":user_serializer.errors},status=status.HTTP_400_BAD_REQUEST)	
        return Response({"message":"User with this email already exists.","flag":False},status=status.HTTP_400_BAD_REQUEST)

class Login(APIView):
    def post(self, request):
        name = request.data.get("username")
        password = request.data.get("password")
        try:
            user_exists=User.objects.filter(username=name)
            if not user_exists.exists():
                return Response({"message":"User with this details not exists.","flag":False},status=status.HTTP_400_BAD_REQUEST)
            user_obj=authenticate(username=user_exists[0].username,password=password)
            if user_obj:
                if user_obj.is_active:
                    user_token,created=Token.objects.get_or_create(user=user_obj)
                    return Response({"message":"User Logged in","token":user_token.key,"username":user_obj.username},status=status.HTTP_200_OK)
                else:
                    return Response({"message":"Please activate your mobile number to login.","flag":False}, status=status.HTTP_401_UNAUTHORIZED)
            else:
                return Response({"message":'Password Incorrect',"flag":False},status=status.HTTP_401_UNAUTHORIZED)
        except Exception as e:
            return Response({'message': 'Please enter a valid username and password.',"details":str(e), "flag":False}, status=status.HTTP_401_UNAUTHORIZED)


class AddNote(generics.ListCreateAPIView):
    permission_classes = (IsAuthenticated,)
    authentication_classes=(TokenAuthentication,)

    serializer_class = NoteSerializer

    def get_queryset(self):
        return Note.objects.filter(view_allowed_user=self.request.user,deactivate=False).select_related('user')

    def perform_create(self,serializer):
        note_obj=serializer.save(user=self.request.user)
        note_obj.view_allowed_user.add(self.request.user)
        note_obj.edit_allowed_user.add(self.request.user)

class NoteOperation(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = (IsAuthenticated,)
    authentication_classes=(TokenAuthentication,)
    serializer_class = NoteSerializer

    def perform_destroy(self, instance):
        instance.deactivate=True
        instance.save()

    def get_queryset(self):
        return Note.objects.filter(edit_allowed_user=self.request.user,pk=int(self.kwargs.get("pk")),deactivate=False).select_related('user')

class UserList(APIView):
    permission_classes = (IsAuthenticated,)
    authentication_classes=(TokenAuthentication,)
    serializer_class = UserAllSerializer

    def get(self,request,pk):
        note_view_user_list=Note.objects.filter(id=pk).values_list('view_allowed_user')
        note_edit_user_list=Note.objects.filter(id=pk).values_list('edit_allowed_user')
        view_user_list=User.objects.filter(~Q(id__in=note_view_user_list)).values('username','first_name','id')
        edit_user_list=User.objects.filter(~Q(id__in=note_edit_user_list)).values('username','first_name','id')
        return Response({"edit_user_list":edit_user_list,"view_user_list":view_user_list})

class ManageAddPermissionView(generics.UpdateAPIView):
    permission_classes = (IsAuthenticated,)
    authentication_classes=(TokenAuthentication,)
    serializer_class = NoteSerializer

    def get_queryset(self):
        return Note.objects.filter(user=self.request.user,pk=int(self.kwargs.get("pk")),deactivate=False).select_related('user')

    #function to allow user to view note
    def put(self,request,*args,**kwargs):
        instance=self.get_object()
        instance.view_allowed_user.add(User.objects.get(id=request.data.get("userId")))
        return Response({"message":"Added"})

    #function to allow user to edit note
    def patch(self,request,*args,**kwargs):
        instance=self.get_object()
        instance.view_allowed_user.add(User.objects.get(id=request.data.get("userId")))
        instance.edit_allowed_user.add(User.objects.get(id=request.data.get("userId")))
        return Response({"message":"Added"})

class RemovemManagePermissionUser(generics.UpdateAPIView):
    permission_classes = (IsAuthenticated,)
    authentication_classes=(TokenAuthentication,)
    serializer_class = NoteSerializer

    def get_queryset(self):
        return Note.objects.filter(user=self.request.user,pk=int(self.kwargs.get("pk")),deactivate=False)

    #function to allow user to view note
    def put(self,request,*args,**kwargs):
        instance=self.get_object()
        user_id=User.objects.get(id=request.data.get("userId"))
        if request.user.id==user_id.id:
            return Response({"message":"You can't remove yourself."},status=status.HTTP_400_BAD_REQUEST)
        instance.view_allowed_user.remove(user_id)
        instance.save()
        return Response({"message":"Added"})

    #function to allow user to edit note
    def patch(self,request,*args,**kwargs):
        instance=self.get_object()
        user_id=User.objects.get(id=request.data.get("userId"))
        if request.user.id==user_id.id:
            return Response({"message":"You can't remove yourself from the edit list."},status=status.HTTP_400_BAD_REQUEST)
        instance.edit_allowed_user.remove(user_id)
        instance.save()
        return Response({"message":"Added"})


    
    

    
