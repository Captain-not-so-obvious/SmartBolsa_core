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
                user, created = User.objects.get_or_create(
                    username=email,
                    defaults={'email': email}
                )
                return user
            
        except Exception as e:
            return None