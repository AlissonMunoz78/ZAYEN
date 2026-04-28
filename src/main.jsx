import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Inicializar tema antes de renderizar
const stored = JSON.parse(localStorage.getItem('theme-store') || '{}');
const isDark = stored?.state?.isDark !== false;
if (!isDark) document.documentElement.classList.add('light');

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
