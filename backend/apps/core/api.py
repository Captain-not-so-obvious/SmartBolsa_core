from ninja import NinjaAPI, Schema
from django.shortcuts import get_object_or_404
from django.db.models import Sum
from datetime import date
from typing import List

# IMPORTS IMPORTANTES QUE FALTAVAM
from apps.financas.models import Carteira, Transacao

api = NinjaAPI(
    title="SmartBolsa API",
    version="1.0.0",
    description="API Financeira Inteligente"
)

# --- SCHEMAS ---

class DashboardResumo(Schema):
    saldo_total: float
    receitas_mes: float
    despesas_mes: float

class GraficoItem(Schema):
    name: str   # Mudei de 'nome' para 'name' (padrão Recharts)
    value: float # Mudei de 'valor' para 'value'
    color: str

class DashboardGraficos(Schema):
    receitas_por_categoria: List[GraficoItem]
    despesas_por_categoria: List[GraficoItem]

# --- ENDPOINTS ---

@api.get("/dashboard/resumo", response=DashboardResumo)
def get_dashboard_resumo(request):
    from django.contrib.auth.models import User
    # CORREÇÃO: is_authenticated (tinha um typo)
    user = request.user if request.user.is_authenticated else User.objects.first()

    # CORREÇÃO: Django usa dois underlines (valor__sum)
    total_receitas = Transacao.objects.filter(user=user, tipo='RECEITA').aggregate(Sum('valor'))['valor__sum'] or 0
    total_despesas = Transacao.objects.filter(user=user, tipo='DESPESA').aggregate(Sum('valor'))['valor__sum'] or 0
    
    saldo_inicial_carteiras = Carteira.objects.filter(user=user).aggregate(Sum('saldo_inicial'))['saldo_inicial__sum'] or 0
    
    saldo_atual = float(saldo_inicial_carteiras) + float(total_receitas) - float(total_despesas)

    # 2. Resumo do Mês
    hoje = date.today()
    transacoes_mes = Transacao.objects.filter(
        user=user, 
        data__year=hoje.year, 
        data__month=hoje.month
    )

    receitas_mes = transacoes_mes.filter(tipo='RECEITA').aggregate(Sum('valor'))['valor__sum'] or 0
    despesas_mes = transacoes_mes.filter(tipo='DESPESA').aggregate(Sum('valor'))['valor__sum'] or 0

    return {
        "saldo_total": saldo_atual,
        "receitas_mes": receitas_mes,
        "despesas_mes": despesas_mes
    }

@api.get("/dashboard/graficos", response=DashboardGraficos)
def get_dashboard_graficos(request):
    from django.contrib.auth.models import User
    user = request.user if request.user.is_authenticated else User.objects.first()

    # Paleta de cores SmartBolsa
    CORES = ['#0A9396', '#EE9B00', '#94D2BD', '#BB3E03', '#E9D8A6', '#AE2012', '#005F73', '#CA6702']

    def agrupar_por_categoria(tipo_transacao):
        dados = Transacao.objects.filter(user=user, tipo=tipo_transacao)\
            .values('categoria__nome')\
            .annotate(total=Sum('valor'))\
            .order_by('-total')
        
        resultado = []
        for i, item in enumerate(dados):
            resultado.append({
                "name": item['categoria__nome'],
                "value": item['total'],
                "color": CORES[i % len(CORES)]
            })
        return resultado

    return {
        "receitas_por_categoria": agrupar_por_categoria('RECEITA'),
        "despesas_por_categoria": agrupar_por_categoria('DESPESA')
    }

@api.get("/hello")
def hello(request):
    return {"message": "Estamos online e conectados!"}