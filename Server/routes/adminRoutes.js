const {
    checkAdmin,
    getAllProducts,
    postProduct,
    updateProduct,
    deleteProduct,
    uploadImage,
    addCategory,
    deleteCategory,
    updateCategory,
    getAllCategories,
    getProductsById
} = require("../controllers/adminController");
const { adminAuth } = require("../middlewares/authMiddleware");
const express = require("express");
const router = express.Router();
const upload = require("../config/upload");

// đăng nhập admin
router.get("/", (req, res) => {
    res.render("admin/dashboard", {
        layout: "layouts/admin"
    });
});

router.get("/adminproduct", (req, res) => {
    res.render("admin/adminproduct", {
        layout: "layouts/admin"
    });
});

router.get("/adminproduct/addproduct", (req, res) => {
    res.render("admin/addproduct", {
        layout: "layouts/admin"
    });
});

router.get("/adminproduct/editproduct", (req, res) => {
    res.render("admin/editproduct", {
        layout: "layouts/admin"
    });
});

router.get("/admincategory", (req, res) => {
    res.render("admin/admincategory", {
        layout: "layouts/admin"
    });
});

router.get("/admincategory/addcategory", (req, res) => {
    res.render("admin/addcategory", {
        layout: "layouts/admin"
    });
});

router.get("/admincategory/editcategory", (req, res) => {
    res.render("admin/editcategory", {
        layout: "layouts/admin"
    });
});

router.get("/login", (req, res) => {
    res.render("admin/login", {
        layout: "layouts/admin"
    });
});


router.post("/adminlogin", checkAdmin);

// product
router.get("/api/get-all-products", adminAuth, getAllProducts);

router.get("/api/get-all-products-by/:id", adminAuth, getProductsById);

router.post("/api/create-product", adminAuth, postProduct);

router.put("/api/update-product/:id", adminAuth, updateProduct);

router.delete("/api/delete-product/:id", adminAuth, deleteProduct);

router.post("/upload-image", adminAuth, upload.single("image"), uploadImage);



// category
router.get("/api/get-all-category", adminAuth, getAllCategories);

router.post("/api/add-category", adminAuth, addCategory);

router.put("/api/update-category/:id", adminAuth, updateCategory);

router.delete("/api/delete-category/:id", adminAuth, deleteCategory);

module.exports = router;
