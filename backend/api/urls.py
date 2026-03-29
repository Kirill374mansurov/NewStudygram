from rest_framework.routers import DefaultRouter

from .views import TopicViewSet, StudyMaterialViewSet, UserViewSet

router = DefaultRouter()
router.register(r'users', UserViewSet, basename='users')
router.register(r'topics', TopicViewSet, basename='topics')
router.register(r'materials', StudyMaterialViewSet, basename='materials')

urlpatterns = router.urls
