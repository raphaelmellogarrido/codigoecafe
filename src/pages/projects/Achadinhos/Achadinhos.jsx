// src/pages/projects/Achadinhos/Achadinhos.jsx
// Layout do projeto Achadinhos: só fornece o AuthProvider (sessão do admin)
// às sub-rotas — catálogo público, login e painel têm cada um o seu próprio
// cabeçalho, por isso não há chrome partilhado aqui.

import { Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import './Achadinhos.css';

export default function Achadinhos() {
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  );
}
