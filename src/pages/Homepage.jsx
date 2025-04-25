// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { Container, Row, Col, Card, Button } from 'react-bootstrap';
// import Navbar from '../components/Navbar';

// const Products = () => {
//   const [products, setProducts] = useState([]);  // Khởi tạo state sản phẩm với mảng rỗng
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');

//   // Fetch dữ liệu sản phẩm từ API khi component mount
//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const response = await axios.get('http://localhost:9999/products');
//         // Giả sử response.data là mảng sản phẩm
//         setProducts(response.data);
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProducts();
//   }, []);

//   if (loading) {
//     return (
//       <Container className="mt-5">
//         <p>Loading products...</p>
//       </Container>
//     );
//   }

//   if (error) {
//     return (
//       <Container className="mt-5">
//         <p className="text-danger">Error: {error}</p>
//       </Container>
//     );
//   }

//   return (
//     <>
//       <Navbar />
//       <Container className="mt-4">
//         <h2 className="mb-4">Products</h2>
//         <Row>
//           {products.map(product => (
//             <Col key={product.idProduct} sm={12} md={6} lg={4} className="mb-4">
//               <Card>
//                 <Card.Img variant="top" src={product.url} alt={product.title} />
//                 <Card.Body>
//                   <Card.Title>{product.title}</Card.Title>
//                   <Card.Text>{product.description}</Card.Text>
//                   <Card.Text>
//                     <strong>Price:</strong> ${product.price}
//                   </Card.Text>
//                   <Card.Text>
//                     <strong>Quantity:</strong> {product.quantity}
//                   </Card.Text>
//                   <Button variant="primary">Buy Now</Button>
//                 </Card.Body>
//               </Card>
//             </Col>
//           ))}
//         </Row>
//       </Container>
//     </>
//   );
// };

// export default Products;
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Carousel } from 'react-bootstrap';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { BsArrowRight, BsStar, BsStarFill, BsCart3 } from 'react-icons/bs';
import './HomePage.css'; // Import the separated CSS file

