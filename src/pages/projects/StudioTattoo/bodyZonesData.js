// src/pages/projects/StudioTattoo/bodyZonesData.js
// Zonas do corpo do formulário de orçamento. `preposition` guarda a
// concordância de gênero/número certa em português ("no"/"na"/"nas"), usada
// ao montar a frase da mensagem do WhatsApp (ex: "no pescoço", "na mão",
// "nas costas").

export const BODY_ZONES = [
  { id: 'pescoco', name: 'Pescoço', preposition: 'no' },
  { id: 'mao', name: 'Mão', preposition: 'na' },
  { id: 'braco', name: 'Braço', preposition: 'no' },
  { id: 'peito', name: 'Peito', preposition: 'no' },
  { id: 'costas', name: 'Costas', preposition: 'nas' },
  { id: 'pernas', name: 'Pernas', preposition: 'nas' },
  { id: 'pe', name: 'Pé', preposition: 'no' },
];
