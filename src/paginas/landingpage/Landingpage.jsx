import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./LandingPage.css";
import ProductCard from "./ProductCard";
import Footer from "./FOOTER/Footer";
import { useDispatch } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import Navbarperfume from "./NAVBAR/Navbar";
const LandingPage = ({ featuredProducts }) => {
  const dispatch = useDispatch();
     const navigate = useNavigate()
  

  // PROPS definisiones en estilo "json" que despues mapeamos para ahorrar codigo
  const categories = [
    {
      title: "Para Ella",
      image:
        "https://images.unsplash.com/photo-1616627989394-7e3f0e8c5c2e?auto=format&fit=crop&w=1200&q=60",
    },
    {
      title: "Para Él",
      image:
        "https://images.unsplash.com/photo-1600180758890-3c6b3f8b3e4c?auto=format&fit=crop&w=1200&q=60",
    },
  ];

  // Ejemplo de productos, tenemos que despues remplazar esto por un fetch que modifica un usestate
  const defaultProducts = [
    {
      id: "chanel-no5",
      name: "Chanel No. 5",
      brand: "Chanel",
      price: 150,
      currency: "€",
      descripcion: "TEXTO EJEMLPO descripcion 1",
      image:
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=60",
    },
    {
      id: "dior-sauvage",
      name: "Dior Sauvage",
      brand: "Dior",
      price: 120,
      currency: "€",
      descripcion: "TEXTO EJEMLPO descripcion 2",
      image:
        "https://images.unsplash.com/photo-1560347876-aeef00ee58a1?auto=format&fit=crop&w=800&q=60",
    },
    {
      id: "creed-aventus",
      name: "Creed Aventus",
      brand: "Creed",
      price: 250,
      currency: "€",
      descripcion: "TEXTO EJEMLPO descripcion 3",
      image:
        "https://images.unsplash.com/photo-1584270354949-6f80f5b76b0b?auto=format&fit=crop&w=800&q=60",
    },
    {
      id: "jo-malone",
      name: "Jo Malone London",
      brand: "Jo Malone",
      price: 130,
      currency: "€",
      descripcion: "TEXTO EJEMLPO descripcion 4",
      image:
        "https://images.unsplash.com/photo-1599947286041-a7b1d2f6a4a6?auto=format&fit=crop&w=800&q=60",
    },
  ];

  const products =
    Array.isArray(featuredProducts) && featuredProducts.length
      ? featuredProducts
      : defaultProducts;

  // Handler que despacha la acción si se hizo click en la img
  const handleProductClick = (e, product) => {
    // e.target puede ser la imagen o un elemento dentro del ProductCard.
    // Usamos closest para detectar si hubo click sobre una <img> dentro del contenedor.
    const img = e.target.tagName && e.target.tagName.toLowerCase() === "img"
      ? e.target
      : e.target.closest && e.target.closest("img");
    if (img) {
      dispatch({ type: "SET_SELECTED_PRODUCT", payload: product });
      //esto manda el producto al reducer, para que este guardado para el detalle
    }

    //despues te lleva al detalle
    navigate(`/detalle/:${product.id}`) // CAMBIAR A FUTURO por el id del producto del fetch
  };


      const handleAddToCart = (product) => {
    dispatch({
      type: "ADD_TO_CART",
      payload: {
        id: product.id,
        name: product.name,
        brand: product.brand,
        price: product.price,
        currency: product.currency,
        image: product.image,
        qty: 1, // cantidad inicial
      },
    });
  };



  return (
    <div className="bg-dark-page">
        <Navbarperfume></Navbarperfume>
      <main className="container pb-5">
        {/* CAROUSEL */}
        <section className="mb-5 hero-section">
          <div id="heroCarousel" className="carousel slide" data-bs-ride="carousel">
            <div className="carousel-inner">
              {/* Slide 1 */}
              <div className="carousel-item active">
                <img
                  src="https://via.placeholder.com/1200x500?text=Slide+1"
                  className="d-block w-100"
                  alt="Slide 1"
                  style={{ objectFit: "cover", height: "60vh" }}
                />
                <div
                  className="carousel-caption d-none d-md-block"
                  style={{ backgroundColor: "rgba(0,0,0,0.3)", borderRadius: "0.5rem" }}
                >
                  <h5 style={{ fontSize: "clamp(1.5rem, 4vw, 2.5rem)" }}>Bienvenido a Nuestro Sitio</h5>
                  <p style={{ fontSize: "clamp(1rem, 2.5vw, 1.25rem)" }}>
                    Descubre productos increíbles todos los días
                  </p>
                </div>
              </div>

              {/* Slide 2 */}
              <div className="carousel-item">
                <img
                  src="https://via.placeholder.com/1200x500?text=Slide+2"
                  className="d-block w-100"
                  alt="Slide 2"
                  style={{ objectFit: "cover", height: "60vh" }}
                />
                <div
                  className="carousel-caption d-none d-md-block"
                  style={{ backgroundColor: "rgba(0,0,0,0.3)", borderRadius: "0.5rem" }}
                >
                  <h5 style={{ fontSize: "clamp(1.5rem, 4vw, 2.5rem)" }}>Ofertas Especiales</h5>
                  <p style={{ fontSize: "clamp(1rem, 2.5vw, 1.25rem)" }}>
                    Aprovecha descuentos exclusivos cada semana
                  </p>
                </div>
              </div>

              {/* Slide 3 */}
              <div className="carousel-item">
                <img
                  src="https://via.placeholder.com/1200x500?text=Slide+3"
                  className="d-block w-100"
                  alt="Slide 3"
                  style={{ objectFit: "cover", height: "60vh" }}
                />
                <div
                  className="carousel-caption d-none d-md-block"
                  style={{ backgroundColor: "rgba(0,0,0,0.3)", borderRadius: "0.5rem" }}
                >
                  <h5 style={{ fontSize: "clamp(1.5rem, 4vw, 2.5rem)" }}>Nuevos Productos</h5>
                  <p style={{ fontSize: "clamp(1rem, 2.5vw, 1.25rem)" }}>Explora lo último que tenemos para ti</p>
                </div>
              </div>
            </div>

            {/* Controles */}
            <button
              className="carousel-control-prev"
              type="button"
              data-bs-target="#heroCarousel"
              data-bs-slide="prev"
            >
              <span className="carousel-control-prev-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Anterior</span>
            </button>
            <button
              className="carousel-control-next"
              type="button"
              data-bs-target="#heroCarousel"
              data-bs-slide="next"
            >
              <span className="carousel-control-next-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Siguiente</span>
            </button>

            {/* Indicadores */}
            <div className="carousel-indicators">
              <button
                type="button"
                data-bs-target="#heroCarousel"
                data-bs-slide-to="0"
                className="active"
                aria-current="true"
                aria-label="Slide 1"
              ></button>
              <button type="button" data-bs-target="#heroCarousel" data-bs-slide-to="1" aria-label="Slide 2"></button>
              <button type="button" data-bs-target="#heroCarousel" data-bs-slide-to="2" aria-label="Slide 3"></button>
            </div>
          </div>
        </section>

        {/* CATEGORIES */}
        <section className="row g-3 mb-5">
          {categories.map((cat, i) => (
            <article className="col-12 col-md-6" key={cat.title + i}>
              <div className="category-card">
                <img src={cat.image} alt={cat.title} className="category-img" />
                <div className="category-overlay">
                  <h3>{cat.title}</h3>
                </div>
              </div>
            </article>
          ))}
        </section>

        {/* Featured Products */}
        <section aria-labelledby="featured-title" className="mb-5">
          <h2 id="featured-title" className="section-title mb-4">
            Los Más Deseados
          </h2>

          <div className="row">
            {products.map((product) => (
              <div
                className="col-6 col-md-3 mb-4 d-flex align-items-stretch"
                key={product.id}
                onClick={(e) => handleProductClick(e, product)}
                style={{ cursor: "pointer" }}
              >
                <div className="w-100">
                  {/* Usamos tu ProductCard tal cual (no modificar) */}
                                    <ProductCard product={product} onAddToCart={handleAddToCart} />

                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Newsletter */}
        <section className="newsletter-box mb-5">
          <div className="row align-items-center">
            <div className="col-md-8 mb-3 mb-md-0">
              <h4 className="mb-1 newsletter-title">Únete a nuestro club exclusivo</h4>
              <p className="mb-0 newsletter-desc">
                Recibe un 10% de descuento en tu primera compra y sé el primero en conocer nuestras novedades.
              </p>
            </div>

            <div className="col-md-4">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const el = e.target.querySelector("input[type='email']");
                  if (el && el.value) {
                    alert(`Gracias! ${el.value} suscrito.`);
                    el.value = "";
                  }
                }}
                className="d-flex gap-2"
                aria-label="Suscripción newsletter"
              >
                <input
                  type="email"
                  required
                  placeholder="Tu correo electrónico"
                  className="newsletter-input"
                  aria-label="Correo electrónico"
                />
                <button type="submit" className="btn gold-btn">
                  Suscribirse
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
