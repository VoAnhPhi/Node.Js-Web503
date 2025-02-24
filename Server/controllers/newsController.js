const db = require("../config/db");

exports.cateNews = async (req, res) => {
    const sql = `SELECT id, ten_loai FROM loai_tin WHERE an_hien = 1 ORDER BY thu_tu ASC`;
    db.query(sql, (err, data) => {
        if (err) return res.status(500).json(err);
        res.json(data);
    });
};

exports.newsNew = async (req, res) => {
    const sql = `
    SELECT id, tieu_de, slug, mo_ta, hinh, ngay, noi_dung, id_loai
    FROM tin_tuc
    WHERE an_hien = 1 AND hot = 1
    ORDER BY ngay DESC
    LIMIT 0, 4
`;
    db.query(sql, (err, data) => {
        if (err) return res.status(500).json(err);
        res.json(data);
    });
};

exports.newsInVN = async (req, res) => {
    const sql = `
        SELECT id, tieu_de, slug, mo_ta, hinh, ngay, noi_dung, id_loai, tags
        FROM tin_tuc
        WHERE an_hien = 1 AND tags = 'Việt Nam'
        ORDER BY ngay DESC
        LIMIT 0, 2
    `;
    db.query(sql, (err, data) => {
        if (err) return res.status(500).json(err);
        res.json(data);
    });
};

exports.newsHot = async (req, res) => {
    const sql = `
        SELECT id, tieu_de, slug, mo_ta, hinh, ngay, noi_dung, id_loai
        FROM tin_tuc
        WHERE an_hien = 1
        ORDER BY luot_xem DESC
        LIMIT 0, 4
    `;
    db.query(sql, (err, data) => {
        if (err) return res.status(500).json(err);
        res.json(data);
    });
};

exports.newsHealth = async (req, res) => {
    const sql = `
    SELECT id, tieu_de, slug, mo_ta, hinh, ngay, noi_dung, id_loai
    FROM tin_tuc
    WHERE an_hien = 1 AND id_loai = 1
    ORDER BY luot_xem DESC
    LIMIT 0, 5
`;
    db.query(sql, (err, data) => {
        if (err) return res.status(500).json(err);
        res.json(data);
    });
};

exports.detailnews = async (req, res) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
        return res.status(400).json({ thongbao: "id phải là số chứ" });
    }
    const sql = `
        SELECT id, tieu_de, slug, mo_ta, hinh, ngay, noi_dung, id_loai
        FROM tin_tuc
        WHERE id = ?
    `;
    db.query(sql, [id], (err, data) => {
        if (err) return res.status(500).json(err);
        res.json(data[0]);
    });
};

exports.getnewsbytype = async (req, res) => {
    const id = Number(req.params.id);
    let start = Number(req.params.start);
    if (isNaN(id)) return res.status(400).json({ thongbao: "id phải là số chứ" });
    if (isNaN(start)) start = 0;
    const sql = `
        SELECT id, tieu_de, slug, mo_ta, hinh, ngay, noi_dung, id_loai
        FROM tin_tuc
        WHERE an_hien = 1 AND id_loai = ?
        ORDER BY ngay DESC
        LIMIT ?, 5
    `;
    db.query(sql, [id, start], (err, data) => {
        if (err) return res.status(500).json(err);
        res.json(data);
    });
};