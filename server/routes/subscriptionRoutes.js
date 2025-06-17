import express from 'express';
import { createSubscription, getallSubscriptions, getUserSubscriptions, getUserSubscriptionStats, updateSubscriptionStatus } from '../controllers/subscriptionController.js';
import { authorize, protect } from '../middleware/authMiddleware.js'; 


const router = express.Router();

router.post('/', protect, createSubscription); 
router.get('/me', protect, getUserSubscriptions);
router.get("/all",protect,getUserSubscriptionStats)
router.get("/admin/all", protect, authorize('admin'), getallSubscriptions);
router.put("/update-status", protect, authorize('admin'), updateSubscriptionStatus);

export default router;
