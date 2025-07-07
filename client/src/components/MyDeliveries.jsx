import React, { useEffect, useState } from 'react';
import {
  Clock,
  Check,
  X,
  ChevronDown,
  Package,
  Calendar,
  Filter
} from 'react-feather';
import { useDispatch, useSelector } from 'react-redux';
import { getUserDeliveries } from '../Redux/Slices/delivery.js';
import { selectSubscriptions } from "../Redux/Slices/subscriptionSlice.js";
import Header from './Header.jsx';
import Footer from "./Footer.jsx"
import CancellationMessages from './CancellationMessages.jsx';

const MyDeliveries = () => {
  const dispatch = useDispatch();
  const { deliveries: reduxDeliveries = [], loading, error } = useSelector(
    (state) => state.delivery
  );
  const subscriptions = useSelector(selectSubscriptions);

  // Local state for UI
  const [filter, setFilter] = useState('all');
  const [expandedDelivery, setExpandedDelivery] = useState(null);

  useEffect(() => {
    dispatch(getUserDeliveries());
  }, [dispatch]);

  // Function to check if a date is today
  const isToday = (dateString) => {
    try {
      const deliveryDate = new Date(dateString);
      const today = new Date();

      return (
        deliveryDate.getDate() === today.getDate() &&
        deliveryDate.getMonth() === today.getMonth() &&
        deliveryDate.getFullYear() === today.getFullYear()
      );
    } catch (e) {
      return false;
    }
  };

  // Function to get subscription details
  const getSubscriptionDetails = (isFestivalOrSunday) => {
    if (!subscriptions || subscriptions.length === 0) {
      return {
        name: isFestivalOrSunday ? 'Festival Special Box' : 'Fruit Box',
        price: isFestivalOrSunday ? '$59.99' : '$49.99',
        items: isFestivalOrSunday ? 15 : 12
      };
    }

    // Find the active subscription
    const activeSubscription = subscriptions.find(sub => sub.isActive);

    if (!activeSubscription) {
      return {
        name: isFestivalOrSunday ? 'Festival Special Box' : 'Fruit Box',
        price: isFestivalOrSunday ? '$59.99' : '$49.99',
        items: isFestivalOrSunday ? 15 : 12
      };
    }

    // Return details based on the subscription
    return {
      name: activeSubscription.name || 'Custom Box',
      price: `₹${activeSubscription.price}`,
      items: activeSubscription.contents
        ? Object.values(activeSubscription.contents).reduce((sum, quantity) => sum + quantity, 0)
        : isFestivalOrSunday ? 15 : 12
    };
  };

  // Safely transform Redux deliveries to match the expected format and filter for today's date
  const todaysDeliveries = Array.isArray(reduxDeliveries)
    ? reduxDeliveries
        .filter(delivery => isToday(delivery.deliveryDate))
        .map(delivery => {
          const subscriptionDetails = getSubscriptionDetails(delivery.isFestivalOrSunday);
          return {
            id: delivery._id || Math.random().toString(36).substr(2, 9),
            name: subscriptionDetails.name,
            date: delivery.deliveryDate || new Date().toISOString(),
            status: delivery.status || 'pending',
            items: subscriptionDetails.items,
            price: subscriptionDetails.price,
            deliveryWindow: delivery.slot === 'morning 6Am - 8Am' ? '6:00 AM - 8:00 AM' : '8:00 AM - 10:00 AM',
            address: delivery.address || {
              street: '',
              area: '',
              city: '',
              state: '',
              pincode: ''
            }
          };
        })
    : [];

  // Filter deliveries based on status
  const filteredDeliveries = filter === 'all'
    ? todaysDeliveries
    : todaysDeliveries.filter(delivery => delivery.status === filter);

  // Format date
  const formatDate = (dateString) => {
    try {
      return 'Today';
    } catch (e) {
      return 'Today';
    }
  };

  // Get status color and icon
  const getStatusStyles = (status) => {
    const baseStyles = "inline-flex items-center px-3 py-1 rounded-full text-sm font-medium";

    switch(status) {
      case 'pending':
        return {
          className: `${baseStyles} bg-amber-100 text-amber-800`,
          icon: <Clock className="h-4 w-4 mr-1.5" />
        };
      case 'delivered':
        return {
          className: `${baseStyles} bg-emerald-100 text-emerald-800`,
          icon: <Check className="h-4 w-4 mr-1.5" />
        };
      case 'missed':
        return {
          className: `${baseStyles} bg-rose-100 text-rose-800`,
          icon: <X className="h-4 w-4 mr-1.5" />
        };
      default:
        return {
          className: `${baseStyles} bg-gray-100 text-gray-800`,
          icon: null
        };
    }
  };

  const toggleDeliveryExpansion = (id) => {
    setExpandedDelivery(expandedDelivery === id ? null : id);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <>
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <div className="bg-red-50 border-l-4 border-red-500 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <X className="h-5 w-5 text-red-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">
                  Error loading deliveries: {error}
                </p>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="container mx-auto px-4 pt-28 pb-8 max-w-6xl"> {/* Increased top padding */}
  <Header />

        {/* Dashboard Header */}
        <div className="pt-16 p-4 md:p-8">
          <CancellationMessages />

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Today's Deliveries</h1>
              <p className="text-gray-500 mt-1">Your scheduled deliveries for today</p>
            </div>

            {/* Filter dropdown */}
            {/* <div className="relative w-full sm:w-auto">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Filter className="h-5 w-5 text-gray-400" />
              </div>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="appearance-none bg-white border border-gray-200 rounded-lg pl-10 pr-10 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full sm:w-48"
              >
                <option value="all">All Deliveries</option>
                <option value="pending">Pending</option>
                <option value="delivered">Delivered</option>
                <option value="missed">Missed</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </div>
            </div> */}
          </div>

          {/* Delivery cards */}
          <div className="space-y-4">
            {filteredDeliveries.length > 0 ? (
              filteredDeliveries.map((delivery) => {
                const statusStyles = getStatusStyles(delivery.status);
                const isExpanded = expandedDelivery === delivery.id;

                return (
                  <div
                    key={delivery.id}
                    className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-200 hover:shadow-md"
                  >
                    <div
                      className="p-5 cursor-pointer"
                      onClick={() => toggleDeliveryExpansion(delivery.id)}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <div className="bg-blue-50 p-3 rounded-lg">
                            <Package className="h-6 w-6 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{delivery.name}</h3>
                            <div className="flex items-center text-gray-500 text-sm mt-1">
                              <Calendar className="h-4 w-4 mr-1.5" />
                              <span>{formatDate(delivery.date)} • {delivery.deliveryWindow}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={statusStyles.className}>
                            {statusStyles.icon}
                            {delivery.status.charAt(0).toUpperCase() + delivery.status.slice(1)}
                          </span>
                          <ChevronDown
                            className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Expanded details */}
                    {isExpanded && (
                      <div className="px-5 pb-5 pt-0 border-t border-gray-100 bg-gray-50">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          {/* <div className="space-y-2">
                            <h4 className="font-medium text-gray-500">Items</h4>
                            <p className="text-gray-900">{delivery.items} items</p>
                          </div> */}
                          {/* <div className="space-y-2">
                            <h4 className="font-medium text-gray-500">Price</h4>
                            <p className="text-gray-900">{delivery.price}</p>
                          </div> */}
                          <div className="space-y-2">
                            <h4 className="font-medium text-gray-500">Delivery Address</h4>
                            <p className="text-gray-900">
                              {delivery.address.street}<br />
                              {delivery.address.area}, {delivery.address.city}<br />
                              {delivery.address.state}, {delivery.address.pincode}
                            </p>
                          </div>
                        </div>
                        {/* {delivery.status === 'pending' && (
                          <div className="mt-4 pt-4 border-t border-gray-200">
                            <button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                              Track Delivery
                            </button>
                          </div>
                        )} */}
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
                <div className="mx-auto h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center">
                  <Package className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">No deliveries scheduled for today</h3>
                <p className="mt-2 text-gray-500 max-w-md mx-auto">
                  You don't have any deliveries scheduled for today. Check back tomorrow!
                </p>
                
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer/>
    </>
  );
};

export default MyDeliveries;