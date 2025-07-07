import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch, Provider } from 'react-redux';
import { createSlice, createAsyncThunk, configureStore } from '@reduxjs/toolkit';
import axios from 'axios';
import { UserCircleIcon, XMarkIcon } from '@heroicons/react/24/solid'; // Using Heroicons for default avatar and close button

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
  const [selectedImage, setSelectedImage] = useState(null);

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
      {/* Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-3xl w-full">
            <button 
              onClick={() => setSelectedImage(null)}
              className="absolute -top-10 right-0 text-white hover:text-gray-300 focus:outline-none"
            >
              <XMarkIcon className="h-8 w-8" />
            </button>
            <div className="bg-white rounded-lg overflow-hidden">
              <img 
                src={selectedImage.url} 
                alt={selectedImage.name}
                className="w-full h-auto max-h-[80vh] object-contain"
              />
              <div className="p-4 bg-white">
                <h3 className="text-xl font-semibold">{selectedImage.name}</h3>
                <p className="text-gray-600">{selectedImage.phone}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Delivery Team</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {deliveryBoys.map((boy) => (
          <div key={boy._id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <div className="p-5">
              <div className="flex items-center space-x-4">
                {boy.profileImage ? (
                  <button 
                    onClick={() => setSelectedImage({
                      url: boy.profileImage,
                      name: boy.name,
                      phone: boy.phone
                    })}
                    className="focus:outline-none"
                  >
                    <img 
                      src={boy.profileImage} 
                      alt={boy.name}
                      className="w-16 h-16 rounded-full object-cover border-2 border-white shadow cursor-pointer hover:opacity-90 transition-opacity"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.style.display = 'none';
                      }}
                    />
                  </button>
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