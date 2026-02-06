from django.contrib import admin
from .models import Carteira, Categoria, Transacao

@admin.register(Carteira)
class CarteiraAdmin(admin.ModelAdmin):
    list_display = ('nome', 'user', 'criado_em')

@admin.register(Categoria)
class CategoriaAdmin(admin.ModelAdmin):
    list_display = ('nome', 'tipo', 'user')
    list_filter = ('tipo',)

@admin.register(Transacao)
class TransacaoAdmin(admin.ModelAdmin):
    list_display = ('descricao', 'valor', 'data', 'tipo', 'categoria', 'carteira')
    list_filter = ('data', 'tipo', 'carteira')