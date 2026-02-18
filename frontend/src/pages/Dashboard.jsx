import { useEffect, useState } from 'react'
import { supabase } from '@/services/supabase'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import { Wallet, ArrowUpCircle, ArrowDownCircle, Loader2 } from 'lucide-react'
import api from '@/services/api'
import AdBanner from '@/components/AdBanner'

export default function Dashboard() {
  const [user, setUser] = useState(null)
  const [isPremium, setIsPremium] = useState(false)
  const [resumo, setResumo] = useState(null)
  const [graficos, setGraficos] = useState(null)
  const [loading, setLoading] = useState(true)

  const formatarMoeda = (valor) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor)
  }

  useEffect(() => {
    const carregarDados = async () => {
      try {
        // 1. Busca dados do usuário e perfil (para saber se é Premium)
        const resMe = await api.get('/me')
        setUser(resMe.data)
        setIsPremium(resMe.data.plano === 'PREMIUM')

        // 2. Busca Resumo
        const resResumo = await api.get('/dashboard/resumo')
        setResumo(resResumo.data)

        // 3. Busca Gráficos
        const resGraficos = await api.get('/dashboard/graficos')
        setGraficos(resGraficos.data)

      } catch (error) {
        console.error("Erro ao buscar dados:", error)
      } finally {
        setLoading(false)
      }
    }

    carregarDados()
  }, [])

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-brand-dark/95 border border-brand-teal/20 p-3 rounded-lg shadow-xl backdrop-blur-md">
          <p className="font-bold text-brand-sand mb-1">{payload[0].name}</p>
          <p className="text-brand-mint text-sm font-mono">
            {formatarMoeda(payload[0].value)}
          </p>
        </div>
      )
    }
    return null
  }

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="w-10 h-10 text-brand-teal animate-spin" />
      </div>
    )
  }

  return (
    <div className='space-y-6 animate-in fade-in duration-700 pb-20'>
      
      {/* --- PROPAGANDA NO TOPO (Só aparece se não for Premium) --- */}
      <AdBanner isPremium={isPremium} slotId="topo-dashboard" />

      {/* 1. CABEÇALHO */}
      <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4'>
        <div>
          <h1 className='text-3xl font-extrabold text-brand-sand'>
            Visão Geral
          </h1>
          <p className='text-brand-mint/60'>
            Olá, {user?.email?.split('@')[0]}
          </p>
        </div>
      </div>

      {/* 2. CARDS DE RESUMO */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        <Card className="glass border-brand-teal/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-brand-mint">Saldo Atual</CardTitle>
            <Wallet className="h-4 w-4 text-brand-teal" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-brand-sand">
              {formatarMoeda(resumo?.saldo_total || 0)}
            </div>
          </CardContent>
        </Card>

        <Card className="glass border-brand-teal/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-brand-mint">Receitas (Mês)</CardTitle>
            <ArrowUpCircle className="h-4 w-4 text-brand-mint" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-brand-mint">
               {formatarMoeda(resumo?.receitas_mes || 0)}
            </div>
          </CardContent>
        </Card>

        <Card className="glass border-brand-wine/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-brand-mint">Despesas (Mês)</CardTitle>
            <ArrowDownCircle className="h-4 w-4 text-brand-ruby" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-brand-ruby">
               - {formatarMoeda(resumo?.despesas_mes || 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* --- PROPAGANDA NO MEIO (Entre cards e gráficos) --- */}
      <AdBanner isPremium={isPremium} slotId="meio-dashboard" />

      {/* 3. GRÁFICOS */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        
        {/* Gráfico de Receitas */}
        <Card className="glass border-brand-teal/20 pb-10">
          <CardHeader>
            <CardTitle className="text-brand-teal">Origem das Receitas</CardTitle>
          </CardHeader>
          <CardContent className="h-[400px]">
            {graficos?.receitas_por_categoria?.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={graficos.receitas_por_categoria}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {graficos.receitas_por_categoria.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend 
                    verticalAlign="bottom" 
                    height={48}
                    iconType="circle" 
                    wrapperStyle={{ color: '#E9D8A6', paddingTop: '20px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-brand-mint/40">
                Sem receitas este mês
              </div>
            )}
          </CardContent>
        </Card>

        {/* Gráfico de Despesas */}
        <Card className="glass border-brand-ruby/20 pb-10">
          <CardHeader>
            <CardTitle className="text-brand-ruby">Categorias de Despesas</CardTitle>
          </CardHeader>
          <CardContent className="h-[400px]">
             {graficos?.despesas_por_categoria?.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={graficos.despesas_por_categoria}
                      cx="50%"
                      cy="50%"
                      innerRadius={80}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                    >
                      {graficos.despesas_por_categoria.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend 
                        verticalAlign="bottom" 
                        height={48} 
                        iconType="circle" 
                        wrapperStyle={{ color: '#E9D8A6', paddingTop: '20px' }} 
                    />
                  </PieChart>
                </ResponsiveContainer>
             ) : (
                <div className="h-full flex items-center justify-center text-brand-mint/40">
                  Sem despesas este mês
                </div>
             )}
          </CardContent>
        </Card>

      </div>
    </div>
  )
}