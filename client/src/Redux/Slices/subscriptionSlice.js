import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = ' https://health-nutrition-2.onrender.com/api/subscriptions';

// Async Thunks
export const createSubscription = createAsyncThunk(
  'subscriptions/createSubscription',
  async (subscriptionData, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const token = state.user?.userInfo?.token;

      console.log("Subscription testing data:", subscriptionData);
      console.log("Access token being sent:", token);

      if (!token) {
        return rejectWithValue('No token found');
      }

      const response = await axios.post(API_URL, subscriptionData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to create subscription'
      );
    }
  }
);

export const fetchUserSubscriptions = createAsyncThunk(
  'subscriptions/fetchUserSubscriptions',
  async (userId, { getState, rejectWithValue }) => {
    try {
      const token = getState().user?.userInfo?.token;

      if (!token) {
        return rejectWithValue('No token found');
      }

      const response = await axios.get(`${API_URL}/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch subscriptions'
      );
    }
  }
);

export const fetchUserSubscriptionStats = createAsyncThunk(
  'subscriptions/fetchUserSubscriptionStats',
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().user?.userInfo?.token;

      if (!token) {
        return rejectWithValue('No token found');
      }

      const response = await axios.get(`${API_URL}/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch subscription stats'
      );
    }
  }
);

export const cancelUserSubscription = createAsyncThunk(
  'subscriptions/cancelSubscription',
  async (subscriptionId, { rejectWithValue }) => {
    try {
      const response = await axios.patch(`${API_URL}/${subscriptionId}/cancel`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Initial State
const initialState = {
  subscriptions: [],
  subscriptionStats: null,
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  subscriptionStatus: 'idle', // For create/cancel operations
  statsStatus: 'idle', // For stats operations
  error: null,
};

// Slice
const subscriptionSlice = createSlice({
  name: 'subscriptions',
  initialState,
  reducers: {
    resetSubscriptionStatus(state) {
      state.subscriptionStatus = 'idle';
      state.error = null;
    },
  },
  extraReducers(builder) {
    builder
      // Create Subscription
      .addCase(createSubscription.pending, (state) => {
        state.subscriptionStatus = 'loading';
      })
      .addCase(createSubscription.fulfilled, (state, action) => {
        state.subscriptionStatus = 'succeeded';
        state.subscriptions.push(action.payload);
      })
      .addCase(createSubscription.rejected, (state, action) => {
        state.subscriptionStatus = 'failed';
        state.error = action.payload?.message || 'Failed to create subscription';
      })

      // Fetch User Subscriptions
      .addCase(fetchUserSubscriptions.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUserSubscriptions.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.subscriptions = action.payload;
      })
      .addCase(fetchUserSubscriptions.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload?.message || 'Failed to fetch subscriptions';
      })

      // Fetch User Subscription Stats
      .addCase(fetchUserSubscriptionStats.pending, (state) => {
        state.statsStatus = 'loading';
      })
      .addCase(fetchUserSubscriptionStats.fulfilled, (state, action) => {
        state.statsStatus = 'succeeded';
        state.subscriptionStats = action.payload;
      })
      .addCase(fetchUserSubscriptionStats.rejected, (state, action) => {
        state.statsStatus = 'failed';
        state.error = action.payload?.message || 'Failed to fetch subscription stats';
      })

      // Cancel Subscription
      .addCase(cancelUserSubscription.pending, (state) => {
        state.subscriptionStatus = 'loading';
      })
      .addCase(cancelUserSubscription.fulfilled, (state, action) => {
        state.subscriptionStatus = 'succeeded';
        const index = state.subscriptions.findIndex(
          sub => sub._id === action.payload._id
        );
        if (index !== -1) {
          state.subscriptions[index] = action.payload;
        }
      })
      .addCase(cancelUserSubscription.rejected, (state, action) => {
        state.subscriptionStatus = 'failed';
        state.error = action.payload?.message || 'Failed to cancel subscription';
      });
  },
});

// Export Actions and Reducer
export const { resetSubscriptionStatus } = subscriptionSlice.actions;
export default subscriptionSlice.reducer;

// Selectors
export const selectSubscriptions = (state) => state.subscriptions.subscriptions;
export const selectSubscriptionStats = (state) => state.subscriptions.subscriptionStats;
export const selectSubscriptionStatus = (state) => state.subscriptions.status;
export const selectSubscriptionStatsStatus = (state) => state.subscriptions.statsStatus;
export const selectSubscriptionOperationStatus = (state) => 
  state.subscriptions.subscriptionStatus;
export const selectSubscriptionError = (state) => state.subscriptions.error;