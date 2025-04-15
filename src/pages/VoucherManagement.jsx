import React, { useState, useEffect } from 'react';
import './VoucherManagement.css';
import { useNavigate } from 'react-router-dom';

const VoucherManagement = () => {
  const [vouchers, setVouchers] = useState([]);
  const [form, setForm] = useState({
    productId: '',
    discountPercentage: '',
    voucherCode: '',
    expiryDate: '',
  });
  const [database, setDatabase] = useState(null);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editVoucherId, setEditVoucherId] = useState(null);
  const [originalForm, setOriginalForm] = useState(null); // Lưu bản gốc của voucher để so sánh
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch products from API
    fetch('http://localhost:9999/products')
      .then((response) => {
        if (!response.ok) throw new Error(`Failed to fetch products: ${response.status}`);
        return response.json();
      })
      .then((data) => {
        if (Array.isArray(data)) setDatabase(data);
        else setError('Products data not found or incorrect format');
      })
      .catch((err) => {
        console.error('Fetch error:', err);
        setError(err.message);
      });

    // Fetch vouchers from API
    fetch('http://localhost:9999/vouchers')
      .then((response) => response.json())
      .then((data) => setVouchers(data))
      .catch((err) => {
        console.error('Failed to load vouchers:', err);
      });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const isSameForm = (a, b) => {
    return (
      a.productId === b.productId &&
      parseFloat(a.discountPercentage) === parseFloat(b.discountPercentage) &&
      a.voucherCode === b.voucherCode &&
      a.expiryDate === b.expiryDate
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      form.productId &&
      form.discountPercentage &&
      form.voucherCode &&
      form.expiryDate &&
      parseFloat(form.discountPercentage) >= 0 &&
      parseFloat(form.discountPercentage) <= 100
    ) {
      const product = database?.find((p) => p.id.toString() === form.productId);
      if (!product || product.quantity <= 0) {
        alert('Selected product is out of stock or not found');
        return;
      }

      if (new Date(form.expiryDate) <= new Date()) {
        alert('Expiry date must be in the future');
        return;
      }

      if (isEditing) {
        // Edit voucher
        if (originalForm && isSameForm(form, originalForm)) {
          alert('Voucher already exists');
          return;
        }

        const updatedVoucher = {
          ...form,
          id: editVoucherId,
          discountPercentage: parseFloat(form.discountPercentage),
        };

        fetch(`http://localhost:9999/vouchers/${editVoucherId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedVoucher),
        })
          .then((response) => {
            if (!response.ok) throw new Error('Failed to update voucher');
            return response.json();
          })
          .then((updatedData) => {
            setVouchers((prevVouchers) =>
              prevVouchers.map((voucher) =>
                voucher.id === updatedData.id ? updatedData : voucher
              )
            );
            setIsEditing(false);
            setEditVoucherId(null);
            setOriginalForm(null);
            setForm({ productId: '', discountPercentage: '', voucherCode: '', expiryDate: '' });
            alert('Voucher updated successfully!');
          })
          .catch((error) => {
            console.error('Update failed:', error);
            alert('Failed to update voucher');
          });

      } else {
        // Create new voucher
        if (vouchers.some((v) => v.voucherCode === form.voucherCode)) {
          alert('Voucher code already exists');
          return;
        }

        const newVoucher = {
          id: `voucher_${vouchers.length + 1}`,
          productId: form.productId,
          voucherCode: form.voucherCode,
          discountPercentage: parseFloat(form.discountPercentage),
          expiryDate: form.expiryDate,
        };

        fetch('http://localhost:9999/vouchers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newVoucher),
        })
          .then((response) => response.json())
          .then((savedVoucher) => {
            setVouchers((prev) => [...prev, savedVoucher]);
            setForm({ productId: '', discountPercentage: '', voucherCode: '', expiryDate: '' });
            alert(`Voucher ${newVoucher.voucherCode} created successfully!`);
          })
          .catch((err) => {
            console.error('Error creating voucher:', err);
            alert('Failed to create voucher');
          });
      }
    } else {
      alert('Please fill in all fields correctly. Discount must be between 0 and 100.');
    }
  };

  const handleEditClick = (voucherId) => {
    const voucherToEdit = vouchers.find((voucher) => voucher.id === voucherId);
    if (voucherToEdit) {
      const formData = {
        productId: voucherToEdit.productId,
        discountPercentage: voucherToEdit.discountPercentage,
        voucherCode: voucherToEdit.voucherCode,
        expiryDate: voucherToEdit.expiryDate,
      };
      setForm(formData);
      setOriginalForm(formData); // Lưu bản gốc để so sánh
      setIsEditing(true);
      setEditVoucherId(voucherId);
    }
  };

  const deleteVoucher = (voucherId) => {
    fetch(`http://localhost:9999/vouchers/${voucherId}`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (!response.ok) throw new Error('Failed to delete voucher');
        setVouchers(vouchers.filter((voucher) => voucher.id !== voucherId));
        alert('Voucher deleted successfully');
      })
      .catch((err) => {
        console.error('Delete error:', err);
        alert('Failed to delete voucher');
      });
  };

  if (error) return <div>Error: {error}</div>;
  if (!database) return <div>Loading products...</div>;

  return (
    <div style={{ padding: '20px' }}>
      <h2>Voucher Management</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <div style={{ marginBottom: '10px' }}>
          <label>Product: </label>
          <select
            name="productId"
            value={form.productId}
            onChange={handleInputChange}
            required
            style={{ padding: '5px', width: '200px' }}
          >
            <option value="">Select a product</option>
            {database.map((product) => (
              <option key={product.id} value={product.id}>
                {product.title || 'Untitled'} (Stock: {product.quantity ?? 0})
              </option>
            ))}
          </select>
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>Discount Percentage: </label>
          <input
            type="number"
            name="discountPercentage"
            value={form.discountPercentage}
            onChange={handleInputChange}
            min="0"
            max="100"
            required
            style={{ padding: '5px', width: '100px' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>Voucher Code: </label>
          <input
            type="text"
            name="voucherCode"
            value={form.voucherCode}
            onChange={handleInputChange}
            required
            style={{ padding: '5px', width: '150px' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>Expiry Date: </label>
          <input
            type="date"
            name="expiryDate"
            value={form.expiryDate}
            onChange={handleInputChange}
            required
            style={{ padding: '5px' }}
          />
        </div>
        <button type="submit" style={{ padding: '8px 16px' }}>
          {isEditing ? 'Save Changes' : 'Create Voucher'}
        </button>
        {isEditing && (
          <button
            type="button"
            onClick={() => {
              setIsEditing(false);
              setEditVoucherId(null);
              setForm({ productId: '', discountPercentage: '', voucherCode: '', expiryDate: '' });
              setOriginalForm(null);
            }}
            style={{ marginLeft: '10px', backgroundColor: 'gray', color: 'white', padding: '8px' }}
          >
            Cancel
          </button>
        )}
      </form>

      <h3>Existing Vouchers</h3>
      {vouchers.length === 0 ? (
        <p>No vouchers created yet.</p>
      ) : (
        <table style={{ width: '100%', border: '1px solid #ddd', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>Voucher Code</th>
              <th>Product</th>
              <th>Discount</th>
              <th>Expiry Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {vouchers.map((voucher) => {
              const product = database.find((p) => p.id.toString() === voucher.productId);
              return (
                <tr key={voucher.id}>
                  <td>{voucher.voucherCode}</td>
                  <td>{product?.title}</td>
                  <td>{voucher.discountPercentage}%</td>
                  <td>{voucher.expiryDate}</td>
                  <td>
                    <button onClick={() => handleEditClick(voucher.id)}>Edit</button>
                    <button onClick={() => deleteVoucher(voucher.id)} style={{ marginLeft: '10px' }}>
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
      <button
        onClick={() => navigate('/')}
        style={{ padding: '8px 16px', marginBottom: '20px' }}
      >
        ← Back to Home
      </button>
    </div>
  );
};

export default VoucherManagement;
