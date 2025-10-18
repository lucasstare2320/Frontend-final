// Navbarperfume.jsx
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { FaShoppingCart, FaUser } from "react-icons/fa";
import { logoutUser } from "../../../REDUX/userSlice";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./Navbarperfume.css";

function Navbarperfume() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cartItems = useSelector((state) => state.cart.items);
  const cartCount = cartItems.reduce((acc, i) => acc + i.qty, 0);

  const [showPopup, setShowPopup] = useState(false);
  const [badgeBump, setBadgeBump] = useState(false);
  const prevCount = useRef(0);
  const firstRender = useRef(true);
  const hideTimer = useRef(null);
  const bumpTimer = useRef(null);
  const cartIconRef = useRef(null);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/");
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark sticky-top custom-navbar">
        <div className="container">
          <span className="navbar-brand brand-text" onClick={() => navigate("/landingpage")}>
            <span className="brand-gold">EL CÓDIGO</span>{" "}
            <span className="brand-white">PERFUMERIE</span>
          </span>

          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarPerfume">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarPerfume">
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0 align-items-lg-center">
              
              <li className="nav-item">
                <span className="nav-link" onClick={() => navigate("/productos")}>Productos</span>
              </li>
              <li className="nav-item">
                <span className="nav-link" onClick={handleLogout} style={{ cursor: "pointer" }}>Logout</span>
              </li>

              {/* Carrito */}
              <li className="nav-item position-relative">
                <span ref={cartIconRef} className="nav-link icon-link" onClick={() => navigate("/carrito")}>
                  <FaShoppingCart />
                  {cartCount > 0 && (
                    <span className={`cart-badge ${badgeBump ? "cart-badge-bump" : ""}`}>
                      {cartCount}
                    </span>
                  )}
                </span>
              </li>

              <li className="nav-item">
                <span className="nav-link icon-link" onClick={() => navigate("/perfil")}>
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
