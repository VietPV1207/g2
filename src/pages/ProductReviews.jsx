// src/pages/Feedback.js
import React, { useState, useEffect } from 'react';
import { Container, Card, Button, Form } from 'react-bootstrap';

const ProductReviews = () => {
  const [reviews, setReviews] = useState([]);
  // State lưu trữ giá trị phản hồi đang chỉnh sửa cho từng review (key theo review_id)
  const [editingResponse, setEditingResponse] = useState({});
  // State để xác định review nào đang được chỉnh sửa (hiển thị ô textarea)
  const [editingReview, setEditingReview] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch dữ liệu reviews từ API endpoint khi component mount
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch('http://localhost:9999/reviews');
        if (!response.ok) {
          throw new Error('Không thể lấy dữ liệu reviews từ server.');
        }
        const data = await response.json();
        // Nếu API trả về mảng trực tiếp hoặc có key "reviews"
        setReviews(Array.isArray(data) ? data : data.reviews || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  // Xử lý thay đổi phản hồi trong ô textarea
  const handleResponseChange = (reviewId, value) => {
    setEditingResponse(prev => ({
      ...prev,
      [reviewId]: value
    }));
  };

  // Khi nhấn "Gửi phản hồi", cập nhật seller_response của review và ẩn ô nhập
  const handleSubmitResponse = (reviewId) => {
    const updatedReviews = reviews.map(review =>
      review.review_id === reviewId
        ? { ...review, seller_response: editingResponse[reviewId] }
        : review
    );
    setReviews(updatedReviews);
    setEditingReview(prev => ({ ...prev, [reviewId]: false }));
    setEditingResponse(prev => ({ ...prev, [reviewId]: '' }));
  };

  // Xử lý toggle hiển thị ô textarea để trả lời review
  const handleToggleEdit = (reviewId) => {
    setEditingReview(prev => ({
      ...prev,
      [reviewId]: !prev[reviewId]
    }));
  };

  if (loading) {
    return (
      <Container className="mt-5">
        <p>Đang tải dữ liệu...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-5">
        <p className="text-danger">Lỗi: {error}</p>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <h2 className="mb-4">Feedback & Reviews</h2>
      {reviews?.length > 0 ? (
        reviews.map((review) => (
          <Card className="mb-3" key={review.review_id}>
            <Card.Header>
              <div className="d-flex justify-content-between">
                <span>
                  <strong>Review ID:</strong> {review.review_id} | <strong>Rating:</strong> {review.rating} / 5
                </span>
                <span>
                  <strong>Date:</strong> {new Date(review.review_date).toLocaleString()}
                </span>
              </div>
            </Card.Header>
            <Card.Body>
              <Card.Text>
                <strong>Order ID:</strong> {review.order_id} <br />
                <strong>Product ID:</strong> {review.product_id} <br />
                <strong>Review:</strong> {review.comment} <br />
                <strong>Seller Response:</strong> {review.seller_response || "Chưa có phản hồi."}
              </Card.Text>
              {/* Hiển thị nút "Trả lời" nếu review chưa có phản hồi và chưa được mở ô trả lời */}
              {!review.seller_response && !editingReview[review.review_id] && (
                <Button variant="secondary" onClick={() => handleToggleEdit(review.review_id)}>
                  Trả lời
                </Button>
              )}
              {/* Nếu đang chỉnh sửa review, hiện textarea và các nút xử lý */}
              {editingReview[review.review_id] && (
                <Form>
                  <Form.Group controlId={`response-${review.review_id}`}>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      placeholder="Nhập phản hồi của bạn..."
                      value={editingResponse[review.review_id] || ""}
                      onChange={(e) => handleResponseChange(review.review_id, e.target.value)}
                    />
                  </Form.Group>
                  <div className="mt-2">
                    <Button variant="primary" onClick={() => handleSubmitResponse(review.review_id)}>
                      Gửi phản hồi
                    </Button>{' '}
                    <Button variant="outline-secondary" onClick={() => handleToggleEdit(review.review_id)}>
                      Hủy
                    </Button>
                  </div>
                </Form>
              )}
            </Card.Body>
          </Card>
        ))
      ) : (
        <p>Không có đánh giá nào được ghi nhận.</p>
      )}
    </Container>
  );
};

export default ProductReviews;
