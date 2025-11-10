from django.db import models

class CarMake(models.Model):
    name = models.CharField(max_length=64)

    def __str__(self):
        return self.name

class CarModel(models.Model):
    make = models.ForeignKey(CarMake, on_delete=models.CASCADE)
    name = models.CharField(max_length=64)
    year = models.IntegerField()

    def __str__(self):
        return f"{self.make.name} {self.name} ({self.year})"
