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

// Helper functions para guardar direcciones por usuario en localStorage
const saveAddressesToLocalStorage = (userId, addresses) => {
  try {
    const key = `addresses_user_${userId}`;
    localStorage.setItem(key, JSON.stringify(addresses));
  } catch (error) {
    console.error('Error saving addresses to localStorage:', error);
  }
};

const loadAddressesFromLocalStorage = (userId) => {
  try {
    const key = `addresses_user_${userId}`;
    const addresses = localStorage.getItem(key);
    return addresses ? JSON.parse(addresses) : [];
  } catch (error) {
    console.error('Error loading addresses from localStorage:', error);
    return [];
  }
};

const removeAddressesFromLocalStorage = (userId) => {
  try {
    const key = `addresses_user_${userId}`;
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing addresses from localStorage:', error);
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

  const { data } = await axios.post(`${URL}/users/${userId}/addresses`, addressData, config);
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

  const { data } = await axios.patch(`${URL}/users/${userId}/addresses/${addressId}`, addressData, config);
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

  await axios.delete(`${URL}/users/${userId}/addresses/${addressId}`, config);
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
      // NO eliminamos las direcciones para que persistan por usuario
      // Las direcciones se mantienen en 'addresses_user_{userId}' para cuando vuelva a loguearse
      state.user = {};
      state.loading = false;
      state.error = null;
      removeUserFromLocalStorage();
    },
    logoutUserAndClearAll: (state) => {
      // Esta función SÍ elimina todo, incluyendo direcciones
      // Úsala solo si quieres borrar completamente todos los datos del usuario
      const userId = state.user.id;
      if (userId) {
        removeAddressesFromLocalStorage(userId);
      }
      state.user = {};
      state.loading = false;
      state.error = null;
      removeUserFromLocalStorage();
    },
    loadUserFromStorage: (state) => {
      const user = loadUserFromLocalStorage();
      if (user) {
        state.user = user;
        // Cargar direcciones desde localStorage si existen
        if (user.id) {
          const localAddresses = loadAddressesFromLocalStorage(user.id);
          if (localAddresses.length > 0) {
            state.user.addresses = localAddresses;
          }
        }
      }
    },
    addAddress: (state, action) => {
      if (!state.user.addresses) {
        state.user.addresses = [];
      }
      state.user.addresses.push(action.payload);
      // Guardar en localStorage
      if (state.user.id) {
        saveAddressesToLocalStorage(state.user.id, state.user.addresses);
      }
      saveUserToLocalStorage(state.user);
    },
    updateAddress: (state, action) => {
      const { index, address } = action.payload;
      if (state.user.addresses && state.user.addresses[index]) {
        state.user.addresses[index] = { ...state.user.addresses[index], ...address };
        // Guardar en localStorage
        if (state.user.id) {
          saveAddressesToLocalStorage(state.user.id, state.user.addresses);
        }
        saveUserToLocalStorage(state.user);
      }
    },
    deleteAddress: (state, action) => {
      if (state.user.addresses) {
        state.user.addresses = state.user.addresses.filter((_, i) => i !== action.payload);
        // Guardar en localStorage
        if (state.user.id) {
          saveAddressesToLocalStorage(state.user.id, state.user.addresses);
        }
        saveUserToLocalStorage(state.user);
      }
    },
    // Nueva acción para sincronizar direcciones locales
    syncAddressesFromLocal: (state) => {
      if (state.user.id) {
        const localAddresses = loadAddressesFromLocalStorage(state.user.id);
        if (localAddresses.length > 0) {
          state.user.addresses = localAddresses;
          saveUserToLocalStorage(state.user);
        }
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
        // Guardar en localStorage específico por usuario
        if (state.user.id) {
          saveAddressesToLocalStorage(state.user.id, state.user.addresses);
        }
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
        // Guardar en localStorage específico por usuario
        if (state.user.id) {
          saveAddressesToLocalStorage(state.user.id, state.user.addresses);
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
        // Guardar en localStorage específico por usuario
        if (state.user.id) {
          saveAddressesToLocalStorage(state.user.id, state.user.addresses);
        }
        saveUserToLocalStorage(state.user);
      })
      .addCase(deleteAddressFromAPI.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

  },
});

export const {
  updateUser,
  logoutUser,
  logoutUserAndClearAll,
  addAddress,
  updateAddress,
  deleteAddress,
  loadUserFromStorage,
  syncAddressesFromLocal
} = userSlide.actions;
export default userSlide.reducer;