const Homepage = () => {
  const [products, setProducts] = useState([]);
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsResponse, storesResponse] = await Promise.all([
          axios.get('http://localhost:9999/products'),
          axios.get('http://localhost:9999/stores')
        ]);
        
        setProducts(productsResponse.data);
        setStores(storesResponse.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Function to get banners from a store
  const getStoreBanners = (store) => {
    if (store.banners && store.banners.length > 0) {
      return store.banners;
    } else if (store.bannerImageURL) {
      return [{ url: store.bannerImageURL, title: store.storeName }];
    }
    return [];
  };

  // Collect all banners from all stores for the main carousel
  const getAllBanners = () => {
    let allBanners = [];
    stores.forEach(store => {
      const storeBanners = getStoreBanners(store);
      storeBanners.forEach(banner => {
        allBanners.push({
          ...banner,
          storeName: store.storeName,
          storeDescription: store.description,
          storeId: store.id
        });
      });
    });
    return allBanners;
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="loading-container">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <Container className="mt-5">
          <div className="alert alert-danger" role="alert">
            Error: {error}
          </div>
        </Container>
      </>
    );
  }

  const allBanners = getAllBanners();

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      
      {/* Main Banner Carousel */}
      {allBanners.length > 0 && (
        <div className="carousel-container">
          <Carousel 
            fade 
            className="banner-carousel"
            indicators={true}
            controls={allBanners.length > 1}
          >
            {allBanners.map((banner, index) => (
              <Carousel.Item key={`banner-${index}`}>
                <div className="carousel-image-container">
                  <img
                    className="d-block w-100"
                    src={banner.url}
                    alt={banner.title || banner.storeName}
                    style={{ height: '400px', objectFit: 'cover' }}
                    onError={(e) => e.target.src = "https://via.placeholder.com/1200x400?text=No+Banner+Available"}
                  />
                 
             <div className="carousel-text-content" 
                 style={{
                   position: 'absolute',
                   top: '50%',
                   left: '50%',
                   transform: 'translate(-50%, -50%)',
                   textAlign: 'center',
                   color: 'white',
                   backgroundColor: 'rgba(0,0,0,0)', 
                   padding: '10px',
                   textShadow: '2px 2px 4px rgba(0,0,0,0.7)',
                 }}>
              <h2 className="banner-title">{banner.title || banner.storeName}</h2>
              <p className="banner-description">{banner.storeDescription}</p>
            </div>
          </div>
        </Carousel.Item>
      ))}
    </Carousel>
        </div>
      )}

      {/* Category Shortcuts */}
      <div className="category-section">
        <Container>
          <Row className="g-4 justify-content-center text-center">
            {['Electronics', 'Fashion', 'Home', 'Beauty', 'Sports'].map((category, index) => (
              <Col key={index} xs={4} sm={4} md={2}>
                <div className="category-item">
                  <div className="category-icon">
                    <i className={`bi bi-${['laptop', 'tags', 'house', 'brush', 'trophy'][index]}`}></i>
                  </div>
                  <div className="category-title">{category}</div>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </div>

      <Container className="py-4">
        {/* Featured Products Section */}
        <section className="mb-5">
          <div className="section-header d-flex justify-content-between align-items-center">
            <h2 className="section-title">Featured Products</h2>
            <Link to="/products" className="text-decoration-none d-flex align-items-center">
              View All <BsArrowRight className="ms-1" />
            </Link>
          </div>
          <Row className="g-4">
            {products.slice(0, 6).map(product => (
              <Col key={product.id} xs={12} sm={6} md={4} lg={4}>
                <Card className="product-card">
                  <div className="product-image-container">
                    <Card.Img 
                      variant="top" 
                      src={product.url} 
                      alt={product.title}
                      className="product-image"
                      // onError={(e) => e.target.src = "https://via.placeholder.com/300x200?text=No+Image"}
                    />
                  </div>
                  <Card.Body>
                    <Card.Title className="product-title">{product.title}</Card.Title>
                    <Card.Text className="product-description text-truncate">{product.description}</Card.Text>
                    
                    {/* Product Rating */}
                    <div className="mb-2">
                      {[...Array(5)].map((_, i) => (
                        i < 4 ? <BsStarFill key={i} className="text-warning" /> : <BsStar key={i} className="text-warning" />
                      ))}
                      <span className="ms-1 text-muted small">(24)</span>
                    </div>
                    
                    <div className="d-flex justify-content-between align-items-center mt-3">
                      <span className="product-price">${product.price}</span>
                      <Button variant="primary" size="sm" className="add-to-cart-btn d-flex align-items-center">
                        <BsCart3 className="me-1" /> Add to Cart
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </section>

        {/* Promotional Banner */}
        <section className="promotional-banner">
          <div className="promo-content">
            <h3>Special Discount!</h3>
            <p>Get up to 50% off on selected items. Limited time offer.</p>
            <Button variant="light">Shop Now</Button>
          </div>
        </section>
        
        {/* Recently Added Products */}
        <section className="mb-5">
          <div className="section-header d-flex justify-content-between align-items-center">
            <h2 className="section-title">Recently Added</h2>
            <Link to="/products" className="text-decoration-none d-flex align-items-center">
              View All <BsArrowRight className="ms-1" />
            </Link>
          </div>
          <Row className="g-4">
            {products.slice(-3).map(product => (
              <Col key={product.id} xs={12} sm={6} md={4}>
                <Card className="product-card">
                  <div className="product-image-container">
                    <Card.Img 
                      variant="top" 
                      src={product.url} 
                      alt={product.title}
                      className="product-image"
                      // onError={(e) => e.target.src = "https://via.placeholder.com/300x200?text=No+Image"}
                    />
                  </div>
                  <Card.Body>
                    <Card.Title className="product-title">{product.title}</Card.Title>
                    <Card.Text className="product-description text-truncate">{product.description}</Card.Text>
                    <div className="d-flex justify-content-between align-items-center mt-3">
                      <span className="product-price">${product.price}</span>
                      <Button variant="primary" size="sm" className="add-to-cart-btn">
                        <BsCart3 className="me-1" /> Add to Cart
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </section>
      </Container>

      {/* Footer */}
      <footer className="mt-auto">
        <Container>
          <Row>
            <Col md={4} className="mb-4 mb-md-0">
              <h5>About EBAY Store</h5>
              <p>Your trusted destination for technology enthusiasts.</p>
              <div className="social-links">
                <a href="#!" className="text-white me-2"><i className="bi bi-facebook"></i></a>
                <a href="#!" className="text-white me-2"><i className="bi bi-twitter"></i></a>
                <a href="#!" className="text-white me-2"><i className="bi bi-instagram"></i></a>
              </div>
            </Col>
            <Col md={4} className="mb-4 mb-md-0">
              <h5>Quick Links</h5>
              <ul className="list-unstyled">
                <li><Link to="/" className="text-white">Home</Link></li>
                <li><Link to="/products" className="text-white">Products</Link></li>
                <li><Link to="/about" className="text-white">About Us</Link></li>
                <li><Link to="/contact" className="text-white">Contact</Link></li>
              </ul>
            </Col>
            <Col md={4}>
              <h5>Contact Us</h5>
              <p><i className="bi bi-envelope me-2"></i> contact@ebaystore.com</p>
              <p><i className="bi bi-telephone me-2"></i> (123) 456-7890</p>
            </Col>
          </Row>
          <hr />
          <div className="footer-bottom">
            <p>&copy; {new Date().getFullYear()} EBAY Store. All rights reserved.</p>
          </div>
        </Container>
      </footer>
    </div>
  );
};

export default Homepage;