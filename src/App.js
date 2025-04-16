import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';


import { UserProvider } from './pages/UserContext';

// Import layout seller
import SellerLayout from './pages/layout/SellerLayout';

// Import các trang (pages)
import Login from './pages/Login';
import Homepage from './pages/Homepage';
import SellerDashboard from './pages/SellerDashboard';
import StoreProfile from './pages/StoreProfile';
import CreateStore from './pages/CreateStore';
import ProductUpload from './pages/ProductUpload';
import ProductListManagement from './pages/ProductListManagement';
import InventoryManagement from './pages/InventoryManagement';

// Import các trang voucher
import VoucherList from './pages/voucher/VoucherList';
import OrderConfirmation from './pages/OrderConfirmation';
import OrderStatusUpdate from './pages/OrderStatusUpdate';
import ProductReviews from './pages/ProductReviews';
import Feedback from './pages/Feedback';
import SalesReport from './pages/SalesReport';
import ComplaintManagement from './pages/ComplaintManagement';

function App() {
  // Kiểm tra xem người dùng đã đăng nhập chưa
  const isAuthenticated = () => {
    return localStorage.getItem('user') !== null;
  };

  // Component bảo vệ route yêu cầu đăng nhập
  const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated()) {
      return <Navigate to="/login" replace />;
    }
    return children;
  };

  return (
    <UserProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Homepage />} />
          <Route 
            path="/login" 
            element={
              isAuthenticated() ? 
                <Navigate to="/voucher-management" replace /> : 
                <Login />
            } 
          />

          {/* Protected routes với SellerLayout */}
          <Route path="/" element={
            <ProtectedRoute>
              <SellerLayout />
            </ProtectedRoute>
          }>
            {/* Dashboard và quản lý cửa hàng */}
            <Route path="seller-dashboard" element={<SellerDashboard />} />
            <Route path="store-profile" element={<StoreProfile />} />
            <Route path="create-store" element={<CreateStore />} />

            {/* Quản lý sản phẩm */}
            <Route path="product-upload" element={<ProductUpload />} />
            <Route path="product-list" element={<ProductListManagement />} />

            {/* Quản lý tồn kho */}
            <Route path="inventory-management" element={<InventoryManagement />} />

            {/* Quản lý voucher/khuyến mãi */}
            <Route path="voucher-management" element={<VoucherList />} />
            {/* Quản lý đơn hàng */}
            <Route path="order-confirmation" element={<OrderConfirmation />} />
            <Route path="order-status" element={<OrderStatusUpdate />} />

            {/* Phản hồi & đánh giá */}
            <Route path="product-reviews" element={<ProductReviews />} />
            <Route path="feedback" element={<Feedback />} />

            {/* Báo cáo doanh số */}
            <Route path="sales-report" element={<SalesReport />} />

            {/* Quản lý khiếu nại */}
            <Route path="complaint-management" element={<ComplaintManagement />} />
          </Route>

          {/* Fallback route - nếu không tìm thấy route nào khớp */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;
