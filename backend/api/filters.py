from django_filters import rest_framework as filters
from .models import StudyMaterial, Topic, User


class StudyMaterialFilter(filters.FilterSet):
    topics = filters.ModelMultipleChoiceFilter(
        queryset=Topic.objects.all(),
        field_name='topics__slug',
        to_field_name='slug'
    )
    author = filters.ModelChoiceFilter(
        queryset=User.objects.all(),
        field_name='author__id'
    )
    is_favorited = filters.BooleanFilter(method='filter_is_favorited')

    class Meta:
        model = StudyMaterial
        fields = ('topics', 'author', 'is_favorited')

    def filter_is_favorited(self, queryset, name, value):
        user = getattr(self.request, 'user', None)
        if value and user and user.is_authenticated:
            return queryset.filter(favorited_by__user=user)
        if value:
            return queryset.none()
        return queryset