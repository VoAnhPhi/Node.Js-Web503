# Node.js Web503

## Project Structure
```
/project-folder
│── /server               // Backend server
│   ├── /config           // Configuration files
│   │   ├── db.js         // MySQL connection setup
│   │   ├── apiConfig.js  // API URL management
│   ├── /routes           // API routes
│   │   ├── authRoutes.js     // Authentication routes (login, register, change password)
│   │   ├── productRoutes.js  // Product routes
│   │   ├── categoryRoutes.js // Category routes
│   │   ├── userRoutes.js     // User management routes
│   ├── /controllers      // API controllers
│   │   ├── authController.js    
│   │   ├── categoryController.js 
│   │   ├── productController.js  
│   │   ├── userController.js     
│   ├── /middlewares      // Middleware handlers
│   │   ├── authMiddleware.js  // JWT authentication middleware
│   │   ├── errorMiddleware.js // Error handling middleware
│   ├── /services         // Backend services
│   │   ├── mailService.js   
│   │   ├── userService.js   
│   ├── index.js          // Backend entry point (port 5000)
│── /client               // Frontend server
│   ├── /views            // User interface
│   ├── /layouts          // Main layout
│   │   ├── main.ejs      
│   ├── /pages            // UI pages
│   │   ├── trangchu.ejs  
│   │   ├── dangky.ejs    
│   │   ├── dangnhap.ejs  
│   │   ├── dangxuat.ejs  
│   │   ├── details.ejs   
│   │   ├── doipass.ejs   
│   │   ├── loai.ejs      
│   │   ├── quenpass.ejs  
│   ├── /partials         // Header and footer components
│   │   ├── header.ejs    
│   │   ├── footer.ejs    
│   ├── /public           // Static files (CSS, JS, images)
│   ├── server.js         // Frontend server entry point (port 1207)
│── .env                 // Environment variables
│── package.json         // Dependencies and project metadata
```

## Installation & Setup
### Backend
```sh
cd server
npm install
npm start
```
### Frontend
```sh
cd client
npm install
npm start
```

## Environment Variables (.env)
```
PORT_BACKEND=5000
PORT_FRONTEND=1207
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=yourdatabase
JWT_SECRET=your_secret_key
EMAIL_USER=your_email
EMAIL_PASS=your_password
```

## Features
- User authentication (register, login, JWT authentication)
- Product and category management
- Product search and filtering
- Change password & password recovery via email
- RESTful API with Express
- User interface built with EJS
