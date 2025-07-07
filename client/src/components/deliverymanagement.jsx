import React, { useEffect } from 'react';
import { FaTruck, FaSignOutAlt, FaUser, FaSignInAlt, FaCalendarAlt, FaMapMarkerAlt, FaCheck, FaTimes, FaExclamation } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { selectDeliveryBoyToken } from '../Redux/Slices/deliveryboi';
import { Link } from 'react-router-dom';
import {
  fetchAllDeliveries,
  updateDeliveryStatus,
  clearDeliveryErrors
} from '../Redux/Slices/deliverymanagement';
import { useState } from 'react';
import { logout } from "../Redux/Slices/deliveryboi";
import { useNavigate } from 'react-router-dom';

const DeliveryManagement = () => {
  const dispatch = useDispatch();
  const {
    deliveries,
    loading,
    error,
    updateLoading,
    updateError
  } = useSelector(state => state.deliveriesmanagement);
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const token = useSelector(selectDeliveryBoyToken);

  useEffect(() => {
    dispatch(fetchAllDeliveries())
      .unwrap()
      .then((data) => {
        console.log('Fetched deliveries:', data);
      })
      .catch((err) => {
        console.error('Error fetching deliveries:', err);
      });
  }, [dispatch, selectedDate]);

  useEffect(() => {
    return () => {
      dispatch(clearDeliveryErrors());
    };
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    setTimeout(() => {
      navigate('/login-deliverboi');
    }, 100);
  };

  const filteredDeliveries = deliveries.filter(delivery => {
    const matchesFilter = filter === 'all' || delivery.status === filter;
    const matchesDate = new Date(delivery.deliveryDate).toISOString().split('T')[0] === selectedDate;
    return matchesFilter && matchesDate;
  });

  const handleStatusUpdate = async (deliveryId, newStatus) => {
    try {
      await dispatch(updateDeliveryStatus({ deliveryId, status: newStatus })).unwrap();
    } catch (error) {
      console.error('Status update failed:', error);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered':
        return <FaCheck className="text-green-500" />;
      case 'missed':
        return <FaTimes className="text-red-500" />;
      default:
        return <FaExclamation className="text-yellow-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Made responsive */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 py-3 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              <FaTruck className="inline mr-2" />
              Delivery Management
            </h1>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
              <div className="flex gap-2 w-full sm:w-auto">
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="border rounded-md px-2 py-1 sm:px-3 sm:py-2 text-sm w-full sm:w-auto"
                />
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="border rounded-md px-2 py-1 sm:px-3 sm:py-2 text-sm w-full sm:w-auto"
                >
                  <option value="all">All</option>
                  <option value="pending">Pending</option>
                  <option value="delivered">Delivered</option>
                  <option value="missed">Missed</option>
                </select>
              </div>
              
              <div className="flex gap-2 w-full sm:w-auto">
                {token && (
                  <button
                    onClick={() => navigate('/deliveryboi-profile')}
                    className="flex items-center space-x-1 text-sm font-medium text-gray-700 hover:text-blue-600 px-2 py-1"
                    title="Profile"
                  >
                    <FaUser className="inline mr-1" />
                    <span className="hidden sm:inline">Profile</span>
                  </button>
                )}

                {token ? (
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-1 text-sm font-medium text-red-600 hover:text-red-800 px-2 py-1"
                  >
                    <FaSignOutAlt className="inline mr-1" />
                    <span className="hidden sm:inline">Logout</span>
                  </button>
                ) : (
                  <Link
                    to="/login-deliverboi"
                    className="flex items-center space-x-1 text-sm font-medium text-blue-600 hover:text-blue-800 px-2 py-1"
                  >
                    <FaSignInAlt className="inline mr-1" />
                    <span className="hidden sm:inline">Sign In</span>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Error Messages */}
      {(error || updateError) && (
        <div className="max-w-7xl mx-auto px-2 sm:px-4 pt-2 lg:px-8">
          <div className="bg-red-50 border-l-4 border-red-500 p-3 sm:p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <FaTimes className="h-5 w-5 text-red-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error || updateError}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-2 sm:px-4 py-4 lg:px-8">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : filteredDeliveries.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No deliveries found for the selected criteria.</p>
          </div>
        ) : (
          <div className="bg-white shadow overflow-hidden rounded-lg">
            <ul className="divide-y divide-gray-200">
              {filteredDeliveries.map((delivery) => (
                <li key={delivery._id} className="px-3 sm:px-6 py-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-1">
                        {getStatusIcon(delivery.status)}
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-base font-medium text-gray-900 truncate">
                          {delivery.userInfo?.fullName || 'Unknown User'}
                        </h3>
                        <p className="text-sm text-gray-500 truncate">
                          {delivery.userInfo?.phone || 'No phone number'}
                        </p>
                        {delivery.userInfo?.googleMapLink && (
                          <a 
                            href={delivery.userInfo.googleMapLink} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:text-blue-800 hover:underline block truncate"
                          >
                            View Map
                          </a>
                        )}
                      </div>
                    </div>
                    <div className="sm:ml-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        delivery.status === 'delivered' ? 'bg-green-100 text-green-800' :
                        delivery.status === 'missed' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {delivery.status}
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 grid grid-cols-1 gap-2 sm:gap-4">
                    <div className="flex items-start">
                      <FaMapMarkerAlt className="mt-1 mr-2 text-gray-400 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-900">
                          {delivery.address?.street}, {delivery.address?.area}
                        </p>
                        <p className="text-sm text-gray-500">
                          {delivery.address?.city}, {delivery.address?.state} - {delivery.address?.pincode}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <FaCalendarAlt className="mt-1 mr-2 text-gray-400 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-900">
                          {new Date(delivery.deliveryDate).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-gray-500">
                          {delivery.slot === 'morning 6Am - 8Am' ? 'Morning (6AM-8AM)' : 'Morning (8AM-10AM)'}
                          {delivery.isFestivalOrSunday && ' (Holiday Delivery)'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 flex flex-wrap justify-end gap-2">
                    {delivery.status !== 'delivered' && (
                      <button
                        onClick={() => handleStatusUpdate(delivery._id, 'delivered')}
                        disabled={updateLoading}
                        className="inline-flex items-center px-2 sm:px-3 py-1 border border-transparent text-xs sm:text-sm leading-4 sm:leading-5 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                      >
                        {updateLoading ? 'Updating...' : 'Delivered'}
                      </button>
                    )}
                    {delivery.status !== 'missed' && (
                      <button
                        onClick={() => handleStatusUpdate(delivery._id, 'missed')}
                        disabled={updateLoading}
                        className="inline-flex items-center px-2 sm:px-3 py-1 border border-transparent text-xs sm:text-sm leading-4 sm:leading-5 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                      >
                        {updateLoading ? 'Updating...' : 'Missed'}
                      </button>
                    )}
                    {delivery.status !== 'pending' && (
                      <button
                        onClick={() => handleStatusUpdate(delivery._id, 'pending')}
                        disabled={updateLoading}
                        className="inline-flex items-center px-2 sm:px-3 py-1 border border-gray-300 text-xs sm:text-sm leading-4 sm:leading-5 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                      >
                        {updateLoading ? 'Updating...' : 'Pending'}
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </main>
    </div>
  );
};

export default DeliveryManagement;