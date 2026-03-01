import React, { useState } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import axios from 'axios';

const SellerAddProduct = () => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        discount: '',
        category: 'beauty',
        image: '' // We will use a URL for now
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const res = await axios.post('http://localhost:8000/api/product/add', formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success) {
                alert("Product submitted! Waiting for Admin approval.");
                // Reset form
            }
        } catch (err) {
            alert(err.response?.data?.message || "Error adding product");
        }
    };

    return (
        <Container className="mt-5 p-4 shadow-sm bg-white rounded">
            <h2 className="mb-4 fw-bold">List New Product</h2>
            <Form onSubmit={handleSubmit}>
                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Product Name</Form.Label>
                            <Form.Control type="text" placeholder="e.g. Arata Hair Serum" 
                            onChange={(e) => setFormData({...formData, name: e.target.value})} required />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Category</Form.Label>
                            <Form.Select onChange={(e) => setFormData({...formData, category: e.target.value})}>
                                <option value="beauty">Beauty</option>
                                <option value="electronics">Electronics</option>
                                <option value="cafe">Cafe</option>
                                <option value="fresh">Fresh</option>
                                <option value="toys">Toys</option>
                                <option value="home">Home</option>
                                <option value="mobiles">Mobiles</option>
                                <option value="mobiles">Fasion</option>
                            </Form.Select>
                        </Form.Group>
                    </Col>
                </Row>

                <Row>
                    <Col md={4}>
                        <Form.Group className="mb-3">
                            <Form.Label>Price (₹)</Form.Label>
                            <Form.Control type="number" onChange={(e) => setFormData({...formData, price: e.target.value})} required />
                        </Form.Group>
                    </Col>
                    <Col md={4}>
                        <Form.Group className="mb-3">
                            <Form.Label>Discount (%)</Form.Label>
                            <Form.Control type="number" onChange={(e) => setFormData({...formData, discount: e.target.value})} />
                        </Form.Group>
                    </Col>
                    <Col md={4}>
                        <Form.Group className="mb-3">
                            <Form.Label>Image URL</Form.Label>
                            <Form.Control type="text" placeholder="Paste image link" 
                            onChange={(e) => setFormData({...formData, image: e.target.value})} required />
                        </Form.Group>
                    </Col>
                </Row>

                <Form.Group className="mb-3">
                    <Form.Label>Description</Form.Label>
                    <Form.Control as="textarea" rows={3} onChange={(e) => setFormData({...formData, description: e.target.value})} required />
                </Form.Group>

                <Button variant="primary" type="submit" className="w-100 py-2 fw-bold" style={{backgroundColor: '#ff3278', border:'none'}}>
                    Submit for Approval
                </Button>
            </Form>
        </Container>
    );
};

export default SellerAddProduct;