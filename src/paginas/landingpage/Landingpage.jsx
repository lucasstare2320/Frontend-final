import React, { useEffect, useMemo } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./LandingPage.css";
import ProductCard from "./ProductCard";
import Footer from "./FOOTER/Footer";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import Navbarperfume from "./NAVBAR/Navbar";
import { fetchProducts } from "../../REDUX/productSlice";
const LandingPage = ({ featuredProducts }) => {
  const dispatch = useDispatch();
     const navigate = useNavigate()
  
  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const categories = [
    {
      title: "Para Ella",
      image: "https://images.pexels.com/photos/1961789/pexels-photo-1961789.jpeg?auto=compress&cs=tinysrgb&w=1200", // floral, elegante
    },
    {
      title: "Para Él",
      image: "https://images.pexels.com/photos/3989394/pexels-photo-3989394.jpeg?auto=compress&cs=tinysrgb&w=1200", // tono masculino
    },
  ];

  const allProducts = useSelector((s) => s.products.items || []);
  const featured = useMemo(() => {
    if (!allProducts.length) return [];
    const topDiscount = [...allProducts]
       .sort((a, b) => (Number(b.discount || 0) - Number(a.discount || 0)))
       .slice(0, 4);
    return topDiscount;
  }, [allProducts]);



 

 const handleProductClick = (id) => navigate(`/detalle/${id}`);


    const handleAddToCart = (product) => {
       dispatch(addToCart({ ...product, qty: 1 }));
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
  src="https://images.pexels.com/photos/3059609/pexels-photo-3059609.jpeg?auto=compress&cs=tinysrgb&w=1600"
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
  src="https://images.pexels.com/photos/1961791/pexels-photo-1961791.jpeg?auto=compress&cs=tinysrgb&w=1600"
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
  src="https://images.pexels.com/photos/1557980/pexels-photo-1557980.jpeg?auto=compress&cs=tinysrgb&w=1600"
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
          <h2 id="featured-title" className="section-title mb-4">Los Más Deseados</h2>

          <div className="row">
            {featured.map((product) => (
              <div
                className="col-6 col-md-3 mb-4 d-flex align-items-stretch"
                key={product.id}
                onClick={() => handleProductClick(product.id)}
                style={{ cursor: "pointer" }}
              >
                <div className="w-100">
                  <ProductCard product={product}  onAddToCart={() => handleAddToCart(product)} />
                </div>
              </div>
            ))}

            {/* Fallback si hay menos de 4 productos disponibles */}
            {featured.length === 0 && (
              <div className="text-white-50">No hay productos destacados por ahora.</div>
            )}
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
