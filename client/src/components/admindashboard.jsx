import React, { useState } from 'react';
import DeliveryVerificationDashboard from './admindeliveryverification.jsx';
import SubscriptionManagement from './adminpage.jsx';
import SubscriptionSummary from './SubscriptionSummary'; // Import the new component

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('deliveries');

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      {/* Main Content */}
      <div className="flex flex-col">
        {/* Top Navigation */}
        <header className="bg-white shadow-sm sticky top-0 z-10">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center">
              <h1 className="text-lg sm:text-xl font-semibold text-gray-800">Admin Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              {/* You can add user/profile icons here if needed */}
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 bg-gray-50">
          {/* Replace the stats cards with SubscriptionSummary */}
          <div className="mb-6">
            <SubscriptionSummary />
          </div>

          {/* Tab Content */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="border-b border-gray-200">
              <nav className="flex overflow-x-auto">
                <button
                  onClick={() => setActiveTab('deliveries')}
                  className={`whitespace-nowrap py-3 px-4 sm:py-4 sm:px-6 border-b-2 font-medium text-xs sm:text-sm ${activeTab === 'deliveries' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                >
                  Delivery Verifications
                </button>
                <button
                  onClick={() => setActiveTab('subscriptions')}
                  className={`whitespace-nowrap py-3 px-4 sm:py-4 sm:px-6 border-b-2 font-medium text-xs sm:text-sm ${activeTab === 'subscriptions' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                >
                  Subscription Management
                </button>
              </nav>
            </div>
            <div className="p-4 sm:p-6">
              {activeTab === 'deliveries' && <DeliveryVerificationDashboard />}
              {activeTab === 'subscriptions' && <SubscriptionManagement />}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;