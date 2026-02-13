import jwt
from ninja.security import HttpBearer
from django.conf import settings
from django.contrib.auth.models import User

class SupabaseAuth(HttpBearer):
    def authenticate(self, request, token):
        try:
            payload = jwt.decode(
                token,
                settings.SUPABASE_JWT_SECRET,
                algorithms=["HS256"],
                options={"verify_aud": False}
            )

            email = payload.get('email')

            if email:
                # Tenta achar ALGUÉM com esse e-mail (seja admin ou user comum)
                try:
                    user = User.objects.get(email=email)
                    return user
                except User.DoesNotExist:
                    user = User.objects.create_user(
                        username=email,
                        email=email
                    )
                    return user
                except User.MultipleObjectsReturned:
                    return User.objects.filter(email=email).first()
            
            return None
            
        except Exception as e:
            return None