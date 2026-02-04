/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ["class"],
    content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // Define Inter como a fonte padrão
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        // --- SUA PALETA PERSONALIZADA ---
        brand: {
          dark: '#001219',      // Fundo Principal
          deep: '#005F73',      // Fundo Secundário / Cards
          teal: '#0A9396',      // Ações Primárias / Botões
          mint: '#94D2BD',      // Detalhes / Texto Suave
          sand: '#E9D8A6',      // Texto de destaque / Ícones
          gold: '#EE9B00',      // Avisos
          orange: '#CA6702',    // Alertas
          rust: '#BB3E03',      // Perigo suave
          ruby: '#AE2012',      // Erro
          wine: '#9B2226',      // Erro Crítico / Botão Sair
        },
        // Mantendo compatibilidade com shadcn (opcional, mas bom ter)
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}