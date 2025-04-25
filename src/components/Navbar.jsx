// import React, { useState } from 'react';
// import { Link } from 'react-router-dom';
// import { useUser } from '../pages/UserContext';
// import guestAva from '../assets/avatar/guestava.jpg'; 
// import Dropdown from 'react-bootstrap/Dropdown';
// import Image from 'react-bootstrap/Image';


// const Navbar = () => {
//     const { user, setUser } = useUser();
//     const [query, setQuery] = useState("");

//     // Hàm xử lý đăng xuất: xoá token và cập nhật state người dùng
//     const handleLogout = () => {
//         localStorage.removeItem('authToken');
//         localStorage.removeItem('user');
//         setUser(null);
//     };

//     const handleSubmit = (e) => {
//         e.preventDefault(); // Prevent default form submission behavior
//         console.log("Search query:", query);
//     };

//     return (
//         <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
//             <div className="container">
//                 {/* Brand */}
//                 <Link className="navbar-brand" to="/">
//                     EBAY
//                 </Link>
//                 {/* Toggler/collapsible Button */}
//                 <button
//                     className="navbar-toggler"
//                     type="button"
//                     data-bs-toggle="collapse"
//                     data-bs-target="#navbarSupportedContent"
//                     aria-controls="navbarSupportedContent"
//                     aria-expanded="false"
//                     aria-label="Toggle navigation"
//                 >
//                     <span className="navbar-toggler-icon"></span>
//                 </button>

//                 {/* Navbar links and user control */}
//                 <div className="collapse navbar-collapse" id="navbarSupportedContent">
//                     {/* Left side menu */}
//                     <ul className="navbar-nav me-auto mb-2 mb-lg-0">
//                         <li className="nav-item">
//                             <Link className="nav-link" to="/">
//                                 Home
//                             </Link>
//                         </li>
//                         <li className="nav-item">
//                             <Link className="nav-link" to="/seller-dashboard">
//                                 Seller Dashboard
//                             </Link>
//                         </li>
//                     </ul>
//                     {/* Right side: Conditional rendering */}
//                     {user ? (
//                         // Nếu đăng nhập, hiển thị dropdown với avatar của tài khoản
//                         <Dropdown>
//                         <Dropdown.Toggle variant="secondary" id="dropdown-basic">
//                           <Image
//                             src={guestAva}
//                             alt="User Avatar"
//                             roundedCircle
//                             style={{ width: "30px", height: "30px", objectFit: "cover" }}
//                           />
//                         </Dropdown.Toggle>
                    
//                         <Dropdown.Menu align="end">
//                           <Dropdown.ItemText>{user.fullName}</Dropdown.ItemText>
//                           <Dropdown.Item href="/cart">Cart</Dropdown.Item>
//                           <Dropdown.Item href="/profile">Profile</Dropdown.Item>
//                           <Dropdown.Item href="/change-password">Change Password</Dropdown.Item>
//                           {user.role === 'seller' && (
//                             <>
//                               <Dropdown.Item href="/inventory">Inventory Management</Dropdown.Item>
//                               <Dropdown.Item href="/vouchers">Voucher Management</Dropdown.Item>
//                             </>
//                           )}
//                           <Dropdown.Divider />
//                           <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
//                         </Dropdown.Menu>
//                       </Dropdown>
//                     ) : (
//                         // Nếu chưa đăng nhập, hiển thị link Login
//                         <div className="d-flex">
//                             <Link className="nav-link text-white" to="/login">
//                                 Login
//                             </Link>
//                         </div>
//                     )}
//                 </div>
//             </div>
//         </nav>
//     );
// };

// export default Navbar;
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../pages/UserContext';
import guestAva from '../assets/avatar/guestava.jpg'; 
import Dropdown from 'react-bootstrap/Dropdown';
import Image from 'react-bootstrap/Image';
import axios from 'axios';
import { BsCart3, BsSearch, BsPersonCircle } from 'react-icons/bs';

