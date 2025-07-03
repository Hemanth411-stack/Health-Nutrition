import express from 'express';
import { createSubscription, getallSubscriptions, getPauseInfo, getUserSubscriptions, getUserSubscriptionStats, pauseAndRescheduleDeliveries, updateSubscriptionStatus } from '../controllers/subscriptionController.js';
import { authorize, protect } from '../middleware/authMiddleware.js'; 


const router = express.Router();

router.post('/', protect, createSubscription); 
router.get('/me', protect, getUserSubscriptions);
router.get("/all",protect,getUserSubscriptionStats)
router.get("/admin/all", protect, authorize('admin'), getallSubscriptions);
router.put("/update-status", protect, authorize('admin'), updateSubscriptionStatus);
// pause days 

router.post('/pause-reshedule',protect,pauseAndRescheduleDeliveries)
router.get('/getpause-deliveries/:subscriptionId',protect,getPauseInfo)
export default router;
