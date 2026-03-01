import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import './Login.css';
import { Link } from 'react-router-dom';

const Login = ({ show, handleClose }) => {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [name, setName] = useState('');
    const [step, setStep] = useState(1); 

    const navigate = useNavigate();

    const redirectByRole = (user) => {
        if (user.role === "admin") { navigate("/admin-dashboard", { replace: true }); }
        else if (user.role === "seller") { navigate("/seller-dashboard", { replace: true }); }
        else { navigate("/", { replace: true }); }
        setTimeout(() => { window.location.reload(); }, 100);
    };
    
    if (!show) return null;

    const handleAuthAction = async () => {
        try {
            if (step === 1) {
                const res = await axios.post('http://localhost:8000/api/auth/send-otp', { contact: email});
                if (res.data.success) setStep(2);
            } else if (step === 2) {
                const res = await axios.post('http://localhost:8000/api/auth/verify-otp', {contact: email, otp });
                if (res.data.success) {
                    if (res.data.isNewUser) { setStep(3); } 
                    else {
                        localStorage.setItem('token', res.data.token);
                        localStorage.setItem('user', JSON.stringify(res.data.user));
                        handleClose();
                        redirectByRole(res.data.user);
                    }
                }
            }
        } catch (err) { alert(err.response?.data?.message || "Something went wrong."); }
    };

    const handleSaveName = async () => {
        try {
            const res = await axios.post('http://localhost:8000/api/auth/save-name', {email, name });
            if (res.data.success) {
                localStorage.setItem('token', res.data.token);
                localStorage.setItem('user', JSON.stringify(res.data.user));
                handleClose();
                redirectByRole(res.data.user);
            }
        } catch (err) { alert("Error saving name."); }
    };

    return (
        <div className="modal-overlay" onClick={handleClose}>
            <div className="zepto-login-container" onClick={(e) => e.stopPropagation()}>
                <button className="close-x-btn" onClick={handleClose}>×</button>

                {/* LEFT SIDE: THE FORM (PURPLE) */}
                <div className="login-left-purple">
                    <div className="brand-section">
                        <h1 className="zepto-logo">zepto</h1>
                        <h2 className="tagline">Lowest Prices Everyday <br/><span>in 10 minutes*</span></h2>
                    </div>

                    <div className="auth-form-wrapper">
                        {step === 1 && (
                            <div className="zepto-input-box">
                                <span className="country-code">+91</span>
                                <input 
                                    type="email" 
                                    placeholder="Enter Email Address" 
                                    value={email} 
                                   onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        )}

                        {step === 2 && (
                            <div className="zepto-input-box">
                                <input 
                                    type="text" 
                                    placeholder="Enter 6-digit OTP" 
                                    value={otp} 
                                    onChange={(e) => setOtp(e.target.value)} 
                                />
                            </div>
                        )}

                        {step === 3 && (
                            <div className="zepto-input-box">
                                <input 
                                    type="text" 
                                    placeholder="Enter your full name" 
                                    value={name} 
                                    onChange={(e) => setName(e.target.value)} 
                                />
                            </div>
                        )}

                        <button 
                            className="zepto-continue-btn" 
                            onClick={step === 3 ? handleSaveName : handleAuthAction}
                        >
                            {step === 1 && "Continue"}
                            {step === 2 && "Verify OTP"}
                            {step === 3 && "Complete Registration"}
                        </button>
                    </div>

                    <div className="login-footer-text">
                        By continuing, you agree to our <br />
                        {/* Replaced # with button to fix ESLint Warning */}
                        <button className="btn btn-link p-0 text-white text-decoration-underline small border-0 shadow-none">Terms of Service</button>
                        &
                        <button className="btn btn-link p-0 text-white text-decoration-underline small border-0 shadow-none ms-1">Privacy Policy</button>
                    </div>
                </div>

                {/* RIGHT SIDE: THE PROMO (WHITE) */}
                <div className="login-right-white">
                    <div className="promo-content">
                        <img src="https://cdn.zeptonow.com/web-static-assets-prod/artifacts/14.9.0/tr:w-100,ar-100-100,pr-true,f-auto,q-40/images/get-the-app/get-the-app-phone.png" alt="Promo" className="promo-img" />
                        <h3>Order faster & easier everytime</h3>
                        <p>with the Zepto App</p>
                        
                        <div className="store-badges">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Play Store" />
                            <img src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg" alt="App Store" />
                        </div>
                    </div>
                    
                    <Link to="/register-seller" className="seller-link">
                        Want to become a seller? Register here
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Login;