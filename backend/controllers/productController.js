import Product from '../models/Product.js';


export const addProduct = async (req, res) => {
  try {
    // 1. Safety Check: Ensure user is actually authenticated
    if (!req.user || !req.user.id) {
      return res.status(401).json({ success: false, message: "Unauthorized: No user ID found" });
    }

    // 2. Destructure or Validate: Optional, but keeps DB clean
    const { name, price, description } = req.body; 

    const newProduct = new Product({
      ...req.body, 
      seller: req.user.id,
      status: 'pending'
    });

    await newProduct.save();

    res.status(201).json({ 
      success: true, 
      message: "Product added successfully",
      product: newProduct // Useful to return the new product to Redux
    });

  } catch (error) {
    console.error("DETAILED ERROR:", error);
    
    // 3. Specific error handling for Mongoose
    if (error.name === 'ValidationError') {
      return res.status(400).json({ success: false, message: error.message });
    }

    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
export const getSellerProducts = async (req, res) => {
    try {
        // Find products where seller field matches the logged-in user's ID
        const products = await Product.find({ seller: req.user.id });
        res.status(200).json({ success: true, products });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get all pending products for Admin
export const getPendingProducts = async (req, res) => {
    try {
        const products = await Product.find({ status: 'pending' }).populate('seller', 'name email');
        res.status(200).json({ success: true, products });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update product status (Approve or Reject)
export const updateProductStatus = async (req, res) => {
    try {
        const { productId, status } = req.body; // status will be 'approved' or 'rejected'
        const product = await Product.findByIdAndUpdate(
            productId, 
            { status }, 
            { new: true }
        );
        res.status(200).json({ success: true, message: `Product ${status}`, product });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Fetch all approved products for the Landing Page
export const getApprovedProducts = async (req, res) => {
    try {
        // Only fetch products where status is 'approved'
        const products = await Product.find({ status: 'approved' });
        res.status(200).json({ success: true, products });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Fetch a SINGLE product's details by ID
export const getProductById = async (req, res) => {
    try {
        
        const product = await Product.findById(req.params.id)
            .populate('seller', 'name companyName gstNumber companyAddress'); 
            // Only select the fields you want to show for security
        
        if (!product) return res.status(404).json({ success: false, message: "Not found" });
        
        res.json({ success: true, product });
    } catch (err) {
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// Backend Product Controller
export const updateProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(
            req.params.id, 
            { $set: req.body }, // This will update countInStock or any other field sent
            { new: true }
        );
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: "Update failed" });
    }
};

export const createProductReview = async (req, res) => {
  const { rating, comment } = req.body;
  const product = await Product.findById(req.params.id);

  if (product) {
    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    product.reviews.push(review);
    product.numReviews = product.reviews.length;
    product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;

    await product.save();
    res.status(201).json({ message: 'Review added' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
};