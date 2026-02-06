from django.contrib import admin
from .models import Ativo, Operacao

@admin.register(Ativo)
class AtivoAdmin(admin.ModelAdmin):
    list_display = ('ticker', 'nome', 'tipo', 'cotacao_atual')
    search_fields = ('ticker', 'nome')

@admin.register(Operacao)
class OperacaoAdmin(admin.ModelAdmin):
    list_display = ('ativo', 'tipo', 'quantidade', 'preco_unitario', 'data', 'user')
    list_filter = ('tipo', 'ativo__tipo')