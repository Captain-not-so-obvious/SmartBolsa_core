from django.db import models
from django.contrib.auth.models import User
from apps.financas.models import Carteira

class Ativo(models.Model):
    """(Ex: Ações, FIIS)"""
    TIPO_CHOICES = [
        ('ACAO', 'Ação'),
        ('FII', 'Fundo Imobiliário'),
        ('Cripto', 'Criptomoeda'),
        ('RF', 'Renda Fixa'),
        ('FUNDO', 'Fundo de Investimento'),
    ]

    ticker = models.CharField(max_length=20)
    tipo = models.CharField(max_length=20, choices=TIPO_CHOICES)
    nome = models.CharField(max_length=100)

    cotacao_atual = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)

    def __str__(self):
        return self.ticker
    
class Operacao(models.Model):
    """Compra, Venda ou Proventos"""
    TIPO_OPERACAO = [
        ('COMPRA', 'Compra'),
        ('VENDA', 'Venda'),
        ('DIVIDENDO', 'Recebimento de Dividendo'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    ativo = models.ForeignKey(Ativo, on_delete=models.PROTECT)
    carteira_origem = models.ForeignKey(Carteira, on_delete=models.PROTECT)

    tipo = models.CharField(max_length=20, choices=TIPO_OPERACAO)
    quantidade = models.DecimalField(max_digits=15, decimal_places=8)
    preco_unitario = models.DecimalField(max_digits=15, decimal_places=2)
    custos = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    data = models.DateField

    criado_em = models.DateTimeField(auto_now_add=True)

    def valor_total(self):
        base = self.quantidade * self.preco_unitario
        if self.tipo == 'COMPRA':
            return base + self.custos
        else:
            return base - self.custos
    
    def __str__(self):
        return f"{self.tipo} {self.ativo.ticker} ({self.quantidade})"
