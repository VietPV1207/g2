import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { UserProvider } from './pages/UserContext';

// Import các trang (pages)
import Login from './pages/Login';
import SellerDashboard from './pages/SellerDashboard';
import StoreProfile from './pages/StoreProfile';
import CreateStore from './pages/CreateStore';
import ProductUpload from './pages/ProductUpload';
import ProductListManagement from './pages/ProductListManagement';
import InventoryManagement from './pages/InventoryManagement';
import VoucherManagement from './pages/VoucherManagement';
import OrderConfirmation from './pages/OrderConfirmation';
import OrderStatusUpdate from './pages/OrderStatusUpdate';
import ProductReviews from './pages/ProductReviews';
import Feedback from './pages/Feedback';
import SalesReport from './pages/SalesReport';
import ComplaintManagement from './pages/ComplaintManagement';
import Homepage from './pages/Homepage';

function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/seller-dashboard" element={<SellerDashboard />} />
          <Route path="/store-profile" element={<StoreProfile />} />
          <Route path="/create-store" element={<CreateStore />} />
          <Route path="/product-upload" element={<ProductUpload />} />
          <Route path="/product-list" element={<ProductListManagement />} />

          {/* ✅ Đã sửa: đường dẫn ngắn hơn, dễ nhớ */}
          <Route path="/inventory" element={<InventoryManagement />} />
          <Route path="/vouchers" element={<VoucherManagement />} />

          <Route path="/order-confirmation" element={<OrderConfirmation />} />
          <Route path="/order-status" element={<OrderStatusUpdate />} />
          <Route path="/product-reviews" element={<ProductReviews />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/sales-report" element={<SalesReport />} />
          <Route path="/complaint-management" element={<ComplaintManagement />} />

          {/* Route fallback */}
          <Route path="*" element={<div>404 - Page not found</div>} />
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;
