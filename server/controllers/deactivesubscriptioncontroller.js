import Delivery from "../models/Delivery";
import Subscription from "../models/Subscription";
import cron from 'node-cron';


export const updateSubscriptionStatus = async () => {
  try {
    const now = new Date();
    
    // Step 1: Update expired subscriptions
    const expiredSubscriptions = await Subscription.updateExpiredSubscriptions();
    
    // Step 2: Remove deliveries for expired subscriptions that are after end date
    const subscriptionIds = expiredSubscriptions.map(sub => sub._id);
    
    await Delivery.deleteMany({
      subscription: { $in: subscriptionIds },
      deliveryDate: { $gt: now } // Future deliveries for expired subscriptions
    });
    
    // Step 3: Also check for any deliveries for completed subscriptions that might have been missed
    const completedSubscriptions = await Subscription.find({
      status: 'completed',
      endDate: { $lt: now }
    });
    
    const completedIds = completedSubscriptions.map(sub => sub._id);
    
    await Delivery.deleteMany({
      subscription: { $in: completedIds },
      deliveryDate: { $gt: now }
    });
    
    return {
      updatedSubscriptions: expiredSubscriptions.length,
      deletedDeliveries: await Delivery.countDocuments({
        subscription: { $in: [...subscriptionIds, ...completedIds] },
        deliveryDate: { $gt: now }
      })
    };
    
  } catch (error) {
    console.error('Error in subscription status update:', error);
    throw error;
  }
};


// Run daily at midnight
cron.schedule('0 0 * * *', async () => {
  console.log('Running subscription status update job...');
  try {
    const result = await updateSubscriptionStatus();
    console.log('Subscription status update completed:', result);
  } catch (error) {
    console.error('Error in subscription status update job:', error);
  }
});

console.log('Cron jobs initialized');