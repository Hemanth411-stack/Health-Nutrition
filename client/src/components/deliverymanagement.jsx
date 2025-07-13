import React, { useEffect } from 'react';
import { FaTruck,FaPhone, FaSignOutAlt, FaUser, FaSignInAlt, FaCalendarAlt, FaMapMarkerAlt, FaCheck, FaTimes, FaExclamation } from 'react-icons/fa';
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
  console.log("deliuveru bon deliveries",deliveries)
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
          <div className="bg-white shadow-lg rounded-xl overflow-hidden">
  <ul className="divide-y divide-gray-100">
    {filteredDeliveries.map((delivery) => (
      <li key={delivery._id} className="px-4 py-5 sm:px-6 hover:bg-gray-50 transition-colors duration-150">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Left Section - User Info */}
          <div className="flex-1 flex items-start space-x-4 min-w-0">
            <div className="flex-shrink-0 mt-1">
              {getStatusIcon(delivery.status)}
            </div>
            
            <div className="min-w-0 space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
                <h3 className="text-lg font-semibold text-gray-900 truncate">
                  {delivery.userInfo?.fullName || 'Unknown User'}
                </h3>
                <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${
                  delivery.status === 'delivered' ? 'bg-green-100 text-green-800' :
                  delivery.status === 'missed' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {delivery.status.charAt(0).toUpperCase() + delivery.status.slice(1)}
                </span>
              </div>
              
              <p className="text-sm text-gray-600 flex items-center">
  <FaPhone className="mr-1.5 flex-shrink-0" size={12} />
  {delivery.userInfo?.phone ? (
    <a 
      href={`tel:${delivery.userInfo.phone}`}
      className="hover:text-blue-600 hover:underline transition-colors"
    >
      {delivery.userInfo.phone}
    </a>
  ) : (
    'No phone number'
  )}
</p>
              
              <p className="text-sm font-medium text-indigo-600">
                {delivery.productName || 'No product name'}
              </p>
              
              {/* Add-ons Section */}
              <div className="mt-2 space-y-1.5">
                <div className="flex justify-between items-center py-1 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-700">Eggs</span>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                    delivery.addOnPrices?.eggs > 0 ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-500'
                  }`}>
                    {delivery.addOnPrices?.eggs > 0 ? 'Included' : 'Not included'}
                  </span>
                </div>
                
                <div className="flex justify-between items-center py-1 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-700">Ragi Jawa</span>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                    delivery.addOnPrices?.ragiJawa > 0 ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-500'
                  }`}>
                    {delivery.addOnPrices?.ragiJawa > 0 ? 'Included' : 'Not included'}
                  </span>
                </div>
                
                <div className="flex justify-between items-center py-1">
                  <span className="text-sm font-medium text-gray-700">Use & Throw Box</span>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                    delivery.addOnPrices?.useAndThrowBox > 0 ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-500'
                  }`}>
                    {delivery.addOnPrices?.useAndThrowBox > 0 ? 'Included' : 'Not included'}
                  </span>
                </div>
              </div>
              
              {delivery.userInfo?.googleMapLink && (
                <a 
                  href={delivery.userInfo.googleMapLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center mt-2 text-sm text-blue-600 hover:text-blue-800 hover:underline"
                >
                  <FaMapMarkerAlt className="mr-1.5" size={12} />
                  View on Map
                </a>
              )}
            </div>
          </div>
          
          {/* Right Section - Delivery Info */}
          <div className="sm:w-64 space-y-3">
            <div className="bg-gray-50 p-3 rounded-lg">
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                Delivery Address
              </h4>
              <div className="space-y-1">
                <p className="text-sm text-gray-900 line-clamp-1">
                  {delivery.address?.street}
                </p>
                <p className="text-sm text-gray-600">
                  {delivery.address?.area}, {delivery.address?.city}
                </p>
                <p className="text-sm text-gray-500">
                  {delivery.address?.state} - {delivery.address?.pincode}
                </p>
              </div>
            </div>
            
            <div className="bg-gray-50 p-3 rounded-lg">
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                Delivery Schedule
              </h4>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-900">
                  {new Date(delivery.deliveryDate).toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric'
                  })}
                </p>
                <p className="text-sm text-gray-600">
                  {delivery.slot === 'morning 6Am - 8Am' ? '6:00-8:00 AM' : '8:00-10:00 AM'}
                </p>
                {delivery.isFestivalOrSunday && (
                  <p className="text-xs text-yellow-700 font-medium">
                    Holiday Delivery
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="mt-4 flex flex-wrap justify-end gap-2">
          {delivery.status !== 'delivered' && (
            <button
              onClick={() => handleStatusUpdate(delivery._id, 'delivered')}
              disabled={updateLoading}
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
            >
              {updateLoading ? 'Processing...' : 'Mark Delivered'}
            </button>
          )}
          {delivery.status !== 'missed' && (
            <button
              onClick={() => handleStatusUpdate(delivery._id, 'missed')}
              disabled={updateLoading}
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
            >
              {updateLoading ? 'Processing...' : 'Mark Missed'}
            </button>
          )}
          {delivery.status !== 'pending' && (
            <button
              onClick={() => handleStatusUpdate(delivery._id, 'pending')}
              disabled={updateLoading}
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
            >
              {updateLoading ? 'Processing...' : 'Set Pending'}
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