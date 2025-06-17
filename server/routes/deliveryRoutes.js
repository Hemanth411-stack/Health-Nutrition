import express from 'express';
import {
  scheduleDelivery,
  getUserDeliveries,
  updateDeliveryStatus,
  Alldeliveries
} from '../controllers/deliveryController.js';
import { authorize, protect } from '../middleware/authMiddleware.js';
import { adminCancelDeliveriesAndReschedule, getAdminCancellationMessages } from '../controllers/admincontroller.js';


const router = express.Router();

// User routes
router.post('/', protect, scheduleDelivery);
router.get('/me', protect, getUserDeliveries);
router.get('/admin-msg',protect,getAdminCancellationMessages)

// Admin route (optional admin check can be added)
router.put('/status', protect,authorize('admin','deliveryboy'), updateDeliveryStatus);
router.get('/admin/all', protect,authorize('admin','deliveryboy'), Alldeliveries);
router.post('/admin-leave',protect,authorize('admin'),adminCancelDeliveriesAndReschedule)
export default router;
