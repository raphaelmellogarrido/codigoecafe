// src/components/HowItWorks/HowItWorks.jsx
// 3 passos explicando o processo de trabalho (ainda sem casos de clientes
// reais para mostrar como testemunhos — esta seção substitui-os por enquanto).
// Cada passo tem um número grande em destaque e uma frase curta.

import useScrollReveal from "../../hooks/useScrollReveal";
import "./HowItWorks.css";

const steps = [
  "Você me manda seu Instagram e as 3 perguntas que mais responde no WhatsApp",
  "Eu monto seu site com a calculadora de orçamento em 7 dias",
  "Você começa a receber mensagem já pronta pra fechar, sem perder tempo perguntando",
];

function StepCard({ text, index }) {
  const ref = useScrollReveal();

  return (
    <div ref={ref} className={`step-card reveal reveal-delay-${index + 1}`}>
      <div className="step-number gradient-text">{index + 1}</div>
      <p className="step-text">{text}</p>
    </div>
  );
}

export default function HowItWorks() {
  const headerRef = useScrollReveal();

  return (
    <section className="how-it-works section">
      <div className="container">
        <div ref={headerRef} className="section-header reveal">
          <h2 className="section-title">Como funciona?</h2>
        </div>

        <div className="how-it-works-grid">
          {steps.map((text, index) => (
            <StepCard key={index} text={text} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
