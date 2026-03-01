import React, { useState } from 'react';
import ZeptoNavbar from '../components/ZeptoNavbar';
import ProductSection from '../components/ProductSection.js';
import Footer from '../components/Footer';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { FiChevronRight } from 'react-icons/fi';


const beautySubCats = [
    { id: 'lipsticks', name: 'Lipsticks', icon: '💄' },
    { id: 'liquid', name: 'Liquid Lipsticks', icon: '👄' },
    { id: 'kajal', name: 'Kajal & Eyeliner', icon: '👁️' },
    { id: 'foundation', name: 'Foundation', icon: '🧴' },
    { id: 'highlighter', name: 'Highlighter', icon: '✨' },
];

function Beauty() {
  const [activeSub, setActiveSub] = useState('lipsticks');

  return (
    <div className="beauty-page">
      <ZeptoNavbar />
      
      <Container fluid className="px-lg-5 mt-4">
        {/* Promotional Banners Grid */}
        <Row className="gy-3 mb-5">
          <Col md={3} sm={6}>
            <div className="promo-card purple-gradient">
              <span className="badge-new">Newly launched</span>
              <h4>Crowd Faves</h4>
              <p>Winter perfumes by FRAGAN2TE</p>
              <Button variant="light" size="sm" className="shop-now">SHOP NOW <FiChevronRight /></Button>
            </div>
          </Col>
          <Col md={3} sm={6}>
            <div className="promo-card yellow-bg">
              <span className="badge-powered">Powered by kindlife</span>
              <h4>Korean Excellence</h4>
            </div>
          </Col>
          <Col md={3} sm={6}>
            <div className="promo-card red-gradient">
              <span className="badge-offer">Up to 60% off</span>
              <h4>Get Luscious Lips</h4>
            </div>
          </Col>
          <Col md={3} sm={6}>
            <div className="promo-card blue-gradient">
              <span className="badge-offer">Up to 50% off</span>
              <h4>Bold</h4>
            </div>
          </Col>
        </Row>

        {/* Top Deal Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold m-0">Top deal</h2>
          <Button variant="outline-danger" className="rounded-pill see-all-btn">
            See All <FiChevronRight />
          </Button>
        </div>

        {/* Sub-Category Icon Navigation */}
        <div className="beauty-nav mb-5">
          {beautySubCats.map(cat => (
            <div 
              key={cat.id} 
              className={`beauty-nav-item ${activeSub === cat.id ? 'active' : ''}`}
              onClick={() => setActiveSub(cat.id)}
            >
              <div className="icon-circle">{cat.icon}</div>
              <span>{cat.name}</span>
            </div>
          ))}
        </div>

        <ProductSection title="" category={activeSub === 'lipsticks' ? 'Beauty' : activeSub}/>
      </Container>

      <Footer />
    </div>
  );
}

export default Beauty;