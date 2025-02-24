const express = require("express");
const router = express.Router();

// Trang chủ
router.get("/", (req, res) => {
    res.render("pages/trangchu", { 
        title: "Trang Chủ",
        description: ""
    });
});

// Trang đăng ký
router.get(`/dang_ky`, (req, res) => {
    res.render("pages/dangky", { 
        title: "Đăng ký tài khoản",
        description: "Đăng ký tài khoản ngay để trải nghiệm dịch vụ tuyệt vời của chúng tôi!"
    });
});

// Trang đăng nhập
router.get(`/dang_nhap`, (req, res) => {
    res.render("pages/dangnhap", { 
        title: "Đăng nhập",
        description: "Đăng nhập để truy cập vào tài khoản của bạn và khám phá sản phẩm hot nhất."
    });
});

// Trang sản phẩm 
router.get(`/detail`, (req, res) => {
    res.render('pages/details', { 
        title: 'Chi tiết sản phẩm', 
        description: ""
    });
})

// Trang sản phẩm theo loại 
router.get(`/loai`, (req, res) => {
    res.render('pages/loai', { 
        title: 'Sản phẩm theo loại',
        description: ""
    });
})

// Trang thông tin user
router.get(`/info`, (req, res) => {
    res.render('pages/user_info', { 
        title: 'Thông tin',
        description: ""
    });
})

// Trang đổi pass
router.get(`/doipass`, (req, res) => {
    res.render('pages/doipass', { 
        title: 'Đổi mật khấu',
        description: ""
    });
})

// Trang quên mật khẩu
router.get(`/quen_pass`, (req, res) => {
    res.render('pages/quenpass', { 
        title: 'Quên mật khẩu',
        description: ""
    });
})

// Trang tin tức
router.get(`/tintuc`, (req, res) => {
    res.render('pages/tintuc', { 
        title: 'Trang tin tức',
        description: ""
    });
})

// Trang xem bài viết
router.get(`/chi_tiet`, (req, res) => {
    res.render('pages/detail_news', { 
        title: 'Chi tiết bài viết',
        description: ""
    });
})

// Trang xem bài viết
router.get(`/loai_tin`, (req, res) => {
    res.render('pages/loaitin', { 
        title: 'Bài viết theo loại',
        description: ""
    });
})

module.exports = router;
