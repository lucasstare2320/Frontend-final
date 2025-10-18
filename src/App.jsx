
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import './App.css'
import RUTAS from './paginas/RUTAS'
import { BrowserRouter } from 'react-router-dom';
import { loadUserFromStorage } from './REDUX/userSlice';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Cargar usuario desde localStorage al iniciar la app
    dispatch(loadUserFromStorage());
  }, [dispatch]);

  return (
    <>
      <BrowserRouter>
        <RUTAS></RUTAS>
      </BrowserRouter>
      <ToastContainer position="bottom-right" autoClose={2000} theme="dark" />
    </>
  )
}

export default App