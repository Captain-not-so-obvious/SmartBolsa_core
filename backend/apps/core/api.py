from ninja import NinjaAPI
from .auth import SupabaseAuth

api = NinjaAPI(auth=SupabaseAuth())

@api.get("/me")
def me(request):
    return {
        "usuario": request.auth.username,
        "email": request.auth.email,
        "mensagem": "Você está autenticado no Backend Django!"
    }