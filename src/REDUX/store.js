import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./cartSlice";
import productReducer from "./productSlice";
import categoryReducer from "./categorySlice";
import userReducer from "./userSlice";
import orderReducer from "./orderSlice"


export const store = configureStore({
  reducer: {
    cart: cartReducer,         
    products: productReducer,  
    categories: categoryReducer,
    users: userReducer, 
    orders: orderReducer
  },
});