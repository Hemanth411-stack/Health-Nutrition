// import Subscription from '../models/Subscription.js';
// import Delivery from '../models/Delivery.js';
// import Userinformation from '../models/Userinformation.js';

// // export const adminCancelDeliveriesAndReschedule = async (req, res) => {
// //   try {
// //     const { date, message } = req.body;
// //     if (!date || !message) {
// //       return res.status(400).json({ message: 'Both date and message are required.' });
// //     }

// //     const cancelDate = new Date(date);
// //     cancelDate.setHours(0, 0, 0, 0); // Normalize date

// //     // 1. Cancel all deliveries for the given date
// //     const cancelledDeliveries = await Delivery.updateMany(
// //       {
// //         deliveryDate: {
// //           $gte: new Date(cancelDate),
// //           $lt: new Date(cancelDate.getTime() + 24 * 60 * 60 * 1000),
// //         },
// //       },
// //       {
// //         $set: { status: 'cancelled', adminMessage: message },
// //       }
// //     );

// //     // 2. Fetch active subscriptions
// //     const activeSubscriptions = await Subscription.find({ status: 'active' });

// //     // 3. Add one day to each active subscription's endDate and create one delivery
// //     for (const sub of activeSubscriptions) {
// //       const oldEndDate = new Date(sub.endDate);
// //       const newEndDate = new Date(oldEndDate.getTime() + 24 * 60 * 60 * 1000);

// //       sub.endDate = newEndDate;
// //       await sub.save();

// //       const userInfo = await Userinformation.findOne({ user: sub.user });

// //       const userAddress = {
// //         street: userInfo.address.street,
// //         area: userInfo.address.area,
// //         city: userInfo.address.city,
// //         state: userInfo.address.state,
// //         pincode: userInfo.address.pincode,
// //       };

// //       const deliveryDateStr = newEndDate.toISOString().split('T')[0];
// //       const alreadyExists = await Delivery.findOne({
// //         subscription: sub._id,
// //         deliveryDate: deliveryDateStr,
// //       });

// //       if (!alreadyExists) {
// //         await Delivery.create({
// //           user: sub.user,
// //           address: userAddress,
// //           slot: 'morning',
// //           deliveryDate: deliveryDateStr,
// //           subscription: sub._id,
// //           product: sub.product,
// //           status: 'pending',
// //           isFestivalOrSunday: false,
// //         });
// //       }
// //     }

// //     res.status(200).json({
// //       success: true,
// //       message: `Deliveries on ${date} cancelled, and compensatory deliveries scheduled.`,
// //       cancelledDeliveries: cancelledDeliveries.modifiedCount,
// //       affectedSubscriptions: activeSubscriptions.length,
// //     });
// //   } catch (error) {
// //     console.error('Admin reschedule error:', error);
// //     res.status(500).json({
// //       success: false,
// //       message: 'Failed to process admin reschedule request',
// //       error: error.message,
// //     });
// //   }
// // };
// export const adminCancelDeliveriesAndReschedule = async (req, res) => {
//   try {
//     const { date, message } = req.body;
//     if (!date || !message) {
//       return res.status(400).json({ message: 'Both date and message are required.' });
//     }

//     // Normalize the date at local midnight
//     const cancelDate = new Date(date);
//     cancelDate.setHours(0, 0, 0, 0);

//     // 🚫 1. Block Sundays (getDay() === 0)
//     if (cancelDate.getDay() === 0) {
//       return res.status(400).json({
//         success: false,
//         message: 'Cannot cancel deliveries for Sunday. Choose another date.'
//       });
//     }

//     // 2. Cancel all deliveries for the given date
//     const cancelledDeliveries = await Delivery.updateMany(
//       {
//         deliveryDate: {
//           $gte: cancelDate,
//           $lt: new Date(cancelDate.getTime() + 24 * 60 * 60 * 1000),
//         },
//       },
//       { $set: { status: 'cancelled', adminMessage: message } }
//     );

//     // 3. Fetch active subscriptions
//     const activeSubscriptions = await Subscription.find({ status: 'active' });

//     // 4. Extend endDate + create compensatory delivery
//     for (const sub of activeSubscriptions) {
//       const oldEndDate = new Date(sub.endDate);
//       const newEndDate = new Date(oldEndDate.getTime() + 24 * 60 * 60 * 1000);

//       sub.endDate = newEndDate;
//       await sub.save();

//       // Get user address
//       const userInfo = await Userinformation.findOne({ user: sub.user });
//       const userAddress = {
//         street: userInfo.address.street,
//         area: userInfo.address.area,
//         city: userInfo.address.city,
//         state: userInfo.address.state,
//         pincode: userInfo.address.pincode,
//       };

//       const deliveryDateStr = newEndDate.toISOString().split('T')[0];
//       const alreadyExists = await Delivery.findOne({
//         subscription: sub._id,
//         deliveryDate: deliveryDateStr,
//       });

