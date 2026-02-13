import { useEffect, useState } from "react"
import { Plus, Trash2, Tag, ArrowUpCircle, ArrowDownCircle, Loader2 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import api from '@/services/api'

export default function Categorias() {
    const [categorias, setCategorias] = useState([])
    const [loading, setLoading] = useState(false)
    const [novoNome, setNovoNome] = useState('')
    const [novoTipo, setNovoTipo] = useState('DESPESA')

    useEffect(() => {
        carregarCategorias()
    }, [])

    const carregarCategorias = async () => {
        try {
            const res = await api.get('/categorias')
            setCategorias(res.data)
        } catch (error) {
            console.error("Erro ao carregar categorias:", error)
        }
    }

    const handleSalvar = async (e) => {
        e.preventDefault()
        if (!novoNome) return

        setLoading(true)
        try {
            await api.post('/categorias', {
                nome: novoNome,
                tipo: novoTipo
            })

            setNovoNome('')
            carregarCategorias()
            
        } catch (error) {
            console.error("Erro ao salvar:", error)
            alert("Erro ao salvar categoria.")
        } finally {
            setLoading(false)
        }
    }

    const handleExcluir = async (id) => {
        if (!confirm("Tem certeza? Se houver transações nesta categoria, ela não será excluída.")) return

        try {
            await api.delete(`/categorias/${id}`)
            
            setCategorias(categorias.filter(c => c.id !== id))
        } catch (error) {
            console.error("Erro ao excluir:", error)
            alert("Não foi possível excluir. Verifique se existem lançamentos usando esta categoria.")
        }
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-extrabold text-brand-sand">
                    Minhas Categorias
                </h1>
                <p className="text-brand-mint/60">Personalize os tipos de receitas e despesas</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="glass border-brand-teal/20 h-fit md:col-span-1">
                    <CardHeader>
                        <CardTitle className="text-brand-teal flex items-center gap-2">
                            <Plus size={18} /> Nova Categoria
                        </CardTitle>        
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSalvar} className="space-y-4">
                            <div>
                                <label className="text-xs text-brand-mint mb-1 block">Nome</label>
                                <Input
                                    value={novoNome}
                                    onChange={e => setNovoNome(e.target.value)}
                                    placeholder="Ex: Assinaturas, Mercado..."
                                    className="bg-brand-dark/50 border-brand-teal/20 text-brand-sand"
                                    required
                                />
                            </div>

                            <div className="flex gap-2">
                                {['RECEITA', 'DESPESA'].map((tipo) => (
                                    <button
                                        type="button"
                                        key={tipo}
                                        onClick={() => setNovoTipo(tipo)}
                                        className={`flex-1 py-2 text-xs font-bold rounded-md transition-all border ${
                                            novoTipo === tipo
                                            ? (tipo === 'RECEITA' ? 'bg-brand-teal text-brand-dark border-brand-teal' : 'bg-brand-ruby text-white border-brand-ruby')
                                            : 'text-brand-mint/50 border-brand-mint/20 hover:border-brand-mint/50'
                                        }`}
                                    >
                                        {tipo}
                                    </button>
                                ))}
                            </div>

                            <Button disabled={loading} className="w-full bg-brand-teal hover:bg-brand-teal/80 text-white font-bold">
                                {loading ? <Loader2 className="animate-spin" /> : 'Cadastrar'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
                <Card className="glass border-brand-teal/20 md:col-span-2">
                    <CardHeader>
                        <CardTitle className="text-brand-sand flex items-center gap-2">
                              <Tag size={18} /> Categorias Existentes  
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                                {categorias.length === 0 && (
                                    <p className="text-brand-mint/40 text-center py-8">Nenhuma categoria cadastrada.</p>
                                )}

                                {categorias.map((cat) => (
                                    <div key={cat.id} className="flex items-center justify-between p-3 rounded-lg bg-brand-dark/40 border border-brand-teal/10 hover:border-brand-teal/30 transition-all group">
                                        <div className="flex items-center gap-3">
                                            {cat.tipo === 'RECEITA'
                                                ? <ArrowUpCircle size={20} className="text-brand-teal" />
                                                : <ArrowDownCircle size={20} className="text-brand-ruby" />
                                            }
                                            <span className="text-brand-sand font-medium">{cat.nome}</span>
                                        </div>

                                        <button
                                            onClick={() => handleExcluir(cat.id)}
                                            className="text-brand-mint/30 hover:text-brand-ruby p-2 opacity-0 group-hover:opacity-100 transition-all" title="Excluir Categoria"
                                        >   
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}