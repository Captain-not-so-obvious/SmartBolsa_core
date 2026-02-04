import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../services/supabase'
import api from '../services/api'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export default function Dashboard() {
    const navigate = useNavigate()
    const [user, setUser] = useState(null)
    // CORREÇÃO: O nome da função de set deve ser igual ao usado no código
    const [djangoMessage, setDjangoMessage] = useState("Carregando dados...")

    useEffect(() => {
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession()

            if (!session) {
                navigate('/') 
                return
            }

            setUser(session.user)
            callBackend(session.access_token)
        }

        checkSession()
    }, [])

    const callBackend = async (token) => {
        try {
            const response = await api.get('/me', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setDjangoMessage(JSON.stringify(response.data, null, 2))
        } catch (error) {
            console.error("Erro ao conectar com o Django:", error)
            setDjangoMessage("Erro ao conectar com o backend: " + error.message)
        }
    }

    const handleLogout = async () => {
        await supabase.auth.signOut()
        navigate('/')
    }

    return (
        // 1. APLICADO: bg-ambient traz o fundo escuro e as luzes teal/orange
        <div className='bg-ambient min-h-screen p-8'>
            
            {/* 2. APLICADO: relative z-10 garante que o conteúdo fique ACIMA das luzes de fundo */}
            <div className='max-w-4xl mx-auto space-y-6 relative z-10'>
                
                {/* Header com borda mais sutil */}
                <div className='flex justify-between items-center border-b border-brand-teal/30 pb-6'>
                    <h1 className='text-3xl font-extrabold text-brand-sand drop-shadow-sm'>
                        Painel SmartBolsa
                    </h1>
                    <Button 
                        className="bg-brand-wine hover:bg-brand-ruby text-white font-bold shadow-lg transition-all" 
                        onClick={handleLogout}
                    >
                        Sair
                    </Button>
                </div>

                {/* Card do Usuário com efeito GLASS */}
                <Card className="glass border-brand-teal/20 text-brand-mint">
                    <CardHeader>
                        <CardTitle className="text-brand-sand text-xl"> 
                            Dados do Usuário
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <p><span className='font-bold text-white'>Email:</span> {user?.email}</p>
                        <p><span className='font-bold text-white'>ID:</span> {user?.id}</p>
                    </CardContent>
                </Card>

                {/* Card do Backend com efeito GLASS */}
                <Card className="glass border-brand-teal/20">
                    <CardHeader>
                        <CardTitle className="text-brand-teal font-bold">Resposta do Backend</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {/* Box de código com fundo escuro translúcido para leitura */}
                        <pre className='bg-brand-dark/60 backdrop-blur-sm p-4 rounded-lg text-brand-mint font-mono text-sm overflow-auto border border-brand-teal/10 shadow-inner'>
                            {djangoMessage}
                        </pre>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}