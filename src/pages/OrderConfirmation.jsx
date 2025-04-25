import React, { useState, useEffect } from "react";

const OrderConfirmation = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);

  // API URL
  const API_URL = "http://localhost:9999/orders"; 

  // Fetch data from the API
  useEffect(() => {
    fetch(API_URL)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Unable to fetch data from the server"); // Không thể lấy dữ liệu từ server
        }
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setOrders(data);
        } else {
          setError("Invalid data format, not an array"); // Dữ liệu không hợp lệ, không phải mảng
        }
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setError("An error occurred while loading data"); // Có lỗi xảy ra khi tải dữ liệu
      });
  }, []);

  // Function to update order status
  const handleUpdateStatus = (orderId, newStatus) => {
    // Find the order ID based on order_id
    const orderToUpdate = orders.find((order) => order.order_id === orderId);

    if (!orderToUpdate) {
      setError("Order not found."); // Không tìm thấy đơn hàng
      return;
    }

    fetch(`${API_URL}/${orderToUpdate.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: newStatus }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Error updating order status"); // Lỗi khi cập nhật trạng thái đơn hàng
        }
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.id === orderToUpdate.id
              ? { ...order, status: newStatus }
              : order
          )
        );
        console.log(`Order ${orderId} updated to ${newStatus}`); // Đơn hàng {orderId} đã được cập nhật thành {newStatus}
      })
      .catch((err) => {
        console.error(err);
        setError("Unable to update order status."); // Không thể cập nhật trạng thái đơn hàng
      });
  };

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-6">
      
      {orders.length === 0 ? (
        <p className="text-center text-gray-500">Loading orders...</p> // Đang tải đơn hàng...
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {orders.map((order) => (
            <div key={order.id} className="border rounded-lg shadow-md p-4 bg-white">
              <h3 className="text-lg font-semibold">Order {order.order_id}</h3>
              <p className="text-gray-600">
                <strong>Order Date:</strong>{" "}
                {new Date(order.order_date).toLocaleString()} 
                {/* Ngày đặt */}
              </p>
              <p className="text-gray-600">
                <strong>Total Amount:</strong> {order.total_amount} USD
                {/* Tổng tiền */}
              </p>
              <p
                className={`font-medium ${
                  order.status === "pending"
                    ? "text-yellow-500"
                    : order.status === "shipped"
                    ? "text-blue-500"
                    : "text-green-500"
                }`}
              >
                <strong>Status:</strong> {order.status}
                {/* Trạng thái */}
              </p>
              <div className="mt-2">
                <label className="block">
                  <span className="text-sm font-medium">Update Status:</span>
                  {/* Cập nhật trạng thái */}
                  <select
                    value={order.status}
                    onChange={(e) =>
                      handleUpdateStatus(order.order_id, e.target.value)
                    }
                    className="block w-full mt-1 p-2 border rounded-lg"
                  >
                    <option value="pending">Pending</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                  </select>
                </label>
              </div>
              <div className="flex justify-between mt-4">               
                <button
                  onClick={() =>
                    alert(`Printing shipping label for order ${order.order_id}`)
                    // Đang in phiếu vận chuyển cho đơn hàng {order.order_id}
                  }
                  className="btn btn-secondary"
                >
                  Print Shipping Label
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderConfirmation;
