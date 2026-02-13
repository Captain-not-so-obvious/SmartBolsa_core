import { useEffect, useState } from 'react'
import { Wallet, Trash2, Edit, Save, Plus, Loader2 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const PALETA_CORES = [
    '#0A9396', '#EE9B00', '#94D2BD', '#BB3E03', '#AE2012', '#005F73', '#6B705C', '#3F37C9'
]

export default function Carteiras() {
    const [carteiras, setCarteiras] = useState([])
    const [loading, setLoading] = useState(false)
    const [editandoId, setEditandoId] = useState(null)

    // Estado do Formulário
    const [form, setForm] = useState({
        nome: '',
        saldo_inicial: '',
        descricao: '',
        cor: '#0A9396'
    })

    useEffect(() => {
        carregarCarteiras()
    }, [])

    const carregarCarteiras = async () => {
        const baseUrl = import.meta.env.VITE_API_URL
        const res = await fetch(`${baseUrl}/carteiras`)
        const data = await res.json()
        setCarteiras(data)
    }

    const resetForm = () => {
        setForm({ nome: '', saldo_inicial: '', descricao: '', cor: '#0A9396' })
        setEditandoId(null)
    }

    const preencherEdicao = (carteira) => {
        setForm({
            nome: carteira.nome,
            saldo_inicial: carteira.saldo_inicial,
            descricao: carteira.descricao || '',
            cor: carteira.cor
        })
        setEditandoId(carteira.id)
    }

    const handleSalvar = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            const baseUrl = import.meta.env.VITE_API_URL
            const url = editandoId ? `${baseUrl}/carteiras/${editandoId}` : `${baseUrl}/carteiras`
            const method = editandoId ? 'PUT' : 'POST'

            const res = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...form,
                    saldo_inicial: parseFloat(form.saldo_inicial) || 0
                })
            })

            if (res.ok) {
                carregarCarteiras()
                resetForm()
            }
        } catch (error) {
            console.error("Erro:", error)
        } finally {
            setLoading(false)
        }
    }

    const handleExcluir = async (id) => {
        if (!confirm("CUIDADO: Ao excluir esta carteira, TODAS as transações vinculadas a ela serão apagadas permanentemente. Deseja continuar?")) return

        try {
            const baseUrl = import.meta.env.VITE_API_URL
            await fetch(`${baseUrl}/carteiras/${id}`, { method: 'DELETE' })
            setCarteiras(carteiras.filter(c => c.id !== id))
        } catch (error) {
            console.error("Erro:", error)
        }
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-extrabold text-brand-sand">Minhas Carteiras</h1>
                <p className="text-brand-mint/60">Gerencie suas contas bancárias e dinheiro físico</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* 1. FORMULÁRIO (Coluna Esquerda) */}
                <Card className="glass border-brand-teal/20 h-fit lg:col-span-1">
                    <CardHeader>
                        <CardTitle className="text-brand-teal flex items-center gap-2">
                            {editandoId ? <Edit size={18} /> : <Plus size={18} />}
                            {editandoId ? 'Editar Carteira' : 'Nova Carteira'}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSalvar} className="space-y-4">
                            <div>
                                <label className="text-xs text-brand-mint mb-1 block">Nome da Carteira</label>
                                <Input 
                                    value={form.nome}
                                    onChange={e => setForm({...form, nome: e.target.value})}
                                    placeholder="Ex: Nubank, Carteira Física..."
                                    className="bg-brand-dark/50 border-brand-teal/20 text-brand-sand"
                                    required
                                />
                            </div>

                            <div>
                                <label className="text-xs text-brand-mint mb-1 block">Saldo Inicial (R$)</label>
                                <Input 
                                    type="number" step="0.01"
                                    value={form.saldo_inicial}
                                    onChange={e => setForm({...form, saldo_inicial: e.target.value})}
                                    placeholder="Quanto tem lá hoje?"
                                    className="bg-brand-dark/50 border-brand-teal/20 text-brand-sand"
                                />
                                <p className="text-[10px] text-brand-mint/40 mt-1">O saldo será ajustado conforme seus lançamentos.</p>
                            </div>

                            <div>
                                <label className="text-xs text-brand-mint mb-1 block">Cor da Identificação</label>
                                <div className="flex flex-wrap gap-2 p-2 bg-brand-dark/30 rounded-lg border border-brand-teal/10">
                                    {PALETA_CORES.map(cor => (
                                        <button
                                            key={cor}
                                            type="button"
                                            onClick={() => setForm({...form, cor})}
                                            className={`w-6 h-6 rounded-full transition-all hover:scale-110 ${form.cor === cor ? 'ring-2 ring-white scale-110' : ''}`}
                                            style={{ backgroundColor: cor }}
                                        />
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="text-xs text-brand-mint mb-1 block">Descrição (Opcional)</label>
                                <Input 
                                    value={form.descricao}
                                    onChange={e => setForm({...form, descricao: e.target.value})}
                                    className="bg-brand-dark/50 border-brand-teal/20 text-brand-sand"
                                />
                            </div>

                            <div className="flex gap-2">
                                {editandoId && (
                                    <Button type="button" variant="outline" onClick={resetForm} className="border-brand-ruby/50 text-brand-ruby hover:bg-brand-ruby/10">
                                        Cancelar
                                    </Button>
                                )}
                                <Button disabled={loading} className="flex-1 bg-brand-teal hover:bg-brand-teal/80 text-white font-bold">
                                    {loading ? <Loader2 className="animate-spin" /> : 'Salvar Carteira'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                {/* 2. LISTA DE CARTEIRAS (Cards) */}
                <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {carteiras.length === 0 && (
                        <div className="col-span-full text-center py-10 text-brand-mint/40 glass rounded-xl border border-dashed border-brand-teal/20">
                            Nenhuma carteira cadastrada. Adicione uma ao lado!
                        </div>
                    )}

                    {carteiras.map((item) => (
                        <div key={item.id} className="relative group overflow-hidden rounded-xl bg-gradient-to-br from-brand-dark to-brand-dark/90 border border-brand-teal/20 hover:border-brand-teal/50 transition-all hover:shadow-lg hover:shadow-brand-teal/10 p-6">
                            {/* Barra de Cor Lateral */}
                            <div className="absolute left-0 top-0 bottom-0 w-2" style={{ backgroundColor: item.cor }} />
                            
                            <div className="pl-4 flex justify-between items-start">
                                <div>
                                    <h3 className="text-xl font-bold text-brand-sand">{item.nome}</h3>
                                    <p className="text-xs text-brand-mint/60 mb-4">{item.descricao || 'Sem descrição'}</p>
                                    
                                    <div className="space-y-1">
                                        <p className="text-[10px] uppercase tracking-wider text-brand-mint/50">Saldo Inicial</p>
                                        <p className="text-lg font-mono text-brand-teal">
                                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.saldo_inicial)}
                                        </p>
                                    </div>
                                </div>
                                
                                <Wallet className="text-brand-mint/10 group-hover:text-brand-teal/20 transition-colors" size={48} />
                            </div>

                            {/* Ações (Aparecem no Hover) */}
                            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => preencherEdicao(item)} className="p-2 bg-brand-dark/80 hover:bg-brand-teal text-brand-mint hover:text-white rounded-full transition-colors shadow-lg">
                                    <Edit size={14} />
                                </button>
                                <button onClick={() => handleExcluir(item.id)} className="p-2 bg-brand-dark/80 hover:bg-brand-ruby text-brand-mint hover:text-white rounded-full transition-colors shadow-lg">
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    )
}