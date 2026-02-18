import Cart from '../models/cartModel.js';

// 1. ADD ITEM TO CART
export const addToCart = async (req, res) => {
  const { items} = req.body; 
  const userId = req.user._id;

  try {
    let cart = await Cart.findOne({ userId });

    if (cart) {
      // 1. If cart exists, check if product is already in the items array
      const itemIndex = cart.items.findIndex(p => p.productId.toString() === items[0].productId.toString());

      if (itemIndex > -1) {
        // Product exists, update the quantity
        cart.items[itemIndex].quantity += items[0].quantity;
      } else {
        // Product does not exist, push the new item object to array
        cart.items.push(items[0]);
      }
      cart = await cart.save();
    } else {
      
      cart = await Cart.create({
        userId,
        items
      });
    }

    
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: "Error adding to cart", error: error.message });
  }
};
// 2. GET USER CART
export const getCart = async (req, res) => {
    try {
         const userId = req.user._id;
        const cart = await Cart.findOne({ userId });

        // Case 1: Cart exists
        if (cart) {
            // Calculate total on the server to ensure Redux gets the right value
            const billTotal = cart.items.reduce((acc, item) => 
                acc + (Number(item.price) * item.quantity), 0
            );
            
            // Return only once and stop execution with 'return'
            return res.status(200).json({ items: cart.items, billTotal });
        } 

        // Case 2: Cart doesn't exist (return empty defaults)
        return res.status(200).json({ items: [], billTotal: 0 });

    } catch (error) {
        console.error("Get Cart Error:", error.message);
        res.status(500).json({ message: error.message });
    }
};

// 3. UPDATE ITEM QUANTITY (Increment/Decrement)
export const updateCartItem = async (req, res) => {
    const {  productId, quantity } = req.body;
    const userId = req.user._id;
    try {
        let cart = await Cart.findOne({ userId });
        if (!cart) return res.status(404).json({ message: "Cart not found" });

        const itemIndex = cart.items.findIndex(p => p.productId.toString() === productId);
        
        if (itemIndex > -1) {
            cart.items[itemIndex].quantity = quantity;
            
            // Remove item if quantity becomes 0 or less
            if (cart.items[itemIndex].quantity <= 0) {
                cart.items.splice(itemIndex, 1);
            }
            
            cart = await cart.save();
            res.status(200).json(cart);
        } else {
            res.status(404).json({ message: "Item not found in cart" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 4. DELETE ITEM FROM CART
export const removeFromCart = async (req, res) => {
  const {  productId } = req.params;
 const userId = req.user._id;
  try {
    // 1. Find the cart and remove the specific item from the items array
    const cart = await Cart.findOneAndUpdate(
      { userId },
      { $pull: { items: { productId: productId } } },
      { new: true } // returns the updated cart
    );

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};