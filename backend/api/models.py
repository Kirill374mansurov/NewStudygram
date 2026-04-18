import os

from django.db import models
from django.contrib.auth.models import AbstractUser
from django.contrib.auth.validators import UnicodeUsernameValidator
from django.core.validators import MaxValueValidator, MinValueValidator
from django.urls import reverse
from shortuuid.django_fields import ShortUUIDField

from backend import constants


class User(AbstractUser):
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = (
        'username',
        'first_name',
        'last_name'
    )
    username = models.CharField(
        verbose_name='',
        max_length=constants.NAME_MAX_LENGHT,
        unique=True,
        error_messages={
            'unique': 'Имя занято!',
        },
        validators=[UnicodeUsernameValidator()]
    )
    first_name = models.CharField(
        verbose_name='Имя', max_length=constants.NAME_MAX_LENGHT
    )
    last_name = models.CharField(
        verbose_name='Фамилия', max_length=constants.NAME_MAX_LENGHT
    )
    email = models.EmailField(
        verbose_name='Электронная почта',
        unique=True,
        error_messages={
            'unique': 'Почта занята!',
        },
        max_length=constants.EMAIL_MAX_LENGHT
    )
    avatar = models.ImageField(
        null=True,
        blank=True,
        verbose_name='Аватар'
    )
    is_subscribed = models.BooleanField(
        default=False,
        verbose_name='Подписка'
    )

    class Meta(AbstractUser.Meta):
        ordering = ['username']
        verbose_name = 'пользователь'
        verbose_name_plural = 'Пользователи'

    def __str__(self):
        return self.username


class Subscription(models.Model):
    author = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        verbose_name='Автор',
        related_name='subscription'
    )
    subscriber = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        verbose_name='Подписчик',
        related_name='subscriber'
    )

    class Meta:
        ordering = ['author']
        verbose_name = 'подписка'
        verbose_name_plural = 'Подписки'
        constraints = [
            models.UniqueConstraint(
                fields=['author', 'subscriber'],
                name='unique_author_subscriber'
            )
        ]

    def __str__(self):
        return f'{self.author}: {self.subscriber}'


class Topic(models.Model):
    name = models.CharField(
        max_length=constants.TAG_MAX_LENGHT, verbose_name='Название'
    )
    slug = models.SlugField(
        unique=True, verbose_name='Слаг', max_length=constants.TAG_MAX_LENGHT
    )

    class Meta:
        ordering = ['name']
        verbose_name = 'тег'
        verbose_name_plural = 'Теги'

    def __str__(self):
        return self.name


class StudyMaterial(models.Model):
    CONTENT_TYPES = [
        ('article', 'Статья'),
        ('video', 'Видео'),
        ('course', 'Курс'),
        ('book', 'Книга'),
        ('notes', 'Конспект'),
        ('link', 'Ссылка'),
    ]

    LEVELS = [
        ('beginner', 'Beginner'),
        ('intermediate', 'Intermediate'),
        ('advanced', 'Advanced'),
    ]

    author = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='materials',
        verbose_name='Автор'
    )
    title = models.CharField(max_length=255, verbose_name='Название')
    description = models.TextField(verbose_name='Описание')
    content_type = models.CharField(
        max_length=20,
        choices=CONTENT_TYPES,
        default='article',
        verbose_name='Тип материала'
    )
    link = models.URLField(blank=True, null=True, verbose_name='Ссылка')
    cover = models.ImageField(
        upload_to='materials/',
        blank=True,
        null=True,
        verbose_name='Обложка'
    )
    topics = models.ManyToManyField(
        Topic,
        related_name='materials',
        verbose_name='Темы'
    )
    estimated_time = models.PositiveSmallIntegerField(
        blank=True,
        null=True,
        verbose_name='Оценочное время изучения'
    )
    level = models.CharField(
        max_length=20,
        choices=LEVELS,
        blank=True,
        null=True,
        verbose_name='Уровень'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['title']
        verbose_name = 'материал'
        verbose_name_plural = 'Материалы'

    def __str__(self):
        return self.title


class Favorite(models.Model):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='favorites'
    )
    material = models.ForeignKey(
        StudyMaterial,
        on_delete=models.CASCADE,
        related_name='favorited_by'
    )

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['user', 'material'],
                name='unique_user_favorite_material'
            )
        ]
        ordering = ['user']
        verbose_name = 'фаворит'
        verbose_name_plural = 'Фавориты'

    def __str__(self):
        return f'{self.user}: {self.material}'
