import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk for fetching all subscriptions
export const fetchAllSubscriptions = createAsyncThunk(
  'subscriptions/fetchAll',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const token = state.user?.userInfo?.token;

      const response = await axios.get(
        ' https://health-nutrition-2.onrender.com/api/subscriptions/admin/all',
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch subscriptions'
      );
    }
  }
);

// Async thunk for updating subscription status
export const updateSubscriptionStatus = createAsyncThunk(
  'subscriptions/updateStatus',
  async ({ subscriptionId, paymentStatus, status }, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const token = state.user?.userInfo?.token;

      const response = await axios.put(
        ' https://health-nutrition-2.onrender.com/api/subscriptions/update-status',
        {
          subscriptionId,
          paymentStatus,
          status,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update subscription status'
      );
    }
  }
);
const adminsubscriptionSlice = createSlice({
  name: 'adminsubscriptions',
  initialState: {
    subscriptions: [],
    loading: false,
    error: null,
    updateLoading: false,
    updateError: null
  },
  reducers: {
    clearSubscriptionErrors: (state) => {
      state.error = null;
      state.updateError = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch all subscriptions cases
      .addCase(fetchAllSubscriptions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllSubscriptions.fulfilled, (state, action) => {
        state.loading = false;
        state.subscriptions = action.payload;
      })
      .addCase(fetchAllSubscriptions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch subscriptions';
      })
      
      // Update subscription status cases
      .addCase(updateSubscriptionStatus.pending, (state) => {
        state.updateLoading = true;
        state.updateError = null;
      })
      .addCase(updateSubscriptionStatus.fulfilled, (state, action) => {
        state.updateLoading = false;
        const updatedSubscription = action.payload.subscription;
        state.subscriptions = state.subscriptions.map(sub => 
          sub._id === updatedSubscription._id ? updatedSubscription : sub
        );
      })
      .addCase(updateSubscriptionStatus.rejected, (state, action) => {
        state.updateLoading = false;
        state.updateError = action.payload?.message || 'Failed to update subscription';
      });
  }
});

export const { clearSubscriptionErrors } = adminsubscriptionSlice.actions;

export default adminsubscriptionSlice.reducer;