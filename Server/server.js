const express = require("express");
const cors = require("cors");
const expressLayouts = require("express-ejs-layouts");
const path = require("path");

require("dotenv").config();
require("./config/db");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.static("./public"));
app.use(expressLayouts);
app.set("view engine", "ejs");
app.set("views", "./view");
app.set("layout", "./layouts/main");

// Import routes
const indexRoutes = require("./routes/indexRoutes");
const productRoutes = require("./routes/productRoutes");
const authRoutes = require("./routes/authRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const newsRoutes = require("./routes/newsRoutes");
const adminRoutes = require("./routes/adminRoutes");

// Sử dụng routes
app.use("/", indexRoutes);
// Middleware phục vụ ảnh upload
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/loai", categoryRoutes);
app.use("/api/news", newsRoutes);
app.use("/admin", adminRoutes);

// Lắng nghe server
app.listen(port, () => {
    console.log(` Server chạy trên cổng ${port}`);
});
