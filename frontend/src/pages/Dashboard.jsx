import { useEffect, useState } from 'react'
import { supabase } from '@/services/supabase'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import { Wallet, ArrowUpCircle, ArrowDownCircle, Loader2 } from 'lucide-react'

export default function Dashboard() {
  const [user, setUser] = useState(null)
  const [resumo, setResumo] = useState(null) // Estado para Cards
  const [graficos, setGraficos] = useState(null) // Estado para Gráficos
  const [loading, setLoading] = useState(true) // Estado de Carregamento

  // Formatador de Dinheiro (R$ 1.000,00)
  const formatarMoeda = (valor) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor)
  }

  useEffect(() => {
    const carregarDados = async () => {
      try {
        // 1. Pega usuário logado
        const { data: { user } } = await supabase.auth.getUser()
        setUser(user)

        // 2. Busca Resumo (Saldo, Receitas, Despesas)
        // Nota: No futuro usaremos token JWT, por enquanto o backend pega o primeiro user
        const resResumo = await fetch('http://127.0.0.1:8000/api/dashboard/resumo')
        const dadosResumo = await resResumo.json()
        setResumo(dadosResumo)

        // 3. Busca Dados dos Gráficos
        const baseUrl = import.meta.env.VITE_API_URL
        const resGraficos = await fetch(`${baseUrl}/dashboard/graficos`)
        const dadosGraficos = await resGraficos.json()
        setGraficos(dadosGraficos)

      } catch (error) {
        console.error("Erro ao buscar dados:", error)
      } finally {
        setLoading(false)
      }
    }

    carregarDados()
  }, [])

  // Componente Tooltip Customizado
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
    <div className='space-y-6 animate-in fade-in duration-700'>
      
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

      {/* 2. CARDS DE RESUMO (DADOS REAIS) */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        {/* Card Saldo */}
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

        {/* Card Receitas */}
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

        {/* Card Despesas */}
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

      {/* 3. GRÁFICOS (DADOS REAIS) */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        
        {/* Gráfico de Receitas */}
        <Card className="glass border-brand-teal/20">
          <CardHeader>
            <CardTitle className="text-brand-teal">Origem das Receitas</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            {graficos?.receitas_por_categoria?.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={graficos.receitas_por_categoria}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {graficos.receitas_por_categoria.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ color: '#E9D8A6' }} />
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
        <Card className="glass border-brand-ruby/20">
          <CardHeader>
            <CardTitle className="text-brand-ruby">Categorias de Despesas</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
             {graficos?.despesas_por_categoria?.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={graficos.despesas_por_categoria}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                    >
                      {graficos.despesas_por_categoria.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ color: '#E9D8A6' }} />
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