// src/pages/Feedback.js
import React, { useState, useEffect } from 'react';
import { Container, Card, Button, Form, Row, Col } from 'react-bootstrap';

const ProductReviews = () => {
  // State lưu trữ danh sách reviews (giá trị giả lập dùng cho demo)
  const [reviews, setReviews] = useState([]);
  // State lưu trữ giá trị phản hồi đang chỉnh sửa cho từng review (key theo review_id)
  const [editingResponse, setEditingResponse] = useState({});

  useEffect(() => {
    // Giả lập dữ liệu reviews; trong thực tế bạn sẽ fetch dữ liệu từ API hoặc db.
    const dummyReviews = [
      {
        review_id: "1",
        order_id: "ORD002",
        product_id: "1",
        seller_id: "1",
        buyer_id: "2",
        rating: 4,
        comment: "Sản phẩm khá tốt, giao hàng nhanh.",
        seller_response: "",
        review_date: "2025-03-25T10:00:00Z"
      },
      {
        review_id: "2",
        order_id: "ORD003",
        product_id: "2",
        seller_id: "2",
        buyer_id: "3",
        rating: 3,
        comment: "Sản phẩm ổn, nhưng có vài chi tiết cần cải thiện.",
        seller_response: "Cảm ơn phản hồi của bạn. Chúng tôi sẽ xem xét.",
        review_date: "2025-03-25T10:05:00Z"
      },
      {
        review_id: "3",
        order_id: "ORD004",
        product_id: "3",
        seller_id: "3",
        buyer_id: "1",
        rating: 5,
        comment: "Rất hài lòng về chất lượng sản phẩm!",
        seller_response: "",
        review_date: "2025-03-25T10:10:00Z"
      }
      // Bạn có thể bổ sung thêm các review khác
    ];
    setReviews(dummyReviews);
  }, []);

  // Hàm cập nhật giá trị phản hồi trong ô textarea tương ứng review_id
  const handleResponseChange = (reviewId, value) => {
    setEditingResponse({
      ...editingResponse,
      [reviewId]: value
    });
  };

  // Hàm submit phản hồi cho review, cập nhật seller_response trong state
  const handleSubmitResponse = (reviewId) => {
    const updatedReviews = reviews.map(review =>
      review.review_id === reviewId
        ? { ...review, seller_response: editingResponse[reviewId] }
        : review
    );
    setReviews(updatedReviews);
    // Sau khi gửi, reset ô textarea cho review đó
    setEditingResponse(prev => ({
      ...prev,
      [reviewId]: ""
    }));
  };

  return (
    <Container className="my-4">
      <h2 className="mb-4">Feedback & Reviews</h2>
      {reviews.length === 0 ? (
        <p>Không có đánh giá nào được ghi nhận.</p>
      ) : (
        reviews.map(review => (
          <Card key={review.review_id} className="mb-3">
            <Card.Header>
              <Row>
                <Col><strong>Rating:</strong> {review.rating} / 5</Col>
                <Col className="text-end">
                  <strong>Date:</strong> {new Date(review.review_date).toLocaleString()}
                </Col>
              </Row>
            </Card.Header>
            <Card.Body>
              <Card.Text>
                <strong>Review:</strong> {review.comment}
              </Card.Text>
              <Card.Text>
                <strong>Seller Response:</strong> {review.seller_response || <em>Chưa có phản hồi.</em>}
              </Card.Text>
              <Form>
                <Form.Group controlId={`response-${review.review_id}`}>
                  <Form.Label>Phản hồi của bạn:</Form.Label>
                  <Form.Control 
                    as="textarea"
                    rows={3}
                    placeholder="Nhập phản hồi của bạn..."
                    value={editingResponse[review.review_id] || ""}
                    onChange={(e) => handleResponseChange(review.review_id, e.target.value)}
                  />
                </Form.Group>
                <Button 
                  variant="primary" 
                  className="mt-2"
                  onClick={() => handleSubmitResponse(review.review_id)}
                >
                  Gửi phản hồi
                </Button>
              </Form>
            </Card.Body>
          </Card>
        ))
      )}
    </Container>
  );
};

export default ProductReviews;
