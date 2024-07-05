# Generated by Django 5.0.3 on 2024-07-05 04:10

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('company', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='company',
            name='company_sectors',
        ),
        migrations.RemoveField(
            model_name='company',
            name='department_name',
        ),
        migrations.AlterField(
            model_name='company',
            name='company_name',
            field=models.CharField(blank=True, max_length=255, null=True, unique=True),
        ),
        migrations.AlterField(
            model_name='company',
            name='company_website',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
        migrations.AlterField(
            model_name='company',
            name='is_verified',
            field=models.BooleanField(blank=True, default=False, null=True),
        ),
        migrations.AlterField(
            model_name='company',
            name='profile_image',
            field=models.ImageField(blank=True, null=True, upload_to='company_logo'),
        ),
    ]
