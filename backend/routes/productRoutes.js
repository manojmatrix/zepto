import express from 'express';
import { addProduct, getSellerProducts,getPendingProducts,updateProductStatus} from '../controllers/productController.js';
import { protect } from '../middleware/authMiddleware.js'; // A middleware to verify JWT
import { getApprovedProducts, getProductById,updateProduct,createProductReview} from '../controllers/productController.js';


const router = express.Router();

// Route to add a product (Protected: Only logged-in sellers)
router.post('/add', protect, addProduct);
router.post('/:id/review', protect, createProductReview);
// Route to get products for the logged-in seller
router.get('/seller-products', protect, getSellerProducts);

router.get('/admin/pending', protect, getPendingProducts);
router.patch('/admin/update-status', protect, updateProductStatus);

router.get('/approved', getApprovedProducts);
router.get('/:id',getProductById);
router.put('/:id', protect, updateProduct);  


export default router;