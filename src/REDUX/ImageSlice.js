import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";


// 🔹 Obtener un producto por ID
export const fetchImagesById = createAsyncThunk(
  "images/fetchProductById",
  async (id) => {
    const { data } = await axios(`http://localhost:8080/images/products/${id}/images`);
    console.log("ssssssssssss", data)
    return data;
  }
);

const imagesSlice = createSlice({
  name: "images",
  initialState: {
    items: [],
    loading: false,
    error: null,
  }, 
  reducers: {  
  },
  extraReducers: (builder) => {
    builder
      // GET BY ID
      .addCase(fetchImagesById.fulfilled, (state, action) => {
        state.loading = false
      })
      .addCase(fetchImagesById.pending, (state)=>{
        state.loading = true
        state.error = null
      })
      .addCase(fetchImagesById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })      
  },
});

export default imagesSlice.reducer;
