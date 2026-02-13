import { useState, useEffect } from 'react'
import { X, Save, Loader2 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import api from '@/services/api'

export default function ModalNovaTransacao({ aoFechar, aoSalvar, transacaoParaEditar }) {
    const [loading, setLoading] = useState(false)
    const [carteiras, setCarteiras] = useState([])
    const [categorias, setCategorias] = useState([])

    // Estado do Formulário
    const [form, setForm] = useState({
        valor: '',
        data: new Date().toISOString().split('T')[0], // Data de hoje
        tipo: 'DESPESA',
        carteira_id: '',
        categoria_id: '',
        observacao: ''
    })

    useEffect(() => {
        if (transacaoParaEditar) {
            setForm({
                valor: transacaoParaEditar.valor,
                data: transacaoParaEditar.data,
                tipo: transacaoParaEditar.tipo,
                carteira_id: transacaoParaEditar.carteira_id,
                categoria_id: transacaoParaEditar.categoria_id,
                observacao: transacaoParaEditar.observacao || ''
            })
        }
    }, [transacaoParaEditar])
    
    // Carrega as listas para o Select
    useEffect(() => {
        async function carregarDados() {
            try {
                const [resCart, resCat] = await Promise.all([
                    api.get('/combos/carteiras'),
                    api.get('/combos/categorias')
                ])
                setCarteiras(resCart.data)
                setCategorias(resCat.data)
            } catch (error) {
                console.error("Erro ao carregar combos:", error)
            }
        }
        carregarDados()
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        if (!form.carteira_id || !form.categoria_id) {
            alert("Por favor, selecione uma carteira e uma categoria.")
            setLoading(false)
            return
        }

        const payload = {
            ...form,
            valor: parseFloat(form.valor),
            carteira_id: parseInt(form.carteira_id),
            categoria_id: parseInt(form.categoria_id),
            pago: true
        }

        try {
            // 3. POST/PUT Simplificados
            if (transacaoParaEditar?.id) {
                // Editando (PUT)
                await api.put(`/transacoes/${transacaoParaEditar.id}`, payload)
            } else {
                // Criando (POST)
                await api.post('/transacoes', payload)
            }

            // Sucesso!
            aoSalvar()
            aoFechar()

        } catch (error) {
            console.error(error)
            alert("Erro ao salvar! Verifique os campos.")
        } finally {
            setLoading(false)
        }
    }

    
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="w-full max-w-md bg-brand-dark border border-brand-teal/30 rounded-xl shadow-2xl p-6 relative">
                
                {/* Cabeçalho */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-brand-sand">
                        {transacaoParaEditar ? 'Editar Transação' : 'Nova Transação'}
                    </h2>
                    <button onClick={aoFechar} className="text-brand-mint/50 hover:text-brand-ruby">
                        <X size={24} />
                    </button>
                </div>

                {/* Formulário */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    
                    {/* Tipo (Receita / Despesa) */}
                    <div className="flex gap-2 p-1 bg-brand-dark/50 rounded-lg border border-brand-teal/20">
                        {['RECEITA', 'DESPESA'].map((tipo) => (
                            <button
                                type="button"
                                key={tipo}
                                onClick={() => setForm({ ...form, tipo })}
                                className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${
                                    form.tipo === tipo
                                        ? (tipo === 'RECEITA' ? 'bg-brand-teal text-brand-dark' : 'bg-brand-ruby text-white')
                                        : 'text-brand-mint/50 hover:text-brand-mint'
                                }`}
                            >
                                {tipo}
                            </button>
                        ))}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs text-brand-mint mb-1 block">Valor (R$)</label>
                            <Input 
                                type="number" step="0.01" required
                                className="bg-brand-dark/50 border-brand-teal/20 text-brand-sand"
                                value={form.valor}
                                onChange={e => setForm({...form, valor: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="text-xs text-brand-mint mb-1 block">Data</label>
                            <Input 
                                type="date" required
                                className="bg-brand-dark/50 border-brand-teal/20 text-brand-sand"
                                value={form.data}
                                onChange={e => setForm({...form, data: e.target.value})}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs text-brand-mint mb-1 block">Carteira</label>
                            <select 
                                required
                                className="w-full h-10 px-3 rounded-md bg-brand-dark/50 border border-brand-teal/20 text-brand-sand text-sm focus:border-brand-teal outline-none"
                                value={form.carteira_id}
                                onChange={e => setForm({...form, carteira_id: e.target.value})}
                            >
                                <option value="">Selecione...</option>
                                {carteiras.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="text-xs text-brand-mint mb-1 block">Categoria</label>
                            <select 
                                required
                                className="w-full h-10 px-3 rounded-md bg-brand-dark/50 border border-brand-teal/20 text-brand-sand text-sm focus:border-brand-teal outline-none"
                                value={form.categoria_id}
                                onChange={e => setForm({...form, categoria_id: e.target.value})}
                            >
                                <option value="">Selecione...</option>
                                {categorias.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="text-xs text-brand-mint mb-1 block">Observação (Opcional)</label>
                        <Input 
                            className="bg-brand-dark/50 border-brand-teal/20 text-brand-sand"
                            placeholder="Ex: Almoço de domingo"
                            value={form.observacao}
                            onChange={e => setForm({...form, observacao: e.target.value})}
                        />
                    </div>

                    <Button type="submit" disabled={loading} className="w-full bg-brand-teal hover:bg-brand-teal/80 text-white font-bold mt-4">
                        {loading ? <Loader2 className="animate-spin mr-2"/> : <Save className="mr-2" size={18}/>}
                        {transacaoParaEditar ? 'Salvar Alterações' : 'Salvar Lançamento'}
                    </Button>

                </form>
            </div>
        </div>
    )
}