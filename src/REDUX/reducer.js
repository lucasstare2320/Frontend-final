const initialState = {
  isLoggedIn: false,
  user: null,
  selectedProduct: null,
  cartItems: [], // carrito
  admin:false
};

function userReducer(state = initialState, action) {
  switch (action.type) {
    //ESTO ES PARA ENTRAR Y ADEMAS VERIFICAR SI ES ADMIN
    // SI LA VARIABLE ID = 1 ENTONCES ADMIN ES TRUE
    //SACAR A FUTURO CUANDO SE MANEJE POR BACK ESTO !!!!!!!
    case "LOGIN_SUCCESS":
        const user = action.payload;
  return { 
    ...state, 
    isLoggedIn: true, 
    user: {
      ...user,
      admin: user.id === 1 ? true : false
    } 
  };

    case "LOGOUT":
      return { ...state, isLoggedIn: false, user: null, cartItems: [] };

    case "SET_SELECTED_PRODUCT":
      return { ...state, selectedProduct: action.payload };

    case "CLEAR_SELECTED_PRODUCT":
      return { ...state, selectedProduct: null };

    // Carrito: añade o incrementa
    case "ADD_TO_CART": {
      const incoming = action.payload; // {id, name, brand, price, currency, image, qty}
      const existingIndex = state.cartItems.findIndex((i) => i.id === incoming.id);

      if (existingIndex >= 0) {
        const updated = [...state.cartItems];
        updated[existingIndex] = {
          ...updated[existingIndex],
          qty: updated[existingIndex].qty + (incoming.qty || 1),
        };
        return { ...state, cartItems: updated };
      }

      return { ...state, cartItems: [...state.cartItems, { ...incoming, qty: incoming.qty || 1 }] };
    }

    // Actualiza cantidad explícitamente
    case "UPDATE_CART_QTY": {
      const { id, qty } = action.payload;
      const updated = state.cartItems.map((i) => (i.id === id ? { ...i, qty: Math.max(1, qty) } : i));
      return { ...state, cartItems: updated };
    }

    // Elimina un item del carrito
    case "REMOVE_FROM_CART": {
      const { id } = action.payload;
      return { ...state, cartItems: state.cartItems.filter((i) => i.id !== id) };
    }

    // Limpia el carrito
    case "CLEAR_CART":
      return { ...state, cartItems: [] };

    default:
      return state;
  }
}

export default userReducer;