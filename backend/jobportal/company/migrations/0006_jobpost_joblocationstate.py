# Generated by Django 5.0.3 on 2024-06-15 13:22

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('company', '0005_alter_jobpost_companyname'),
    ]

    operations = [
        migrations.AddField(
            model_name='jobpost',
            name='joblocationstate',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
    ]
