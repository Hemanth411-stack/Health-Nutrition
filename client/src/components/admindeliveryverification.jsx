import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  getAllVerifications, 
  updateVerificationStatus 
} from '../Redux/Slices/deliverystatusmanagement.js';

export const DeliveryVerificationDashboard = () => {
  console.log("getAllVerifications function:", getAllVerifications);  // Should show the function
  const dispatch = useDispatch();
  const { 
    verifications: deliveries, 
    loading, 
    error 
  } = useSelector(state => state.verifyDelivery);
 
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [verificationStatus, setVerificationStatus] = useState('pending');
  const [deliveryCharge, setDeliveryCharge] = useState(0);

 useEffect(() => {
  console.log("Dispatching getAllVerifications...");  // Check if this logs
  dispatch(getAllVerifications());
}, [dispatch]);
  
  const handleVerify = (delivery) => {
    setSelectedDelivery(delivery);
    setVerificationStatus(delivery.verifydeliverystatus || 'pending');
    setDeliveryCharge(delivery.deliveryCharge || 0);
    console.log("delivery status",delivery)
  };

  const handleSubmitVerification = () => {
    if (!selectedDelivery) return;
    
    dispatch(updateVerificationStatus({
      verificationId: selectedDelivery._id,
      status: verificationStatus,
      deliveryCharge: Number(deliveryCharge)
    })).then(() => {
      setSelectedDelivery(null);
      dispatch(getAllVerifications());
    });
  };

  // Status badge component
  const StatusBadge = ({ status }) => {
    const baseClasses = "px-2 inline-flex text-xs leading-5 font-semib rounded-full";
    
    switch(status) {
      case 'approved':
        return <span className={`${baseClasses} bg-green-100 text-green-800`}>Approved</span>;
      case 'not-deliverable':
        return <span className={`${baseClasses} bg-red-100 text-red-800`}>Not Deliverable</span>;
      default:
        return <span className={`${baseClasses} bg-yellow-100 text-yellow-800`}>Pending</span>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white shadow rounded-lg p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Delivery Verification Dashboard</h1>
          
          {/* Error Message */}
          {error && (
            <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 rounded">
              <div className="flex items-center">
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

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          )}

          {/* Deliveries Table */}
          {!loading && deliveries?.length > 0 && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Verification ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Delivery Charge</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
  {deliveries.map((delivery) => (
    <tr key={delivery._id} className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
        {delivery._id}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {delivery.user.name || 'N/A'} {/* Add this line for the name */}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <StatusBadge status={delivery.verifydeliverystatus} />
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {delivery.deliveryCharge || 0}/-
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <button
          onClick={() => handleVerify(delivery)}
          className="text-indigo-600 hover:text-indigo-900 mr-3"
        >
          Verify
        </button>
      </td>
    </tr>
  ))}
</tbody>
              </table>
            </div>
          )}

          {/* Verification Modal */}
          {selectedDelivery && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Verify Delivery</h2>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Verification ID</label>
                  <input
                    type="text"
                    value={selectedDelivery._id}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-gray-100"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={verificationStatus}
                    onChange={(e) => setVerificationStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="not-deliverable">Not Deliverable</option>
                  </select>
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Charge ($)</label>
                  <input
                    type="number"
                    value={deliveryCharge}
                    onChange={(e) => setDeliveryCharge(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    min="0"
                    step="0.01"
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setSelectedDelivery(null)}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmitVerification}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Submit Verification
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!loading && (!deliveries || deliveries.length === 0) && (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No pending deliveries</h3>
              <p className="mt-1 text-sm text-gray-500">All deliveries have been verified.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeliveryVerificationDashboard;