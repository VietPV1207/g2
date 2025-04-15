import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../pages/UserContext';

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
                            <Link className="nav-link" to="/about">
                                About
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/contact">
                                Contact
                            </Link>
                        </li>
                    </ul>
                    {/* Right side: Conditional rendering */}
                    {user ? (
                        // Nếu đăng nhập, hiển thị dropdown với avatar của tài khoản
                        <ul className="navbar-nav">
                            <li className="nav-item dropdown">
                                <a
                                    className="nav-link dropdown-toggle"
                                    href="#!"
                                    role="button"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                >
                                    <img
                                        src={user.image}
                                        alt="User Avatar"
                                        className="rounded-circle"
                                        style={{ width: "30px", height: "30px", objectFit: "cover" }}
                                    />
                                </a>
                                <ul className="dropdown-menu dropdown-menu-end">
                                    <li>
                                        <label className='dropdown-item text-danger'>
                                            {user.fullName}
                                        </label>
                                    </li>
                                    <li>
                                        <Link className="dropdown-item" to="/cart">
                                            Cart
                                        </Link>
                                    </li>
                                    <li>
                                        <Link className="dropdown-item" to="/profile">
                                            Profile
                                        </Link>
                                    </li>
                                    <li>
                                        <Link className="dropdown-item" to="/change-password">
                                            Change Password
                                        </Link>
                                    </li>
                                    {/* Add Inventory and Voucher Management links for admin only */}
                                    {user.role === 'seller' && (
                                        <>
                                            <li>
                                                <Link className="dropdown-item" to="/inventory">
                                                    Inventory Management
                                                </Link>
                                            </li>
                                            <li>
                                                <Link className="dropdown-item" to="/vouchers">
                                                    Voucher Management
                                                </Link>
                                            </li>
                                        </>
                                    )}
                                    <li>
                                        <hr className="dropdown-divider" />
                                    </li>
                                    <li>
                                        <button className="dropdown-item" onClick={handleLogout}>
                                            Logout
                                        </button>
                                    </li>
                                </ul>
                            </li>
                        </ul>
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