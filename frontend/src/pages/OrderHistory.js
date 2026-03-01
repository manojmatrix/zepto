import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ZeptoNavbar from '../components/ZeptoNavbar';
import { Container, Badge, Button, Modal, Form } from 'react-bootstrap';

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // States for Review Modal
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [reviewData, setReviewData] = useState({ rating: 5, comment: '' });

    const fetchOrders = async () => {
        try {
            const token = localStorage.getItem('token');
            const { data } = await axios.get('http://localhost:8000/api/order/my-orders', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setOrders(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchOrders(); }, []);

    // RESTORED: handleCancel function
    const handleCancel = async (orderId) => {
        if (!window.confirm("Are you sure you want to cancel?")) return;
        try {
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:8000/api/order/${orderId}/cancel`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchOrders(); // Refresh list after cancellation
        } catch (err) {
            alert(err.response?.data?.message || "Cancellation failed");
        }
    };

    const handleOpenReview = (product) => {
        setSelectedProduct(product);
        setShowReviewModal(true);
    };

    const submitReview = async () => {
        try {
            const token = localStorage.getItem('token');
            // Using productId._id to ensure we get the string ID if populated
            const pId = selectedProduct.productId._id || selectedProduct.productId;
            
            await axios.post(`http://localhost:8000/api/product/${pId}/review`, reviewData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert("Review submitted successfully!");
            setShowReviewModal(false);
            setReviewData({ rating: 5, comment: '' });
        } catch (err) {
            alert(err.response?.data?.message || "Failed to submit review");
        }
    };

    return (
        <>
            <ZeptoNavbar showSubNav={false} />
            <Container className="py-5">
                <h3 className="fw-bold mb-4">Your Orders</h3>
                {loading ? <p>Loading...</p> : orders.length === 0 ? <p>No orders yet.</p> : (
                    orders.map(order => (
                        <div key={order._id} className="border rounded-4 p-4 mb-4 bg-white shadow-sm">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <div>
                                    <span className="text-muted small">Order ID: #{order._id.slice(-6)}</span>
                                    <div className="fw-bold">{new Date(order.createdAt).toLocaleDateString()}</div>
                                </div>
                                <Badge 
                                    bg={order.orderStatus === 'Cancelled' ? 'danger' : order.orderStatus === 'Delivered' ? 'success' : 'info'} 
                                    className="px-3 py-2"
                                >
                                    {order.orderStatus}
                                </Badge>
                            </div>

                            <hr />
                            {order.items.map((item, index) => (
                                <div key={index} className="d-flex align-items-center mb-3">
                                    <img src={item.image} width="60" alt="" className="rounded border me-3" />
                                    <div className="flex-grow-1">
                                        <div className="fw-bold">{item.name}</div>
                                        <div className="small text-muted">Qty: {item.quantity} | ₹{item.price}</div>
                                    </div>
                                    
                                    {order.orderStatus === 'Delivered' && (
                                        <Button 
                                            variant="outline-primary" 
                                            size="sm" 
                                            className="rounded-pill px-3"
                                            onClick={() => handleOpenReview(item)}
                                        >
                                            Write Review
                                        </Button>
                                    )}
                                </div>
                            ))}
                            <hr />

                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <span className="text-muted">Total Paid: </span>
                                    <span className="fw-bold fs-5">₹{order.totalPrice}</span>
                                </div>
                                <div className="d-flex gap-2">
                                    {/* handleCancel is now defined and will work here */}
                                    {order.orderStatus === 'Processing' && (
                                        <Button variant="outline-danger" size="sm" onClick={() => handleCancel(order._id)}>
                                            Cancel Order
                                        </Button>
                                    )}
                                    
                                    {order.orderStatus !== 'Delivered' && order.orderStatus !== 'Cancelled' && (
                                        <Button variant="info" size="sm" className="text-white" onClick={() => alert(`Tracking Status: ${order.orderStatus}`)}>
                                            Track Order
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </Container>

            {/* Review Modal stays the same */}
            <Modal show={showReviewModal} onHide={() => setShowReviewModal(false)} centered>
    <Modal.Header closeButton className="border-0">
        <Modal.Title className="fw-bold">Review Product</Modal.Title>
    </Modal.Header>
    <Modal.Body>
        {selectedProduct && (
            <div className="d-flex align-items-center mb-4 p-2 bg-light rounded-3">
                <img src={selectedProduct.image} width="50" alt="" className="me-3 rounded" />
                <div className="fw-bold">{selectedProduct.name}</div>
            </div>
        )}
        <Form>
            <Form.Group className="mb-3">
                <Form.Label className="small fw-bold text-muted">Rating</Form.Label>
                <Form.Select 
                    value={reviewData.rating} 
                    onChange={(e) => setReviewData({...reviewData, rating: Number(e.target.value)})}
                >
                    <option value="5">⭐⭐⭐⭐⭐ (Excellent)</option>
                    <option value="4">⭐⭐⭐⭐ (Very Good)</option>
                    <option value="3">⭐⭐⭐ (Good)</option>
                    <option value="2">⭐⭐ (Fair)</option>
                    <option value="1">⭐ (Poor)</option>
                </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label className="small fw-bold text-muted">Comment</Form.Label>
                <Form.Control 
                    as="textarea" 
                    rows={4} 
                    placeholder="What did you like or dislike?"
                    value={reviewData.comment}
                    onChange={(e) => setReviewData({...reviewData, comment: e.target.value})}
                    className="rounded-3"
                />
            </Form.Group>
        </Form>
    </Modal.Body>
    <Modal.Footer className="border-0">
        <Button variant="light" onClick={() => setShowReviewModal(false)} className="fw-bold">
            Cancel
        </Button>
        <Button 
            variant="purple-zepto" 
            onClick={submitReview} 
            disabled={!reviewData.comment}
            className="px-4 fw-bold"
        >
            Submit Review
        </Button>
    </Modal.Footer>
</Modal>
        </>
    );
};

export default OrderHistory;