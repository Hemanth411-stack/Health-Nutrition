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
import { getalldeliveriesinformation, getMyDeliveries, loginDeliveryBoy, registerDeliveryBoy, updateDeliveryBoyProfile } from '../controllers/deliveryboicontroller.js';
import { protectDeliveryBoy } from '../middleware/deliveryboimiddleware.js';
import multer from "multer";


const router = express.Router();

// User routes
router.post('/', protect, scheduleDelivery);
router.get('/me', protect, getUserDeliveries);
router.get('/admin-msg',protect,getAdminCancellationMessages)
router.delete('/admin-delete-subscription',protect,authorize('admin'),deleteSubscriptionAndDeliveries)
// Admin route (optional admin check can be added)
router.put('/status', protectDeliveryBoy, updateDeliveryStatus);
router.get('/admin/all', Alldeliveries);
router.post('/admin-leave',protect,authorize('admin'),adminCancelDeliveriesAndReschedule)

// admin approval for deliverable status
router.post('/deliverable',protect,createDeliveryVerification)
router.get('/deliverable',protect,getMyVerificationStatus)
router.put('/aadmin-deliverable',protect,authorize('admin'),updateVerificationStatus)
router.get('/get-all',protect,authorize('admin'),getAllVerifications)

// delivery boi routes

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/boi/register", upload.single('profileImage'), registerDeliveryBoy);
router.post('/boi/login',loginDeliveryBoy)
router.get('/deliveryboi-address',protectDeliveryBoy,getMyDeliveries)
router.put('/deliveryboi-address-update',protectDeliveryBoy,upload.single('profileImage'),updateDeliveryBoyProfile)
router.get('/deliveryboi-details',getalldeliveriesinformation)
export default router;
