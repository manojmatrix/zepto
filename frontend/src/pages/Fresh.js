import React, { useState } from 'react';
import ZeptoNavbar from '../components/ZeptoNavbar';
import { Row, Col, Container } from 'react-bootstrap';
import ProductSection from '../components/ProductSection.js';
import Footer from '../components/Footer';

const subCategories = [
  { id: 'fruits', name: 'Fruits', img: 'https://cdn.zeptonow.com/production/tr:w-72,ar-184-184,pr-true,f-auto,,q-40/inventory/banner/3b0e077e-3916-4ab3-9a76-946155407c2c.png' },
  { id: 'veggies', name: 'Veggies', img: 'https://cdn.zeptonow.com/production/tr:w-72,ar-184-184,pr-true,f-auto,,q-40/inventory/banner/f03de577-6673-4c6e-a148-b1045cec3ff7.png' },
  { id: 'new', name: 'New Launches', img: 'https://cdn.zeptonow.com/production/tr:w-72,ar-188-188,pr-true,f-auto,,q-40/inventory/banner/a5f68a7e-264b-4418-85b3-a3ba650922e3.png' },
  { id: 'flowers', name: 'Bouquets & Plants', img: 'https://cdn.zeptonow.com/production/tr:w-72,ar-1000-1060,pr-true,f-auto,,q-40/inventory/banner/f23c332f-5e29-43b7-9c0c-979cd125936c.png' },
  { id: 'eggs', name: 'Eggs', img: 'https://cdn.zeptonow.com/production/tr:w-72,ar-192-192,pr-true,f-auto,,q-40/inventory/banner/36415a3b-b705-4055-8a6b-bd7a6b63dbbf.png' },
];

const Fresh = () => {
  const [activeSub, setActiveSub] = useState('fruits');

  return (
    <div className="fresh-page-wrapper">
      <ZeptoNavbar />
      <Container fluid className="px-lg-5">
        {/* Hero Banner */}

        {/* Sub-Category Navigation */}
        <div className="sub-cat-nav-container mb-5">
          <div className="sub-cat-scroll">
            {subCategories.map((cat) => (
              <div 
                key={cat.id} 
                className={`sub-cat-item ${activeSub === cat.id ? 'active' : ''}`}
                onClick={() => setActiveSub(cat.id)}
              >
                <div className="sub-cat-img-box">
                  <img src={cat.img} alt={cat.name} />
                </div>
                <span className="sub-cat-text">{cat.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Dynamic Product Section */}
        {/* Note: Ensure your ProductSection component can handle sub-categories if needed */}
        <ProductSection title={subCategories.find(c => c.id === activeSub).name} category={activeSub} />
      </Container>
       <Footer />
    </div>
  );
};

export default Fresh;