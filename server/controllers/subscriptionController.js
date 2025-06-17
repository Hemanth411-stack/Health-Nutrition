import Subscription from '../models/Subscription.js';
import Product from '../models/Product.js';
import Delivery from '../models/Delivery.js';
import UserInfo from "../models/Userinformation.js"
// 🔹 Get subscription count and all subscriptions for current user
export const getUserSubscriptionStats = async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch all subscriptions of the user
    const subscriptions = await Subscription.find({ user: userId }).populate('product');

    res.status(200).json({
      success: true,
      count: subscriptions.length,
      subscriptions
    });
  } catch (error) {
    console.error('Failed to get user subscriptions:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch subscription data',
      error: error.message
    });
  }
};

// 🔹 Create a new subscription with enhanced error handling
// export const createSubscription = async (req, res) => {
//   try {
//     const { 
//       productId, 
//       addOnPrices = {},  // Will contain prices for selected add-ons
//       paymentMethod, 
//       paymentProof,
//       startDate 
//     } = req.body;
//     const userId = req.user.id;

//     // Validate required fields
//     if (!productId || !paymentMethod) {
//       return res.status(400).json({
//         message: 'Product ID and payment method are required',
//         fields: { productId, paymentMethod }
//       });
//     }

//     // Validate payment method
//     if (!['COD', 'PhonePe'].includes(paymentMethod)) {
//       return res.status(400).json({
//         message: 'Invalid payment method',
//         validMethods: ['COD', 'PhonePe']
//       });
//     }

//     // Validate payment proof for PhonePe
//     if (paymentMethod === 'PhonePe' && !paymentProof?.utr) {
//       return res.status(400).json({
//         message: 'UTR number is required for PhonePe payments'
//       });
//     }

//     // Find product
//     const product = await Product.findById(productId);
//     if (!product) {
//       return res.status(404).json({
//         message: 'Product not found',
//         productId
//       });
//     }

//     // Calculate total add-on price
//     let totalAddOnPrice = 0;
//     const finalAddOnPrices = {
//       useAndThrowBox: addOnPrices.useAndThrowBox || 0,
//       eggs: addOnPrices.eggs || 0,
//       ragiJawa: addOnPrices.ragiJawa || 0
//     };

//     totalAddOnPrice = finalAddOnPrices.useAndThrowBox + finalAddOnPrices.eggs + finalAddOnPrices.ragiJawa;

//     // Set subscription dates
//     const endDate = new Date(startDate);
//     endDate.setMonth(endDate.getMonth() + 1);

//     // Create subscription data
//     const subscriptionData = {
//       user: userId,
//       product: productId,
//       startDate,
//       endDate,
//       addOnPrices: finalAddOnPrices,
//       totalPrice: product.price + totalAddOnPrice,
//       paymentMethod,
//       paymentStatus: paymentMethod === 'COD' ? 'pending' : 'awaiting_approval',
//     };

//     // Add payment proof if PhonePe
//     if (paymentMethod === 'PhonePe') {
//       subscriptionData.paymentProof = { utr: paymentProof.utr };
//     }

//     // Create and save subscription
//     const savedSubscription = await Subscription.create(subscriptionData);

//     // Schedule deliveries (fail silently if this fails)
//     try {
//       await scheduleAllDeliveriesForSubscription(savedSubscription._id);
//     } catch (deliveryError) {
//       console.error('Delivery scheduling failed:', deliveryError);
//     }

//     res.status(201).json({
//       success: true,
//       message: 'Subscription created successfully',
//       subscription: savedSubscription
//     });

//   } catch (error) {
//     console.error('Subscription creation error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to create subscription',
//       error: error.message,
//       stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
//     });
//   }
// };

// 🔹 Enhanced schedule deliveries function
const scheduleAllDeliveriesForSubscription = async (subscriptionId) => {
  try {
    const subscription = await Subscription.findById(subscriptionId)
      .populate('product')
      .populate('user');
    
    if (!subscription) {
      throw new Error('Subscription not found');
    }

    if (subscription.status === 'cancelled') {
      return; // Don't schedule for cancelled subscriptions
    }

    const startDate = new Date(subscription.startDate);
    const endDate = new Date(subscription.endDate);
    const userInfo = await UserInfo.findOne({ user: subscription.user._id });

    const userAddress = {
      street: userInfo.address.street,
      area: userInfo.address.area,
      city: userInfo.address.city,
      state: userInfo.address.state,
      pincode: userInfo.address.pincode
    };

    for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
      // Skip Sundays (day 0 in JavaScript Date)
      if (date.getDay() === 0) {
        continue;
      }

      const dateString = date.toISOString().split('T')[0];
      const existingDelivery = await Delivery.findOne({
        subscription: subscription._id,
        deliveryDate: dateString
      });

      if (!existingDelivery) {
        await Delivery.create({
          user: subscription.user._id,
          address: userAddress,
          slot: 'morning', // Default slot
          deliveryDate: dateString,
          subscription: subscription._id,
          product: subscription.product._id,
          isFestivalOrSunday: false, // Since we're skipping Sundays, this will always be false
          status: 'pending'
        });
      }
    }
  } catch (error) {
    console.error('Error in scheduleAllDeliveriesForSubscription:', error);
    throw error;
  }
};

