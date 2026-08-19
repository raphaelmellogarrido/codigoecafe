// src/pages/projects/BragaRemodelacao/QuoteForm.jsx
// Formulário de orçamento (secção #orcamento). Sem backend: ao submeter,
// monta uma mensagem com os dados preenchidos e abre o WhatsApp numa nova
// aba — não existe um "envio" real, por isso não há mensagem de sucesso
// fake, só uma nota a avisar que o WhatsApp vai abrir.
//
// `preselectedType` (vindo dos cards de Serviços, ver BragaRemodelacaoHome.jsx)
// pré-seleciona o campo "Tipo de remodelação" quando o visitante clica
// "Saber mais" num serviço específico.

import { useEffect, useState } from 'react';
import { FaWhatsapp } from 'react-icons/fa6';
import { buildQuoteMessage, buildWhatsappUrl } from './whatsapp';

const QUOTE_TYPES = [
  { value: 'apartamentos', label: 'Apartamento' },
  { value: 'moradias', label: 'Moradia' },
  { value: 'cozinhas', label: 'Cozinha' },
  { value: 'casas-banho', label: 'Casa de Banho' },
  { value: 'pintura', label: 'Pintura e Acabamentos' },
  { value: 'completa', label: 'Remodelação Completa' },
  { value: 'outro', label: 'Outro' },
];

const START_OPTIONS = [
  { value: 'imediato', label: 'O quanto antes' },
  { value: '3-meses', label: 'Nos próximos 3 meses' },
  { value: 'planeando', label: 'Ainda estou a planear' },
];

const INITIAL_FORM = { nome: '', telefone: '', email: '', localidade: '', tipo: '', inicio: '', mensagem: '' };

export default function QuoteForm({ preselectedType, selectionKey }) {
  const [form, setForm] = useState(INITIAL_FORM);

  // selectionKey is not read directly — it's a second dependency purely so
  // this effect re-fires even when the user clicks the same service twice
  // in a row (setting selectedServiceId to an identical primitive value
  // would otherwise make React bail out of the re-render, and this effect
  // would never re-run to re-sync the dropdown).
  useEffect(() => {
    if (preselectedType) {
      setForm((prev) => ({ ...prev, tipo: preselectedType }));
    }
  }, [preselectedType, selectionKey]);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    const tipoLabel = QUOTE_TYPES.find((option) => option.value === form.tipo)?.label ?? '';
    const inicioLabel = START_OPTIONS.find((option) => option.value === form.inicio)?.label ?? '';

    const message = buildQuoteMessage({
      nome: form.nome,
      telefone: form.telefone,
      email: form.email,
      localidade: form.localidade,
      tipoLabel,
      inicioLabel,
      mensagem: form.mensagem,
    });

    // window.open (em vez de um <a href> normal) porque isto corre dentro do
    // handler de submit de um <form>, não de um clique direto num link — mas
    // continua a ser uma resposta síncrona a um gesto do utilizador, por
    // isso não é bloqueado como pop-up pelos browsers.
    window.open(buildWhatsappUrl(message), '_blank', 'noopener,noreferrer');
  }

  return (
    <section id="orcamento" className="brm-quote section">
      <div className="container brm-quote-inner">
        <div className="brm-quote-intro">
          <span className="brm-eyebrow">Peça já o seu orçamento</span>
          <h2 className="brm-section-title">Pedir Orçamento Gratuito</h2>
          <p className="brm-section-subtitle">
            Preencha os seus dados — vai abrir o WhatsApp com a mensagem já preenchida para
            conversarmos sobre o seu projeto.
          </p>
        </div>

        <form className="brm-quote-form" onSubmit={handleSubmit}>
          <div className="brm-form-row">
            <label className="brm-field">
              <span>Nome*</span>
              <input type="text" name="nome" value={form.nome} onChange={handleChange} required />
            </label>
            <label className="brm-field">
              <span>Telefone*</span>
              <input type="tel" name="telefone" value={form.telefone} onChange={handleChange} required />
            </label>
          </div>

          <div className="brm-form-row">
            <label className="brm-field">
              <span>Email</span>
              <input type="email" name="email" value={form.email} onChange={handleChange} />
            </label>
            <label className="brm-field">
              <span>Localidade</span>
              <input type="text" name="localidade" value={form.localidade} onChange={handleChange} />
            </label>
          </div>

          <div className="brm-form-row">
            <label className="brm-field">
              <span>Tipo de remodelação*</span>
              <select name="tipo" value={form.tipo} onChange={handleChange} required>
                <option value="" disabled>
                  Escolha uma opção
                </option>
                {QUOTE_TYPES.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="brm-field">
              <span>Quando pretende iniciar?</span>
              <select name="inicio" value={form.inicio} onChange={handleChange}>
                <option value="" disabled>
                  Escolha uma opção
                </option>
                {START_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label className="brm-field">
            <span>Mensagem</span>
            <textarea name="mensagem" value={form.mensagem} onChange={handleChange} rows={4} />
          </label>

          <button type="submit" className="brm-btn brm-btn-primary brm-quote-submit">
            <FaWhatsapp aria-hidden="true" />
            Pedir Orçamento Gratuito
          </button>
          <p className="brm-quote-note">Vai abrir o WhatsApp com os seus dados já preenchidos.</p>
        </form>
      </div>
    </section>
  );
}
