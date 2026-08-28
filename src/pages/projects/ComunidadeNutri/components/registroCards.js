import Sequencia from "./Sequencia";
import JornadaProgress from "./JornadaProgress";
import MeditandoJunto from "./MeditandoJunto";
import CardEncontro from "./CardEncontro";
import DesafioSemana from "./DesafioSemana";
import FraseMotivacionalSemana from "./FraseMotivacionalSemana";

// Registro central dos 6 cards que participam do modo de edição de layout
// (?edit_mode=1) — ver
// docs/superpowers/specs/2026-08-28-layout-comunidade-nutri-design.md.
// `card_key` aqui tem que bater EXATAMENTE com $CARD_KEYS_VALIDOS em
// public/api/comunidade/layout.php (duplicado lá pelo mesmo motivo de
// ADMIN_EMAILS/$ADMINS_CLUBE em isAdmin.js — JS e PHP não compartilham
// constante direto).
export const REGISTRO_CARDS = {
  sequencia: { Componente: Sequencia, colunaPadrao: "meio", ordemPadrao: 0, tituloEditavel: true, tituloPadrao: "Sequência" },
  jornada: { Componente: JornadaProgress, colunaPadrao: "meio", ordemPadrao: 1, tituloEditavel: true, tituloPadrao: "Sua Jornada" },
  meditando_junto: { Componente: MeditandoJunto, colunaPadrao: "meio", ordemPadrao: 2, tituloEditavel: true, tituloPadrao: "Meditando junto" },
  encontro: { Componente: CardEncontro, colunaPadrao: "direita", ordemPadrao: 0, tituloEditavel: true, tituloPadrao: "Próximo encontro ao vivo" },
  desafio_semana: { Componente: DesafioSemana, colunaPadrao: "direita", ordemPadrao: 1, tituloEditavel: true, tituloPadrao: "Desafio da semana" },
  frase_semana: { Componente: FraseMotivacionalSemana, colunaPadrao: "direita", ordemPadrao: 2, tituloEditavel: false, tituloPadrao: null },
};

export const CARD_KEYS = Object.keys(REGISTRO_CARDS);
