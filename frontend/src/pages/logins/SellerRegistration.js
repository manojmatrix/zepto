import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './SellerRegister.css'; 

const SellerRegister = () => {
    const [formData, setFormData] = useState({
        name: '', 
        phone: "",
        email: '', 
        companyName: '', 
        gstNumber: '', 
        companyAddress: ''
    });

    const [otp, setOtp] = useState('');
    const [step, setStep] = useState(1); // 1: Business Details, 2: OTP Verification
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Step 1: Send OTP
    const handleSendOtp = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8000/api/auth/send-otp', { 
                phone: formData.phone 
            });

            if (response.data.success) {
                setStep(2); // Move to OTP input step
                alert("OTP sent to your phone!");
            }
        } catch (err) {
            alert(err.response?.data?.message || "Failed to send OTP.");
        }
    };

    // Step 2: Verify OTP and Save Seller Data
    const handleVerifyAndRegister = async () => {
        try {
            const response = await axios.post('http://localhost:8000/api/auth/verify-otp', {
                phone: formData.phone,
                otp: otp,
                sellerData: formData // This triggers the Seller Logic we added to your backend
            });

            if (response.data.success) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
                alert("Registration Successful! Welcome to the Seller Dashboard.");
                
                // Redirect to dashboard
                navigate("/seller-dashboard", { replace: true });
                window.location.reload(); 
            }
        } catch (err) {
            alert(err.response?.data?.message || "Invalid OTP. Please try again.");
        }
    };

    return (
        <div className="seller-body">
            <div className="registration-card">
                <div className="zepto-logo">ZEPTO <span>SELLER</span></div>
                
                <h2>{step === 1 ? "Grow your business" : "Verify Phone"}</h2>
                <p className="subtitle">
                    {step === 1 ? "Join thousands of partners selling on Zepto." : `Enter the code sent to ${formData.phone}`}
                </p>

                {step === 1 ? (
                    /* STEP 1: REGISTRATION FORM */
                    <form onSubmit={handleSendOtp}>
                        <div className="input-group">
                            <label>Full Name</label>
                            <input type="text" name="name" placeholder="Rahul Sharma" onChange={handleChange} required />
                        </div>

                        <div className="input-group">
                            <label>Phone</label>
                            <input type="text" name="phone" placeholder="+91 00000 00000" onChange={handleChange} required />
                        </div>

                        <div className="input-group">
                            <label>Email (Optional)</label>
                            <input type="email" name="email" placeholder="rahul@business.com" onChange={handleChange} />
                        </div>

                        <div style={{ borderTop: '1px solid #f0f0f0', margin: '20px 0', position: 'relative' }}>
                            <span style={{ position: 'absolute', top: '-10px', left: '50%', transform: 'translateX(-50%)', background: 'white', padding: '0 10px', fontSize: '0.7rem', color: '#ccc' }}>BUSINESS DETAILS</span>
                        </div>

                        <div className="input-group">
                            <label>Company Name</label>
                            <input type="text" name="companyName" placeholder="Legal Entity Name" onChange={handleChange} required />
                        </div>

                        <div className="input-group">
                            <label>GST Number</label>
                            <input type="text" name="gstNumber" placeholder="15-Digit GSTIN" onChange={handleChange} required />
                        </div>

                        <div className="input-group">
                            <label>Business Address</label>
                            <textarea name="companyAddress" rows="2" placeholder="Building, Street, Area..." onChange={handleChange} required />
                        </div>

                        <button type="submit" className="submit-btn">Send OTP to Continue</button>
                    </form>
                ) : (
                    /* STEP 2: OTP VERIFICATION */
                    <div className="otp-section">
                        <div className="input-group">
                            <label>6-Digit OTP</label>
                            <input 
                                type="text" 
                                placeholder="000000" 
                                value={otp} 
                                onChange={(e) => setOtp(e.target.value)} 
                                required 
                            />
                        </div>
                        <button onClick={handleVerifyAndRegister} className="submit-btn">
                            Verify & Complete Registration
                        </button>
                        <button onClick={() => setStep(1)} className="back-link-btn" style={{ background: 'none', border: 'none', color: '#5d3891', marginTop: '10px', cursor: 'pointer', fontSize: '0.8rem' }}>
                            ← Edit Details
                        </button>
                    </div>
                )}

                <p className="footer-text">
                    Already a partner? <Link to="/">Login here</Link>
                </p>
            </div>
        </div>
    );
};

export default SellerRegister;