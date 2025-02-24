const express = require("express");
const cors = require("cors");
const expressLayouts = require("express-ejs-layouts");

require("dotenv").config();

const app = express();
const port = process.env.PORT || 1207;

app.use(cors());
app.use(express.json());
app.use(express.static("./public"));
app.use(expressLayouts);
app.set("view engine", "ejs");
app.set("views", "./view");
app.set("layout", "./layouts/main");

// Import routes
const indexRoutes = require("./routes/indexRoutes");
const adminRoutes = require("./routes/adminRoutes");

// Sử dụng routes
app.use("/", indexRoutes);
app.use("/admin", adminRoutes);

// Lắng nghe server
app.listen(port, () => {
    console.log(` Server chạy trên cổng ${port}`);
});
