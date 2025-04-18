import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Card, Alert, Spinner, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { useUser } from './UserContext';

const StoreProfile = () => {
  const { user } = useUser();
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form state
  const [storeName, setStoreName] = useState('');
  const [description, setDescription] = useState('');
  const [banners, setBanners] = useState([{ url: '', title: '' }]); // Array of banner objects

  useEffect(() => {
    const fetchStoreData = async () => {
      try {
        if (user && (user.role === 'seller' || user.role === 'admin')) {
          const response = await axios.get('http://localhost:9999/stores');
          const stores = response.data;
          
          const userStore = stores.find(s => s.seller_ids.includes(user.id));
          
          if (userStore) {
            setStore(userStore);
            setStoreName(userStore.storeName);
            setDescription(userStore.description);
            
            // Initialize banners from store data
            if (userStore.banners && userStore.banners.length > 0) {
              setBanners(userStore.banners);
            } else if (userStore.bannerImageURL) {
              // Backward compatibility for stores with single banner
              setBanners([{
                url: userStore.bannerImageURL,
                title: userStore.storeName
              }]);
            }
          } else {
            setError('No store found for this seller');
          }
        } else {
          setError('Only sellers can manage store profiles');
        }
      } catch (err) {
        setError(`Error fetching store data: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchStoreData();
  }, [user]);

  const handleBannerChange = (index, field, value) => {
    const updatedBanners = [...banners];
    updatedBanners[index] = {
      ...updatedBanners[index],
      [field]: value
    };
    setBanners(updatedBanners);
  };

  const addBanner = () => {
    setBanners([...banners, { url: '', title: '' }]);
  };

  const removeBanner = (index) => {
    if (banners.length > 1) {
      const updatedBanners = [...banners];
      updatedBanners.splice(index, 1);
      setBanners(updatedBanners);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      // Filter out empty banner URLs
      const filteredBanners = banners.filter(banner => banner.url.trim() !== '');
      
      if (filteredBanners.length === 0) {
        throw new Error('At least one banner with a valid URL is required');
      }
      
      // Update the store with new data
      const updatedStore = {
        ...store,
        storeName,
        description,
        banners: filteredBanners,
        // Keep bannerImageURL for backward compatibility
        bannerImageURL: filteredBanners[0].url
      };
      
      await axios.put(`http://localhost:9999/stores/${store.id}`, updatedStore);
      setSuccess('Store profile updated successfully!');
      setStore(updatedStore);
      setBanners(filteredBanners);
    } catch (err) {
      setError(`Failed to update store profile: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !store) {
    return (
      <>
        <Navbar />
        <Container className="mt-5 text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </Container>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <Container className="mt-4">
        <Card>
          <Card.Header className="bg-primary text-white">
            <h2>Store Profile Management</h2>
          </Card.Header>
          <Card.Body>
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}
            
            {store ? (
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Store Name</Form.Label>
                  <Form.Control 
                    type="text" 
                    value={storeName} 
                    onChange={(e) => setStoreName(e.target.value)}
                    required
                  />
                </Form.Group>
                
                <Card className="mb-4">
                  <Card.Header className="d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">Store Banners</h5>
                    <Button 
                      variant="success" 
                      size="sm" 
                      onClick={addBanner}
                    >
                      Add Banner
                    </Button>
                  </Card.Header>
                  <Card.Body>
                    {banners.map((banner, index) => (
                      <Row key={index} className="mb-3 pb-3 border-bottom">
                        <Col md={5}>
                          <Form.Group>
                            <Form.Label>Banner URL #{index + 1}</Form.Label>
                            <Form.Control 
                              type="text" 
                              value={banner.url} 
                              onChange={(e) => handleBannerChange(index, 'url', e.target.value)}
                              required={index === 0}
                              placeholder="Enter image URL"
                            />
                          </Form.Group>
                        </Col>
                        <Col md={5}>
                          <Form.Group>
                            <Form.Label>Banner Title #{index + 1}</Form.Label>
                            <Form.Control 
                              type="text" 
                              value={banner.title} 
                              onChange={(e) => handleBannerChange(index, 'title', e.target.value)}
                              placeholder="Enter banner title"
                            />
                          </Form.Group>
                        </Col>
                        <Col md={2} className="d-flex align-items-end">
                          <Button 
                            variant="danger" 
                            size="sm" 
                            onClick={() => removeBanner(index)}
                            disabled={banners.length <= 1}
                            className="mb-2"
                          >
                            Remove
                          </Button>
                        </Col>
                        {banner.url && (
                          <Col xs={12} className="mt-2">
                            <img 
                              src={banner.url} 
                              alt={`Banner Preview ${index + 1}`} 
                              style={{ maxWidth: '100%', height: 'auto', maxHeight: '150px' }}
                              onError={(e) => e.target.src = "https://via.placeholder.com/800x200?text=Invalid+Image+URL"}
                            />
                          </Col>
                        )}
                      </Row>
                    ))}
                  </Card.Body>
                </Card>
                
                <Form.Group className="mb-3">
                  <Form.Label>Store Description</Form.Label>
                  <Form.Control 
                    as="textarea" 
                    rows={4} 
                    value={description} 
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  />
                </Form.Group>
                
                <Button 
                  variant="primary" 
                  type="submit" 
                  disabled={loading}
                >
                  {loading ? 'Updating...' : 'Update Store Profile'}
                </Button>
              </Form>
            ) : (
              <Alert variant="warning">
                No store associated with your account. Please contact an administrator.
              </Alert>
            )}
          </Card.Body>
        </Card>
      </Container>
    </>
  );
};

export default StoreProfile;