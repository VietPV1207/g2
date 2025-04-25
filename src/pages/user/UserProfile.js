import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useUser } from '../UserContext';
import { useNavigate, Link } from 'react-router-dom';

const UserProfile = () => {
    const { user } = useUser();
    const defaultAvatar = "/assets/images/guestava.jpg"; // default avatar image
    const [ordersData, setOrdersData] = useState([]);
    const navigate = useNavigate();

    // Fetch orders data when the component mounts or when user changes
    useEffect(() => {
        if (user && user.order_id && user.order_id.length > 0) {
            axios
                .get('http://localhost:9999/orders')
                .then(response => {
                    // Filter orders based on user's order_ids (user.order_id contains order IDs)
                    const filteredOrders = response.data.filter(order =>
                        user.order_id.includes(order.order_id)
                    );
                    setOrdersData(filteredOrders);
                })
                .catch(error => {
                    console.error('Error fetching orders:', error);
                });
        }
    }, [user]);

    if (!user) {
        return (
            <div className="container mt-5">
                <h2>You are not logged in!</h2>
            </div>
        );
    }

    return (
        <>
            <div className="container mt-5">
                <div className="row">
                    {/* Left Column: Account Info */}
                    <div className="col-lg-3">
                        {/* Card showing avatar and full name */}
                        <Link
                            to="/update-imgage"
                            style={{ textDecoration: 'none', color: 'inherit' }}
                        >
                            <div className="card mb-3">
                                <div className="card-body text-center bg-secondary">
                                    <img
                                        src={user.image && user.image.trim() !== "" ? user.image : defaultAvatar}
                                        alt={user.fullname}
                                        className="rounded-circle mb-3"
                                        style={{ width: "100px", height: "100px", objectFit: "cover" }}
                                    />
                                    <h4 className="card-title">{user.fullname}</h4>
                                </div>
                            </div>
                        </Link>

                        {/* Account Info Card */}
                        <div className="card mb-3">
                            <div className="card-header text-center bg-primary">
                                <h5 className="mb-0 fw-bold text-white">Account Info</h5>
                            </div>
                            <div className="card-body">
                                <p className="mb-1">
                                    <strong>Email:</strong> {user.email}
                                </p>
                                <p className="mb-1">
                                    <strong>Role:</strong> {user.role}
                                </p>
                                <p className="mb-1">
                                    <strong>Address:</strong> {user.address.street}, {user.address.city}, {user.address.country}
                                </p>
                            </div>
                            <div className="text-center pb-2">
                                <button
                                    className="btn btn-outline-primary mt-2"
                                    onClick={() => navigate('/edit-profile')}
                                >
                                    Edit Profile
                                </button>
                            </div>
                        </div>
                        <Link to="/" className='btn btn-danger'>
                        Back
                        </Link>
                    </div>

                    {/* Right Column: Orders */}
                    <div className="col-lg-9">
                        <div className="card">
                            <div className="card-header">
                                <h4 className="mb-0">Orders</h4>
                            </div>
                            <div className="card-body">
                                {ordersData && ordersData.length > 0 ? (
                                    <table className="table table-bordered">
                                        <thead>
                                            <tr>
                                                <th>Order ID</th>
                                                <th>Order Date</th>
                                                <th>Status</th>
                                                <th>Products</th>
                                                <th>Total Amount</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {ordersData.map((order) => (
                                                <tr key={order.order_id}>
                                                    <td>{order.order_id}</td>
                                                    <td>{new Date(order.order_date).toLocaleDateString()}</td>
                                                    <td>{order.status}</td>
                                                    <td>
                                                        {order.items && order.items.length > 0 ? (
                                                            <ul className="list-group list-group-flush">
                                                                {order.items.map((prod, index) => (
                                                                    <li key={index} className="list-group-item p-1">
                                                                        {prod.quantity} x {prod.product_name}
                                                                        <span className="float-end">
                                                                            ${prod.price.toFixed(2)}
                                                                        </span>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        ) : (
                                                            "No products"
                                                        )}
                                                    </td>
                                                    <td>
                                                        ${order.items.reduce((acc, p) => acc + p.price * p.quantity, 0).toFixed(2)}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <p>No orders available.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default UserProfile;
