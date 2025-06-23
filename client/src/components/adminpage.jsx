import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { 
  fetchAllSubscriptions, 
  updateSubscriptionStatus,
  clearSubscriptionErrors,
} from '../Redux/Slices/adminmanagementsubscription.js';
import {  deleteSubscriptionAndDeliveries } from "../Redux/Slices/adminsubcancel.js"
import { 
  adminCancelAndReschedule,
  resetAdminActionState 
} from '../Redux/Slices/adminmessages.js';

const SubscriptionManagement = () => {
  const dispatch = useDispatch();
  const {
    subscriptions,
    loading,
    error,
    updateLoading,
    updateError,
    deleteLoading,
    deleteError
  } = useSelector(state => state.adminsubscriptions);

  const { adminAction } = useSelector(state => state.adminmessages);
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [saveSuccess, setSaveSuccess] = useState(null);
  const [modifiedSubscriptions, setModifiedSubscriptions] = useState({});
  const [localSubscriptions, setLocalSubscriptions] = useState([]);
  const [showCancelForm, setShowCancelForm] = useState(false);
  const [cancelDate, setCancelDate] = useState('');
  const [cancelMessage, setCancelMessage] = useState('');
  const [deletingId, setDeletingId] = useState(null); // Track which subscription is being deleted

  useEffect(() => {
    if (subscriptions.length > 0) {
      setLocalSubscriptions(subscriptions);
    }
  }, [subscriptions]);

  useEffect(() => {
    dispatch(fetchAllSubscriptions());
  }, [dispatch]);

  useEffect(() => {
    return () => {
      dispatch(resetAdminActionState());
    };
  }, [dispatch]);

  const handlePaymentStatusChange = (id, value) => {
    setModifiedSubscriptions(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        paymentStatus: value
      }
    }));
  };

  const handleStatusChange = (id, value) => {
    setModifiedSubscriptions(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        status: value
      }
    }));
  };

  const handleSaveChanges = async () => {
    const updatePromises = Object.keys(modifiedSubscriptions).map(id => {
      const changes = modifiedSubscriptions[id];
      return dispatch(updateSubscriptionStatus({
        subscriptionId: id,
        ...changes
      })).unwrap();
    });

    try {
      await Promise.all(updatePromises);
      
      const updatedSubscriptions = localSubscriptions.map(sub => {
        if (modifiedSubscriptions[sub._id]) {
          return {
            ...sub,
            ...modifiedSubscriptions[sub._id]
          };
        }
        return sub;
      });

      setLocalSubscriptions(updatedSubscriptions);
      setModifiedSubscriptions({});
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(null), 3000);
    } catch (error) {
      console.error("Failed to save changes:", error);
    }
  };

  const handleDeleteSubscription = async (subscriptionId) => {
    if (window.confirm('Are you sure you want to delete this subscription and all its deliveries?')) {
      try {
        setDeletingId(subscriptionId); // Set the deleting ID
        await dispatch(deleteSubscriptionAndDeliveries(subscriptionId)).unwrap();
        setLocalSubscriptions(prev => prev.filter(sub => sub._id !== subscriptionId));
      } catch (error) {
        console.error('Failed to delete subscription:', error);
      } finally {
        setDeletingId(null); // Reset the deleting ID
      }
    }
  };

  const handleCancelDeliveries = async () => {
    if (!cancelDate || !cancelMessage) {
      alert('Please select a date and provide a cancellation message');
      return;
    }

    try {
      await dispatch(adminCancelAndReschedule({ date: cancelDate, message: cancelMessage })).unwrap();
      setShowCancelForm(false);
      setCancelDate('');
      setCancelMessage('');
    } catch (error) {
      console.error('Failed to cancel deliveries:', error);
    }
  };

  const getDisplayValue = (subscription, field) => {
    return modifiedSubscriptions[subscription._id]?.[field] || subscription[field];
  };

  const StatusBadge = ({ status }) => {
    let bgColor = 'bg-gray-100';
    let textColor = 'text-gray-800';
    
    switch(status) {
      case 'active':
        bgColor = 'bg-green-100';
        textColor = 'text-green-800';
        break;
      case 'pending':
        bgColor = 'bg-yellow-100';
        textColor = 'text-yellow-800';
        break;
      case 'cancelled':
        bgColor = 'bg-red-100';
        textColor = 'text-red-800';
        break;
      case 'completed':
        bgColor = 'bg-blue-100';
        textColor = 'text-blue-800';
        break;
      default:
        break;
    }
    
    return (
      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${bgColor} ${textColor}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const PaymentStatusBadge = ({ status }) => {
    let bgColor = 'bg-gray-100';
    let textColor = 'text-gray-800';
    
    switch(status) {
      case 'paid':
        bgColor = 'bg-green-100';
        textColor = 'text-green-800';
        break;
      case 'pending':
        bgColor = 'bg-yellow-100';
        textColor = 'text-yellow-800';
        break;
      case 'awaiting_approval':
        bgColor = 'bg-purple-100';
        textColor = 'text-purple-800';
        break;
      default:
        break;
    }
    
    return (
      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${bgColor} ${textColor}`}>
        {status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
      </span>
    );
  };

  const totalPages = Math.ceil(localSubscriptions.length / itemsPerPage);
  const paginatedData = localSubscriptions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const hasChanges = Object.keys(modifiedSubscriptions).length > 0;

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex items-center space-x-4">
                <Link to="/" className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
                  Back to Home
                </Link>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Subscription Management</h1>
              </div>
              <p className="text-gray-600 mt-1">Manage all user subscriptions and their statuses</p>
            </div>
            <div className="flex flex-col md:flex-row md:items-center md:space-x-3 mt-4 md:mt-0 space-y-2 md:space-y-0">
              {hasChanges && (
                <div className="flex space-x-2">
                  <button
                    onClick={handleSaveChanges}
                    disabled={updateLoading}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {updateLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Saving...
                      </>
                    ) : 'Save Changes'}
                  </button>
                  <button
                    onClick={() => setModifiedSubscriptions({})}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Cancel
                  </button>
                </div>
              )}
              <button
                onClick={() => setShowCancelForm(!showCancelForm)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                {showCancelForm ? 'Hide Cancel Form' : 'Cancel Deliveries'}
              </button>
            </div>
          </div>
          <div className="border-b border-gray-200 mt-4"></div>
        </div>

        {/* Delivery Cancellation Form */}
        {showCancelForm && (
          <div className="mb-6 bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Cancel Deliveries</h2>
            {adminAction.error && (
              <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 rounded-md">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{adminAction.error}</p>
                  </div>
                </div>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="cancelDate" className="block text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Delivery Date to Cancel
                </label>
                <input
                  type="date"
                  id="cancelDate"
                  value={cancelDate}
                  onChange={(e) => setCancelDate(e.target.value)}
                  className="mt-1 block w-full rounded border-gray-300 py-1.5 px-3 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label htmlFor="cancelMessage" className="block text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Cancellation Message
                </label>
                <input
                  type="text"
                  id="cancelMessage"
                  value={cancelMessage}
                  onChange={(e) => setCancelMessage(e.target.value)}
                  className="mt-1 block w-full rounded border-gray-300 py-1.5 px-3 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="Reason for cancellation"
                />
              </div>
            </div>
            <div className="mt-4 flex justify-end space-x-3">
              <button
                onClick={() => setShowCancelForm(false)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
              <button
                onClick={handleCancelDeliveries}
                disabled={adminAction.loading}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {adminAction.loading ? 'Processing...' : 'Confirm Cancellation'}
              </button>
            </div>
            {adminAction.success && (
              <div className="mt-4 p-4 bg-green-50 border-l-4 border-green-500 rounded-md">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-green-800">
                      Successfully cancelled {adminAction.cancelledCount} deliveries for {new Date(cancelDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Error Messages */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}
        {updateError && (
          <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{updateError}</p>
              </div>
            </div>
          </div>
        )}
        {deleteError && (
          <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{deleteError}</p>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : (
          <>
            {/* Mobile Cards View */}
            <div className="md:hidden space-y-4">
              {paginatedData.map((subscription) => (
                <div key={subscription._id} className="bg-white p-4 rounded-lg shadow">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs font-medium text-gray-500">Subscription ID</p>
                      <p className="text-xs text-gray-900 truncate w-32">{subscription._id}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-medium text-gray-500">User</p>
                      <p className="text-xs text-gray-900">{subscription.user?.name || 'N/A'}</p>
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <p className="text-xs font-medium text-gray-500">Subscription</p>
                    <p className="text-sm font-medium text-gray-900">{subscription.product?.name || 'N/A'}</p>
                    <p className="text-xs text-gray-500">{subscription.totalPrice || '0.00'} / month</p>
                  </div>
                  
                  <div className="mt-3 grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-500">Payment Status</label>
                      <select
                        value={getDisplayValue(subscription, 'paymentStatus')}
                        onChange={(e) => handlePaymentStatusChange(subscription._id, e.target.value)}
                        className="mt-1 block w-full pl-2 pr-8 py-1.5 text-xs border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
                      >
                        <option value="pending">Pending</option>
                        <option value="paid">Paid</option>
                        <option value="awaiting_approval">Awaiting Approval</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500">Status</label>
                      <select
                        value={getDisplayValue(subscription, 'status')}
                        onChange={(e) => handleStatusChange(subscription._id, e.target.value)}
                        className="mt-1 block w-full pl-2 pr-8 py-1.5 text-xs border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
                      >
                        <option value="active">Active</option>
                        <option value="pending">Pending</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="completed">Completed</option>
                      </select>
                    </div>
                  </div>
                  <div className="mt-3 flex justify-end">
                    <button
                      onClick={() => handleDeleteSubscription(subscription._id)}
                      disabled={deletingId === subscription._id}
                      className="text-xs px-3 py-1.5 border border-red-300 rounded-md text-red-600 hover:text-red-900 hover:bg-red-50 disabled:opacity-50 flex items-center"
                    >
                      {deletingId === subscription._id ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Deleting...
                        </>
                      ) : 'Delete'}
                    </button>
                  </div>
                </div>
              ))}

              {/* Mobile Pagination */}
              <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="text-xs text-gray-700">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subscription ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subscription</th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Status</th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {paginatedData.map((subscription) => (
                      <tr key={subscription._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{subscription._id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center">
                              <span className="text-indigo-600 font-medium">
                                {subscription.user?.name?.charAt(0) || 'U'}
                              </span>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{subscription.user?.name || 'N/A'}</div>
                              <div className="text-sm text-gray-500">{subscription.user?.email || ''}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="text-sm font-medium text-gray-900">{subscription.product?.name || 'N/A'}</div>
                          <div className="text-sm text-gray-500">{subscription.totalPrice || '0.00'} / month</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <select
                            value={getDisplayValue(subscription, 'paymentStatus')}
                            onChange={(e) => handlePaymentStatusChange(subscription._id, e.target.value)}
                            className="block w-full pl-3 pr-10 py-2 text-xs border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
                          >
                            <option value="pending">Pending</option>
                            <option value="paid">Paid</option>
                            <option value="awaiting_approval">Awaiting Approval</option>
                          </select>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <select
                            value={getDisplayValue(subscription, 'status')}
                            onChange={(e) => handleStatusChange(subscription._id, e.target.value)}
                            className="block w-full pl-3 pr-10 py-2 text-xs border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
                          >
                            <option value="active">Active</option>
                            <option value="pending">Pending</option>
                            <option value="cancelled">Cancelled</option>
                            <option value="completed">Completed</option>
                          </select>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => handleDeleteSubscription(subscription._id)}
                            disabled={deletingId === subscription._id}
                            className="text-red-600 hover:text-red-900 disabled:opacity-50 flex items-center"
                          >
                            {deletingId === subscription._id ? (
                              <>
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Deleting...
                              </>
                            ) : 'Delete'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="bg-gray-50 px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Next
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
                      <span className="font-medium">{Math.min(currentPage * itemsPerPage, localSubscriptions.length)}</span> of{' '}
                      <span className="font-medium">{localSubscriptions.length}</span> subscriptions
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                      <button
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                      >
                        <span className="sr-only">Previous</span>
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </button>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                            currentPage === page 
                              ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600' 
                              : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                      <button
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                      >
                        <span className="sr-only">Next</span>
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Success Notification */}
        {saveSuccess && (
          <div className="fixed bottom-4 right-4 bg-green-50 border-l-4 border-green-500 rounded-md p-4 shadow-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800">Changes saved successfully!</p>
              </div>
            </div>
          </div>
        )}

        {/* Delete Loading Overlay */}
        {deleteLoading && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <p className="text-lg font-medium">Deleting subscription and deliveries...</p>
              <div className="mt-4 flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubscriptionManagement;