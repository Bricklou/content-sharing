# Generated by Django 4.1.6 on 2023-02-04 17:44

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('webapp', '0003_userauth'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='userauth',
            name='remote_user_email',
        ),
    ]