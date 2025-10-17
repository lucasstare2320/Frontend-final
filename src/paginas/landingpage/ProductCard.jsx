// ../landingpage/ProductCard.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const ProductCard = ({ product, onAddToCart }) => {
  const navigate = useNavigate()
  console.log(product)
  const { id ,name, description, categoryName ,discount ,price, stock, image } = product;

  return (
    <article key={id}
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
      // NOTA: el article no tiene onClick. El padre puede tenerlo para navegar al detalle.
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
        />
      </div>

      <div className="card-body text-white px-3 py-3">
        <h5 className="card-title mb-1" style={{ color: "#d4af37", fontWeight: "700", fontSize: "1.05rem" }}>
          {name}
        </h5>
        <p className="card-text mb-2" style={{ color: "#bbb", fontSize: "0.9rem" }}>
          {categoryName}
        </p>
        <p className="card-text mb-2" style={{ color: "#bbb", fontSize: "0.9rem" }}>
          {description}
        </p>
        <p className="fw-bold mb-0" style={{ color: "#fff", fontSize: "1.1rem" }}>
          ${price}
        </p>
        <p className="card-text mb-2" style={{ color: "#bbb", fontSize: "0.9rem" }}>
          ${parseInt((price*(100-discount))/100)}
        </p>
        <p className="card-text mb-2" style={{ color: "#bbb", fontSize: "0.9rem" }}>
          Stock {parseInt(stock)}
        </p>
      </div>

      <div className="card-footer bg-transparent border-0 pb-3">
        <button
          className="btn fw-bold"
          style={{
            backgroundColor: "#d4af37",
            color: "#0d0d0d",
            borderRadius: "24px",
            padding: "8px 18px",
            fontSize: "0.9rem",
            transition: "all 0.25s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#e6c85c")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#d4af37")}
          onClick={(e) => {
            e.stopPropagation(); // evita navegar al detalle si el padre es clickable
            onAddToCart && onAddToCart(product);
          }}
        >
          Añadir al carrito
        </button>
      </div>
    </article>
  );
};

export default ProductCard;