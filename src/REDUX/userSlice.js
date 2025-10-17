import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios"

const URL = "http://localhost:8080/auth"

export const postUsuario = createAsyncThunk("users/postUser", async(newuser) =>{
  console.log(newuser)
 const {data} = await axios.post(`${URL}/register`, newuser);
 console.log(data)
 return data
})

export const loginUsuario = createAsyncThunk("users/loginUser", async(newuser) =>{
  console.log(newuser)
 const {data} = await axios.post(`${URL}/login`, newuser);
 console.log(data)
 return data
})


const userSlide = createSlice({
    name:"users",
    initialState:{
        user:{},
        loading: false,
        error: null
    },
    reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(postUsuario.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(postUsuario.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(postUsuario.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(loginUsuario.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUsuario.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(loginUsuario.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      
    },
});
export default userSlide.reducer;
