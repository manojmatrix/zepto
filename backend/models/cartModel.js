import mongoose from 'mongoose';


const cartSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  items: [
    {
      productId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Product', 
        required: true 
      },
      name: { type: String, required: true },
      image: { type: String, required: true },
      price: { type: Number, required: true },
      rating: { type: Number, default: 0 },
      countInStock: { type: Number, required: true },
      quantity: { 
        type: Number, 
        required: true, 
        min: [1, 'Quantity cannot be less than 1'],
        default: 1
      },
      seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // CRITICAL
      sellerName: String,
   
      // subtotal is calculated per item (price * quantity)
      subtotal: { 
        type: Number, 
        required: true,
        default: 0
      }
    }
  ],
  // Total amount for the entire cart
  billTotal: {
    type: Number,
    required: true,
    default: 0
  }
}, { timestamps: true });

const Cart = mongoose.model('Cart', cartSchema);
export default Cart;