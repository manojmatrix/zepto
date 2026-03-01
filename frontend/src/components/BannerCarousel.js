import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import { Container } from 'react-bootstrap';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import './components.css';

const BannerCarousel = ({ banners }) => {
  return (
    <Container fluid className="px-lg-5 my-4">
      <Swiper
        modules={[Autoplay, Pagination]}
        spaceBetween={20}
        slidesPerView={1} // Default for mobile
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        breakpoints={{
          // When window width is >= 992px (Desktop)
          992: {
            slidesPerView: 2,
          }
        }}
        className="promo-swiper"
      >
        {banners.map((banner) => (
          <SwiperSlide key={banner.id}>
            <div className="banner-card">
              <img 
                src={banner.image} 
                alt={banner.alt} 
                className="img-fluid rounded-4 shadow-sm" 
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </Container>
  );
};

export default BannerCarousel;