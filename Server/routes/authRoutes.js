const express = require("express");
const { register, login, changePassword, forgotPassword, updateInfo } = require("../controllers/authController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// Đăng ký tài khoản
router.post("/dangky", register);

// Đăng nhập
router.post("/dangnhap", login);

// Đổi mật khẩu (yêu cầu token)
router.post("/doipass", changePassword);

// Quên mật khẩu
router.post("/quenmatkhau", forgotPassword);

// Quên mật khẩu
router.put("/cap_nhat", updateInfo);

module.exports = router;
