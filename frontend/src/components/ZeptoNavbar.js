import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux'; // REDUX HOOKS
import { getCart } from '../store/cartSlice'; // REDUX ACTION
import "bootstrap/dist/css/bootstrap.min.css";
import {  Form,  Offcanvas, Button, Modal } from 'react-bootstrap';
import {
  FiSearch, FiUser, FiShoppingCart, FiChevronDown,
  FiShoppingBag, FiCoffee, FiHome, FiSmile,
  FiTarget, FiSmartphone, FiAperture, FiWind, FiChevronLeft} from 'react-icons/fi';
import Login from '../pages/logins/Login';
import { closeCart, openCart } from '../store/uiSlice';
import {  removeFromCart,clearCartState,updateCartItem } from '../store/cartSlice';
import axios from 'axios';
import { verifyOrder } from '../store/orderSlice';
import { setSelectedAddress,setUserData } from '../store/cartSlice';
import LocationModal from './LocationModal';
import AddressesButton from './SavedAddresses';
import { MapPin, ShoppingBag } from 'lucide-react';
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

function ZeptoNavbar({ showSubNav = true }) {
  const dispatch = useDispatch();
  
  // 1. Get Cart Data from Redux Store
  const { items, billTotal,selectedAddress } = useSelector((state) => state.cart);
  const user = useSelector((state) => state.cart.userData);
  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const showCart = useSelector(state => state.ui.showCart);
  const [showLogin, setShowLogin] = useState(false);
  // const [showCart, setShowCart] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  // const [user, setUser] = useState(null);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [activeTab, setActiveTab] = useState('orders');
  const [showLocation, setShowLocation] = useState(false);
  const [addressData, setAddressData] = useState({
    address: '',
    city: '',
    postalCode: '',
    phone: ''
  });
// const [savedAddresses, setSavedAddresses] = useState([]);
// const [selectedAddress, setSelectedAddress] = useState(null);
const [showNewAddressForm, setShowNewAddressForm] = useState(false);

const fetchAddresses = async () => {
    
    const token = localStorage.getItem('token');
    const storedUser = JSON.parse(localStorage.getItem('user'));

    if (!storedUser?._id || !token) return;

    try {
        const response = await axios.get(
            `http://localhost:8000/api/auth/addresses/${storedUser._id}`, 
            { headers: { Authorization: `Bearer ${token}` } }
        );

        // This should be the full user object including the addresses array
        const freshUser = response.data; 

        // 1. Sync Redux (This makes it visible in the Modal)
        dispatch(setUserData(freshUser));

        // 2. Sync LocalStorage (For page refreshes)
        localStorage.setItem('user', JSON.stringify(freshUser));

    } catch (err) {
        console.error("Failed to sync user data:", err);
    }
};

// Update your useEffect to use this new function
useEffect(() => {
  const syncUser = () => {
    const latestUser = JSON.parse(localStorage.getItem('user'));
    if (latestUser) dispatch(setUserData(latestUser));
  };

  // Listen for the custom event we just created
  window.addEventListener("userUpdated", syncUser);
  
  // Fetch addresses when profile modal OR checkout address modal opens
  if (showProfile || showAddressModal) {
    fetchAddresses(); 
  }

  return () => window.removeEventListener("userUpdated", syncUser);
}, [showProfile, showAddressModal, fetchAddresses]);

  const handleAddressChange = (e) => {
    setAddressData({ ...addressData, [e.target.name]: e.target.value });
  };

 

 const handleSaveAddress = async (e) => {
  e.preventDefault();
  if (isProcessing) return;

  const token = localStorage.getItem('token');
  if (!token) return alert("Please login to save address");

  try {
    setIsProcessing(true);

    const response = await axios.post(
      'http://localhost:8000/api/auth/add-address', 
      { userId: user._id, addressData: addressData },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    // FIX: response.data IS the new array of addresses from your backend
    const updatedAddresses = response.data; 
    const updatedUser = { ...user, addresses: updatedAddresses };

    // 1. Update React State
    dispatch(setUserData(updatedUser));

    // 2. Update LocalStorage
    localStorage.setItem('user', JSON.stringify(updatedUser));
    
    // 3. Inform other components
    window.dispatchEvent(new Event("userUpdated"));

    // 4. Set Redux selection (Get the last item in the fresh array)
    if (updatedAddresses.length > 0) {
      const newAddr = updatedAddresses[updatedAddresses.length - 1];
      dispatch(setSelectedAddress(newAddr));
    }

    // 5. UI Cleanup
    setShowNewAddressForm(false); 
    setIsProcessing(false); 
    
    // 6. Trigger Payment
    setTimeout(() => {
      handlePayment();
    }, 100);

  } catch (err) {
    console.error("Failed to save address", err);
    alert("Error saving address.");
    setIsProcessing(false);
  }
};
  const handleOpenLogin = () => setShowLogin(true);
  const handleOpenCart = () => dispatch(openCart());
  // const handleCloseCart = () => setShowCart(false);
  const handleCloseLogin = () => setShowLogin(false);
  const handleOpenProfile = () => setShowProfile(true);
  const handleCloseProfile = () => setShowProfile(false);
  const handleCloseCart = () => dispatch(closeCart());
  const handleAdd = (product) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) return;
    dispatch(updateCartItem({ 
      userId: user._id, 
      productId: product.productId,
       quantity: product.quantity + 1 }));
};

  const handleRemove = (item) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) return;

    dispatch(removeFromCart({
      userId: user._id,
      productId: item.productId._id || item.productId
    }));
  };

  const handlePayment = async (e) => {
  if (e && e.preventDefault) {
    e.preventDefault();
  }

  // 1. New Guard: Check if an address is actually selected in Redux
  if (!selectedAddress) {
    alert("Please select a delivery address to proceed.");
    return;
  }

  // GUARD: If already processing, exit immediately
  if (isProcessing) return;

  const isScriptLoaded = await loadRazorpayScript();
  if (!isScriptLoaded) {
    alert("Razorpay SDK failed to load.");
    return;
  }

  const token = localStorage.getItem('token');
  if (!token) {
    alert("Please login to proceed");
    return;
  }

  try {
    // START PROCESSING: Disable the button
    setIsProcessing(true);

    const orderPayload = {
      amount: billTotal,
      items: items.map(item => ({
        productId: item.productId._id || item.productId,
        name: item.name,
        price: item.price,
        image: item.image,
        quantity: item.quantity,
        seller: item.seller,
        sellerName: item.seller?.name||item.sellerName
      })),
      // 2. Updated: Use selectedAddress from Redux instead of addressData
      shippingAddress: selectedAddress, 
    };

    // Create the order in your DB
    const { data: order } = await axios.post(
      'http://localhost:8000/api/order/create-razorpay-order', 
      orderPayload, 
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const options = {
      key: process.env.REACT_APP_RAZORPAY_KEY_ID, 
      amount: order.amount,
      currency: "INR",
      name: "Zepto Clone",
      order_id: order.id,
      handler: async function (response) {
        const verificationData = {
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
        };

        // Verification call
        await dispatch(verifyOrder(verificationData));

        alert("Payment Successful!");
        
        // CLEANUP: Clear both Redux and LocalStorage
        dispatch(clearCartState());
        localStorage.removeItem('cartItems'); 
        
        setShowAddressModal(false);
        setIsProcessing(false); 
      },
      modal: {
        ondismiss: function() {
          // If user closes the popup without paying, re-enable the button
          setIsProcessing(false);
        }
      },
      // 3. Updated prefill to use selectedAddress phone
      prefill: { 
        contact: selectedAddress.phone, 
        email: user?.email 
      },
      theme: { color: "#ff527b" }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();

  } catch (err) {
    console.error("Payment initialization failed", err);
    alert("Error creating order. Please try again.");
    setIsProcessing(false);
  }
};

const handleDeleteAddress = async (addresses) => {
  if (!window.confirm("Are you sure you want to delete this address?")) return;

  const token = localStorage.getItem('token');
  try {
    // Note: We removed the { userId, addressData } object. 
    // Axios DELETE expects: url, config (headers)
    const response = await axios.delete(
      `http://localhost:8000/api/auth/${addresses}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    // 1. Update React State
    const updatedUser = { ...user, addresses: response.data };
    dispatch(setUserData(updatedUser));

    // 2. Update LocalStorage (So it doesn't come back on refresh)
    localStorage.setItem('user', JSON.stringify(updatedUser));

    // 3. Clear Redux if needed
    if (selectedAddress?._id === addresses) {
      dispatch(setSelectedAddress(null));
    }
    
    alert("Address removed successfully");
  } catch (err) {
    console.error("Failed to delete address", err);
    alert("Could not delete address.");
  }
};
  // Load user and Fetch Cart on Mount
  useEffect(() => {
  const fetchCartData = async () => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');

    if (storedUser && token) {
      dispatch(setUserData(storedUser));
      // This fills the Redux store with data from your MongoDB
      dispatch(getCart(storedUser._id)); 
    }
  };

  fetchCartData();
}, [dispatch]);

  const categories = [
    { name: 'All', path: '/All', icon: <FiShoppingBag className="me-2" /> },
    { name: 'Cafe', path: '/Cafe', icon: <FiCoffee className="me-2" /> },
    { name: 'Home', path: '/Home', icon: <FiHome className="me-2" /> },
    { name: 'Toys', path: '/Toys', icon: <FiSmile className="me-2" /> },
    { name: 'Fresh', path: '/Fresh', icon: <FiTarget className="me-2" /> },
    { name: 'Electronics', path: '/Electronics', icon: <FiAperture className="me-2" /> },
    { name: 'Mobiles', path: '/Mobiles', icon: <FiSmartphone className="me-2" /> },
    { name: 'Beauty', path: '/Beauty', icon: <FiWind className="me-2" /> },
  ];

  return (
    <div className="zepto-nav-wrapper">
    {/* TOP ROW: LOGO, LOCATION, SEARCH, ACTIONS */}
    <nav className="zepto-main-nav">
      <div className="zepto-container">
        {/* Left Section */}
        <div className="nav-left">
          <Link to="/">
            <img 
              src="https://cdn.zeptonow.com/web-static-assets-prod/artifacts/14.9.0/images/header/primary-logo.svg" 
              alt="zepto" 
              className="zepto-logo-img"
            />
          </Link>
          <div className="location-box" onClick={() => setShowLocation(true)}>
            <span className="location-text">Select Location</span>
            <FiChevronDown size={14} className="ms-1" />
          </div>
        </div>

        {/* Center Section: Search */}
        <div className="nav-center">
          <div className="search-bar">
            <FiSearch className="search-icon" size={18} />
            <input 
              type="text" 
              placeholder='Search for "apple juice"' 
              className="search-input"
            />
          </div>
        </div>

        {/* Right Section: Actions */}
        <div className="nav-right">
          <div className="action-btn" onClick={user ? handleOpenProfile : handleOpenLogin}>
            <FiUser size={22} strokeWidth={1.5} />
            <span>{user ? user.name : "Login"}</span>
          </div>
          <div className="action-btn" onClick={handleOpenCart}>
            <div className="cart-icon-wrapper">
              <FiShoppingCart size={22} strokeWidth={1.5} />
              {cartCount > 0 && <span className="cart-count-badge">{cartCount}</span>}
            </div>
            <span>Cart</span>
          </div>
        </div>
      </div>
    </nav>
    <LocationModal 
        show={showLocation} 
        onHide={() => setShowLocation(false)} 
      />

    {/* BOTTOM ROW: CATEGORIES */}
    {showSubNav && (
      <div className="zepto-cat-nav">
        <div className="zepto-container">
          <div className="cat-list">
            {categories.map((cat) => (
              <NavLink
                key={cat.name}
                to={cat.path}
                className={({ isActive }) => `cat-item ${isActive ? 'active' : ''}`}
              >
                <span className="cat-icon">{cat.icon}</span>
                <span className="cat-text">{cat.name}</span>
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    )}

      {/* Cart Sidebar - Updated with Redux Items */}
      <Offcanvas show={showCart} onHide={handleCloseCart} placement="end" style={{ width: '380px' }}>
        <Offcanvas.Header className="border-bottom">
          <div className="d-flex align-items-center fw-bold" onClick={handleCloseCart} style={{ cursor: 'pointer' }}>
            <FiChevronLeft size={24} className="me-2" /> Cart
          </div>
        </Offcanvas.Header>
        <Offcanvas.Body className="d-flex flex-column p-0 bg-light">
          {!user ? (
            <div className="d-flex flex-column align-items-center justify-content-center text-center px-4 h-100">
              <h5 className="fw-bold mb-1">Please Login</h5>
              <p className="text-muted small mb-4">Please login to access the cart.</p>
              <Button
                onClick={() => { handleCloseCart(); handleOpenLogin(); }}
                style={{ backgroundColor: '#ff527b', border: 'none', width: '100%', padding: '12px', fontWeight: 'bold' }}
              >
                Login
              </Button>
            </div>
          ) : items.length === 0 ? (
            <div className="d-flex flex-column align-items-center justify-content-center text-center px-4 h-100">
              <FiShoppingBag size={50} className="mb-3 text-muted" />
              <p>Your cart is empty.</p>
            </div>
          ) : (
            <>
              <div className="flex-grow-1 overflow-auto p-3 bg-white">
                <h6 className="fw-bold mb-3">Items in Cart</h6>
                {items && items.length > 0 ? (
                  items.map((item, index) => {
                    // Unique key check to fix console warning
                    const itemKey = item.productId?._id || item.productId || `item-${index}`;

                    // Safety mapping for missing data
                    const name = item.name || item.productId?.name || 'Product';
                    const image = item.image || item.productId?.image || null;
                    const price = Number(item.price || item.productId?.price || 0);
                    const qty = Number(item.quantity || 0);

                    return (
                      <div key={itemKey} className="d-flex align-items-center mb-3 border-bottom pb-3">
                        {image ? (
                          <img src={image} alt={name} style={{ width: '50px', height: '50px', objectFit: 'contain' }} className="me-3 border rounded" />
                        ) : (
                          <div className="me-3 border rounded bg-light" style={{ width: '50px', height: '50px' }} />
                        )}

                        <div className="flex-grow-1">
                          <div className="small fw-bold text-dark text-truncate" style={{ maxWidth: '120px' }}>
                            {name}
                          </div>

                          {/* STEPPER UI START */}
                          <div className="d-flex align-items-center mt-1">
                            <div
                              className="d-flex align-items-center justify-content-between text-white"
                              style={{
                                backgroundColor: '#ff3269',
                                borderRadius: '8px',
                                width: '70px',
                                padding: '2px 8px',
                                fontSize: '12px'
                              }}
                            >
                              <span
                                style={{ cursor: 'pointer', fontWeight: 'bold' }}
                                onClick={() => handleRemove(item)} // Function to handle -
                              >
                                &minus;
                              </span>
                              <span className="fw-bold">{qty}</span>
                              <span
                                style={{ cursor: 'pointer', fontWeight: 'bold' }}
                                onClick={() => handleAdd(item)} // Function to handle +
                              >
                                &#43;
                              </span>
                            </div>
                            <div className="small text-muted ms-2">x ₹{price}</div>
                          </div>
                          {/* STEPPER UI END */}
                        </div>

                        <div className="fw-bold">₹{(price * qty).toLocaleString()}</div>
                      </div>
                    );
                  }) // Fixed: removed the extra '})' here
                ) : (
                  <div className="text-center py-5">
                    <FiShoppingBag size={40} className="text-muted mb-2" />
                    <p>Your cart is empty.</p>
                  </div>
                )}
              </div>
              <div className="bg-white border-top p-3 shadow-lg">
                <div className="d-flex justify-content-between fw-bold fs-5 mb-3">
                  <span>Grand Total</span>
                  <span style={{ color: '#8224e3' }}>
                    ₹{typeof billTotal === 'number' ? billTotal.toLocaleString() : '0'}
                  </span>
                </div>
                <Button
                  className="w-100 py-3 fw-bold rounded-3 border-0"
                  style={{ backgroundColor: '#ff527b' }}
                  onClick={() => setShowAddressModal(true)}
                >
                  Proceed to Checkout
                </Button>
              </div>
            </>
          )}
        </Offcanvas.Body>
      </Offcanvas>
      {/* { checkout functionalities} */}
      <Modal show={showAddressModal} onHide={() => setShowAddressModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title className="fw-bold">Delivery Address</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* CASE 1: User has saved addresses - Show Selection List */}
          {user?.addresses?.length > 0 && !showNewAddressForm ? (
            <div className="address-selection-list">
              <p className="text-muted small fw-bold mb-3">SELECT A DELIVERY ADDRESS</p>

              {user.addresses.map((addr, index) => (
                <div
                  key={addr._id || index}
                  className="p-3 mb-2 border rounded-3 d-flex align-items-center"
                  onClick={() => dispatch(setSelectedAddress(addr))} // Directly dispatch to Redux
                  style={{
                    cursor: 'pointer',
                    border: selectedAddress?._id === addr._id ? '2px solid #8224e3' : '1px solid #dee2e6',
                    backgroundColor: selectedAddress?._id === addr._id ? '#fcfaff' : 'white'
                  }}
                >
                  <div className="flex-grow-1">
                    <div className="fw-bold" style={{ color: '#8224e3' }}>{addr.city}</div>
                    <div className="small text-dark">{addr.address}</div>
                    <div className="small text-muted">{addr.phone}</div>
                  </div>
                  {selectedAddress?._id === addr._id && (
                    <div className="text-success fw-bold fs-5">✓</div>
                  )}
                </div>
              ))}

              <Button
                variant="link"
                className="w-100 text-decoration-none fw-bold mt-2"
                style={{ color: '#ff527b' }}
                onClick={() => setShowNewAddressForm(true)}
              >
                + Add New Address
              </Button>

              <Button
                className="w-100 mt-3 py-3 fw-bold border-0 shadow-sm"
                style={{ backgroundColor: '#8224e3' }}
                onClick={handlePayment}
                disabled={!selectedAddress || isProcessing}
              >
                {isProcessing ? "Processing..." : `Proceed to Pay ₹${billTotal.toLocaleString()}`}
              </Button>
            </div>
          ) : (
            /* CASE 2: No addresses or "Add New" clicked - Show Form */
            <Form onSubmit={handleSaveAddress}>
              <h6 className="fw-bold mb-3">Add New Address</h6>

              <Form.Group className="mb-3">
                <Form.Label className="small fw-bold text-muted">Street Address</Form.Label>
                <Form.Control
                  name="address"
                  placeholder="H.No, Street, Area"
                  required
                  value={addressData.address}
                  onChange={handleAddressChange}
                />
              </Form.Group>

              <div className="d-flex gap-2">
                <Form.Group className="mb-3 flex-grow-1">
                  <Form.Label className="small fw-bold text-muted">City</Form.Label>
                  <Form.Control
                    name="city"
                    placeholder="City"
                    required
                    value={addressData.city}
                    onChange={handleAddressChange}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label className="small fw-bold text-muted">Pincode</Form.Label>
                  <Form.Control
                    name="postalCode"
                    placeholder="123456"
                    required
                    value={addressData.postalCode}
                    onChange={handleAddressChange}
                  />
                </Form.Group>
              </div>

              <Form.Group className="mb-3">
                <Form.Label className="small fw-bold text-muted">Phone Number</Form.Label>
                <Form.Control
                  name="phone"
                  placeholder="10-digit mobile number"
                  required
                  value={addressData.phone}
                  onChange={handleAddressChange}
                />
              </Form.Group>

              <Button
                type="submit"
                className="w-100 mt-3 py-3 fw-bold border-0"
                style={{ backgroundColor: '#ff527b' }}
                disabled={isProcessing}
              >
                {isProcessing ? "Saving..." : "Save & Proceed"}
              </Button>

              {user?.addresses?.length > 0 && (
                <Button
                  variant="link"
                  className="w-100 mt-2 text-muted small text-decoration-none"
                  onClick={() => setShowNewAddressForm(false)}
                >
                  ← Back to saved addresses
                </Button>
              )}
            </Form>
          )}
        </Modal.Body>
      </Modal>

      {/* Profile Modal */}
      <Modal show={showProfile} onHide={handleCloseProfile} centered size="lg" className="zepto-profile-modal">
        <Modal.Body className="p-0">
          <div className="d-flex" style={{ minHeight: '500px' }}>
            <div className="profile-sidebar p-4 border-end" style={{ width: '35%', backgroundColor: '#f8f9fa' }}>
              <div className="user-info-section mb-4 d-flex align-items-center">
                <div className="user-avatar-circle me-3"><FiUser size={24} color="#8224e3" /></div>
                <div>
                  <h5 className="mb-0 fw-bold">{user?.name || 'User'}</h5>
                  <small className="text-muted">{user?.email}</small>
                </div>
              </div>
              <div className="profile-nav-links">
                <Link to="/order-history" style={{ textDecoration: 'none', color: 'inherit' }}>
                  <div className="nav-item-zepto active">
                    <FiShoppingBag className="me-3" /> Orders
                  </div>
                </Link>
                {/* <div className="nav-item-zepto"><FiHome className="me-3" /> Addresses</div> */}
                <Link to="/AddressesButton" style={{ textDecoration: 'none', color: 'inherit' }}>
                <div
                  className={`nav-item-zepto ${activeTab === 'addresses' ? 'active' : ''}`}
                  onClick={() => setActiveTab('addresses')}
                >
                  <MapPin size={20} className="me-3" />
                  <span>Addresses</span>
                </div>
                </Link>
              </div>
              <div className="mt-5 pt-4">
                <Button variant="outline-danger" className="w-100 fw-bold rounded-3" onClick={() => { localStorage.clear(); window.location.reload(); }}>
                  Log Out
                </Button>
              </div>
            </div>
            <div className="profile-content-area flex-grow-1 p-4 bg-white">
              <button className="close-x-profile" onClick={handleCloseProfile}>×</button>
              <h5 className="fw-bold mb-4">Saved Addresses</h5>

              <div className="address-list-container">
                {user?.addresses?.length > 0 ? (
                  user.addresses.map((addr, index) => (
                    <div key={addr._id} className="address-card p-3 mb-3 border rounded-3 d-flex justify-content-between align-items-center">
                      <div>
                        <h6 className="fw-bold mb-1" style={{ color: '#8224e3' }}>{addr.city}</h6>
                        <p className="small text-muted mb-0">{addr.address}</p>
                      </div>
                      <button
                        className="btn btn-sm btn-outline-danger border-0"
                        onClick={() => handleDeleteAddress(addr._id)}
                        style={{ borderRadius: '50%', padding: '5px 10px' }}
                      >
                        ✕
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-5">
                    <FiHome size={40} className="text-muted mb-3 opacity-50" />
                    <p className="text-muted">No addresses saved yet.</p>
                  </div>
                )}

                <Button
                  className="w-100 mt-3 py-2 fw-bold"
                  style={{ border: '2px dashed #8224e3', color: '#8224e3', background: 'transparent' }}
                  onClick={() => { setShowAddressModal(true); handleCloseProfile(); }}
                >
                  + Add New Address
                </Button>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
      
      <Login show={showLogin} handleClose={handleCloseLogin} />
    </div>
  );
}



export default ZeptoNavbar;