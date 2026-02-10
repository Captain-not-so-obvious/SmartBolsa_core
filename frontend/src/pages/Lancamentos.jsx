import { useEffect, useState } from "react"
import { Plus, Search, Filter, ArrowUpCircle, ArrowDownCircle, Trash2, Trash } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import ModalNovaTransacao from "@/components/ModalNovaTransacao"

export default function Lancamentos() {
    const [transacoes, setTransacoes] = useState([])
    const [loading, setLoading] = useState(true)
    const [busca, setBusca] = useState('')
    const [modalAberto, setModalAberto] = useState(false)

    const formatarData = (dataString) => {
        const [ano, mes, dia] = dataString.split('-')
        return `${dia}/${mes}/${ano}`
    }

    const formatarMoeda = (valor) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor)
    }

    useEffect(() => {
        carregarTransacoes()
    }, [])

    const carregarTransacoes = async () => {
        try {
            const baseUrl = import.meta.env.VITE_API_URL
            const res = await fetch(`${baseUrl}/transacoes`) 
            
            const data = await res.json()
            setTransacoes(data)
        } catch (error) {
            console.error("Erro ao buscar:", error)
        } finally {
            setLoading(false)
        }
    }

    const transacoesFiltradas = transacoes.filter(t => 
        t.descricao.toLowerCase().includes(busca.toLowerCase()) || 
        (t.observacao && t.observacao.toLowerCase().includes(busca.toLowerCase()))
    )

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-brand-sand">Lançamentos</h1>
                    <p className="text-brand-mint/60">Informe suas Receitas e Despesas</p>
                </div>
                <Button
                onClick={() => setModalAberto(true)}
                className="bg-brand-teal hover:bg-brand-teal/80 text-white shadow-lg shadow-brand-teal/20">
                <Plus size={20} className="mr-2" /> Novo Lançamento
                </Button>
            </div>

            {/* Barra de Ferramentas */}
            <div className="flex gap-2">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-mint/50" />
                    <Input
                        placeholder="Buscar lançamentos..."
                        className="pl-9 bg-brand-dark/50 border-brand-teal/20 text-brand-mint placeholder:text-brand-mint/30 focus:border-brand-teal"
                        value={busca}
                        onChange={(e) => setBusca(e.target.value)}
                    />
                </div>
                {/* <Button variant="outline" className="border-brand-teal/20 text-brand-mint hover:bg-brand-teal/10 hover:text-brand-sand">
                    <Filter size={16} className="mr-2" /> Filtros
                </Button> */}
            </div>

            {/* Tabela de Transações */}
            <Card className="glass border-brand-teal/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-brand-mint uppercase bg-brand-teal/10 border-b border-brand-teal/20">
              <tr>
                <th className="px-6 py-4 font-bold">Data</th>
                <th className="px-6 py-4 font-bold">Categoria / Descrição</th>
                <th className="px-6 py-4 font-bold">Valor</th>
                <th className="px-6 py-4 font-bold text-center">Tipo</th>
                <th className="px-6 py-4 font-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-teal/10">
              {transacoesFiltradas.length > 0 ? (
                transacoesFiltradas.map((item) => (
                  <tr key={item.id} className="hover:bg-brand-teal/5 transition-colors group">
                    <td className="px-6 py-4 text-brand-mint/80 font-mono">
                      {formatarData(item.data)}
                    </td>
                    <td className="px-6 py-4 font-medium text-brand-sand">
                      <div>{item.descricao}</div>
                      {item.observacao && (
                        <div className="text-xs text-brand-mint/50 font-normal">{item.observacao}</div>
                      )}
                    </td>
                    <td className={`px-6 py-4 font-bold ${item.tipo === 'RECEITA' ? 'text-brand-teal' : 'text-brand-ruby'}`}>
                      {item.tipo === 'DESPESA' ? '- ' : '+ '}
                      {formatarMoeda(item.valor)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                        item.tipo === 'RECEITA' 
                          ? 'bg-brand-teal/10 text-brand-teal border-brand-teal/20' 
                          : 'bg-brand-ruby/10 text-brand-ruby border-brand-ruby/20'
                      }`}>
                        {item.tipo === 'RECEITA' ? <ArrowUpCircle size={12}/> : <ArrowDownCircle size={12}/>}
                        {item.tipo}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-brand-mint/40 hover:text-brand-ruby transition-colors p-1 opacity-0 group-hover:opacity-100">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-brand-mint/40">
                    Nenhuma transação encontrada.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
      {modalAberto && (
        <ModalNovaTransacao 
            aoFechar={() => setModalAberto(false)}
            aoSalvar={() => {
                carregarTransacoes()
            }}
        />
    )}
    </div>
  )
}