import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, removeFromCart } from '../store/cartSlice';
import { openCart } from '../store/uiSlice';
import { Button } from 'react-bootstrap';


const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
 
 
  const originalPrice =  Math.round(product.price * 1.2);
  const amountOff = originalPrice - product.price;
  
  //  original discount calculation logic
  const discount = Math.round(((product.price * 5) / 1000) * 10);

  const user = JSON.parse(localStorage.getItem('user'));

  // Get this specific product's quantity from the global Redux store
  const cartItem = useSelector(state =>
    state.cart.items.find(item => item.productId === product._id)
  );
  const qty = cartItem ? cartItem.quantity : 0;

  const isOutOfStock = product.countInStock <= 0;
  const isLowStock = product.countInStock > 0 && product.countInStock <= 5;

  const handleAdd = (e) => {
  e.stopPropagation();
  const token = localStorage.getItem('token'); 

  if (!product || product.countInStock < 1) {
      alert("This item is currently out of stock.");
      return; 
    }
    // BLOCK 1: Check total stock
    if (isOutOfStock) {
      alert("Sorry, this item is out of stock.");
      return;
    }

    // BLOCK 2: Check if user is trying to add more than available
    if (qty >= product.countInStock) {
      alert(`Sorry, only ${product.countInStock} units available.`);
      return;
    }

  if (!token) { dispatch(openCart()); return; }

  dispatch(addToCart({
    userId: user._id ,
    items: [{
      productId: product._id,
      name: product.name,
      price: Number(product.price),
      image: product.image,
      quantity: 1,
      seller: product.seller, 
      sellerName: product.seller?.name ||product.sellerName||product.sellername|| "product card",
      countInStock: product.countInStock || 10
    }]
   
  }));
};

  const handleRemove = (e) => {
    e.stopPropagation(); 
    if (!user) { dispatch(openCart()); return; }
    if (product?._id) {
        dispatch(removeFromCart({
            userId: user._id,
            productId: product._id 
        }));
    }
};

  return (
    <div
      className={`product-card p-2 border rounded-4 bg-white position-relative shadow-sm ${isOutOfStock ? 'opacity-75' : ''}`}
      style={{ width: '180px', cursor: isOutOfStock ? 'not-allowed' : 'pointer' }}
      onClick={() => !isOutOfStock && navigate(`/product/${product._id}`)}
    >
      {/* Out of Stock Overlay Text */}
      {isOutOfStock && (
        <div className="position-absolute top-50 start-50 translate-middle badge bg-dark opacity-75 py-2 px-3" style={{ zIndex: 10 }}>
          OUT OF STOCK
        </div>
      )}
      
      {/* Discount Badge */}
      {discount > 0 && (
        <div className="position-absolute top-0 start-0 bg-primary text-white px-2 py-1 rounded-top-start"
          style={{ fontSize: '10px', fontWeight: 'bold', borderTopLeftRadius: '12px', zIndex: 1 }}>
          {discount}% OFF
        </div>
      )}

      {/* Image Section */}
      <div className="d-flex justify-content-center mb-2 mt-3 position-relative">
        <img
          src={product.image}
          alt={product.name}
          style={{ height: '120px', objectFit: 'contain', filter: isOutOfStock ? 'grayscale(100%)' : 'none' }}
        />

        {qty === 0 ? (
          <Button
            className={`btn btn-sm fw-bold bg-white position-absolute ${isOutOfStock ? 'text-muted border-muted' : 'text-danger border-light-grey'}`}
            style={{ bottom: '10px', right: '-5px', borderRadius: '8px', padding: '2px 15px', zIndex: 5 }}
            onClick={(e) => handleAdd(e)}
            disabled={isOutOfStock}
          >
            {isOutOfStock ? 'SOLD' : 'ADD'}
          </Button>
        ) : (
          <div className="position-absolute d-flex align-items-center justify-content-between text-white"
            style={{ bottom: '10px', right: '-5px', backgroundColor: '#ff3269', borderRadius: '12px', minWidth: '80px', padding: '2px 8px', zIndex: 2 }}>
            <span style={{ cursor: 'pointer' }} onClick={(e) => handleRemove(e)}>&minus;</span>
            <span className="fw-bold">{qty}</span>
            {/* The + button is disabled if qty reaches stock limit */}
            <span
              style={{ cursor: qty >= product.countInStock ? 'not-allowed' : 'pointer', opacity: qty >= product.countInStock ? 0.5 : 1 }}
              onClick={(e) => handleAdd(e)}
            >&#43;</span>
          </div>
        )}
      </div>

      {/* Low Stock Badge inside Card */}
      {isLowStock && !isOutOfStock && (
        <div className="text-center bg-warning bg-opacity-10 text-warning small fw-bold mb-1 rounded-1" style={{ fontSize: '10px' }}>
          Only {product.countInStock} left!
        </div>
      )}
      {/* PRICE SECTION (Updated as per image) */}
      <div className="mt-2">
        <div className="d-flex align-items-center gap-2 mb-1">
          <div 
            className="px-2 py-1 rounded-3 text-white fw-bold" 
            style={{ backgroundColor: '#2d7d32', fontSize: '16px' }}
          >
            ₹{product.price}
          </div>
          <span className="text-muted text-decoration-line-through" style={{ fontSize: '14px' }}>
            ₹{originalPrice}
          </span>
        </div>
        <div className="fw-bold text-success mb-2" style={{ fontSize: '12px' }}>
          ₹{amountOff} OFF
        </div>
      </div>

      {/* Title & Info */}
      <p className="fw-bold mb-1 text-truncate-2" style={{ fontSize: '14px', lineHeight: '1.2', height: '34px', color: '#333' }}>
        {product.name}
      </p>
      <p className="text-muted small mb-2">{product.quantity || '1 pack (2 kg)'}</p>

      {/* Rating */}
      <div className="bg-light d-inline-flex align-items-center px-2 py-1 rounded-2">
        <span className="text-success small fw-bold" style={{ fontSize: '12px' }}>
          ★ {product.rating > 0 ? product.rating.toFixed(1) : "New"}
        </span>
        <span className="text-muted ms-1" style={{ fontSize: '11px' }}>
          ({product.numReviews || 0})
        </span>
      </div>
    </div>
  );
};

export default ProductCard;