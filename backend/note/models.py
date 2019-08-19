from django.db import models
from django.contrib.auth.models import User
from common.createmodifymodels import CreateModifyModel 

class Note(CreateModifyModel):
	content=models.TextField(null=True,blank=True,default="")
	user=models.ForeignKey(User,on_delete=models.CASCADE)
	title=models.CharField(max_length=50)
	edit_allowed_user=models.ManyToManyField(User,related_name='edit_user')
	view_allowed_user=models.ManyToManyField(User,related_name='view_user')
	deactivate=models.BooleanField(default=False)