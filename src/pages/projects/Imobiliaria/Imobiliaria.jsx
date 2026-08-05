// src/pages/projects/Imobiliaria/Imobiliaria.jsx
// Layout do projeto Imobiliária: só fornece o AuthProvider (sessão do admin)
// às sub-rotas — páginas públicas, login e painel têm cada uma o seu
// próprio cabeçalho, por isso não há chrome partilhado aqui.

import { Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import './Imobiliaria.css';

export default function Imobiliaria() {
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  );
}
