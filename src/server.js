const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Đường dẫn thư mục chứa ảnh
const uploadFolder = path.join(__dirname, '/assets/images');
// Tạo thư mục nếu chưa tồn tại
if (!fs.existsSync(uploadFolder)) {
    fs.mkdirSync(uploadFolder, { recursive: true });
}

// app.get('/', (req, res) => {
//     res.send("Welcome to the API server!");
// });
// Enable CORS for all routes
app.use(cors({
    origin: '*', // Allow requests only from this origin
    // or use origin: '*' to allow any origin (less secure)
}));


// Cấu hình storage cho multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadFolder);
    },
    filename: function (req, file, cb) {
        // Sử dụng timestamp và mở rộng file gốc để tạo tên file mới
        const uniqueSuffix = Date.now() + path.extname(file.originalname);
        cb(null, uniqueSuffix);
    }
});

const upload = multer({ storage: storage });

// Route: Tải lên ảnh (Create)
app.post('/upload', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded.' });
    }
    res.json({
        message: 'File uploaded successfully!',
        filename: req.file.filename,
        path: `/assets/images/${req.file.filename}`
    });
});

// Route: Cập nhật (sửa) ảnh
// Giả sử bạn muốn thay thế ảnh cũ bằng ảnh mới
app.put('/update/:filename', upload.single('image'), (req, res) => {
    const oldFilename = req.params.filename;
    const oldFilePath = path.join(uploadFolder, oldFilename);

    // Xóa file cũ
    fs.unlink(oldFilePath, (err) => {
        if (err) {
            console.error('Error deleting file:', err);
            return res.status(500).json({ error: 'Failed to delete old file.' });
        }
        // Sau khi xóa file cũ, trả về thông tin file mới đã được upload
        res.json({
            message: 'File updated successfully!',
            newFilename: req.file.filename,
            path: `/assets/images/${req.file.filename}`
        });
    });
});

// Route: Xóa ảnh (Delete)
app.delete('/delete/:filename', (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(uploadFolder, filename);

    fs.unlink(filePath, (err) => {
        if (err) {
            console.error('Error deleting file:', err);
            return res.status(500).json({ error: 'Failed to delete file.' });
        }
        res.json({ message: 'File deleted successfully!' });
    });
});

// Dùng middleware để phục vụ các file tĩnh từ thư mục assets (không bắt buộc nếu bạn dùng các máy chủ tĩnh khác)
app.use('/assets/images', express.static(uploadFolder));





//////////////////////////////////////////////////////////////////////////////////////////////////////// Dành cho upload ảnh của products 

const productUploadFolder = path.join(__dirname, '/assets/products');
if (!fs.existsSync(productUploadFolder)) {
    fs.mkdirSync(productUploadFolder, { recursive: true });
}


const productStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, productUploadFolder);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + path.extname(file.originalname);
        cb(null, uniqueSuffix);
    }
});

const productUpload = multer({ storage: productStorage });

// Upload ảnh sản phẩm (Create)
app.post('/product/upload', productUpload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded.' });
    }
    res.json({
        message: 'Product image uploaded successfully!',
        filename: req.file.filename,
        path: `/assets/products/${req.file.filename}`
    });
});

// Cập nhật ảnh sản phẩm (Update)
// app.put('/product/update/:filename', productUpload.single('image'), (req, res) => {
//     const oldFilename = req.params.filename;
//     const oldFilePath = path.join(productUploadFolder, oldFilename);

//     fs.unlink(oldFilePath, (err) => {
//         if (err) {
//             console.error('Error deleting product image:', err);
//             return res.status(500).json({ error: 'Failed to delete old product image.' });
//         }
//         res.json({
//             message: 'Product image updated successfully!',
//             newFilename: req.file.filename,
//             path: `/assets/products/${req.file.filename}`
//         });
//     });
// });

// Route: Cập nhật ảnh sản phẩm (Update)
app.put('/product/update/:filename', productUpload.single('image'), (req, res) => {
    const oldFilename = req.params.filename;
    const oldFilePath = path.join(productUploadFolder, oldFilename);
  
    // Xóa ảnh cũ trước khi lưu ảnh mới
    fs.unlink(oldFilePath, (err) => {
      if (err) {
        console.error('Error deleting old file:', err);
        return res.status(500).json({ error: 'Failed to delete old file.' });
      }
  
      // Sau khi xóa file cũ, trả về thông tin file mới đã được upload
      res.json({
        message: 'Product image updated successfully!',
        newFilename: req.file.filename,
        path: `/assets/products/${req.file.filename}`
      });
    });
  });

// Xóa ảnh sản phẩm (Delete)
app.delete('/product/delete/:filename', (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(productUploadFolder, filename);

    fs.unlink(filePath, (err) => {
        if (err) {
            console.error('Error deleting product image:', err);
            return res.status(500).json({ error: 'Failed to delete product image.' });
        }
        res.json({ message: 'Product image deleted successfully!' });
    });
});

app.use('/assets/products', express.static(productUploadFolder));

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
