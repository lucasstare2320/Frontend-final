import React, { useState } from "react";
import { useSelector } from "react-redux";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbarperfume from "../landingpage/NAVBAR/Navbar";
import Footer from "../landingpage/FOOTER/Footer";

const Checkout = () => {
  // Carrito
  const cartItems = useSelector((state) => state.cartItems || []);
  // Usuario y admin
  const user = useSelector((state) => state.user);
  const isAdmin = user?.admin || false;

  const [shippingInfo, setShippingInfo] = useState({
    nombre: "",
    apellido: "",
    direccion: "",
    ciudad: "",
    codigoPostal: "",
    pais: "",
    telefono: "",
    discountCode: "",
    numerotarjeta:"",
    codigoseguridad:""
  });

  const [discount, setDiscount] = useState(0);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleApplyDiscount = () => {
    if (shippingInfo.discountCode === "SAVE10") {
      setDiscount(0.1);
    } else {
      setDiscount(0);
    }
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );
  const shippingCost = 10;
  const total = subtotal * (1 - discount) + shippingCost;

  return (
    <>
    <Navbarperfume></Navbarperfume>
    <div className="container my-5">
      <div className="row">
        {/* Información de Envío */}
        <div className="col-md-6 mb-4">
          <h4 className="text-white mb-3">Información de Envío</h4>
          <div className="form-group mb-2">
            <input
              type="text"
              className="form-control"
              placeholder="Introduce tu nombre"
              name="nombre"
              value={shippingInfo.nombre}
              onChange={handleChange}
            />
          </div>
          <div className="form-group mb-2">
            <input
              type="text"
              className="form-control"
              placeholder="Introduce tu apellido"
              name="apellido"
              value={shippingInfo.apellido}
              onChange={handleChange}
            />
          </div>
          <div className="form-group mb-2">
            <input
              type="text"
              className="form-control"
              placeholder="Introduce tu dirección"
              name="direccion"
              value={shippingInfo.direccion}
              onChange={handleChange}
            />
          </div>
          <div className="row mb-2">
            <div className="col">
              <input
                type="text"
                className="form-control"
                placeholder="Ciudad"
                name="ciudad"
                value={shippingInfo.ciudad}
                onChange={handleChange}
              />
            </div>
            <div className="col">
              <input
                type="text"
                className="form-control"
                placeholder="Código Postal"
                name="codigoPostal"
                value={shippingInfo.codigoPostal}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="row mb-2">
            <div className="col">
              <input
                type="text"
                className="form-control"
                placeholder="País"
                name="pais"
                value={shippingInfo.pais}
                onChange={handleChange}
              />
            </div>
            <div className="col">
              <input
                type="text"
                className="form-control"
                placeholder="Teléfono"
                name="telefono"
                value={shippingInfo.telefono}
                onChange={handleChange}
              />
            </div>
            <br></br>
            <p className="text-white mt-5">Informacion de pago</p>
            <div className="col">
              <input
                type="text"
                className="form-control"
                placeholder="Numero tarjeta"
                name="telefono"
                value={shippingInfo.numerotarjeta}
                onChange={handleChange}
              />
            </div>
            <div className="col">
              <input
                type="text"
                className="form-control"
                placeholder="codigo de seguridad"
                name="telefono"
                value={shippingInfo.codigoseguridad}
                onChange={handleChange}
              />
            </div>
          </div>
          <button className="btn btn-warning w-100 mt-3">
            Continuar a pagar
          </button>
        </div>

        {/* Resumen del Pedido */}
        <div className="col-md-6">
          <div
            className="p-3"
            style={{ backgroundColor: "#1c1c1c", borderRadius: "8px" }}
          >
            <h4 className="text-white mb-3">Resumen del Pedido</h4>

            {cartItems.length === 0 && (
              <div className="text-muted">El carrito está vacío.</div>
            )}

            {cartItems.map((item) => (
              <div
                key={item.id}
                className="d-flex justify-content-between align-items-center mb-2"
              >
                <div className="d-flex align-items-center">
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{
                      width: "50px",
                      height: "50px",
                      marginRight: "10px",
                      objectFit: "cover",
                    }}
                  />
                  <div>
                    <div className="text-white">{item.name}</div>
                    <div
                      className="text-white"
                      style={{ fontSize: "0.85rem" }}
                    >
                      Cantidad: {item.qty}
                    </div>
                  </div>
                </div>
                <div className="text-white">${item.price.toFixed(2)}</div>
              </div>
            ))}



            <hr style={{ borderColor: "#444" }} />
            <div className="d-flex justify-content-between text-white mb-1">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="d-flex justify-content-between text-white mb-1">
              <span>Envío</span>
              <span>${shippingCost.toFixed(2)}</span>
            </div>
            {discount > 0 && (
              <div className="d-flex justify-content-between text-warning mb-1">
                <span>Descuento</span>
                <span>-{(subtotal * discount).toFixed(2)}</span>
              </div>
            )}
            <div className="d-flex justify-content-between text-white fw-bold mt-2">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <div
              className="text-center mt-3 text-muted"
              style={{ fontSize: "0.85rem" }}
            >
              🔒 Pago seguro y protegido
            </div>

     
          </div>
        </div>
      </div>
    </div>
    <Footer></Footer>
    </>
  );
};

export default Checkout;
