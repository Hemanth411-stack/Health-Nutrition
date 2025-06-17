import express from 'express';
import {
  createProduct,
  getAllProducts,
  getProductById,
  // updateProduct,
  // deleteProduct
} from '../controllers/productController.js';
import { authorize, protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public Routes
router.get('/', getAllProducts);
router.get('/:id', getProductById);

// Protected Routes (for Admin)
router.post('/', protect,authorize('admin'), createProduct);
// router.put('/:id', protect, updateProduct);
// router.delete('/:id', protect, deleteProduct);

export default router;
