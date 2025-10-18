import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ProductCard from "../landingpage/ProductCard";
import Navbarperfume from "../landingpage/NAVBAR/Navbar";
import Footer from "../landingpage/FOOTER/Footer";
import { toast } from "react-toastify";

import { fetchProducts, createProduct } from "../../REDUX/productSlice";
import { fetchCategories } from "../../REDUX/categorySlice"; // 👈 importar thunk
import { addToCart, clearLastInfo } from "../../REDUX/cartSlice";

const Productos = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { items: productos, loading, error } = useSelector((s) => s.products);
  const { items: categorias } = useSelector((s) => s.categories); // 👈 categorías del store
  const lastInfo = useSelector((s) => s.cart.lastInfo);

  // filtros
  const [selectedCategoryId, setSelectedCategoryId] = useState("all"); // "all" | number
  const [priceRange, setPriceRange] = useState([0, 0]);
  const [maxPrice, setMaxPrice] = useState(0);
  const [sortOrder, setSortOrder] = useState("asc");

  // cargar productos + categorías
  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchCategories());
  }, [dispatch]);

  // helper precio con descuento
  const getDiscountedPrice = (p) => {
    const price = Number(p?.price) || 0;
    const discount = Number(p?.discount) || 0;
    return Math.max(0, price * (1 - discount / 100));
  };

  // setear max del slider dinámico
  useEffect(() => {
    if (!productos || productos.length === 0) return;
    const max = Math.max(...productos.map(getDiscountedPrice));
    setMaxPrice(max);
    setPriceRange([0, max]);
  }, [productos]);

  // filtrar + ordenar
  const filteredProducts = useMemo(() => {
    return (productos || [])
      .filter((p) =>
        selectedCategoryId === "all"
          ? true
          : Number(p.categoryId) === Number(selectedCategoryId) ||
            p.categoryName === categorias.find(c => c.id === Number(selectedCategoryId))?.name
      )
      .filter((p) => {
        const finalPrice = getDiscountedPrice(p);
        return finalPrice >= priceRange[0] && finalPrice <= priceRange[1];
      })
      .sort((a, b) => {
        const pa = getDiscountedPrice(a);
        const pb = getDiscountedPrice(b);
        return sortOrder === "asc" ? pa - pb : pb - pa;
      });
  }, [productos, selectedCategoryId, priceRange, sortOrder, categorias]);

  const handleProductClick = (id) => navigate(`/detalle/${id}`);

  const handleAddToCart = (product) => {
    dispatch(addToCart({ ...product, qty: 1 }));
  };

  useEffect(() => {
    if (!lastInfo) return;
    if (lastInfo.type === "LIMIT_REACHED") {
      toast.warn(`⚠️ Solo ${lastInfo.stock} unidades disponibles de ${lastInfo.name}`, { autoClose: 2000 });
    } else if (lastInfo.type === "ADDED") {
      toast.success(`🛒 ${lastInfo.name} agregado (x${lastInfo.qtyAdded})`, { autoClose: 2000 });
    }
    dispatch(clearLastInfo());
  }, [lastInfo, dispatch]);

  if (loading) return <p className="text-white text-center">Cargando productos...</p>;
  if (error) return <p className="text-danger text-center">Error: {error}</p>;

  return (
    <>
      <Navbarperfume />
      <div className="container-fluid py-4" style={{ backgroundColor: "#000" }}>
        <div className="row">
          {/* Filtros */}
          <aside className="col-md-3 text-white mb-4">
            <h4 className="mb-3" style={{ color: "#d4af37" }}>Filtros</h4>

            {/* Categoría */}
            <div className="mb-3">
              <label className="form-label">Categoría</label>
              <select
                className="form-select"
                value={selectedCategoryId}
                onChange={(e) => {
                  const val = e.target.value;
                  setSelectedCategoryId(val === "all" ? "all" : Number(val));
                }}
              >
                <option value="all">Todas</option>
                {categorias.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Rango de precio con descuento */}
            <div className="mb-3">
              <label className="form-label">Precio máximo: ${Math.ceil(priceRange[1])}</label>
              <input
                type="range"
                className="form-range"
                min="0"
                max={Math.ceil(maxPrice)}
                step="5"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Precio mínimo: ${priceRange[0]}</label>
              <input
                type="range"
                className="form-range"
                min="0"
                max={priceRange[1]}
                step="5"
                value={priceRange[0]}
                onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
              />
            </div>
          </aside>

          {/* Listado */}
          <main className="col-md-9">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h3 className="text-white">Perfumes</h3>
              <div>
                <label className="me-2 text-white">Ordenar por:</label>
                <select
                  className="form-select d-inline-block w-auto"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                >
                  <option value="asc">Precio ascendente</option>
                  <option value="desc">Precio descendente</option>
                </select>
              </div>
            </div>

            <div className="row g-4">
              {filteredProducts.map((product) => (
                <div
                  className="col-12 col-sm-6 mb-4 col-lg-4"
                  key={product.id}
                  onClick={() => handleProductClick(product.id)}
                  style={{ cursor: "pointer" }}
                >
                  <ProductCard
                    product={product}
                    onAddToCart={() => handleAddToCart(product)}
                  />
                </div>
              ))}
            </div>
          </main>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Productos;
