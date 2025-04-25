import React, { useState, useEffect } from 'react';
import './ProductManagement.css';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '',
    categoryId: '',
    image: null,  // Changed from 'url' to 'image' to handle file
    status: 'available',
    quantity: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editProductId, setEditProductId] = useState(null);
  const [originalForm, setOriginalForm] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetch('http://localhost:9999/products')
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error('Error fetching products:', err));

    fetch('http://localhost:9999/categories')
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error('Error fetching categories:', err));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0]; // Get the first file
    setForm({ ...form, image: file }); // Save the selected file
  };

  const isSameForm = (a, b) => {
    return (
      a.title === b.title &&
      a.description === b.description &&
      parseFloat(a.price) === parseFloat(b.price) &&
      a.categoryId === b.categoryId &&
      a.status === b.status &&
      parseInt(a.quantity) === parseInt(b.quantity) &&
      a.image === b.image // Compare the image files as well
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const productData = new FormData();
    productData.append('title', form.title);
    productData.append('description', form.description);
    productData.append('price', form.price);
    productData.append('categoryId', form.categoryId);
    productData.append('status', form.status);
    productData.append('quantity', form.quantity);

    if (form.image) {
      productData.append('image', form.image); // Append the image file to FormData
    }

    if (isEditing) {
      if (originalForm && isSameForm(form, originalForm)) {
        alert('No changes detected');
        return;
      }

      // Lấy tên file của ảnh cũ
      const oldImageFilename = originalForm.image.split('/').pop(); // Extract old image filename

      // Upload the updated image first
      fetch(`http://localhost:3000/product/update/${oldImageFilename}`, {
        method: 'PUT',
        body: productData, // Sending FormData
      })
        .then((res) => res.json())
        .then((data) => {
          // After updating the image, update the product data with the new image URL
          const updatedProductData = {
            ...form,
            image: data.path, // Sử dụng đường dẫn ảnh trả về từ API
          };

          fetch(`http://localhost:9999/products/${editProductId}`, {
            method: 'PUT',
            body: JSON.stringify(updatedProductData), // Sending updated product data with new image URL
            headers: {
              'Content-Type': 'application/json', // Send as JSON
            },
          })
            .then((res) => res.json())
            .then((updated) => {
              setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
              resetForm();
              alert('Product updated successfully!');
            })
            .catch(() => alert('Product update failed'));
        })
        .catch(() => alert('Image update failed'));

    } else {
      // Upload the image and create a new product
      fetch('http://localhost:3000/product/upload', {
        method: 'POST',
        body: productData, // Sending FormData
      })
        .then((res) => res.json())
        .then((data) => {
          // After successfully uploading the image, add the image path to the product
          const newProduct = {
            ...form,
            image: data.path, // Save the image path returned from the server
            id: crypto.randomUUID(),
          };

          // Send the product data to create the product in the database
          fetch('http://localhost:9999/products', {
            method: 'POST',
            body: JSON.stringify(newProduct), // Sending product data
            headers: {
              'Content-Type': 'application/json',
            },
          })
            .then((res) => res.json())
            .then((created) => {
              setProducts((prev) => [...prev, created]);
              resetForm();
              alert('Product created successfully!');
            })
            .catch(() => alert('Create failed'));
        })
        .catch(() => alert('Image upload failed'));
    }
  };

  const handleEdit = (product) => {
    const shouldEdit = window.confirm('Do you want to edit this product?');
    if (shouldEdit) {
      setForm({
        title: product.title,
        description: product.description,
        price: product.price,
        categoryId: product.categoryId,
        image: product.image, // You can display the existing image here if needed
        status: product.status,
        quantity: product.quantity,
      });
      setOriginalForm({ ...product });
      setEditProductId(product.id);
      setIsEditing(true);
      setShowModal(true);
    }
  };

  const handleDelete = (id, image) => {
    // Trích xuất tên file hình ảnh từ đường dẫn
    const imageFilename = image.split('/').pop(); // Lấy phần cuối của URL hình ảnh (tên file)

    // Gửi yêu cầu xóa ảnh sản phẩm trước khi xóa sản phẩm
    fetch(`http://localhost:3000/product/delete/${imageFilename}`, {
      method: 'DELETE',
    })
      .then((res) => res.json())
      .then(() => {
        // Sau khi xóa ảnh, xóa sản phẩm trong cơ sở dữ liệu
        fetch(`http://localhost:9999/products/${id}`, {
          method: 'DELETE',
        })
          .then(() => {
            setProducts(products.filter((p) => p.id !== id));
            alert('Product and image deleted successfully!');
          })
          .catch(() => alert('Delete product failed'));
      })
      .catch(() => alert('Delete image failed'));
  };



  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory ? String(product.categoryId) === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const currentProducts = filteredProducts.slice(startIdx, startIdx + itemsPerPage);

  const resetForm = () => {
    setForm({
      title: '',
      description: '',
      price: '',
      categoryId: '',
      image: null,  // Reset image field
      status: 'available',
      quantity: '',
    });
    setIsEditing(false);
    setEditProductId(null);
    setOriginalForm(null);
    setShowModal(false);
  };

  const getCategoryName = (id) => {
    const category = categories.find((c) => String(c.id) === String(id));
    return category ? category.name : id;
  };

  return (
    <div className="container">
      <button className="add-btn" onClick={() => setShowModal(true)}>Add Product</button>

      <div className="filter-controls m-5">
        <input
          type="text"
          placeholder="Search by title..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1); // Reset to page 1 when searching
          }}
        />
        <select
          value={selectedCategory}
          onChange={(e) => {
            setSelectedCategory(e.target.value);
            setCurrentPage(1);
          }}
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="modal-close" onClick={resetForm}>×</button>
            <h3>{isEditing ? 'Edit Product' : 'Add Product'}</h3>
            <form onSubmit={handleSubmit}>
              <label>Title</label>
              <input type="text" name="title" value={form.title} onChange={handleInputChange} required />

              <label>Description</label>
              <input type="text" name="description" value={form.description} onChange={handleInputChange} required />

              <label>Price</label>
              <input type="number" name="price" value={form.price} onChange={handleInputChange} required />

              <label>Category</label>
              <select name="categoryId" value={form.categoryId} onChange={handleInputChange} required>
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>

              <label>Image</label>
              <input type="file" name="image" onChange={handleFileChange} required />

              <label>Status</label>
              <select name="status" value={form.status} onChange={handleInputChange}>
                <option value="available">Available</option>
                <option value="unavailable">Unavailable</option>
              </select>

              <label>Quantity</label>
              <input type="number" name="quantity" value={form.quantity} onChange={handleInputChange} required />

              <button type="submit">{isEditing ? 'Update Product' : 'Add Product'}</button>
              <button type="button" onClick={resetForm} className="cancel">Cancel</button>
            </form>
          </div>
        </div>
      )}

      {currentProducts.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Price</th>
              <th>Category</th>
              <th>Status</th>
              <th>Quantity</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentProducts.map((product) => (
              <tr key={product.id}>
                <td>{product.title}</td>
                <td>{product.description}</td>
                <td>${product.price}</td>
                <td>{getCategoryName(product.categoryId)}</td>
                <td>{product.status}</td>
                <td>{product.quantity}</td>
                <td>
                  <button className="edit" onClick={() => handleEdit(product)}>Edit</button>
                  <button className="delete" onClick={() => handleDelete(product.id, product.image)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="pagination">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={currentPage === i + 1 ? 'active' : ''}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductManagement;
