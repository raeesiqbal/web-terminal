from django.contrib import admin
from .models import Email
from .models import User

# Register your models here.

admin.site.register(Email)
admin.site.register(User)
