import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import Navbar from '../components/Navbar';

const Products = () => {
  const [products, setProducts] = useState([]);  // Khởi tạo state sản phẩm với mảng rỗng
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch dữ liệu sản phẩm từ API khi component mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:9999/products');
        // Giả sử response.data là mảng sản phẩm
        setProducts(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <Container className="mt-5">
        <p>Loading products...</p>
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
    <>
      <Navbar />
      <Container className="mt-4">
        <h2 className="mb-4">Products</h2>
        <Row>
          {products.map(product => (
            <Col key={product.idProduct} sm={12} md={6} lg={4} className="mb-4">
              <Card>
                <Card.Img variant="top" src={product.url} alt={product.title} />
                <Card.Body>
                  <Card.Title>{product.title}</Card.Title>
                  <Card.Text>{product.description}</Card.Text>
                  <Card.Text>
                    <strong>Price:</strong> ${product.price}
                  </Card.Text>
                  <Card.Text>
                    <strong>Quantity:</strong> {product.quantity}
                  </Card.Text>
                  <Button variant="primary">Buy Now</Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </>
  );
};

export default Products;
