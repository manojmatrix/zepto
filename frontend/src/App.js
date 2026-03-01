import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Mobiles from './pages/Mobiles';
import Cafe from './pages/Cafe';
import Toys from './pages/Toys';
import Beauty from './pages/Beauty';
import All from './pages/All';
import Cart from './pages/Cart';
import Login from './pages/logins/Login';
import Fresh from './pages/Fresh';
import Electronics from './pages/Electronics';
import SellerDashboard from './pages/seller/SellerDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import SellerAddProduct from './pages/seller/SellerAddProduct';
import AdminApproval from './pages/admin/AdminApproval';
import ProductDetails from './components/ProductDetails';
import CategoryPage from './pages/category/CategoryPage';
import SellerRegistration from './pages/logins/SellerRegistration';
import OrderHistory from './pages/OrderHistory';
import AddressesButton from './components/SavedAddresses';

let App=()=> {
  return (
    <BrowserRouter>
      <Routes>
        <Route>
          <Route index element={<All />} />
          <Route path='/All' element={<All />} />
          <Route path='/Cafe' element={<Cafe />} />
          <Route path='/Home' element={<Home />} />
          <Route path='/Toys' element={<Toys />} />
          <Route path='/Fresh' element={<Fresh />} />
          <Route path='/Electronics' element={<Electronics />} />
          <Route path='/Mobiles' element={<Mobiles />} />
          <Route path='/Beauty' element={<Beauty />} />
          <Route path='/Login' element={<Login />} />
          <Route path='/register-seller' element={<SellerRegistration/>}/>
          <Route path='/Cart' element={<Cart />} />
          <Route path="/admin-dashboard" element={
            <ProtectedRoute allowedRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/seller-dashboard" element={
            <ProtectedRoute allowedRole="seller">
              <SellerDashboard />
            </ProtectedRoute>
          } />
          <Route path="/seller/add-product" element={< SellerAddProduct/>} />     
          <Route path="/admin/approvals" element={< AdminApproval/>} /> 
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/order-history" element={<OrderHistory />} />
           <Route path="/AddressesButton" element={<AddressesButton />} />
          <Route path="/category/:categorySlug" element={<CategoryPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
