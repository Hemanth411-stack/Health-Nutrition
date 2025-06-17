import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Header from "./Header";
import {
  fetchUserSubscriptions,
  fetchUserSubscriptionStats,
  selectSubscriptions,
  selectSubscriptionStats,
  selectSubscriptionStatus,
  selectSubscriptionStatsStatus,
  selectSubscriptionError,
} from "../Redux/Slices/subscriptionSlice";
import { Link } from "react-router-dom";
import Footer from "./Footer";

const SubscriptionDashboard = () => {
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(true);
  const [expandedCard, setExpandedCard] = useState(null);
  const dispatch = useDispatch();

  // Select data from Redux store
  const subscriptions = useSelector(selectSubscriptions);
  const stats = useSelector(selectSubscriptionStats);
  const status = useSelector(selectSubscriptionStatus);
  const statsStatus = useSelector(selectSubscriptionStatsStatus);
  const error = useSelector(selectSubscriptionError);

  // Calculate total subscriptions count
  const totalSubscriptions = subscriptions?.length || 0;

  useEffect(() => {
    // Fetch user subscriptions and stats when component mounts
    dispatch(fetchUserSubscriptions());
    dispatch(fetchUserSubscriptionStats());
  }, [dispatch]);

  const formatDate = (dateString) => {
    if (!dateString) return "Not available";
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Calculate days left for a subscription
  const calculateDaysLeft = (startDate, endDate) => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    console.log("dates",start,end)
    const diffTime = end - start;
    console.log("time details",Math.ceil(diffTime / (1000 * 60 * 60 * 24)))
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) ;
  };

  const getStatusStyles = (status) => {
    if (!status || typeof status !== 'string') {
      return { bg: 'bg-gray-100', text: 'text-gray-800', dot: 'bg-gray-400' };
    }

    switch (status.toLowerCase()) {
      case 'active':
        return { bg: 'bg-green-50', text: 'text-green-800', dot: 'bg-green-500' };
      case 'pending':
        return { bg: 'bg-yellow-50', text: 'text-yellow-800', dot: 'bg-yellow-500' };
      case 'cancelled':
        return { bg: 'bg-red-50', text: 'text-red-800', dot: 'bg-red-500' };
      default:
        return { bg: 'bg-gray-50', text: 'text-gray-800', dot: 'bg-gray-500' };
    }
  };

  const toggleExpandCard = (id) => {
    setExpandedCard(expandedCard === id ? null : id);
  };

  // Loading state
  if (status === 'loading' || statsStatus === 'loading') {
    return (
      <div className="font-sans min-h-screen bg-gray-50 p-6">
        <Header />
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        </div>
      </div>
    );
  }

  // Error state
  if (status === 'failed' || statsStatus === 'failed') {
    return (
      <div className="font-sans min-h-screen bg-gray-50 p-6">
        <Header />
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <strong>Error: </strong> {error || 'Failed to load subscription data'}
        </div>
      </div>
    );
  }

  // No subscription found
  if (totalSubscriptions === 0) {
    return (
      <div className="font-sans min-h-screen bg-gray-50 p-6 ">
        <Header />
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden p-8 text-center">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            No Active Subscriptions
          </h2>
          <p className="text-gray-600 mb-6">
            You don't have any active subscriptions yet.
          </p>
          <Link to='/'>
            <button className="bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded-lg font-medium transition duration-300 shadow-sm hover:shadow-md">
              Browse Plans
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
    <div className="font-sans min-h-screen bg-gray-50 p-4 md:p-8">
      <Header />

      {/* Dashboard Header */}
      <div className="pt-16 p-4 md:p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="py-12">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">My Subscriptions</h1>
          <p className="text-gray-600">Manage your active subscriptions and deliveries</p>
        </div>
        
 {subscriptions.map((subscription) => (
  subscription?.status === "active" && (
    <div key={subscription._id} className="flex gap-3 w-full md:w-auto">
      <Link to="/deliveries">
        <button className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 py-2 px-4 rounded-lg font-medium transition duration-300 shadow-sm hover:shadow-md flex items-center gap-2 w-full justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
            <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1v-1h.05a2.5 2.5 0 014.9 0H19a1 1 0 001-1v-2a1 1 0 00-.293-.707l-3-3A1 1 0 0016 7h-1V5a1 1 0 00-1-1H3z" />
          </svg>
          View My Deliveries
        </button>
      </Link>
    </div>
  )
))}



      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Active Subscriptions</p>
              <h3 className="text-2xl font-bold text-gray-800">{totalSubscriptions}</h3>
            </div>
            <div className="p-3 rounded-full bg-green-50 text-green-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Spent</p>
              <h3 className="text-2xl font-bold text-gray-800">
                ₹{subscriptions.reduce((sum, sub) => sum + (sub.totalPrice || 0), 0).toLocaleString()}
              </h3>
            </div>
            <div className="p-3 rounded-full bg-blue-50 text-blue-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        
      </div>

      {/* Welcome Banner */}
      {showWelcomeMessage && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl shadow-sm p-6 mb-6 border border-blue-100">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-xl font-semibold text-gray-800 mb-2">
                Welcome to Your Subscription Dashboard
              </h1>
              <p className="text-gray-600">
                You have <span className="font-medium text-blue-600">{totalSubscriptions}</span>  {totalSubscriptions === 1 ? 'subscription' : 'subscriptions'}.
                Manage your services, view upcoming deliveries, and track payments all in one place.
              </p>
            </div>
            <button
              onClick={() => setShowWelcomeMessage(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Subscription Cards */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">Your Subscriptions</h2>

        {subscriptions.map((subscription) => {
          const statusStyles = getStatusStyles(subscription.status);
          const daysLeft = calculateDaysLeft(subscription.startDate, subscription.endDate);
          const isExpanded = expandedCard === subscription._id;

          return (
            <div key={subscription._id} className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 transition-all duration-200 hover:shadow-md">
              {/* Card Header */}
              <div
                className={`p-5 cursor-pointer ${statusStyles.bg}`}
                onClick={() => toggleExpandCard(subscription._id)}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${statusStyles.bg.replace('50', '100')}`}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">
                        {subscription.product?.name || 'Subscription'} #{subscriptions.indexOf(subscription) + 1}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {formatDate(subscription.startDate)} - {formatDate(subscription.endDate)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusStyles.text} ${statusStyles.bg.replace('50', '100')}`}>
                      {subscription.status?.charAt(0).toUpperCase() + subscription.status?.slice(1)}
                    </span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`h-5 w-5 text-gray-400 transition-transform ${isExpanded ? 'transform rotate-180' : ''}`}
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Collapsible Content */}
              {isExpanded && (
                <div className="p-5 border-t border-gray-100">
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Subscription Details */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">Subscription Details</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">ID</span>
                          <span className="font-mono text-sm text-gray-800">
                            {subscription._id}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Plan</span>
                          <span className="text-gray-800">
                            {subscription.plan || 'Standard'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Billing Cycle</span>
                          <span className="text-gray-800">
                            {subscription.billingCycle || 'Monthly'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Payment Information */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">Payment Information</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Amount</span>
                          <span className="text-gray-800 font-medium">
                            ₹{subscription.totalPrice?.toLocaleString() || '0'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Method</span>
                          <span className="text-gray-800">
                            {subscription.paymentMethod === "COD" ? "Cash on Delivery" : subscription.paymentMethod}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Status</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            subscription.paymentStatus === 'paid'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {subscription.paymentStatus?.charAt(0).toUpperCase() + subscription.paymentStatus?.slice(1)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Date Information */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">Dates</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Start Date</span>
                          <span className="text-gray-800">
                            {formatDate(subscription.startDate)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">End Date</span>
                          <span className="text-gray-800">
                            {formatDate(subscription.endDate)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Expires in</span>
                          <span className={`font-medium ${
                            daysLeft <= 7 ? 'text-red-600' : 'text-green-600'
                          }`}>
                            {daysLeft > 0 ? daysLeft : 0}
                          </span>
                        </div>
                      </div>
                    </div>

                   
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
    </div>
    <Footer/>
  </>
  );
};

export default SubscriptionDashboard;