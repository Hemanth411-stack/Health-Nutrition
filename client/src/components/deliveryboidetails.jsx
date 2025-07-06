import React, { useEffect } from 'react';
import { useSelector, useDispatch, Provider } from 'react-redux';
import { createSlice, createAsyncThunk, configureStore } from '@reduxjs/toolkit';
import axios from 'axios';
import { UserCircleIcon } from '@heroicons/react/24/solid'; // Using Heroicons for default avatar

// ================== REDUX SETUP ================== //
const API_URL = 'https://health-nutrition-2.onrender.com/api/deliveries/deliveryboi-details';

// 1. Create the thunk for fetching delivery boys
export const fetchDeliveryBoys = createAsyncThunk(
  'deliveryBoys/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 
        'Failed to fetch delivery boys'
      );
    }
  }
);

// 2. Create slice for delivery boys
const deliveryBoysSlice = createSlice({
  name: 'deliveryBoys',
  initialState: {
    list: [],
    loading: false,
    error: null,
    selectedAreas: []
  },
  reducers: {
    setSelectedAreas: (state, action) => {
      state.selectedAreas = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDeliveryBoys.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDeliveryBoys.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchDeliveryBoys.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

const { setSelectedAreas } = deliveryBoysSlice.actions;
const store = configureStore({ reducer: { deliveryBoys: deliveryBoysSlice.reducer } });

// ================== COMPONENT ================== //
const DeliveryBoysManagement = () => {
  const dispatch = useDispatch();
  const { list: deliveryBoys, loading, error } = useSelector((state) => state.deliveryBoys);

  useEffect(() => { dispatch(fetchDeliveryBoys()); }, [dispatch]);

  // Loading and error states with better UI
  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  if (error) return (
    <div className="bg-red-50 border-l-4 border-red-500 p-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Delivery Team</h1>
        {/* <div className="relative w-64">
          <input
            type="text"
            placeholder="Search delivery boys..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div> */}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {deliveryBoys.map((boy) => (
          <div key={boy._id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <div className="p-5">
              <div className="flex items-center space-x-4">
                {boy.profileImage ? (
                  <img 
                    src={boy.profileImage} 
                    alt={boy.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-white shadow"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                    <UserCircleIcon className="h-12 w-12 text-gray-400" />
                  </div>
                )}
                <div>
                  <h3 className="font-semibold text-lg">{boy.name}</h3>
                  <p className="text-gray-600">{boy.phone}</p>
                </div>
              </div>

              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-500 mb-1">Service Areas</h4>
                <div className="flex flex-wrap gap-2">
                  {boy.serviceAreas?.length > 0 ? (
                    boy.serviceAreas.map((area) => (
                      <span 
                        key={area} 
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {area}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-gray-400">No areas assigned</span>
                  )}
                </div>
              </div>

              {/* <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between">
                <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                  View Details
                </button>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  boy.status === 'active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {boy.status || 'inactive'}
                </span>
              </div> */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default () => (
  <Provider store={store}>
    <DeliveryBoysManagement />
  </Provider>
);