
import './App.css'
import RUTAS from './paginas/RUTAS'
import { BrowserRouter } from 'react-router-dom';

function App() {

  return (
    <>
      <BrowserRouter>

        <RUTAS></RUTAS>
      </BrowserRouter>

    </>
  )
}

export default App
