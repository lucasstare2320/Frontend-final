import React, { useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Footer from "../landingpage/FOOTER/Footer";
import Navbarperfume from "../landingpage/NAVBAR/Navbar";


import { updateQty, removeFromCart, clearCart as clearCartAction } from "../../REDUX/cartSlice";

const Carrito = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cartItems = useSelector((state) => state.cart.items);

  // Modal confirm
  const [showConfirm, setShowConfirm] = useState(false);
  const [itemToRemove, setItemToRemove] = useState(null);

// Totales (subtotal bruto, descuentos, total neto)
const { subtotal, descuentos, total } = useMemo(() => {
  const n = (v) => (typeof v === "number" && isFinite(v) ? v : Number(v) || 0);

  const sub = cartItems.reduce((acc, i) => acc + n(i.price) * n(i.qty), 0);

  const disc = cartItems.reduce((acc, i) => {
    const price = n(i.price);
    const qty = n(i.qty);
    const pct = n(i.discount); // % (0..100). Si no viene, será 0
    const itemDiscount = price * qty * (pct / 100);
    return acc + itemDiscount;
  }, 0);

  return {
    subtotal: sub,
    descuentos: disc,
    total: Math.max(0, sub - disc),
  };
}, [cartItems]);


  // Handlers
  const handleUpdateQty = (id, qty, stock) => {
    const next = Math.max(1, Math.min((stock ?? 99), qty)); // opcional: capar por stock si existe
    dispatch(updateQty({ id, qty: next }));
  };

  const confirmRemove = (item) => {
    setItemToRemove(item);
    setShowConfirm(true);
  };

  const handleConfirmDelete = () => {
    if (itemToRemove) {
      dispatch(removeFromCart(itemToRemove.id));
    }
    setShowConfirm(false);
    setItemToRemove(null);
  };

  const handleCancelDelete = () => {
    setShowConfirm(false);
    setItemToRemove(null);
  };

  const clearCart = () => {
    dispatch(clearCartAction());
  };

  const proceedToPayment = () => navigate("/checkout");
  const continueShopping = () => navigate("/productos");

  // Inline styles para modal/backdrop
  const backdropStyle = {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(0,0,0,0.45)",
    zIndex: 9999,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  const modalStyle = {
    background: "#0b0b0b",
    color: "#fff",
    padding: "18px",
    borderRadius: "10px",
    width: "92%",
    maxWidth: "420px",
    boxShadow: "0 8px 30px rgba(0,0,0,0.6)",
    border: "1px solid rgba(212,175,55,0.08)",
  };

  const btnPrimary = {
    background: "#d4af37",
    border: "none",
    color: "#000",
    padding: "8px 12px",
    borderRadius: "6px",
  };

  const btnGhost = {
    background: "transparent",
    border: "1px solid rgba(255,255,255,0.12)",
    color: "#fff",
    padding: "8px 12px",
    borderRadius: "6px",
  };

  const formatMoney = (n) => Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" }).format(n ?? 0);

  return (
    <>
      <Navbarperfume />
      <div className="container py-4 mt-3" style={{ backgroundColor: "#000" }}>
        <div className="row g-4">
          {/* Listado */}
          <div className="col-12 col-lg-8">
            <h2 className="text-white mb-3">Tu Carrito</h2>

            {cartItems.length === 0 ? (
              <div className="p-4 text-center text-white bg-dark rounded">
                <p className="mb-3">Tu carrito está vacío.</p>
                <button className="btn btn-outline-light" onClick={continueShopping}>
                  Seguir comprando
                </button>
              </div>
            ) : (
              <div className="list-group">
                {cartItems.map((item) => {
                  const unit = item.currency ?? ""; // opcional
                  const maxQty = item.stock ?? 99;   // si guardás stock en el slice

                  return (
                    <div
                      key={item.id}
                      className="list-group-item d-flex flex-column flex-md-row align-items-md-center bg-dark border-0 mb-3 rounded"
                      style={{ border: "1px solid rgba(212,175,55,0.25)" }}
                    >
                      {/* Imagen */}
                      <div
                        className="d-flex align-items-center justify-content-center p-3"
                        style={{ width: "140px", backgroundColor: "#111", borderRadius: "8px" }}
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          style={{ maxWidth: "100%", maxHeight: "100px", objectFit: "contain" }}
                          loading="lazy"
                        />
                      </div>

                      {/* Datos */}
                     {/* Datos */}
<div className="flex-grow-1 text-white px-md-3 py-3">
  <h5 className="mb-1" style={{ color: "#d4af37" }}>{item.name}</h5>
  {item.brand && <p className="mb-2 text-muted">{item.brand}</p>}

  {(() => {
    // Normalizar descuento (acepta 10, "10", "10%", 0.1)
    const normalizePct = (d) => {
      if (typeof d === "string") {
        const clean = d.replace(",", ".").replace(/[^\d.]/g, "");
        const num = parseFloat(clean);
        if (!isFinite(num)) return 0;
        return num <= 1 ? num * 100 : num;
      }
      if (typeof d === "number") {
        return d <= 1 ? d * 100 : d;
      }
      return 0;
    };

    const pct = normalizePct(item.discount || 0);     // porcentaje 0..100
    const hasDiscount = pct > 0;
    const unitFinal = Math.max(0, (Number(item.price) || 0) * (1 - pct / 100));
    const itemTotalFinal = unitFinal * (Number(item.qty) || 0);
    const itemTotalSinDesc = (Number(item.price) || 0) * (Number(item.qty) || 0);
    const itemDiscountMoney = itemTotalSinDesc - itemTotalFinal;

    return (
      <div className="d-flex flex-wrap align-items-center gap-3">
        {/* Precio unitario (con/sin descuento) */}
        {!hasDiscount ? (
          <div className="text-white">
            <span className="fw-bold">{formatMoney(item.price)}</span>
            <span className="text-muted ms-2">/ unidad</span>
          </div>
        ) : (
          <div className="text-white d-flex align-items-center" style={{ gap: 10 }}>
            <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.1 }}>
              <span style={{ color: "#9a9a9a", textDecoration: "line-through", fontSize: ".9rem" }}>
                {formatMoney(item.price)}
              </span>
              <span style={{ fontWeight: 800, color: "#d4af37" }}>
                {formatMoney(unitFinal)} <span className="text-muted" style={{ fontWeight: 400 }}>/ unidad</span>
              </span>
            </div>
            <span
              style={{
                backgroundColor: "#2b2b2b",
                color: "#d4af37",
                border: "1px solid rgba(212,175,55,0.4)",
                borderRadius: 999,
                padding: "2px 8px",
                fontSize: ".8rem",
                fontWeight: 700,
              }}
              title={`Descuento ${pct}%`}
            >
              −{Math.round(pct)}%
            </span>
          </div>
        )}

        {/* Cantidad */}
        <div className="d-flex align-items-center">
          <label className="me-2 text-muted">Cantidad</label>
          <input
            type="number"
            className="form-control form-control-sm"
            min="1"
            max={item.stock ?? 99}
            value={item.qty}
            onChange={(e) =>
              handleUpdateQty(item.id, parseInt(e.target.value, 10) || 1, item.stock ?? 99)
            }
            style={{ width: "80px", backgroundColor: "#000", color: "#fff", borderColor: "#444" }}
          />
          <div className="btn-group ms-2">
            <button
              className="btn btn-sm btn-outline-light"
              onClick={() => handleUpdateQty(item.id, item.qty - 1, item.stock ?? 99)}
              disabled={item.qty <= 1}
              title="Disminuir"
            >
              −
            </button>
            <button
              className="btn btn-sm btn-outline-light"
              onClick={() => handleUpdateQty(item.id, item.qty + 1, item.stock ?? 99)}
              disabled={item.qty >= (item.stock ?? 99)}
              title={item.qty >= (item.stock ?? 99) ? "Alcanzaste el stock disponible" : "Aumentar"}
            >
              +
            </button>
          </div>
          {item.stock != null && (
            <small className="ms-2 text-muted">Stock: {item.stock - item.qty}</small>
          )}
        </div>

        {/* Totales del ítem */}
        <div className="ms-md-auto text-white" style={{ minWidth: 170 }}>
          {!hasDiscount ? (
            <>
              <span className="text-muted me-2">Total ítem:</span>
              <strong>{formatMoney(item.price * item.qty)}</strong>
            </>
          ) : (
            <div style={{ textAlign: "right" }}>
              <div className="text-muted" style={{ fontSize: ".85rem" }}>
                Total sin desc.: {formatMoney(itemTotalSinDesc)}
              </div>
              <div className="text-warning" style={{ fontSize: ".85rem" }}>
                − Descuento: {formatMoney(itemDiscountMoney)}
              </div>
              <div style={{ fontWeight: 700 }}>
                Total ítem: <span style={{ color: "#d4af37" }}>{formatMoney(itemTotalFinal)}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  })()}
</div>


                      {/* Acciones */}
                      <div className="p-3 d-flex flex-row flex-md-column gap-2">
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => confirmRemove(item)}
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  );
                })}

                {/* Limpiar carrito */}
                <div className="d-flex justify-content-between mt-3">
                  <button className="btn btn-outline-light" onClick={continueShopping}>
                    Seguir comprando
                  </button>
                  <button className="btn btn-outline-warning" onClick={clearCart}>
                    Vaciar carrito
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Resumen */}
          <div className="col-12 col-lg-4">
            <div
              className="p-3 rounded"
              style={{ background: "linear-gradient(160deg, #0d0d0d, #1a1a1a)", border: "1px solid rgba(212,175,55,0.25)" }}
            >
<h4 className="mb-3" style={{ color: "#d4af37" }}>Resumen de tu pedido</h4>

<div className="d-flex justify-content-between text-white mb-2">
  <span className="text-muted">Subtotal</span>
  <span className="fw-bold">{formatMoney(subtotal)}</span>
</div>

<div className="d-flex justify-content-between text-warning mb-2">
  <span>Descuentos</span>
  <span>-{formatMoney(descuentos)}</span>
</div>

<hr style={{ borderColor: "#333" }} />

<div className="d-flex justify-content-between text-white mb-3">
  <span className="text-muted">Total</span>
  <span className="fw-bold" style={{ color: "#d4af37" }}>{formatMoney(total)}</span>
</div>

              <div className="d-grid gap-2">
                <button className="btn btn-warning fw-bold" onClick={proceedToPayment} disabled={cartItems.length === 0} >
                  Proceder al pago
                </button>
                <button className="btn btn-outline-light" onClick={continueShopping}>
                  Seguir comprando
                </button>
              </div>

              <p className="small text-muted mt-3">
                Los precios incluyen impuestos. El envío gratis aplica dentro de Argentina.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />

      {/* Modal de confirmación */}
      {showConfirm && (
        <div style={backdropStyle} onClick={handleCancelDelete}>
          <div
            style={modalStyle}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirmTitle"
          >
            <h5 id="confirmTitle" style={{ margin: 0, marginBottom: 8 }}>Confirmar eliminación</h5>
            <p style={{ margin: 0 }}>
              ¿Seguro que querés eliminar <strong>{itemToRemove?.name}</strong> del carrito?
            </p>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 14 }}>
              <button style={btnGhost} onClick={handleCancelDelete}>Cancelar</button>
              <button style={btnPrimary} onClick={handleConfirmDelete}>Sí, eliminar</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Carrito;
