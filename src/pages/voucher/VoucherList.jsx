import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { Modal } from 'bootstrap';
import './VoucherList.css'; 

const API_URL = 'http://localhost:9999/voucher';
const PRODUCTS_URL = 'http://localhost:9999/products';

const VoucherList = () => {
  const [vouchers, setVouchers] = useState([]);
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    id: null,
    code: '',
    name: '',
    discountType: 'percentage',
    discountValue: '',
    startDate: '',
    endDate: '',
    isActive: true,
    productIds: []
  });
  const [formErrors, setFormErrors] = useState({});
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [vouchersResponse, productsResponse] = await Promise.all([
          fetch(API_URL).then(res => res.json()),
          fetch(PRODUCTS_URL).then(res => res.json())
        ]);
        
        setVouchers(vouchersResponse);
        setProducts(Array.isArray(productsResponse) ? productsResponse : [productsResponse]);
      } catch (err) {
        console.error('Data fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatDate = (dateString) => new Date(dateString).toLocaleDateString('en-US');

  // Format today's date as YYYY-MM-DD for date input min attribute
  const getTodayFormatted = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));

    // Clear error when user changes the field
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: null }));
    }

    // Validate dates when they change
    if (name === 'startDate' || name === 'endDate') {
      validateDates(name, value, form);
    }
  };

  const handleProductSelectChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
    setForm(prev => ({ ...prev, productIds: selectedOptions }));
  };

  const validateDates = (fieldName, value, currentForm) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time part for accurate date comparison

    const errors = { ...formErrors };

    if (fieldName === 'startDate') {
      const startDate = new Date(value);

      // Validate start date is not in the past
      if (startDate < today) {
        errors.startDate = 'Start date cannot be in the past';
      } else {
        errors.startDate = null;
      }

      // Validate start date is before end date if end date exists
      if (currentForm.endDate && startDate > new Date(currentForm.endDate)) {
        errors.startDate = 'Start date must be before end date';
      }
    }

    if (fieldName === 'endDate') {
      const endDate = new Date(value);
      const startDate = new Date(currentForm.startDate);

      // Validate end date is after start date if start date exists
      if (currentForm.startDate && endDate < startDate) {
        errors.endDate = 'End date must be after start date';
      } else {
        errors.endDate = null;
      }
    }

    setFormErrors(errors);
  };

  const validateForm = () => {
    const errors = {};
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Validate required fields
    if (!form.code) errors.code = 'Code is required';
    if (!form.name) errors.name = 'Name is required';
    if (!form.discountValue) errors.discountValue = 'Discount value is required';
    if (!form.startDate) errors.startDate = 'Start date is required';
    if (!form.endDate) errors.endDate = 'End date is required';
    if (!form.productIds || form.productIds.length === 0) errors.productIds = 'Please select at least one product';

    // Validate start date not in past
    if (form.startDate) {
      const startDate = new Date(form.startDate);
      if (startDate < today) {
        errors.startDate = 'Start date cannot be in the past';
      }
    }

    // Validate end date after start date
    if (form.startDate && form.endDate) {
      const startDate = new Date(form.startDate);
      const endDate = new Date(form.endDate);
      if (endDate < startDate) {
        errors.endDate = 'End date must be after start date';
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const resetForm = () => {
    setForm({
      id: null,
      code: '',
      name: '',
      discountType: 'percentage',
      discountValue: '',
      startDate: '',
      endDate: '',
      isActive: true,
      productIds: []
    });
    setFormErrors({});
    setIsEditMode(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form before submission
    if (!validateForm()) {
      return; // Stop submission if validation fails
    }

    const payload = {
      ...form,
      discountValue: Number(form.discountValue)
    };

    if (!isEditMode) {
      delete payload.id;
    }

    try {
      if (isEditMode && form.id) {
        await fetch(`${API_URL}/${form.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } else {
        await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }

      const updated = await fetch(API_URL).then(res => res.json());
      setVouchers(updated);
      resetForm();

      const modalEl = document.getElementById('voucherModal');
      const modalInstance = Modal.getInstance(modalEl) || new Modal(modalEl);
      modalInstance.hide();
    } catch (error) {
      console.error('Error saving voucher:', error);
      alert('Failed to save voucher. Please try again.');
    }
  };

  const handleEdit = (voucher) => {
    // Ensure productIds is an array
    const productIds = voucher.productIds || [];
    
    setForm({
      ...voucher,
      productIds
    });
    setIsEditMode(true);
    setFormErrors({});
    const modal = new Modal(document.getElementById('voucherModal'));
    modal.show();
  };

  const deleteVoucher = async (id) => {
    if (window.confirm('Are you sure you want to delete this voucher?')) {
      try {
        await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        const updated = vouchers.filter(v => v.id !== id);
        setVouchers(updated);
      } catch (error) {
        console.error('Error deleting voucher:', error);
        alert('Failed to delete voucher. Please try again.');
      }
    }
  };

  // Helper function to get product titles for a voucher
  const getProductTitles = (productIds) => {
    if (!productIds || productIds.length === 0) return 'No products selected';
    
    return productIds.map(id => {
      const product = products.find(p => p.id === id);
      return product ? product.title : `Product #${id}`;
    }).join(', ');
  };

  if (loading) {
    return <div className="text-center p-5">Loading vouchers and products...</div>;
  }

  return (
    <div className="voucher-container">
      <h1 className="voucher-header">Voucher Management</h1>
      <button
        className="btn btn-primary mb-3"
        onClick={() => {
          resetForm();
          const modal = new Modal(document.getElementById('voucherModal'));
          modal.show();
        }}
      >
        Add Voucher
      </button>

      {/* Modal */}
      <div className="modal fade" id="voucherModal" tabIndex="-1" aria-labelledby="voucherModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content shadow-lg border-0 rounded-4">
            <div className="modal-header border-bottom-0">
              <h5 className="modal-title fw-bold" id="voucherModalLabel">
                {isEditMode ? 'Edit Voucher' : 'Create New Voucher'}
              </h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Voucher Code</label>
                    <input
                      name="code"
                      className={`form-control ${formErrors.code ? 'is-invalid' : ''}`}
                      placeholder="Enter voucher code"
                      value={form.code}
                      onChange={handleChange}
                      required
                    />
                    {formErrors.code && <div className="invalid-feedback">{formErrors.code}</div>}
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Voucher Name</label>
                    <input
                      name="name"
                      className={`form-control ${formErrors.name ? 'is-invalid' : ''}`}
                      placeholder="Enter voucher name"
                      value={form.name}
                      onChange={handleChange}
                      required
                    />
                    {formErrors.name && <div className="invalid-feedback">{formErrors.name}</div>}
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Discount Type</label>
                    <select
                      name="discountType"
                      className="form-select"
                      value={form.discountType}
                      onChange={handleChange}
                    >
                      <option value="percentage">Percentage</option>
                      <option value="fixed">Fixed Amount ($)</option>
                    </select>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Discount Value</label>
                    <input
                      name="discountValue"
                      type="number"
                      className={`form-control ${formErrors.discountValue ? 'is-invalid' : ''}`}
                      placeholder="Enter discount value"
                      value={form.discountValue}
                      onChange={handleChange}
                      required
                    />
                    {formErrors.discountValue && <div className="invalid-feedback">{formErrors.discountValue}</div>}
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Start Date</label>
                    <input
                      name="startDate"
                      type="date"
                      className={`form-control ${formErrors.startDate ? 'is-invalid' : ''}`}
                      value={form.startDate}
                      min={getTodayFormatted()}
                      onChange={handleChange}
                      required
                    />
                    {formErrors.startDate && <div className="invalid-feedback">{formErrors.startDate}</div>}
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">End Date</label>
                    <input
                      name="endDate"
                      type="date"
                      className={`form-control ${formErrors.endDate ? 'is-invalid' : ''}`}
                      value={form.endDate}
                      min={form.startDate || getTodayFormatted()}
                      onChange={handleChange}
                      required
                    />
                    {formErrors.endDate && <div className="invalid-feedback">{formErrors.endDate}</div>}
                  </div>

                  <div className="col-12">
                    <label className="form-label">Applicable Products</label>
                    <select
                      name="productIds"
                      className={`form-select ${formErrors.productIds ? 'is-invalid' : ''}`}
                      multiple
                      value={form.productIds}
                      onChange={handleProductSelectChange}
                      style={{ height: '120px' }}
                      required
                    >
                      {products.map(product => (
                        <option key={product.id} value={product.id}>
                          {product.title} - ${product.price}
                        </option>
                      ))}
                    </select>
                    <small className="text-muted">Hold Ctrl/Cmd to select multiple products</small>
                    {formErrors.productIds && <div className="invalid-feedback">{formErrors.productIds}</div>}
                  </div>
                </div>
              </div>

              <div className="modal-footer border-top-0 d-flex justify-content-end gap-2">
                <button type="button" className="btn btn-outline-secondary" data-bs-dismiss="modal">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {isEditMode ? 'Save' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Table */}
      <table className="table table-striped table-bordered mt-4">
        <thead className="table-primary">
          <tr>
            <th>Code</th>
            <th>Name</th>
            <th>Discount</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Status</th>
            <th>Products</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {vouchers.map(v => {
            const now = new Date();
            const start = new Date(v.startDate);
            const end = new Date(v.endDate);
            const status = now < start ? 'Pending' : now > end ? 'Expired' : 'Active';
            const statusClass = status === 'Active' ? 'bg-success' : status === 'Expired' ? 'bg-danger' : 'bg-warning text-dark';

            return (
              <tr key={v.id}>
                <td>{v.code}</td>
                <td>{v.name}</td>
                <td>{v.discountType === 'percentage' ? `${v.discountValue}%` : `$${v.discountValue}`}</td>
                <td>{formatDate(v.startDate)}</td>
                <td>{formatDate(v.endDate)}</td>
                <td>
                  <span className={`badge ${statusClass}`}>
                    {status}
                  </span>
                </td>
                <td>
                  <div style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis' }} title={getProductTitles(v.productIds)}>
                    {getProductTitles(v.productIds)}
                  </div>
                </td>
                <td>
                  <div className="d-flex gap-2">
                    <button className="btn btn-sm btn-warning" onClick={() => handleEdit(v)}>
                      Edit
                    </button>
                    <button className="btn btn-sm btn-danger" onClick={() => deleteVoucher(v.id)}>
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
          {vouchers.length === 0 && (
            <tr>
              <td colSpan="8" className="text-center py-3">No vouchers found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default VoucherList;
