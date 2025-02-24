const multer = require("multer");
const path = require("path");

// Cấu hình lưu trữ file ảnh
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); // Thư mục lưu ảnh
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Đổi tên file để tránh trùng lặp
    }
});

const upload = multer({ storage: storage });

module.exports = upload;
