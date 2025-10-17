import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cartItems: [], // { id, name, price, qty, image, etc. }
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      const existItem = state.cartItems.find((x) => x.id === item.id);

      if (existItem) {
        // Si ya existe, aumenta la cantidad
        existItem.qty += item.qty;
      } else {
        // Si no existe, lo agrega
        state.cartItems.push(item);
      }
    },

    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter(
        (item) => item.id !== action.payload
      );
    },

    clearCart: (state) => {
      state.cartItems = [];
    },

    updateQty: (state, action) => {
      const { id, qty } = action.payload;
      const item = state.cartItems.find((x) => x.id === id);
      if (item) item.qty = qty;
    },
  },
});

export const { addToCart, removeFromCart, clearCart, updateQty } =
  cartSlice.actions;
export default cartSlice.reducer;