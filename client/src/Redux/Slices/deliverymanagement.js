import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Base URL for API
const API_URL = 'https://health-nutrition-2.onrender.com/api/deliveries';

// Async Thunks
export const fetchAllDeliveries = createAsyncThunk(
  'deliveries/fetchAll',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const token = state.deliveryBoyAuth.token;

      const response = await axios.get(`${API_URL}/deliveryboi-address`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to fetch deliveries'
      );
    }
  }
);

export const updateDeliveryStatus = createAsyncThunk(
  'deliveries/updateStatus',
  async ({ deliveryId, status }, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const token = state.deliveryBoyAuth.token;

      const response = await axios.put(
        `${API_URL}/status`,
        {
          deliveryId,
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
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to update delivery status'
      );
    }
  }
);

// Initial State
const initialState = {
  deliveries: [],
  loading: false,
  error: null,
  updateLoading: false,
  updateError: null,
  lastUpdated: null
};

// Slice
const deliverymanagementSlice = createSlice({
  name: 'deliveriesmanagement',
  initialState,
  reducers: {
    clearDeliveryErrors: (state) => {
      state.error = null;
      state.updateError = null;
    },
    resetDeliveryState: () => initialState,
    updateLocalDeliveryStatus: (state, action) => {
      const { deliveryId, status } = action.payload;
      const index = state.deliveries.findIndex(d => d._id === deliveryId);
      if (index !== -1) {
        state.deliveries[index].status = status;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch All Deliveries
      .addCase(fetchAllDeliveries.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllDeliveries.fulfilled, (state, action) => {
        state.loading = false;
        state.deliveries = action.payload.deliveries || [];
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchAllDeliveries.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch deliveries';
      })

      // Update Delivery Status
      .addCase(updateDeliveryStatus.pending, (state) => {
        state.updateLoading = true;
        state.updateError = null;
      })
      .addCase(updateDeliveryStatus.fulfilled, (state, action) => {
        state.updateLoading = false;
        if (!action.payload?.delivery) return;
        
        const updated = action.payload.delivery;
        state.deliveries = state.deliveries.map(d => 
          d._id === updated._id ? { ...d, status: updated.status } : d
        );
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(updateDeliveryStatus.rejected, (state, action) => {
        state.updateLoading = false;
        state.updateError = action.payload || 'Failed to update delivery status';
      });
  }
});

// Export actions and reducer
export const { clearDeliveryErrors, resetDeliveryState } = deliverymanagementSlice.actions;
export default deliverymanagementSlice.reducer;