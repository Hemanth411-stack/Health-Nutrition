import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  getAllVerifications, 
  updateVerificationStatus 
} from '../Redux/Slices/deliverystatusmanagement.js';

const hyderabadAreas = [
  "Ameerpet", "Abids", "Adikmet", "Alwal", "Amberpet", "Asif Nagar", "Attapur",
  "Azampura", "Bachupally", "Bahadurpura", "Balanagar", "Banjara Hills", "Barkatpura",
  "Basheerbagh", "Begumpet", "Bharat Nagar", "Boduppal", "Borabanda", "Bowenpally",
  "Chandanagar", "Chilkur", "Chintal", "Dammaiguda", "Dilsukhnagar", "DLF Gachibowli",
  "ECIL", "Erragadda", "Film Nagar", "Gachibowli", "Gaganpahad", "Gajularamaram",
  "Gandhinagar", "Ghatkesar", "Golconda", "Gowlidoddi", "Hafeezpet", "Himayatnagar",
  "Hitech City", "Hyderguda", "Jambagh", "Jubilee Hills", "Jagadgirigutta",
  "Jeedimetla", "Kachiguda", "Kalasiguda", "Karkhana", "Khairatabad", "Kismatpur",
  "Kompally", "Kondapur", "Kothaguda", "Koti", "KPHB Colony", "Kukatpally", "Langar Houz",
  "LB Nagar", "Lal Darwaza", "Langer House", "Madhapur", "Malakpet", "Manikonda",
  "Marredpally", "Masab Tank", "Medchal", "Mehdipatnam", "Mettuguda", "Miyapur",
  "Moosapet", "Moula Ali", "Musheerabad", "Nagole", "Nallakunta", "Nanakramguda",
  "Narayanaguda", "Narsingi", "Nizampet", "Old City", "Panjagutta", "Paradise",
  "Pet Basheerabad", "Pragathi Nagar", "Quthbullapur", "Ramanthapur", "RTC X Roads",
  "Safilguda", "Sainikpuri", "Sanathnagar", "Saroornagar", "Secunderabad", "Shaikpet",
  "Shamshabad", "Shapur Nagar", "Shivam Road", "Somajiguda", "SR Nagar",
  "Sri Nagar Colony", "Tarnaka", "Tolichowki", "Uppal", "Vidyanagar", "West Marredpally",
  "Yapral", "Yousufguda"
];

const ITEMS_PER_PAGE = 10;

