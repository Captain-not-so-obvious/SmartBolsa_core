from ninja import NinjaAPI, Schema
from django.shortcuts import get_object_or_404
from django.db.models import Sum
from datetime import date
from typing import List, Optional

from apps.financas.models import Carteira, Transacao, Categoria

from apps.core.auth import SupabaseAuth
api = NinjaAPI(
    title="SmartBolsa API",
    version="1.0.0",
    description="API Financeira Inteligente",
    auth=SupabaseAuth()
)

# --- SCHEMAS ---

class DashboardResumo(Schema):
    saldo_total: float
    receitas_mes: float
    despesas_mes: float

class GraficoItem(Schema):
    name: str
    value: float
    color: str

class DashboardGraficos(Schema):
    receitas_por_categoria: List[GraficoItem]
    despesas_por_categoria: List[GraficoItem]

class TransacaoSchema(Schema):
    id: int
    descricao: str
    valor: float
    tipo: str
    data: date
    carteira_id: int
    categoria_id: int
    observacao: Optional[str] = None

class NovaTransacaoSchema(Schema):
    valor: float
    data: date
    tipo: str
    carteira_id: int
    categoria_id: int
    observacao: Optional[str] = None
    pago: bool = True

class ItemSelecao(Schema):
    id: int
    nome: str

class CategoriaSchema(Schema):
    id: int
    nome: str
    tipo: str
    icone: Optional[str] = None

class NovaCategoriaSchema(Schema):
    nome: str
    tipo: str
    icone: Optional[str] = None

class CarteiraSchema(Schema):
    id: int
    nome: str
    saldo_inicial: float
    descricao: Optional[str] = None
    cor: str

class NovaCarteiraSchema(Schema):
    nome: str
    saldo_inicial: float = 0
    descricao: Optional[str] = None
    cor: str = '#0A9396'

# --- ENDPOINTS ---

@api.get("/hello", auth=None)
def hello(request):
    return {"message": "Estamos online, conectados e seguros!"}

@api.get("/dashboard/resumo", response=DashboardResumo)
def get_dashboard_resumo(request):
    user = request.auth # <--- O usuário vem do Token do Supabase

    total_receitas = Transacao.objects.filter(user=user, tipo='RECEITA').aggregate(Sum('valor'))['valor__sum'] or 0
    total_despesas = Transacao.objects.filter(user=user, tipo='DESPESA').aggregate(Sum('valor'))['valor__sum'] or 0
    
    saldo_inicial_carteiras = Carteira.objects.filter(user=user).aggregate(Sum('saldo_inicial'))['saldo_inicial__sum'] or 0
    
    saldo_atual = float(saldo_inicial_carteiras) + float(total_receitas) - float(total_despesas)

    # Resumo do Mês
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
    user = request.auth

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

@api.get("/transacoes", response=List[TransacaoSchema])
def listar_transacoes(request):
    user = request.auth
    qs = Transacao.objects.filter(user=user).select_related('categoria', 'carteira').order_by('-data', '-criado_em')

    resultados = []
    for t in qs:
        resultados.append({
            "id": t.id,
            "descricao": t.categoria.nome,
            "valor": t.valor,
            "tipo": t.tipo,
            "data": t.data,
            "carteira_id": t.carteira.id,
            "categoria_id": t.categoria.id,
            "observacao": t.observacao
        })
    return resultados

@api.post("/transacoes", response={201: TransacaoSchema})
def criar_transacao(request, payload: NovaTransacaoSchema):
    user = request.auth

    carteira = get_object_or_404(Carteira, id=payload.carteira_id, user=user)
    categoria = get_object_or_404(Categoria, id=payload.categoria_id, user=user)

    nova = Transacao.objects.create(
        user=user,
        carteira=carteira,
        categoria=categoria,
        valor=payload.valor,
        data=payload.data,
        tipo=payload.tipo,
        pago=payload.pago,
        observacao=payload.observacao
    )

    return 201, {
        "id": nova.id,
        "descricao": nova.categoria.nome,
        "valor": nova.valor,
        "tipo": nova.tipo,
        "data": nova.data,
        "carteira_id": nova.carteira.id,
        "categoria_id": nova.categoria.id,
        "observacao": nova.observacao
    }

