import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch, Provider } from 'react-redux';
import { createSlice, createAsyncThunk, configureStore } from '@reduxjs/toolkit';
import axios from 'axios';

// ================== REDUX SETUP (INSIDE COMPONENT FILE) ================== //
const API_URL = 'https://health-nutrition-2.onrender.com/api/deliveries';

// 1. Create the thunk
export const getDeliveries = createAsyncThunk(
  'deliveries/getDeliveries',
  async (_, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };

      const response = await axios.get(`${API_URL}/admin/all`, config);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 
        error.message || 
        'Failed to fetch deliveries'
      );
    }
  }
);

// 2. Create slice
const deliveriesSlice = createSlice({
  name: 'deliveries',
  initialState: {
    deliveries: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getDeliveries.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getDeliveries.fulfilled, (state, action) => {
        state.loading = false;
        state.deliveries = action.payload;
      })
      .addCase(getDeliveries.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// 3. Create mini-store just for this component
const store = configureStore({
  reducer: {
    deliveries: deliveriesSlice.reducer,
  },
});

// ================== MAIN COMPONENT ================== //
const AllDeliveries = () => {
  const dispatch = useDispatch();
  const { deliveries, loading, error } = useSelector((state) => state.deliveries);

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const deliveriesPerPage = 5;

  useEffect(() => {
    dispatch(getDeliveries());
  }, [dispatch]);

  // Filter deliveries based on search term
  const filteredDeliveries = deliveries.filter(delivery => (
    delivery.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    delivery.address.street.toLowerCase().includes(searchTerm.toLowerCase()) ||
    delivery.address.area.toLowerCase().includes(searchTerm.toLowerCase()) ||
    delivery.status.toLowerCase().includes(searchTerm.toLowerCase())
  ));

  // Get current deliveries for pagination
  const indexOfLastDelivery = currentPage * deliveriesPerPage;
  const indexOfFirstDelivery = indexOfLastDelivery - deliveriesPerPage;
  const currentDeliveries = filteredDeliveries.slice(indexOfFirstDelivery, indexOfLastDelivery);
  const totalPages = Math.ceil(filteredDeliveries.length / deliveriesPerPage);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Format date for display
  const formatDate = (dateString) => {
    const options = {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Get CSS class for delivery status
  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'missed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
        <p className="font-bold">Error</p>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Today's Deliveries</h1>

      {/* Search and Delivery Count */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
        <div className="w-full md:w-auto">
          <input
            type="text"
            placeholder="Search deliveries..."
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Reset to first page when searching
            }}
          />
        </div>
        <div className="text-gray-600 whitespace-nowrap">
          Showing {indexOfFirstDelivery + 1}-{Math.min(indexOfLastDelivery, filteredDeliveries.length)} of {filteredDeliveries.length} deliveries
        </div>
      </div>

      {/* Deliveries Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Address
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Slot
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Map
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentDeliveries.map((delivery) => (
                <tr key={delivery._id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {delivery.user?.name || 'N/A'}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-sm text-gray-900">
                      {delivery.address.street}, {delivery.address.area}
                    </div>
                    <div className="text-sm text-gray-500">
                      {delivery.address.city}, {delivery.address.pincode}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {formatDate(delivery.deliveryDate)}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {delivery.slot}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(delivery.status)}`}>
                      {delivery.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    {delivery.address.googleMapLink ? (
                      <a 
                        href={delivery.address.googleMapLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800"
                      >
                        View Map
                      </a>
                    ) : (
                      <span className="text-gray-400">No map</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {filteredDeliveries.length > deliveriesPerPage && (
        <div className="flex flex-col sm:flex-row items-center justify-between mt-4 gap-4">
          <div className="text-sm text-gray-700">
            Page {currentPage} of {totalPages}
          </div>
          <nav className="flex gap-1">
            <button
              onClick={() => paginate(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded-md ${currentPage === 1 ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
            >
              Previous
            </button>
            
            {/* Mobile: Show only current page */}
            <div className="sm:hidden">
              <button className="px-3 py-1 bg-blue-600 text-white rounded-md">
                {currentPage}
              </button>
            </div>
            
            {/* Desktop: Show page numbers */}
            <div className="hidden sm:flex gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                <button
                  key={number}
                  onClick={() => paginate(number)}
                  className={`px-3 py-1 rounded-md ${currentPage === number ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                >
                  {number}
                </button>
              ))}
            </div>
            
            <button
              onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded-md ${currentPage === totalPages ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
            >
              Next
            </button>
          </nav>
        </div>
      )}

      {filteredDeliveries.length === 0 && (
        <div className="bg-white rounded-lg shadow p-6 text-center mt-4">
          <p className="text-gray-600">No deliveries found matching your search</p>
        </div>
      )}
    </div>
  );
};

export default () => (
  <Provider store={store}>
    <AllDeliveries />
  </Provider>
);