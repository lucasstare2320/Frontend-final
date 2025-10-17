import React, { useState } from "react";
import { useDispatch } from "react-redux";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import { postUsuario } from "../../../REDUX/userSlice";
function Registro() {
  const dispatch = useDispatch(); // esto es para redux
   const navigate = useNavigate()

  //use state login
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("") 
  const [password, setPasword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [mostrarMensaje, setMostrarMensaje] = useState(false)


  // aca va a ir el endpoint para POSTear un usuario
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(postUsuario({firstName,lastName,email,username,password}))
    setFirstName("")
    setLastName("")
    setEmail("")
    setUsername("")
    setPasword("")
    setConfirm("")

      console.log(mostrarMensaje)
      if (postUsuario.fulfilled.match(result)) {
        console.log(mostrarMensaje)
     navigate("/");
    } else {
      setMostrarMensaje(true);
      console.log(mostrarMensaje)
    }
  };

  return (
    <div className="perfume-bg d-flex align-items-center rounded justify-content-center min-vh-100">
        {/* Panel Izquierdo - Registro */}
        <div className="col-md-6 p-5 border-end border-dark-subtle">
          <h3 className="text-center text-gold fw-bold mb-1">EL CÓDIGO PERFUMERIE</h3>
          <p className="text-center text-muted mb-4" onClick={() => navigate("/")}>
            ¿Ya tienes una cuenta?{" "}
            <span className="text-gold fw-semibold" style={{ cursor: "pointer" }}>
              Inicia sesión aquí
            </span>
          </p>
          <form onSubmit={handleRegisterSubmit}>
            <div className="row mb-3">
              <div className="col">
                <label className="form-label text-light">Nombre</label>
                <input
                  type="text"
                  name="nombre"
                  value={firstName}
                  className="form-control input-dark"
                  placeholder="Nombre"
                  onChange={(e)=>{
                    setFirstName(e.target.value)
                    console.log(e.target.value)
                  }
                  }
                />
              </div>
              <div className="col">
                <label className="form-label text-light">Apellido</label>
                <input
                  type="text"
                  name="apellido"
                  value={lastName}
                  className="form-control input-dark"
                  placeholder="Apellido"
                  onChange={
                    (e) => {
                      setLastName(e.target.value)
                    }
                  }
                />
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label text-light">Nombre de Usuario</label>
              <input
                type="text"
                name="usuario"
                value={username}
                className="form-control input-dark"
                placeholder="usuario123"
                onChange={
                  (e) => {
                    setUsername(e.target.value)
                  }
                }
              />
            </div>

            <div className="mb-3">
              <label className="form-label text-light">Correo electrónico</label>
              <input
                type="email"
                name="correo"
                valule={email}
                className="form-control input-dark"
                placeholder="tucorreo@email.com"
                onChange={
                  (e) => {
                    setEmail(e.target.value)
                  }
                }
              />
            </div>

            <div className="mb-3">
              <label className="form-label text-light">Contraseña</label>
              <input
                type="password"
                name="contraseña"
                value={password}
                className="form-control input-dark"
                placeholder="********"
                onChange={
                  (e) => 
                    {
                    setPasword(e.target.value)
                  }
                }
              />
            </div>

            <div className="mb-4">
              <label className="form-label text-light">Confirmar contraseña</label>
              <input
                type="password"
                name="confirmar"
                value={confirm}
                className="form-control input-dark"
                placeholder="********"
                onChange={ (e) => {setConfirm(e.target.value)

                }

                }
                
              />
              {mostrarMensaje ? <span>Usuario repetido</span> : <span></span>}
              
            </div>

            <button  type="submit" className="btn btn-gold w-100 fw-bold py-2">
              REGISTRARSE
            </button>
          </form>

          <p className="text-center mt-4 small text-secondary">
            Al registrarte, aceptas nuestros{" "}
            <span className="text-gold">Términos de Servicio</span> y{" "}
            <span className="text-gold">Política de Privacidad</span>.
          </p>
        </div>

      </div>
  );
}

export default Registro;
