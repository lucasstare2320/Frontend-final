import React from 'react';
import ReactDOM from 'react-dom/client'; // 👈 usa react-dom/client
import { Provider } from 'react-redux';
import App from './App';
import {store} from './REDUX/store';

// ✅ Nueva forma en React 18+
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
