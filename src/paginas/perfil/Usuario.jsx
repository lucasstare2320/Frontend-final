import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbarperfume from "../landingpage/NAVBAR/Navbar";
import Footer from "../landingpage/FOOTER/Footer";

const Usuario = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  // Profile editing
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    nombre: "",
    email: "",
  });

  // Addresses
  const [addresses, setAddresses] = useState([]); // lista de direcciones
  const [editingAddressIndex, setEditingAddressIndex] = useState(-1); // índice de la dirección en edición (-1 ninguna)
  const [addressForm, setAddressForm] = useState({
    label: "",
    calle: "",
    ciudad: "",
    codigoPostal: "",
    pais: "",
    telefono: "",
  });

  useEffect(() => {
    // inicializar formularios cuando cambia el user
    setProfileForm({
      nombre: user?.nombre ?? user?.name ?? "",
      email: user?.email ?? "",
    });

    setAddresses(user?.addresses ? [...user.addresses] : []);
    setEditingProfile(false);
    setEditingAddressIndex(-1);
    setAddressForm({
      label: "",
      calle: "",
      ciudad: "",
      codigoPostal: "",
      pais: "",
      telefono: "",
    });
  }, [user]);

  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
  };

  // PERFIL handlers
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm((p) => ({ ...p, [name]: value }));
  };

  const startEditProfile = () => setEditingProfile(true);
  const cancelEditProfile = () => {
    setEditingProfile(false);
    setProfileForm({
      nombre: user?.nombre ?? user?.name ?? "",
      email: user?.email ?? "",
    });
  };

  const saveProfile = () => {
    const updatedUser = {
      ...user,
      nombre: profileForm.nombre,
      // mantener la propiedad 'name' si existe
      ...(user && "name" in user ? { name: profileForm.nombre } : {}),
      email: profileForm.email,
      addresses: addresses, // mantener direcciones actuales
    };

    dispatch({ type: "UPDATE_USER", payload: updatedUser });
    setEditingProfile(false);
  };

  // DIRECCIONES handlers
  const startAddAddress = () => {
    setEditingAddressIndex(addresses.length); // nuevo índice (al final)
    setAddressForm({
      label: "",
      calle: "",
      ciudad: "",
      codigoPostal: "",
      pais: "",
      telefono: "",
    });
  };

  const startEditAddress = (idx) => {
    setEditingAddressIndex(idx);
    const a = addresses[idx];
    setAddressForm({
      label: a?.label ?? "",
      calle: a?.calle ?? a?.direccion ?? "",
      ciudad: a?.ciudad ?? "",
      codigoPostal: a?.codigoPostal ?? a?.postal ?? "",
      pais: a?.pais ?? "",
      telefono: a?.telefono ?? a?.phone ?? "",
    });
  };

  const cancelEditAddress = () => {
    setEditingAddressIndex(-1);
    setAddressForm({
      label: "",
      calle: "",
      ciudad: "",
      codigoPostal: "",
      pais: "",
      telefono: "",
    });
  };

  const handleAddressFormChange = (e) => {
    const { name, value } = e.target;
    setAddressForm((p) => ({ ...p, [name]: value }));
  };

  const saveAddress = () => {
    const normalized = {
      id: Date.now(), // id temporal
      label: addressForm.label || "Dirección",
      calle: addressForm.calle,
      ciudad: addressForm.ciudad,
      codigoPostal: addressForm.codigoPostal,
      pais: addressForm.pais,
      telefono: addressForm.telefono,
    };

    const next = [...addresses];

    if (editingAddressIndex >= 0 && editingAddressIndex < addresses.length) {
      // editar existente
      next[editingAddressIndex] = { ...next[editingAddressIndex], ...normalized };
    } else {
      // agregar nuevo
      next.push(normalized);
    }

    setAddresses(next);
    // persistir en reducer
    const updatedUser = { ...user, addresses: next, nombre: profileForm.nombre ?? user?.nombre };
    dispatch({ type: "UPDATE_USER", payload: updatedUser });

    // limpiar
    setEditingAddressIndex(-1);
    setAddressForm({
      label: "",
      calle: "",
      ciudad: "",
      codigoPostal: "",
      pais: "",
      telefono: "",
    });
  };

  const deleteAddress = (idx) => {
    const next = addresses.filter((_, i) => i !== idx);
    setAddresses(next);
    const updatedUser = { ...user, addresses: next };
    dispatch({ type: "UPDATE_USER", payload: updatedUser });
    // si estabas editando esa dirección, cancelar
    if (editingAddressIndex === idx) cancelEditAddress();
  };

  return (
    <>
      <Navbarperfume />
      <div
        className="container-fluid py-4"
        style={{ backgroundColor: "#000", minHeight: "100vh" }}
      >
        <div className="row">
          {/* Sidebar */}
          <aside className="col-md-3 mb-4">
            <div className="list-group">
              <button
                className="list-group-item list-group-item-action active bg-dark border-0"
                style={{ color: "#d4af37", textAlign: "left" }}
              >
                Información Personal
              </button>
              <button className="list-group-item list-group-item-action bg-dark text-white border-0" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
                Historial de Pedido
              </button>
              <button className="list-group-item list-group-item-action bg-dark text-white border-0" onClick={() => document.getElementById("addresses-section")?.scrollIntoView({ behavior: "smooth" })}>
                Métodos de Pago / Envío
              </button>
              <button className="list-group-item list-group-item-action bg-dark text-white border-0">
                Lista de Deseos
              </button>
            </div>
            <button
              className="btn btn-outline-light mt-3 w-100"
              onClick={handleLogout}
            >
              Cerrar Sesión
            </button>
          </aside>

          {/* Main Content */}
          <main className="col-md-9 text-white">
            <h2 className="mb-4" style={{ color: "#d4af37" }}>
              Mi Perfil
            </h2>

            {user ? (
              <>
                {/* Información Personal */}
                <section
                  className="mb-4 p-3 rounded"
                  style={{ backgroundColor: "#111" }}
                >
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <h4 className="mb-1" style={{ color: "#d4af37" }}>
                        Información Personal
                      </h4>
                      <small className="text-muted">Editá tu nombre y e-mail</small>
                    </div>

                    {!editingProfile ? (
                      <div>
                        <button className="btn btn-sm btn-outline-light me-2" onClick={startEditProfile}>
                          Editar
                        </button>
                      </div>
                    ) : (
                      <div>
                        <button className="btn btn-sm btn-secondary me-2" onClick={cancelEditProfile}>
                          Cancelar
                        </button>
                        <button className="btn btn-sm btn-warning" onClick={saveProfile}>
                          Guardar
                        </button>
                      </div>
                    )}
                  </div>

                  {!editingProfile ? (
                    <div className="mt-3">
                      <p style={{ marginBottom: 6 }}>
                        <strong>ID:</strong> {user.id}
                      </p>
                      <p style={{ marginBottom: 6 }}>
                        <strong>Nombre:</strong> {user?.nombre ?? user?.name ?? "-"}
                      </p>
                      <p style={{ marginBottom: 6 }}>
                        <strong>Email:</strong> {user?.email ?? "sin email"}
                      </p>
                    </div>
                  ) : (
                    <div className="mt-3">
                      <div className="mb-2">
                        <label className="form-label small">Nombre</label>
                        <input
                          className="form-control"
                          name="nombre"
                          value={profileForm.nombre}
                          onChange={handleProfileChange}
                          placeholder="Tu nombre"
                        />
                      </div>
                      <div className="mb-2">
                        <label className="form-label small">Email</label>
                        <input
                          className="form-control"
                          name="email"
                          value={profileForm.email}
                          onChange={handleProfileChange}
                          placeholder="tu@correo.com"
                        />
                      </div>
                    </div>
                  )}
                </section>

                {/* Direcciones de Envío */}
                <section
                  id="addresses-section"
                  className="p-3 rounded"
                  style={{ backgroundColor: "#111" }}
                >
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <div>
                      <h4 className="mb-1" style={{ color: "#d4af37" }}>
                        Direcciones de Envío
                      </h4>
                      <small className="text-muted">Añadí o editá tus direcciones</small>
                    </div>
                    <div>
                      <button className="btn btn-sm btn-warning" onClick={startAddAddress}>
                        + Añadir dirección
                      </button>
                    </div>
                  </div>

                  {addresses.length === 0 && (
                    <div className="text-muted mb-3">No hay direcciones guardadas.</div>
                  )}

                  {addresses.map((a, idx) => (
                    <div key={a.id ?? idx} className="mb-2 p-2 rounded" style={{ background: "#0b0b0b", border: "1px solid rgba(255,255,255,0.03)" }}>
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <div style={{ color: "#d4af37", fontWeight: 600 }}>{a.label || "Dirección"}</div>
                          <div className="small text-white">
                            {a.calle}{a.ciudad ? `, ${a.ciudad}` : ""}{a.codigoPostal ? ` • ${a.codigoPostal}` : ""}
                          </div>
                          <div className="small text-muted">{a.pais} {a.telefono ? `• ${a.telefono}` : ""}</div>
                        </div>
                        <div className="d-flex gap-2">
                          <button className="btn btn-sm btn-outline-light" onClick={() => startEditAddress(idx)}>Editar</button>
                          <button className="btn btn-sm btn-outline-danger" onClick={() => deleteAddress(idx)}>Eliminar</button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* FORMULARIO inline para agregar/editar */}
                  {/* Actualmente no lo hice, pero a futuro, para ver esto en el checkout, van a tener que pasarlo al reducer */}
                  {editingAddressIndex >= 0 && (
                    <div className="mt-3 p-3" style={{ background: "#070707", borderRadius: 8 }}>
                      <h6 style={{ color: "#d4af37" }}>{editingAddressIndex < addresses.length ? "Editar dirección" : "Nueva dirección"}</h6>
                      <div className="row g-2 mt-2">
                        <div className="col-12 col-md-6">
                          <input
                            className="form-control form-control-sm"
                            name="label"
                            placeholder="Etiqueta (p. ej. Casa, Oficina)"
                            value={addressForm.label}
                            onChange={handleAddressFormChange}
                          />
                        </div>
                        <div className="col-12 col-md-6">
                          <input
                            className="form-control form-control-sm"
                            name="telefono"
                            placeholder="Teléfono"
                            value={addressForm.telefono}
                            onChange={handleAddressFormChange}
                          />
                        </div>
                        <div className="col-12">
                          <input
                            className="form-control form-control-sm"
                            name="calle"
                            placeholder="Calle y número"
                            value={addressForm.calle}
                            onChange={handleAddressFormChange}
                          />
                        </div>
                        <div className="col-6">
                          <input
                            className="form-control form-control-sm"
                            name="ciudad"
                            placeholder="Ciudad"
                            value={addressForm.ciudad}
                            onChange={handleAddressFormChange}
                          />
                        </div>
                        <div className="col-6">
                          <input
                            className="form-control form-control-sm"
                            name="codigoPostal"
                            placeholder="Código Postal"
                            value={addressForm.codigoPostal}
                            onChange={handleAddressFormChange}
                          />
                        </div>
                        <div className="col-12">
                          <input
                            className="form-control form-control-sm"
                            name="pais"
                            placeholder="País"
                            value={addressForm.pais}
                            onChange={handleAddressFormChange}
                          />
                        </div>
                      </div>

                      <div className="mt-3 d-flex gap-2 justify-content-end">
                        <button className="btn btn-sm btn-secondary" onClick={cancelEditAddress}>Cancelar</button>
                        <button className="btn btn-sm btn-warning" onClick={saveAddress}>Guardar dirección</button>
                      </div>
                    </div>
                  )}
                </section>
              </>
            ) : (
              <div className="p-4 bg-dark rounded text-center">
                <p className="text-white mb-3">
                  No hay usuario logueado. Inicia sesión para ver tu perfil.
                </p>
                <a href="/" className="btn btn-warning">
                  Ir a Login
                </a>
              </div>
            )}
          </main>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Usuario;
