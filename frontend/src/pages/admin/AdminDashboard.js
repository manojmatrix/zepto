import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Nav, Navbar, Button, Table, Badge, Modal, ListGroup, Image } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FiActivity, FiSettings, FiCheckSquare, FiLogOut, FiShoppingBag, FiTruck, FiBox, FiUsers } from 'react-icons/fi';
import { FaRupeeSign } from "react-icons/fa";
import axios from 'axios';
import './admin.css';
import AdminApproval from './AdminApproval';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('overview');
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null); 
    const [showModal, setShowModal] = useState(false);
    const [showManageModal, setShowManageModal] = useState(false); // Modal for individual item management

    // 1. Fetch Data Function (Moved to top-level for reusability)
    const fetchOrders = async () => {
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const ordersRes = await axios.get('http://localhost:8000/api/order/all-orders', config);
            setOrders(ordersRes.data);
        } catch (err) { 
            console.error("Error fetching data", err); 
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    // 2. ACTION HANDLERS
    const handleViewDetails = (order) => {
        setSelectedOrder(order);
        setShowModal(true);
    };

    const handleOpenManageModal = (order) => {
        setSelectedOrder(order);
        setShowManageModal(true);
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        navigate('/');
    };

    // NEW: Function to update individual items (Now correctly scoped inside the component)
    const onUpdateItemStatus = async (orderId, productId, newStatus) => {
    try {
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };

        // 1. Make the API call
        const response = await axios.put(
            `http://localhost:8000/api/order/${orderId}/item/${productId}`, 
            { status: newStatus }, 
            config
        );

        // 2. The backend now returns the UPDATED order object 
        // (including the new itemStatus and the new orderStatus)
        if (response.data) {
            // IMPORTANT: Update the local state so the UI changes immediately
            // This ensures the Modal stays open but shows the new "Confirmed" status
            setSelectedOrder(response.data); 
            
            // Refresh the main list in the background
            fetchOrders(); 

            // Remove the alert() if you want a smoother experience, 
            // the visual change in the UI is enough feedback.
        }
    } catch (error) {
        console.error("Error updating item status:", error);
        alert("Update failed. Please check the console.");
    }
};

    const updateOverallStatus = async (orderId, newStatus) => {
    try {
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };
        
        // This hits your existing endpoint that updates the entire order object
        await axios.put(`http://localhost:8000/api/order/${orderId}/status`, { status: newStatus }, config);
        
        alert(`Order ${orderId.slice(-6)} is now ${newStatus}`);
        fetchOrders(); // Refresh the list
        setShowManageModal(false); // Close modal
    } catch (err) {
        console.error("Update failed", err);
        alert("Could not update the overall order status.");
    }
};

    // 3. INTERNAL COMPONENTS (RENDERS)
    const RenderOverview = () => {
        const [userCount, setUserCount] = useState(0); 
        useEffect(() => { 
            axios.get("http://localhost:8000/api/auth/users/count").then(res => setUserCount(res.data.totalUsers)); 
        }, []);
        
        return (
            <Container fluid>
                <h4 className="fw-bold mb-4 text-dark">Dashboard Summary</h4>
                <Row>
                    <Col md={3} className="mb-4">
                        <Card className="border-0 shadow-sm rounded-4 p-3 stat-card">
                            <div className="d-flex align-items-center">
                                <div className="stat-icon bg-soft-purple text-purple me-3"><FaRupeeSign size={24} /></div>
                                <div>
                                    <small className="text-muted d-block">Total Revenue</small>
                                    <h5 className="fw-bold mb-0">₹{orders.reduce((acc, curr) => acc + curr.totalPrice, 0)}</h5>
                                </div>
                            </div>
                        </Card>
                    </Col>
                    <Col md={3} className="mb-4">
                        <Card className="border-0 shadow-sm rounded-4 p-3 stat-card">
                            <div className="d-flex align-items-center">
                                <div className="stat-icon bg-soft-pink text-pink me-3"><FiShoppingBag size={24} /></div>
                                <div>
                                    <small className="text-muted d-block">Total Orders</small>
                                    <h5 className="fw-bold mb-0">{orders.length}</h5>
                                </div>
                            </div>
                        </Card>
                    </Col>
                    <Col md={3} className="mb-4">
                        <Card className="border-0 shadow-sm rounded-4 p-3 stat-card">
                            <div className="d-flex align-items-center">
                                <div className="stat-icon bg-soft-blue text-blue me-3"><FiUsers size={24} /></div>
                                <div>
                                    <small className="text-muted d-block">Active Users</small>
                                    <h5 className="fw-bold mb-0">{userCount}</h5>
                                </div>
                            </div>
                        </Card>
                    </Col>
                    <Col md={3} className="mb-4">
                        <Card className="border-0 shadow-sm rounded-4 p-3 stat-card">
                            <div className="d-flex align-items-center">
                                <div className="stat-icon bg-soft-orange text-orange me-3"><FiBox size={24} /></div>
                                <div>
                                    <small className="text-muted d-block">Pending Delivery</small>
                                    <h5 className="fw-bold mb-0">{orders.filter(o => o.orderStatus !== 'Delivered').length}</h5>
                                </div>
                            </div>
                        </Card>
                    </Col>
                </Row>
            </Container>
        );
    };

    const OrderDetailsModal = () => {
        if (!selectedOrder) return null;
        const itemsToShow = selectedOrder.items || selectedOrder.orderItems || [];

        return (
            <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
                <Modal.Header closeButton className="border-0 pb-0">
                    <Modal.Title className="fw-bold">Order Details <span className="text-muted fs-6">#{selectedOrder._id.slice(-6).toUpperCase()}</span></Modal.Title>
                </Modal.Header>
                <Modal.Body className="pt-4">
                    <Row>
                        <Col md={7}>
                            <h6 className="fw-bold mb-3 text-purple">Ordered Products</h6>
                            <ListGroup variant="flush" className="border rounded-3">
                                {itemsToShow.map((item, idx) => (
                                    <ListGroup.Item key={idx} className="d-flex align-items-center py-3">
                                        <Image src={item.image} rounded style={{ width: '60px', height: '60px', objectFit: 'contain' }} className="me-3 border p-1" />
                                        <div className="flex-grow-1">
                                            <div className="fw-bold text-dark small">{item.name}</div>
                                            <div className="text-muted extra-small">₹{item.price} x {item.quantity || item.qty}</div>
                                        </div>
                                        <div className="fw-bold text-dark">₹{(item.price * (item.quantity || item.qty))}</div>
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                        </Col>
                        <Col md={5}>
                            <div className="bg-light p-4 rounded-4 h-100">
                                <h6 className="fw-bold mb-3">Customer & Shipping</h6>
                                <p className="small mb-1"><strong>Phone:</strong> {selectedOrder.shippingAddress?.phone}</p>
                                <p className="small"><strong>Address:</strong> {selectedOrder.shippingAddress?.address}</p>
                                <Badge bg={selectedOrder.isPaid ? 'success' : 'danger'}>{selectedOrder.isPaid ? 'PAID' : 'PENDING'}</Badge>
                                <hr />
                                <div className="d-flex justify-content-between align-items-center">
                                    <span className="fw-bold">Total:</span>
                                    <h4 className="fw-bold text-success mb-0">₹{selectedOrder.totalPrice}</h4>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Modal.Body>
            </Modal>
        );
    };

    // THE "MANAGE ORDER" COMPONENT (Now as a Modal for better UX)
   const ManageOrderModal = () => {
    if (!selectedOrder || !selectedOrder.shippingAddress) return null;

    // Check if any item in the order has been confirmed by the admin/seller
    const hasConfirmedItems = selectedOrder.items?.some(item => item.itemStatus === 'Confirmed');
    
    // Check if the overall order is still in processing state
    const isOrderProcessing = selectedOrder.orderStatus === 'Processing';

    return (
        <Modal show={showManageModal} onHide={() => setShowManageModal(false)} size="md" centered>
            <Modal.Header closeButton className="border-0 shadow-sm">
                <Modal.Title className="fw-bold">Order Management</Modal.Title>
            </Modal.Header>
            <Modal.Body className="bg-light">
                
                {/* 1. Main Order Control Card */}
                <Card className="mb-4 border-0 shadow-sm">
                    <Card.Body>
                        <div className="d-flex justify-content-between align-items-start mb-3">
                            <div>
                                <h6 className="mb-1 fw-bold">Order ID: {selectedOrder._id.slice(-6)}</h6>
                                <p className="text-muted small mb-0">Overall Status: 
                                    <span className="ms-2 fw-bold text-primary">{selectedOrder.orderStatus}</span>
                                </p>
                            </div>
                            <Badge bg={selectedOrder.orderStatus === 'Delivered' ? 'success' : 'info'}>
                                {selectedOrder.orderStatus}
                            </Badge>
                        </div>

                        {/* Case: Order is Processing, but some items are confirmed */}
                        {isOrderProcessing && hasConfirmedItems && (
                            <Button
                                variant="success"
                                className="w-100 fw-bold shadow-sm"
                                onClick={() => updateOverallStatus(selectedOrder._id, 'Confirmed')}
                            >
                                Confirm Entire Order & Notify Customer
                            </Button>
                        )}

                        {/* Admin Action: Mark as Delivered after Shipping */}
                        {selectedOrder.orderStatus === 'Shipped' && (
                            <Button
                                variant="dark"
                                className="w-100 fw-bold"
                                onClick={() => updateOverallStatus(selectedOrder._id, 'Delivered')}
                            >
                                Mark as Delivered
                            </Button>
                        )}
                    </Card.Body>
                </Card>

                {/* 2. Individual Items List */}
                <h6 className="mb-3 px-1 fw-bold small text-muted text-uppercase">Product Status Details</h6>
                {selectedOrder.items && selectedOrder.items.map((item, index) => (
                    <Card key={index} className="mb-2 border-0 shadow-sm bg-white">
                        <Card.Body className="d-flex align-items-center justify-content-between py-2">
                            <div className="d-flex align-items-center">
                                <Image src={item.image} width={45} height={45} className="me-3 rounded shadow-sm" />
                                <div>
                                    <div className="fw-bold small" style={{ fontSize: '0.85rem' }}>{item.name}</div>
                                    <div className="extra-small text-muted">Status: 
                                        <span className={`ms-1 ${item.itemStatus === 'Confirmed' ? 'text-success' : 'text-warning'}`}>
                                            {item.itemStatus}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Individual Item Controls: Only show if overall order hasn't moved past Processing */}
                            {isOrderProcessing ? (
                                <div className="d-flex gap-1">
                                    {item.itemStatus === 'Processing' ? (
                                        <>
                                            <Button size="sm" variant="outline-success" className="btn-xs" 
                                                onClick={() => onUpdateItemStatus(selectedOrder._id, item.productId, 'Confirmed')}>
                                                Confirm
                                            </Button>
                                            <Button size="sm" variant="outline-danger" className="btn-xs" 
                                                onClick={() => onUpdateItemStatus(selectedOrder._id, item.productId, 'Cancelled')}>
                                                Cancel
                                            </Button>
                                        </>
                                    ) : (
                                        <Badge bg="light" text="dark" className="border text-uppercase">{item.itemStatus}</Badge>
                                    )}
                                </div>
                            ) : (
                                <Badge bg="light" text="dark" className="border">{item.itemStatus}</Badge>
                            )}
                        </Card.Body>
                    </Card>
                ))}
            </Modal.Body>
        </Modal>
    );
};
    const RenderOrders = () => (
        <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
            <Card.Header className="bg-white py-3 border-0 d-flex justify-content-between align-items-center">
                <h6 className="fw-bold m-0 text-purple"><FiShoppingBag className="me-2"/> Manage All Orders</h6>
                <Badge className="bg-purple-zepto">{orders.length} Total</Badge>
            </Card.Header>
            <Table responsive hover className="mb-0">
                <thead className="bg-light">
                    <tr>
                        <th className="ps-4 text-muted small">ORDER ID</th>
                        <th className="text-muted small">CUSTOMER / ADDRESS</th>
                        <th className="text-muted small">AMOUNT</th>
                        <th className="text-muted small">STATUS</th>
                        <th className="text-muted small text-center">ACTION</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map(order => (
                        <tr key={order._id} style={{ verticalAlign: 'middle' }} onClick={() => handleViewDetails(order)}>
                            <td className="ps-4 small fw-bold">#{order._id.slice(-6).toUpperCase()}</td>
                            <td className="small">
                                <div className="fw-bold">{order.shippingAddress?.phone}</div>
                                <div className="text-muted">{order.shippingAddress?.address}</div>
                            </td>
                            <td className="fw-bold">₹{order.totalPrice}</td>
                            <td>
                                <Badge bg={order.orderStatus === 'Delivered' ? 'success' : order.orderStatus === 'Confirmed' ? 'info' : 'warning'} className="rounded-pill">
                                    {order.orderStatus}
                                </Badge>
                            </td>
                            <td className="text-center" onClick={(e) => e.stopPropagation()}>
                                <Button variant="outline-purple" size="sm" className="rounded-pill px-3 shadow-sm" onClick={() => handleOpenManageModal(order)}>
                                    <FiSettings className="me-1" /> Manage
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Card>
    );

    const RenderTracking = () => (
        <Container fluid>
            <h4 className="fw-bold mb-4">Live Logistics Tracking</h4>
            {orders.map((order) => (
                <Card key={order._id} className="border-0 shadow-sm mb-4 p-4 rounded-4">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <div className="fw-bold fs-5">Order <span className="text-purple">#{order._id.slice(-6).toUpperCase()}</span></div>
                        <Badge className={`p-2 px-3 rounded-pill ${order.orderStatus === 'Delivered' ? 'bg-success' : 'bg-warning'}`}>
                            {order.orderStatus}
                        </Badge>
                    </div>
                    <div className="tracking-wrapper d-flex justify-content-between mt-3">
                        {['Processing', 'Shipped', 'Out for Delivery', 'Delivered'].map((step, idx) => {
                            const isActive = order.orderStatus === step || (idx < 3 && order.orderStatus === 'Delivered');
                            return (
                                <div key={step} className="text-center">
                                    <div className={`step-dot mx-auto mb-2 ${isActive ? 'bg-purple-zepto shadow-glow' : 'bg-light text-muted'}`}>{idx + 1}</div>
                                    <div className={`small fw-bold ${isActive ? 'text-dark' : 'text-muted'}`}>{step}</div>
                                </div>
                            )
                        })}
                    </div>
                </Card>
            ))}
        </Container>
    );

    return (
        <div className="admin-layout">
            <aside className="sidebar-dark shadow">
                <div className="brand-logo p-4"><h2 className="fw-bold m-0">zepto<span className="text-pink">.</span></h2></div>
                <Nav className="flex-column px-3 mt-4">
                    <Nav.Link onClick={() => setActiveTab('overview')} className={`side-link ${activeTab === 'overview' ? 'active' : ''}`}><FiActivity className="icon" /> Overview</Nav.Link>
                    <Nav.Link onClick={() => setActiveTab('approvals')} className={`side-link ${activeTab === 'approvals' ? 'active' : ''}`}><FiCheckSquare className="icon" /> Approvals</Nav.Link>
                    <Nav.Link onClick={() => setActiveTab('orders')} className={`side-link ${activeTab === 'orders' ? 'active' : ''}`}><FiShoppingBag className="icon" /> Orders</Nav.Link>
                    <Nav.Link onClick={() => setActiveTab('track')} className={`side-link ${activeTab === 'track' ? 'active' : ''}`}><FiTruck className="icon" /> Tracking</Nav.Link>
                </Nav>
                <div className="mt-auto p-4 logout-section">
                    <Button variant="link" className="text-muted p-0 text-decoration-none" onClick={handleLogout}><FiLogOut className="me-2"/> Log Out</Button>
                </div>
            </aside>

            <main className="content-area bg-light-zepto">
                <Navbar bg="white" className="px-4 py-3 shadow-sm mb-4 sticky-top">
                    <h5 className="fw-bold m-0 text-capitalize">{activeTab}</h5>
                </Navbar>
                <div className="px-4 pb-5">
                    {activeTab === 'overview' && <RenderOverview />}
                    {activeTab === 'orders' && <RenderOrders />}
                    {activeTab === 'approvals' && <AdminApproval />}
                    {activeTab === 'track' && <RenderTracking />}
                </div>
            </main>
            
            <OrderDetailsModal />
            <ManageOrderModal />
        </div>
    );
};

export default AdminDashboard;