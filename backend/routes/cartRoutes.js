import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
const router = express.Router();
import { 
    addToCart, 
    getCart, 
    updateCartItem, 
    removeFromCart 
} from '../controllers/cartController.js';

// All routes prefixed with /api/cart
router.post('/add',protect, addToCart);
router.get('/:userId',protect, getCart);
router.put('/update',protect, updateCartItem);
router.delete('/remove/:userId/:productId', protect,removeFromCart);

export default router;