import User from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import sendOTP from '../utils/sendEmail.js';
// --- USER FLOW (Phone + OTP) ---

export const registerOrLogin = async (req, res) => {
  try {
    const { email } = req.body;
    const otp = Math.floor(1000 + Math.random() * 9000);

    // 1. Save OTP to your database here...

    // 2. Send the actual email
    await sendOTP(email, otp);

    res.status(200).json({ success: true, message: "OTP sent to email!" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const sendOtp = async (req, res) => {
    try {
        const { contact } = req.body; // Frontend sends { "contact": "email@test.com" }

        if (!contact) {
            return res.status(400).json({ success: false, message: "Email or Phone is required" });
        }

        const emailRegex = /\S+@\S+\.\S+/;
        const isEmail = emailRegex.test(contact);
        const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();

        // Use the correct field based on input type
        const query = isEmail ? { email: contact } : { phone: contact };
        const updateData = { 
            otp: generatedOtp, 
            otpExpires: Date.now() + 300000 // 5 min expiry
        };

        // Upsert user: Update if exists, create if not
        await User.findOneAndUpdate(query, updateData, { upsert: true, new: true });

        // Real-time Dispatch
        if (isEmail) {
            await sendOTP(contact, generatedOtp);
        } else {
            console.log(`>>> OTP for ${contact} is: ${generatedOtp}`);
        }

        res.status(200).json({ success: true, message: "OTP sent successfully" });
    } catch (error) {
        console.error("OTP Send Error:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

export const verifyOtp = async (req, res) => {
    const { contact, otp, sellerData } = req.body;

    try {
        const emailRegex = /\S+@\S+\.\S+/;
        const isEmail = emailRegex.test(contact);
        const query = isEmail ? { email: contact } : { phone: contact };

        // 1. Find user and verify OTP
        const user = await User.findOne({ 
            ...query, 
            otp, 
            otpExpires: { $gt: Date.now() } 
        });

        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
        }

        // 2. Handle Seller Registration (if data provided)
        if (sellerData) {
            user.name = sellerData.name;
            user.email = sellerData.email;
            user.companyName = sellerData.companyName;
            user.gstNumber = sellerData.gstNumber;
            user.companyAddress = sellerData.companyAddress;
            user.role = 'seller';
            user.isVerified = true;
            user.otp = undefined;
            user.otpExpires = undefined;
            await user.save();

            const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });
            return res.status(200).json({ 
                success: true, 
                token, 
                user: { id: user._id, name: user.name, role: user.role, addresses: user.addresses },
                message: "Seller verified successfully!" 
            });
        }

        // 3. Regular User Flow: Clear OTP
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();

        // 4. CHECK: Returning vs New User
        // If the user has a name, they are a returning user.
        const isNewUser = !user.name || user.name.trim() === "";

        if (isNewUser) {
            return res.status(200).json({ 
                success: true, 
                isNewUser: true, 
                message: "OTP verified. Please provide your name." 
            });
        }

        // 5. Returning User: Send Token & Profile
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });
        
        res.status(200).json({ 
            success: true, 
            isNewUser: false,
            token, 
            user: { 
                id: user._id, 
                name: user.name, 
                email: user.email, 
                phone: user.phone, 
                role: user.role,
                addresses: user.addresses 
            } 
        });

    } catch (err) { 
        console.error(err);
        res.status(500).json({ success: false, message: "Server error" }); 
    }
};
export const getUserProfile = async (req, res) => {
  try {
    // Use .select('-password') to ensure security while sending the full object
    const user = await User.findById(req.params.userId).select('-password');

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Return the FULL user object. 
    // This includes _id, name, email, and the addresses array.
    res.status(200).json(user);

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const deleteAddress = async (req, res) => {
  try {
    const { addresses } = req.params; // This now matches the route above
    const userId = req.user._id; 

    const user = await User.findByIdAndUpdate(
      userId,
      { $pull: { addresses: { _id: addresses } } },
      { new: true }
    );

    if (!user) return res.status(404).json({ message: "User not found" });
    
    res.status(200).json(user.addresses);
  } catch (error) {
    res.status(500).json({ message: "Delete failed", error: error.message });
  }
};
