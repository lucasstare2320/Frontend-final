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
  deleteAddressFromAPI
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
      label: addressForm.label || "Dirección",
      calle: addressForm.calle,
      ciudad: addressForm.ciudad,
      codigoPostal: addressForm.codigoPostal,
      pais: addressForm.pais,
      telefono: addressForm.telefono,
    };

    try {
      if (editingAddressIndex >= 0 && editingAddressIndex < addresses.length) {
        // editar existente
        const addressToUpdate = addresses[editingAddressIndex];
        const updatedAddressData = {
          addressId: addressToUpdate.id,
          addressData: normalized
        };
        await dispatch(updateAddressInAPI(updatedAddressData)).unwrap();
        setSaveMessage({ type: 'success', text: 'Dirección actualizada correctamente' });
      } else {
        // agregar nuevo
        await dispatch(addAddressToAPI(normalized)).unwrap();
        setSaveMessage({ type: 'success', text: 'Dirección agregada correctamente' });
      }

      // Actualizar estado local
      const next = [...addresses];
      if (editingAddressIndex >= 0 && editingAddressIndex < addresses.length) {
        next[editingAddressIndex] = { ...next[editingAddressIndex], ...normalized };
      } else {
        next.push(normalized);
      }
      setAddresses(next);

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

      setTimeout(() => setSaveMessage(null), 3000);
    } catch (error) {
      console.error("Error al guardar dirección:", error);
      setSaveMessage({ type: 'error', text: 'Error al guardar dirección' });
      setTimeout(() => setSaveMessage(null), 3000);
    }
  };

  const handleDeleteAddress = async (idx) => {
    const addressToDelete = addresses[idx];

    try {
      await dispatch(deleteAddressFromAPI(addressToDelete.id)).unwrap();
      const next = addresses.filter((_, i) => i !== idx);
      setAddresses(next);
      setSaveMessage({ type: 'success', text: 'Dirección eliminada correctamente' });
      setTimeout(() => setSaveMessage(null), 3000);
      // si estabas editando esa dirección, cancelar
      if (editingAddressIndex === idx) cancelEditAddress();
    } catch (error) {
      console.error("Error al eliminar dirección:", error);
      setSaveMessage({ type: 'error', text: 'Error al eliminar dirección' });
      setTimeout(() => setSaveMessage(null), 3000);
    }
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

          {/* Main Content */}
          <main className="col-md-9 text-white">
            <h2 className="mb-4" style={{ color: "#d4af37" }}>
              Mi Perfil
            </h2>

            {/* Mensajes de éxito/error */}
            {saveMessage && (
              <div className={`alert alert-${saveMessage.type === 'success' ? 'success' : 'danger'} alert-dismissible fade show`} role="alert">
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
                          <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteAddress(idx)}>Eliminar</button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* FORMULARIO inline para agregar/editar */}
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
                        <button className="btn btn-sm btn-secondary" onClick={cancelEditAddress} disabled={loading}>Cancelar</button>
                        <button className="btn btn-sm btn-warning" onClick={saveAddress} disabled={loading}>
                          {loading ? 'Guardando...' : 'Guardar dirección'}
                        </button>
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
                <a href="/login" className="btn btn-warning">
                  Ir a Login
                </a>
              </div>
            )}
          </main>
           <aside className="col-md-3 mb-4">
            
            <button
              className="btn btn-outline-light mt-3 w-100"
              onClick={handleLogout}
            >
              Cerrar Sesión
            </button>
          </aside>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Usuario;