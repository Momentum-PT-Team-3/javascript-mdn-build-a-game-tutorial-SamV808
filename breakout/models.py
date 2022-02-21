from django.db import models

class Score(models.Model):
    points = models.IntegerField()
    player = models.CharField(max_length=3)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.player}: {self.points} [TIMESTAMP: {self.timestamp}]'

    @property
    def calculate_high_score(self):
        pass


