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
//este componente sirve para hacer las rutas, es decir, cambiar entre paginas sin recargar
// se pueden poner rutas en app pero en gral me gusta en un componente separado


function RUTAS() {

  return (
    <>
      <Routes>
        <Route path='/' element={<Login />}></Route>
        <Route path='/landingpage' element={<LandingPage></LandingPage>}></Route>
        <Route path='/detalle/:id' element={<ProductDetail />}></Route>
        <Route path='/productos' element={<Productos />}></Route>
        <Route path='/carrito' element={<Carrito />}></Route>
        <Route path='/perfil' element={<Usuario />}></Route>
        <Route path='/checkout' element={<Checkout />}></Route>
        <Route path='/misproductos' element={<Misproductos />}></Route>
        <Route path='/registro' element={<Registro />}></Route>
        <Route path='/misproductos/nuevo' element={<Agregarproducto />}></Route>


      </Routes>
    </>
  )
}

export default RUTAS