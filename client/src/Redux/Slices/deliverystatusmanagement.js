import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Base URL for API
const API_URL = 'https://health-nutrition-2.onrender.com/api/deliveries';

// Create delivery verification
export const createDeliveryVerification = createAsyncThunk(
  'verifyDelivery/create',
  async (verificationData, { getState, rejectWithValue }) => {
    try {
      const { user } = getState();
      console.log("token details",user.userInfo.token)
      console.log("Sending verification data:", verificationData);
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.userInfo.token}`,
        },
      };

      // Send the data exactly as received (already formatted in the component)
      const { data } = await axios.post(
        `${API_URL}/deliverable`,
        verificationData,  // Use the data as passed from the component
        config
      );

      return data;
    } catch (error) {
      // Improved error handling
      if (error.response) {
        // The request was made and the server responded with a status code
        return rejectWithValue(
          error.response.data?.message || 
          error.response.data?.error || 
          'Verification creation failed'
        );
      } else if (error.request) {
        // The request was made but no response was received
        return rejectWithValue('No response from server');
      } else {
        // Something happened in setting up the request
        return rejectWithValue(error.message);
      }
    }
  }
);

// Get current user's verification status
export const getMyVerificationStatus = createAsyncThunk(
  'verifyDelivery/getMyStatus',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { user } = getState();
      const config = {
        headers: {
          Authorization: `Bearer ${user.userInfo.token}`,
        },
      };

      const { data } = await axios.get(`${API_URL}/deliverable`, config);
      console.log("full data",data)
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to get verification status'
      );
    }
  }
);

// Get all verifications (admin)
export const getAllVerifications = createAsyncThunk(
  'verifyDelivery/get-all',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { user } = getState();
      const config = {
        headers: {
          Authorization: `Bearer ${user.userInfo.token}`,
        },
      };
      console.log("user token",user.userInfo.token)
      const response = await axios.get(`${API_URL}/get-all`, config);
      console.log("data for get all verifications")
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to get verifications'
      );
    }
  }
);

// Update verification status (admin)
export const updateVerificationStatus = createAsyncThunk(
  'verifyDelivery/updateStatus',
  async ({ verificationId, status,deliveryCharge,area }, { getState, rejectWithValue }) => {
    try {
      const { user } = getState();
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.userInfo.token}`,
        },
      };
        console.log("data d=froomm the fron end",verificationId, status,deliveryCharge,area)
      const { data } = await axios.put(
        `${API_URL}/aadmin-deliverable`,
        { status,verificationId,deliveryCharge, area},
        config
      );
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Status update failed'
      );
    }
  }
);

const initialState = {
  verifications: [],
  myVerification: null,
  loading: false,
  error: null,
  success: false,
};

const verifyDeliverySlice = createSlice({
  name: 'verifyDelivery',
  initialState,
  reducers: {
    resetVerificationState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Verification
      .addCase(createDeliveryVerification.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createDeliveryVerification.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.myVerification = action.payload.data;
      })
      .addCase(createDeliveryVerification.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get My Verification Status
      .addCase(getMyVerificationStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMyVerificationStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.myVerification = action.payload.data || action.payload.status;
      })
      .addCase(getMyVerificationStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get All Verifications
      .addCase(getAllVerifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllVerifications.fulfilled, (state, action) => {
        state.loading = false;
        state.verifications = action.payload.data;
      })
      .addCase(getAllVerifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Verification Status
      .addCase(updateVerificationStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateVerificationStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        // Update the specific verification in the array
        state.verifications = state.verifications.map((verification) =>
          verification._id === action.payload.data._id ? action.payload.data : verification
        );
        // Also update myVerification if it's the same one
        if (state.myVerification && state.myVerification._id === action.payload.data._id) {
          state.myVerification = action.payload.data;
        }
      })
      .addCase(updateVerificationStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetVerificationState } = verifyDeliverySlice.actions;

export default verifyDeliverySlice.reducer;