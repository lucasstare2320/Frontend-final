import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// 🔧 Cambiá esta URL según tu backend
const BASE_URL = "http://localhost:8080/api/categories";

// 🔹 Obtener todas las categorías
export const fetchCategories = createAsyncThunk(
  "categories/fetchCategories",
  async () => {
    const { data } = await axios.get(BASE_URL);
    return data;
  }
);

// 🔹 Obtener una categoría por ID
export const fetchCategoryById = createAsyncThunk(
  "categories/fetchCategoryById",
  async (id) => {
    const { data } = await axios.get(`${BASE_URL}/${id}`);
    return data;
  }
);

// 🔹 Crear nueva categoría
export const createCategory = createAsyncThunk(
  "categories/createCategory",
  async ({ name }) => {
    const { data } = await axios.post(BASE_URL, { name });
    return data;
  }
);

const categorySlice = createSlice({
  name: "categories",
  initialState: {
    items: [], // todas las categorías
    selected: null, // categoría seleccionada por id
    loading: false,
    error: null,
  },
  reducers: {
    clearSelectedCategory: (state) => {
      state.selected = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // 🔹 GET ALL
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // 🔹 GET BY ID
      .addCase(fetchCategoryById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategoryById.fulfilled, (state, action) => {
        state.loading = false;
        state.selected = action.payload;
      })
      .addCase(fetchCategoryById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // 🔹 CREATE
      .addCase(createCategory.pending, (state) => {
        state.loading = true;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload);
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { clearSelectedCategory } = categorySlice.actions;
export default categorySlice.reducer;
