# Generated by Django 5.0.3 on 2024-07-02 14:48

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('company', '0014_companyemployee'),
        ('jobseeker', '0014_alter_jobseeker_job_category'),
    ]

    operations = [
        migrations.AlterField(
            model_name='jobseeker',
            name='job_category',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='company.jobcategories'),
        ),
    ]
