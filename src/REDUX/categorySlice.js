import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const URL = "http://localhost:8080";

export const fetchCategories = createAsyncThunk(
  "categories/fetchAll",
  async () => {
    const { data } = await axios.get(`${URL}/category`);
    // data esperado: [{id:1,name:"Eau de Toilette"}, ...]
    return data;
  }
);

const categorySlice = createSlice({
  name: "categories",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload || [];
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message || "Error cargando categorías";
      });
  },
});

export default categorySlice.reducer;
