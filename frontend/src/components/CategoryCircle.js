import React, { useRef } from 'react';
import { Container } from 'react-bootstrap';
import { FiChevronRight, FiChevronLeft } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import './components.css';

const categories = [
  { id: 1, name: "Fruits & Vegetables", img: "https://cdn.zeptonow.com/production/cms/category/38047553-95f3-47c6-a1ff-4794e1227d3a.png?tr=f-webp" },
  { id: 2, name: "Dairy, Bread & Eggs", img: "https://cdn.zeptonow.com/production/cms/category/474e6e58-1894-4378-86f1-168cc7266d1a.png?tr=f-webp" },
  { id: 3, name: "Atta, Rice, Oil & Dals", img: "https://cdn.zeptonow.com/production/cms/category/dc4a299d-521f-4a64-8205-c5ba8e1d13e3.png?tr=f-webp" },
  { id: 4, name: "Meat, Fish & Eggs", img: "https://cdn.zeptonow.com/production/cms/category/1237afd6-40bf-4942-a266-25f23025e86c.png?tr=f-webp" },
  { id: 5, name: "Masala & Dry Fruits", img: "https://cdn.zeptonow.com/production/cms/category/8d4d3977-5197-49d9-9867-8a670524e48b.png?tr=f-webp" },
  { id: 6, name: "Breakfast & Sauces", img: "https://cdn.zeptonow.com/production/cms/category/ab241d87-da5b-4830-b38f-1a6cd30d0d41.png?tr=f-webp" },
  { id: 7, name: "Packaged Food", img: "https://cdn.zeptonow.com/production/cms/category/3b0ce887-3b38-4450-b7da-9da0ad8b799d.png?tr=f-webp" },
  { id: 8, name: "Zepto Cafe", img: "https://cdn.zeptonow.com/production/cms/category/031c2a24-d40f-4272-8c71-8a566252495e.png?tr=f-webp" },
  { id: 9, name: "Tea, Coffee & More", img: "https://cdn.zeptonow.com/production/cms/category/f078a8dc-a9b6-41a6-9c6f-721d4892b8ee.png?tr=f-webp" },
  { id: 10, name: "Ice Creams & More", img: "https://cdn.zeptonow.com/production/cms/category/db346f5e-644f-426a-85af-92d707e086ac.png?tr=f-webp" },
  { id: 11, name: "Frozen Food", img: "https://cdn.zeptonow.com/production/cms/category/366e5b7d-2028-4935-b9f1-75bfa085c3d7.png?tr=f-webp" },
];

const CategoryCircle = () => {
  const scrollRef = useRef(null);
  const navigate = useNavigate();

  const scroll = (direction) => {
    const { current } = scrollRef;
    const scrollAmount = 600; // Increased for bigger items
    if (direction === 'left') {
      current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    } else {
      current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleCategoryClick = (name) => {
    const slug = name.toLowerCase().replace(/&/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');
    navigate(`/category/${slug}`);
  };

  return (
    <Container className="my-4 position-relative px-0">
      <div className="category-scroll-container" ref={scrollRef}>
        <div className="category-inner-flex">
          {categories.map((cat) => (
            <div 
              key={cat.id} 
              className="category-item-wrapper"
              onClick={() => handleCategoryClick(cat.name)}
            >
              <div className="zepto-img-box">
                <img src={cat.img} alt={cat.name} loading="lazy" />
              </div>
              <p className="zepto-cat-name-v2">{cat.name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* <button className="scroll-arrow-btn prev shadow-sm" onClick={() => scroll('left')}>
        <FiChevronLeft size={20} />
      </button>
      <button className="scroll-arrow-btn next shadow-sm" onClick={() => scroll('right')}>
        <FiChevronRight size={20} />
      </button> */}
    </Container>
  );
};

export default CategoryCircle;