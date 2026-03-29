from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import (User, Subscription, Topic,
                     StudyMaterial, Favorite)


@admin.register(User)
class UserAdmin(UserAdmin):
    list_display = (
        'username',
        'email',
        'avatar',
        'is_subscribed',
    )
    ordering = ('username',)


@admin.register(Subscription)
class SubscriptionAdmin(admin.ModelAdmin):
    pass


@admin.register(Topic)
class TopicAdmin(admin.ModelAdmin):
    pass


@admin.register(StudyMaterial)
class StudyMaterialAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'author',
                    'content_type', 'level', 'created_at')
    search_fields = ('title', 'author__username', 'author__email')
    list_filter = ('content_type', 'level', 'topics')


@admin.register(Favorite)
class FavoriteAdmin(admin.ModelAdmin):
    pass
