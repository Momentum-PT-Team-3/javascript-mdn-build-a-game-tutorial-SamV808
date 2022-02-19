from django import forms
from .models import Score

class ScoreForm(forms.Form):
    initials = forms.CharField(max_length=5)
