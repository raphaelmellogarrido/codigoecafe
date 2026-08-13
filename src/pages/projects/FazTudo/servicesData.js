// src/pages/projects/FazTudo/servicesData.js
// Lista de serviços oferecidos na seção "Nossos serviços" da home. Cada
// serviço tem um ícone (react-icons/fa6) usado nos cards selecionáveis.

import {
  FaFaucet,
  FaFan,
  FaDoorClosed,
  FaPaintRoller,
  FaCouch,
  FaLayerGroup,
  FaKey,
  FaBolt,
  FaSink,
  FaLightbulb,
  FaSnowflake,
  FaScrewdriverWrench,
} from 'react-icons/fa6';

export const SERVICES = [
  { id: 'torneira', name: 'Consertar torneira', icon: FaFaucet },
  { id: 'ventilador', name: 'Trocar ventilador', icon: FaFan },
  { id: 'pintar-porta', name: 'Pintar porta', icon: FaDoorClosed },
  { id: 'pintar-parede', name: 'Pintar parede', icon: FaPaintRoller },
  { id: 'montar-movel', name: 'Montar móvel', icon: FaCouch },
  { id: 'prateleira', name: 'Instalar prateleira', icon: FaLayerGroup },
  { id: 'fechadura', name: 'Trocar fechadura', icon: FaKey },
  { id: 'reparo-eletrico', name: 'Reparo elétrico simples', icon: FaBolt },
  { id: 'desentupir-pia', name: 'Desentupir pia', icon: FaSink },
  { id: 'luminaria', name: 'Instalar luminária', icon: FaLightbulb },
  { id: 'ar-condicionado', name: 'Montar/instalar ar-condicionado', icon: FaSnowflake },
  { id: 'reparos-gerais', name: 'Pequenos reparos gerais', icon: FaScrewdriverWrench },
];
