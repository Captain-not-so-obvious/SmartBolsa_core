from django.db import models
from django.contrib.auth.models import User

class Carteira(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='carteiras')
    nome = models.CharField(max_length=100)
    descricao = models.TextField(blank=True, null=True)
    cor = models.CharField(max_length=7, default='#0A9396')
    criado_em = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.nome} ({self.user.username})"
    
class Categoria(models.Model):
    TIPO_CHOICES = [
        ('RECEITA', 'Receita'),
        ('DESPESA', 'Despesa'),
    ]
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='categorias')
    nome = models.CharField(max_length=50)
    tipo = models.CharField(max_length=10, choices=TIPO_CHOICES)
    icone = models.CharField(max_length=50, blank=True, null=True)

    class Meta:
        unique_together = ['user', 'nome', 'tipo']

    def __str__(self):
        return f"{self.nome} - {self.tipo}"
    
class Transacao(models.Model):
    TIPO_CHOICES = [
        ('RECEITA', 'Receita'),
        ('DESPESA', 'Despesa'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='transacoes')
    carteira = models.ForeignKey(Carteira, on_delete=models.CASCADE, related_name='transacoes')
    categoria = models.ForeignKey(Categoria, on_delete=models.SET_NULL, null=True, blank=True)

    descricao = models.CharField(max_length=200)
    valor = models.DecimalField(max_digits=15, decimal_places=2)
    data = models.DateField()
    tipo = models.CharField(max_length=10, choices=TIPO_CHOICES)

    pago = models.BooleanField(default=True)
    observacao = models.TextField(blank=True, null=True)

    criado_em = models.DateTimeField(auto_now_add=True)
    atualizado_em = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-data', '-criado_em']

    def __str__(self):
        return f"{self.descricao} - R$ {self.valor}"
