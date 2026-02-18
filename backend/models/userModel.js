import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    
    phone: { type: String, unique: true, sparse: true }, // Optional for Admin/Seller
    name: { type: String }, otp: { type: String }, otpExpires: { type: Date },
    email: { type: String, unique: true, sparse: true }, // Optional for Users
    password: { type: String }, // Only for Admin/Seller
    addresses: [
    {
      address: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      phone: { type: String, required: true },
      isDefault: { type: Boolean, default: false }
    }
  ],
    role: { 
        type: String,
        enum: ['user', 'seller', 'admin'], 
        default: 'user' 
    },
    
    isVerified: { type: Boolean, default: false },
    companyName: { type: String }, 
     companyAddress: { type: String },
     gstNumber: { type: String }
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);
export default User;