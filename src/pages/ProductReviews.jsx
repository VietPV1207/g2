// src/pages/Feedback.js
import React, { useState, useEffect } from 'react';
import { Container, Card, Button, Form, Row, Col } from 'react-bootstrap';
import axios from 'axios';

const Feedback = () => {
  const [reviews, setReviews] = useState([]); // lưu danh sách reviews
  const [editingResponse, setEditingResponse] = useState({}); // lưu phản hồi đang sửa của từng review
  const [editingReview, setEditingReview] = useState({}); // đánh dấu review nào đang ở chế độ chỉnh sửa
  const [filterOption, setFilterOption] = useState('all'); // bộ lọc: all, answered, unanswered
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Lấy dữ liệu reviews từ API khi component mount
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get('http://localhost:9999/reviews');
        // Nếu API trả về mảng trực tiếp hoặc object chứa key "reviews"
        const data = Array.isArray(response.data)
          ? response.data
          : response.data.reviews || [];
        setReviews(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  // Xử lý thay đổi nội dung trong ô textarea
  const handleResponseChange = (reviewId, value) => {
    setEditingResponse(prev => ({
      ...prev,
      [reviewId]: value
    }));
  };

  // Toggle hiển thị ô textarea để trả lời hoặc chỉnh sửa phản hồi (chỉ quản lý UI)
  const handleToggleEdit = (reviewId) => {
    setEditingReview(prev => ({
      ...prev,
      [reviewId]: !prev[reviewId]
    }));
  };

  // Khi nhấn "Gửi phản hồi", cập nhật seller_response của review thông qua PATCH request
  const handleSubmitResponse = async (reviewId) => {
    try {
      // Sửa lại URL PATCH: sử dụng /reviews/{reviewId}
      const response = await axios.patch(`http://localhost:9999/reviews/${reviewId}`, {
        seller_response: editingResponse[reviewId]
      });
      // Giả sử response.data chứa review đã được cập nhật từ server
      const updatedReview = response.data;

      // Cập nhật lại state reviews
      const updatedReviews = reviews.map(review =>
        review.id === reviewId ? updatedReview : review
      );
      setReviews(updatedReviews);
      // Dừng chế độ chỉnh sửa và reset nội dung phản hồi
      setEditingReview(prev => ({ ...prev, [reviewId]: false }));
      setEditingResponse(prev => ({ ...prev, [reviewId]: '' }));
    } catch (err) {
      console.error('Error updating review in DB:', err);
    }
  };

  // Lọc reviews dựa vào tùy chọn dropdown
  const filteredReviews = reviews.filter(review => {
    if (filterOption === 'answered') {
      return review.seller_response && review.seller_response.trim().length > 0;
    } else if (filterOption === 'unanswered') {
      return !review.seller_response || review.seller_response.trim().length === 0;
    }
    return true;
  });

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
      <Row className="align-items-center mb-4">
        <Col>
          <h2>Feedback & Reviews</h2>
        </Col>
        <Col md="auto">
          <Form.Select value={filterOption} onChange={(e) => setFilterOption(e.target.value)}>
            <option value="all">All</option>
            <option value="answered">Đã trả lời</option>
            <option value="unanswered">Chưa trả lời</option>
          </Form.Select>
        </Col>
      </Row>
      {filteredReviews?.length > 0 ? (
        filteredReviews.map((review, index) => (
          <Card className="mb-3" key={review.id}>
            <Card.Header>
              <div className="d-flex justify-content-between">
                <span>
                  <strong>Review ID:</strong> {review.id} | <strong>Rating:</strong> {review.rating} / 5
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
              {/* Nếu chưa có phản hồi và không đang edit, hiển thị nút "Trả lời" */}
              {!review.seller_response && !editingReview[review.id] && (
                <Button variant="secondary" onClick={() => handleToggleEdit(review.id)}>
                  Trả lời
                </Button>
              )}
              {/* Nếu đã có phản hồi và không đang edit, hiển thị nút "Sửa phản hồi" */}
              {review.seller_response && !editingReview[review.id] && (
                <Button variant="outline-primary" onClick={() => handleToggleEdit(review.id)}>
                  Sửa phản hồi
                </Button>
              )}
              {/* Nếu đang ở chế độ chỉnh sửa, hiển thị ô textarea */}
              {editingReview[review.id] && (
                <Form className="mt-2">
                  <Form.Group controlId={`response-${review.id}`}>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      placeholder="Nhập phản hồi của bạn..."
                      value={editingResponse[review.id] || ""}
                      onChange={(e) => handleResponseChange(review.id, e.target.value)}
                    />
                  </Form.Group>
                  <div className="mt-2">
                    <Button variant="primary" onClick={() => handleSubmitResponse(review.id)}>
                      Gửi phản hồi
                    </Button>{' '}
                    <Button variant="outline-secondary" onClick={() => handleToggleEdit(review.id)}>
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

export default Feedback;
