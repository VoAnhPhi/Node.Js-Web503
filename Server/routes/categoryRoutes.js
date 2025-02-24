const express = require("express");
const { getCategories, getDetailsCategories, getRandomProductsByCategory, getAllProductsByCategory, addCategory, updateCategory, deleteCategory } = require("../controllers/categoryController");

const router = express.Router();

// API lấy danh sách loại sản phẩm
router.get("/", getCategories);

// API lấy chi tiết loại
router.get("/:id", getDetailsCategories);

// API lấy sản phẩm theo loại
router.get("/:id/:start?", getAllProductsByCategory);

// API lấy sản phẩm theo loại nhưng khác id hiện tại (trong chi tiết sản phẩm)
router.get("/cungloai/:id_loai/:id", getRandomProductsByCategory);

module.exports = router;
