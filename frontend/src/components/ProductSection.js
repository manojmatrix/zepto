import React, { useEffect, useState } from 'react';
import ProductCard from './ProductCard';
import { Container } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ProductSection = ({ title, category, noContainer }) => { 
  const [productsData, setProductsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/product/approved');
        const allProducts = response.data.products || [];

        if (category && category !== "All") {
          const filtered = allProducts.filter(p => 
            p.category?.toLowerCase() === category.toLowerCase()
          );
          setProductsData(filtered);
        } else {
          setProductsData(allProducts);
        }
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [category]);

  if (loading) return <div className="p-5 text-center">Loading products...</div>;

  // 1. Define the content first so it can be reused
  const mainContent = (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold">{title}</h4>
        {!noContainer && ( // Only show "See All" on the Home page, not the Subcategory page
          <button 
            className="btn text-danger fw-bold border-0" 
            onClick={() => navigate(`/category/${category?.toLowerCase() || 'all'}`)}
          >
            See All &gt;
          </button>
        )}
      </div>
      
      <div className="d-flex flex-wrap gap-3">
        {productsData.length > 0 ? (
          productsData.map((item) => (
            <ProductCard key={item._id} product={item} />
          ))
        ) : (
          <p className="text-muted">No products found in {title}.</p>
        )}
      </div>
    </>
  );

  // 2. Decide whether to wrap it in a Bootstrap Container or not
  return noContainer ? (
    <div className="py-3">{mainContent}</div>
  ) : (
    <Container className="my-5">{mainContent}</Container>
  );
};

export default ProductSection;