import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  updateUser,
  logoutUser,
  addAddress,
  updateAddress,
  deleteAddress,
  updateUserProfile,
  addAddressToAPI,
  updateAddressInAPI,
  deleteAddressFromAPI,
  syncAddressesFromLocal
} from "../../REDUX/userSlice";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbarperfume from "../landingpage/NAVBAR/Navbar";
import Footer from "../landingpage/FOOTER/Footer";

const Usuario = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.users?.user);
  const loading = useSelector((state) => state.users?.loading);
  const error = useSelector((state) => state.users?.error);

  // Profile editing
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
  });
  const [saveMessage, setSaveMessage] = useState(null);

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

  // Sincronizar direcciones desde localStorage solo cuando cambia el userId
  useEffect(() => {
    if (user?.id) {
      dispatch(syncAddressesFromLocal());
    }
  }, [user?.id, dispatch]);

  useEffect(() => {
    // inicializar formularios cuando cambia el user
    setProfileForm({
      firstName: user?.firstName ?? "",
      lastName: user?.lastName ?? "",
      email: user?.email ?? "",
      username: user?.username ?? "",
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
    dispatch(logoutUser());
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
      firstName: user?.firstName ?? "",
      lastName: user?.lastName ?? "",
      email: user?.email ?? "",
      username: user?.username ?? "",
    });
  };

  const saveProfile = async () => {
    const updatedData = {
      firstName: profileForm.firstName,
      lastName: profileForm.lastName,
      email: profileForm.email,
      username: profileForm.username,
    };

    try {
      await dispatch(updateUserProfile(updatedData)).unwrap();
      setEditingProfile(false);
      setSaveMessage({ type: 'success', text: 'Perfil actualizado correctamente' });
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (error) {
      console.error("Error al actualizar perfil:", error);
      setSaveMessage({ type: 'error', text: 'Error al actualizar perfil' });
      setTimeout(() => setSaveMessage(null), 3000);
    }
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

  const saveAddress = async () => {
    const normalized = {
      id: Date.now(), // ID temporal para localStorage
      label: addressForm.label || "Dirección",
      calle: addressForm.calle,
      ciudad: addressForm.ciudad,
      codigoPostal: addressForm.codigoPostal,
      pais: addressForm.pais,
      telefono: addressForm.telefono,
    };

    const next = [...addresses];

    // Primero guardar localmente
    if (editingAddressIndex >= 0 && editingAddressIndex < addresses.length) {
      // Editar existente
      next[editingAddressIndex] = { ...next[editingAddressIndex], ...normalized };
      dispatch(updateAddress({ index: editingAddressIndex, address: normalized }));
    } else {
      // Agregar nuevo
      next.push(normalized);
      dispatch(addAddress(normalized));
    }

    setAddresses(next);

    // Luego intentar guardar en la API
    try {
      if (editingAddressIndex >= 0 && editingAddressIndex < addresses.length) {
        const addressToUpdate = addresses[editingAddressIndex];
        const updatedAddressData = {
          addressId: addressToUpdate.id,
          addressData: normalized
        };
        await dispatch(updateAddressInAPI(updatedAddressData)).unwrap();
        setSaveMessage({ type: 'success', text: 'Dirección actualizada correctamente (guardada en servidor)' });
      } else {
        await dispatch(addAddressToAPI(normalized)).unwrap();
        setSaveMessage({ type: 'success', text: 'Dirección agregada correctamente (guardada en servidor)' });
      }

      setTimeout(() => setSaveMessage(null), 3000);
    } catch (error) {
      console.error("Error al guardar dirección en servidor:", error);
      // La dirección ya está guardada localmente
      setSaveMessage({
        type: 'warning',
        text: '⚠️ Dirección guardada localmente. No se pudo sincronizar con el servidor.'
      });
      setTimeout(() => setSaveMessage(null), 5000);
    }

    // Limpiar formulario
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

  const handleDeleteAddress = async (idx) => {
    const addressToDelete = addresses[idx];

    // Primero eliminar localmente
    const next = addresses.filter((_, i) => i !== idx);
    setAddresses(next);
    dispatch(deleteAddress(idx));

    // Luego intentar eliminar del servidor
    try {
      await dispatch(deleteAddressFromAPI(addressToDelete.id)).unwrap();
      setSaveMessage({ type: 'success', text: 'Dirección eliminada correctamente (servidor sincronizado)' });
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (error) {
      console.error("Error al eliminar dirección del servidor:", error);
      // La dirección ya está eliminada localmente
      setSaveMessage({
        type: 'warning',
        text: '⚠️ Dirección eliminada localmente. No se pudo sincronizar con el servidor.'
      });
      setTimeout(() => setSaveMessage(null), 5000);
    }

    // si estabas editando esa dirección, cancelar
    if (editingAddressIndex === idx) cancelEditAddress();
  };

  return (
    <>
      <Navbarperfume />
      <div
        className="container py-5"
        style={{ backgroundColor: "#000", minHeight: "100vh" }}
      >
        <div className="row justify-content-center">
          {/* Main Content */}
          <main className="col-12 col-lg-10 col-xl-8 text-white">
            <div className="text-center mb-5">
              <h2 className="mb-2" style={{ color: "#d4af37", fontSize: "2.5rem", fontWeight: "bold" }}>
                Mi Perfil
              </h2>
              <p className="text-muted">Gestiona tu información personal y direcciones de envío</p>
            </div>

            {/* Mensajes de éxito/error/advertencia */}
            {saveMessage && (
              <div className={`alert alert-${saveMessage.type === 'success' ? 'success' :
                saveMessage.type === 'warning' ? 'warning' :
                  'danger'
                } alert-dismissible fade show`} role="alert">
                {saveMessage.text}
                <button type="button" className="btn-close" onClick={() => setSaveMessage(null)}></button>
              </div>
            )}

            {/* Indicador de carga */}
            {loading && (
              <div className="alert alert-info" role="alert">
                <div className="spinner-border spinner-border-sm me-2" role="status">
                  <span className="visually-hidden">Cargando...</span>
                </div>
                Guardando cambios...
              </div>
            )}

            {user ? (
              <>
                {/* Información Personal */}
                <section
                  className="mb-5 p-4 rounded shadow-lg"
                  style={{ backgroundColor: "#111", border: "1px solid #222" }}
                >
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div>
                      <h4 className="mb-2" style={{ color: "#d4af37", fontSize: "1.5rem" }}>
                        <i className="bi bi-person-circle me-2"></i>
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
                        <button className="btn btn-sm btn-secondary me-2" onClick={cancelEditProfile} disabled={loading}>
                          Cancelar
                        </button>
                        <button className="btn btn-sm btn-warning" onClick={saveProfile} disabled={loading}>
                          {loading ? 'Guardando...' : 'Guardar'}
                        </button>
                      </div>
                    )}
                  </div>

                  {!editingProfile ? (
                    <div className="mt-3">
                      <p style={{ marginBottom: 6 }}>
                        <strong>Nombre:</strong> {user.firstName}
                      </p>
                      <p style={{ marginBottom: 6 }}>
                        <strong>Apellido:</strong> {user.lastName}
                      </p>
                      <p style={{ marginBottom: 6 }}>
                        <strong>Email:</strong> {user.email}
                      </p>
                      <p style={{ marginBottom: 6 }}>
                        <strong>User Name:</strong> {user.username}
                      </p>
                    </div>
                  ) : (
                    <div className="mt-3">
                      <div className="mb-2">
                        <label className="form-label small">Nombre</label>
                        <input
                          className="form-control"
                          name="firstName"
                          value={profileForm.firstName}
                          onChange={handleProfileChange}
                          placeholder="Tu nombre"
                        />
                      </div>

                      <div className="mb-2">
                        <label className="form-label small">Apellido</label>
                        <input
                          className="form-control"
                          name="lastName"
                          value={profileForm.lastName}
                          onChange={handleProfileChange}
                          placeholder="Tu apellido"
                        />
                      </div>

                      <div className="mb-2">
                        <label className="form-label small">Email</label>
                        <input
                          className="form-control"
                          name="email"
                          value={profileForm.email}
                          onChange={handleProfileChange}
                          placeholder="email"
                        />
                      </div>

                      <div className="mb-2">
                        <label className="form-label small">User Name</label>
                        <input
                          className="form-control"
                          name="username"
                          value={profileForm.username}
                          onChange={handleProfileChange}
                          placeholder="nombre de usuario"
                        />
                      </div>
                    </div>

                  )}
                </section>

                {/* Direcciones de Envío */}
                <section
                  id="addresses-section"
                  className="p-4 rounded shadow-lg"
                  style={{ backgroundColor: "#111", border: "1px solid #222" }}
                >
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div>
                      <h4 className="mb-2" style={{ color: "#d4af37", fontSize: "1.5rem" }}>
                        <i className="bi bi-geo-alt-fill me-2"></i>
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
                    <div key={a.id ?? idx} className="mb-3 p-3 rounded" style={{
                      background: "#0b0b0b",
                      border: "1px solid rgba(212, 175, 55, 0.2)",
                      transition: "all 0.3s ease"
                    }}
                      onMouseEnter={(e) => e.currentTarget.style.borderColor = "rgba(212, 175, 55, 0.5)"}
                      onMouseLeave={(e) => e.currentTarget.style.borderColor = "rgba(212, 175, 55, 0.2)"}
                    >
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <div style={{ color: "#d4af37", fontWeight: 600, fontSize: "1.1rem", marginBottom: "8px" }}>
                            <i className="bi bi-house-door-fill me-2"></i>
                            {a.label || "Dirección"}
                          </div>
                          <div className="text-white mb-1">
                            <i className="bi bi-geo-alt me-2"></i>
                            {a.calle}{a.ciudad ? `, ${a.ciudad}` : ""}{a.codigoPostal ? ` • ${a.codigoPostal}` : ""}
                          </div>
                          <div className="small text-muted">
                            <i className="bi bi-globe me-2"></i>
                            {a.pais} {a.telefono ? `• 📞 ${a.telefono}` : ""}
                          </div>
                        </div>
                        <div className="d-flex gap-2 flex-column flex-sm-row">
                          <button className="btn btn-sm btn-outline-warning" onClick={() => startEditAddress(idx)}>
                            <i className="bi bi-pencil me-1"></i>Editar
                          </button>
                          <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteAddress(idx)}>
                            <i className="bi bi-trash me-1"></i>Eliminar
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* FORMULARIO inline para agregar/editar */}
                  {editingAddressIndex >= 0 && (
                    <div className="mt-4 p-4 shadow-lg" style={{
                      background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)",
                      borderRadius: 12,
                      border: "2px solid #d4af37"
                    }}>
                      <h5 className="mb-4" style={{ color: "#d4af37", fontWeight: "600" }}>
                        <i className="bi bi-plus-circle me-2"></i>
                        {editingAddressIndex < addresses.length ? "Editar dirección" : "Nueva dirección"}
                      </h5>
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
                        <button className="btn btn-sm btn-secondary" onClick={cancelEditAddress} disabled={loading}>Cancelar</button>
                        <button className="btn btn-sm btn-warning" onClick={saveAddress} disabled={loading}>
                          {loading ? 'Guardando...' : 'Guardar dirección'}
                        </button>
                      </div>
                    </div>
                  )}
                </section>

                {/* Botón de Cerrar Sesión */}
                <div className="text-center mt-5 mb-4">
                  <button
                    className="btn btn-outline-danger btn-lg px-5"
                    onClick={handleLogout}
                    style={{
                      borderWidth: "2px",
                      fontWeight: "600",
                      transition: "all 0.3s ease"
                    }}
                  >
                    <i className="bi bi-box-arrow-right me-2"></i>
                    Cerrar Sesión
                  </button>
                </div>
              </>
            ) : (
              <div className="p-5 bg-dark rounded text-center">
                <p className="text-white mb-3 fs-5">
                  No hay usuario logueado. Inicia sesión para ver tu perfil.
                </p>
                <a href="/" className="btn btn-warning btn-lg px-4">
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