// src/main.jsx
// Ponto de entrada da aplicação React.
// ReactDOM.createRoot é a API moderna do React 18 para iniciar a aplicação.
// StrictMode activa avisos adicionais em desenvolvimento para ajudar a identificar problemas.

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './index.css';

// Encontra o elemento <div id="root"> no index.html e monta a aplicação React aí dentro
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