//       if (!alreadyExists) {
//         await Delivery.create({
//           user: sub.user,
//           address: userAddress,
//           slot: 'morning',
//           deliveryDate: deliveryDateStr,
//           subscription: sub._id,
//           product: sub.product,
//           status: 'pending',
//           isFestivalOrSunday: false,
//         });
//       }
//     }

//     // 5. Send response
//     res.status(200).json({
//       success: true,
//       message: `Deliveries on ${date} cancelled and compensatory deliveries scheduled.`,
//       cancelledDeliveries: cancelledDeliveries.modifiedCount,
//       affectedSubscriptions: activeSubscriptions.length,
//     });
//   } catch (error) {
//     console.error('Admin reschedule error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to process admin reschedule request',
//       error: error.message,
//     });
//   }
// };



// export const getAdminCancellationMessages = async (req, res) => {
//   try {
//     const userId = req.user._id;
    
//     // 1. Get user's subscriptions (active or completed)
//     const userSubscriptions = await Subscription.find({
//       user: userId,
//       status: { $in: ['active', 'completed'] },
//       adminMessage: { $exists: true, $ne: '' } // Only subscriptions with messages
//     })
//     .select('_id adminMessage endDate status')
//     .sort({ updatedAt: -1 }); // Newest messages first
    
//     if (userSubscriptions.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: 'No cancellation messages found for your subscriptions'
//       });
//     }
    
//     // 2. For each subscription with message, find the cancelled delivery dates
//     const messagesWithDates = await Promise.all(
//       userSubscriptions.map(async (sub) => {
//         const cancelledDeliveries = await Delivery.find({
//           subscription: sub._id,
//           status: 'cancelled'
//         })
//         .select('deliveryDate')
//         .sort({ deliveryDate: -1 });
        
//         return {
//           subscriptionId: sub._id,
//           subscriptionStatus: sub.status,
//           endDate: sub.endDate,
//           message: sub.adminMessage,
//           cancelledDates: cancelledDeliveries.map(d => d.deliveryDate),
//           lastUpdated: sub.updatedAt
//         };
//       })
//     );
    
//     // 3. Filter out subscriptions without cancelled deliveries
//     const validMessages = messagesWithDates.filter(
//       msg => msg.cancelledDates.length > 0
//     );
    
//     res.status(200).json({
//       success: true,
//       count: validMessages.length,
//       messages: validMessages
//     });
    
//   } catch (error) {
//     console.error('Error fetching cancellation messages:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to fetch cancellation messages',
//       error: error.message
//     });
//   }
// };



import AdminCancellationMessage from '../models/adminmessages.js';
import Delivery from '../models/Delivery.js';
import Subscription from '../models/Subscription.js';
import Userinformation from '../models/Userinformation.js';

export const adminCancelDeliveriesAndReschedule = async (req, res) => {
  try {
    const { date, message } = req.body;
    const adminId = req.user._id; // Assuming admin is authenticated

    if (!date || !message) {
      return res.status(400).json({ message: 'Both date and message are required.' });
    }

    // Normalize the date at local midnight
    const cancelDate = new Date(date);
    cancelDate.setHours(0, 0, 0, 0);

    // Block Sundays
    if (cancelDate.getDay() === 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel deliveries for Sunday. Choose another date.'
      });
    }

    // 1. Cancel all deliveries for the given date
    const cancelledDeliveries = await Delivery.updateMany(
      {
        deliveryDate: {
          $gte: cancelDate,
          $lt: new Date(cancelDate.getTime() + 24 * 60 * 60 * 1000),
        },
      },
      { $set: { status: 'cancelled' } }
    );

    // 2. Fetch active subscriptions
    const activeSubscriptions = await Subscription.find({ status: 'active' });
    const subscriptionIds = activeSubscriptions.map(sub => sub._id);

    // 3. Create admin cancellation record
    const cancellationRecord = await AdminCancellationMessage.create({
      cancellationDate: cancelDate,
      message,
      affectedSubscriptions: subscriptionIds,
      cancelledDeliveriesCount: cancelledDeliveries.modifiedCount,
      createdBy: adminId
    });

    // 4. Extend endDate + create compensatory delivery
    for (const sub of activeSubscriptions) {
      const oldEndDate = new Date(sub.endDate);
      const newEndDate = new Date(oldEndDate.getTime() + 24 * 60 * 60 * 1000);

      sub.endDate = newEndDate;
      await sub.save();

      // Get user address
      const userInfo = await Userinformation.findOne({ user: sub.user });
      const userAddress = {
        street: userInfo.address.street,
        area: userInfo.address.area,
        city: userInfo.address.city,
        state: userInfo.address.state,
        pincode: userInfo.address.pincode,
      };

      const deliveryDateStr = newEndDate.toISOString().split('T')[0];
      const alreadyExists = await Delivery.findOne({
        subscription: sub._id,
        deliveryDate: deliveryDateStr,
      });

      if (!alreadyExists) {
        await Delivery.create({
          user: sub.user,
          address: userAddress,
          slot: 'morning',
          deliveryDate: deliveryDateStr,
          subscription: sub._id,
          product: sub.product,
          status: 'pending',
          isFestivalOrSunday: false,
        });
      }
    }

    res.status(200).json({
      success: true,
      message: `Deliveries on ${date} cancelled and compensatory deliveries scheduled.`,
      cancellationRecordId: cancellationRecord._id,
      cancelledDeliveries: cancelledDeliveries.modifiedCount,
      affectedSubscriptions: activeSubscriptions.length,
    });
  } catch (error) {
    console.error('Admin reschedule error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process admin reschedule request',
      error: error.message,
    });
  }
};



