import { useState } from 'react'
import { supabase } from '../services/supabase'
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

export default function Login() {
    const [loading, setLoading] = useState(false)

    const handleGoogleLogin = async () => {
        try {
            setLoading(true)
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: 'http://localhost:5173/dashboard',
                },
            })
            if (error) throw error
        } catch (error) {
            alert('Erro ao logar:' + error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='min-h-screen flex items-center justify-center bg-slate-900 p-4'>
            <Card className="w-full max-w-md bg-slate-800 border-slate-700 text-slate-100">
               <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold text-white">SmartBolsa</CardTitle>
                <CardDescription className="text-slate-400">
                    Entre para gerenciar seus investimentos
                </CardDescription>
                </CardHeader> 
                <CardContent>
                    <div className='grid gap-4'>
                        <Button
                            variant="outline"
                            className="w-full bg-slate-100 text-slate-900 hover:bg-slate-200"
                            onClick={handleGoogleLogin}
                            disabled={loading}
                        >
                            {loading ? 'Redirecionando...' : 'Entrar com Google'}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}