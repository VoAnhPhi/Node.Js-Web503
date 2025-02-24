const express = require("express");
const { getNewProducts, getHotProducts, detailProduct, similarProduct, typeProduct } = require("../controllers/productController");
const router = express.Router();

// API sản phẩm mới
router.get("/spmoi", getNewProducts);

// API sản phẩm hot
router.get("/sphot", getHotProducts);

// API chi tiết sản phẩm
router.get("/detail/:id", detailProduct);

// API thuộc tính
router.get("/thuoc_tinh/type/:id", typeProduct);

// API sản phẩm cùng loại
router.get("/similar/:id_loai/:id", similarProduct);


module.exports = router;
