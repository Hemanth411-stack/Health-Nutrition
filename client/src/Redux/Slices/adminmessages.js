// deliveryManagementSlice.js
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

// Thunk for cancelling deliveries and rescheduling
export const adminCancelAndReschedule = createAsyncThunk(
  'deliveryManagement/cancelAndReschedule',
  async ({ date, message }, { getState,rejectWithValue }) => {
    try {
      const state = getState();
      const token = state.user?.userInfo?.token;
      const response = await axios.post(
        'http://localhost:5000/api/deliveries/admin-leave',
        { date, message },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Thunk for fetching cancellation messages
export const fetchCancellationMessages = createAsyncThunk(
  'deliveryManagement/fetchCancellationMessages',
  async (_, { getState,rejectWithValue }) => {
    try {
      const state = getState();
      const token = state.user?.userInfo?.token;
      const response = await axios.get('http://localhost:5000/api/deliveries/admin-msg', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  adminAction: {
    loading: false,
    success: false,
    error: null,
    cancellationRecord: null,
    cancelledCount: 0,
    affectedSubscriptions: 0,
  },
  messages: {
    loading: false,
    data: [],
    error: null,
    count: 0,
  },
};

const adminmessageslice = createSlice({
  name: 'adminmessages',
  initialState,
  reducers: {
    resetAdminActionState: (state) => {
      state.adminAction = initialState.adminAction;
    },
    clearCancellationMessages: (state) => {
      state.messages = initialState.messages;
    },
  },
  extraReducers: (builder) => {
    builder
      // Admin Cancel and Reschedule
      .addCase(adminCancelAndReschedule.pending, (state) => {
        state.adminAction.loading = true;
        state.adminAction.success = false;
        state.adminAction.error = null;
      })
      .addCase(adminCancelAndReschedule.fulfilled, (state, action) => {
        state.adminAction.loading = false;
        state.adminAction.success = true;
        state.adminAction.cancellationRecord = action.payload.cancellationRecordId;
        state.adminAction.cancelledCount = action.payload.cancelledDeliveries;
        state.adminAction.affectedSubscriptions = action.payload.affectedSubscriptions;
      })
      .addCase(adminCancelAndReschedule.rejected, (state, action) => {
        state.adminAction.loading = false;
        state.adminAction.error = action.payload?.message || action.error.message;
      })
      
      // Fetch Cancellation Messages
      .addCase(fetchCancellationMessages.pending, (state) => {
        state.messages.loading = true;
        state.messages.error = null;
      })
      .addCase(fetchCancellationMessages.fulfilled, (state, action) => {
        state.messages.loading = false;
        state.messages.data = action.payload.messages;
        state.messages.count = action.payload.count;
      })
      .addCase(fetchCancellationMessages.rejected, (state, action) => {
        state.messages.loading = false;
        state.messages.error = action.payload?.message || action.error.message;
      });
  },
});

export const { resetAdminActionState, clearCancellationMessages } = adminmessageslice.actions;
export default adminmessageslice.reducer;