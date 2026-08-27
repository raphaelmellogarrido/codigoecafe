// src/pages/projects/Imobiliaria/ImobiliariaListing.jsx
// Página "/imobiliaria/imoveis" — catálogo completo com filtros por tipo de
// negócio, cidade + raio de distância, preço e tipologia. Os filtros de
// negócio/cidade chegam por query string quando vêm da busca da Home.

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { HiOutlineAdjustments, HiOutlineSearchCircle, HiX } from "react-icons/hi";
import ImobiliariaNavbar from "./ImobiliariaNavbar";
import ImobiliariaFooter from "./ImobiliariaFooter";
import WhatsappFloatButton from "./WhatsappFloatButton";
import { PropertyCard, PropertyCardSkeleton } from "./PropertyCard";
import useProperties from "./useProperties";
import { PORTUGAL_DISTRICTS, citiesInDistrict, findCity } from "./cities";
import { distanceKm } from "./distance";
import { RAIOS_KM, TIPOLOGIAS } from "./constants";

const NEGOCIO_TABS = [
  { value: "todos", label: "Todos" },
  { value: "venda", label: "Comprar" },
  { value: "arrendamento", label: "Arrendar" },
];

const SORT_OPTIONS = [
  { value: "recentes", label: "Mais recentes" },
  { value: "preco-asc", label: "Preço: menor primeiro" },
  { value: "preco-desc", label: "Preço: maior primeiro" },
];

function relevantPrice(imovel, negocio) {
  if (negocio === "arrendamento") return imovel.precoArrendamento ?? null;
  if (negocio === "venda") return imovel.precoVenda ?? null;
  return imovel.precoVenda ?? imovel.precoArrendamento ?? null;
}

