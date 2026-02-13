import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, ChevronDown, User, LogOut, Wallet, LayoutDashboard, PieChart } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { supabase } from '@/services/supabase'

const menuItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    {
        label: 'Finanças',
        icon: Wallet,
        submenu: [
            { label: 'Minhas Carteiras', path: '/carteiras' },
            { label: 'Meus Lançamentos', path: '/lancamentos' },
            { label: 'Minhas Categorias', path: '/categorias' },
        ]
    },
    { label: 'Meus Investimentos', path: '/investimentos', icon: PieChart },
]

export default function Header() {
    const [vMobile, setVMobile] = useState(false)
    const [subMenuAtivo, setSubMenuAtivo] = useState(null)
    const localizacao = useLocation()

    const handleLogout = async () => {
        await supabase.auth.signOut()
        window.location.href = "/"
    }

    const linkAtivo = (path) => localizacao.pathname === path

    return (
        <>
            {/* HEADER PRINCIPAL */}
            <header className='fixed top-0 left-0 w-full z-50 glass border-b border-brand-teal/20 h-16 transition-all duration-300'>
                <div className='max-w-7xl mx-auto px-4 h-full flex items-center justify-between'>
                    
                    {/* LOGO */}
                    <Link to="/dashboard" className='flex items-center gap-2'>
                        <div className='w-8 h-8 bg-brand-teal rounded-lg flex items-center justify-center shadow-lg shadow-brand-teal/20'>
                            <span className='text-white font-extrabold text-xl'>S</span>
                        </div>
                        <span className='text-xl font-extrabold text-brand-sand tracking-tight hidden sm:block'>
                            SmartBolsa
                        </span>
                    </Link>

                    {/* Menu Desktop */}
                    <nav className='hidden md:flex items-center gap-1'>
                        {menuItems.map((item, index) => (
                            <div key={index} className='relative group'>
                                {item.submenu ? (
                                    <button className="flex items-center gap-1 px-4 py-2 text-brand-mint hover:text-brand-teal font-medium transition-colors group">
                                        <item.icon size={18} />
                                        {item.label}
                                        <ChevronDown size={14} className='group-hover:rotate-180 transition-transform' />

                                        {/* Dropdown */}
                                        <div className='absolute top-full left-0 mt-2 w-48 bg-brand-dark/95 backdrop-blur-xl border border-brand-teal/20 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0'>
                                            <div className='py-2'>
                                                {item.submenu.map((sub, subIndex) => (
                                                    <Link
                                                        key={subIndex}
                                                        to={sub.path}
                                                        className='block px-4 py-2 text-sm text-brand-mint hover:bg-brand-teal/10 hover:text-brand-sand transition-colors'
                                                    >
                                                        {sub.label}
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    </button>
                                ) : (
                                    <Link
                                        to={item.path}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
                                            linkAtivo(item.path)
                                                ? 'bg-brand-teal/10 text-brand-teal font-bold'
                                                : 'text-brand-mint hover:text-brand-teal hover:bg-brand-teal/5'
                                        }`}
                                    >
                                        <item.icon size={18} />
                                        {item.label}
                                    </Link>
                                )}
                            </div>
                        ))}
                    </nav>

                    {/* Perfil e Mobile Toggle */}
                    <div className='flex items-center gap-3'>
                        {/* Avatar / Logout (Desktop) */}
                        <div className='hidden md:flex items-center gap-3 pl-4 border-l border-brand-teal/20'>
                            <span className='text-xs text-brand-mint/60'>Seja bem-vindo!</span>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={handleLogout}
                                className="text-brand-wine hover:text-brand-ruby hover:bg-brand-wine/10"
                            >
                                <LogOut size={20} />
                            </Button>
                        </div>

                        {/* Botão Hambúrguer */}
                        <button
                            className='md:hidden text-brand-sand p-2'
                            onClick={() => setVMobile(!vMobile)}
                        >
                            {vMobile ? <X /> : <Menu />}
                        </button>
                    </div>
                </div>
            </header>

            {/* Drawer para versão mobile */}
            {vMobile && (
                <div className='fixed inset-0 z-40 md:hidden pt-20 px-6 bg-brand-dark/95 backdrop-blur-xl animate-in slide-in-from-top-10'>
                    <nav className='flex flex-col gap-4'>
                        {menuItems.map((item, index) => (
                            <div key={index}>
                                {item.submenu ? (
                                    <div className='space-y-2'>
                                        <div className='flex items-center gap-2 text-brand-sand font-bold text-lg pb-2 border-b border-brand-teal/10'>
                                            <item.icon size={20} /> {item.label}
                                        </div>
                                        <div className='pl-6 flex flex-col gap-3'>
                                            {item.submenu.map((sub, subIndex) => (
                                                <Link
                                                    key={subIndex}
                                                    to={sub.path}
                                                    onClick={() => setVMobile(false)}
                                                    className='text-brand-mint py-2 hover:text-brand-teal block'
                                                >
                                                    {sub.label}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <Link
                                        to={item.path}
                                        onClick={() => setVMobile(false)}
                                        className='flex items-center gap-2 text-lg font-medium text-brand-mint hover:text-brand-teal py-2 border-b border-brand-teal/10'
                                    >
                                        <item.icon size={20} /> {item.label}
                                    </Link>
                                )}
                            </div>
                        ))}

                        <Button
                            className="mt-6 w-full bg-brand-wine hover:bg-brand-ruby text-white"
                            onClick={handleLogout}
                        >
                            <LogOut size={16} className='mr-2' /> Sair
                        </Button>
                    </nav>
                </div>
            )}
        </>
    )
}