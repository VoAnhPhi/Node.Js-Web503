const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/db");
const nodemailer = require("nodemailer");
const randomstring = require("randomstring");

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

exports.register = async (req, res) => {
    const { email, mat_khau, go_lai_mat_khau, ho_ten } = req.body;
    if (!email || !mat_khau || !go_lai_mat_khau || !ho_ten) {
        return res.status(400).json({ thong_bao: "Vui lòng nhập đầy đủ thông tin." });
    }
    if (mat_khau !== go_lai_mat_khau) {
        return res.status(400).json({ thong_bao: "Mật khẩu xác nhận không khớp." });
    }
    // Mã hóa mật khẩu
    const salt = bcrypt.genSaltSync(10);
    const mk_mahoa = bcrypt.hashSync(mat_khau, salt);
    const sql = `INSERT INTO users SET email = ?, mat_khau = ?, ho_ten = ?`;
    db.query(sql, [email, mk_mahoa, ho_ten], (err, result) => {
        if (err) {
            console.error("Lỗi khi chèn user:", err);
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ thong_bao: "Email đã tồn tại." });
            }
            return res.status(500).json({ thong_bao: "Lỗi khi đăng ký." });
        }
        const id = result.insertId;
        // Có thể gửi mail chào mừng ở đây nếu cần
        res.status(201).json({ thong_bao: "Đã thêm user. id = " + id });
    });
};

exports.login = async (req, res) => {
    const { email, mat_khau } = req.body;
    if (!email || !mat_khau) {
        return res.status(400).json({ thong_bao: "Thiếu email hoặc mật khẩu" });
    }
    const sql = "SELECT * FROM users WHERE email = ?";
    db.query(sql, [email], (err, data) => {
        if (err) {
            console.error("Lỗi truy vấn:", err);
            return res.status(500).json({ thong_bao: "Lỗi truy vấn cơ sở dữ liệu" });
        }
        if (!data || data.length === 0) {
            return res.status(404).json({ thong_bao: "Email không tồn tại" });
        }
        const user = data[0];
        const validPassword = bcrypt.compareSync(mat_khau, user.mat_khau);
        if (!validPassword) {
            return res.status(401).json({ "thong_bao": "Mật khẩu không đúng" });
        }
        // Tạo token JWT
        const secret = process.env.JWT_SECRET;
        const payload = { id: user.id, email: user.email };
        const maxAge = "1h";
        const token = jwt.sign(payload, secret, { expiresIn: maxAge, subject: user.id.toString() });
        res.status(200).json({
            token,
            expiresIn: maxAge,
            info: { id: user.id, ho_ten: user.ho_ten, email: user.email, dia_chi: user.dia_chi, dien_thoai: user.dien_thoai }
        });
    });
};

exports.changePassword = async (req, res) => {
    let token = req.headers.authorization;
    if (!token) {
        return res.status(400).json({ thong_bao: "Không có token" });
    }
    token = token.substring(7); // loại bỏ "Bearer "
    if (!token) {
        return res.status(400).json({ thong_bao: "Thiếu token" });
    }

    // Giải mã token (ưu tiên dùng biến môi trường nếu có)
    const secret = process.env.JWT_SECRET || "troi_oi";
    const maxAge = "1h";
    let payload;
    try {
        payload = jwt.verify(token, secret, { maxAge });
    } catch (err) {
        console.error("Lỗi token:", err);
        return res.status(401).json({ thong_bao: "Token không hợp lệ hoặc đã hết hạn" });
    }
    console.log("payload=", payload);

    const email = payload.email;
    const { mat_khau_cu, mat_khau_moi, go_lai_mat_khau } = req.body;

    // Kiểm tra dữ liệu đầu vào
    if (!mat_khau_cu || !mat_khau_moi || !go_lai_mat_khau) {
        return res.status(400).json({ thong_bao: "Thiếu thông tin cần thiết" });
    }
    if (mat_khau_moi !== go_lai_mat_khau) {
        return res.status(400).json({ thong_bao: "Mật khẩu mới và xác nhận mật khẩu không khớp" });
    }

    const bcrypt = require("bcryptjs");
    const sqlSelect = `SELECT * FROM users WHERE email = ?`;
    db.query(sqlSelect, [email], (err, data) => {
        if (err) {
            console.error("Lỗi truy vấn:", err);
            return res.status(500).json({ thong_bao: "Lỗi truy vấn cơ sở dữ liệu" });
        }
        if (!data || data.length === 0) {
            return res.status(404).json({ thong_bao: "Email không tồn tại" });
        }

        const user = data[0];
        const mk_mahoa = user.mat_khau;
        const kq = bcrypt.compareSync(mat_khau_cu, mk_mahoa);
        if (!kq) {
            return res.status(401).json({ thong_bao: "Mật khẩu cũ không đúng" });
        }

        // Mã hóa mật khẩu mới
        const salt = bcrypt.genSaltSync(10);
        const mkmoi_mahoa = bcrypt.hashSync(mat_khau_moi, salt);
        const sqlUpdate = `UPDATE users SET mat_khau = ? WHERE email = ?`;
        db.query(sqlUpdate, [mkmoi_mahoa, email], (err, result) => {
            if (err) {
                console.error("Lỗi truy vấn cập nhật:", err);
                return res.status(500).json({ thong_bao: "Lỗi truy vấn cơ sở dữ liệu" });
            }
            res.status(200).json({ thong_bao: "Đã cập nhật mật khẩu mới" });
        });
    });
};

