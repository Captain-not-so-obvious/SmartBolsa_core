import { Outlet } from 'react-router-dom'
import Header from '../components/ui/Header'

export default function AppLayout() {
    return (
        <div className='bg-ambient min-h-screen font-sans'>
            <Header />
            <main className='pt-20 px-4 md:px-8 max-w-7xl mx-auto relative z-10 animate-in fade-in duration-500'>
                <Outlet />
            </main>
        </div>
    )
}