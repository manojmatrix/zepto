import ZeptoNavbar from '../components/ZeptoNavbar';
import Footer from '../components/Footer';
import ProductSection from '../components/ProductSection.js';
import {  Row, Col } from 'react-bootstrap';


const Toys = () => {
  

  return (
    <div >
        <div className="container-fluid ">
                <ZeptoNavbar/>
        <Row className="justify-content-center">
          <Col xs={12}>
            <div className="cafe-hero-wrapper">
              <img
                src="https://cdn.zeptonow.com/production/tr:w-1080,ar-1080-540,pr-true,f-auto,q-40,dpr-2/inventory/banner/9043872f-3cc1-4f8f-b049-24b32ad45b10.png"
                alt="Cafe Banner"
                className="cafe-banner-img"
              />
            </div>
          </Col>
        </Row>
                <ProductSection title="Toys"  category="Toys"/>
            </div>
      <Footer />
    </div>
  );
};

export default Toys;