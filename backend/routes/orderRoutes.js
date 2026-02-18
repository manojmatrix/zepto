import Razorpay from 'razorpay';
import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import Order from '../models/Order.js';
import Cart from '../models/cartModel.js';
import Product from '../models/Product.js';
import crypto from 'crypto';
const router = express.Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

router.post('/create-razorpay-order', protect, async (req, res) => {
    try {
        const { amount, items, shippingAddress } = req.body;

        // --- NEW STOCK VALIDATION ---
        for (const item of items) {
            const product = await Product.findById(item.productId);
            if (!product) {
                return res.status(404).json({ message: `Product ${item.name} not found` });
            }
            if (product.countInStock < item.quantity) {
                return res.status(400).json({ 
                    message: `Insufficient stock for ${item.name}. Only ${product.countInStock} units left.` 
                });
            }
        }

        // 1. PREVENTION: Look for an existing 'Created' order for this user 
        // with the exact same price in the last 10 seconds.
        const tenSecondsAgo = new Date(Date.now() - 10 * 1000);
        const existingOrder = await Order.findOne({
            userId: req.user._id,
            totalPrice: amount,
            "paymentResult.status": "Created",
            createdAt: { $gte: tenSecondsAgo }
        });

        if (existingOrder) {
            // If we find one, don't create a new one! Just return the old one.
            console.log("Duplicate request blocked. Returning existing order.");
            return res.status(200).json({
                id: existingOrder.paymentResult.id,
                amount: existingOrder.totalPrice * 100 // Convert back to paise
            });
        }

        // 2. Proceed if no duplicate found
        const options = {
            amount: Math.round(amount * 100),
            currency: "INR",
            receipt: `receipt_${Date.now()}`,
        };

        const razorpayOrder = await razorpay.orders.create(options);

        const newOrder = new Order({
            userId: req.user._id,
            items,
            shippingAddress,
            totalPrice: amount,
            paymentResult: { id: razorpayOrder.id, status: 'Created' },
            
        });

        await newOrder.save();
        res.status(201).json(razorpayOrder);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


router.post('/verify-payment', protect, async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  const sign = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSign = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(sign.toString())
    .digest("hex");

  if (razorpay_signature === expectedSign) {
    // Find the order we created in the FIRST step and update it
    const order = await Order.findOne({ "paymentResult.id": razorpay_order_id });
    if (order) {
      for (const item of order.items) {
        await Product.findByIdAndUpdate(
          item.productId,
          { $inc: { countInStock: -(item.quantity || item.qty || 1) } }
        );
      }
      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentResult.id = razorpay_payment_id; // Store real payment ID
      order.paymentResult.status = "Paid";
      await order.save();
      await Cart.findOneAndDelete({ userId: req.user._id });
      return res.status(200).json({ message: "Paid successfully" });
    }
    res.status(404).json({ message: "Order not found" });
  } else {
    res.status(400).json({ message: "Invalid payment signature" });
  }
});

router.put('/:id/status', protect, async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findById(req.params.id);

        if (order) {
            order.orderStatus = status;
            const updatedOrder = await order.save();
            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.put('/:id/confirm', protect,  async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (order) {
            order.orderStatus = 'Confirmed';
            const updatedOrder = await order.save();
            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});  

router.get('/all-orders', protect, async (req, res) => {
    try {
        // Fetch all orders from the DB, sorted by newest first
        const orders = await Order.find({}).sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: "Error fetching orders" });
    }
});

// GET /api/orders/my-orders
router.get('/my-orders', protect, async (req, res) => {
    try {
        // Find orders where userId matches the logged-in user's ID
        const orders = await Order.find({ userId: req.user._id }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: "Error fetching your order history" });
    }
});

// PUT /api/orders/:id/cancel
router.put('/:id/cancel', protect, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ message: 'Order not found' });

        // Security check: Ensure this order belongs to the user trying to cancel it
        if (order.userId.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: "Not authorized" });
        }

        // Only allow cancellation if order is still 'Processing'
        if (order.orderStatus === 'Processing' || order.orderStatus === 'Confirmed') {
            order.orderStatus = 'Cancelled';
            await order.save();
            res.json({ message: 'Order cancelled successfully' });
        } else {
            res.status(400).json({ message: 'Order cannot be cancelled as it is already ' + order.orderStatus });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Backend: routes/orderRoutes.js
// Route to update a specific item status
// router.put('/:orderId/item/:productId', protect, async (req, res) => {
//     try {
//         const { orderId, productId } = req.params;
//         const { status } = req.body;

//         const order = await Order.findById(orderId);
//         if (!order) return res.status(404).json({ message: "Order not found" });

//         // Find the specific item in the items array
//         const item = order.items.find(i => i.productId.toString() === productId);
//         if (!item) return res.status(404).json({ message: "Item not found in order" });

//         // Update the item-level status
//         item.itemStatus = status;

//         await order.save();
//         res.json(order);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// });

router.get('/seller-orders', protect, async (req, res) => {
    try {
        const sellerId = req.user._id; // Get ID from auth middleware

        // 1. Find orders where this seller's ID exists in the items array
        const orders = await Order.find({
            "items.seller": sellerId 
        }).sort({ createdAt: -1 });

        // 2. Filter the items so the seller ONLY sees their own products
        const filteredOrders = orders.map(order => {
            const orderObj = order.toObject();
            
            // Filter items: only keep those where item.seller matches current seller
            orderObj.items = orderObj.items.filter(
                item => item.seller.toString() === sellerId.toString()
            );

            // Calculate the specific subtotal for this seller's items
            orderObj.sellerSubtotal = orderObj.items.reduce(
                (acc, item) => acc + (item.price * (item.quantity || item.qty)), 0
            );

            return orderObj;
        });

        res.status(200).json(filteredOrders);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
}
);

router.put('/:orderId/item/:productId', protect, async (req, res) => {
  const { orderId, productId } = req.params;
  const { status } = req.body; // 'Confirmed' or 'Cancelled'

  try {
    // 1. Update ONLY the specific item status
    const order = await Order.findOneAndUpdate(
      { _id: orderId, "items.productId": productId },
      { $set: { "items.$.itemStatus": status } },
      { new: true }
    );

    if (!order) return res.status(404).json({ message: "Order or Product not found" });

    // 2. Logic: ONLY auto-cancel the main order if ALL items are cancelled
    // We don't auto-confirm here because the Admin will do that via a separate button
    const allCancelled = order.items.every(item => item.itemStatus === 'Cancelled');
    
    if (allCancelled && order.orderStatus !== 'Cancelled') {
        order.orderStatus = 'Cancelled';
        await order.save();
    }

    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

export default router;