// 🔹 Get current user's subscriptions
export const getUserSubscriptions = async (req, res) => {
  try {
    const subs = await Subscription.find({ user: req.user.id }).populate('product');
    res.json(subs);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch subscriptions', error: error.message });
  }
};
// admin use



// 🔹 Cancel subscription (with delivery cancellation)
export const cancelSubscription = async (req, res) => {
  try {
    const subscription = await Subscription.findById(req.params.id);

    if (!subscription) return res.status(404).json({ message: 'Subscription not found' });
    if (subscription.user.toString() !== req.user.id) return res.status(403).json({ message: 'Unauthorized' });

    subscription.status = 'cancelled';
    await subscription.save();

    // Cancel all future deliveries
    await Delivery.updateMany(
      {
        subscription: subscription._id,
        deliveryDate: { $gte: new Date() },
        status: { $ne: 'delivered' }
      },
      { $set: { status: 'cancelled' } }
    );

    res.json({ message: 'Subscription cancelled successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to cancel subscription', error: error.message });
  }
};
export const getallSubscriptions = async (req, res) => {
  try {
    const subs = await Subscription.find()
      .populate('product') // populate product details
      .populate('user', 'name'); // populate only the user's name

    res.json(subs);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch subscriptions', error: error.message });
  }
};
export const createSubscription = async (req, res) => {
  try {
    const { 
      productId, 
      addOnPrices = {}, 
      paymentMethod, 
      paymentProof,
      startDate 
    } = req.body;
    const userId = req.user.id;

    // Validate required fields
    if (!productId || !paymentMethod) {
      return res.status(400).json({
        message: 'Product ID and payment method are required',
        fields: { productId, paymentMethod }
      });
    }

    // Validate payment method
    if (!['COD', 'PhonePe'].includes(paymentMethod)) {
      return res.status(400).json({
        message: 'Invalid payment method',
        validMethods: ['COD', 'PhonePe']
      });
    }

    // Validate payment proof for PhonePe
    if (paymentMethod === 'PhonePe' && !paymentProof?.utr) {
      return res.status(400).json({
        message: 'UTR number is required for PhonePe payments'
      });
    }

    // Find product
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        message: 'Product not found',
        productId
      });
    }

    // Calculate total add-on price
    const finalAddOnPrices = {
      useAndThrowBox: addOnPrices.useAndThrowBox || 0,
      eggs: addOnPrices.eggs || 0,
      ragiJawa: addOnPrices.ragiJawa || 0
    };
    const totalAddOnPrice = Object.values(finalAddOnPrices).reduce((sum, price) => sum + price, 0);

    // Set subscription dates
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 1);

    // Create subscription (status defaults to 'pending')
    const subscriptionData = {
      user: userId,
      product: productId,
      startDate,
      endDate,
      addOnPrices: finalAddOnPrices,
      totalPrice: product.price + totalAddOnPrice,
      paymentMethod,
      paymentStatus: paymentMethod === 'COD' ? 'pending' : 'awaiting_approval',
    };

    if (paymentMethod === 'PhonePe') {
      subscriptionData.paymentProof = { utr: paymentProof.utr };
    }

    const savedSubscription = await Subscription.create(subscriptionData);

    res.status(201).json({
      success: true,
      message: 'Subscription created successfully. Deliveries will be scheduled when activated by admin.',
      subscription: savedSubscription
    });

  } catch (error) {
    console.error('Subscription creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create subscription',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

export const updateSubscriptionStatus = async (req, res) => {
  try {
    
    const { status, paymentStatus, subscriptionId } = req.body;

    // Validate input
    if (!subscriptionId) {
      return res.status(400).json({ message: 'Subscription ID is required' });
    }

    const subscription = await Subscription.findById(subscriptionId);
    if (!subscription) {
      return res.status(404).json({ message: 'Subscription not found' });
    }

    // Prepare updates
    const updates = {};
    if (status && ['active', 'pending', 'cancelled', 'completed'].includes(status)) {
      updates.status = status;
    }
    if (paymentStatus) {
      updates.paymentStatus = paymentStatus;
    }

    // Update subscription
    const updatedSubscription = await Subscription.findByIdAndUpdate(
      subscriptionId,
      updates,
      { new: true }
    );

    // Schedule deliveries ONLY if status changed to 'active'
    if (status === 'active' && subscription.status !== 'active') {
      try {
        await scheduleAllDeliveriesForSubscription(subscriptionId);
      } catch (deliveryError) {
        console.error('Delivery scheduling failed:', deliveryError);
        // Rollback status if delivery creation fails
        await Subscription.findByIdAndUpdate(
          subscriptionId,
          { status: subscription.status }, // Revert to original status
          { new: true }
        );
        return res.status(500).json({
          success: false,
          message: 'Status update failed: Could not schedule deliveries',
          error: deliveryError.message
        });
      }
    }

    res.status(200).json({
      success: true,
      message: 'Subscription updated successfully',
      subscription: updatedSubscription
    });

  } catch (error) {
    console.error('Subscription update error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update subscription',
      error: error.message
    });
  }
};

export const deleteSubscriptionAndDeliveries = async (req, res) => {
  try {
    const { subscriptionId } = req.body;
    /* 1️⃣ Fetch subscription */
    const subscription = await Subscription.findById(subscriptionId);
    if (!subscription) {
      return res.status(404).json({ success: false, message: 'Subscription not found' });
    }

    /* 3️⃣ Delete all deliveries for this subscription */
    const deliveryDeleteResult = await Delivery.deleteMany({ subscription: subscriptionId });

    /* 4️⃣ Delete the subscription itself */
    await subscription.deleteOne();

    /* 5️⃣ Respond */
    return res.status(200).json({
      success: true,
      deletedDeliveries: deliveryDeleteResult.deletedCount,
      message: `Subscription and ${deliveryDeleteResult.deletedCount} delivery(ies) deleted.`,
    });
  } catch (err) {
    console.error('Error deleting subscription:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete subscription',
      error: err.message,
    });
  }
};


