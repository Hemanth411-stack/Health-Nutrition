import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// API base URL
const API_BASE_URL = 'https://health-nutrition-2.onrender.com/api/deliveryboi'; // Update with your backend URL

// Async Thunks
export const registerDeliveryBoy = createAsyncThunk(
  'deliveryBoy/register',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/boi/register`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const loginDeliveryBoy = createAsyncThunk(
  'deliveryBoy/login',
  async ({ phone, password }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/boi/login`, { phone, password });
      console.log("response frm the login ",response.data)
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateDeliveryBoyProfile = createAsyncThunk(
  'deliveryBoy/updateProfile',
  async ({ formData }, { getState,rejectWithValue }) => {
    try {
      const state = getState();
      const token = state.deliveryBoyAuth.token;
      const response = await axios.put(
        `${API_BASE_URL}/deliveryboi-address-update`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      console.log("update profile data",response.data)
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const initialState = {
  deliveryBoy: null,
  token: null,
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null
};

const deliveryBoyAuthSlice = createSlice({
  name: 'deliveryBoyAuth',
  initialState,
  reducers: {
    logout: (state) => {
      state.deliveryBoy = null;
      state.token = null;
      state.status = 'idle';
      state.error = null;
    },
    resetAuthState: (state) => {
      state.status = 'idle';
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(registerDeliveryBoy.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(registerDeliveryBoy.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.deliveryBoy = action.payload.data;
      })
      .addCase(registerDeliveryBoy.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload?.message || 'Registration failed';
      })

      // Login
      .addCase(loginDeliveryBoy.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(loginDeliveryBoy.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.deliveryBoy = action.payload.deliveryBoy;
        console.log("delivery info",state.deliveryBoy)
        state.token = action.payload.token;
      })
      .addCase(loginDeliveryBoy.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload?.message || 'Login failed';
      })

      // Update Profile
      .addCase(updateDeliveryBoyProfile.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateDeliveryBoyProfile.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.deliveryBoy = action.payload.data;

      })
      .addCase(updateDeliveryBoyProfile.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload?.message || 'Profile update failed';
      });
  }
});

export const { logout, resetAuthState } = deliveryBoyAuthSlice.actions;

// Selectors
export const selectDeliveryBoy = (state) => state.deliveryBoyAuth.deliveryBoy;
export const selectDeliveryBoyToken = (state) => state.deliveryBoyAuth.token;
export const selectAuthStatus = (state) => state.deliveryBoyAuth.status;
export const selectAuthError = (state) => state.deliveryBoyAuth.error;

export default deliveryBoyAuthSlice.reducer;