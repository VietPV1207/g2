import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../pages/UserContext';
import guestAva from '../assets/avatar/guestava.jpg'; 
import Dropdown from 'react-bootstrap/Dropdown';
import Image from 'react-bootstrap/Image';


const Navbar = () => {
    const { user, setUser } = useUser();
    const [query, setQuery] = useState("");

    // Hàm xử lý đăng xuất: xoá token và cập nhật state người dùng
    const handleLogout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        setUser(null);
    };

    const handleSubmit = (e) => {
        e.preventDefault(); // Prevent default form submission behavior
        console.log("Search query:", query);
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container">
                {/* Brand */}
                <Link className="navbar-brand" to="/">
                    EBAY
                </Link>
                {/* Toggler/collapsible Button */}
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarSupportedContent"
                    aria-controls="navbarSupportedContent"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                {/* Navbar links and user control */}
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    {/* Left side menu */}
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <Link className="nav-link" to="/">
                                Home
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/seller-dashboard">
                                Seller Dashboard
                            </Link>
                        </li>
                    </ul>
                    {/* Right side: Conditional rendering */}
                    {user ? (
                        // Nếu đăng nhập, hiển thị dropdown với avatar của tài khoản
                        <Dropdown>
                        <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                          <Image
                            src={guestAva}
                            alt="User Avatar"
                            roundedCircle
                            style={{ width: "30px", height: "30px", objectFit: "cover" }}
                          />
                        </Dropdown.Toggle>
                    
                        <Dropdown.Menu align="end">
                          <Dropdown.ItemText>{user.fullName}</Dropdown.ItemText>
                          <Dropdown.Item href="/cart">Cart</Dropdown.Item>
                          <Dropdown.Item href="/profile">Profile</Dropdown.Item>
                          <Dropdown.Item href="/change-password">Change Password</Dropdown.Item>
                          {user.role === 'seller' && (
                            <>
                              <Dropdown.Item href="/inventory">Inventory Management</Dropdown.Item>
                              <Dropdown.Item href="/vouchers">Voucher Management</Dropdown.Item>
                            </>
                          )}
                          <Dropdown.Divider />
                          <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    ) : (
                        // Nếu chưa đăng nhập, hiển thị link Login
                        <div className="d-flex">
                            <Link className="nav-link text-white" to="/login">
                                Login
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;