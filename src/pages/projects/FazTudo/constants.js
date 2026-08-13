// src/pages/projects/FazTudo/constants.js
// Dados fixos do projeto: nome do negócio, número de WhatsApp (mesmo usado no
// projeto Pizzaria) e centro/raio da área de atendimento exibida no mapa.

export const BUSINESS_NAME = 'Faz Tudo';
export const BUSINESS_TAGLINE = 'Manutenção Residencial';

export const WHATSAPP_NUMBER = '351913247176';
export const WHATSAPP_NUMBER_DISPLAY = '+351 913 247 176';

export const SERVICE_AREA_CENTER = { lat: -22.9019, lng: -43.2778 };
export const SERVICE_AREA_LABEL = 'Méier, Rio de Janeiro';
export const SERVICE_AREA_RADIUS_KM = 40;

// Bairros/cidades exibidos no footer ("Atendemos em").
export const SERVICE_AREA_NEIGHBORHOODS = [
  'Méier',
  'Lins',
  'Barra',
  'Recreio',
  'Tijuca',
  'Madureira',
  'Niterói',
];

// Links das redes sociais no footer. Facebook/Instagram são placeholders —
// projeto fictício de portfólio.
export const SOCIAL_LINKS = {
  facebook: '#',
  instagram: '#',
};
