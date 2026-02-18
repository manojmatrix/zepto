import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      name: String,
      price: Number,
      image: String,
      quantity: Number,
      seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // The ID for filtering
      sellerName: String, // The Name for display
      itemStatus: { 
        type: String, 
        default: 'Processing', 
        enum: ['Processing', 'Confirmed', 'Cancelled', 'Refunded'] 
      }
    }
  ],
  shippingAddress: {
    address: String,
    city: String,
    postalCode: String,
    phone: String
  },
  paymentResult: {
    id: String, // Razorpay Payment ID
    status: String,
    update_time: String,
  },
  totalPrice: Number,
  isPaid: { type: Boolean, default: false },
  paidAt: Date,
  orderStatus: { 
    type: String, 
    default: 'Processing', 
    enum: ['Processing', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'] 
  },
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } 
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);
export default Order;