import React, { useEffect, useState } from 'react';
import { Container, Table, Button, Badge } from 'react-bootstrap';
import axios from 'axios';
import { FiCheck, FiX} from 'react-icons/fi';

const AdminApproval = () => {
    const [pendingProducts, setPendingProducts] = useState([]);

    const fetchPending = async () => {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:8000/api/product/admin/pending', {
            headers: { Authorization: `Bearer ${token}` }
        });
        setPendingProducts(res.data.products);
    };

    useEffect(() => { fetchPending(); }, []);

    const handleAction = async (productId, status) => {
        try {
            const token = localStorage.getItem('token');
            await axios.patch('http://localhost:8000/api/product/admin/update-status', 
                { productId, status },
                { headers: { Authorization: `Bearer ${token}` }}
            );
            alert(`Product ${status}!`);
            fetchPending(); // Refresh list
        } catch (err) {
            alert("Action failed");
        }
    };

    return (
        <Container fluid className="p-4">
            <h3 className="fw-bold mb-4" style={{color: '#3e0090'}}>Approval Queue</h3>
            <div className="bg-white shadow-sm rounded p-3">
                <Table responsive hover>
                    <thead className="bg-light">
                        <tr>
                            <th>Product</th>
                            <th>Seller</th>
                            <th>Price</th>
                            <th>Category</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pendingProducts.map(p => (
                            <tr key={p._id}>
                                <td>
                                    <div className="d-flex align-items-center">
                                        <img src={p.image} width="40" className="rounded me-2" alt="" />
                                        <div>
                                            <div className="fw-bold">{p.name}</div>
                                            <small className="text-muted">ID: {p._id.substring(0,8)}</small>
                                        </div>
                                    </div>
                                </td>
                                <td>{p.seller?.name} <br/> <small>{p.seller?.email}</small></td>
                                <td>₹{p.price}</td>
                                <td><Badge bg="info">{p.category}</Badge></td>
                                <td>
                                    <Button variant="success" size="sm" className="me-2" onClick={() => handleAction(p._id, 'approved')}>
                                        <FiCheck /> Approve
                                    </Button>
                                    <Button variant="danger" size="sm" onClick={() => handleAction(p._id, 'rejected')}>
                                        <FiX /> Reject
                                    </Button>
                                </td>
                            </tr>
                        ))}
                        {pendingProducts.length === 0 && <tr><td colSpan="5" className="text-center p-5 text-muted">No pending approvals! 🚀</td></tr>}
                    </tbody>
                </Table>
            </div>
        </Container>
    );
};

export default AdminApproval;