export const getAdminCancellationMessages = async (req, res) => {
  try {
    const userId = req.user._id;

    // Step 1: Get today's local date (00:00:00 to 23:59:59)
    const localNow = new Date();
    const localStartOfDay = new Date(localNow.getFullYear(), localNow.getMonth(), localNow.getDate());
    const localEndOfDay = new Date(localStartOfDay.getTime() + 86_400_000); // +1 day

    // Step 2: Find subscriptions
    const userSubscriptions = await Subscription.find({
      user: userId,
      status: { $in: ['active', 'completed'] }
    }).select('_id');

    if (userSubscriptions.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No subscriptions found for this user'
      });
    }

    // Step 3: Find today's cancellation messages using local time range
    const cancellationMessages = await AdminCancellationMessage.find({
      affectedSubscriptions: { $in: userSubscriptions.map(sub => sub._id) },
      cancellationDate: { $gte: localStartOfDay, $lt: localEndOfDay }
    })
    .sort({ cancellationDate: -1 })
    .populate('createdBy', 'name email');

    // Step 4: Attach cancelled delivery details
    const messagesWithDetails = await Promise.all(
      cancellationMessages.map(async (msg) => {
        const cancelledDeliveries = await Delivery.find({
          subscription: { $in: userSubscriptions.map(sub => sub._id) },
          deliveryDate: msg.cancellationDate,
          status: 'cancelled'
        }).select('deliveryDate subscription');

        return {
          cancellationId: msg._id,
          date: msg.cancellationDate,
          message: msg.message,
          issuedBy: msg.createdBy,
          issuedAt: msg.createdAt,
          affectedDeliveries: cancelledDeliveries.map(d => ({
            date: d.deliveryDate,
            subscriptionId: d.subscription
          }))
        };
      })
    );

    return res.status(200).json({
      success: true,
      count: messagesWithDetails.length,
      messages: messagesWithDetails
    });

  } catch (error) {
    console.error('Error fetching cancellation messages:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch cancellation messages',
      error: error.message
    });
  }
};



// export const getAdminCancellationMessages = async (req, res) => {
//   try {
//     const userId = req.user._id;

//     // 1. Get ONLY active subscriptions (remove 'completed' if not needed)
//     const userSubscriptions = await Subscription.find({
//       user: userId,
//       status: 'active' // Only active subscriptions
//     }).select('_id');

//     if (!userSubscriptions.length) {
//       return res.status(404).json({
//         success: false,
//         message: 'No active subscriptions found'
//       });
//     }

//     // 2. Find messages targeting THESE subscriptions
//     const cancellationMessages = await AdminCancellationMessage.find({
//       affectedSubscriptions: { $in: userSubscriptions.map(sub => sub._id) }
//     })
//     .sort({ cancellationDate: -1 })
//     .populate('createdBy', 'name email');

//     // 3. Strictly filter deliveries for EXACT cancellation date
//     const messagesWithDetails = await Promise.all(
//       cancellationMessages.map(async (msg) => {
//         const cancelledDeliveries = await Delivery.find({
//           subscription: { $in: msg.affectedSubscriptions }, // Only subscriptions mentioned in the message
//           deliveryDate: msg.cancellationDate,
//           status: 'cancelled',
//           cancellationReason: { $exists: true } // Optional: ensure it was cancelled by admin
//         });

//         return {
//           cancellationId: msg._id,
//           date: msg.cancellationDate,
//           message: msg.message,
//           issuedBy: msg.createdBy,
//           issuedAt: msg.createdAt,
//           affectedDeliveries: cancelledDeliveries.map(d => ({
//             date: d.deliveryDate,
//             subscriptionId: d.subscription
//           }))
//         };
//       })
//     );

//     // Filter out messages with no matching deliveries (optional)
//     const filteredMessages = messagesWithDetails.filter(msg => 
//       msg.affectedDeliveries.length > 0
//     );

//     res.status(200).json({
//       success: true,
//       count: filteredMessages.length,
//       messages: filteredMessages
//     });

//   } catch (error) {
//     console.error('Error fetching cancellation messages:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error',
//       error: error.message
//     });
//   }
// };