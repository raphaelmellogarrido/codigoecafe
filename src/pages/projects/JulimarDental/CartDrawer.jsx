// src/pages/projects/JulimarDental/CartDrawer.jsx
// Painel lateral do orçamento: lista de itens, controlo de quantidade,
// remover, total geral e botão para enviar o orçamento pelo WhatsApp.

import { useEffect } from "react";
import { HiOutlineMinus, HiOutlinePlus, HiOutlineTrash, HiX } from "react-icons/hi";
import { FaWhatsapp } from "react-icons/fa6";
import { useCart } from "./CartContext.jsx";
import { buildWhatsappUrl } from "./whatsapp.js";
import { formatBRL } from "./format.js";

export default function CartDrawer({ open, onClose }) {
  const { items, cartTotal, updateQuantity, removeItem } = useCart();

  useEffect(() => {
    if (!open) return undefined;

    document.body.style.overflow = "hidden";

    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  return (
    <>
      <div className={`jd-cart-overlay ${open ? "jd-cart-overlay-open" : ""}`} onClick={onClose} />
      <aside className={`jd-cart-drawer ${open ? "jd-cart-drawer-open" : ""}`} aria-hidden={!open}>
        <div className="jd-cart-header">
          <h2>Seu Orçamento</h2>
          <button type="button" className="jd-cart-close" onClick={onClose} aria-label="Fechar orçamento">
            <HiX />
          </button>
        </div>

        {items.length === 0 ? (
          <p className="jd-cart-empty">O seu orçamento está vazio. Adicione materiais do catálogo.</p>
        ) : (
          <>
            <ul className="jd-cart-items">
              {items.map((item) => (
                <li key={item.productId} className="jd-cart-item">
                  <img src={item.image} alt={item.name} className="jd-cart-item-image" />
                  <div className="jd-cart-item-info">
                    <span className="jd-cart-item-name">{item.name}</span>
                    <span className="jd-cart-item-unit">{formatBRL(item.unitPrice)} un.</span>
                    <div className="jd-cart-item-controls">
                      <button type="button" onClick={() => updateQuantity(item.productId, Math.max(1, item.quantity - 1))} aria-label="Diminuir quantidade">
                        <HiOutlineMinus />
                      </button>

                      <input
                        type="text"
                        inputMode="numeric"
                        value={item.quantity}
                        onChange={(e) => {
                          const v = e.target.value.replace(/\D/g, "");
                          if (v === "") {
                            updateQuantity(item.productId, 1);
                            return;
                          }
                          updateQuantity(item.productId, parseInt(v, 10));
                        }}
                        onBlur={(e) => {
                          let v = parseInt(e.target.value, 10);
                          if (!v || v < 1) v = 1;
                          if (v > 9999) v = 9999;
                          updateQuantity(item.productId, v);
                        }}
                        onFocus={(e) => e.target.select()}
                        className="w-12 h-7 text-center border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-black"
                      />

                      <button type="button" onClick={() => updateQuantity(item.productId, item.quantity + 1)} aria-label="Aumentar quantidade">
                        <HiOutlinePlus />
                      </button>
                    </div>
                  </div>
                  <div className="jd-cart-item-side">
                    <span className="jd-cart-item-subtotal">{formatBRL(item.unitPrice * item.quantity)}</span>
                    <button type="button" className="jd-cart-item-remove" onClick={() => removeItem(item.productId)} aria-label={`Remover ${item.name}`}>
                      <HiOutlineTrash />
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            <div className="jd-cart-footer">
              <div className="jd-cart-total">
                <span>Total</span>
                <span>{formatBRL(cartTotal)}</span>
              </div>
              <a href={buildWhatsappUrl(items)} target="_blank" rel="noopener noreferrer" className="jd-cart-submit">
                <FaWhatsapp /> Enviar Orçamento no WhatsApp
              </a>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