export const DeliveryVerificationDashboard = () => {
  const dispatch = useDispatch();
  const {
    verifications: deliveries,
    loading,
    error
  } = useSelector(state => state.verifyDelivery);

  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [verificationStatus, setVerificationStatus] = useState('pending');
  const [deliveryCharge, setDeliveryCharge] = useState(0);
  const [selectedArea, setSelectedArea] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    dispatch(getAllVerifications());
  }, [dispatch]);

  const handleVerify = (delivery) => {
    setSelectedDelivery(delivery);
    setVerificationStatus(delivery.verifydeliverystatus || 'pending');
    setDeliveryCharge(delivery.deliveryCharge || 0);
    setSelectedArea(delivery.address?.area || '');
  };

  const handleSubmitVerification = () => {
    if (!selectedDelivery) return;

    dispatch(updateVerificationStatus({
      verificationId: selectedDelivery._id,
      status: verificationStatus,
      deliveryCharge: Number(deliveryCharge),
      area: selectedArea
    })).then(() => {
      setSelectedDelivery(null);
      dispatch(getAllVerifications());
    });
  };

  const StatusBadge = ({ status }) => {
    const baseClasses = "px-2 inline-flex text-xs leading-5 font-semibold rounded-full";

    switch(status) {
      case 'approved':
        return <span className={`${baseClasses} bg-green-100 text-green-800`}>Approved</span>;
      case 'not-deliverable':
        return <span className={`${baseClasses} bg-red-100 text-red-800`}>Not Deliverable</span>;
      default:
        return <span className={`${baseClasses} bg-yellow-100 text-yellow-800`}>Pending</span>;
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(deliveries?.length / ITEMS_PER_PAGE) || 1;
  const paginatedDeliveries = deliveries?.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  ) || [];

  const handlePageChange = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="p-4 sm:p-6">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">Delivery Verification Dashboard</h1>

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

            {loading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : deliveries?.length > 0 ? (
              <>
                <div className="overflow-x-auto">
                  <div className="sm:hidden space-y-4">
                    {paginatedDeliveries.map((delivery) => (
                      <div key={delivery._id} className="bg-white p-4 rounded-lg shadow border border-gray-200">
                        <div className="mb-2">
                          <span className="font-medium">Address: </span>
                          <span className="text-gray-700">
                            {`${delivery.address.street}, ${delivery.address.area}, ${delivery.address.city}`}
                          </span>
                        </div>
                        <div className="mb-2">
                          <span className="font-medium">User: </span>
                          <span className="text-gray-700">{delivery.user.name || 'N/A'}</span>
                        </div>
                        <div className="mb-2">
                          <span className="font-medium">Status: </span>
                          <StatusBadge status={delivery.verifydeliverystatus} />
                        </div>
                        <div className="mb-2">
                          <span className="font-medium">Charge: </span>
                          <span className="text-gray-700">{delivery.deliveryCharge || 0}/-</span>
                        </div>
                        <button
                          onClick={() => handleVerify(delivery)}
                          className="w-full mt-2 px-3 py-1 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700"
                        >
                          Verify
                        </button>
                      </div>
                    ))}
                  </div>

                  <table className="hidden sm:table min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Charge</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {paginatedDeliveries.map((delivery) => (
                        <tr key={delivery._id} className="hover:bg-gray-50">
                          <td className="px-4 py-4 text-sm text-gray-900">
                            {`${delivery.address.street}, ${delivery.address.area}`}
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-500">
                            {delivery.user.name || 'N/A'}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <StatusBadge status={delivery.verifydeliverystatus} />
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-500">
                            {delivery.deliveryCharge || 0}/-
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => handleVerify(delivery)}
                              className="text-indigo-600 hover:text-indigo-900"
                            >
                              Verify
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-gray-700">
                    Showing <span className="font-medium">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> to{' '}
                    <span className="font-medium">
                      {Math.min(currentPage * ITEMS_PER_PAGE, deliveries.length)}
                    </span>{' '}
                    of <span className="font-medium">{deliveries.length}</span> results
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    <div className="flex space-x-1">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum;
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (currentPage <= 3) {
                          pageNum = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = currentPage - 2 + i;
                        }
                        return (
                          <button
                            key={pageNum}
                            onClick={() => handlePageChange(pageNum)}
                            className={`px-3 py-1 border rounded-md text-sm font-medium ${currentPage === pageNum ? 'bg-indigo-600 text-white border-indigo-600' : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'}`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                      {totalPages > 5 && currentPage < totalPages - 2 && (
                        <span className="px-3 py-1 text-sm text-gray-700">...</span>
                      )}
                      {totalPages > 5 && currentPage < totalPages - 2 && (
                        <button
                          onClick={() => handlePageChange(totalPages)}
                          className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                        >
                          {totalPages}
                        </button>
                      )}
                    </div>
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No pending deliveries</h3>
                <p className="mt-1 text-sm text-gray-500">All deliveries have been verified.</p>
              </div>
            )}
          </div>

          {/* Verification Modal */}
          {selectedDelivery && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-2 sm:mx-0">
                <div className="p-4 sm:p-6">
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">Verify Delivery</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Verification ID</label>
                      <input
                        type="text"
                        value={selectedDelivery._id}
                        readOnly
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-gray-100"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Area</label>
                      <select
                        value={selectedArea}
                        onChange={(e) => setSelectedArea(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      >
                        <option value="">Select Area</option>
                        {hyderabadAreas.map((area) => (
                          <option key={area} value={area}>{area}</option>
                        ))}
                      </select>
                    </div>

                    <div>
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

                    <div>
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
                  </div>

                  <div className="mt-6 flex justify-end space-x-3">
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
                      Submit
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeliveryVerificationDashboard;