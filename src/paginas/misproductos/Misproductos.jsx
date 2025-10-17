import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbarperfume from "../landingpage/NAVBAR/Navbar";
import Footer from "../landingpage/FOOTER/Footer";

const Misproductos = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [sortOrder, setSortOrder] = useState("asc");

  const productosData = [
    {
      id: "chanel-n5",
      name: "Chanel N°5",
      brand: "Chanel",
      price: 135,
      currency: "€",
      descripcion: "El clásico eterno de Chanel.",
      gender: "Femenino",
      type: "Eau de Parfum",
      image:
        "https://images.unsplash.com/photo-1616627989394-7e3f0e8c5c2e?auto=format&fit=crop&w=800&q=60",
      stock: 10,
      idcategoria: "",
      Descuento: 0,
    },
    {
      id: "dior-jadore",
      name: "J’adore",
      brand: "Dior",
      price: 120,
      currency: "€",
      descripcion: "Fragancia floral luminosa.",
      gender: "Femenino",
      type: "Eau de Parfum",
      image:
        "https://images.unsplash.com/photo-1607083206173-0c2f5b8f9e3d?auto=format&fit=crop&w=800&q=60",
      stock: 8,
      idcategoria: "",
      Descuento: 0,
    },
    {
      id: "lancome-vie",
      name: "La Vie Est Belle",
      brand: "Lancôme",
      price: 150,
      currency: "€",
      descripcion: "La vida es bella con Lancôme.",
      gender: "Femenino",
      type: "Eau de Parfum",
      image:
        "https://images.unsplash.com/photo-1586871011698-6d78f8051cbb?auto=format&fit=crop&w=800&q=60",
      stock: 5,
      idcategoria: "",
      Descuento: 0,
    },
    {
      id: "ysl-opium",
      name: "Black Opium",
      brand: "Yves Saint Laurent",
      price: 130,
      currency: "€",
      descripcion: "Intensa y adictiva.",
      gender: "Femenino",
      type: "Eau de Parfum",
      image:
        "https://images.unsplash.com/photo-1591471756638-6eaef76bd66d?auto=format&fit=crop&w=800&q=60",
      stock: 7,
      idcategoria: "",
      Descuento: 0,
    },
    {
      id: "dg-lightblue",
      name: "Light Blue",
      brand: "Dolce & Gabbana",
      price: 110,
      currency: "€",
      descripcion: "Fresca y mediterránea.",
      gender: "Femenino",
      type: "Eau de Toilette",
      image:
        "https://images.unsplash.com/photo-1574607380899-525b8d0aee22?auto=format&fit=crop&w=800&q=60",
      stock: 12,
      idcategoria: "",
      Descuento: 0,
    },
    {
      id: "ch-goodgirl",
      name: "Good Girl",
      brand: "Carolina Herrera",
      price: 125,
      currency: "€",
      descripcion: "Atrevida y sofisticada.",
      gender: "Femenino",
      type: "Eau de Parfum",
      image:
        "https://images.unsplash.com/photo-1581067725929-ce1960cdd42d?auto=format&fit=crop&w=800&q=60",
      stock: 6,
      idcategoria: "",
      Descuento: 0,
    },
  ];

  const [productos, setProductos] = useState(productosData);

  const handleProductClick = (product) => {
    dispatch({ type: "SET_SELECTED_PRODUCT", payload: product });
    navigate(`/detalle/${product.id}`);
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
        qty: 1,
      },
    });
  };

  const sortedProducts = [...productos].sort((a, b) => {
    if (sortOrder === "asc") return a.price - b.price;
    return b.price - a.price;
  });

  const toggleSortOrder = () => setSortOrder((s) => (s === "asc" ? "desc" : "asc"));

  // ---------- EDIT modal state ----------
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const openEditModal = (product, e) => {
    if (e) e.stopPropagation();
    setEditingProduct({ ...product });
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setEditingProduct(null);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    // numbers for price, stock, Descuento
    const numeric = ["price", "stock", "Descuento"];
    setEditingProduct((p) => ({
      ...p,
      [name]: numeric.includes(name) ? (value === "" ? "" : Number(value)) : value,
    }));
  };

  const saveEditedProduct = () => {
    if (!editingProduct.name || editingProduct.name.trim() === "") {
      alert("El producto necesita un nombre.");
      return;
    }
    setProductos((prev) =>
      prev.map((p) => (p.id === editingProduct.id ? { ...editingProduct } : p))
    );
    setShowEditModal(false);
    setEditingProduct(null);
  };

  // ---------- DELETE confirm modal ----------
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  const confirmDelete = (product, e) => {
    if (e) e.stopPropagation();
    setProductToDelete(product);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = () => {
    if (productToDelete) {
      setProductos((prev) => prev.filter((p) => p.id !== productToDelete.id));
    }
    setShowDeleteConfirm(false);
    setProductToDelete(null);
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
    setProductToDelete(null);
  };

  // ---------- Add product (navigate to a separate view) ----------
  const goAddProduct = () => {
    navigate("/misproductos/nuevo"); // ruta para que implementes la vista de creación
  };

  // Inline styles for modals/backdrops
  const backdropStyle = {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(0,0,0,0.45)",
    zIndex: 9999,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  const modalStyle = {
    background: "#0b0b0b",
    color: "#fff",
    padding: "18px",
    borderRadius: "10px",
    width: "92%",
    maxWidth: "640px",
    boxShadow: "0 8px 30px rgba(0,0,0,0.6)",
    border: "1px solid rgba(212,175,55,0.08)",
    maxHeight: "90vh",
    overflowY: "auto",
  };

  const smallModalStyle = { ...modalStyle, maxWidth: 420 };

  return (
    <>
      <Navbarperfume />
      <div className="container-fluid py-4" style={{ backgroundColor: "#000" }}>
        <div className="row">
          <main className="col-md-9 mx-auto">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h3 className="text-white">Mis Perfumes</h3>
              <div>
                <button className="btn btn-sm btn-outline-light me-2" onClick={toggleSortOrder}>
                  Ordenar por precio: {sortOrder === "asc" ? "Asc" : "Desc"}
                </button>
                
                  <button className="btn btn-sm btn-warning" onClick={goAddProduct}>
                    + Añadir producto
                  </button>
                
              </div>
            </div>

            <div className="row g-4">
              {sortedProducts.map((product) => (
                <div
                  className="col-12 col-sm-6 mb-4 col-lg-4"
                  key={product.id}
                  onClick={() => handleProductClick(product)}
                  style={{ cursor: "pointer" }}
                >
                  <div className="card h-100 shadow-sm">
                    <div style={{ height: 200, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <img
                        src={product.image}
                        alt={product.name}
                        style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "cover" }}
                        onError={(e) => (e.target.src = "https://via.placeholder.com/400x300?text=No+image")}
                      />
                    </div>
                    <div className="card-body p-3">
                      <h6 className="card-title mb-1 text-white" style={{ fontSize: 16 }}>{product.name}</h6>
                      <p className="mb-1 text-white" style={{ fontSize: 13 }}>{product.brand}</p>
                      <div className="d-flex text-white justify-content-between align-items-center mt-2">
                        <span className="fw-bold text-white">{product.price}{product.currency || "€"}</span>
                        <small className="text-white">Stock: {product.stock ?? 0}</small>
                      </div>
                    </div>

                    
                      <div className="d-flex justify-content-between p-2 m-1" style={{ gap: 6 }}>
                        <button
                          className="btn btn-sm btn-outline-warning"
                          onClick={(e) => openEditModal(product, e)}
                        >
                          Editar
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={(e) => confirmDelete(product, e)}
                        >
                          Eliminar
                        </button>
                      </div>
                    
                  </div>
                </div>
              ))}
            </div>
          </main>
        </div>
      </div>
      <Footer />

      {/* EDIT MODAL */}
      {showEditModal && editingProduct && (
        <div style={backdropStyle} onClick={closeEditModal}>
          <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
            <h5 style={{ color: "#d4af37" }}>Editar producto</h5>

            <div className="row g-2 mt-2">
              {[
                { name: "id", label: "ID", type: "text", readOnly: true },
                { name: "name", label: "Nombre", type: "text" },
                { name: "brand", label: "Marca", type: "text" },
                { name: "price", label: "Precio", type: "number" },
                { name: "currency", label: "Moneda", type: "text" },
                { name: "stock", label: "Stock", type: "number" },
                { name: "Descuento", label: "Descuento", type: "number" },
                { name: "descripcion", label: "Descripción", type: "text" },
                { name: "gender", label: "Género", type: "text" },
                { name: "type", label: "Tipo", type: "text" },
                { name: "image", label: "Imagen (URL)", type: "text" },
              ].map((f) => (
                <div className="col-12 col-md-6" key={f.name}>
                  <label className="form-label small text-muted">{f.label}</label>
                  <input
                    className="form-control form-control-sm"
                    name={f.name}
                    type={f.type}
                    readOnly={f.readOnly}
                    value={editingProduct[f.name] ?? ""}
                    onChange={handleEditChange}
                  />
                </div>
              ))}
            </div>

            <div className="mt-3 d-flex justify-content-end" style={{ gap: 8 }}>
              <button className="btn btn-secondary" onClick={closeEditModal}>Cancelar</button>
              <button className="btn btn-warning" onClick={saveEditedProduct}>Guardar cambios</button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRM MODAL */}
      {showDeleteConfirm && productToDelete && (
        <div style={backdropStyle} onClick={handleCancelDelete}>
          <div style={smallModalStyle} onClick={(e) => e.stopPropagation()}>
            <h5 style={{ marginTop: 0 }}>Confirmar eliminación</h5>
            <p>
              ¿Seguro que querés eliminar <strong>{productToDelete.name}</strong>?
            </p>

            <div className="d-flex justify-content-end" style={{ gap: 8 }}>
              <button className="btn btn-secondary" onClick={handleCancelDelete}>Cancelar</button>
              <button className="btn btn-danger" onClick={handleConfirmDelete}>Sí, eliminar</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Misproductos;
