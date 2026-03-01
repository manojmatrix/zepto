import React from 'react';
import ZeptoNavbar from '../components/ZeptoNavbar';
import Footer from '../components/Footer';
import ProductSection from '../components/ProductSection.js';
import { Container } from 'react-bootstrap';


const Home = () => {
  // Local data for sub-categories seen in your screenshot
  const subCats = [
    { name: "Home Utility", img: "https://cdn.zeptonow.com/production/tr:w-120,ar-292-472,pr-true,f-auto,q-40/inventory/banner/3a2ffef1-8c9f-46cf-80f4-8b136bddedc8.png" },
    { name: "Bath & Laundry", img: "https://cdn.zeptonow.com/production/tr:w-120,ar-292-472,pr-true,f-auto,q-40/inventory/banner/5aa6d1d9-2e36-4135-8999-49e3965361dd.png" },
    { name: "Pooja & Festive", img: "https://cdn.zeptonow.com/production/tr:w-120,ar-292-472,pr-true,f-auto,q-40/inventory/banner/d9a20d6a-1f9a-4e8b-87fe-0d1e2e27d430.png" },
    { name: "Party Needs", img: "https://cdn.zeptonow.com/production/tr:w-120,ar-292-472,pr-true,f-auto,q-40/inventory/banner/a2508b79-f864-4e12-8b4d-bc995afdee40.png" },
    { name: "Cleaning Aids & Tissues", img: "https://cdn.zeptonow.com/production/tr:w-120,ar-292-472,pr-true,f-auto,q-40/inventory/banner/afdff5a7-874d-48dc-a6ab-ecc8a1a2c994.png" },
    { name: "Automotive Needs", img: "https://cdn.zeptonow.com/production/tr:w-120,ar-292-472,pr-true,f-auto,q-40/inventory/banner/a6c20405-b826-45e6-870b-712dcce9bf5e.png" }
  ];

  return (
    <div className="home-page-layout">
     
      <ZeptoNavbar />

      {/* This Container creates the white space on left and right */}
      <Container className="container-fluid p-0">

        
        <Container fluid className="mt-4 px-lg-5">
          <div className="home-subcategories-scroller">
            <div className="d-flex"> {/* This inner div helps the CSS centering work best */}
              {subCats.map((sub, index) => (
                <div key={index} className="home-sub-item">
                  <div className="home-sub-image-box">
                    <img src={sub.img} alt={sub.name} />
                  </div>
                  <p className="home-sub-label">{sub.name}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>

        {/* Product Section */}
        <div className="container-fluid p-0">
          <ProductSection title="Home Essentials" category="Home" noContainer={true} />
        </div>
        
      </Container>

      <Footer />
    </div>
  );
};

export default Home;