exports.forgotPassword = async (req, res) => {
    const { email } = req.body;
    if (!email || email.trim() === "") {
        return res.status(400).json({ thong_bao: "Email không được bỏ trống" });
    }
    const sqlSelect = "SELECT * FROM users WHERE email = ?;";
    db.query(sqlSelect, [email], (err, data) => {
        if (err) {
            console.error("Lỗi truy vấn:", err);
            return res.status(500).json({ thong_bao: "Lỗi hệ thống", error: err.message });
        }
        if (!data || data.length === 0) {
            return res.status(404).json({ thong_bao: "Email không tồn tại" });
        }
        // Tạo mật khẩu mới và mã hóa
        const mat_khau_moi = randomstring.generate(8);
        const salt = bcrypt.genSaltSync(10);
        const mkmoi_mahoa = bcrypt.hashSync(mat_khau_moi, salt);
        const sqlUpdate = "UPDATE users SET mat_khau = ? WHERE email = ?;";
        db.query(sqlUpdate, [mkmoi_mahoa, email], (err, result) => {
            if (err) {
                console.error("Lỗi cập nhật mật khẩu:", err);
                return res.status(500).json({ thong_bao: "Lỗi cập nhật mật khẩu", error: err.sqlMessage });
            }
            // Trả về kết quả ngay lập tức
            res.status(200).json({ thong_bao: "Đã cập nhật mật khẩu. Vui lòng kiểm tra email của bạn." });
            // Gửi email bất đồng bộ
            const mailOptions = {
                from: '"Hỗ trợ 👻" <panhmail12@gmail.com>',
                to: email,
                subject: "Mật khẩu mới của bạn",
                text: `Mật khẩu mới của bạn là: ${mat_khau_moi}`,
                html: `
                    <h3>Xin chào ${email}</h3>
                    <p style="color: #000;">Có vẻ như bạn đã quên mật khẩu của mình. Dưới đây là mật khẩu mới của bạn</p>
                    <p>Mật khẩu mới của bạn là: <b>${mat_khau_moi}</b></p>
                `,
            };
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error("Có lỗi khi gửi email:", error);
                } else {
                    console.log("Email đã được gửi:", info.response);
                }
            });
        });
    });
};

exports.updateInfo = async (req, res) => {
    const { id, email, ho_ten, dien_thoai, dia_chi } = req.body;
    if (!id || !dien_thoai) {
        return res.status(400).json({ thong_bao: "Thiếu thông tin cần thiết (id hoặc số điện thoại)" });
    }
    const sql = `UPDATE users SET ho_ten = ?, dia_chi = ?, email = ?, dien_thoai = ? WHERE id = ?`;
    db.query(sql, [ho_ten, dia_chi, email, dien_thoai, id], (err, result) => {
        if (err) {
            console.error("Lỗi cập nhật user:", err);
            return res.status(500).json({ thong_bao: "Lỗi khi cập nhật tài khoản", sqlMessage: err.sqlMessage });
        }
        res.status(200).json({ thong_bao: "Cập nhật tài khoản thành công!" });
    });
};