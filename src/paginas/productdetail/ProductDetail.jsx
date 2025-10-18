import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import "bootstrap/dist/css/bootstrap.min.css";
import "./ProductDetail.css";
import Navbarperfume from "../landingpage/NAVBAR/Navbar";
import Footer from "../landingpage/FOOTER/Footer";
import { useParams, Link } from "react-router-dom";
import { fetchProductById } from "../../REDUX/productSlice";
import { addToCart } from "../../REDUX/cartSlice";
import { toast } from "react-toastify";
import { clearLastInfo } from "../../REDUX/cartSlice";

const money = (n) =>
  Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" }).format(Number(n) || 0);

const ProductDetail = () => {
  const dispatch = useDispatch();
  const { id } = useParams(); 
  const numericId = Number(id);

  // Tomamos el producto seleccionado del Redux store
  const product = useSelector((s) => s.products.details);
  const loading = useSelector((s) => s.products.loading);
  const error = useSelector((s) => s.products.error);    

  const [size, setSize] = useState("100 ml");


  useEffect(() => {
    if (!Number.isFinite(numericId)) return;
    dispatch(fetchProductById(numericId));
  }, [dispatch, numericId]);

  const cartQty = useSelector(
    (s) => s.cart.items.find(i => i.id === Number(id))?.qty || 0
  );
  const remainingStock = Math.max(0, (Number(product?.stock) || 0) - cartQty);

  const price = Number(product?.price) || 0;
  const discount = Number(product?.discount) || 0;
  const hasDiscount = discount > 0;
  const finalPrice = Math.max(0, price * (1 - discount / 100));

  const handleAddToCart = () => {
  if (!product) return;
  if (remainingStock <= 0) return;

  dispatch(addToCart({
    ...product,
    qty: 1,
    size,                 
    }));
  };

  const lastInfo = useSelector(s => s.cart.lastInfo);
useEffect(() => {
  if (!lastInfo) return;
  if (lastInfo.type === "LIMIT_REACHED") {
    toast.warn(`⚠️ Solo ${lastInfo.stock} unidades disponibles de ${lastInfo.name}`, { autoClose: 2000 });
  } else if (lastInfo.type === "ADDED") {
    toast.success(`🛒 ${lastInfo.name} agregado (x${lastInfo.qtyAdded})`, { autoClose: 2000 });
  }
  dispatch(clearLastInfo());
}, [lastInfo, dispatch]);

  if (error) {
    return (
      <>
        <Navbarperfume />
        <div className="container py-5 text-center text-danger">Error: {error}</div>
        <Footer />
      </>
    );
  }

  if (loading || !product || Number(product.id) !== numericId) {
    return (
      <>
        <Navbarperfume />
        <div className="container py-5 text-center text-white">Cargando detalle...</div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbarperfume />
      <div className="product-detail-page container py-4 bg-dark" style={{ backgroundColor: "#000" }}>
        <nav aria-label="breadcrumb" className="mb-3">
          <ol className="breadcrumb bg-transparent p-0 mb-0">
            <li className="breadcrumb-item"><Link to="/landingpage">Inicio</Link></li>
            <li className="breadcrumb-item"><Link to="/productos">Perfumes</Link></li>
            <li className="breadcrumb-item active" aria-current="page">{product.name}</li>
          </ol>
        </nav>

        <div className="row g-4">
          {/* IMAGEN */}
          <div className="col-12 col-md-6">
            <div className="card image-card border-0">
              <div className="card-body p-0 d-flex align-items-center justify-content-center" style={{ background: "#111" }}>
                <img src={product.image} alt={product.name} className="img-fluid" style={{ maxHeight: 380, objectFit: "contain" }} />
              </div>
            </div>
          </div>

          {/* INFORMACIÓN */}
          <div className="col-12 col-md-6">
            <div className="product-info p-3">
              <h1 className="product-title text-white">{product.name}</h1>
              <p className="product-subtitle mb-2 text-white">por EL CÓDIGO, PERFUMERIE</p>

              <div className="d-flex align-items-center mb-3">
                <div className="rating me-3">⭐️⭐️⭐️⭐️☆</div>
                <div className="text-muted">(125 reseñas)</div>
              </div>

              <p className="product-short-desc text-white mb-3">{product.description}</p>

              {/* Precios con/ sin descuento */}
              <div className="d-flex align-items-center mb-3">
                <div className="price text-white me-4">
                  {!hasDiscount ? (
                    <span className="price-figure" style={{ fontSize: "1.4rem", fontWeight: 700 }}>
                      {money(price)}
                    </span>
                  ) : (
                    <div>
                      <div
                        style={{
                          color: "#9a9a9a",
                          textDecoration: "line-through",
                          fontSize: ".95rem",
                          marginBottom: 4,
                        }}
                      >
                        {money(price)}
                      </div>
                      <div className="d-flex align-items-center" style={{ gap: 8 }}>
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
                        >
                          −{discount}%
                        </span>
                        <span style={{ color: "#d4af37", fontWeight: 800, fontSize: "1.4rem" }}>
                          {money(finalPrice)}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="w-100">
                  <label htmlFor="size-select" className="form-label small text-muted">Tamaño</label>
                  <select
                    id="size-select"
                    className="form-select form-select-sm"
                    value={size}
                    onChange={(e) => setSize(e.target.value)}
                    style={{ maxWidth: 220 }}
                  >
                    <option value="50 ml">50 ml</option>
                    <option value="100 ml">100 ml</option>
                    <option value="150 ml">150 ml</option>
                  </select>
                </div>
              </div>

              <div className="mb-3">
                <button className="btn btn-add-to-cart w-100" onClick={handleAddToCart} aria-label="Añadir al carrito" disabled={remainingStock === 0}>
                  
                  <span className="me-2">🛒</span>
  {remainingStock === 0 ? "Sin stock" : "Añadir al Carrito"}
                </button>
              </div>

              <div className="text-muted small">
                <strong>SKU:</strong> {product.id} &nbsp; • &nbsp; <strong>Categoría:</strong> {product.categoryName}
              </div>
            </div>
          </div>
        </div>

        {/* DESCRIPCIÓN DETALLADA (mock) */}
        <div className="product-detail-extra mt-4 p-3">
          <h5 className="mb-3 text-white">Notas Olfativas</h5>
          <ul className="text-white">
            <li><strong>Salida:</strong> Bergamota, Mandarina, Pimienta Rosa</li>
            <li><strong>Corazón:</strong> Jazmín, Peonía, Rosa Turca</li>
            <li><strong>Fondo:</strong> Sándalo, Pachulí, Almizcle Blanco</li>
          </ul>
          <p className="mt-2 mb-0 text-white">
            Inspirado en la mitología griega, <strong>{product.name}</strong> es un tributo a los campos Elíseos.
          </p>
        </div>
      </div>
      <Footer className="mt-3" />
    </>
  );
};

export default ProductDetail;
