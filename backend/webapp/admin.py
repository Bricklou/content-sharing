from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .forms.admin import CustomUserCreationForm, CustomUserChangeForm
from .models import User


class CustomUserAdmin(UserAdmin):
    add_form = CustomUserCreationForm
    form = CustomUserChangeForm

    list_display = ("username", "email", "is_staff", "is_active", "is_superuser",)
    list_display_links = ("username",)
    list_filter = ("username", "email", "is_staff", "is_active", "is_superuser",)

    fieldsets = (
        (None, {"fields": ("username", "email", "password",)}),
        ("Permissions", {"fields": ("is_staff", "is_active", "is_superuser")},),
    )

    add_fieldsets = (
        (None,
         {
             "classes": ("wide",),
             "fields": (
                 "username",
                 "email",
                 "avatar",
                 "password1",
                 "password2",
                 "is_staff",
                 "is_active",
                 "is_superuser",
             ),
         },
         ),
    )
    search_fields = ("username", "email",)
    ordering = ("username", "email",)


admin.site.register(User, CustomUserAdmin)
