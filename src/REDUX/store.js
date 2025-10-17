import { configureStore } from "@reduxjs/toolkit";
import postReducer from "./userSlice";
import cartReducer from "./cartSlice";
import productReducer from "./productSlice";
import categoryReducer from "./categorySlice";


export const store = configureStore({
  reducer: {
    posts: postReducer,        
    cart: cartReducer,         
    products: productReducer,  
    categories: categoryReducer, 
  },
});