const Navbar = () => {
    const { user, setUser } = useUser();
    const [query, setQuery] = useState("");
    const [storeName, setStoreName] = useState("EBAY Store");
    const [showSearch, setShowSearch] = useState(false);
    
    // Fetch store information when component mounts
    useEffect(() => {
        const fetchStoreName = async () => {
            try {
                if (user && (user.role === 'seller' || user.role === 'admin')) {
                    const response = await axios.get('http://localhost:9999/stores');
                    const stores = response.data;
                    
                    // Find the store associated with this user
                    const userStore = stores.find(store => 
                        store.seller_ids && store.seller_ids.includes(user.id)
                    );
                    
                    if (userStore && userStore.storeName) {
                        setStoreName(userStore.storeName);
                    }
                }
            } catch (error) {
                console.error("Error fetching store data:", error);
            }
        };

        fetchStoreName();
    }, [user]);

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        setUser(null);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Search query:", query);
        // Implement search functionality
    };

    const toggleSearch = () => {
        setShowSearch(!showSearch);
    };

    return (
        <nav className="navbar navbar-expand-lg sticky-top" style={{ backgroundColor: '#0066cc', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)' }}>
            <div className="container">
                {/* Brand */}
                <Link className="navbar-brand text-white fw-bold" to="/">
                    {storeName}
                </Link>
                
                {/* Toggler Button */}
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarContent"
                    aria-controls="navbarContent"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                {/* Navbar Content */}
                <div className="collapse navbar-collapse" id="navbarContent">
                    {/* Left side menu */}
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <Link className="nav-link text-white" to="/">
                                Home
                            </Link>
                        </li>
                        
                        {user && user.role === 'seller' && (
                            <li className="nav-item">
                                <Link className="nav-link text-white" to="/product-list">
                                    Seller Dashboard
                                </Link>
                            </li>
                        )}
                    </ul>
                    
                    {/* Search Bar - Desktop */}
                    <div className="d-none d-lg-block me-3 search-container">
                        <form className="d-flex" onSubmit={handleSubmit}>
                            <div className="input-group">
                                <input
                                    type="search"
                                    className="form-control"
                                    placeholder="Search products..."
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    aria-label="Search"
                                />
                                <button className="btn btn-light" type="submit">
                                    <BsSearch />
                                </button>
                            </div>
                        </form>
                    </div>
                    
                    {/* Right side: User controls */}
                    <div className="d-flex align-items-center">
                        {/* Search Icon - Mobile */}
                        <div className="d-lg-none me-3">
                            <button 
                                className="btn btn-outline-light" 
                                onClick={toggleSearch}
                                aria-label="Toggle search"
                            >
                                <BsSearch />
                            </button>
                        </div>
                        
                        {/* Cart Link
                        <Link to="/cart" className="text-decoration-none text-white me-3">
                            <div className="d-flex align-items-center">
                                <BsCart3 size={22} />
                                <span className="ms-1 d-none d-sm-inline">Cart</span>
                            </div>
                        </Link> */}
                        
                        {/* User Account */}
                        {user ? (
                            <Dropdown align="end">
                                <Dropdown.Toggle 
                                    variant="outline-light" 
                                    className="d-flex align-items-center border-0"
                                    id="dropdown-user"
                                >
                                    <Image
                                        src={user.image}
                                        alt="User Avatar"
                                        roundedCircle
                                        style={{ width: "30px", height: "30px", objectFit: "cover" }}
                                    />
                                    <span className="ms-2 d-none d-sm-inline">{user.fullname}</span>
                                </Dropdown.Toggle>
                            
                                <Dropdown.Menu className="shadow border-0">
                                    {/* <Dropdown.ItemText className="text-muted small">{user.email}</Dropdown.ItemText> */}
                                    <Dropdown.Divider />
                                    <Dropdown.Item as={Link} to="/user-profile">
                                        {/* <BsPersonCircle className="me-2" />  */}
                                        My Profile
                                    </Dropdown.Item>
                                    {/* <Dropdown.Item as={Link} to="/orders">
                                        My Orders
                                    </Dropdown.Item> */}
                                    <Dropdown.Item as={Link} to="/change-password">
                                        Change Password
                                    </Dropdown.Item>
                                    {user.role === 'seller' && (
                                        <>
                                            <Dropdown.Divider />
                                            <Dropdown.ItemText className="fw-bold small text-primary">Seller Options</Dropdown.ItemText>
                                            <Dropdown.Item as={Link} to="/inventory-management">
                                                Inventory Management
                                            </Dropdown.Item>
                                            <Dropdown.Item as={Link} to="/voucher-management">
                                                Voucher Management
                                            </Dropdown.Item>
                                        </>
                                    )}
                                    <Dropdown.Divider />
                                    <Dropdown.Item onClick={handleLogout} className="text-danger">
                                        Logout
                                    </Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        ) : (
                            <div className="d-flex">
                                <Link className="btn btn-outline-light" to="/login">
                                    Login
                                </Link>
                                <Link className="btn btn-light ms-2 d-none d-sm-block" to="/register">
                                    Register
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            
            {/* Mobile Search Bar - Collapsible */}
            {showSearch && (
                <div className="container mt-2 d-lg-none">
                    <form className="d-flex" onSubmit={handleSubmit}>
                        <div className="input-group">
                            <input
                                type="search"
                                className="form-control"
                                placeholder="Search products..."
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                aria-label="Search"
                            />
                            <button className="btn btn-light" type="submit">
                                <BsSearch />
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </nav>
    );
};

export default Navbar;