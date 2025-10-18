// REDUX/cartSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
  lastInfo: null, 
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const incoming = action.payload; 
      const add = incoming.qty || 1;

      const idx = state.items.findIndex(i => i.id === incoming.id);

      // si ya existe
      if (idx >= 0) {
        // aseguramos tener stock en el item
        if (incoming.stock != null) state.items[idx].stock = incoming.stock;

        const available = state.items[idx].stock ?? Infinity;
        const current = state.items[idx].qty;
        const desired = current + add;
        const capped = Math.min(desired, available);

        state.items[idx].qty = capped;

        if (desired > available) {
          state.lastInfo = {
            type: "LIMIT_REACHED",
            id: incoming.id,
            name: incoming.name ?? state.items[idx].name,
            stock: available,
          };
        } else {
          state.lastInfo = {
            type: "ADDED",
            id: incoming.id,
            name: incoming.name ?? state.items[idx].name,
            qtyAdded: add,
          };
        }
      } else {
        // nuevo ítem
        const available = incoming.stock ?? Infinity;
        const initialQty = Math.min(add, available);

        state.items.push({
          ...incoming,
          stock: available,
          qty: initialQty,
        });

        if (add > available) {
          state.lastInfo = {
            type: "LIMIT_REACHED",
            ...incoming,
            stock: available,
          };
        } else {
          state.lastInfo = {
            type: "ADDED",
            ...incoming,
            qtyAdded: initialQty,
          };
        }
      }
    },
    updateQty: (state, action) => {
      const { id, qty } = action.payload;
      const item = state.items.find(i => i.id === id);
      if (item) item.qty = Math.max(1, qty);
    },
    removeFromCart: (state, action) => {
      const id = action.payload;
      state.items = state.items.filter(i => i.id !== id);
    },
    clearCart: (state) => {
      state.items = [];
    },
    clearLastInfo: (state) => {
      state.lastInfo = null;
    },
  
  },
});

export const { addToCart, updateQty, removeFromCart, clearCart, clearLastInfo } = cartSlice.actions;
export default cartSlice.reducer;
