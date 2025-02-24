const express = require("express");
const router = express.Router();
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

module.exports = router;
