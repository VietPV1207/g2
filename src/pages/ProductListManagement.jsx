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
    const file = e.target.files[0]; // Lấy tệp đầu tiên
    setForm({ ...form, image: file }); // Lưu tệp vào state
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

  const showToast = (message, type = 'success') => {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;

    document.body.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('show');
    }, 100);


    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        document.body.removeChild(toast);
      }, 300);
    }, 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Kiểm tra dữ liệu đầu vào
    if (!form.title.trim()) {
      showToast('Title is required!', 'error');
      return;
    }
    if (!form.description.trim()) {
      showToast('Description is required!', 'error');
      return;
    }
    if (!form.price || isNaN(form.price) || form.price <= 0) {
      showToast('Price must be a positive number!', 'error');
      return;
    }
    if (!form.categoryId) {
      showToast('Category is required!', 'error');
      return;
    }
    if (!form.quantity || isNaN(form.quantity) || form.quantity < 0) {
      showToast('Quantity must be a non-negative number!', 'error');
      return;
    }
    if (!form.image && !isEditing) {
      showToast('Image is required!', 'error');
      return;
    }

    const productData = new FormData();
    productData.append('title', form.title);
    productData.append('description', form.description);
    productData.append('price', form.price);
    productData.append('categoryId', form.categoryId);
    productData.append('status', form.status);
    productData.append('quantity', form.quantity);

    // Kiểm tra nếu người dùng chọn ảnh mới
    if (form.image) {
      productData.append('image', form.image); // Thêm ảnh vào FormData
    }

    try {
      if (isEditing) {
        let updatedImageUrl = originalForm.url; // Giữ nguyên ảnh cũ nếu không có ảnh mới

        if (form.image) {
          // Upload ảnh mới nếu có
          const uploadResponse = await fetch('http://localhost:3000/product/upload', {
            method: 'POST',
            body: productData,
          });
          const uploadData = await uploadResponse.json();
          updatedImageUrl = uploadData.path; // Lấy đường dẫn ảnh mới từ API
        }

        // Cập nhật sản phẩm với đường dẫn ảnh mới
        const updatedProductData = {
          ...form,
          url: updatedImageUrl, // Cập nhật url thay vì image
        };

        const response = await fetch(`http://localhost:9999/products/${editProductId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedProductData),
        });

        const updatedProduct = await response.json();
        setProducts((prev) =>
          prev.map((product) => (product.id === updatedProduct.id ? updatedProduct : product))
        );
        showToast('Product updated successfully!', 'success');
      } else {
        // Nếu thêm sản phẩm mới
        const uploadResponse = await fetch('http://localhost:3000/product/upload', {
          method: 'POST',
          body: productData,
        });
        const uploadData = await uploadResponse.json();

        const newProductData = {
          ...form,
          url: uploadData.path, // Lấy đường dẫn ảnh từ API
        };

        const response = await fetch('http://localhost:9999/products', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newProductData),
        });

        const newProduct = await response.json();
        setProducts((prev) => [...prev, newProduct]);
        showToast('Product added successfully!', 'success');
      }

      resetForm();
    } catch (error) {
      console.error('Error:', error);
      showToast('An error occurred. Please try again.', 'error');
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
    // Kiểm tra nếu image là chuỗi
    const imageFilename = typeof image === 'string' ? image.split('/').pop() : null;

    if (imageFilename) {
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
              showToast('Product deleted successfully!', 'success');
            })
            .catch(() => alert('Delete product failed'));
        })
        .catch(() => alert('Delete image failed'));
    } else {
      // Nếu không có ảnh, chỉ xóa sản phẩm
      fetch(`http://localhost:9999/products/${id}`, {
        method: 'DELETE',
      })
        .then(() => {
          setProducts(products.filter((p) => p.id !== id));
          showToast('Product deleted successfully!', 'success');
        })
        .catch(() => alert('Delete product failed'));
    }
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
    <div className="container ">

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
          <div className=''>
            <thead>
              <tr>
                <th>Image</th> {/* Thêm cột Image */}
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
                  <td>
                    <img
                      src={product.url} // Sử dụng product.url thay vì product.image
                      alt={product.title}
                      style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                    />
                  </td> {/* Hiển thị ảnh */}
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
          </div>
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
