import React from 'react';
import ZeptoNavbar from '../components/ZeptoNavbar';
import ProductSection from '../components/ProductSection.js';
import Footer from '../components/Footer'; // Ensure you create this component
import { Container, Row, Col } from 'react-bootstrap';


const Electronics = () => {
    return (
        <div className="electronics-page">
            <ZeptoNavbar />
            
            <Container fluid className="px-lg-5 mt-4">
                {/* Super Saver Hero Banner */}
                <Row className="mb-5">
                    <Col xs={12}>
                        <div className="electronics-hero-banner">
                            <div className="hero-content text-center">
                                <h1 className="display-3 fw-black mb-0">SUPER SAVER</h1>
                                <p className="h2 fw-light tracking-widest text-secondary">DEALS</p>
                            </div>
                            {/* Floating decorative elements to match the screenshot */}
                            <div className="bg-decor top-left"></div>
                            <div className="bg-decor bottom-right"></div>
                        </div>
                    </Col>
                </Row>

                {/* Product Section */}
                <div className="electronics-grid-wrapper">
                    <ProductSection 
                        title="Top Deals in Electronics" 
                        category="Electronics"
                    />
                </div>
            </Container>

            {/* Footer added here */}
            <Footer />
        </div>
    );
};

export default Electronics;