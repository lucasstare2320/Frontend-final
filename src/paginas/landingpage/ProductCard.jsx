// ../landingpage/ProductCard.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const money = (n) =>
  Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" }).format(Number(n) || 0);

const ProductCard = ({ product, onAddToCart }) => {
  const navigate = useNavigate();
  const { id, name, description, categoryName, discount = 0, price = 0, stock, image } = product;

  const cartQty = useSelector((state) => state.cart.items.find((i) => i.id === id)?.qty || 0);
  const remainingStock = Math.max(0, parseInt(stock ?? 0) - cartQty);

  const hasDiscount = Number(discount) > 0;
  const discountedPrice = Math.max(0, (Number(price) || 0) * (1 - (Number(discount) || 0) / 100));

  return (
    <article
      key={id}
      className="card h-100 text-center border-0"
      role="region"
      aria-label={name}
      style={{
        background: "linear-gradient(160deg, #0d0d0d, #1a1a1a)",
        borderRadius: "14px",
        border: "1px solid rgba(212,175,55,0.4)",
        transition: "all 0.3s ease",
        overflow: "hidden",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.border = "1px solid rgba(212,175,55,0.8)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.border = "1px solid rgba(212,175,55,0.4)";
      }}
    >
      <div
        style={{
          backgroundColor: "#111",
          padding: "16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "220px",
        }}
      >
        <img
          src={image}
          style={{ maxHeight: "100%", maxWidth: "100%", objectFit: "contain" }}
          loading="lazy"
          alt={name}
        />
      </div>

      <div className="card-body text-white px-3 py-3">
        <h5 className="card-title mb-1" style={{ color: "#d4af37", fontWeight: 700, fontSize: "1.05rem" }}>
          {name}
        </h5>

        <p className="card-text mb-2" style={{ color: "#bbb", fontSize: "0.9rem" }}>
          {categoryName}
        </p>
        <p className="card-text mb-2" style={{ color: "#bbb", fontSize: "0.9rem" }}>
          {description}
        </p>

        {/* === BLOQUE DE PRECIO === */}
        {!hasDiscount ? (
          // SIN DESCUENTO
          <p className="fw-bold mb-2" style={{ color: "#fff", fontSize: "1.15rem" }}>
            {money(price)}
          </p>
        ) : (
          // CON DESCUENTO
          <div className="mb-2">
            {/* Precio original tachado */}
            <div
              style={{
                color: "#9a9a9a",
                fontSize: "0.95rem",
                textDecoration: "line-through",
                marginBottom: "4px",
              }}
            >
              {money(price)}
            </div>

            {/* Badge de descuento y precio final */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span
                style={{
                  backgroundColor: "#2b2b2b",
                  color: "#d4af37",
                  border: "1px solid rgba(212,175,55,0.4)",
                  borderRadius: "999px",
                  padding: "2px 8px",
                  fontSize: "0.8rem",
                  fontWeight: 700,
                }}
              >
                −{parseInt(discount, 10)}%
              </span>
              <span
                style={{
                  color: "#d4af37",
                  fontWeight: 800,
                  fontSize: "1.25rem",
                }}
              >
                {money(discountedPrice)}
              </span>
            </div>
          </div>
        )}

        {/* Stock */}
        <p
          className="card-text mb-2"
          style={{ color: remainingStock === 0 ? "#ff6b6b" : "#bbb", fontSize: "0.9rem" }}
        >
          {remainingStock === 0 ? "Sin stock" : `Stock ${remainingStock}`}
        </p>
      </div>

      <div className="card-footer bg-transparent border-0 pb-3">
        <button
          className="btn fw-bold"
          style={{
            backgroundColor: remainingStock === 0 ? "#777" : "#d4af37",
            color: "#0d0d0d",
            borderRadius: "24px",
            padding: "8px 18px",
            fontSize: "0.9rem",
            transition: "all 0.25s ease",
            cursor: remainingStock === 0 ? "not-allowed" : "pointer",
          }}
          disabled={remainingStock === 0}
          onMouseEnter={(e) => remainingStock !== 0 && (e.currentTarget.style.backgroundColor = "#e6c85c")}
          onMouseLeave={(e) => remainingStock !== 0 && (e.currentTarget.style.backgroundColor = "#d4af37")}
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart && onAddToCart(product);
          }}
        >
          {remainingStock === 0 ? "Sin stock" : "Añadir al carrito"}
        </button>
      </div>
    </article>
  );
};

export default ProductCard;
