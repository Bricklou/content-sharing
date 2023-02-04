from django.contrib import admin

from webapp.models.user_auth import UserAuth


class UserAuthAdmin(admin.ModelAdmin):
    list_display = ('user_id', 'provider', 'remote_user_id',)
    list_display_links = ('user_id', 'remote_user_id',)
    list_filter = ('user_id', 'provider', 'remote_user_id',)

    search_fields = ('user_id', 'provider', 'remote_user_id',)

    ordering = ('user_id', 'provider', 'remote_user_id',)


admin.site.register(UserAuth, UserAuthAdmin)
