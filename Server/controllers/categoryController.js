const db = require("../config/db");

// API lấy danh sách loại sản phẩm
exports.getCategories = (req, res) => {
    let sql = "SELECT id, ten_loai, an_hien FROM loai WHERE an_hien = 1 ORDER BY thu_tu ASC";

    db.query(sql, (err, data) => {
        if (err) {
            console.error(" Lỗi lấy danh sách loại sản phẩm:", err);
            return res.status(500).json({ error: "Lỗi lấy danh sách loại sản phẩm" });
        }
        res.json(data);
    });
};

// API lấy chi tiết loại
exports.getDetailsCategories = (req, res) => {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ thongbao: "id phải là số chứ" });
    let sql = `SELECT id, ten_loai, an_hien 
        FROM loai where id = ?`;

    db.query(sql, [id] ,(err, data) => {
        if (err) {
            console.error(" Lỗi lấy danh sách loại sản phẩm:", err);
            return res.status(500).json({ error: "Lỗi lấy danh sách loại sản phẩm" });
        }
        res.json(data[0]);
    });
};

// API lấy sản phẩm theo loại
exports.getAllProductsByCategory = (req, res) => {
    const id = Number(req.params.id);
    let start = Number(req.params.start);
    if (isNaN(id)) return res.status(400).json({ thongbao: "id phải là số chứ" });
    if (isNaN(start)) start = 0;
    const sql = `
        SELECT id, ten_sp, gia, gia_km, ngay, luot_xem, hinh, tinh_chat, hot, an_hien 
        FROM san_pham 
        WHERE an_hien = 1 AND id_loai = ?
        ORDER BY ngay DESC 
        LIMIT ?, 8
    `;
    db.query(sql, [id, start], (err, data) => {
        if (err) return res.status(500).json(err);
        res.json(data);
    });
};

// API lấy sản phẩm theo loại nhưng khác id hiện tại (trong chi tiết sản phẩm)
exports.getRandomProductsByCategory = (req, res) => {
    const idLoai = Number(req.params.id_loai);
    const idCurrent = Number(req.params.id);
    if (isNaN(idLoai) || isNaN(idCurrent)) {
        return res.status(400).json({ message: "Invalid IDs provided." });
    }
    const sql = `
        SELECT DISTINCT id, ten_sp, gia, gia_km, hinh, ngay, luot_xem, tinh_chat, hot
        FROM san_pham
        WHERE id_loai = ? AND id != ? AND an_hien = 1
        ORDER BY RAND()
        LIMIT 8
    `;
    db.query(sql, [idLoai, idCurrent], (err, data) => {
        if (err) return res.status(500).json(err);
        res.json(data);
    });
};
