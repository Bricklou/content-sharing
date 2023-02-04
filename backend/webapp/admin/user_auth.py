from django.contrib import admin

from webapp.models.user_auth import UserAuth


class UserAuthAdmin(admin.ModelAdmin):
    list_display = ('user_id', 'provider', 'remote_user_id', 'remote_user_email',)
    list_display_links = ('user_id', 'remote_user_id', 'remote_user_email',)
    list_filter = ('user_id', 'provider', 'remote_user_id', 'remote_user_email',)

    search_fields = ('user_id', 'provider', 'remote_user_id', 'remote_user_email',)

    ordering = ('user_id', 'provider', 'remote_user_id', 'remote_user_email',)


admin.site.register(UserAuth, UserAuthAdmin)
