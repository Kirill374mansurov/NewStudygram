import base64

from django.core.files.base import ContentFile
from rest_framework import serializers

from backend import constants
from .models import (User, Subscription, Topic,
                     StudyMaterial, Favorite)


class UserSerializer(serializers.ModelSerializer):
    is_subscribed = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = (
            'email',
            'id',
            'username',
            'first_name',
            'last_name',
            'is_subscribed',
            'avatar'
        )
        lookup_field = 'username'

    def get_is_subscribed(self, obj):
        request = self.context.get('request')
        if not request or request.user.is_anonymous:
            return False
        return Subscription.objects.filter(
            subscriber=request.user,
            author=obj
        ).exists()


class AvatarSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('avatar',)


class Base64ImageField(serializers.ImageField):
    def to_internal_value(self, data):
        if isinstance(data, str) and data.startswith('data:image'):
            format, imgstr = data.split(';base64,')
            ext = format.split('/')[-1]
            data = ContentFile(base64.b64decode(imgstr), name='temp.' + ext)

        return super().to_internal_value(data)


class TopicSerializer(serializers.ModelSerializer):

    class Meta:
        model = Topic
        fields = ('id', 'name', 'slug')


class StudyMaterialShortSerializer(serializers.ModelSerializer):

    class Meta:
        model = StudyMaterial
        fields = ('id', 'title', 'cover', 'estimated_time')


class StudyMaterialReadSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    topics = TopicSerializer(many=True, read_only=True)
    is_favorited = serializers.SerializerMethodField()

    class Meta:
        model = StudyMaterial
        fields = ('id', 'title', 'author', 'description', 'is_favorited',
                  'content_type', 'link', 'cover', 'topics', 'estimated_time',
                  'level', 'created_at', 'updated_at')

    def get_is_favorited(self, obj):
        request = self.context.get('request')
        if not request or request.user.is_anonymous:
            return False
        return Favorite.objects.filter(
            user=request.user,
            material=obj
        ).exists()


class StudyMaterialWriteSerializer(serializers.ModelSerializer):
    topics = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=Topic.objects.all()
    )

    class Meta:
        model = StudyMaterial
        fields = ('title', 'description', 'content_type', 'link', 'cover',
                  'topics', 'estimated_time', 'level')

    def validate_title(self, value):
        if not value.strip():
            raise serializers.ValidationError('Название не может быть пустым.')
        return value

    def validate_description(self, value):
        if not value.strip():
            raise serializers.ValidationError('Описание не может быть пустым.')
        return value

    def validate_topics(self, value):
        if not value:
            raise serializers.ValidationError(
                'Нужно указать хотя бы одну тему.')
        return value

    def validate_estimated_time(self, value):
        if value is not None and value <= 0:
            raise serializers.ValidationError(
                'Оценочное время должно быть больше 0.'
            )
        return value

    def validate(self, attrs):
        content_type = attrs.get(
            'content_type',
            getattr(self.instance, 'content_type', None)
        )
        link = attrs.get(
            'link',
            getattr(self.instance, 'link', None)
        )

        if content_type == 'link' and not link:
            raise serializers.ValidationError({
                'link': 'Для материала типа link поле link обязательно.'
            })

        return attrs

    def create(self, validated_data):
        topics = validated_data.pop('topics')
        request = self.context.get('request')

        material = StudyMaterial.objects.create(
            author=request.user,
            **validated_data
        )
        material.topics.set(topics)
        return material

    def update(self, instance, validated_data):
        topics = validated_data.pop('topics', None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()

        if topics is not None:
            instance.topics.set(topics)

        return instance

    def to_representation(self, instance):
        return StudyMaterialReadSerializer(
            instance,
            context=self.context
        ).data


class SubscriptionSerializer(UserSerializer):
    materials = serializers.SerializerMethodField()
    materials_count = serializers.SerializerMethodField()

    class Meta(UserSerializer.Meta):
        fields = UserSerializer.Meta.fields + (
            'materials',
            'materials_count',
        )

    def get_materials(self, obj):
        request = self.context.get('request')
        materials = obj.materials.all()

        materials_limit = request.query_params.get('materials_limit')
        if materials_limit:
            try:
                materials = materials[:int(materials_limit)]
            except ValueError:
                pass

        return StudyMaterialShortSerializer(
            materials,
            many=True,
            context=self.context
        ).data

    def get_materials_count(self, obj):
        return obj.materials.count()
