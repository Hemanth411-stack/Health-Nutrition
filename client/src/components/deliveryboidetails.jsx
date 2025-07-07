import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch, Provider } from 'react-redux';
import { createSlice, createAsyncThunk, configureStore } from '@reduxjs/toolkit';
import axios from 'axios';
import { UserCircleIcon, XMarkIcon } from '@heroicons/react/24/solid';

// ================== REDUX SETUP ================== //
const API_URL = 'https://health-nutrition-2.onrender.com/api/deliveries/deliveryboi-details';

export const fetchDeliveryBoys = createAsyncThunk(
  'deliveryBoys/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(API_URL);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch delivery team'
      );
    }
  }
);

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

  useEffect(() => {
    dispatch(fetchDeliveryBoys());
  }, [dispatch]);

  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.style.display = 'none';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 my-6 rounded">
        <div className="flex items-start">
          <div className="flex-shrink-0 pt-0.5">
            <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error loading delivery team</h3>
            <p className="text-sm text-red-700 mt-1">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Image Preview Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
          <div className="relative w-full max-w-4xl">
            <button 
              onClick={() => setSelectedImage(null)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors duration-200 focus:outline-none"
              aria-label="Close image preview"
            >
              <XMarkIcon className="h-10 w-10" />
            </button>
            <div className="bg-white rounded-lg overflow-hidden shadow-xl">
              <img 
                src={selectedImage.url} 
                alt={`Profile of ${selectedImage.name}`}
                className="w-full h-auto max-h-[70vh] object-contain"
              />
              <div className="p-4 bg-gray-50 border-t border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900">{selectedImage.name}</h3>
                <p className="text-gray-600 mt-1">{selectedImage.phone}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Delivery Team Management</h1>
          <p className="mt-1 text-sm text-gray-500">
            {deliveryBoys.length} {deliveryBoys.length === 1 ? 'member' : 'members'} in your delivery team
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {deliveryBoys.map((deliveryBoy) => (
          <div 
            key={deliveryBoy._id} 
            className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200 hover:shadow-md transition-shadow duration-300"
          >
            <div className="p-5">
              <div className="flex items-start space-x-4">
                {deliveryBoy.profileImage ? (
                  <button 
                    onClick={() => setSelectedImage({
                      url: deliveryBoy.profileImage,
                      name: deliveryBoy.name,
                      phone: deliveryBoy.phone
                    })}
                    className="focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-full"
                  >
                    <img 
                      src={deliveryBoy.profileImage} 
                      alt={deliveryBoy.name}
                      className="w-16 h-16 rounded-full object-cover border-2 border-white shadow"
                      onError={handleImageError}
                    />
                  </button>
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center border border-gray-300">
                    <UserCircleIcon className="h-12 w-12 text-gray-400" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate">{deliveryBoy.name}</h3>
                  <p className="text-gray-600 truncate">{deliveryBoy.phone}</p>
                </div>
              </div>

              <div className="mt-4">
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Service Areas
                </h4>
                <div className="flex flex-wrap gap-2">
                  {deliveryBoy.serviceAreas?.length > 0 ? (
                    deliveryBoy.serviceAreas.slice(0, 3).map((area) => (
                      <span 
                        key={area} 
                        className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {area}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-gray-400">No areas assigned</span>
                  )}
                  {deliveryBoy.serviceAreas?.length > 3 && (
                    <span className="text-xs text-gray-500">
                      +{deliveryBoy.serviceAreas.length - 3} more
                    </span>
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

const DeliveryTeamApp = () => (
  <Provider store={store}>
    <DeliveryBoysManagement />
  </Provider>
);

export default DeliveryTeamApp;