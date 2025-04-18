import React, { useState, useEffect } from 'react';

const OrderConfirmation = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);

  // API URL
  const API_URL = 'http://localhost:9999/orders';  // Đảm bảo đường dẫn đến file JSON là chính xác

  // Lấy dữ liệu từ API hoặc file JSON
  useEffect(() => {
    fetch(API_URL)
      .then((res) => {
        if (!res.ok) {
          throw new Error('Không thể lấy dữ liệu từ server');
        }
        return res.json();
      })
      .then((data) => {
        // Kiểm tra dữ liệu trả về có phải là mảng không
        if (Array.isArray(data)) {
          setOrders(data);  // Nếu đúng là mảng, lưu vào state
        } else {
          setError('Dữ liệu không hợp lệ, không phải mảng');
        }
      })
      .catch((err) => {
        console.error('Fetch error:', err);
        setError('Có lỗi xảy ra khi tải dữ liệu');
      });
  }, []);

  // Nếu có lỗi, hiển thị thông báo lỗi
  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
     
      {orders.length === 0 ? (
        <p>Đang tải đơn hàng...</p>
      ) : (
        <ul>
          {orders.map((order) => (
            <li key={order.id}>
              <h3>Đơn hàng {order.order_id}</h3>
              <p>Ngày đặt: {new Date(order.order_date).toLocaleString()}</p>
              <p>Tổng tiền: {order.total_amount} VND</p>
              <p>Trạng thái: {order.status}</p>
              <button onClick={() => handleConfirmOrder(order.order_id)}>
                Xác nhận đơn hàng
              </button>
              <button onClick={() => handlePrintInvoice(order.order_id)}>
                In phiếu vận chuyển
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  // Hàm xác nhận đơn hàng (giả lập)
  function handleConfirmOrder(orderId) {
    alert(`Đơn hàng ${orderId} đã được xác nhận.`);
    // Thực tế, bạn có thể cập nhật trạng thái đơn hàng trong database hoặc gửi yêu cầu PATCH/PUT đến server.
  }

  // Hàm in phiếu vận chuyển (giả lập)
  function handlePrintInvoice(orderId) {
    alert(`Đang in phiếu vận chuyển cho đơn hàng ${orderId}`);
    // Thực tế, bạn có thể gửi yêu cầu in hoặc mở một bản in PDF.
  }
};

export default OrderConfirmation;