@api.put("/transacoes/{transacao_id}", response=TransacaoSchema)
def atualizar_transacao(request, transacao_id: int, payload: NovaTransacaoSchema):
    user = request.auth
    
    transacao = get_object_or_404(Transacao, id=transacao_id, user=user)
    carteira = get_object_or_404(Carteira, id=payload.carteira_id, user=user)
    categoria = get_object_or_404(Categoria, id=payload.categoria_id, user=user)

    transacao.valor = payload.valor
    transacao.data = payload.data
    transacao.tipo = payload.tipo
    transacao.observacao = payload.observacao
    transacao.carteira = carteira
    transacao.categoria = categoria
    transacao.save()

    return {
        "id": transacao.id,
        "descricao": transacao.categoria.nome,
        "valor": transacao.valor,
        "tipo": transacao.tipo,
        "data": transacao.data,
        "carteira_id": transacao.carteira.id,
        "categoria_id": transacao.categoria.id,
        "observacao": transacao.observacao
    }

@api.delete("/transacoes/{transacao_id}", response={204: None})
def deletar_transacao(request, transacao_id: int):
    user = request.auth
    transacao = get_object_or_404(Transacao, id=transacao_id, user=user)
    transacao.delete()
    return 204, None

# --- COMBOS ---

@api.get("/combos/carteiras", response=List[ItemSelecao])
def listar_carteiras_combo(request):
    user = request.auth
    return Carteira.objects.filter(user=user)

@api.get("/combos/categorias", response=List[ItemSelecao])
def listar_categorias_combo(request):
    user = request.auth
    return Categoria.objects.filter(user=user)

# --- CATEGORIAS ---

@api.get("/categorias", response=List[CategoriaSchema])
def listar_categorias(request):
    user = request.auth
    return Categoria.objects.filter(user=user).order_by('nome')

@api.post("/categorias", response={201: CategoriaSchema})
def criar_categoria(request, payload: NovaCategoriaSchema):
    user = request.auth
    nova = Categoria.objects.create(
        user=user,
        nome=payload.nome,
        tipo=payload.tipo,
        icone=payload.icone
    )
    return 201, nova

@api.delete("/categorias/{cat_id}", response={204: None})
def deletar_categoria(request, cat_id: int):
    user = request.auth
    cat = get_object_or_404(Categoria, id=cat_id, user=user)
    cat.delete()
    return 204, None

# --- CARTEIRAS ---

@api.get("/carteiras", response=List[CarteiraSchema])
def listar_carteiras(request):
    user = request.auth
    return Carteira.objects.filter(user=user)

@api.post("/carteiras", response={201: CarteiraSchema})
def criar_carteira(request, payload: NovaCarteiraSchema):
    user = request.auth
    nova = Carteira.objects.create(
        user=user,
        nome=payload.nome,
        saldo_inicial=payload.saldo_inicial,
        descricao=payload.descricao,
        cor=payload.cor
    )
    return 201, nova

@api.put("/carteiras/{carteira_id}", response=CarteiraSchema)
def atualizar_carteira(request, carteira_id: int, payload: NovaCarteiraSchema):
    user = request.auth
    carteira = get_object_or_404(Carteira, id=carteira_id, user=user)

    carteira.nome = payload.nome
    carteira.saldo_inicial = payload.saldo_inicial
    carteira.descricao = payload.descricao
    carteira.cor = payload.cor
    carteira.save()

    return carteira

@api.delete("/carteiras/{carteira_id}", response={204: None})
def deletar_carteira(request, carteira_id: int):
    user = request.auth
    carteira = get_object_or_404(Carteira, id=carteira_id, user=user)
    carteira.delete()
    return 204, None