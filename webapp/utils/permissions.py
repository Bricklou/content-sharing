from rest_framework.permissions import IsAuthenticated


class IsAuthenticatedNotPost(IsAuthenticated):
    def has_permission(self, request, view):
        if request.method == 'POST':
            return True
        return super(IsAuthenticatedNotPost, self).has_permission(request, view)
