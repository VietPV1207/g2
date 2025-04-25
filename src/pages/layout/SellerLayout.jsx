// src/components/layout/SellerLayout.jsx
import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import './SellerLayout.css';

const SellerLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  // Handle logout
  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem('user');
    navigate('/login');
  };

  // Sidebar menu items for sellers
  const menuItems = [
    { path: '/product-list', icon: '📦', label: 'Product Management' },
    { path: '/order-confirmation', icon: '🛒', label: 'Order Management' },
    { path: '/voucher-management', icon: '🏷️', label: 'Voucher Management' },
    { path: '/inventory-management', icon: '📋', label: 'Inventory Management' },
    { path: '/feedback', icon: '⭐', label: 'Product Feedback' },
    { path: '/sales-report', icon: '📈', label: 'Sales Report' },
    { path: '/store-profile', icon: '🏪', label: 'Store Profile' },
    { path: '/', icon: '🏠', label: 'Back to Home' },
    { path: '#', icon: '🚪', label: 'Logout', onClick: handleLogout }
  ];

  // Determine page title based on current path
  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes('product-list')) return 'Product Management';
    if (path.includes('order-confirmation')) return 'Order Management';
    if (path.startsWith('/voucher-management')) {
      if (path.includes('/create')) return 'Create New Voucher';
      if (path.includes('/edit')) return 'Edit Voucher';
      if (path.includes('/apply')) return 'Apply Voucher';
      return 'Voucher Management';
    }
    if (path.includes('inventory-management')) return 'Inventory Management';
    if (path.includes('feedback')) return 'Product Feedback';
    if (path.includes('sales-report')) return 'Sales Report';
    if (path.includes('store-profile')) return 'Store Profile';
    return 'Seller Channel';
  };

  // Display appropriate "Add" button for specific pages
  const renderActionButton = () => {
    const path = location.pathname;
    return null;
  };

  return (
    <div className="seller-layout">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">
          <h2>Seller Channel</h2>
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
