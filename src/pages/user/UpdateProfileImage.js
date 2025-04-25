import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../UserContext';
import { Modal, Button } from 'react-bootstrap';

const UpdateProfileImage = () => {
    const { user, setUser } = useUser();
    const navigate = useNavigate();
    const [selectedFile, setSelectedFile] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [showModal, setShowModal] = useState(false);

    // Danh sách các tên file không được xóa (ví dụ, ảnh mặc định)
    const protectedFiles = ['guestava.jpg', 'admin.webp', 'cheems.png'];


    // Handle file selection from input
    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedFile) {
            setErrorMessage("Please select an image file.");
            return;
        }

        try {
            const formData = new FormData();
            formData.append("image", selectedFile);

            // Always use the POST endpoint to upload the new image
            const res = await axios.post('http://localhost:3000/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            // Retrieve the new image URL from the response
            const newImageURL = res.data.path;

            // Optionally: if the user already has an image,
            // extract the old filename and delete it from the server.
            // Uncomment the lines below if you want to delete the old image.

            if (user.image && user.image.trim() !== "") {
                const pathParts = user.image.split('/');
                const oldFilename = pathParts[pathParts.length - 1];
                // Nếu tên file của ảnh cũ không thuộc danh sách "protectedFiles", thì xóa
                if (!protectedFiles.includes(oldFilename)) {
                    await axios.delete(`http://localhost:3000/delete/${oldFilename}`);
                }
            }


            // Create an updated user object with the new image URL
            const updatedUser = { ...user, image: newImageURL };

            // Update the user record in the database (db.json) using a PUT request
            await axios.put(`http://localhost:9999/user/${user.id}`, updatedUser);

            // Update global state and localStorage
            setUser(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser));

            // Clear error messages and show the success modal
            setErrorMessage('');
            setShowModal(true);
        } catch (error) {
            console.error("Error updating user image:", error);
            setErrorMessage("Failed to update profile image. Please try again later.");
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
            <div className="container mt-5">
                <h2>Update Profile Image</h2>
                {errorMessage && (
                    <div className="alert alert-danger" role="alert">
                        {errorMessage}
                    </div>
                )}
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="profileImage" className="form-label">
                            Choose Image
                        </label>
                        <input
                            type="file"
                            id="profileImage"
                            className="form-control"
                            accept="image/*"
                            onChange={handleFileChange}
                        />
                    </div>
                    <div className="d-flex justify-content-between">
                        <Button variant="warning" onClick={() => navigate('/profile')}>
                            Cancel
                        </Button>
                        <button type="submit" className="btn btn-primary">
                            Update Image
                        </button>
                    </div>
                </form>
            </div>

            {/* Success Modal */}
            <Modal show={showModal} onHide={handleCloseModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Success</Modal.Title>
                </Modal.Header>
                <Modal.Body>Your profile image has been updated successfully!</Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleCloseModal}>
                        OK
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default UpdateProfileImage;
