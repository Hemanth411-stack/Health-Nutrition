import express from 'express';
import { upsertUserInfo, getUserInfo } from '../controllers/userInfoController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router
  .route('/')
  .get(protect, getUserInfo)     // GET /api/userinfo
  .post(protect, upsertUserInfo) // POST /api/userinfo

export default router;
