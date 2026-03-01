import React from 'react';
import ZeptoNavbar from '../components/ZeptoNavbar';
import Footer from '../components/Footer';
import ProductSection from '../components/ProductSection.js';
import { Container, Row, Col } from 'react-bootstrap';


const Cafe = () => {
  return (
    <div className="cafe-page">
      <ZeptoNavbar />
      {/* Main Content Container - Using standard Container for side spacing */}
      <Container className="mt-3">
        
        {/* Banner Section - Wrapped in a row to control size */}
        <Row className="justify-content-center">
          <Col xs={12}>
            <div className="cafe-hero-wrapper">
              <img 
                src="https://cdn.zeptonow.com/production/tr:w-1280,ar-1440-332,pr-true,f-auto,q-40,dpr-2/inventory/banner/2d0edece-4994-4b39-86a9-d6c6ee04a037.png" 
                alt="Cafe Banner" 
                className="cafe-banner-img"
              />
            </div>
          </Col>
        </Row>

        {/* Made to Order Badge */}
        <div className="d-flex justify-content-center my-4">
            <div className="zepto-badge-pill shadow-sm border">
                <div className="badge-content">
                    <img src="https://cdn-icons-png.flaticon.com/512/3063/3063822.png" width="24" alt="chef" />
                    <span>Made to order</span>
                </div>
                <div className="badge-divider"></div>
                <div className="badge-content">
                    <img src="https://cdn-icons-png.flaticon.com/512/1828/1828884.png" width="20" alt="star" />
                    <span>Rated 4.4 by 1M+</span>
                </div>
            </div>
        </div>

        {/* Products */}
        <ProductSection title="Top Picks" category="Cafe" noContainer={true} />
      </Container>

      <Footer />
    </div>
  );
}

export default Cafe;