// src/pages/projects/JulimarDental/productsData.js
// 20 produtos mockados (2 por categoria), preços em R$. FOTOS DE
// DEMONSTRAÇÃO: reaproveita a mesma foto verificada da categoria (ver
// categoriesData.js) — não existem fotos de banco para cada SKU fictício
// individual. Substituir pelas fotos reais do cliente antes de publicar este
// site para um cliente real.

const IMG = {
  descartaveis: 'https://images.unsplash.com/photo-1748064716276-6fb0fc9da94a?auto=format&fit=crop&w=600&q=75',
  resinas: 'https://images.unsplash.com/photo-1561328635-c1c6ad1753b0?auto=format&fit=crop&w=600&q=75',
  instrumentais: 'https://images.unsplash.com/photo-1606811856475-5e6fcdc6e509?auto=format&fit=crop&w=600&q=75',
  biosseguranca: 'https://images.unsplash.com/photo-1679343758965-4e3f9337e256?auto=format&fit=crop&w=600&q=75',
  ortodontia: 'https://images.unsplash.com/photo-1720685193942-5a1c5ac7fd80?auto=format&fit=crop&w=600&q=75',
  endodontia: 'https://images.unsplash.com/photo-1495573020741-8a2f372bbec3?auto=format&fit=crop&w=600&q=75',
  moldagem: 'https://images.unsplash.com/photo-1473232117216-c950d4ef2e14?auto=format&fit=crop&w=600&q=75',
  clareamento: 'https://images.unsplash.com/photo-1684607632829-1e5bf4f21dab?auto=format&fit=crop&w=600&q=75',
  anestesicos: 'https://images.unsplash.com/photo-1623867821208-c4d8025f8194?auto=format&fit=crop&w=600&q=75',
  equipamentos: 'https://images.unsplash.com/photo-1642844744022-d76a9af3711a?auto=format&fit=crop&w=600&q=75',
};

export const PRODUCTS = [
  { id: 'luva-descartavel-m-100un', name: 'Caixa de Luva Descartável M com 100un', price: 32.0, categoryKey: 'descartaveis', image: IMG.descartaveis },
  { id: 'sugador-descartavel-colorido-40un', name: 'Pacote de Sugador Descartável Colorido 40un', price: 18.5, categoryKey: 'descartaveis', image: IMG.descartaveis },

  { id: 'resina-composta-z100-a2', name: 'Resina Composta Z100 Cor A2', price: 89.9, categoryKey: 'resinas', image: IMG.resinas },
  { id: 'cimento-ionomero-vidro-riva', name: 'Cimento de Ionômero de Vidro Riva', price: 68.0, categoryKey: 'resinas', image: IMG.resinas },

  { id: 'kit-instrumental-basico-dentistica', name: 'Kit de Instrumental Básico para Dentística (5 peças)', price: 189.0, categoryKey: 'instrumentais', image: IMG.instrumentais },
  { id: 'broca-diamantada-1014', name: 'Broca Diamantada 1014 Alta Rotação', price: 12.9, categoryKey: 'instrumentais', image: IMG.instrumentais },

  { id: 'babador-impermeavel-100un', name: 'Babador Impermeável Descartável 100un', price: 28.0, categoryKey: 'biosseguranca', image: IMG.biosseguranca },
  { id: 'mascara-tripla-50un', name: 'Máscara Descartável Tripla Caixa 50un', price: 22.0, categoryKey: 'biosseguranca', image: IMG.biosseguranca },

  { id: 'kit-bracketes-metalicos-roth', name: 'Kit de Bráquetes Metálicos Roth .022', price: 245.0, categoryKey: 'ortodontia', image: IMG.ortodontia },
  { id: 'fio-ortodontico-niti-014', name: 'Fio Ortodôntico Niti Redondo .014', price: 38.0, categoryKey: 'ortodontia', image: IMG.ortodontia },

  { id: 'lima-endodontica-rotatoria-kit6', name: 'Lima Endodôntica Rotatória Kit 6un', price: 168.0, categoryKey: 'endodontia', image: IMG.endodontia },
  { id: 'fio-sutura-nylon-3-0', name: 'Fio de Sutura Nylon 3-0', price: 45.0, categoryKey: 'endodontia', image: IMG.endodontia },

  { id: 'alginato-hydrogum-500g', name: 'Alginato Hydrogum 500g', price: 75.0, categoryKey: 'moldagem', image: IMG.moldagem },
  { id: 'kit-moldagem-silicone-adicao', name: 'Kit de Moldagem Silicone de Adição', price: 289.0, categoryKey: 'moldagem', image: IMG.moldagem },

  { id: 'kit-clareador-peroxido-35', name: 'Kit Clareador Dental Peróxido 35%', price: 165.0, categoryKey: 'clareamento', image: IMG.clareamento },
  { id: 'moldeira-silicone-clareamento', name: 'Moldeira de Silicone para Clareamento', price: 42.0, categoryKey: 'clareamento', image: IMG.clareamento },

  { id: 'anestesico-lidocaina-2-vasoconstritor', name: 'Anestésico Lidocaína 2% com Vasoconstritor', price: 145.0, categoryKey: 'anestesicos', image: IMG.anestesicos },
  { id: 'anestesico-articaina-4-50un', name: 'Anestésico Articaína 4% Caixa 50un', price: 178.0, categoryKey: 'anestesicos', image: IMG.anestesicos },

  { id: 'fotopolimerizador-led-sem-fio', name: 'Fotopolimerizador LED Sem Fio', price: 420.0, categoryKey: 'equipamentos', image: IMG.equipamentos },
  { id: 'autoclave-digital-12l', name: 'Autoclave Digital 12 Litros', price: 1890.0, categoryKey: 'equipamentos', image: IMG.equipamentos },
];

export function getProductById(id) {
  return PRODUCTS.find((product) => product.id === id);
}
