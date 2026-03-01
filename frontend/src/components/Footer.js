import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FiInstagram, FiFacebook, FiLinkedin } from 'react-icons/fi';
import { FaXTwitter } from "react-icons/fa6"; // Standard for modern X icon

const Footer = () => {
  const footerSections = [
    {
      title: "Useful Links",
      links: ["Home", "Delivery Areas", "Careers", "Customer Support", "Press", "Mojo - a Zepto Blog"]
    },
    {
      title: "Compliance",
      links: ["Privacy Policy", "Terms of Use", "Responsible Disclosure Policy"]
    },
    {
      title: "Partnerships",
      links: ["Sell on Zepto", "Deliver with Zepto"]
    }
  ];

  return (
    <footer className="bg-white pt-5 pb-4 border-top mt-5">
      <Container>
        {/* Upper Section: Categories (Based on your screenshot) */}
        <div className="mb-5">
          <h6 className="fw-bold mb-4" style={{ fontSize: '18px' }}>Categories</h6>
          <Row className="gy-3">
            <Col md={2} sm={4} xs={6} className="footer-category-list">
              <p>Fruits & Vegetables</p>
              <p>Baby Food</p>
              <p>Breakfast & Sauces</p>
              <p>Cleaning Essentials</p>
            </Col>
            <Col md={2} sm={4} xs={6} className="footer-category-list">
              <p>Atta, Rice, Oil & Dals</p>
              <p>Dairy, Bread & Eggs</p>
              <p>Tea, Coffee & More</p>
              <p>Home Needs</p>
            </Col>
            <Col md={2} sm={4} xs={6} className="footer-category-list">
              <p>Masala & Dry Fruits</p>
              <p>Cold Drinks & Juices</p>
              <p>Biscuits</p>
              <p>Electricals & Accessories</p>
            </Col>
            <Col md={2} sm={4} xs={6} className="footer-category-list">
              <p>Sweet Cravings</p>
              <p>Munchies</p>
              <p>Makeup & Beauty</p>
              <p>Hygiene & Grooming</p>
            </Col>
            <Col md={2} sm={4} xs={6} className="footer-category-list">
              <p>Frozen Food & Ice Creams</p>
              <p>Meats, Fish & Eggs</p>
              <p>Bath & Body</p>
              <p>Health & Baby Care</p>
            </Col>
          </Row>
        </div>

        <hr className="my-5 text-muted opacity-25" />

        {/* Lower Section: Brand & Nav Links */}
        <Row className="gy-4">
          <Col lg={4} md={12}>
            <h2 className="fw-bold mb-3" style={{ color: '#ff503e', fontSize: '32px' }}>zepto</h2>
            <div className="d-flex gap-4 mb-4 text-secondary">
              <FiInstagram size={22} style={{ cursor: 'pointer' }} />
              <FaXTwitter size={22} style={{ cursor: 'pointer' }} />
              <FiFacebook size={22} style={{ cursor: 'pointer' }} />
              <FiLinkedin size={22} style={{ cursor: 'pointer' }} />
            </div>
            <p className="text-muted mb-1" style={{ fontSize: '12px' }}>© Zepto Marketplace Private Limited</p>
            <p className="text-muted" style={{ fontSize: '12px' }}>fssai lic no : 11224999000872</p>
          </Col>

          {footerSections.map((section, idx) => (
            <Col lg={2} md={4} key={idx}>
              <ul className="list-unstyled">
                {section.links.map(link => (
                  <li key={link} className="mb-2 footer-nav-item">{link}</li>
                ))}
              </ul>
            </Col>
          ))}

          <Col lg={2} md={4}>
            <p className="fw-bold small mb-3">Download App</p>
            <div className="d-flex flex-column gap-2">
              <button className="btn btn-outline-dark btn-sm rounded-3 py-2 text-start px-3">
                <small>Get it on Play Store</small>
              </button>
              <button className="btn btn-outline-dark btn-sm rounded-3 py-2 text-start px-3">
                <small>Get it on App Store</small>
              </button>
            </div>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;