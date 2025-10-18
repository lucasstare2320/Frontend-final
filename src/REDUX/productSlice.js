import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { details } from "framer-motion/client";

const BASE_URL = "http://localhost:8080/products"; 

// 🔹 Obtener lista de productos con filtros opcionales
export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async ({ minPrice, maxPrice, categoryId } = {}) => {
    const params = {};
    if (minPrice) params.minPrice = minPrice;
    if (maxPrice) params.maxPrice = maxPrice;
    if (categoryId) params.categoryId = categoryId;

    const { data } = await axios.get(BASE_URL, { params });
    return data.filter(item => item.image)
  }
);



// 🔹 Crear nuevo producto
export const createProduct = createAsyncThunk(
  "products/createProduct",
  async ({ name, description, price, stock, categoryId, sellerId }) => {
    const body = { name, description, price, stock, categoryId, sellerId };
    const { data } = await axios.post(BASE_URL, body);
    return data;
  }
);

// 🔹 Actualizar producto (PATCH)
export const updateProduct = createAsyncThunk(
  "products/updateProduct",
  async ({ id, name, description, price, stock, categoryId, sellerId }) => {
    const body = { name, description, price, stock, categoryId, sellerId };
    const { data } = await axios.patch(`${BASE_URL}/${id}`, body);
    return data;
  }
);

// 🔹 Eliminar producto
export const deleteProduct = createAsyncThunk(
  "products/deleteProduct",
  async (id) => {
    await axios.delete(`${BASE_URL}/${id}`);
    return id;
  }
);

// 🔹 Obtener un producto por ID
export const fetchProductById = createAsyncThunk(
  "products/fetchProductById",
  async (id) => {
    const { data } = await axios(`${BASE_URL}/${id}`);
    return data;
  }
);

const productSlice = createSlice({
  name: "products",
  initialState: {
    items: [],
    details: {},
    loading: false,
    error: null,
  }, 
  reducers: {
    clearSelectedProduct: (state) => {
      state.selected = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // GET ALL
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // GET BY ID
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false
        state.details = action.payload;
      })
      .addCase(fetchProductById.pending, (state)=>{
        state.loading = true
        state.error = null
      })

      // CREATE
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload);
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // UPDATE
      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.items.findIndex((p) => p.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })

      // DELETE
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.items = state.items.filter((p) => p.id !== action.payload);
      });
      
  },
});

export const { clearSelectedProduct } = productSlice.actions;
export default productSlice.reducer;
