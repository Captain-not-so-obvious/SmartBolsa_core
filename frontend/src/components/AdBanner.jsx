import { useEffect, useRef } from 'react'

export default function AdBanner({ isPremium, slotId, format = 'auto', style= {} }) {
    // Se for premium, o componente se destrói
    if (isPremium) return null;

    const isDev = import.meta.env.MODE === 'development';

    useEffect(() => {
        if (!isDev) {
            try {
                (window.adsbygoogle = window.adsbygoogle || []).push({});
            } catch (e) {
                console.error("Adsense Error (provavelmente AdBlock):", e);
            }
        }
    }, [isPremium, isDev]);


    // Modo DEV
    if (isDev) {
        return (
            <div className='w-full flex justify-center my-6'>
                <div className='w-full max-w-[728px] h-[90px] bg-brand-dark/30 border border-brand-teal/20 border-dashed rounded-lg flex flex-col items-center justify-center text-brand-mint/40 text-sm p-4 animate-pulse'>
                    <span className='font-bold'>Espaço Publicitário (AdSense)</span>
                    <span className='text-xs mt-1'>Slot ID: {slotId || 'Não definido'}</span>
                    <span className='text-[10px] text-brand-ruby mt-1 uppercase tracking-widest'>Visível apenas para usuários do plano Free</span>
                </div>
            </div>
        )
    }

    // Modo Produção
    return (
        <div className='w-full flex justify-center my-6 overflow-hidden min-h-[90px]'>
            <ins className='adsbygoogle'
                style={{ display: 'block', ...style }}
                data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
                data-ad-slots={slotId}
                data-ad-format={format}
                data-full-width-responsive="true"
            ></ins>
        </div>
    )
}