import React, { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbarperfume from "../landingpage/NAVBAR/Navbar";
import Footer from "../landingpage/FOOTER/Footer";
import { createOrder } from "../../REDUX/orderSlice";
import { clearCart } from "../../REDUX/cartSlice";
import { useNavigate } from "react-router-dom";


const Checkout = () => {
    const navigate = useNavigate();
   const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items || []);
  const user = useSelector((state) => state.users?.user);
  const creating = useSelector((state) => state.orders?.creating);
  const errorCreate = useSelector((state) => state.orders?.errorCreate);

  // Direcciones
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(null);
  const [useNewAddress, setUseNewAddress] = useState(true);
  const [placing, setPlacing] = useState(false);

  

  // Formulario (incluye pago)
  const [shippingInfo, setShippingInfo] = useState({
    nombre: "",
    apellido: "",
    direccion: "",
    ciudad: "",
    codigoPostal: "",
    pais: "",
    telefono: "",
    discountCode: "",
    numerotarjeta: "",
    codigoseguridad: "",
    expiry: "", // MM/YY
  });

  const [cardFocus, setCardFocus] = useState(null); // "number"|"name"|"expiry"|"cvv"|null

const defaultAddress = React.useMemo(() => {
  if (!user?.addresses || user.addresses.length === 0) return null;
  // Si manejás un flag isDefault en tus direcciones:
  const def = user.addresses.find(a => a.isDefault);
  return def || user.addresses[0]; // fallback: primera dirección
}, [user]);

React.useEffect(() => {
  if (!user) return;

  setUseNewAddress(!(user.addresses && user.addresses.length > 0));

  // si hay dirección por defecto, marcá su índice
  if (user.addresses && user.addresses.length > 0) {
    const idx = defaultAddress
      ? user.addresses.findIndex(a => a === defaultAddress)
      : 0;
    setSelectedAddressIndex(idx);
  } else {
    setSelectedAddressIndex(null);
  }

  setShippingInfo(prev => ({
    ...prev,
    // datos del usuario
    nombre: user.firstName || prev.nombre || "",
    apellido: user.lastName || prev.apellido || "",
    // dirección (si existe)
    direccion: defaultAddress?.calle || prev.direccion || "",
    ciudad: defaultAddress?.ciudad || prev.ciudad || "",
    codigoPostal: defaultAddress?.codigoPostal || prev.codigoPostal || "",
    pais: defaultAddress?.pais || prev.pais || "",
    telefono: defaultAddress?.telefono || prev.telefono || "",
    // preservamos campos de pago/cupón si ya estaban
    discountCode: prev.discountCode || "",
    numerotarjeta: prev.numerotarjeta || "",
    codigoseguridad: prev.codigoseguridad || "",
    expiry: prev.expiry || "",
  }));
}, [user, defaultAddress]);



  const handleChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectSavedAddress = (index) => {
    setSelectedAddressIndex(index);
    setUseNewAddress(false);
    const address = user.addresses[index];
    setShippingInfo((prev) => ({
      ...prev,
      nombre: user.firstName || "",
      apellido: user.lastName || "",
      direccion: address.calle || "",
      ciudad: address.ciudad || "",
      codigoPostal: address.codigoPostal || "",
      pais: address.pais || "",
      telefono: address.telefono || "",
    }));
  };

  const handleUseNewAddress = () => {
    setUseNewAddress(true);
    setSelectedAddressIndex(null);
    setShippingInfo((prev) => ({
      ...prev,
      nombre: "",
      apellido: "",
      direccion: "",
      ciudad: "",
      codigoPostal: "",
      pais: "",
      telefono: "",
    }));
  };

  // Formatos tarjeta
  const formatCardNumber = (raw) =>
    raw.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
  const formatExpiry = (raw) => {
    const d = raw.replace(/\D/g, "").slice(0, 4);
    return d.length < 3 ? d : d.slice(0, 2) + "/" + d.slice(2);
  };
  const handleCardNumberChange = (e) =>
    setShippingInfo((p) => ({ ...p, numerotarjeta: formatCardNumber(e.target.value) }));
  const handleExpiryChange = (e) =>
    setShippingInfo((p) => ({ ...p, expiry: formatExpiry(e.target.value) }));
  const handleCvvChange = (e) =>
    setShippingInfo((p) => ({ ...p, codigoseguridad: e.target.value.replace(/\D/g, "").slice(0, 4) }));

  // Totales
  const { subtotal, descuento, total } = useMemo(() => {
    const n = (v) => (typeof v === "number" && isFinite(v) ? v : 0);
    const sub = cartItems.reduce((acc, i) => acc + n(i.price) * n(i.qty), 0);
    const disc = cartItems.reduce((acc, i) => acc + n(i.price) * n(i.qty) * (n(i.discount) / 100), 0);
    return { subtotal: sub, descuento: disc, total: Math.max(0, sub - disc) };
  }, [cartItems]);

  const money = (x) => Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" }).format(x ?? 0);

  const handlePlaceOrderRTK = async () => {
    if (!user?.id) {
      alert("Tenés que iniciar sesión.");
      return;
    }
    if (!cartItems?.length) {
      alert("El carrito está vacío.");
      return;
    }

    const items = cartItems.map(i => ({
      productId: i.id,
      quantity: i.qty
    }));

    try {
      await dispatch(createOrder({ userId: user.id, items, status: "PENDING" })).unwrap();

      dispatch(clearCart());

      // Redirigir al perfil para mostrar las órdenes
      navigate("/perfil");
    } catch (e) {
      console.error(e);
      alert("No se pudo crear la orden.");
    }
  };

  
  return (
    <>
      {/* estilos mínimos para la tarjeta */}
      <style>{`
        .card-wrapper { display:flex; gap:20px; align-items:flex-start; margin-bottom:18px; }
        .credit-card { width: 320px; height: 190px; border-radius: 12px; position: relative; perspective: 1000px; }
        .front, .back { position:absolute; inset:0; backface-visibility: hidden; border-radius:12px; padding:18px; color:#fff; }
        .front { background: linear-gradient(135deg,#0b0b0b,#1b1b1b); }
        .back  { background: linear-gradient(135deg,#111,#222); transform: rotateY(180deg); }
        .credit-card.flipped .front { transform: rotateY(180deg); transition: transform .6s; }
        .credit-card.flipped .back  { transform: rotateY(0deg);   transition: transform .6s; }
        .chip { width:44px; height:30px; background: linear-gradient(135deg,#d4af37,#f1d07f); border-radius:4px; }
        .card-number { letter-spacing:2px; font-size:1.05rem; margin-top:12px; }
        .card-holder { font-size:0.8rem; text-transform:uppercase; margin-top:8px; color:#ccc; }
        .card-expiry { font-size:0.9rem; color:#fff; }
        .magstripe { height:40px; background:#000; margin-top:18px; border-radius:4px; }
        .cvv-visual { background:#e9e9e9; color:#000; padding:6px 10px; border-radius:4px; font-weight:700; }
        .card-inputs .form-control { background:#0b0b0b; color:#fff; border:1px solid #333; }
        .card-label { color:#d4af37; font-weight:600; margin-bottom:6px; font-size:0.85rem; }
        @media (max-width: 768px) { .card-wrapper { flex-direction:column; } .credit-card { width:100%; max-width:420px; } }
      `}</style>

      <Navbarperfume />
      <div className="container my-5">
        <div className="row">
          {/* ===== Columna izquierda: Envío + Pago ===== */}
          <div className="col-md-6 mb-4">
            <h4 className="text-white mb-3">Información de Envío</h4>

            {/* Direcciones guardadas */}
            {user?.addresses && user.addresses.length > 0 && (
              <div className="mb-3">
                <label className="text-white mb-2">Seleccionar dirección guardada:</label>
                <div className="d-flex flex-column gap-2 mb-3">
                  {user.addresses.map((address, index) => (
                    <div
                      key={address.id || index}
                      className={`p-2 rounded ${selectedAddressIndex === index && !useNewAddress ? "border border-warning bg-dark" : "border border-secondary bg-dark"}`}
                      style={{ cursor: "pointer" }}
                      onClick={() => handleSelectSavedAddress(index)}
                    >
                      <div style={{ color: "#d4af37", fontWeight: 600, fontSize: "0.9rem" }}>
                        {address.label || "Dirección"}
                      </div>
                      <div className="text-white small">
                        {address.calle}, {address.ciudad}, {address.codigoPostal}
                      </div>
                      <div className="text-muted small">
                        {address.pais} • {address.telefono}
                      </div>
                    </div>
                  ))}
                </div>
                <button type="button" className="btn btn-sm btn-outline-light w-100 mb-3" onClick={handleUseNewAddress}>
                  + Usar nueva dirección
                </button>
              </div>
            )}

            {/* Formulario de nueva dirección */}
            {(useNewAddress || !user?.addresses || user.addresses.length === 0) && (
              <>
                <div className="row mb-2">
                  <div className="col">
                    <input className="form-control" placeholder="Nombre" name="nombre" value={shippingInfo.nombre} onChange={handleChange} />
                  </div>
                  <div className="col">
                    <input className="form-control" placeholder="Apellido" name="apellido" value={shippingInfo.apellido} onChange={handleChange} />
                  </div>
                </div>
                <div className="form-group mb-2">
                  <input className="form-control" placeholder="Dirección" name="direccion" value={shippingInfo.direccion} onChange={handleChange} />
                </div>
                <div className="row mb-2">
                  <div className="col">
                    <input className="form-control" placeholder="Ciudad" name="ciudad" value={shippingInfo.ciudad} onChange={handleChange} />
                  </div>
                  <div className="col">
                    <input className="form-control" placeholder="Código Postal" name="codigoPostal" value={shippingInfo.codigoPostal} onChange={handleChange} />
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col">
                    <input className="form-control" placeholder="País" name="pais" value={shippingInfo.pais} onChange={handleChange} />
                  </div>
                  <div className="col">
                    <input className="form-control" placeholder="Teléfono" name="telefono" value={shippingInfo.telefono} onChange={handleChange} />
                  </div>
                </div>
              </>
            )}

            {/* ===== Información de Pago ===== */}
            <h4 className="text-white mb-3 mt-4">Información de Pago</h4>

            {/* Nombre en tarjeta */}
            <div className="mb-2">
              <label className="card-label">Nombre en la tarjeta</label>
              <input
                className="form-control"
                name="nombre"
                value={shippingInfo.nombre}
                onChange={handleChange}
                onFocus={() => setCardFocus("name")}
                onBlur={() => setCardFocus(null)}
                placeholder="NOMBRE APELLIDO"
              />
            </div>

            {/* Tarjeta visual + inputs */}
            <div className="card-wrapper">
              {/* Tarjeta (front/back) */}
              <div className={`credit-card ${cardFocus === "cvv" ? "flipped" : ""}`}>
                {/* FRONT */}
                <div className="front">
                  <div className="d-flex justify-content-between align-items-center">
                    <div style={{ color: "#d4af37", fontWeight: 800 }}>EL CÓDIGO</div>
                    <div className="chip" />
                  </div>
                  <div className="card-number">
                    {shippingInfo.numerotarjeta || "#### #### #### ####"}
                  </div>
                  <div className="d-flex justify-content-between" style={{ marginTop: 10 }}>
                    <div>
                      <div className="card-holder">TITULAR</div>
                      <div style={{ color: "#fff", fontWeight: 600 }}>
                        {shippingInfo.nombre ? shippingInfo.nombre.toUpperCase() : "NOMBRE APELLIDO"}
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div className="card-holder">VÁLIDO HASTA</div>
                      <div className="card-expiry">{shippingInfo.expiry || "MM/YY"}</div>
                    </div>
                  </div>
                </div>

                {/* BACK */}
                <div className="back">
                  <div style={{ marginTop: 6 }}>
                    <div className="magstripe" />
                    <div style={{ marginTop: 12 }}>
                      <div style={{ color: "#ccc", fontSize: "0.85rem" }}>FIRMA</div>
                      <div style={{ background: "#fff", height: 28, borderRadius: 4, marginTop: 6, display: "flex", alignItems: "center", padding: "0 8px", justifyContent: "flex-end" }}>
                        <div style={{ color: "#000", fontWeight: 700 }}>
                          {shippingInfo.codigoseguridad ? shippingInfo.codigoseguridad.padEnd(3, "*") : "***"}
                        </div>
                      </div>
                    </div>
                    <div style={{ marginTop: 12, display: "flex", justifyContent: "flex-end" }}>
                      <div>
                        <div style={{ color: "#ccc", fontSize: "0.85rem" }}>CVV</div>
                        <div className="cvv-visual">{shippingInfo.codigoseguridad || "***"}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Inputs de tarjeta */}
              <div style={{ flex: 1 }} className="card-inputs">
                <div className="mb-2">
                  <label className="card-label">Número de tarjeta</label>
                  <input
                    className="form-control"
                    name="numerotarjeta"
                    value={shippingInfo.numerotarjeta}
                    onChange={handleCardNumberChange}
                    onFocus={() => setCardFocus("number")}
                    onBlur={() => setCardFocus(null)}
                    placeholder="1234 5678 9012 3456"
                    inputMode="numeric"
                  />
                </div>

                <div className="row g-2">
                  <div className="col-6">
                    <label className="card-label">Fecha (MM/YY)</label>
                    <input
                      className="form-control"
                      name="expiry"
                      value={shippingInfo.expiry}
                      onChange={handleExpiryChange}
                      onFocus={() => setCardFocus("expiry")}
                      onBlur={() => setCardFocus(null)}
                      placeholder="MM/YY"
                      inputMode="numeric"
                    />
                  </div>
                  <div className="col-6">
                    <label className="card-label">Código de seguridad (CVV)</label>
                    <input
                      className="form-control"
                      name="codigoseguridad"
                      value={shippingInfo.codigoseguridad}
                      onChange={handleCvvChange}
                      onFocus={() => setCardFocus("cvv")}
                      onBlur={() => setCardFocus(null)}
                      placeholder="CVV"
                      inputMode="numeric"
                    />
                  </div>
                </div>
              </div>
            </div>

            <button
  className="btn btn-warning w-100 mt-3"
  onClick={handlePlaceOrderRTK}
  disabled={placing || cartItems.length === 0}
>
  {placing ? "Creando orden..." : "Continuar a pagar"}
</button>
          </div>

          {/* ===== Columna derecha: Resumen ===== */}
          <div className="col-md-6">
            <div className="p-3" style={{ backgroundColor: "#1c1c1c", borderRadius: "8px" }}>
              <h4 className="text-white mb-3">Resumen del Pedido</h4>

              {cartItems.length === 0 && <div className="text-muted">El carrito está vacío.</div>}

              {cartItems.map((item) => (
                <div key={item.id} className="d-flex justify-content-between align-items-center mb-2">
                  <div className="d-flex align-items-center">
                    <img
                      src={item.image}
                      alt={item.name}
                      style={{ width: "50px", height: "50px", marginRight: "10px", objectFit: "cover" }}
                    />
                    <div>
                      <div className="text-white">{item.name}</div>
                      <div className="text-white" style={{ fontSize: "0.85rem" }}>Cantidad: {item.qty}</div>
                      {typeof item.discount === "number" && item.discount > 0 && (
                        <div className="text-warning" style={{ fontSize: "0.8rem" }}>
                          Descuento: {item.discount}% (-{money(item.price * item.qty * (item.discount / 100))})
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-white">{money(item.price)}</div>
                </div>
              ))}

              <hr style={{ borderColor: "#444" }} />
              <div className="d-flex justify-content-between text-white mb-1">
                <span>Subtotal</span>
                <span>{money(subtotal)}</span>
              </div>
              <div className="d-flex justify-content-between text-warning mb-1">
                <span>Descuento</span>
                <span>-{money(descuento)}</span>
              </div>
              <div className="d-flex justify-content-between text-white fw-bold mt-2">
                <span>Total</span>
                <span style={{ color: "#d4af37" }}>{money(total)}</span>
              </div>
              <div className="text-center mt-3 text-muted" style={{ fontSize: "0.85rem" }}>
                🔒 Pago seguro y protegido
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Checkout;
