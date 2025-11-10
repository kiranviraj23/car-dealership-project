from django.contrib import admin
from .models import CarMake, CarModel

@admin.register(CarMake)
class CarMakeAdmin(admin.ModelAdmin):
    list_display = ('id', 'name')

@admin.register(CarModel)
class CarModelAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'make', 'year')
