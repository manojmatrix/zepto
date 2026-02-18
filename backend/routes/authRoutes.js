import express from 'express';
import { sendOtp, verifyOtp} from '../controllers/authController.js';
import User from "../models/userModel.js";
import jwt from 'jsonwebtoken'; 
import { getUserProfile, deleteAddress} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
const router = express.Router();

router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);


router.post("/register-seller", async (req, res) => {
  try {
    const { name, email, password, companyName, companyAddress, gstNumber, phone } = req.body;

    // 1. Check if seller already exists
    let user = await User.findOne({ $or: [{ email }, { phone }, { gstNumber }] });
    if (user) return res.status(400).json({ success: false, message: "Seller with this Email/GST already exists" });

    // 2. Create new Seller user
    user = new User({
      name,
      email,
      password, // Note: Hash this password before saving!
      companyName,
      companyAddress,
      gstNumber,
      phone,
      role: 'seller',
      isVerified: false
    });

    await user.save();
   
    // 3. Now trigger your existing sendOtp logic
    // You can call your controller function directly or tell the frontend to call /send-otp
    res.json({ 
        success: true, 
        message: "Seller data saved. Please verify OTP.",
        userId: user._id 
    });

  } catch (err) { 
      console.error(err);
      res.status(500).json({ success: false, message: "Server error during registration" }); 
  }
});

router.post("/save-name", async (req, res) => {
  try {
    const { phone, name } = req.body;
    let user = await User.findOne({ phone });
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    user.name = name; 
    await user.save(); 

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" }); 
    res.json({ 
        success: true, 
        token, 
        user: { id: user._id, name: user.name, phone: user.phone, role: user.role } 
    });
  } catch (err) { res.status(500).json({ success: false, message: "Server error" }); }

});

// POST /api/user/add-address
router.post('/add-address',protect,async (req, res) => {
  try {
    const {  addressData } = req.body;
     const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Push the new address into the addresses array
    user.addresses.push(addressData);
    
    // If it's the first address, make it the default
    if (user.addresses.length === 1) {
      user.addresses[0].isDefault = true;
    }

    await user.save();
    res.status(200).json(user.addresses);
  } catch (error) {
    res.status(500).json({ message: "Error saving address", error });
  }
});

router.get("/users/count", async (req, res) => {
  try {
    const count = await User.countDocuments({ role: "user" });
    res.json({ success: true, totalUsers: count });
  }
  catch (err) { res.status(500).json({ success: false, message: "Server error" }); }
});

// router.get('/addresses/:userId', protect, async (req, res) => {
//     try {
         
//         const user = await User.findById(req.params.userId).select('addresses');
        
//         if (!user) {
//             return res.status(404).json({ message: "User not found" });
//         }

//         res.status(200).json(user.addresses);
//     } catch (error) {
//         res.status(500).json({ message: "Error fetching addresses", error: error.message });
//     }
// });
router.get('/addresses/:userId',protect,getUserProfile);
router.delete('/:addresses',protect, deleteAddress);

export default router;