// src/pages/PrivacyPolicy.jsx
// Página de Política de Privacidade — mesmo esqueleto da Home (Navbar +
// conteúdo + Footer). Texto pensado para cobrir o essencial do RGPD/GDPR e
// as exigências da Meta para contas de anúncio (uso de cookies/Pixel
// declarado, dados recolhidos, contacto do responsável). Não substitui
// aconselhamento jurídico — revê com um advogado antes de depender disto
// para compliance formal.

import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import "./PrivacyPolicy.css";

export default function PrivacyPolicy() {
  return (
    <>
      <Navbar />
      <main className="privacy-policy section">
        <div className="container privacy-policy-content">
          <span className="section-label">Legal</span>
          <h1 className="section-title">Política de Privacidade</h1>
          <p className="privacy-updated">Última atualização: 7 de agosto de 2026</p>

          <p>
            Esta página explica que dados o site <strong>codigoecafe.com</strong> recolhe, para que servem e que
            escolhas tens sobre eles. Se tiveres qualquer dúvida, escreve para{" "}
            <a href="mailto:contacto@codigoecafe.com">contacto@codigoecafe.com</a>.
          </p>

          <h2>1. Quem é o responsável pelo tratamento de dados</h2>
          <p>
            Código e Café, com sede em Aveiro, Portugal, é responsável pela recolha e tratamento dos dados descritos
            nesta política. Contato: <a href="mailto:contacto@codigoecafe.com">contacto@codigoecafe.com</a> ·{" "}
            <a href="tel:+351913247176">+351 913 247 176</a>.
          </p>

          <h2>2. Que dados recolhemos</h2>
          <ul>
            <li>
              <strong>Formulário de contacto:</strong> nome, email, assunto e mensagem que preenches voluntariamente
              para nos contactares.
            </li>
            <li>
              <strong>Dados de navegação:</strong> páginas visitadas, dispositivo, browser e ações no site (ex.:
              cliques), recolhidos automaticamente através de cookies e pixels de terceiros (ver secção seguinte).
            </li>
          </ul>

          <h2>3. Cookies e pixels de terceiros</h2>
          <p>Usamos os seguintes serviços de terceiros, que podem colocar cookies ou identificadores no seu dispositivo:</p>
          <ul>
            <li>
              <strong>Meta Pixel (Facebook/Instagram Ads):</strong> mede visitas e conversões (ex.: envio do
              formulário de contacto) para medir e otimizar as nossas campanhas publicitárias na Meta, e para
              construir públicos personalizados de remarketing. Saber mais na{" "}
              <a href="https://www.facebook.com/privacy/policy/" target="_blank" rel="noopener noreferrer">
                Política de Privacidade da Meta
              </a>
              .
            </li>
            <li>
              <strong>Google Fonts:</strong> carrega os tipos de letra do site diretamente dos servidores da Google.
            </li>
          </ul>

          <h2>4. Para que usamos os seus dados</h2>
          <ul>
            <li>Responder às mensagens enviadas pelo formulário de contacto.</li>
            <li>Medir o desempenho do site e das campanhas de publicidade.</li>
            <li>Melhorar a experiência de navegação e os conteúdos do site.</li>
          </ul>

          <h2>5. Os seus direitos</h2>
          <p>
            Ao abrigo do Regulamento Geral de Proteção de Dados (RGPD), tens o direito de aceder, retificar, apagar
            ou pedir a portabilidade dos seus dados pessoais, bem como te opor ao seu tratamento ou retirar o
            consentimento a qualquer momento. Para exercer qualquer um destes direitos, contacta-nos por{" "}
            <a href="mailto:contacto@codigoecafe.com">contacto@codigoecafe.com</a>. Tens também o direito de
            apresentar reclamação junto da Comissão Nacional de Proteção de Dados (CNPD).
          </p>

          <h2>6. Partilha de dados</h2>
          <p>
            Não vendemos os seus dados pessoais. Partilhamos dados de navegação com a Meta (Meta Platforms, Inc.)
            estritamente para os fins de medição e publicidade descritos acima, ao abrigo dos seus próprios termos e
            política de privacidade.
          </p>

          <h2>7. Alterações a esta política</h2>
          <p>
            Podemos atualizar esta página sempre que necessário. Recomendamos que a consultes periodicamente para
            estares a par de qualquer alteração.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
