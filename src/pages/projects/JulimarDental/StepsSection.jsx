// src/pages/projects/JulimarDental/StepsSection.jsx
// 4 passos do pedido — conteúdo estático, sem lógica.

const STEPS = [
  { number: 1, title: 'Seu Pedido', description: 'Adicione produtos ao seu orçamento.' },
  { number: 2, title: 'Separando seu pedido', description: 'Estamos separando seus materiais.' },
  { number: 3, title: 'Embalando seu pedido', description: 'Estamos embalando com cuidado.' },
  { number: 4, title: 'Entrega', description: 'Seu pedido foi enviado e chegará em breve.' },
];

export default function StepsSection() {
  return (
    <section className="jd-steps">
      {STEPS.map((step) => (
        <div key={step.number} className="jd-step">
          <span className="jd-step-number">{step.number}</span>
          <div>
            <h3>{step.title}</h3>
            <p>{step.description}</p>
          </div>
        </div>
      ))}
    </section>
  );
}
