from ninja import Router, Schema
from typing import List
# from .models import Ativo, Operacao # Vamos usar em breve

router = Router()

@router.get("/ativos")
def listar_ativos(request):
    return {"message": "Módulo de Investimentos em construção!"}