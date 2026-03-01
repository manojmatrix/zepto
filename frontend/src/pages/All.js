import React from 'react';
import BannerCarousel from '../components/BannerCarousel';
import CategoryCircle from '../components/CategoryCircle.js';
import ZeptoNavbar from '../components/ZeptoNavbar';
import Footer from '../components/Footer';
import ProductSection from '../components/ProductSection.js';

const All = () => {

  const promoBanners = [
  {
    id: 1,
    image: "https://cdn.zeptonow.com/production/tr:w-1280,ar-2496-1192,pr-true,f-auto,q-40/inventory/banner/fa17c2e0-1e2f-492f-bd27-744ead4621b8.png",
    alt: "Get Cigarettes at 0 convenience fee",
  },
  {
    id: 2,
    image: "https://cdn.zeptonow.com/production/tr:w-1280,ar-2496-1192,pr-true,f-auto,q-40/inventory/banner/fa17c2e0-1e2f-492f-bd27-744ead4621b8.png",
    alt: "New Zepto Experience 0 Fees",
  }
];
  return (
    <div className="container-fluid p-0">
      <ZeptoNavbar  />


      <div className="mt-1 pt-3">
        <CategoryCircle />
      </div>

      <BannerCarousel banners={promoBanners} />
      <ProductSection title="All" category="All" />
      <Footer />
    </div>
  );
}

export default All;