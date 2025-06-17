// subscriptionSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Initial state
const initialState = {
  loading: false,
  success: false,
  deletedDeliveries: 0,
  error: null,
};
const API_URL = 'https://health-nutrition-2.onrender.com/api/deliveries/admin-delete-subscription'
// Async thunk for deleting subscription and deliveries
export const deleteSubscriptionAndDeliveries = createAsyncThunk(
  'admin/delete',
  async (subscriptionId, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const token = state.user?.userInfo?.token || "your_fallback_token";

      console.log("Subscription testing data:", subscriptionId);
      console.log("Access token being sent:", token);

      if (!token) {
        return rejectWithValue('No token found');
      }

      const response = await axios.delete(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        data: { subscriptionId } // ✅ send body here
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to delete subscription'
      );
    }
  }
);


export const cancelsubscriptionSlice = createSlice({
  name: 'cancelsubscription',
  initialState,
  reducers: {
    resetDeleteState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
      state.deletedDeliveries = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(deleteSubscriptionAndDeliveries.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(deleteSubscriptionAndDeliveries.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.deletedDeliveries = action.payload.deletedDeliveries;
      })
      .addCase(deleteSubscriptionAndDeliveries.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.error.message || 'Failed to delete subscription';
      });
  },
});

export const { resetDeleteState } = cancelsubscriptionSlice.actions;
export default cancelsubscriptionSlice.reducer;