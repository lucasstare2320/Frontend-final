import { createSlice } from "@reduxjs/toolkit";


const carritoSlice = createSlice({
name: "carrito",
  initialState:{
    cartItems:[]
  },
  reducers: {
    // Añade o incrementa cantidad
    addToCart: (state, action) => {
      const incoming = action.payload; // { qty }
      state.qty += incoming.qty || 1;
    },

    // Actualiza cantidad explícitamente
    updateCartQty: (state, action) => {
      const { qty } = action.payload;
      state.qty = Math.max(1, qty);
    },

    // Elimina (pone cantidad en 0)
    removeFromCart: (state) => {
      state.qty = 0;
    },

    // Limpia (vuelve al estado inicial)
    clearCart: () => initialState,
  },
    
})

export default carritoSlice.reducer;