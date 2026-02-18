import mongoose from 'mongoose';

// 1. Define the Review Schema
const reviewSchema = new mongoose.Schema(
    {
        name: { type: String, required: true }, // Name of the reviewer
        rating: { type: Number, required: true }, // Star rating (1-5)
        comment: { type: String, required: true },
        user: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'User', 
            required: true 
        }, // Link to the reviewer's user ID
    },
    { timestamps: true }
);

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    category: { 
        type: String, 
        required: true,
        enum: ['beauty', 'electronics', 'cafe', 'fresh', 'toys', 'home', 'mobiles'] 
    },
    image: { type: String, required: true },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { 
        type: String, 
        enum: ['pending', 'approved', 'rejected'], 
        default: 'pending' 
    },
    countInStock: { type: Number, required: true, default: 0 },
    
    // --- NEW REVIEW FIELDS ---
    reviews: [reviewSchema], // Array of review objects
    rating: { 
        type: Number, 
        required: true, 
        default: 0 
    }, // Overall average rating
    numReviews: { 
        type: Number, 
        required: true, 
        default: 0 
    }, // Total number of reviews
    // -------------------------

    createdAt: { type: Date, default: Date.now }
});

const Product = mongoose.model('Product', productSchema);
export default Product;