import React, { useState } from 'react';
import ZeptoNavbar from '../components/ZeptoNavbar';
import ProductSection from '../components/ProductSection.js';
import Footer from '../components/Footer';
import { Container } from 'react-bootstrap';


const mobileSubCats = [
    { id: 'feature', name: 'Feature Phones', img: 'https://cdn.zeptonow.com/production/tr:w-120,ar-312-352,pr-true,f-auto,,q-40/inventory/banner/6cbbb321-a724-48aa-8d52-e3cac91bc8c5.png' },
    { id: 'smart', name: 'Smart Phones', img: 'https://cdn.zeptonow.com/production/tr:w-120,ar-312-352,pr-true,f-auto,,q-40/inventory/banner/64c94efb-8e92-4a36-a965-6456f1bee99f.png' },
    { id: 'acc', name: 'Mobile Accessories', img: 'https://cdn.zeptonow.com/production/tr:w-120,ar-312-352,pr-true,f-auto,,q-40/inventory/banner/ba41e6b8-862f-4c91-9674-cda4789d86d0.png' },
    { id: 'tablets', name: 'Tablets', img: 'https://cdn.zeptonow.com/production/tr:w-120,ar-312-352,pr-true,f-auto,,q-40/inventory/banner/8eab8b9e-36b9-4116-9584-516be9817fa4.png' },
];

const Mobiles = () => {
    const [activeSub, setActiveSub] = useState('smart');

    return (
        <div className="mobiles-page">
            <ZeptoNavbar />
            
            <Container fluid className="px-lg-5">
                {/* Dark Sub-Category Header */}
                <div className="mobile-header-black my-4">
                    <div className="mobile-nav-pills">
                        {mobileSubCats.map((cat) => (
                            <div 
                                key={cat.id} 
                                className={`mobile-pill ${activeSub === cat.id ? 'active' : ''}`}
                                onClick={() => setActiveSub(cat.id)}
                            >
                                <div className="pill-img-wrap">
                                    <img src={cat.img} alt={cat.name} />
                                </div>
                                <span>{cat.name}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Section Title */}
                <div className="section-heading-wrap mb-4">
                    <p className="text-uppercase text-muted small fw-bold mb-0">JUST DROPPED</p>
                    <h2 className="fw-bold">Smartphones & feature phones</h2>
                </div>

                {/* Product Grid */}
                <ProductSection 
                    title="" 
                    category={activeSub === 'smart' ? 'Mobiles' : activeSub} 
                />
            </Container>

            <Footer />
        </div>
    );
};

export default Mobiles;