// export const scheduleAllDeliveriesForSubscription = async (subscriptionId) => {
//   const subscription = await Subscription.findById(subscriptionId)
//     .populate('product')
//     .populate('user');

//   if (!subscription) {
//     throw new Error('Subscription not found');
//   }

//   if (subscription.status !== 'active') {
//     throw new Error('Deliveries can only be scheduled for active subscriptions');
//   }

//   const userInfo = await UserInfo.findOne({ user: subscription.user._id });
//   if (!userInfo?.address) {
//     throw new Error('User address not found');
//   }

//   const { address } = userInfo;
//   const startDate = new Date(subscription.startDate);
//   const endDate = new Date(subscription.endDate);

//   // Batch delivery creation for efficiency
//   const deliveryPromises = [];
//   const deliveryDates = [];

//   // Generate all dates in the subscription period
//   for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
//     deliveryDates.push(new Date(date));
//   }

//   // Check existing deliveries in one query
//   const existingDeliveries = await Delivery.find({
//     subscription: subscriptionId,
//     deliveryDate: { $in: deliveryDates }
//   }).select('deliveryDate');

//   const existingDates = existingDeliveries.map(d => d.deliveryDate.toISOString().split('T')[0]);

//   // Prepare new deliveries
//   for (const date of deliveryDates) {
//     const dateString = date.toISOString().split('T')[0];
//     if (!existingDates.includes(dateString)) {
//       deliveryPromises.push(
//         Delivery.create({
//           user: subscription.user._id,
//           address: {
//             street: address.street,
//             area: address.area,
//             city: address.city,
//             state: address.state,
//             pincode: address.pincode
//           },
//           slot: 'morning',
//           deliveryDate: dateString,
//           subscription: subscriptionId,
//           product: subscription.product._id,
//           isFestivalOrSunday: date.getDay() === 0,
//           status: 'pending'
//         })
//       );
//     }
//   }

//   await Promise.all(deliveryPromises);
// };



// export const updateSubscriptionStatus = async (req, res) => {

//   try {
//     const { subscriptionId, paymentStatus, status } = req.body;

//     // Validate required input
//     if (!subscriptionId) {
//       return res.status(400).json({ message: 'Subscription ID is required' });
//     }

//     const updateFields = {};
//     if (paymentStatus) updateFields.paymentStatus = paymentStatus;
//     if (status) updateFields.status = status;

//     const updatedSubscription = await Subscription.findByIdAndUpdate(
//       subscriptionId,
//       { $set: updateFields },
//       { new: true }
//     );

//     if (!updatedSubscription) {
//       return res.status(404).json({ message: 'Subscription not found' });
//     }

//     res.status(200).json({
//       message: 'Subscription updated successfully',
//       subscription: updatedSubscription,
//     });

//   } catch (error) {
//     console.error('Error updating subscription:', error);
//     res.status(500).json({ message: 'Internal server error', error: error.message });
//   }
// };



// Set up daily cron job to check for missed deliveries
//import cron from 'node-cron';
//
//cron.schedule('0 0 * * *', async () => {
//  try {
//    const activeSubscriptions = await Subscription.find({
//      status: { $ne: 'cancelled' },
//      endDate: { $gte: new Date() }
//    });
//
//    for (const sub of activeSubscriptions) {
//      await scheduleAllDeliveriesForSubscription(sub._id);
//    }
//  } catch (err) {
//    console.error('Error in daily delivery scheduling:', err);
//  }
//});