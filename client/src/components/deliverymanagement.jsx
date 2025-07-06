import React, { useEffect } from 'react';
import { FaTruck,FaSignOutAlt ,FaUser, FaSignInAlt ,FaCalendarAlt, FaMapMarkerAlt, FaCheck, FaTimes, FaExclamation } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import {selectDeliveryBoyToken} from '../Redux/Slices/deliveryboi'
import { Link } from 'react-router-dom';
import {
  fetchAllDeliveries,
  updateDeliveryStatus,
  clearDeliveryErrors
} from '../Redux/Slices/deliverymanagement';
import { useState } from 'react';
import {logout} from "../Redux/Slices/deliveryboi"
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
  console.log("deliveries with google maplink",deliveries)
  const [filter, setFilter] = useState('all');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const token = useSelector(selectDeliveryBoyToken);

  // Fetch deliveries on component mount and when selectedDate changes
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
  // Clear errors when component unmounts
  useEffect(() => {
    return () => {
      dispatch(clearDeliveryErrors());
    };
  }, [dispatch]);
const handleLogout = () => {
  dispatch(logout()); // clears user from Redux
  setTimeout(() => {
    navigate('/login-deliverboi');
  }, 100); // slight delay gives time for unmount/cleanup
};

  const filteredDeliveries = deliveries.filter(delivery => {
    const matchesFilter = filter === 'all' || delivery.status === filter;
    const matchesDate = new Date(delivery.deliveryDate).toISOString().split('T')[0] === selectedDate;
    return matchesFilter && matchesDate;
  });

  const handleStatusUpdate = async (deliveryId, newStatus) => {
  try {
    await dispatch(updateDeliveryStatus({ deliveryId, status: newStatus })).unwrap();
    // Optional: Add a success notification
  } catch (error) {
    console.error('Status update failed:', error);
    // Error is already handled by Redux
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
      {/* Header */}
    
<header className="bg-white shadow-sm">
  <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
    <h1 className="text-2xl font-bold text-gray-900">
      <FaTruck className="inline mr-2" />
      Delivery Management
    </h1>
    <div className="flex items-center space-x-4">
      <input
        type="date"
        value={selectedDate}
        onChange={(e) => setSelectedDate(e.target.value)}
        className="border rounded-md px-3 py-2 text-sm"
      />
      <select
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="border rounded-md px-3 py-2 text-sm"
      >
        <option value="all">All Deliveries</option>
        <option value="pending">Pending</option>
        <option value="delivered">Delivered</option>
        <option value="missed">Missed</option>
      </select>

      {/* Profile Button - Only shown when logged in */}
      {token && (
        <button
          onClick={() => navigate('/deliveryboi-profile')}
          className="flex items-center space-x-1 text-sm font-medium text-gray-700 hover:text-blue-600"
          title="Profile"
        >
          <FaUser className="inline mr-1" />
          Profile
        </button>
      )}

      {/* Conditional rendering based on authentication */}
      {token ? (
        <button
          onClick={handleLogout}
          className="flex items-center space-x-1 text-sm font-medium text-red-600 hover:text-red-800"
        >
          <FaSignOutAlt className="inline mr-1" />
          Logout
        </button>
      ) : (
        <Link
          to="/login-deliverboi"
          className="flex items-center space-x-1 text-sm font-medium text-blue-600 hover:text-blue-800"
        >
          <FaSignInAlt className="inline mr-1" />
          Sign In
        </Link>
      )}
    </div>
  </div>
</header>

      {/* Error Messages */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 pt-4 sm:px-6 lg:px-8">
          <div className="bg-red-50 border-l-4 border-red-500 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <FaTimes className="h-5 w-5 text-red-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        </div>
      )}
      {updateError && (
        <div className="max-w-7xl mx-auto px-4 pt-4 sm:px-6 lg:px-8">
          <div className="bg-red-50 border-l-4 border-red-500 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <FaTimes className="h-5 w-5 text-red-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{updateError}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : filteredDeliveries.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No deliveries found for the selected criteria.</p>
          </div>
        ) : (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <ul className="divide-y divide-gray-200">
              {filteredDeliveries.map((delivery) => (
                <li key={delivery._id} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        {getStatusIcon(delivery.status)}
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          {delivery.userInfo?.fullName || 'Unknown User'}
                        </h3>
                        <h3 className="text-lg font-medium text-gray-900">
  {delivery.userInfo?.googleMapLink ? (
    <a 
      href={delivery.userInfo.googleMapLink} 
      target="_blank" 
      rel="noopener noreferrer"
      className="text-blue-600 hover:text-blue-800 hover:underline"
    >
      Customer Address Map
    </a>
  ) : (
    'Address Map Not Available'
  )}
</h3>
                        <p className="text-sm text-gray-500">
                          {delivery.userInfo?.phone || 'No phone number'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        delivery.status === 'delivered' ? 'bg-green-100 text-green-800' :
                        delivery.status === 'missed' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {delivery.status}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start">
                      <FaMapMarkerAlt className="mt-1 mr-2 text-gray-400" />
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
                      <FaCalendarAlt className="mt-1 mr-2 text-gray-400" />
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

                  <div className="mt-4 flex justify-end space-x-3">
                    {delivery.status !== 'delivered' && (
                      <button
                        onClick={() => handleStatusUpdate(delivery._id, 'delivered')}
                        disabled={updateLoading}
                        className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                      >
                        {updateLoading ? 'Updating...' : 'Mark as Delivered'}
                      </button>
                    )}
                    {delivery.status !== 'missed' && (
                      <button
                        onClick={() => handleStatusUpdate(delivery._id, 'missed')}
                        disabled={updateLoading}
                        className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                      >
                        {updateLoading ? 'Updating...' : 'Mark as Missed'}
                      </button>
                    )}
                    {delivery.status !== 'pending' && (
                      <button
                        onClick={() => handleStatusUpdate(delivery._id, 'pending')}
                        disabled={updateLoading}
                        className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm leading-5 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                      >
                        {updateLoading ? 'Updating...' : 'Reset to Pending'}
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