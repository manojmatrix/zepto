import jwt from "jsonwebtoken";
import User from '../models/userModel.js';



export const protect = async (req, res, next) => { 
  let token = req.headers.authorization?.split(" ")[1];

  if (!token || token === "null" || token === "undefined") {
    return res.status(401).json({ error: "Not authorized, malformed or missing token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return res.status(401).json({ error: "User not found" });
    }
    next();
  } catch (error) {
    console.error("Token Verification Error:", error.message);
    return res.status(401).json({ error: "Token failed" });
  }
};