import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { Modal } from 'bootstrap';

const API_URL = 'http://localhost:9999/voucher';

const VoucherList = () => {
  const [vouchers, setVouchers] = useState([]);
  const [form, setForm] = useState({
    id: null,
    code: '',
    name: '',
    discountType: 'percentage',
    discountValue: '',
    startDate: '',
    endDate: '',
    isActive: true
  });

  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => setVouchers(data))
      .catch(err => console.error('Fetch error:', err));
  }, []);

  const formatDate = (dateString) => new Date(dateString).toLocaleDateString('vi-VN');

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setForm({
      id: null, // vẫn giữ, để đảm bảo không bị edit
      code: '',
      name: '',
      discountType: 'percentage',
      discountValue: '',
      startDate: '',
      endDate: '',
      isActive: true
    });
    setIsEditMode(false);
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const payload = {
      ...form,
      discountValue: Number(form.discountValue)
    };
  
    if (!isEditMode) {
      delete payload.id; // 
    }
  
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
  };
  

  const handleEdit = (voucher) => {
    setForm(voucher);
    setIsEditMode(true);
    const modal = new Modal(document.getElementById('voucherModal'));
    modal.show();
  };

  const deleteVoucher = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa voucher này?')) {
      await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      const updated = vouchers.filter(v => v.id !== id);
      setVouchers(updated);
    }
  };

  return (
    <div className="container mt-4">
      <h4>Danh sách Voucher</h4>
      <button
        className="btn btn-primary mb-3"
        onClick={() => {
          resetForm(); // clear form trước
          const modal = new Modal(document.getElementById('voucherModal'));
          modal.show(); // hiển thị modal sau
        }}
      >
        + Tạo Voucher mới
      </button>


      {/* Modal */}
      <div className="modal fade" id="voucherModal" tabIndex="-1">
        <div className="modal-dialog">
          <form className="modal-content" onSubmit={handleSubmit}>
            <div className="modal-header">
              <h5 className="modal-title">
                {isEditMode ? 'Chỉnh sửa Voucher' : 'Tạo Voucher mới'}
              </h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">
              <input name="code" className="form-control mb-2" placeholder="Mã voucher" value={form.code} onChange={handleChange} required />
              <input name="name" className="form-control mb-2" placeholder="Tên voucher" value={form.name} onChange={handleChange} required />
              <select name="discountType" className="form-select mb-2" value={form.discountType} onChange={handleChange}>
                <option value="percentage">Phần trăm</option>
                <option value="fixed">Cố định (VNĐ)</option>
              </select>
              <input name="discountValue" type="number" className="form-control mb-2" placeholder="Giá trị giảm" value={form.discountValue} onChange={handleChange} required />
              <input name="startDate" type="date" className="form-control mb-2" value={form.startDate} onChange={handleChange} required />
              <input name="endDate" type="date" className="form-control mb-2" value={form.endDate} onChange={handleChange} required />
            </div>
            <div className="modal-footer">
              <button type="submit" className="btn btn-success">
                {isEditMode ? 'Lưu chỉnh sửa' : 'Tạo mới'}
              </button>
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Hủy</button>
            </div>
          </form>
        </div>
      </div>

      {/* Table */}
      <table className="table table-bordered table-striped">
        <thead className="table-dark">
          <tr>
            <th>Mã</th>
            <th>Tên</th>
            <th>Giảm</th>
            <th>Bắt đầu</th>
            <th>Kết thúc</th>
            <th>Trạng thái</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {vouchers.map(v => {
            const now = new Date();
            const start = new Date(v.startDate);
            const end = new Date(v.endDate);
            const status = now < start ? 'Chưa áp dụng' : now > end ? 'Hết hạn' : 'Đang áp dụng';

            return (
              <tr key={v.id}>
                <td>{v.code}</td>
                <td>{v.name}</td>
                <td>{v.discountType === 'percentage' ? `${v.discountValue}%` : `${v.discountValue.toLocaleString('vi-VN')}đ`}</td>
                <td>{formatDate(v.startDate)}</td>
                <td>{formatDate(v.endDate)}</td>
                <td>
                  <span className={`badge ${status === 'Đang áp dụng' ? 'bg-success' : status === 'Hết hạn' ? 'bg-danger' : 'bg-warning text-dark'}`}>
                    {status}
                  </span>
                </td>
                <td>
                  <button className="btn btn-sm btn-warning me-2" onClick={() => handleEdit(v)}>
                    Sửa
                  </button>
                  <button className="btn btn-sm btn-danger" onClick={() => deleteVoucher(v.id)}>
                    Xóa
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="text-end mt-3">
        <small className="text-muted">Hiển thị {vouchers.length} kết quả</small>
      </div>
    </div>
  );
};

export default VoucherList;


