# Node.Js-Web503
/project-folder
│── /server               // Backend server
│   ├── /config           // Cấu hình kết nối và API
│   │   ├── db.js         // Kết nối MySQL
│   │   ├── apiConfig.js  // Quản lý URL API
│   ├── /routes           // Định tuyến API
│   │   ├── authRoutes.js     // Route đăng nhập, đăng ký, đổi mật khẩu
│   │   ├── productRoutes.js  // Route sản phẩm
│   │   ├── categoryRoutes.js // Route danh mục
│   │   ├── userRoutes.js     // Route người dùng
│   ├── /controllers      // Xử lý logic API
│   │   ├── authController.js    
│   │   ├── categoryController.js 
│   │   ├── productController.js  
│   │   ├── userController.js     
│   ├── /middlewares      // Middleware xử lý
│   │   ├── authMiddleware.js  // Middleware xác thực JWT
│   │   ├── errorMiddleware.js // Middleware xử lý lỗi
│   ├── /services         // Dịch vụ xử lý backend
│   │   ├── mailService.js   
│   │   ├── userService.js   
│   ├── index.js          // Khởi chạy backend (port 5000)
│── /client               // Frontend server
│   ├── /views            // Giao diện người dùng
│   ├── /layouts          // Layout chính
│   │   ├── main.ejs      
│   ├── /pages            // Các trang giao diện
│   │   ├── trangchu.ejs  
│   │   ├── dangky.ejs    
│   │   ├── dangnhap.ejs  
│   │   ├── dangxuat.ejs  
│   │   ├── details.ejs   
│   │   ├── doipass.ejs   
│   │   ├── loai.ejs      
│   │   ├── quenpass.ejs  
│   ├── /partials         // Header và Footer
│   │   ├── header.ejs    
│   │   ├── footer.ejs    
│   ├── /public           // File tĩnh (CSS, JS, images)
│   ├── server.js         // Chạy frontend (port 1207)
│── .env                 // Biến môi trường
│── package.json         // Thông tin package và dependencies


# Backend
cd server
npm start

# Client 
npm start

PORT_BACKEND=5000
PORT_FRONTEND=1207
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=yourdatabase
JWT_SECRET=your_secret_key
EMAIL_USER=your_email
EMAIL_PASS=your_password


# Tính năng chính
 Đăng ký, đăng nhập, xác thực JWT
 Quản lý sản phẩm và danh mục
 Tìm kiếm và lọc sản phẩm
 Đổi mật khẩu, quên mật khẩu qua email
 API RESTful với Express
 Giao diện người dùng với EJS