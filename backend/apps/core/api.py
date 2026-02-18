from ninja import NinjaAPI, Schema
from apps.core.auth import SupabaseAuth
from apps.financas.api import router as financas_router
from apps.investimentos.api import router as investimentos_router

# 2. INICIALIZA A API PRINCIPAL
api = NinjaAPI(
    title="SmartBolsa API",
    version="1.0.0",
    description="API Financeira Inteligente",
    auth=SupabaseAuth()
)

# 3. REGISTRA OS ROUTERS
api.add_router('', financas_router)
api.add_router('/investimentos', investimentos_router)

# --- ROTAS DO CORE ---

class UserSchema(Schema):
    id: int
    username: str
    email: str
    plano: str

@api.get("/me", response=UserSchema)
def me(request):
    user = request.auth
    return {
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "plano": user.profile.plano
    }

@api.get("/hello", auth=None)
def hello(request):
    return {"message": "Estamos online!"}