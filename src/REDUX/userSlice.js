import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios"

const URL = "http://localhost:8080"

// Helper functions para localStorage
const saveUserToLocalStorage = (user) => {
  try {
    localStorage.setItem('user', JSON.stringify(user));
  } catch (error) {
    console.error('Error saving user to localStorage:', error);
  }
};

const loadUserFromLocalStorage = () => {
  try {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error('Error loading user from localStorage:', error);
    return null;
  }
};

const removeUserFromLocalStorage = () => {
  try {
    localStorage.removeItem('user');
  } catch (error) {
    console.error('Error removing user from localStorage:', error);
  }
};

export const postUsuario = createAsyncThunk("users/postUser", async (newuser) => {
  console.log(newuser)
  const { data } = await axios.post(`${URL}/auth/register`, newuser);
  console.log(data)
  return data
})

export const loginUsuario = createAsyncThunk("users/loginUser", async (newuser) => {
  console.log(newuser)
  const { data } = await axios.post(`${URL}/auth/login`, newuser);
  console.log(data)
  return data
})

// Actualizar perfil de usuario
export const updateUserProfile = createAsyncThunk("users/updateProfile", async (userData, { getState }) => {
  const state = getState();
  const userId = state.users.user.id;
  const token = state.users.user.token || localStorage.getItem('token');

  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    }
  };

  const { data } = await axios.patch(`${URL}/users/${userId}`, userData, config);
  console.log("Usuario actualizado:", data);
  return data;
})

// Agregar dirección
export const addAddressToAPI = createAsyncThunk("users/addAddress", async (addressData, { getState }) => {
  const state = getState();
  const userId = state.users.user.id;
  const token = state.users.user.token || localStorage.getItem('token');

  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    }
  };

  const { data } = await axios.post(`${URL}/user/${userId}/addresses`, addressData, config);
  console.log("Dirección agregada:", data);
  return data;
})

// Actualizar dirección
export const updateAddressInAPI = createAsyncThunk("users/updateAddress", async ({ addressId, addressData }, { getState }) => {
  const state = getState();
  const userId = state.users.user.id;
  const token = state.users.user.token || localStorage.getItem('token');

  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    }
  };

  const { data } = await axios.patch(`${URL}/user/${userId}/addresses/${addressId}`, addressData, config);
  console.log("Dirección actualizada:", data);
  return data;
})

// Eliminar dirección
export const deleteAddressFromAPI = createAsyncThunk("users/deleteAddress", async (addressId, { getState }) => {
  const state = getState();
  const userId = state.users.user.id;
  const token = state.users.user.token || localStorage.getItem('token');

  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    }
  };

  await axios.delete(`${URL}/user/${userId}/addresses/${addressId}`, config);
  console.log("Dirección eliminada:", addressId);
  return addressId;
})


const userSlide = createSlice({
  name: "users",
  initialState: {
    user: loadUserFromLocalStorage() || {},
    loading: false,
    error: null
  },
  reducers: {
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
      saveUserToLocalStorage(state.user);
    },
    logoutUser: (state) => {
      state.user = {};
      state.loading = false;
      state.error = null;
      removeUserFromLocalStorage();
    },
    loadUserFromStorage: (state) => {
      const user = loadUserFromLocalStorage();
      if (user) {
        state.user = user;
      }
    },
    addAddress: (state, action) => {
      if (!state.user.addresses) {
        state.user.addresses = [];
      }
      state.user.addresses.push(action.payload);
    },
    updateAddress: (state, action) => {
      const { index, address } = action.payload;
      if (state.user.addresses && state.user.addresses[index]) {
        state.user.addresses[index] = { ...state.user.addresses[index], ...address };
      }
    },
    deleteAddress: (state, action) => {
      if (state.user.addresses) {
        state.user.addresses = state.user.addresses.filter((_, i) => i !== action.payload);
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // Post Usuario
      .addCase(postUsuario.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(postUsuario.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        saveUserToLocalStorage(action.payload);
      })
      .addCase(postUsuario.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Login Usuario
      .addCase(loginUsuario.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUsuario.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        saveUserToLocalStorage(action.payload);
      })
      .addCase(loginUsuario.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Update User Profile
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = { ...state.user, ...action.payload };
        saveUserToLocalStorage(state.user);
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Add Address
      .addCase(addAddressToAPI.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addAddressToAPI.fulfilled, (state, action) => {
        state.loading = false;
        if (!state.user.addresses) {
          state.user.addresses = [];
        }
        state.user.addresses.push(action.payload);
        saveUserToLocalStorage(state.user);
      })
      .addCase(addAddressToAPI.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Update Address
      .addCase(updateAddressInAPI.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAddressInAPI.fulfilled, (state, action) => {
        state.loading = false;
        const updatedAddress = action.payload;
        const index = state.user.addresses.findIndex(addr => addr.id === updatedAddress.id);
        if (index !== -1) {
          state.user.addresses[index] = updatedAddress;
        }
        saveUserToLocalStorage(state.user);
      })
      .addCase(updateAddressInAPI.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Delete Address
      .addCase(deleteAddressFromAPI.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAddressFromAPI.fulfilled, (state, action) => {
        state.loading = false;
        const addressId = action.payload;
        if (state.user.addresses) {
          state.user.addresses = state.user.addresses.filter(addr => addr.id !== addressId);
        }
        saveUserToLocalStorage(state.user);
      })
      .addCase(deleteAddressFromAPI.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

  },
});

export const { updateUser, logoutUser, addAddress, updateAddress, deleteAddress, loadUserFromStorage } = userSlide.actions;
export default userSlide.reducer;