import express from 'express';
import {
  scheduleDelivery,
  getUserDeliveries,
  updateDeliveryStatus,
  Alldeliveries
} from '../controllers/deliveryController.js';
import { authorize, protect } from '../middleware/authMiddleware.js';
import { adminCancelDeliveriesAndReschedule, getAdminCancellationMessages } from '../controllers/admincontroller.js';
import { deleteSubscriptionAndDeliveries } from '../controllers/subscriptionController.js';
import { createDeliveryVerification, getAllVerifications, getMyVerificationStatus, updateVerificationStatus } from '../controllers/verifydelliverystatus.js';


const router = express.Router();

// User routes
router.post('/', protect, scheduleDelivery);
router.get('/me', protect, getUserDeliveries);
router.get('/admin-msg',protect,getAdminCancellationMessages)
router.delete('/admin-delete-subscription',protect,authorize('admin'),deleteSubscriptionAndDeliveries)
// Admin route (optional admin check can be added)
router.put('/status', protect,authorize('admin','deliveryboy'), updateDeliveryStatus);
router.get('/admin/all', protect,authorize('admin','deliveryboy'), Alldeliveries);
router.post('/admin-leave',protect,authorize('admin'),adminCancelDeliveriesAndReschedule)

// admin approval for deliverable status
router.post('/deliverable',protect,createDeliveryVerification)
router.get('/deliverable',protect,getMyVerificationStatus)
router.put('/aadmin-deliverable',protect,authorize('admin'),updateVerificationStatus)
router.get('/get-all',protect,authorize('admin'),getAllVerifications)
export default router;
