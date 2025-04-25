import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useUser } from '../UserContext'; 
import { Modal, Button } from 'react-bootstrap';
import axios from 'axios';

const EditProfile = () => {
  const { user, setUser } = useUser();
  const navigate = useNavigate();

  // Local state for form fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [street, setStreet] = useState('');
  const [zipcode, setZipcode] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [errors, setErrors] = useState({});

  // State to control the success modal display
  const [showModal, setShowModal] = useState(false);

  // Pre-fill the form fields when the component mounts or the user changes
  useEffect(() => {
    if (user) {
      setFullName(user.fullname || '');
      setEmail(user.email || '');
      setStreet(user.address?.street || '');
      setZipcode(user.address?.zipcode || '');
      setCity(user.address?.city || '');
      setCountry(user.address?.country || '');
    }
  }, [user]);

  // Validation function to check each field
  const validate = () => {
    let validationErrors = {};
    if (!fullName.trim()) {
      validationErrors.fullName = "Full Name is required.";
    }

    if (!email.trim()) {
      validationErrors.email = "Email is required.";
    } else {
      // Basic email validation pattern
      const emailPattern = /^\S+@\S+\.\S+$/;
      if (!emailPattern.test(email)) {
        validationErrors.email = "Invalid email address.";
      }
    }

    if (!street.trim()) {
      validationErrors.street = "Street is required.";
    }

    if (!zipcode.trim()) {
      validationErrors.zipcode = "Zipcode is required.";
    }

    if (!city.trim()) {
      validationErrors.city = "City is required.";
    }

    if (!country.trim()) {
      validationErrors.country = "Country is required.";
    }

    return validationErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Run validation on all fields
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return; // Stop submission if there are errors
    }
    setErrors({}); // Clear any previous errors

    // Create an updated user object using the new values
    const updatedUser = {
      ...user,
      fullname: fullName,
      email,
      address: {
        street,
        zipcode,
        city,
        country
      },
    };

    try {
      // Update the user record in the backend (db.json via json-server)
      await axios.put(`http://localhost:9999/user/${user.id}`, updatedUser);

      // Update the global user state and localStorage
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));

      // Optionally clear error message
      setErrorMessage('');

      // Show the success modal
      setShowModal(true);
    } catch (error) {
      console.error('Error updating user in db.json:', error);
      setErrorMessage('Failed to update profile. Please try again later.');
    }
  };

  // Handle modal close and redirect
  const handleCloseModal = () => {
    setShowModal(false);
    navigate('/profile');
  };

  if (!user) {
    return (
      <div className="container mt-5">
        <h2>You are not logged in!</h2>
      </div>
    );
  }

  return (
    <>
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            <div className="card">
              <div className="card-header text-center bg-primary">
                <h3 className="mb-0 text-white">Edit Profile</h3>
              </div>
              <div className="card-body">
                {errorMessage && (
                  <div className="alert alert-danger" role="alert">
                    {errorMessage}
                  </div>
                )}
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="fullName" className="form-label">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      className="form-control"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Enter full name"
                      required
                    />
                    {errors.fullName && (
                      <div className="text-danger mt-1">{errors.fullName}</div>
                    )}
                  </div>

                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      className="form-control"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter email"
                      required
                    />
                    {errors.email && (
                      <div className="text-danger mt-1">{errors.email}</div>
                    )}
                  </div>

                  <div className="mb-3">
                    <label htmlFor="street" className="form-label">
                      Street
                    </label>
                    <input
                      type="text"
                      id="street"
                      className="form-control"
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                      placeholder="Enter street"
                      required
                    />
                    {errors.street && (
                      <div className="text-danger mt-1">{errors.street}</div>
                    )}
                  </div>

                  <div className="mb-3">
                    <label htmlFor="zipcode" className="form-label">
                      Zipcode
                    </label>
                    <input
                      type="text"
                      id="zipcode"
                      className="form-control"
                      value={zipcode}
                      onChange={(e) => setZipcode(e.target.value)}
                      placeholder="Enter zipcode"
                      required
                    />
                    {errors.zipcode && (
                      <div className="text-danger mt-1">{errors.zipcode}</div>
                    )}
                  </div>

                  <div className="mb-3">
                    <label htmlFor="city" className="form-label">
                      City
                    </label>
                    <input
                      type="text"
                      id="city"
                      className="form-control"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Enter city"
                      required
                    />
                    {errors.city && (
                      <div className="text-danger mt-1">{errors.city}</div>
                    )}
                  </div>

                  <div className="mb-3">
                    <label htmlFor="country" className="form-label">
                      Country
                    </label>
                    <input
                      type="text"
                      id="country"
                      className="form-control"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      placeholder="Enter country"
                      required
                    />
                    {errors.country && (
                      <div className="text-danger mt-1">{errors.country}</div>
                    )}
                  </div>

                  <div className="d-flex justify-content-between">
                    <button type="submit" className="btn btn-primary">
                      Save Changes
                    </button>
                    <Link to="/profile"
                      type="button"
                      className="btn btn-warning"
                    >
                      Cancel
                    </Link>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Success</Modal.Title>
        </Modal.Header>
        <Modal.Body>Your profile has been updated successfully!</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleCloseModal}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default EditProfile;
