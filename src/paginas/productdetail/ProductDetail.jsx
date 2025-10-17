import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import "bootstrap/dist/css/bootstrap.min.css";
import "./ProductDetail.css";
import Navbarperfume from "../landingpage/NAVBAR/Navbar";
import Footer from "../landingpage/FOOTER/Footer";

const ProductDetail = () => {
  const dispatch = useDispatch();

  // Tomamos el producto seleccionado del Redux store
  const product = useSelector((state) => state.selectedProduct);

  const [size, setSize] = useState("100 ml");
  const [mainImage, setMainImage] = useState(product ? product.image : "");

  // Si el producto cambia en el store, actualizar mainImage
  useEffect(() => {
    if (product) setMainImage(product.image);
  }, [product]);

  if (!product) {
    return (
      <>
        <Navbarperfume />
        <div className="py-5 text-center" style={{ backgroundColor: "#000", minHeight: "60vh" }}>
          <p style={{ color: "#fff", marginTop: "2rem" }}>
            Selecciona un producto para ver los detalles.
          </p>
        </div>
        <Footer />
      </>
    );
  }

  // Añadir al carrito: toma el producto del store y agrega campos relevantes
  const handleAddToCart = () => {
    dispatch({
      type: "ADD_TO_CART",
      payload: {
        id: product.id,
        name: product.name,
        brand: product.brand,
        price: product.price,
        currency: product.currency,
        image: product.image,
        qty: 1,            // cantidad inicial
        size,              // incluye la selección actual de tamaño
        type: product.type // opcional: útil para variantes
      },
    });
  };

  return (
    <>
      <Navbarperfume />
      <div className="product-detail-page container py-4 bg-dark" style={{ backgroundColor: "#000" }}>
        <nav aria-label="breadcrumb" className="mb-3">
          <ol className="breadcrumb bg-transparent p-0 mb-0">
            <li className="breadcrumb-item"><a href="/">Inicio</a></li>
            <li className="breadcrumb-item"><a href="/perfumes">Perfumes</a></li>
            <li className="breadcrumb-item active" aria-current="page">{product.name}</li>
          </ol>
        </nav>

        <div className="row g-4">
          {/* IMAGEN + MINIATURAS */}
          <div className="col-12 col-md-6">
            <div className="card image-card border-0">
              <div className="card-body p-0">
                <img src={mainImage} alt={product.name} className="img-fluid main-image" />
                <div className="d-flex gap-2 mt-3 thumbnail-row">
                  {[0, 1, 2].map((i) => (
                    <button
                      key={i}
                      className="thumb-btn"
                      onClick={() => setMainImage(product.image)}
                      aria-label={`miniatura ${i + 1}`}
                    >
                      <img src={product.image} alt={`${product.name}-thumb-${i}`} className="thumb-img" />
                    </button>
                  ))}
                </div>
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

              <p className="product-short-desc text-white mb-3">{product.descripcion}</p>

              <div className="d-flex align-items-center mb-3">
                <div className="price text-white me-4">
                  <span className="price-figure">{product.price}{product.currency}</span>
                </div>

                <div className="w-100">
                  <label htmlFor="size-select" className="form-label small text-muted">Tamaño</label>
                  <select
                    id="size-select"
                    className="form-select form-select-sm"
                    value={size}
                    onChange={(e) => setSize(e.target.value)}
                    style={{ maxWidth: "220px" }}
                  >
                    <option value="50 ml">50 ml</option>
                    <option value="100 ml">100 ml</option>
                    <option value="150 ml">150 ml</option>
                  </select>
                </div>
              </div>

              <div className="mb-3">
                <button
                  className="btn btn-add-to-cart w-100"
                  onClick={handleAddToCart}
                  aria-label="Añadir al carrito"
                >
                  <span className="me-2">🛒</span> Añadir al Carrito
                </button>
              </div>

              <div className="text-muted small">
                <strong>SKU:</strong> {product.id} &nbsp; • &nbsp; <strong>Marca:</strong> {product.brand}
              </div>
            </div>
          </div>
        </div>

        {/* DESCRIPCIÓN DETALLADA */}
        <div className="product-detail-extra mt-4 p-3">
          <h5 className="mb-3 text-white">Notas Olfativas</h5>
          <ul className="text-white">
            <li><strong>Salida:</strong> Bergamota, Mandarina, Pimienta Rosa</li>
            <li><strong>Corazón:</strong> Jazmín, Peonía, Rosa Turca</li>
            <li><strong>Fondo:</strong> Sándalo, Pachulí, Almizcle Blanco</li>
          </ul>

          <p className="mt-2 mb-0 text-white">
            Inspirado en la mitología griega, <strong>{product.name}</strong> es un tributo a los campos Elíseos,
            un paraíso donde los héroes descansaban eternamente. Cada nota ha sido seleccionada para evocar una
            sensación de paz, belleza y heroísmo atemporal.
          </p>
        </div>
      </div>
      <Footer className="mt-3" />
    </>
  );
};

export default ProductDetail;