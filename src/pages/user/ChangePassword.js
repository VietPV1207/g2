import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useUser } from '../UserContext'; 
import { Modal, Button } from 'react-bootstrap';
import axios from 'axios';

const ChangePassword = () => {
  const { user, setUser } = useUser();
  const navigate = useNavigate();

  // Local state for the input fields
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // State for validation errors and success modal
  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState('');
  const [showModal, setShowModal] = useState(false);

  // State to toggle show/hide password for each field
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Validation function
  const validate = () => {
    let validationErrors = {};

    if (!currentPassword) {
      validationErrors.currentPassword = "Current password is required.";
    } else if (user && currentPassword !== user.password) {
      // For demo purposes, comparing plain text (do not do this in production)
      validationErrors.currentPassword = "Current password is incorrect.";
    }

    if (!newPassword) {
      validationErrors.newPassword = "New password is required.";
    }

    if (!confirmPassword) {
      validationErrors.confirmPassword = "Please confirm your new password.";
    }

    if (newPassword && confirmPassword && newPassword !== confirmPassword) {
      validationErrors.confirmPassword = "New password and confirmation do not match.";
    }

    return validationErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Clear errors
    setErrors({});
    setErrorMessage('');

    // Create the updated user object with the new password
    const updatedUser = { ...user, password: newPassword };

    try {
      // Update the user in the database using a PUT request.
      await axios.put(`http://localhost:9999/user/${user.id}`, updatedUser);

      // Update global state and localStorage
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));

      // Show success modal
      setShowModal(true);
    } catch (error) {
      console.error('Error updating user in db.json:', error);
      setErrorMessage('Failed to update password. Please try again later.');
    }
  };

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
      {/* Main Content */}
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            <div className="card">
              <div className="card-header text-center bg-primary">
                <h3 className="mb-0 text-white">Change Password</h3>
              </div>
              <div className="card-body">
                {errorMessage && (
                  <div className="alert alert-danger" role="alert">
                    {errorMessage}
                  </div>
                )}
                <form onSubmit={handleSubmit}>
                  {/* Current Password */}
                  <div className="mb-3">
                    <label htmlFor="currentPassword" className="form-label">
                      Current Password
                    </label>
                    <div className="input-group">
                      <input
                        type={showCurrent ? 'text' : 'password'}
                        id="currentPassword"
                        className="form-control"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="Enter current password"
                        required
                      />
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() => setShowCurrent(!showCurrent)}
                      >
                        {showCurrent ? 'Hide' : 'Show'}
                      </button>
                    </div>
                    {errors.currentPassword && (
                      <div className="text-danger mt-1">{errors.currentPassword}</div>
                    )}
                  </div>

                  {/* New Password */}
                  <div className="mb-3">
                    <label htmlFor="newPassword" className="form-label">
                      New Password
                    </label>
                    <div className="input-group">
                      <input
                        type={showNew ? 'text' : 'password'}
                        id="newPassword"
                        className="form-control"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Enter new password"
                        required
                      />
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() => setShowNew(!showNew)}
                      >
                        {showNew ? 'Hide' : 'Show'}
                      </button>
                    </div>
                    {errors.newPassword && (
                      <div className="text-danger mt-1">{errors.newPassword}</div>
                    )}
                  </div>

                  {/* Confirm New Password */}
                  <div className="mb-3">
                    <label htmlFor="confirmPassword" className="form-label">
                      Confirm New Password
                    </label>
                    <div className="input-group">
                      <input
                        type={showConfirm ? 'text' : 'password'}
                        id="confirmPassword"
                        className="form-control"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm new password"
                        required
                      />
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() => setShowConfirm(!showConfirm)}
                      >
                        {showConfirm ? 'Hide' : 'Show'}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <div className="text-danger mt-1">{errors.confirmPassword}</div>
                    )}
                  </div>

                  <div className="d-flex justify-content-between">
                    <button type="submit" className="btn btn-primary">
                      Save Changes
                    </button>
                    <Link to="/"
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
        <Modal.Body>Your password has been updated successfully!</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleCloseModal}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ChangePassword;
