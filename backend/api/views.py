import base64
import os
from collections import defaultdict

from djoser import views
from django.core.files.base import ContentFile
from django_filters.rest_framework import DjangoFilterBackend
from django.http import HttpResponse
from django.shortcuts import redirect

from rest_framework import filters, mixins, status, viewsets
from rest_framework.decorators import action
from rest_framework.generics import get_object_or_404
from rest_framework.pagination import LimitOffsetPagination
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .filters import StudyMaterialFilter
from .models import (User, Subscription, Topic,
                     StudyMaterial, Favorite)
from .permissions import OwnerOrReadOnly, ReadOnly
from .serializers import (StudyMaterialWriteSerializer,
                          StudyMaterialShortSerializer, TopicSerializer,
                          SubscriptionSerializer, UserSerializer,
                          StudyMaterialReadSerializer)


class UserViewSet(views.UserViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    pagination_class = LimitOffsetPagination
    permission_classes = (ReadOnly,)

    @action(
        ['get'], detail=False, permission_classes=(IsAuthenticated,)
    )
    def me(self, request, *args, **kwargs):
        self.get_object = self.get_instance
        return self.retrieve(request, *args, **kwargs)

    @action(
        ['put', 'delete'],
        url_path='me/avatar',
        detail=False,
        permission_classes=(IsAuthenticated,)
    )
    def avatar(self, request):
        avatar = request.user.avatar

        if request.method == 'DELETE':
            avatar.delete(save=True)
            return Response(status=status.HTTP_204_NO_CONTENT)

        new_avatar = request.data.get('avatar')
        if not new_avatar:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        avatar_format, avatar_base64 = new_avatar.split(';base64,')
        extension = avatar_format.split('/')[-1]
        filename = f"{request.user.username}.{extension}"
        data = ContentFile(base64.b64decode(avatar_base64), name=filename)

        avatar.save(filename, data)
        return Response(
            {'avatar': avatar.url},
            status=status.HTTP_200_OK
        )

    @action(methods=['post', 'delete'], detail=True,
            permission_classes=[IsAuthenticated])
    def subscribe(self, request, id):
        author = get_object_or_404(User, pk=id)

        if request.method == 'DELETE':
            try:
                subscription = Subscription.objects.get(
                    author=author, subscriber=request.user
                )
                subscription.delete()
            except BaseException:
                return Response(status=status.HTTP_400_BAD_REQUEST)
            return Response(status=status.HTTP_204_NO_CONTENT)

        self.serializer_class = SubscriptionSerializer
        SubscriptionSerializer.validate(self, author, request.user)

        created = Subscription.objects.get_or_create(
            author=author, subscriber=request.user)

        if not created[-1]:
            return Response(
                {'errors': 'Уже подписаны!'},
                status=status.HTTP_400_BAD_REQUEST)
        serializer = self.get_serializer(
            author, context={'request': request})
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(methods=['get'], detail=False,
            permission_classes=[IsAuthenticated])
    def subscriptions(self, request):
        self.serializer_class = SubscriptionSerializer
        authors = User.objects.filter(subscription__subscriber=request.user)
        page = self.paginate_queryset(authors)
        if page is not None:
            serializer = self.get_serializer(
                page, many=True, context={'request': request})
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(
            authors, many=True, context={'request': request})
        return Response(serializer.data)


class RetrieveListViewSet(mixins.ListModelMixin, mixins.RetrieveModelMixin,
                          viewsets.GenericViewSet):
    pass


class TopicViewSet(RetrieveListViewSet):
    queryset = Topic.objects.all()
    serializer_class = TopicSerializer
    pagination_class = None


class StudyMaterialViewSet(viewsets.ModelViewSet):
    queryset = StudyMaterial.objects.all().select_related(
        'author').prefetch_related('topics')
    permission_classes = (OwnerOrReadOnly,)
    filter_backends = (DjangoFilterBackend, filters.SearchFilter)
    filterset_class = StudyMaterialFilter
    search_fields = ('title',)

    def get_serializer_class(self):
        if self.request.method in ('POST', 'PATCH', 'PUT'):
            return StudyMaterialWriteSerializer
        return StudyMaterialReadSerializer

    @action(methods=['post', 'delete'], detail=True, permission_classes=[IsAuthenticated])
    def favorite(self, request, pk=None):
        if request.method == 'POST':
            material = get_object_or_404(StudyMaterial, pk=pk)
            created = Favorite.objects.get_or_create(
                material=material, user=request.user
            )
            if not created[-1]:
                return Response(
                    {'errors': 'Материал уже в избранном!'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            serializer = StudyMaterialShortSerializer(
                material, context={'request': request}
            )
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        material = get_object_or_404(StudyMaterial, pk=pk)
        try:
            fav_recipe = Favorite.objects.get(
                material=material, user=request.user
            )
            fav_recipe.delete()
        except BaseException:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        return Response(status=status.HTTP_204_NO_CONTENT)


def redirect_material(request, short_id):
    short_link = os.getenv('ALLOWED_HOST') + short_id
    recipe = get_object_or_404(StudyMaterial, short_link=short_link)
    return redirect(f'/recipes/{recipe.id}')
