import React, { useState, useEffect } from 'react';
import { Container, Card, Button, Form, Row, Col } from 'react-bootstrap';
import axios from 'axios';

const Feedback = () => {
  const [reviews, setReviews] = useState([]); // Store the list of reviews
  const [editingResponse, setEditingResponse] = useState({}); // Store the response being edited for each review
  const [editingReview, setEditingReview] = useState({}); // Mark the review currently in edit mode
  const [filterOption, setFilterOption] = useState('all'); // Filter options: all, answered, unanswered
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch reviews data from API when the component mounts
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get('http://localhost:9999/reviews');
        // If the API returns an array directly or an object with the key "reviews"
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

  // Handle changes in the response textarea
  const handleResponseChange = (reviewId, value) => {
    setEditingResponse(prev => ({
      ...prev,
      [reviewId]: value
    }));
  };

  // Toggle the textarea to answer or edit the response (UI management only)
  const handleToggleEdit = (reviewId) => {
    setEditingReview(prev => ({
      ...prev,
      [reviewId]: !prev[reviewId]
    }));
  };

  // When "Submit Response" is clicked, update the seller_response of the review via PATCH request
  const handleSubmitResponse = async (reviewId) => {
    try {
      // Update URL for PATCH request: using /reviews/{reviewId}
      const response = await axios.patch(`http://localhost:9999/reviews/${reviewId}`, {
        seller_response: editingResponse[reviewId]
      });
      // Assuming response.data contains the updated review from the server
      const updatedReview = response.data;

      // Update the state reviews
      const updatedReviews = reviews.map(review =>
        review.id === reviewId ? updatedReview : review
      );
      setReviews(updatedReviews);
      // Stop editing mode and reset the response content
      setEditingReview(prev => ({ ...prev, [reviewId]: false }));
      setEditingResponse(prev => ({ ...prev, [reviewId]: '' }));
    } catch (err) {
      console.error('Error updating review in DB:', err);
    }
  };

  // Filter reviews based on the selected dropdown option
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
        <p>Loading data...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-5">
        <p className="text-danger">Error: {error}</p>
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
            <option value="answered">Answered</option>
            <option value="unanswered">Unanswered</option>
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
                <strong>Seller Response:</strong> {review.seller_response || "No response yet."}
              </Card.Text>
              {/* If no response and not editing, show "Reply" button */}
              {!review.seller_response && !editingReview[review.id] && (
                <Button variant="secondary" onClick={() => handleToggleEdit(review.id)}>
                  Reply
                </Button>
              )}
              {/* If there is a response and not editing, show "Edit Response" button */}
              {review.seller_response && !editingReview[review.id] && (
                <Button variant="outline-primary" onClick={() => handleToggleEdit(review.id)}>
                  Edit Response
                </Button>
              )}
              {/* If editing, show the textarea */}
              {editingReview[review.id] && (
                <Form className="mt-2">
                  <Form.Group controlId={`response-${review.id}`}>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      placeholder="Enter your response..."
                      value={editingResponse[review.id] || ""}
                      onChange={(e) => handleResponseChange(review.id, e.target.value)}
                    />
                  </Form.Group>
                  <div className="mt-2">
                    <Button variant="primary" onClick={() => handleSubmitResponse(review.id)}>
                      Submit Response
                    </Button>{' '}
                    <Button variant="outline-secondary" onClick={() => handleToggleEdit(review.id)}>
                      Cancel
                    </Button>
                  </div>
                </Form>
              )}
            </Card.Body>
          </Card>
        ))
      ) : (
        <p>No reviews found.</p>
      )}
    </Container>
  );
};

export default Feedback;
