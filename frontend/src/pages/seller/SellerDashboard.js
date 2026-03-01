import React, { useEffect, useState, useCallback } from 'react';
import { Row, Col, Container, Table, Badge, Button, Nav, Navbar, Dropdown, Card, Modal, ListGroup, Image } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FiBox, FiPlusCircle, FiLogOut, FiUser, FiShoppingBag, FiTruck } from 'react-icons/fi';
import axios from 'axios';
import './seller.css';

const SellerDashboard = () => {
    const [activeTab, setActiveTab] = useState('inventory');
    const [myProducts, setMyProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    
    // NEW: States for the "View Items" functionality
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const [editingId, setEditingId] = useState(null); 
    const [tempStock, setTempStock] = useState(0);

    const navigate = useNavigate();
    const seller = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };

    const fetchData = useCallback(async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;
            const config = { headers: { Authorization: `Bearer ${token}` } };

            if (activeTab === 'inventory') {
                const res = await axios.get('http://localhost:8000/api/product/seller-products', config);
                setMyProducts(res.data.products || res.data);
            } else {
                const res = await axios.get('http://localhost:8000/api/order/seller-orders', config);
                console.log("Seller Orders Received:", res.data);
                setOrders(Array.isArray(res.data) ? res.data : []);
            }
        } catch (err) {
            console.error("Fetch Error:", err);
            setOrders([]);
        }
    }, [activeTab]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const updateStatus = async (orderId, newStatus) => {
        try {
            await axios.put(`http://localhost:8000/api/order/${orderId}/status`, { status: newStatus }, config);
            fetchData(); 
            alert(`Order marked as ${newStatus}`);
        } catch (err) { alert("Update failed"); }
    };

    const handleStockUpdate = async (productId) => {
    try {
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };
        
        // Ensure your backend has a route to handle partial product updates
        await axios.put(`http://localhost:8000/api/product/${productId}`, { 
            countInStock: tempStock 
        }, config);

        setEditingId(null);
        fetchData(); // Refresh the list to show updated stock
        alert("Stock updated successfully!");
    } catch (err) {
        console.error("Update failed", err);
        alert("Failed to update stock");
    }
};

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    // --- Sub-Components ---

    // NEW: Modal to see item details without showing user address in the table
    const OrderItemsModal = () => {
        if (!selectedOrder) return null;
        return (
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton className="border-0">
                    <Modal.Title className="fw-bold">Order Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ListGroup variant="flush">
                        {selectedOrder.items.map((item, idx) => (
                            <ListGroup.Item key={idx} className="d-flex align-items-center py-3 border-0 bg-light rounded-3 mb-2">
                                <img src={item.image} alt="" style={{ width: '50px', height: '50px', objectFit: 'cover' }} className="me-3 rounded" />
                                <div className="flex-grow-1">
                                    <div className="fw-bold small">{item.name}</div>
                                    <div className="text-muted extra-small">₹{item.price} x {item.quantity || item.qty}</div>
                                </div>
                                <div className="fw-bold">₹{item.price * (item.quantity || item.qty)}</div>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                    <hr />
                    <div className="d-flex justify-content-between px-2">
                        <span className="fw-bold">Your Earnings:</span>
                        <h5 className="fw-bold text-success">₹{selectedOrder.sellerSubtotal || selectedOrder.totalPrice}</h5>
                    </div>
                </Modal.Body>
            </Modal>
        );
    };

    const RenderOrders = () => {
    // Filter: Seller sees orders once Admin has 'Confirmed' them.
    // They can follow the progress through 'Shipped' and 'Delivered'.
    const sellerRelevantOrders = orders.filter(o => 
        ['Confirmed', 'Shipped', 'Delivered'].includes(o.orderStatus)
    );

    return (
        <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
            <Table responsive hover className="mb-0">
                <thead className="bg-light">
                    <tr>
                        <th className="ps-4">ORDER ID</th>
                        <th>ITEMS</th>
                        <th>EARNINGS</th>
                        <th>STATUS</th>
                        <th className="text-center">ACTIONS</th>
                    </tr>
                </thead>
                <tbody>
                    {sellerRelevantOrders.map(order => (
                        <tr key={order._id} style={{ verticalAlign: 'middle' }}>
                            <td className="ps-4 fw-bold">#{order._id.slice(-6).toUpperCase()}</td>
                            <td>
                                <Button 
                                    variant="link" 
                                    className="p-0 text-decoration-none text-purple fw-bold small"
                                    onClick={() => {
                                        setSelectedOrder(order);
                                        setShowModal(true);
                                    }}
                                >
                                    View {order.items?.length} Items
                                </Button>
                            </td>
                            <td className="fw-bold text-success">
                                ₹{order.sellerSubtotal || order.totalPrice}
                            </td>
                            <td>
                                <Badge bg={
                                    order.orderStatus === 'Delivered' ? 'success' : 
                                    order.orderStatus === 'Shipped' ? 'primary' : 'info'
                                }>
                                    {order.orderStatus}
                                </Badge>
                            </td>
                            <td className="text-center">
                                {/* ONLY ACTION: Seller marks as Shipped after Admin confirms */}
                                {order.orderStatus === 'Confirmed' && (
                                    <Button 
                                        variant="primary" 
                                        size="sm" 
                                        className="fw-bold px-3"
                                        onClick={() => updateStatus(order._id, 'Shipped')}
                                    >
                                        Mark Shipped
                                    </Button>
                                )}

                                {/* Once Shipped, Seller has no more buttons. They wait for Admin. */}
                                {order.orderStatus === 'Shipped' && (
                                    <span className="text-primary small fw-bold">
                                        <i className="bi bi-truck me-1"></i> Shipped to Admin
                                    </span>
                                )}

                                {/* Final Status visibility */}
                                {order.orderStatus === 'Delivered' && (
                                    <span className="text-success small fw-bold">
                                        <i className="bi bi-check-circle-fill me-1"></i> Delivered
                                    </span>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Card>
    );
};

    const RenderTracking = () => (
        <Row>
            {orders.filter(o => ['Shipped', 'Delivered'].includes(o.orderStatus)).map(order => (
                <Col md={12} key={order._id} className="mb-3">
                    <Card className="border-0 shadow-sm p-3">
                        <div className="d-flex justify-content-between">
                            <h6>Order #{order._id.slice(-6).toUpperCase()}</h6>
                            <Badge bg={order.orderStatus === 'Delivered' ? 'success' : 'primary'}>
                                {order.orderStatus}
                            </Badge>
                        </div>
                        <div className="mt-2 small text-muted">Customer Address: {order.shippingAddress?.address}</div>
                        {order.orderStatus === 'Shipped' && (
                            <Button size="sm" variant="success" className="mt-3 w-25" onClick={() => updateStatus(order._id, 'Delivered')}>
                                Mark as Delivered
                            </Button>
                        )}
                    </Card>
                </Col>
            ))}
        </Row>
    );

    return (
        <div className="seller-wrapper">
            <div className="seller-sidebar shadow">
                <div className="sidebar-logo">zepto <span>seller</span></div>
                <Nav className="flex-column mt-4 px-2">
                    <Nav.Link onClick={() => setActiveTab('inventory')} className={activeTab === 'inventory' ? 'active' : ''}>
                        <FiBox className="me-2" /> Inventory
                    </Nav.Link>
                    <Nav.Link onClick={() => setActiveTab('orders')} className={activeTab === 'orders' ? 'active' : ''}>
                        <FiShoppingBag className="me-2" /> Orders
                    </Nav.Link>
                    <Nav.Link onClick={() => setActiveTab('tracking')} className={activeTab === 'tracking' ? 'active' : ''}>
                        <FiTruck className="me-2" /> Tracking
                    </Nav.Link>
                </Nav>
            </div>

            <div className="seller-content">
                <Navbar bg="white" className="px-4 py-3 shadow-sm mb-4 justify-content-between">
                    <h5 className="fw-bold m-0 text-capitalize">{activeTab}</h5>
                    <Dropdown align="end">
                        <Dropdown.Toggle variant="light" className="border-0 bg-transparent">
                            <FiUser className="me-2" /> <strong>{seller?.name}</strong>
                        </Dropdown.Toggle>
                        <Dropdown.Menu className="shadow border-0">
                            <Dropdown.Item onClick={handleLogout} className="text-danger"><FiLogOut className="me-2" /> Logout</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </Navbar>

                <Container fluid>
                    {activeTab === 'inventory' && (
                        <>
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <p className="text-muted">Manage your product listings</p>
                                <Button className="zepto-btn-main" onClick={() => navigate('/seller/add-product')}>
                                    <FiPlusCircle className="me-2" /> Add New Product
                                </Button>
                            </div>
                            <Table responsive className="inventory-table bg-white">
                                <thead>
                                    <tr>
                                        <th>Product Details</th>
                                        <th>Category</th>
                                        <th>Stock Count</th>
                                        <th>Price</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Array.isArray(myProducts) && myProducts.length > 0 ? (
                                        myProducts.map(product => (
                                            <tr key={product._id}>
                                                <td>
                                                    <div className="d-flex align-items-center">
                                                        <img src={product.image} alt={product.name} className="table-img me-3" style={{width: '50px'}} />
                                                        <span className="fw-bold">{product.name}</span>
                                                    </div>
                                                </td>
                                                <td className="text-capitalize">{product.category}</td>
                                                <td>
                                                    {editingId === product._id ? (
                                                        <div className="d-flex align-items-center gap-2">
                                                            <input
                                                                type="number"
                                                                className="form-control form-control-sm"
                                                                style={{ width: '80px' }}
                                                                value={tempStock}
                                                                onChange={(e) => setTempStock(e.target.value)}
                                                                min="0"
                                                            />
                                                            <Button
                                                                variant="success"
                                                                size="sm"
                                                                onClick={() => handleStockUpdate(product._id)}
                                                            >
                                                                Save
                                                            </Button>
                                                            <Button
                                                                variant="light"
                                                                size="sm"
                                                                onClick={() => setEditingId(null)}
                                                            >
                                                                ✕
                                                            </Button>
                                                        </div>
                                                    ) : (
                                                        <div className="d-flex align-items-center justify-content-between">
                                                            <div>
                                                                <span className={`fw-bold ${product.countInStock <= 5 ? 'text-danger' : 'text-dark'}`}>
                                                                    {product.countInStock} units
                                                                </span>
                                                                {product.countInStock <= 5 && product.countInStock > 0 &&
                                                                    <Badge bg="warning" text="dark" className="ms-2">Low</Badge>
                                                                }
                                                                {product.countInStock === 0 &&
                                                                    <Badge bg="danger" className="ms-2">Sold Out</Badge>
                                                                }
                                                            </div>
                                                            <Button
                                                                variant="link"
                                                                className="p-0 ms-3 text-muted"
                                                                onClick={() => {
                                                                    setEditingId(product._id);
                                                                    setTempStock(product.countInStock);
                                                                }}
                                                            >
                                                                <i className="bi bi-pencil-square"></i> Edit
                                                            </Button>
                                                        </div>
                                                    )}
                                                </td>
                                                <td>₹{product.price}</td>
                                                <td>
                                                    <Badge bg={product.status === 'Approved' ? 'success' : 'warning'}>
                                                        {product.status}
                                                    </Badge>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr><td colSpan="4" className="text-center p-4">No products found.</td></tr>
                                    )}
                                </tbody>
                            </Table>
                        </>
                    )}
                    {activeTab === 'orders' && <RenderOrders />}
                    {activeTab === 'tracking' && <RenderTracking />}
                </Container>
                
                {/* IMPORTANT: Render the modal here */}
                <OrderItemsModal />
            </div>
        </div>
    );
};

export default SellerDashboard;