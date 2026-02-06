from django.contrib import admin
from .models import Carteira, Categoria, Transacao

@admin.register(Carteira)
class CarteiraAdmin(admin.ModelAdmin):
    list_display = ('nome', 'user', 'saldo_inicial')

@admin.register(Categoria)
class CategoriaAdmin(admin.ModelAdmin):
    list_display = ('nome', 'tipo', 'user')
    list_filter = ('tipo',)

@admin.register(Transacao)
class TransacaoAdmin(admin.ModelAdmin):
    # Removida a 'descricao', adicionada 'observacao'
    list_display = ('categoria', 'valor', 'data', 'carteira', 'tipo', 'observacao')
    list_filter = ('data', 'tipo', 'carteira', 'categoria')
    search_fields = ('observacao', 'categoria__nome')