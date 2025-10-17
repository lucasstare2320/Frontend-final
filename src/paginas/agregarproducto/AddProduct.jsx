// Agregarproducto.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbarperfume from "../landingpage/NAVBAR/Navbar";
import Footer from "../landingpage/FOOTER/Footer";

const Agregarproducto = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    brand: "",
    price: "",
    currency: "€",
    descripcion: "",
    gender: "",
    type: "",
    image: "", // almacenará DataURL del archivo subido o URL
    stock: "",
    categoria: "id1", // default: Eau de toilette (id1)
    Descuento: "",
  });

  const [errors, setErrors] = useState({});
  const [preview, setPreview] = useState("");
  const [saving, setSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const numericFields = ["price", "stock", "Descuento"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    let val = value;
    if (numericFields.includes(name)) {
      val = value === "" ? "" : Number(value);
    }
    setForm((p) => ({ ...p, [name]: val }));
  };

  // file input handler -> convierte a DataURL para preview y guardar en el store
  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) {
      setPreview("");
      setForm((p) => ({ ...p, image: "" }));
      return;
    }

    // preview rápido con URL.createObjectURL
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    // convertir a dataURL (base64) para guardar en el producto (mock)
    const reader = new FileReader();
    reader.onload = () => {
      setForm((p) => ({ ...p, image: reader.result }));
    };
    reader.onerror = () => {
      // fallback: si falla, guardar la objectUrl en image
      setForm((p) => ({ ...p, image: objectUrl }));
    };
    reader.readAsDataURL(file);
  };

  const validate = () => {
    const err = {};
    if (!form.name || String(form.name).trim() === "") err.name = "Nombre requerido";
    if (form.price === "" || Number(form.price) <= 0) err.price = "Precio válido requerido (>0)";
    if (form.stock === "" || Number(form.stock) < 0) err.stock = "Stock debe ser >= 0";
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleCancel = () => {
    navigate("/misproductos");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);

    const idToUse = `p-${Date.now()}`; // id autogenerado (mock)

    const productoFinal = {
      ...form,
      id: idToUse,
      price: Number(form.price),
      stock: Number(form.stock || 0),
      Descuento: Number(form.Descuento || 0),
      currency: form.currency || "€",
      descripcion: form.descripcion || "",
      gender: form.gender || "",
      type: form.type || "",
      image:
        form.image && String(form.image).trim().length > 0
          ? form.image
          : "https://via.placeholder.com/400x300?text=No+image",
      idcategoria: form.categoria, // mantenemos la clave que usa el resto del app
    };

    // Dispatch a product-add action for your app to catch.
    dispatch({ type: "ADD_ADMIN_PRODUCT", payload: productoFinal });

    // mostrar toast breve antes de redirigir para mejor UX
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
      setSaving(false);
      navigate("/misproductos");
    }, 900);
  };

  return (
    <>
      <Navbarperfume />
      <div className="container my-4" style={{ minHeight: "70vh" }}>
        <div className="row justify-content-center">
          <div className="col-12 col-md-10 col-lg-8">
            <div className="card" style={{ background: "#0b0b0b", border: "1px solid rgba(212,175,55,0.12)" }}>
              <div className="card-body p-4">
                <h4 style={{ color: "#d4af37" }}>Agregar producto</h4>
                <p className="text-white small">Completá los datos para crear un producto nuevo.</p>

                <form onSubmit={handleSubmit}>
                  <div className="row g-2">
                    <div className="col-12 col-md-6">
                      <label className="form-label small text-white">Nombre *</label>
                      <input
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        className={`form-control form-control-sm ${errors.name ? "is-invalid" : ""}`}
                        placeholder="Nombre del producto"
                      />
                      {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                    </div>

                    <div className="col-12 col-md-6">
                      <label className="form-label small text-white">Marca</label>
                      <input name="brand" value={form.brand} onChange={handleChange} className="form-control form-control-sm" placeholder="Marca" />
                    </div>

                    <div className="col-6 col-md-3">
                      <label className="form-label small text-white">Precio *</label>
                      <input name="price" value={form.price} onChange={handleChange} type="number" step="0.01" className={`form-control form-control-sm ${errors.price ? "is-invalid" : ""}`} />
                      {errors.price && <div className="invalid-feedback">{errors.price}</div>}
                    </div>

                    <div className="col-6 col-md-3">
                      <label className="form-label small text-white">Moneda</label>
                      <input name="currency" value={form.currency} onChange={handleChange} className="form-control form-control-sm" />
                    </div>

                    <div className="col-12 col-md-6">
                      <label className="form-label small text-white">Stock *</label>
                      <input name="stock" value={form.stock} onChange={handleChange} type="number" className={`form-control form-control-sm ${errors.stock ? "is-invalid" : ""}`} />
                      {errors.stock && <div className="invalid-feedback">{errors.stock}</div>}
                    </div>

                    <div className="col-12 col-md-6">
                      <label className="form-label small text-white">Descuento (%)</label>
                      <input name="Descuento" value={form.Descuento} onChange={handleChange} type="number" className="form-control form-control-sm" />
                    </div>

                    <div className="col-12">
                      <label className="form-label small text-white">Descripción</label>
                      <textarea name="descripcion" value={form.descripcion} onChange={handleChange} className="form-control form-control-sm" rows={2} />
                    </div>

                    <div className="col-6 col-md-4">
                      <label className="form-label small text-white">Género</label>
                      <input name="gender" value={form.gender} onChange={handleChange} className="form-control form-control-sm" placeholder="Femenino / Masculino / Unisex" />
                    </div>

                    <div className="col-6 col-md-4">
                      <label className="form-label small text-white">Tipo (texto libre)</label>
                      <input name="type" value={form.type} onChange={handleChange} className="form-control form-control-sm" />
                    </div>

                    <div className="col-6 col-md-4">
                      <label className="form-label small text-white">Categoría *</label>
                      <select name="categoria" value={form.categoria} onChange={handleChange} className="form-select form-select-sm">
                        <option value="id1">Eau de toilette (id1)</option>
                        <option value="id2">Eau de parfum (id2)</option>
                        <option value="id3">Parfum (id3)</option>
                      </select>
                    </div>

                    <div className="col-12 col-md-8">
                      <label className="form-label small text-white">Imagen (subir archivo)</label>
                      <input type="file" accept="image/*" className="form-control form-control-sm" onChange={handleFileChange} />
                      <div className="small text-white mt-1">Se guarda un preview local (base64) para pruebas.</div>
                    </div>

                    <div className="col-12 col-md-4 d-flex align-items-center">
                      <div style={{ width: 90, height: 90, borderRadius: 8, overflow: "hidden", background: "#111", border: "1px solid rgba(255,255,255,0.03)" }}>
                        <img
                          src={preview || form.image || "https://via.placeholder.com/90x90?text=IMG"}
                          alt="preview"
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                          onError={(e) => (e.target.src = "https://via.placeholder.com/90x90?text=IMG")}
                        />
                      </div>
                      <div className="ms-3 small text-white">
                        Preview
                      </div>
                    </div>
                  </div>

                  <div className="d-flex gap-2 justify-content-end mt-3">
                    <button type="button" className="btn btn-secondary" onClick={handleCancel} disabled={saving}>
                      Cancelar
                    </button>
                    <button type="submit" className="btn btn-warning" disabled={saving}>
                      {saving ? "Guardando..." : "Agregar producto"}
                    </button>
                  </div>
                </form>

                {/* toast inline */}
                {showToast && (
                  <div style={{
                    position: "fixed",
                    right: 18,
                    bottom: 18,
                    background: "rgba(212,175,55,0.95)",
                    color: "#000",
                    padding: "10px 14px",
                    borderRadius: 8,
                    boxShadow: "0 6px 18px rgba(0,0,0,0.5)",
                    zIndex: 9999,
                  }}>
                    Producto agregado ✅
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Agregarproducto;
