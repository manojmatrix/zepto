import Product from '../models/Product.js';
import User from '../models/User.js';
import Order from '../models/Order.js'; // You'll create this model in Step 2

export const getAdminStats = async (req, res) => {
    try {
        const totalProducts = await Product.countDocuments();
        const pendingApprovals = await Product.countDocuments({ status: 'pending' });
        const totalSellers = await User.countDocuments({ role: 'seller' });
        // const totalOrders = await Order.countDocuments(); // Uncomment after Step 2

        res.status(200).json({
            totalProducts,
            pendingApprovals,
            totalSellers,
            totalOrders: 0 // Placeholder
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};