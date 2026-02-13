import axios from 'axios';
import { supabase } from './supabase';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use(async (config) => {
    // Pega a sessão atual do Supabase
    const { data: { session } } = await supabase.auth.getSession();

    if (session?.access_token) {
        config.headers.Authorization = `Bearer ${session.access_token}`;
    }

    return config;
}, (error) => {
    return Promise.reject(error);
});

// Se o servidor responder "401 Não Autorizado", a gente desloga o usuário
api.interceptors.response.use((response) => {
    return response;
}, async (error) => {
    if (error.response && error.response.status === 401) {
        // Token venceu ou é inválido -> Desloga e manda pro Login
        await supabase.auth.signOut();
        window.location.href = '/'; 
    }
    return Promise.reject(error);
});

export default api;