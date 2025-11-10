from django.contrib import admin
from django.urls import path
from reviews import views
from django.contrib.auth import views as auth_views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', views.home, name='home'),
    path('about/', views.about, name='about'),
    path('contact/', views.contact, name='contact'),
    path('dealers/<str:dealer_id>/', views.dealer_detail, name='dealer_detail'),
    path('add-review/<str:dealer_id>/', views.add_review, name='add_review'),
    path('login/', auth_views.LoginView.as_view(template_name='login.html'), name='login'),
    path('logout/', auth_views.LogoutView.as_view(next_page='/'), name='logout'),
    path('signup/', views.signup_view, name='signup'),
]
