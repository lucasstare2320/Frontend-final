import { configureStore } from "@reduxjs/toolkit";
import postReducer from "./userSlice";
import cartReducer from "./cartSlice";
import productReducer from "./productSlice";
import categoryReducer from "./categorySlice";
import carritoReducer from "./carritoSlice";
import userReducer from "./userSlice";


export const store = configureStore({
  reducer: {
    cart: cartReducer,         
    products: productReducer,  
    categories: categoryReducer,
    users: userReducer, 
    carrito : carritoReducer
  },
});