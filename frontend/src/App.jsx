import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import AppLayout from './layouts/AppLayout'
import Lancamentos from './pages/Lancamentos'
import Categorias from './pages/Categorias'
import Carteiras from './pages/Carteiras'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/lancamentos" element={<Lancamentos />} />
          <Route path='/categorias' element={<Categorias />} />
          <Route path='/carteiras' element={<Carteiras />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App