export default function ImobiliariaListing() {
  const { properties, loading, error } = useProperties();
  const [searchParams] = useSearchParams();

  const cidadeInicial = searchParams.get("cidade") || "";
  const distritoInicial = searchParams.get("distrito") || "";

  const [negocio, setNegocio] = useState(searchParams.get("negocio") || "todos");
  const [distrito, setDistrito] = useState(() => findCity(cidadeInicial)?.district || distritoInicial);
  const [cidade, setCidade] = useState(cidadeInicial);
  const [raio, setRaio] = useState(25);
  const [precoMin, setPrecoMin] = useState("");
  const [precoMax, setPrecoMax] = useState("");
  const [tipologias, setTipologias] = useState([]);
  const [ordenar, setOrdenar] = useState("recentes");
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Se a Home enviar novos parâmetros (o utilizador voltou e pesquisou de
  // novo), refletir aqui também. Cidade tem prioridade sobre distrito (uma
  // pesquisa nova substitui a anterior por completo).
  useEffect(() => {
    if (searchParams.get("negocio")) setNegocio(searchParams.get("negocio"));
    const novaCidade = searchParams.get("cidade");
    const novoDistrito = searchParams.get("distrito");
    if (novaCidade) {
      setCidade(novaCidade);
      setDistrito(findCity(novaCidade)?.district || "");
    } else if (novoDistrito) {
      setDistrito(novoDistrito);
      setCidade("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // Trocar de distrito invalida a cidade escolhida antes (pode não existir
  // no novo distrito).
  function handleDistritoChange(value) {
    setDistrito(value);
    setCidade("");
  }

  function toggleTipologia(t) {
    setTipologias((cur) => (cur.includes(t) ? cur.filter((x) => x !== t) : [...cur, t]));
  }

  function limparFiltros() {
    setNegocio("todos");
    setDistrito("");
    setCidade("");
    setRaio(25);
    setPrecoMin("");
    setPrecoMax("");
    setTipologias([]);
    setOrdenar("recentes");
  }

  const filtered = useMemo(() => {
    let list = [...properties];

    if (negocio !== "todos") {
      list = list.filter((p) => p.tipo === negocio || p.tipo === "ambos");
    }

    if (cidade) {
      // Cidade específica escolhida: filtra por raio de distância a partir
      // dela (pode incluir imóveis de outra cidade/distrito, se estiverem
      // perto o suficiente — é o comportamento esperado do "raio de X km").
      const ref = findCity(cidade);
      if (ref) {
        list = list.filter((p) => distanceKm(p.lat, p.lng, ref.lat, ref.lng) <= raio);
      }
    } else if (distrito) {
      // Só o distrito foi escolhido (sem cidade): filtra por correspondência
      // exata do distrito guardado no imóvel, sem raio (não há um "centro"
      // único para calcular distância a um distrito inteiro).
      list = list.filter((p) => p.distrito === distrito);
    }

    if (precoMin) {
      list = list.filter((p) => {
        const preco = relevantPrice(p, negocio);
        return preco != null && preco >= Number(precoMin);
      });
    }

    if (precoMax) {
      list = list.filter((p) => {
        const preco = relevantPrice(p, negocio);
        return preco != null && preco <= Number(precoMax);
      });
    }

    if (tipologias.length > 0) {
      list = list.filter((p) => tipologias.includes(p.tipologia));
    }

    if (ordenar === "preco-asc") {
      list.sort((a, b) => (relevantPrice(a, negocio) ?? Infinity) - (relevantPrice(b, negocio) ?? Infinity));
    } else if (ordenar === "preco-desc") {
      list.sort((a, b) => (relevantPrice(b, negocio) ?? -Infinity) - (relevantPrice(a, negocio) ?? -Infinity));
    }

    return list;
  }, [properties, negocio, distrito, cidade, raio, precoMin, precoMax, tipologias, ordenar]);

  return (
    <div className="im-page">
      <ImobiliariaNavbar />

      <section className="im-listing-header">
        <span className="im-section-label">Catálogo</span>
        <h1>Encontra o seu próximo imóvel</h1>
        <p>{loading ? "A carregar imóveis..." : `${filtered.length} imóvel${filtered.length === 1 ? "" : "is"} encontrado${filtered.length === 1 ? "" : "s"}`}</p>
      </section>

      <div className="im-listing-tabs">
        {NEGOCIO_TABS.map((tab) => (
          <button key={tab.value} className={`im-search-tab ${negocio === tab.value ? "active" : ""}`} onClick={() => setNegocio(tab.value)}>
            {tab.label}
          </button>
        ))}
        <button className="im-filters-toggle" onClick={() => setFiltersOpen((v) => !v)}>
          <HiOutlineAdjustments /> Filtros
        </button>
      </div>

      <div className="im-listing-layout">
        <aside className={`im-filters ${filtersOpen ? "open" : ""}`}>
          <div className="im-filters-header">
            <h2>Filtros</h2>
            <button className="im-filters-close" onClick={() => setFiltersOpen(false)} aria-label="Fechar filtros">
              <HiX />
            </button>
          </div>

          <div className="im-filter-group">
            <label>Distrito</label>
            <select className="im-input" value={distrito} onChange={(e) => handleDistritoChange(e.target.value)}>
              <option value="">Qualquer distrito</option>
              {PORTUGAL_DISTRICTS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          <div className="im-filter-group">
            <label>Cidade</label>
            <select className="im-input" value={cidade} onChange={(e) => setCidade(e.target.value)} disabled={!distrito}>
              <option value="">{distrito ? "Qualquer cidade" : "Escolhe primeiro o distrito"}</option>
              {citiesInDistrict(distrito).map((c) => (
                <option key={c.city} value={c.city}>
                  {c.city}
                </option>
              ))}
            </select>
          </div>

          {cidade && (
            <div className="im-filter-group">
              <label>Raio de distância</label>
              <select className="im-input" value={raio} onChange={(e) => setRaio(Number(e.target.value))}>
                {RAIOS_KM.map((km) => (
                  <option key={km} value={km}>
                    até {km} km
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="im-filter-group">
            <label>{negocio === "arrendamento" ? "Renda mensal (€)" : "Preço (€)"}</label>
            <div className="im-filter-range">
              <input type="number" min="0" className="im-input" placeholder="Mínimo" value={precoMin} onChange={(e) => setPrecoMin(e.target.value)} />
              <input type="number" min="0" className="im-input" placeholder="Máximo" value={precoMax} onChange={(e) => setPrecoMax(e.target.value)} />
            </div>
          </div>

          <div className="im-filter-group">
            <label>Tipologia</label>
            <div className="im-chip-group">
              {TIPOLOGIAS.map((t) => (
                <button key={t} type="button" className={`im-chip ${tipologias.includes(t) ? "active" : ""}`} onClick={() => toggleTipologia(t)}>
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="im-filter-group">
            <label>Ordenar por</label>
            <select className="im-input" value={ordenar} onChange={(e) => setOrdenar(e.target.value)}>
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>

          <div className="im-filters-actions">
            <button className="im-btn-outline im-filters-clear" onClick={limparFiltros}>
              Limpar filtros
            </button>
            {/* Só aparece em ecrãs pequenos (filtros em ecrã inteiro) — nos
                grandes os resultados já se atualizam sozinhos ao lado. */}
            {/* <button type="button" className="im-filters-apply" onClick={() => setFiltersOpen(false)}>
              Aplicar filtros ({filtered.length})
            </button> */}
            <button type="button" className="im-filters-apply" onClick={() => setFiltersOpen(false)}>
              Aplicar filtros ({filtered.length > 1 ? filtered.length + " resultados" : filtered.length + " resultado"})
            </button>
          </div>
        </aside>

        <main className="im-listing-results">
          {error && <p className="im-status im-error">{error}</p>}

          {loading && (
            <div className="im-grid">
              {Array.from({ length: 6 }).map((_, i) => (
                <PropertyCardSkeleton key={i} />
              ))}
            </div>
          )}

          {!loading && !error && filtered.length === 0 && (
            <div className="im-empty-state">
              <HiOutlineSearchCircle />
              <h3>Nenhum imóvel encontrado</h3>
              <p>Tenta alargar o raio de distância ou limpar alguns filtros.</p>
              <button className="im-btn-outline" onClick={limparFiltros}>
                Limpar filtros
              </button>
            </div>
          )}

          {!loading && !error && filtered.length > 0 && (
            <div className="im-grid">
              {filtered.map((imovel) => (
                <PropertyCard key={imovel.id} imovel={imovel} />
              ))}
            </div>
          )}
        </main>
      </div>

      <ImobiliariaFooter />
      <WhatsappFloatButton />
    </div>
  );
}
