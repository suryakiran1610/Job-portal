# Generated by Django 5.0.3 on 2024-06-11 08:49

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('company', '0002_alter_jobpost_jobexperiance_alter_jobpost_jobvacancy'),
    ]

    operations = [
        migrations.AddField(
            model_name='jobpost',
            name='jobposteddate',
            field=models.DateField(auto_now_add=True, null=True),
        ),
    ]