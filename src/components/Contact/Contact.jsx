import { useState } from "react";
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaPaperPlane, FaCheckCircle } from "react-icons/fa";
import { HiMail } from "react-icons/hi";
import "./Contact.css";

export default function Contact() {
  // useState: um único objeto com todos os campos do formulário
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  // useState: indica se o formulário foi enviado (para mostrar feedback)
  const [sent, setSent] = useState(false);

  // Atualiza um campo do form com o que o utilizador escreveu
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const [error, setError] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return; // trava extra, por segurança

    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("email", form.email);
    formData.append("subject", form.subject);
    formData.append("message", form.message);

    try {
      const response = await fetch("/contact.php", {
        method: "POST",
        body: formData,
      });

      const text = await response.text();
      const data = text ? JSON.parse(text) : { success: false };

      if (data.success) {
        setSent(true);
        setError(false);
        setForm({ name: "", email: "", subject: "", message: "" });
        setTimeout(() => setSent(false), 4000);
      } else {
        setError(true);
      }
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="contact section">
      <div className="container">
        <div className="section-header">
          <span className="section-label">Contacto</span>
          <h2 className="section-title">
            Vamos criar algo <span className="gradient-text">incrível</span> juntos?
          </h2>
          <p className="section-description">Conta-nos o teu projeto. Respondemos em menos de 24 horas.</p>
        </div>

        <div className="contact-grid">
          {/* Coluna esquerda — Formulário */}
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Nome</label>
              <input type="text" id="name" name="name" value={form.name} onChange={handleChange} placeholder="O teu nome" required />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input type="email" id="email" name="email" value={form.email} onChange={handleChange} placeholder="email@exemplo.com" required />
            </div>

            <div className="form-group">
              <label htmlFor="subject">Assunto</label>
              <input type="text" id="subject" name="subject" value={form.subject} onChange={handleChange} placeholder="Sobre o que vamos falar?" required />
            </div>

            <div className="form-group">
              <label htmlFor="message">Mensagem</label>
              <textarea id="message" name="message" value={form.message} onChange={handleChange} placeholder="Conta-nos mais sobre o teu projeto..." rows="5" required />
            </div>

            <button type="submit" className="btn-primary form-submit" disabled={isSubmitting}>
              {isSubmitting ? (
                "Enviando..."
              ) : sent ? (
                <>
                  <FaCheckCircle /> Mensagem Enviada!
                </>
              ) : (
                <>
                  <FaPaperPlane /> Enviar Mensagem
                </>
              )}
            </button>

            {error && <p className="form-error">Algo correu mal. Tenta novamente.</p>}
          </form>

          {/* Coluna direita — Informações */}
          <div className="contact-info">
            <h3 className="info-title">Informações de Contacto</h3>
            <p className="info-description">Estamos disponíveis para responder a todas as tuas questões. Escolhe o canal que preferires.</p>

            <div className="info-list">
              <div className="info-item">
                <div className="info-icon">
                  <FaEnvelope />
                </div>
                <div>
                  <div className="info-label">Email</div>
                  <div className="info-value">contacto@codigoecafe.com</div>
                </div>
              </div>

              <div className="info-item">
                <div className="info-icon">
                  <FaPhone />
                </div>
                <div>
                  <div className="info-label">Telefone</div>
                  <div className="info-value">+351 913 247 176</div>
                </div>
              </div>

              <div className="info-item">
                <div className="info-icon">
                  <FaMapMarkerAlt />
                </div>
                <div>
                  <div className="info-label">Localização</div>
                  <div className="info-value">Aveiro, Portugal</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
