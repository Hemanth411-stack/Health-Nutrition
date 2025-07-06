import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  pauseAndRescheduleDeliveries, 
  fetchUserSubscriptions,
  getPauseInfo,
  resetPauseStatus,
  resetPauseInfoStatus
} from '../Redux/Slices/subscriptionSlice';
import PauseModal from './Pausemodel';
import { format } from 'date-fns';

const SubscriptionActions = ({ subscriptionId, subscriptionStatus }) => {
  const dispatch = useDispatch();
  const [showPauseModal, setShowPauseModal] = useState(false);
  const [showPausedDeliveries, setShowPausedDeliveries] = useState(false);
  
  const { pauseInfo, pauseStatus, pauseInfoStatus } = useSelector(
    (state) => state.subscriptions
  );

  // Extract data from pauseInfo
  const {
    canPauseMore = true,
    pausedDays = 0,
    pausedDeliveries = [],
    remainingPauseDays: serverRemainingDays = 0,
    subscriptionId: pauseSubId
  } = pauseInfo || {};

  // Calculate remaining pause days (using both client and server values)
  const remainingPauseDays = Math.min(serverRemainingDays, 6 - pausedDays);
  const hasUsedPauseDays = pausedDays > 0;
  const canPause = canPauseMore && remainingPauseDays > 0;

  useEffect(() => {
    if (subscriptionId && subscriptionStatus === 'active') {
      dispatch(getPauseInfo(subscriptionId));
    }
    
    return () => {
      dispatch(resetPauseInfoStatus());
    };
  }, [subscriptionId, subscriptionStatus, dispatch]);

  const handlePauseConfirm = async ({ startDate, endDate }) => {
    try {
      await dispatch(
        pauseAndRescheduleDeliveries({ 
          subscriptionId, 
          startDate, 
          endDate 
        })
      ).unwrap();
      
      // Refresh data
      dispatch(fetchUserSubscriptions());
      dispatch(getPauseInfo(subscriptionId));
      
    } catch (error) {
      console.error('Pause failed:', error);
    } finally {
      setShowPauseModal(false);
    }
  };

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch {
      return dateString;
    }
  };

  if (subscriptionStatus !== 'active') {
    return (
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
        <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
          Subscription Actions
        </h4>
        <p className="text-sm text-gray-500">No actions available for inactive subscriptions</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
      <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
        Subscription Actions
      </h4>
      <div className="space-y-3">
        <button
          onClick={() => setShowPauseModal(true)}
          disabled={!canPause}
          className={`w-full text-left p-2 rounded-md flex items-center justify-between ${
            !canPause
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
          }`}
        >
          <span>Pause Deliveries</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </button>

        <div className="text-xs text-gray-500 space-y-1">
          <p>
  {hasUsedPauseDays ? (
    <>
      <span className="font-medium">{pausedDays} day(s)</span> paused this month •{' '}
      <span className="font-medium">{remainingPauseDays} day(s)</span> remaining
    </>
  ) : (
    <>
      <span className="font-medium">{remainingPauseDays} pause days</span> available this month
    </>
  )}  
</p>



          {hasUsedPauseDays && (
            <button
              onClick={() => setShowPausedDeliveries(!showPausedDeliveries)}
              className="text-blue-500 hover:text-blue-700 flex items-center"
            >
              {showPausedDeliveries ? 'Hide paused deliveries' : 'View paused deliveries'}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-4 w-4 ml-1 transition-transform ${showPausedDeliveries ? 'rotate-180' : ''}`}
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          )}
        </div>

        {showPausedDeliveries && pausedDeliveries.length > 0 && (
          <div className="border-t pt-2 mt-2">
            <h5 className="text-xs font-medium text-gray-500 mb-1">Paused Deliveries:</h5>
            <ul className="space-y-1 text-xs">
              {pausedDeliveries.map((delivery, index) => (
                <li key={delivery._id} className="flex justify-between">
                  <span className="text-gray-600">
                    {formatDate(delivery.originalDate)}
                  </span>
                  <span className="text-gray-500">
                    → Rescheduled to {formatDate(delivery.rescheduledDate)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {!canPauseMore && (
          <p className="text-xs text-red-500">
            You've reached the maximum pause limit for this subscription.
          </p>
        )}
      </div>

      <PauseModal
        isOpen={showPauseModal}
        onClose={() => setShowPauseModal(false)}
        onConfirm={handlePauseConfirm}
        remainingPauseDays={remainingPauseDays}
        isLoading={pauseStatus === 'loading'}
        currentPausedDays={pausedDays}
        pausedDeliveries={pausedDeliveries}
      />
    </div>
  );
};

export default SubscriptionActions;