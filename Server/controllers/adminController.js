const bcrypt = require("bcryptjs");
const jwt = require("node-jsonwebtoken");
const db = require("../config/db");

const fs = require("fs");
const path = require("path");

const secret = "troi_oi";
const maxAge = "1h";


exports.checkAdmin = async (req, res) => {
    console.log("req.body=", req.body)
    let { email, mat_khau } = req.body;
    db.query(`SELECT * FROM users WHERE email=?`, email, (err, data) => {
        if (data.length == 0) return res.json({ "thong_bao": "Email không tồn tại" })
        let user = data[0];
        let mk_mahoa = user.mat_khau;
        let kq = bcrypt.compareSync(mat_khau, mk_mahoa);
        if (kq == false) return res.json({ "thong_bao": "Mật khẩu không đúng" })
        if (user.vai_tro != 1) return res.json({ "thong_bao": "Bạn không có quyền vào" })
        //tạo token
        const payload = { id: user.id, email: user.email, role: 1 } //nội dung token
        const bearToken = jwt.sign(payload, secret, { expiresIn: maxAge, subject: user.id + "" });
        res.status(200).json(
            { token: bearToken, expiresIn: maxAge, info: { id: user.id, ho_ten: user.ho_ten, email: user.email } }
        )
    });
};

// Sản phẩm
exports.getAllProducts = (req, res) => {
    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 20;
    let offset = (page - 1) * limit;
    let id_loai = req.query.id_loai; // Lọc theo danh mục nếu có

    let countQuery = "SELECT COUNT(*) AS total FROM san_pham";
    let dataQuery = `SELECT id, ten_sp, gia, gia_km, ngay, id_loai, an_hien, hinh 
                     FROM san_pham`;

    // Nếu có lọc theo danh mục, thêm điều kiện WHERE
    let queryParams = [];
    if (id_loai) {
        countQuery += " WHERE id_loai = ?";
        dataQuery += " WHERE id_loai = ?";
        queryParams.push(id_loai);
    }

    dataQuery += " ORDER BY ngay DESC LIMIT ? OFFSET ?";
    queryParams.push(limit, offset);

    db.query(countQuery, queryParams.slice(0, 1), (err, countResult) => {
        if (err) return res.status(500).json({ message: "Lỗi truy vấn tổng sản phẩm.", error: err });

        let total = countResult[0]?.total || 0;

        db.query(dataQuery, queryParams, (err, products) => {
            if (err) return res.status(500).json({ message: "Lỗi truy vấn dữ liệu.", error: err });

            res.json({ products, total, totalPages: Math.ceil(total / limit), currentPage: page });
        });
    });
};

exports.getProductsById = (req, res) => {
    const id = Number(req.params.id);

    if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid product ID" });
    }

    const sql = `
        SELECT id, id_loai, ten_sp, gia, gia_km, ngay, luot_xem, hinh, tinh_chat, hot, an_hien
        FROM san_pham 
        WHERE id = ?
    `;

    db.query(sql, [id], (err, data) => {
        if (err) {
            console.error(" Lỗi truy vấn sản phẩm:", err);
            return res.status(500).json({ message: "Internal Server Error", error: err });
        }

        if (data.length === 0) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.json(data[0]);
    });
};

exports.uploadImage = (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
    }
    const imageUrl = `http://localhost:5000/uploads/${req.file.filename}`;
    res.json({ imageUrl });
};

