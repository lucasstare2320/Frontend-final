import React from 'react'
import { Route, Routes } from 'react-router-dom'
import LandingPage from './landingpage/Landingpage'
import ProductDetail from './productdetail/ProductDetail'
import Productos from './productos/Productos'
import Carrito from './carrito/Carrito'
import Usuario from './perfil/Usuario'
import Checkout from './checkout/Checkout'
import Misproductos from './misproductos/Misproductos'
import Login from './login/login/Login'
import Registro from './login/registro/registro'
import Agregarproducto from './agregarproducto/AddProduct'
import ProtectedRoute from '../components/ProtectedRoute'

//este componente sirve para hacer las rutas, es decir, cambiar entre paginas sin recargar
// se pueden poner rutas en app pero en gral me gusta en un componente separado


function RUTAS() {

  return (
    <>
      <Routes>
        {/* Rutas públicas */}
        <Route path='/' element={<LandingPage></LandingPage>}></Route>
        <Route path='/login' element={<Login />}></Route>
        <Route path='/registro' element={<Registro />}></Route>
        <Route path='/landingpage' element={<LandingPage></LandingPage>}></Route>
        <Route path='/productos' element={<Productos />}></Route>
        <Route path='/detalle/:id' element={<ProductDetail />}></Route>

        {/* Rutas protegidas - requieren autenticación */}
        <Route
          path='/perfil'
          element={
            <ProtectedRoute>
              <Usuario />
            </ProtectedRoute>
          }
        />
        <Route
          path='/carrito'
          element={
            <ProtectedRoute>
              <Carrito />
            </ProtectedRoute>
          }
        />
        <Route
          path='/checkout'
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          }
        />
        <Route
          path='/misproductos'
          element={
            <ProtectedRoute>
              <Misproductos />
            </ProtectedRoute>
          }
        />
        <Route
          path='/misproductos/nuevo'
          element={
            <ProtectedRoute>
              <Agregarproducto />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  )
}

export default RUTAS