// src/REDUX/orderSlice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API = "http://localhost:8080";
// Crea la orden
export const createOrder = createAsyncThunk(
  "orders/createOrder",
  async ({ userId, items, status = "PENDING" }, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const token = state.users?.user?.token || localStorage.getItem("token");
      const config = {
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      };
      const body = { userId, items, status };
      const { data } = await axios.post(`${API}/orders`, body, config);
      return data; 
    } catch (err) {
      return rejectWithValue(err?.response?.data || "Error creando la orden");
    }
  }
);

export const fetchUserOrders = createAsyncThunk(
  "orders/fetchUserOrders",
  async (userId, { getState, rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${API}/orders`);
      return data;
    } catch (err) {
      return rejectWithValue(err?.response?.data || "Error obteniendo órdenes");
    }
  }
);

const orderSlice = createSlice({
  name: "orders",
  initialState: {
    creating: false,
    errorCreate: null,
    list: [],
    loadingList: false,
    errorList: null,
    lastCreated: null,
  },
  reducers: {
    setOrders: (st, action) => {
      st.list = Array.isArray(action.payload) ? action.payload : [];
    },
    clearOrders: (st) => {
      st.list = [];
      st.lastCreated = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // createOrder
      .addCase(createOrder.pending, (st) => {
        st.creating = true; st.errorCreate = null; st.lastCreated = null;
      })
      .addCase(createOrder.fulfilled, (st, action) => {
        st.creating = false; st.lastCreated = action.payload;
        st.list = [action.payload, ...st.list];
      })
      .addCase(createOrder.rejected, (st, action) => {
        st.creating = false; st.errorCreate = action.payload || "Error";
      })
      // fetchUserOrders
      .addCase(fetchUserOrders.pending, (st) => {
        st.loadingList = true; st.errorList = null;
      })
      .addCase(fetchUserOrders.fulfilled, (st, action) => {
        st.loadingList = false; st.list = action.payload || [];
      })
      .addCase(fetchUserOrders.rejected, (st, action) => {
        st.loadingList = false; st.errorList = action.payload || "Error";
      });
  }
});

export default orderSlice.reducer;
