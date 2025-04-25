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
import ProductListManagement from './pages/ProductListManagement';
import InventoryManagement from './pages/inventory/InventoryManagement';

// Import các trang voucher
import VoucherList from './pages/voucher/VoucherList';
import OrderConfirmation from './pages/OrderConfirmation';
import Feedback from './pages/Feedback';
import SalesReport from './pages/SalesReport';

// Import user pages
import ChangePassword from './pages/user/ChangePassword';
import EditProfile from './pages/user/EditProfile';
import SignUp from './pages/user/SignUp';
import UpdateProfileImage from './pages/user/UpdateProfileImage';
import UserProfile from './pages/user/UserProfile';
import { Navbar } from 'react-bootstrap';

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
            <Route path="product-list" element={<ProductListManagement />} />

            {/* Quản lý tồn kho */}
            <Route path="inventory-management" element={<InventoryManagement />} />

            {/* Quản lý voucher/khuyến mãi */}
            <Route path="voucher-management" element={<VoucherList />} />
            {/* Quản lý đơn hàng */}
            <Route path="order-confirmation" element={<OrderConfirmation />} />

            {/* Phản hồi & đánh giá */}
            <Route path="feedback" element={<Feedback />} />

            {/* Báo cáo doanh số */}
            <Route path="sales-report" element={<SalesReport />} />


          </Route>
          {/* User-related routes */}
          <Route path="user-profile" element={<UserProfile />} />
          <Route path="edit-profile" element={<EditProfile />} />
          <Route path="sign-up" element={<SignUp />} />
          <Route path="update-imgage" element={<UpdateProfileImage />} />
          <Route path="change-password" element={<ChangePassword />} />
          {/* Fallback route - nếu không tìm thấy route nào khớp */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;
