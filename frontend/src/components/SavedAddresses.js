import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2, Home, Briefcase, Plus } from 'lucide-react';
import { MapPin, ShoppingBag } from 'lucide-react';
const AddressesButton = ({ userId }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // 1. Fetching logic to connect to your backend controller
    useEffect(() => {
        const getAddressData = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem('token'); // Assumes token-based 'protect' middleware
                
                // Hits your router.get('/addresses/:userId', protect, getUserProfile)
                const response = await axios.get(`http://localhost:8000/api/auth/addresses/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                // Your controller returns the FULL user object
                setUser(response.data);
                setLoading(false);
            } catch (err) {
                console.error("Fetch error:", err);
                setError("Failed to load addresses.");
                setLoading(false);
            }
        };

        if (userId) getAddressData();
    }, [userId]);

    // 2. Loading State
    if (loading) return <div className="p-4 text-center">Loading addresses...</div>;

    // 3. Check if addresses array is empty
    const addressList = user?.addresses || [];

    return (
        <div className="saved-addresses-container px-3 py-2">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="fw-bold mb-0">Saved Addresses</h5>
            </div>

            {addressList.length === 0 ? (
                /* Empty State UI */
                <div className="text-center py-5">
                    <div className="mb-3 bg-light rounded-circle d-inline-flex p-4">
                        <Home size={40} className="text-muted opacity-50" />
                    </div>
                    <p className="text-muted fw-bold">No addresses saved yet</p>
                    <p className="small text-muted mb-4">Add an address to enjoy faster checkout</p>
                </div>
            ) : (
                /* Address List UI */
                <div className="address-list">
                    {addressList.map((addr) => (
                        <div key={addr._id} className="address-card p-3 mb-3 border rounded d-flex justify-content-between align-items-center bg-white shadow-sm">
                            <div className="d-flex gap-3">
                                <div className="p-2 bg-light rounded text-purple h-100">
                                    {addr.type === 'Home' ? <Home size={20} /> : <Briefcase size={20} />}
                                </div>
                                <div>
                                    <p className="fw-bold mb-1 text-capitalize">{addr.type || 'Other'}</p>
                                    <p className="small text-muted mb-0">{addr.street}</p>
                                    <p className="small text-muted mb-0">{addr.city}, {addr.pincode}</p>
                                    <p className="small text-muted">Phone: {user.phone}</p> {/* Using phone from user object */}
                                </div>
                            </div>
                            <button className="btn btn-link text-danger p-0 border-0">
                                <Trash2 size={18} />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Add New Address Action */}
            <button className="btn w-100 py-3 d-flex align-items-center justify-content-center gap-2 mt-2 add-address-btn">
                <Plus size={18} />
                <span className="fw-bold">Add New Address</span>
            </button>

            <style jsx>{`
                .text-purple { color: #8224e3; }
                .add-address-btn {
                    background-color: #fcfaff;
                    color: #8224e3;
                    border: 1px dashed #8224e3;
                    border-radius: 12px;
                    transition: all 0.2s;
                }
                .add-address-btn:hover {
                    background-color: #f0e6ff;
                }
                .address-card {
                    border: 1px solid #f1f1f1 !important;
                    transition: 0.2s;
                }
                .address-card:hover {
                    border-color: #8224e3 !important;
                }
            `}</style>
        </div>
    );
};

export default AddressesButton;