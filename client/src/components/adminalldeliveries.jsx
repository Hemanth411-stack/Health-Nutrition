import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch, Provider } from 'react-redux';
import { createSlice, createAsyncThunk, configureStore } from '@reduxjs/toolkit';
import axios from 'axios';

// ================== CONSTANTS & UTILITIES ================== //
const API_BASE_URL = 'https://health-nutrition-2.onrender.com/api/deliveries';

const formatDeliveryDate = (dateString) => {
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

const getStatusBadgeClass = (status) => {
  const statusClasses = {
    delivered: 'bg-green-100 text-green-800',
    missed: 'bg-red-100 text-red-800',
    default: 'bg-yellow-100 text-yellow-800'
  };
  return statusClasses[status] || statusClasses.default;
};

// ================== REDUX STORE CONFIGURATION ================== //
export const fetchDeliveries = createAsyncThunk(
  'deliveries/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const config = {
        headers: { 'Content-Type': 'application/json' }
      };
      const response = await axios.get(`${API_BASE_URL}/admin/all`, config);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 
        error.message || 
        'Failed to fetch delivery data'
      );
    }
  }
);

const deliveriesSlice = createSlice({
  name: 'deliveries',
  initialState: {
    data: [],
    isLoading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDeliveries.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDeliveries.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(fetchDeliveries.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  }
});

const store = configureStore({
  reducer: {
    deliveries: deliveriesSlice.reducer
  }
});

// ================== COMPONENTS ================== //
const Loader = () => (
  <div className="flex justify-center items-center h-64">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

const ErrorAlert = ({ message }) => (
  <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
    <p className="font-bold">Error</p>
    <p>{message}</p>
  </div>
);

const PaginationControls = ({ currentPage, totalPages, onPageChange }) => (
  <div className="flex flex-col sm:flex-row items-center justify-between mt-4 gap-4">
    <div className="text-sm text-gray-700">
      Page {currentPage} of {totalPages}
    </div>
    <nav className="flex gap-1">
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className={`px-3 py-1 rounded-md ${currentPage === 1 ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
      >
        Previous
      </button>
      
      <div className="sm:hidden">
        <button className="px-3 py-1 bg-blue-600 text-white rounded-md">
          {currentPage}
        </button>
      </div>
      
      <div className="hidden sm:flex gap-1">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
          <button
            key={pageNumber}
            onClick={() => onPageChange(pageNumber)}
            className={`px-3 py-1 rounded-md ${currentPage === pageNumber ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
          >
            {pageNumber}
          </button>
        ))}
      </div>
      
      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className={`px-3 py-1 rounded-md ${currentPage === totalPages ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
      >
        Next
      </button>
    </nav>
  </div>
);

// ================== MAIN COMPONENT ================== //
const DeliveryManagement = () => {
  const dispatch = useDispatch();
  const { data: deliveries, isLoading, error } = useSelector(state => state.deliveries);

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const DELIVERIES_PER_PAGE = 5;

  useEffect(() => {
    dispatch(fetchDeliveries());
  }, [dispatch]);

  const filterDeliveries = (deliveries) => {
    if (!searchTerm) return deliveries;
    
    const term = searchTerm.toLowerCase();
    return deliveries.filter(delivery => (
      delivery.user?.name?.toLowerCase().includes(term) ||
      delivery.address.street.toLowerCase().includes(term) ||
      delivery.address.area.toLowerCase().includes(term) ||
      delivery.status.toLowerCase().includes(term)
    ));
  };

  const filteredDeliveries = filterDeliveries(deliveries);
  const totalPages = Math.ceil(filteredDeliveries.length / DELIVERIES_PER_PAGE);
  
  const paginatedDeliveries = filteredDeliveries.slice(
    (currentPage - 1) * DELIVERIES_PER_PAGE,
    currentPage * DELIVERIES_PER_PAGE
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  if (isLoading) return <Loader />;
  if (error) return <ErrorAlert message={error} />;

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Delivery Management Dashboard</h1>
        {/* <div className="mt-4">
          <input
            type="text"
            placeholder="Search deliveries..."
            className="px-4 py-2 border rounded-md w-full max-w-md"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div> */}
      </header>

      <section className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {['Customer', 'Address', 'Date', 'Slot', 'Status', 'Map'].map((header) => (
                  <th 
                    key={header}
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedDeliveries.map((delivery) => (
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
                      {formatDeliveryDate(delivery.deliveryDate)}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {delivery.slot}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(delivery.status)}`}>
                      {delivery.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    {delivery.address.googleMapLink ? (
                      <a 
                        href={delivery.address.googleMapLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 transition-colors"
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
      </section>

      {filteredDeliveries.length > DELIVERIES_PER_PAGE && (
        <PaginationControls 
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}

      {filteredDeliveries.length === 0 && (
        <div className="bg-white rounded-lg shadow p-6 text-center mt-4">
          <p className="text-gray-600">No deliveries match your search criteria</p>
        </div>
      )}
    </div>
  );
};

export default () => (
  <Provider store={store}>
    <DeliveryManagement />
  </Provider>
);