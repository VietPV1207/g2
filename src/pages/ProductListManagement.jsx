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
    url: '',
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

  const isSameForm = (a, b) => {
    return (
      a.title === b.title &&
      a.description === b.description &&
      parseFloat(a.price) === parseFloat(b.price) &&
      a.categoryId === b.categoryId &&
      a.url === b.url &&
      a.status === b.status &&
      parseInt(a.quantity) === parseInt(b.quantity)
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const productData = {
      ...form,
      price: parseFloat(form.price),
      categoryId: form.categoryId,
      quantity: parseInt(form.quantity),
      status: form.status || 'available',
    };

    if (isEditing) {
      if (originalForm && isSameForm(form, originalForm)) {
        alert('No changes detected');
        return;
      }

      fetch(`http://localhost:9999/products/${editProductId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      })
        .then((res) => res.json())
        .then((updated) => {
          setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
          resetForm();
          alert('Product updated successfully!');
        })
        .catch(() => alert('Update failed'));
    } else {
      const newProduct = { ...productData, id: crypto.randomUUID() };
      fetch('http://localhost:9999/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProduct),
      })
        .then((res) => res.json())
        .then((created) => {
          setProducts((prev) => [...prev, created]);
          resetForm();
          alert('Product created successfully!');
        })
        .catch(() => alert('Create failed'));
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
        url: product.url,
        status: product.status,
        quantity: product.quantity,
      });
      setOriginalForm({ ...product });
      setEditProductId(product.id);
      setIsEditing(true);
      setShowModal(true);
    }
  };

  const handleDelete = (id) => {
    fetch(`http://localhost:9999/products/${id}`, {
      method: 'DELETE',
    })
      .then(() => {
        setProducts(products.filter((p) => p.id !== id));
        alert('Product deleted');
      })
      .catch(() => alert('Delete failed'));
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
      url: '',
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
            setCurrentPage(1); // Reset về trang 1 khi search
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

              <label>Image URL</label>
              <input type="text" name="url" value={form.url} onChange={handleInputChange} required />

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
                  <button className="delete" onClick={() => handleDelete(product.id)}>Delete</button>
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
