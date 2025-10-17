import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { FaShoppingCart, FaUser } from "react-icons/fa";
import "./Navbarperfume.css";
import { useSelector } from "react-redux";

function Navbarperfume() {
  const navigate = useNavigate();
  const admin = useSelector((state) => state.user?.admin);
  const cartItems = useSelector((state) => state.cartItems);

  const [cartCount, setCartCount] = useState(0);
  const [showPopup, setShowPopup] = useState(false);

  const prevCount = useRef(0);
  const firstRender = useRef(true); // <-- NUEVO: para evitar popup al montar
  /*
  useEffect(() => {
    const total = cartItems.reduce((acc, item) => acc + item.qty, 0);

    // Evitar que se ejecute en el primer render
    if (!firstRender.current) {
      // Mostrar solo si el carrito aumentó
      if (total > prevCount.current) {
        setShowPopup(true);
        setTimeout(() => setShowPopup(false), 2500);
      }
    } else {
      firstRender.current = false;
    }

    prevCount.current = total;
    setCartCount(total);
  }, [cartItems]);
  */
  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark sticky-top custom-navbar">
        <div className="container">
          {/* Logo */}
          <span
            className="navbar-brand brand-text"
            onClick={() => navigate("/landingpage")}
          >
            <span className="brand-gold">EL CÓDIGO</span>{" "}
            <span className="brand-white">PERFUMERIE</span>
          </span>

          {/* Toggle */}
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarPerfume"
            aria-controls="navbarPerfume"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Links */}
          <div className="collapse navbar-collapse" id="navbarPerfume">
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0 align-items-lg-center">
              {admin && (
                <li className="nav-item">
                  <span
                    className="nav-link"
                    onClick={() => navigate("/misproductos")}
                  >
                    Mis Productos
                  </span>
                </li>
              )}

              <li className="nav-item">
                <span
                  className="nav-link"
                  onClick={() => navigate("/productos")}
                >
                  Productos
                </span>
              </li>

              <li className="nav-item">
                <span className="nav-link" onClick={() => navigate("/")}>
                  Logout
                </span>
              </li>

              {/* Carrito */}
              <li className="nav-item position-relative">
                <span
                  className="nav-link icon-link"
                  onClick={() => navigate("/carrito")}
                >
                  <FaShoppingCart />
                  {cartCount > 0 && (
                    <span className="cart-badge">{cartCount}</span>
                  )}
                </span>
              </li>

              <li className="nav-item">
                <span
                  className="nav-link icon-link"
                  onClick={() => navigate("/perfil")}
                >
                  <FaUser />
                </span>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Popup animado */}
      {showPopup && (
        <div className="popup-notice animate-popup">
          <p>🛒 Producto agregado al carrito</p>
        </div>
      )}
    </>
  );
}

export default Navbarperfume;
