import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SubscriptionSummary = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://health-nutrition-2.onrender.com/api/subscriptions/summary');
        setData(response.data.data);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-100 border-l-4 border-red-500 text-red-700">
        <p>Error: {error}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700">
        <p>No subscription data available</p>
      </div>
    );
  }

  const SummaryCards = () => {
    const cards = [
      { title: 'Family Packs', value: data.summary.packs.family, color: 'blue' },
      { title: 'Bachelor Packs', value: data.summary.packs.bachelor, color: 'green' },
      { title: 'Total Subscriptions', value: data.summary.packs.totalSubscriptions, color: 'purple' },
      { title: 'Paused Today', value: data.summary.paused.today, color: 'yellow' },
      { title: 'Eggs Add-on', value: data.summary.addOns.eggs, color: 'orange' },
      { title: 'Ragi Jawa Add-on', value: data.summary.addOns.ragiJawa, color: 'teal' },
      { title: 'Use & Throw Box', value: data.summary.addOns.useAndThrowBox, color: 'pink' },
      { title: 'Total Paused', value: data.summary.paused.total, color: 'red' },
    ];

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {cards.map((card, index) => (
          <div key={index} className={`bg-${card.color}-50 p-4 rounded-lg`}>
            <h3 className={`text-lg font-medium text-${card.color}-800`}>{card.title}</h3>
            <p className={`text-3xl font-bold text-${card.color}-600`}>{card.value}</p>
          </div>
        ))}
      </div>
    );
  };

  const StatusBadge = ({ status }) => {
    if (status.isPausedToday) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          Paused Today
        </span>
      );
    }
    if (status.isPaused) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          Paused ({status.pausedDays} days)
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
        Active
      </span>
    );
  };

  const SubscriptionTable = () => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Eggs</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ragi Jawa</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Use & Throw Box</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.subscriptions.map((sub, index) => {
              const rowColor = sub.status.isPausedToday ? 'bg-yellow-50' : 
                              sub.status.isPaused ? 'bg-orange-50' : 
                              index % 2 === 0 ? 'bg-white' : 'bg-gray-50';
              
              return (
                <tr key={index} className={rowColor}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {sub.user.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {sub.product.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${sub.addOns.eggs ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {sub.addOns.eggs ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${sub.addOns.ragiJawa ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {sub.addOns.ragiJawa ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${sub.addOns.useAndThrowBox ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {sub.addOns.useAndThrowBox ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <StatusBadge status={sub.status} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Subscription Summary</h1>
      
      <SummaryCards />
      
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-700">Subscription Details</h2>
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          {showDetails ? 'Hide Details' : 'Show Details'}
        </button>
      </div>
      
      {showDetails && <SubscriptionTable />}
    </div>
  );
};

export default SubscriptionSummary;