exports.postProduct = (req, res) => {
    let { ten_sp, gia, gia_km, id_loai, an_hien, mo_ta, hot, hinh } = req.body;

    let sql = `INSERT INTO san_pham (ten_sp, gia, gia_km, id_loai, an_hien, mo_ta, hot, hinh) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

    db.query(sql, [ten_sp, gia, gia_km, id_loai, an_hien, mo_ta, hot, hinh], (err, data) => {
        if (err) return res.status(500).json({ error: "Lỗi thêm sản phẩm" });
        res.json({ message: "Sản phẩm đã được thêm", id: data.insertId });
    });
};


exports.updateProduct = (req, res) => {
    let id = req.params.id;
    let { ten_sp, gia, gia_km, id_loai, an_hien, mo_ta, hot, hinh } = req.body;

    let sql = `UPDATE san_pham SET ten_sp=?, gia=?, gia_km=?, id_loai=?, an_hien=?, mo_ta=?, hot=?, hinh=? WHERE id=?`;

    db.query(sql, [ten_sp, gia, gia_km, id_loai, an_hien, mo_ta, hot, hinh, id], (err, data) => {
        if (err) return res.status(500).json({ error: "Lỗi cập nhật sản phẩm" });
        return res.json({ message: "Đã cập nhật sản phẩm", id: id });
    });
};


exports.deleteProduct = (req, res) => {
    let id = req.params.id;

    // Truy vấn để lấy ảnh sản phẩm trước khi xóa
    let getImageQuery = `SELECT hinh FROM san_pham WHERE id = ?`;
    db.query(getImageQuery, [id], (err, results) => {
        if (err) return res.status(500).json({ message: "Lỗi truy vấn sản phẩm.", error: err });

        if (results.length === 0) {
            return res.status(404).json({ message: "Sản phẩm không tồn tại." });
        }

        let imagePath = results[0].hinh; // Đường dẫn ảnh từ database

        // Xóa sản phẩm khỏi database
        let deleteQuery = `DELETE FROM san_pham WHERE id = ?`;
        db.query(deleteQuery, [id], (err, data) => {
            if (err) return res.status(500).json({ message: "Lỗi khi xóa sản phẩm.", error: err });

            // Nếu sản phẩm có ảnh, tiến hành xóa ảnh khỏi thư mục uploads
            if (imagePath) {
                let filePath = path.join(__dirname, "../" + imagePath);
                fs.unlink(filePath, (err) => {
                    if (err && err.code !== "ENOENT") {
                        console.error("Lỗi khi xóa ảnh:", err);
                    }
                });
            }

            res.json({ message: "Đã xóa sản phẩm thành công." });
        });
    });
};


// Danh mục
exports.getAllCategories = (req, res) => {
    let sql = "SELECT * FROM loai ORDER BY thu_tu ASC";

    db.query(sql, (err, data) => {
        if (err) {
            console.error(" Lỗi lấy danh sách loại sản phẩm:", err);
            return res.status(500).json({ error: "Lỗi lấy danh sách loại sản phẩm" });
        }
        res.json(data);
    });
};

exports.addCategory = (req, res) => {
    const { ten_loai, an_hien } = req.body;

    const status = an_hien === 0 ? 0 : 1;

    let sql = `INSERT INTO loai (ten_loai, an_hien) VALUES (?, ?)`;
    db.query(sql, [ten_loai, status], (err, data) => {
        if (err) {
            console.error("Lỗi khi thêm danh mục:", err);
            return res.status(500).json({ 
                error: "Lỗi thêm danh mục", 
                details: err.sqlMessage || err.message 
            });
        }
        res.json({ message: "Đã thêm danh mục", id: data.insertId });
    });
};


exports.deleteCategory = (req, res) => {
    const id = req.params.id;
    const checkSql = "SELECT COUNT(*) AS total FROM san_pham WHERE id_loai = ?";

    db.query(checkSql, [id], (err, result) => {
        if (err) return res.status(500).json({ error: "Lỗi kiểm tra danh mục" });

        if (result[0].total > 0) {
            return res.status(400).json({ error: "Không thể xóa danh mục vì đang chứa sản phẩm" });
        }

        const deleteSql = "DELETE FROM loai WHERE id = ?";
        db.query(deleteSql, [id], (err, data) => {
            if (err) return res.status(500).json({ error: "Lỗi xóa danh mục" });
            res.json({ message: "Đã xóa danh mục" });
        });
    });
};


exports.updateCategory = (req, res) => {
    const id = req.params.id;
    const { ten_loai, an_hien } = req.body;
    let sql = `UPDATE loai SET ten_loai = ?, an_hien = ? WHERE id = ?`;
    db.query(sql, [ten_loai, an_hien, id], (err, data) => {
        if (err) return res.status(500).json({ error: "Lỗi cập nhật danh mục" });
        res.json({ message: "Đã cập nhật danh mục" });
    });
};

exports.searchProducts = (req, res) => {
    const searchQuery = req.query.q;
    if (!searchQuery) {
        return res.json({ message: "Vui lòng nhập từ khóa tìm kiếm" });
    }
    const sql = `SELECT * FROM san_pham WHERE ten_sp LIKE ?`;
    db.query(sql, [`%${searchQuery}%`], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
}