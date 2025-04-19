import React, { useState, useEffect } from "react";

const OrderConfirmation = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);

  // API URL
  const API_URL = "http://localhost:9999/orders"; 

  // Lấy dữ liệu từ API
  useEffect(() => {
    fetch(API_URL)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Không thể lấy dữ liệu từ server");
        }
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setOrders(data);
        } else {
          setError("Dữ liệu không hợp lệ, không phải mảng");
        }
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setError("Có lỗi xảy ra khi tải dữ liệu");
      });
  }, []);

  // Hàm cập nhật trạng thái đơn hàng
  const handleUpdateStatus = (orderId, newStatus) => {
    // Tìm ID của đơn hàng dựa vào order_id
    const orderToUpdate = orders.find((order) => order.order_id === orderId);

    if (!orderToUpdate) {
      setError("Không tìm thấy đơn hàng.");
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
          throw new Error("Lỗi khi cập nhật trạng thái đơn hàng");
        }
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.id === orderToUpdate.id
              ? { ...order, status: newStatus }
              : order
          )
        );
        console.log(`Đơn hàng ${orderId} đã được cập nhật thành ${newStatus}`);
      })
      .catch((err) => {
        console.error(err);
        setError("Không thể cập nhật trạng thái đơn hàng.");
      });
  };

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-6">
      
      {orders.length === 0 ? (
        <p className="text-center text-gray-500">Đang tải đơn hàng...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {orders.map((order) => (
            <div key={order.id} className="border rounded-lg shadow-md p-4 bg-white">
              <h3 className="text-lg font-semibold">Đơn hàng {order.order_id}</h3>
              <p className="text-gray-600">
                <strong>Ngày đặt:</strong>{" "}
                {new Date(order.order_date).toLocaleString()}
              </p>
              <p className="text-gray-600">
                <strong>Tổng tiền:</strong> {order.total_amount} VND
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
                <strong>Trạng thái:</strong> {order.status}
              </p>
              <div className="mt-2">
                <label className="block">
                  <span className="text-sm font-medium">Cập nhật trạng thái:</span>
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
                    alert(`Đang in phiếu vận chuyển cho đơn hàng ${order.order_id}`)
                  }
                  className="btn btn-secondary"
                >
                  In phiếu vận chuyển
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
