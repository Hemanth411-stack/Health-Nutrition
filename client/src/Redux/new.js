// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import axios from 'axios';

// // Base URL for API
// const API_URL = 'http://localhost:5000/api/deliveries'; // Adjust based on your API endpoint

// // Async Thunks
// export const scheduleDelivery = createAsyncThunk(
//   'deliveries/scheduleDelivery',
//   async (deliveryData, { getState, rejectWithValue }) => {
//     try {
//       const state = getState();
//       const token = state.user?.userInfo?.token;
//       const config = {
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`,
//         },
//       };

//       const response = await axios.post(API_URL, deliveryData, config);
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(
//         error.response?.data?.message || error.message || 'Failed to schedule delivery'
//       );
//     }
//   }
// );

// export const getUserDeliveries = createAsyncThunk(
//   'deliveries/getUserDeliveries',
//   async (_, { getState, rejectWithValue }) => {
//     try {
//       const state = getState();
//       const token = state.user?.userInfo?.token;
//       console.log("token",token)
//       const config = {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         'Content-Type': 'application/json',

//         },
//       };

//       const response = await axios.get(`${API_URL}/me`, config);
//       console.log("response",response.data)
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(
//         error.response?.data?.message || error.message || 'Failed to fetch deliveries'
//       );
//     }
//   }
// );

// export const getAllDeliveries = createAsyncThunk(
//   'deliveries/getAllDeliveries',
//   async (_, { getState, rejectWithValue }) => {
//     try {
//       const state = getState();
//       const token = state.user?.userInfo?.token;
//       const config = {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       };

//       const response = await axios.get(`${API_URL}/all`, config);
//       return response.data;
//       cons
//     } catch (error) {
//       return rejectWithValue(
//         error.response?.data?.message || error.message || 'Failed to fetch all deliveries'
//       );
//     }
//   }
// );

// export const updateDeliveryStatus = createAsyncThunk(
//   'deliveries/updateDeliveryStatus',
//   async ({ deliveryId, status }, { getState, rejectWithValue }) => {
//     try {
//       const { user } = getState().auth;
//       const config = {
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${user.token}`,
//         },
//       };

//       const response = await axios.put(
//         `${API_URL}/${deliveryId}`,
//         { status },
//         config
//       );
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(
//         error.response?.data?.message || error.message || 'Failed to update delivery status'
//       );
//     }
//   }
// );

// // Initial State
// const initialState = {
//   deliveries: [],
//   allDeliveries: [],
//   loading: false,
//   error: null,
//   success: false,
// };

// // Slice
// const deliverySlice = createSlice({
//   name: 'delivery',
//   initialState,
//   reducers: {
//     resetDeliveryState: (state) => {
//       state.loading = false;
//       state.error = null;
//       state.success = false;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       // Schedule Delivery
//       .addCase(scheduleDelivery.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//         state.success = false;
//       })
//       .addCase(scheduleDelivery.fulfilled, (state, action) => {
//         state.loading = false;
//         state.success = true;
//         state.deliveries.unshift(action.payload);
//       })
//       .addCase(scheduleDelivery.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })

//       // Get User Deliveries
//       .addCase(getUserDeliveries.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(getUserDeliveries.fulfilled, (state, action) => {
//         state.loading = false;
//         state.deliveries = action.payload;
//         console.log("user deliveries",state.deliveries)
//       })
//       .addCase(getUserDeliveries.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })

//       // Get All Deliveries (Admin)
//       .addCase(getAllDeliveries.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(getAllDeliveries.fulfilled, (state, action) => {
//         state.loading = false;
//         state.allDeliveries = action.payload;
//       })
//       .addCase(getAllDeliveries.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })

//       // Update Delivery Status
//       .addCase(updateDeliveryStatus.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//         state.success = false;
//       })
//       .addCase(updateDeliveryStatus.fulfilled, (state, action) => {
//         state.loading = false;
//         state.success = true;
//         // Update in deliveries array
//         const index = state.deliveries.findIndex(
//           (d) => d._id === action.payload._id
//         );
//         if (index !== -1) {
//           state.deliveries[index] = action.payload;
//         }
//         // Update in allDeliveries array (for admin)
//         const allIndex = state.allDeliveries.findIndex(
//           (d) => d._id === action.payload._id
//         );
//         if (allIndex !== -1) {
//           state.allDeliveries[allIndex] = action.payload;
//         }
//       })
//       .addCase(updateDeliveryStatus.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       });
//   },
// });

// export const { resetDeliveryState } = deliverySlice.actions;
// export default deliverySlice.reducer;