# Generated by Django 5.0.3 on 2024-07-09 15:17

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('company', '0006_jobpostedhistory_jobid'),
    ]

    operations = [
        migrations.AlterField(
            model_name='jobpostedhistory',
            name='jobstatus',
            field=models.BooleanField(blank=True, null=True),
        ),
    ]
