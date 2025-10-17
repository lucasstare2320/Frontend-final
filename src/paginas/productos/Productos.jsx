import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ProductCard from "../landingpage/ProductCard";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbarperfume from "../landingpage/NAVBAR/Navbar";
import Footer from "../landingpage/FOOTER/Footer";

// 🧩 importamos las acciones del slice de productos
import {
  fetchProducts,
  createProduct,
} from "../../REDUX/productSlice";

const Productos = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // obtenemos los datos desde redux
  const { items: productos, loading, error } = useSelector((state) => state.products);
  const admin = useSelector((state) => state.user?.admin);

  // estado local para filtros
  const [selectedBrand, setSelectedBrand] = useState("Todas");
  const [priceRange, setPriceRange] = useState([0, 200]);
  const [sortOrder, setSortOrder] = useState("asc");

  // producto nuevo (para admin)
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: 0,
    stock: 0,
    categoryId: "",
    sellerId: "",
  });

  // Cargar productos al montar el componente
  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  // Filtrado
  const filteredProducts = productos
    .filter((p) =>
      selectedBrand === "Todas" ? true : p.category?.name === selectedBrand
    )
    .filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1])
    .sort((a, b) => (sortOrder === "asc" ? a.price - b.price : b.price - a.price));

  // Redirigir al detalle del producto
  const handleProductClick = (product) => {
    navigate(`/detalle/${product.id}`);
  };

  // Agregar al carrito (usa tu reducer de carrito)
  const handleAddToCart = (product) => {
    dispatch({
      type: "ADD_TO_CART",
      payload: {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        qty: 1,
      },
    });
  };

  // Control de inputs para admin
  const handleNewProductChange = (e) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddProduct = () => {
    const body = {
      name: newProduct.name,
      description: newProduct.description,
      price: parseFloat(newProduct.price),
      stock: parseInt(newProduct.stock),
      categoryId: parseInt(newProduct.categoryId),
      sellerId: parseInt(newProduct.sellerId),
    };
    dispatch(createProduct(body));
    setNewProduct({
      name: "",
      description: "",
      price: 0,
      stock: 0,
      categoryId: "",
      sellerId: "",
      discount: 0
    });
  };

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

            {/* Categoría / Marca */}
            <div className="mb-3">
              <label className="form-label">Categoría</label>
              <select
                className="form-select"
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
              >
                <option value="Todas">Todas</option>
                {Array.from(new Set(productos.map((p) => p.category?.name))).map(
                  (type, i) => (
                    <option key={i} value={type}>
                      {type}
                    </option>
                  )
                )}
              </select>
            </div>

            {/* Rango de precio */}
            <div className="mb-3">
              <label className="form-label">
                Precio máximo: {priceRange[1]} €
              </label>
              <input
                type="range"
                className="form-range"
                min="50"
                max="200"
                step="5"
                value={priceRange[1]}
                onChange={(e) =>
                  setPriceRange([priceRange[0], parseInt(e.target.value)])
                }
              />
            </div>

            <div className="mb-3">
              <label className="form-label">
                Precio mínimo: {priceRange[0]} €
              </label>
              <input
                type="range"
                className="form-range"
                min="0"
                max={priceRange[1]}
                step="5"
                value={priceRange[0]}
                onChange={(e) =>
                  setPriceRange([parseInt(e.target.value), priceRange[1]])
                }
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
                  <option value="asc">Precio (ascendente)</option>
                  <option value="desc">Precio (descendente)</option>
                </select>
              </div>
            </div>

            <div className="row g-4">
              {filteredProducts.map((product) => (
                <div
                  className="col-12 col-sm-6 mb-4 col-lg-4"
                  key={product.id}
                  onClick={() => handleProductClick(product)}
                  style={{ cursor: "pointer" }}
                >
                  <ProductCard
                    product={product}
                    onAddToCart={handleAddToCart}
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
