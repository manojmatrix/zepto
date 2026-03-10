# 🛒 Online Kirana Shop - Full Stack E-Commerce

A modern, high-performance grocery e-commerce platform for local kirana owners. Built with the MERN Stack, it features real-time inventory management, role-based authentication, and a seamless shopping experience.

# 🚀 Quick Start

### Using Docker Compose
```bash
docker-compose up --build
```
### Local Development

## 1. Clone the repository
```bash
 git clone https://github.com/manojmatrix/Online.Kirana-Shop
 cd online-kirana-shop
 ```

## 2. Install Dependencies

### Install for Backend
```bash
npm install
```

### Install for Frontend
```bash
cd frontend  
npm install
```

## 3. Start the Application

### Run both (if using concurrently) or separately
```bash
npm run dev
```

Access at: **http://localhost:5000**

## ✨ Features

- ⚡ Blazing Fast UI: Responsive design built with React.js and optimized for mobile-first users.
- 🔐 Secure Authentication: Role-based access control (Admin & User) using JWT and Bcrypt.
- 🛒 Advanced Cart System: Real-time quantity updates and persistent cart storage.
- 🛠 Admin Dashboard: Comprehensive suite for managing products, categories, and tracking orders.
- 🔍 Search & Filter: Dynamic product filtering by category and search functionality.
- 📦 Order Tracking: Complete workflow from order placement to delivery status.
- 🐳 Containerized: Fully Dockerized for consistent development and deployment environments.

## 🛠 Tech Stack

| Component | Technology |
| :--- | :--- |
| **Frontend** | React, Redux Toolkit, Tailwind CSS |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB (Mongoose) |
| **DevOps** | Docker, Docker Compose |

## 📁 Project Structure

```text
online-kirana-shop/
├── backend/
│   ├── controllers/    # Business logic (API functions)
│   ├── models/         # MongoDB schemas (Data structures)
│   ├── routes/         # API endpoints (URL paths)
│   └── middleware/     # Auth & Error handling (Security)
├── frontend/
│   ├── src/
│   │   ├── components/ # Reusable UI pieces (Buttons, Navbar)
│   │   ├── redux/      # Global state management
│   │   ├── pages/      # Individual screens (Home, Cart, Login)
│   │   └── hooks/      # Custom logic (useAuth, useFetch)
└── docker-compose.yml  # Multi-container orchestration (Docker)
```

## 🔧 Environment Variables
```
Create a .env file in the root directory:
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
NODE_ENV=development
```

## 🌍 Deployment
- Frontend: Hosted on Render/Vercel
- Backend: Hosted on Render
- Database: MongoDB Atlas

## 🤝 Contributing
Contributions are welcome! If you have suggestions for improvement, please feel free to fork the repo and create a pull request.

## 📝 LicenseMIT License 
- feel free to use this for personal and commercial projects.

## 🔗 Links

- **GitHub**: https://github.com/manojmatrix
- **Author**: [Manoj Kumar D](https://www.linkedin.com/in/manoj-kumar-d-93460a297/)

---

**Made with ❤️ in Karnataka, India**
