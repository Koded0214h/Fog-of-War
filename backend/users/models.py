from django.db import models
from django.contrib.auth.models import AbstractUser
from django.conf import settings

class User(AbstractUser):
    wallet_address = models.CharField(max_length=44, unique=True, blank=True, null=True)
    sol_balance = models.DecimalField(max_digits=18, decimal_places=9, default=0)
    total_games_played = models.IntegerField(default=0)
    total_sol_extracted = models.DecimalField(max_digits=18, decimal_places=9, default=0)
    successful_extractions = models.IntegerField(default=0)
    eliminations = models.IntegerField(default=0)
    avatar_url = models.URLField(blank=True, null=True)
    
    # Fix ManyToMany field conflicts
    groups = models.ManyToManyField(
        'auth.Group',
        related_name='fogofwar_user_set',
        blank=True,
        help_text='The groups this user belongs to.',
        verbose_name='groups',
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='fogofwar_user_set',
        blank=True,
        help_text='Specific permissions for this user.',
        verbose_name='user permissions',
    )
    
    def __str__(self):
        return f"{self.username} ({self.wallet_address[:8]}...)" if self.wallet_address else self.username