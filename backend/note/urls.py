from django.conf.urls import url, include
from . import views

urlpatterns = [
    url(r'^Register/$', views.Register.as_view(),name='register'),
    url(r'^Login/$', views.Login.as_view(),name='login'),
    url(r'ListCreateNote/$', views.AddNote.as_view(), name='note-add-list'),
    url(r'NoteOperation/(?P<pk>[0-9]+)/$', views.NoteOperation.as_view(), name='note-ops'),
    url(r'UserList/(?P<pk>[0-9]+)/$', views.UserList.as_view(), name='user-list'),
    url(r'ManageAddPermissionView/(?P<pk>[0-9]+)/$',views.ManageAddPermissionView.as_view(),name='addViewUser'),
    url(r'RemovemManagePermissionUser/(?P<pk>[0-9]+)/$',views.RemovemManagePermissionUser.as_view(),name='addEditUser'),
]
