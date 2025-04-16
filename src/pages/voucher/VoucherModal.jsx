import React from "react";

const VoucherModal = ({ isOpen, onClose, onSave, voucher }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-lg">
        <h2 className="text-xl font-bold mb-4">
          {voucher ? "Sửa Voucher" : "Thêm Voucher"}
        </h2>
        <form className="space-y-3">
          <div>
            <label>Mã Voucher</label>
            <input
              type="text"
              defaultValue={voucher?.code || ""}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label>Giảm giá (%)</label>
            <input
              type="number"
              defaultValue={voucher?.discount || ""}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label>Ngày bắt đầu</label>
            <input
              type="date"
              defaultValue={voucher?.startDate || ""}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label>Ngày kết thúc</label>
            <input
              type="date"
              defaultValue={voucher?.endDate || ""}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label>Điều kiện áp dụng</label>
            <textarea
              defaultValue={voucher?.conditions || ""}
              className="w-full border rounded px-3 py-2"
              rows={3}
            />
          </div>
          <div>
            <label>Trạng thái</label>
            <select
              defaultValue={voucher?.status || "active"}
              className="w-full border rounded px-3 py-2"
            >
              <option value="active">Đang hoạt động</option>
              <option value="expired">Hết hạn</option>
              <option value="disabled">Tạm ngưng</option>
            </select>
          </div>

          <div className="flex justify-end space-x-2 mt-4">
            <button type="button" onClick={onClose} className="bg-gray-300 px-4 py-2 rounded">
              Hủy
            </button>
            <button type="button" onClick={onSave} className="bg-blue-600 text-white px-4 py-2 rounded">
              {voucher ? "Cập nhật" : "Thêm mới"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VoucherModal;
