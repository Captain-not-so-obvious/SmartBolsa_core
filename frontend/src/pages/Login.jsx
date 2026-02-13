import { useState } from 'react'
import { supabase } from '../services/supabase'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function Login() {
  const [loading, setLoading] = useState(false)

  const handleGoogleLogin = async () => {
    try {
      setLoading(true)
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: `${window.location.origin}/dashboard` },
      })
      if (error) throw error
    } catch (error) {
      alert('Erro: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    // AQUI ESTÁ A MÁGICA: Só de colocar 'bg-ambient', as luzes e o fundo aparecem
    <div className='bg-ambient flex items-center justify-center p-4'>
      
      {/* O z-10 é importante para o card ficar ACIMA das luzes */}
      <Card className="relative z-10 w-full max-w-md glass border-brand-teal/20">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-3xl font-extrabold text-brand-sand tracking-tight drop-shadow-md">
            SmartBolsa
          </CardTitle>
          <CardDescription className="text-brand-mint text-base">
            Entre para gerenciar seus investimentos
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className='grid gap-4'>
            <Button
              className="w-full bg-brand-teal hover:bg-brand-mint text-white font-bold h-11 transition-all duration-200 shadow-lg"
              onClick={handleGoogleLogin}
              disabled={loading}
            >
              {loading ? 'Redirecionando...' : 'Entrar com Google'}
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <div className="absolute bottom-4 text-brand-deep text-sm font-medium z-10">
        &copy; 2026 SmartBolsa
      </div>
    </div>
  )
}