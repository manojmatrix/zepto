import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/cartSlice';
import { openCart } from '../store/uiSlice';
import axios from 'axios';
import ProductCard from './ProductCard';
import ZeptoNavbar from '../components/ZeptoNavbar'; 
import {  useSelector } from 'react-redux';

const ProductDetails = () => {
  
  const { id } = useParams();
  const [similarProducts, setSimilarProducts] = useState([]);
  const dispatch = useDispatch();

  const cartItem = useSelector(state =>
    state.cart.items.find(item => item.productId === id)
  );
  const qty = cartItem ? cartItem.quantity : 0;;
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  // 1. SAFELY get user (handle null)
  const userData = localStorage.getItem('user');
  const user = userData ? JSON.parse(userData) : null;

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:8000/api/product/${id}`);
        const currentProduct = response.data.product;
        setProduct(currentProduct);

        const allRes = await axios.get(`http://localhost:8000/api/product/approved`);
        const filtered = allRes.data.products.filter(
          p => p.category === currentProduct.category && p._id !== id
        );
        setSimilarProducts(filtered.slice(0, 6));
      } catch (error) {
        console.error("Error fetching data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
    window.scrollTo(0, 0);
  }, [id]);

  // LOADING GUARDS (Keep these here)
  if (loading) return <div className="p-5 text-center">Loading...</div>;
  if (!product) return <div className="p-5 text-center">Product not found.</div>;

  const isOutOfStock = (product.countInStock || 0) <= 0;
  const isLowStock = product.countInStock > 0 && product.countInStock <= 5;
  
  const discount = product.discount || 0;
  const oldPrice = discount > 0 ? Math.round(product.price / (1 - discount / 100)) : product.price;
  
  // 2. MOVE cartData inside the component logic
  const handleAddToCart = (e) => {
    e.stopPropagation();
    const token = localStorage.getItem('token');

    if (!product || product.countInStock < 1) {
      alert("This item is currently out of stock.");
      return; 
    }

    if (isOutOfStock) {
      alert("Sorry, this item is out of stock.");
      return;
    }

    // BLOCK 2: Check if user is trying to add more than available
    if (qty >= product.countInStock) {
      alert(`Sorry, only ${product.countInStock} units available.`);
      return;
    }
    
    // Check if user is logged in
    if (!token || !user) { 
      dispatch(openCart()); 
      return; 
    }

    const cartData = {
      userId: user._id,
      items: [{
        productId: product._id,
        name: product.name,
        price: Number(product.price),
        image: product.image,
        quantity: 1,
        seller: product.seller, 
        sellerName: product.seller?.name||product.sellername || product.sellerName|| "product details",
        countInStock: product.countInStock || 0
      }],
    };
  
    dispatch(addToCart(cartData));
  };
  return (
    <>
      {/* Using your functional Navbar - hiding the sub-nav categories */}
      <ZeptoNavbar showSubNav={false} />

      <Container className="py-4 mt-3">
        {/* Product Detail Card */}
        <Row className="bg-white rounded-4 overflow-hidden border shadow-sm">
          <Col lg={6} className="p-4 border-end d-flex">
            <div className="d-flex flex-column gap-2 me-3 d-none d-md-flex">
              {[1, 2, 3].map((i) => (
                <img key={i} src={product.image} className="border rounded-2 p-1" style={{ width: '50px', height: '50px', objectFit: 'contain' }} alt="thumb" />
              ))}
            </div>
            <div className="flex-grow-1 text-center">
              <img src={product.image} alt={product.name} className="img-fluid" style={{ maxHeight: '400px', objectFit: 'contain' }} />
            </div>
          </Col>

          <Col lg={6} className="p-4">
            <nav className="small text-muted mb-2">Home › {product.category} › {product.name}</nav>
            <h1 className="fw-bold fs-3 mb-1">{product.name}</h1>
            <p className="text-muted mb-3">{product.quantity || '1 unit'}</p>

            {product.numReviews > 0 && (
              <div className="d-flex align-items-center gap-2 mb-3">
                <div className="bg-light border rounded-pill px-2 py-1 d-flex align-items-center shadow-sm" style={{ fontSize: '0.85rem' }}>
                  <span className="text-success fw-bold me-1">★ {product.rating}</span>
                  <span className="text-muted" style={{ fontSize: '0.75rem' }}>({product.numReviews >= 1000 ? (product.numReviews / 1000).toFixed(1) + 'k' : product.numReviews})</span>
                </div>
              </div>
            )}

            <div className="d-flex align-items-center gap-3 mb-4">
              <div className="bg-success text-white px-3 py-1 rounded-3 fw-bold fs-4">₹{product.price}</div>
              {discount > 0 && <span className="text-muted text-decoration-line-through fs-5">₹{oldPrice}</span>}
              {/* ... inside your Col lg={6} ... */}

              <div className="ms-2">
                {isOutOfStock ? (
                  <p className="text-danger small fw-bold m-0 animate-pulse">
                    <span className="me-1">●</span> Out of Stock
                  </p>
                ) : isLowStock ? (
                  <p className="small fw-bold m-0" style={{ color: '#ff4800' }}>
                    <span className="me-1">⚠️</span> Only {product.countInStock} left - order soon!
                  </p>
                ) : null /* Returns nothing if stock > 5 */}
              </div>

              <div className="d-flex flex-column gap-3 mb-4">
                <div className="d-flex align-items-center gap-3">
                  <Button
                    variant={isOutOfStock ? "secondary" : "outline-danger"}
                    size="lg"
                    className="fw-bold px-5 py-2 rounded-3"
                    onClick={handleAddToCart}
                    disabled={isOutOfStock}               
                  >
                    {isOutOfStock ? "OUT OF STOCK" : "ADD TO CART"}
                  </Button>
                </div>

                {/* NEAT STOCK LINE BELOW BUTTON */}
                
              </div>
            </div>
            <hr className="opacity-25" />
            <h6 className="fw-bold mb-1 mt-4">Product Details</h6>
             <p className="text-secondary mb-1 small">
                  <strong>Product Description:</strong> {product.description}
                </p>
            <h6 className="fw-bold mb-1 mt-4">Seller Details</h6>
            {product.seller ? (
              <>
                <p className="text-secondary mb-1 small">
                  <strong>Seller Name:</strong> {product.seller.name}
                </p>
                <p className="text-secondary mb-1 small">
                  <strong>Company:</strong> {product.seller.companyName}
                </p>
                <p className="text-secondary mb-1 small">
                  <strong>GSTIN:</strong> {product.seller.gstNumber}
                </p>
                <p className="text-secondary mb-1 small">
                  <strong>Address:</strong> {product.seller.companyAddress}
                </p>
              </>
            ) : (
              <p className="text-muted small italic">Sold by Zepto Retail</p>
            )}

          </Col>
        </Row>

        {/* Similar Products Section */}
        <div className="mt-5">
          <h4 className="fw-bold mb-4">Similar Products</h4>
          <Row className="g-4">
            {similarProducts.map((item) => (
              <Col key={item._id} xs={6} md={4} lg={2}>
                <ProductCard product={item} />
              </Col>
            ))}
          </Row>
        </div>
      </Container>
    </>
  );
};

export default ProductDetails;