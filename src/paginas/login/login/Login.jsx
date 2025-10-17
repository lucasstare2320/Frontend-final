import React, { useState } from "react";
import { useDispatch } from "react-redux";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Login.css";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { loginUsuario } from "../../../REDUX/userSlice";
function Login() {
  const dispatch = useDispatch(); 
   const navigate = useNavigate()
  const location = useLocation() // permite saber en que ruta estamos 
  const [username, setUsername] = useState("")

  const [password, setPassword] = useState("")

  const [mostrarMensaje, setMostrarMensaje] = useState(false)

  const handleLoginSubmit = async (e) => {
    e.preventDefault()
    const result = await dispatch(loginUsuario({username,password}))
    setUsername("")
    setPassword("")
    if (loginUsuario.fulfilled.match(result)) {
            console.log("se inicio sesion correctamente")
         navigate("/productos");
        } else {
          setMostrarMensaje(true)
          console.log("no se puedo inciar sesion")
        }
  }

  
  return (
    <div className="perfume-bg d-flex align-items-center rounded justify-content-center min-vh-100">
        
        {/* Panel Derecho - Login */}
        <div className="col-md-6 p-5 bg-dark">
          <h3 className="text-gold fw-bold text-center mb-4">INICIA SESIÓN</h3>
          <form onSubmit={handleLoginSubmit}>
            <label className="form-label text-light">Usuario</label>
            <input
              type="text"
              name="usuario"
              className="form-control input-dark mb-3"
              placeholder="Usuario"
              onChange={(e)=> {setUsername(e.target.value)}}
              value = {username}
            />
            <label className="form-label text-light">Contraseña</label>
            <input
              type="password"
              name="contraseña"
              className="form-control input-dark mb-4"
              placeholder="Contraseña"
              onChange={(e)=> {setPassword(e.target.value)}}
              value = {password}
            />
            <button type="submit" className="btn btn-gold w-100 fw-bold py-2" disabled={!username || !password}>
              INICIAR SESIÓN
            </button>
          </form>
          <p className="text-center text-muted small mt-4 mb-0">
            © 2025 EL CÓDIGO PERFUMERIE. Todos los derechos reservados.
          </p>
          <span onClick={() => navigate("/registro")}>
            No tienes cuenta ? click para registrarte 

          </span>
          
          {mostrarMensaje ?(<div className="error-message">
            No se pudo inciar sesion
          </div>) : <div></div>}
        </div>
      </div>
  );
}

export default Login;
