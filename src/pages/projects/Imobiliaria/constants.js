// src/pages/projects/Imobiliaria/constants.js

// Número de demonstração — mesmo formato/placeholder usado nos outros
// projetos do portfólio (não é um número real).
export const WHATSAPP_NUMBER = '351913247176';
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;

export function whatsappUrlForImovel(imovel) {
  const url = typeof window !== 'undefined' ? window.location.href : '';
  const texto = `Olá! Tenho interesse no imóvel "${imovel.nome}". ${url}`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(texto)}`;
}

export const TIPOS_NEGOCIO = [
  { value: 'venda', label: 'Venda' },
  { value: 'arrendamento', label: 'Arrendamento' },
  { value: 'ambos', label: 'Venda ou Arrendamento' },
];

export function tipoLabel(tipo) {
  return TIPOS_NEGOCIO.find((t) => t.value === tipo)?.label || tipo;
}

// Tipologia à portuguesa (T0 = estúdio, T1 = 1 quarto, etc.)
export const TIPOLOGIAS = ['T0', 'T1', 'T2', 'T3', 'T4', 'T5', 'T6+'];

export const RAIOS_KM = [5, 10, 25, 50, 100, 200];

export const MAX_FOTOS = 10;

// Todas as fotos são recortadas para esta proporção/tamanho antes do
// upload, para a galeria ficar sempre uniforme (ver imageCrop.js).
export const FOTO_LARGURA = 1200;
export const FOTO_ALTURA = 900;
