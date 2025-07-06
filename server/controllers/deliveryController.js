import Delivery from '../models/Delivery.js';

// 📌 Schedule Delivery
import Subscription from '../models/Subscription.js';

export const scheduleDelivery = async (req, res) => {
  try {
    const { address, slot, deliveryDate } = req.body;
    const userId = req.user.id;

    const isSunday = new Date(deliveryDate).getDay() === 0;

    // Find active subscription for the user
    const subscription = await Subscription.findOne({
      user: userId,
    });

    if (!subscription) {
      return res.status(400).json({ message: 'No valid subscription found for this date' });
    }

    const delivery = await Delivery.create({
      user: userId,
      address,
      slot,
      deliveryDate,
      subscription: subscription._id,
      isFestivalOrSunday: isSunday
    });

    res.status(201).json(delivery);
  } catch (err) {
    res.status(500).json({ message: 'Failed to schedule delivery', error: err.message });
  }
};


// 📌 Get User Deliveries
export const getUserDeliveries = async (req, res) => {
  try {
    // Check if user has an active subscription
    const activeSubscription = await Subscription.findOne({
      user: req.user.id,
      status: 'active'
    });

    if (!activeSubscription) {
      // Return empty array if no active subscription
      return res.json([]);
    }

    // Fetch deliveries only if subscription is active
    const deliveries = await Delivery.find({ 
      user: req.user.id,
      subscription: activeSubscription._id
    }).sort({ deliveryDate: -1 });

    res.json(deliveries);
  } catch (err) {
    res.status(500).json({ 
      message: 'Error fetching deliveries', 
      error: err.message 
    });
  }
};

// admin usage
export const Alldeliveries = async (req, res) => {
  try {
    // Get the current date's start and end
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    const deliveries = await Delivery.find({
      deliveryDate: { $gte: startOfDay, $lte: endOfDay }
    })
      .populate('user', 'name') // only fetch user name
      .sort({ deliveryDate: -1 });

    res.status(200).json(deliveries);
  } catch (err) {
    console.error("Error in Alldeliveries:", err);
    res.status(500).json({ message: 'Error fetching deliveries', error: err.message });
  }
};

// 📌 Update Delivery Status (Admin use)

// export const updateDeliveryStatus = async (req, res) => {
//   try {
//     const { deliveryId, status } = req.body;

//     const delivery = await Delivery.findByIdAndUpdate(
//       deliveryId,
//       { status },
//       { new: true }
//     ).populate('subscription');

//     if (!delivery) return res.status(404).json({ message: 'Delivery not found' });

//     // If delivery is marked delivered
//     if (delivery.status === 'delivered' && delivery.subscription) {
//       const subscription = await Subscription.findById(delivery.subscription._id);

//       const now = new Date();
//       const end = new Date(subscription.endDate);

//       if (now < end) {
//         const diffDays = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
//         return res.json({
//           delivery,
//           remainingDays: diffDays,
//           message: `Delivery marked as delivered. ${diffDays} days remaining in subscription.`,
//         });
//       } else {
//         return res.json({
//           delivery,
//           remainingDays: 0,
//           message: `Subscription has already expired.`,
//         });
//       }
//     }

//     res.json({ delivery, message: 'Delivery updated.' });
//   } catch (err) {
//     res.status(500).json({ message: 'Error updating delivery', error: err.message });
//   }
// };


export const updateDeliveryStatus = async (req, res) => {
  try {
    const { deliveryId, status } = req.body;

    // 1️⃣ Update the delivery status
    const delivery = await Delivery.findByIdAndUpdate(
      deliveryId,
      {
        status,
        deliveredAt: status === 'delivered' ? Date.now() : undefined,
      },
      { new: true }
    ).populate('subscription');

    if (!delivery) {
      return res.status(404).json({ message: 'Delivery not found' });
    }

    let subscriptionCompleted = false;
    let deletedCount = 0;

    // 2️⃣ Proceed only if delivery marked as delivered and has a subscription
    if (status === 'delivered' && delivery.subscription) {
      const subscription = delivery.subscription;

      // Normalize today and tomorrow to 00:00 UTC
      const now = new Date();
      const todayUTC = new Date(Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate()
      ));
      const tomorrowUTC = new Date(todayUTC.getTime() + 86400000); // +1 day

      const endDate = new Date(subscription.endDate);
      const endDateUTC = new Date(Date.UTC(
        endDate.getUTCFullYear(),
        endDate.getUTCMonth(),
        endDate.getUTCDate()
      ));

      console.log("todayUTC:", todayUTC.toISOString());
      console.log("endDateUTC:", endDateUTC.toISOString());
      console.log("tomorrowUTC:", tomorrowUTC.toISOString());

      // 3️⃣ Delete any stray deliveries beyond endDate
      const strayDeliveries = await Delivery.deleteMany({
        subscription: subscription._id,
        deliveryDate: { $gt: endDateUTC }, // strictly after endDate
      });
      deletedCount = strayDeliveries.deletedCount || 0;

      // 4️⃣ Check for any remaining future deliveries (from tomorrow onwards)
      const futurePendingCount = await Delivery.countDocuments({
        subscription: subscription._id,
        deliveryDate: { $gte: tomorrowUTC },
        status: { $ne: 'delivered' },
      });

      const noFutureDeliveries = futurePendingCount === 0;
      const subscriptionHasEnded = todayUTC >= endDateUTC;

      // 5️⃣ If today is the end date and no future deliveries left, mark as completed
      if (subscriptionHasEnded && noFutureDeliveries) {
        subscription.status = 'completed';
        await subscription.save();
        subscriptionCompleted = true;
      }
    }

    // 6️⃣ Response
    return res.status(200).json({
      success: true,
      delivery,
      subscriptionCompleted,
      deletedCount,
      message: subscriptionCompleted
        ? `Delivery updated. Subscription marked as completed. ${deletedCount} future delivery(ies) removed.`
        : 'Delivery status updated.',
    });
  } catch (err) {
    console.error('Error updating delivery status:', err);
    return res.status(500).json({ message: 'Error updating delivery', error: err.message });
  }
};
