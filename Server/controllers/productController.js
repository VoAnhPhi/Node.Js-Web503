const db = require("../config/db");
const multer = require("multer");

exports.getNewProducts = (req, res) => {
    let sql = `SELECT id, ten_sp, gia, gia_km, ngay, luot_xem, hinh FROM san_pham WHERE an_hien = 1 ORDER BY ngay DESC LIMIT 8`;
    db.query(sql, (err, data) => {
        if (err) return res.status(500).json(err);
        res.json(data);
    });
};

exports.getHotProducts = (req, res) => {
    let sql = `SELECT id, ten_sp, gia, gia_km, ngay, luot_xem, hinh FROM san_pham WHERE an_hien = 1 AND hot = 1 ORDER BY ngay DESC LIMIT 8`;
    db.query(sql, (err, data) => {
        if (err) return res.status(500).json(err);
        res.json(data);
    });
};

exports.detailProduct = (req, res) => {
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

exports.typeProduct = (req, res) => {
    const idSP = Number(req.params.id);

    if (isNaN(idSP)) {
        return res.status(400).json({ message: "Invalid IDs provided." });
    }

    const sql = `
        SELECT id, id_sp, ram, cpu, dia_cung, mau_sac, can_nang
        FROM thuoc_tinh
        WHERE id_sp = ?
    `;

    db.query(sql, [idSP], (err, data) => {
        if (err) {
            return res.status(500).json({ message: "Lỗi truy vấn dữ liệu.", error: err });
        }
        if (data.length === 0) {
            return res.status(404).json({ message: "Không tìm thấy thuộc tính sản phẩm." });
        }
        res.json(data[0]);
    });
};

exports.similarProduct = (req, res) => {
    const idLoai = Number(req.params.id_loai);
    const idCurrent = Number(req.params.id);

    if (isNaN(idLoai) || isNaN(idCurrent)) {
        return res.status(400).json({ message: "Invalid IDs provided." });
    }

    const sql = `
        SELECT id, ten_sp, gia, gia_km, hinh, ngay, luot_xem, tinh_chat, hot
        FROM san_pham
        WHERE id_loai = ? AND id != ? AND an_hien = 1
        ORDER BY RAND()
        LIMIT 8
    `;

    db.query(sql, [idLoai, idCurrent], (err, data) => {
        if (err) {
            console.error(" Lỗi lấy sản phẩm cùng loại:", err);
            return res.status(500).json({ message: "Internal Server Error", error: err });
        }
        res.json(data);
    });
};