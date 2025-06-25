// deliveryBoyAuthSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// API endpoints
const API_BASE_URL = 'https://health-nutrition-2.onrender.com/api/deliveryboi'; // Update with your backend URL

// Async thunks
export const registerDeliveryBoy = createAsyncThunk(
  'deliveryBoyAuth/register',
  async (deliveryBoyData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/boi`, deliveryBoyData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const loginDeliveryBoy = createAsyncThunk(
  'deliveryBoyAuth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/boi/login`, credentials);
      console.log("response from the data",response.data)
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  deliveryBoyInfo: null,
  token: null,
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

const deliveryBoyAuthSlice = createSlice({
  name: 'deliveryBoyAuth',
  initialState,
  reducers: {
    logout: (state) => {
      state.deliveryBoyInfo = null;
      state.token = null;
      state.status = 'idle';
      state.error = null;
    },
    resetAuthState: (state) => {
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Register reducers
      .addCase(registerDeliveryBoy.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(registerDeliveryBoy.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.deliveryBoyInfo = action.payload.deliveryBoy;
      })
      .addCase(registerDeliveryBoy.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload?.message || 'Registration failed';
      })
      
      // Login reducers
      .addCase(loginDeliveryBoy.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(loginDeliveryBoy.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.deliveryBoyInfo = action.payload.deliveryBoy;
        state.token = action.payload.token;
      })
      .addCase(loginDeliveryBoy.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload?.message || 'Login failed';
      });
  },
});

export const { logout, resetAuthState } = deliveryBoyAuthSlice.actions;

// Selectors
export const selectDeliveryBoyInfo = (state) => state.deliveryBoyAuth.deliveryBoyInfo;
export const selectDeliveryBoyToken = (state) => state.deliveryBoyAuth.token;
export const selectAuthStatus = (state) => state.deliveryBoyAuth.status;
export const selectAuthError = (state) => state.deliveryBoyAuth.error;

export default deliveryBoyAuthSlice.reducer;