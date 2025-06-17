// src/components/CancellationMessages.jsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Clock, AlertTriangle, Info } from 'react-feather';
import { fetchCancellationMessages } from '../Redux/Slices/adminmessages.js';

const CancellationMessages = () => {
  const dispatch = useDispatch();
  const { messages } = useSelector((state) => state.adminmessages);
  const { loading, data: cancellationMessages, error } = messages;

  useEffect(() => {
    dispatch(fetchCancellationMessages());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <AlertTriangle className="h-5 w-5 text-red-500" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">
              Error loading cancellation messages: {error}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!cancellationMessages || cancellationMessages.length === 0) {
    return (
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <Info className="h-5 w-5 text-blue-500" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-blue-700">
              No cancellation messages found.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 mb-8">
      <h2 className="text-xl font-semibold text-gray-900">Cancellation Notices</h2>
      <div className="space-y-3">
        {cancellationMessages.map((message) => (
          <div key={message.cancellationId} className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <Clock className="h-5 w-5 text-yellow-500" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  Delivery Cancellation - {new Date(message.date).toLocaleDateString()}
                </h3>
                <div className="mt-1 text-sm text-yellow-700">
                  <p>{message.message}</p>
                </div>
                <div className="mt-2 text-xs text-yellow-600">
                  <p>
                    Issued by {message.issuedBy?.name || 'admin'} on{' '}
                    {new Date(message.issuedAt).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CancellationMessages;