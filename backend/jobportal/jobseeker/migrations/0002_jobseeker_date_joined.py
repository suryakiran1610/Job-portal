# Generated by Django 5.0.3 on 2024-07-07 14:01

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('jobseeker', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='jobseeker',
            name='date_joined',
            field=models.DateField(auto_now_add=True, null=True),
        ),
    ]
