// src/components/layout/SellerLayout.jsx
import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import './SellerLayout.css';

const SellerLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  // Xử lý đăng xuất
  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem('user');
    navigate('/login');
  };

  // Danh sách menu sidebar cho người bán
  const menuItems = [
    { path: '/seller-dashboard', icon: '📊', label: 'Tổng quan' },
    { path: '/product-list', icon: '📦', label: 'Quản lý sản phẩm' },
    { path: '/order-confirmation', icon: '🛒', label: 'Quản lý đơn hàng' },
    { path: '/voucher-management', icon: '🏷️', label: 'Quản lý voucher' },
    { path: '/inventory-management', icon: '📋', label: 'Quản lý kho hàng' },
    { path: '/feedback', icon: '⭐', label: 'Đánh giá sản phẩm' },
    { path: '/sales-report', icon: '📈', label: 'Báo cáo doanh số' },
    { path: '/store-profile', icon: '🏪', label: 'Hồ sơ cửa hàng' },
    { path: '/', icon: '🏠', label: 'Về trang chủ' },
    { path: '#', icon: '🚪', label: 'Đăng xuất', onClick: handleLogout }
  ];

  // Xác định tiêu đề trang dựa vào path hiện tại
  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes('seller-dashboard')) return 'Tổng quan';
    if (path.includes('product-list')) return 'Quản lý sản phẩm';
    if (path.includes('order-confirmation')) return 'Quản lý đơn hàng';
    if (path.startsWith('/voucher-management')) {
      if (path.includes('/create')) return 'Tạo Voucher mới';
      if (path.includes('/edit')) return 'Chỉnh sửa Voucher';
      if (path.includes('/apply')) return 'Áp dụng Voucher';
      return 'Quản lý Voucher';
    }
    if (path.includes('inventory-management')) return 'Quản lý kho hàng';
    if (path.includes('feedback')) return 'Đánh giá sản phẩm';
    if (path.includes('sales-report')) return 'Báo cáo doanh số';
    if (path.includes('store-profile')) return 'Hồ sơ cửa hàng';
    return 'Kênh người bán';
  };

  // Hiển thị nút thêm mới phù hợp với từng trang
  const renderActionButton = () => {
    const path = location.pathname;
    
    
    if (path === '/product-list') {
      return (
        <Link to="/product-upload" className="add-button">
          <i className="fa fa-plus"></i> Thêm sản phẩm
        </Link>
      );
    }
    
    return null;
  };

  return (
    <div className="seller-layout">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">
          <h2>Kênh người bán</h2>
        </div>
        <div className="sidebar-menu">
          {menuItems.map((item, index) => (
            <Link
              key={index}
              to={item.onClick ? '#' : item.path}
              className={`sidebar-item ${
                location.pathname === item.path || 
                (item.path === '/voucher-management' && location.pathname.startsWith('/voucher-management'))
                ? 'active' : ''
              }`}
              onClick={item.onClick ? item.onClick : undefined}
            >
              <span className="sidebar-icon">{item.icon}</span>
              <span className="sidebar-label">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div className="main-content">
        <div className="header">
          <h1>{getPageTitle()}</h1>
          <div className="header-actions">
            {renderActionButton()}
          </div>
        </div>
        
        <div className="content-container">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default SellerLayout;
