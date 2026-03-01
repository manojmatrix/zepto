import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, ListGroup } from 'react-bootstrap';
import ZeptoNavbar from '../../components/ZeptoNavbar';
import ProductSection from '../../components/ProductSection';
import './CategoryPage.css';

const CategoryPage = () => {
  const { categorySlug } = useParams();
  const [activeSub, setActiveSub] = useState("All");

  // This data would ideally come from your backend or a config file
  const subCategories = [
    { name: "All", icon: "https://cdn.zeptonow.com/production/tr:w-90,ar-120-120,pr-true,f-auto,q-40/cms/sub_category/102e9688-c220-4a0e-bc35-0f0b16de6ad1.png" },
    { name: "Fresh Vegetables", icon: "https://cdn.zeptonow.com/production/tr:w-90,ar-160-161,pr-true,f-auto,q-40/cms/sub_category/694c07e0-542b-49db-a596-b1f4f4935342.png" },
    { name: "New Launches", icon: "https://cdn.zeptonow.com/production/tr:w-90,ar-192-192,pr-true,f-auto,q-40/cms/sub_category/8aeb735f-3e05-4556-8dba-63c890d0fc0a.png" },
    { name: "Fresh Fruits", icon: "https://cdn.zeptonow.com/production/tr:w-90,ar-160-161,pr-true,f-auto,q-40/cms/sub_category/7e51d0f6-ee57-42f3-98f9-945033ad3e5f.png" },
    { name: "Exotics & Premium", icon: "https://cdn.zeptonow.com/production/tr:w-90,ar-480-480,pr-true,f-auto,q-40/cms/sub_category/c82b4bac-d830-46e3-a6d3-ac8934abc9f5.png" },
  ];

  return (
    <div className="category-page-wrapper">
      <ZeptoNavbar showSubNav={false} />
      <Container fluid className="mt-4 px-lg-5">
        <Row>
          {/* Sidebar - Subcategories */}
          <Col md={3} lg={2} className="sidebar-sticky border-end">
            <ListGroup variant="flush">
              {subCategories.map((sub, index) => (
                <ListGroup.Item 
                  key={index}
                  action
                  className={`border-0 d-flex align-items-center py-3 sidebar-item ${activeSub === sub.name ? 'active-sidebar' : ''}`}
                  onClick={() => setActiveSub(sub.name)}
                >
                  <img src={sub.icon} alt={sub.name} className="sidebar-icon me-2" />
                  <span className="sidebar-text">{sub.name}</span>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Col>

          {/* Main Content */}
          <Col md={9} lg={10} className="ps-4">
            <h2 className="fw-bold mb-4 text-capitalize">{activeSub}</h2>
            
            {/* Promo Banners for this category */}
            <div className="d-flex gap-3 mb-4 overflow-hidden">
                <img src="https://cdn.zeptonow.com/production/tr:w-1280,ar-1292-744,pr-true,f-auto,q-40/inventory/banner/f4558bd2-c924-4c41-9acb-09996f5b38ed.png" className="category-banner" alt="promo" />
                <img src="https://cdn.zeptonow.com/production/tr:w-1280,ar-1292-744,pr-true,f-auto,q-40/inventory/banner/cf6dfdbe-e7d0-4047-9a57-7a6a503e6bb9.png" className="category-banner" alt="promo" />
            </div>

            {/* Your Product Section */}
            <ProductSection
              title={activeSub}
              category={activeSub}
              noContainer={true}
            />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default CategoryPage;