🛒 Online Kirana Shop - Full Stack E-Commerce

A modern, high-performance grocery e-commerce platform for local kirana owners. Built with the MERN Stack, it features real-time inventory management, role-based authentication, and a seamless shopping experience.

🚀 Quick Start

Using Docker Compose
docker-compose up --build

Local Development

1. Clone the repository
 git clone https://github.com/manojmatrix/Online.Kirana-Shop
 cd online-kirana-shop

2. Install Dependencies
# Install for Backend
npm install

# Install for Frontend
cd frontend && npm install

3. Start the Application
# Run both (if using concurrently) or separately
npm run dev

Access at: http://localhost:5000

✨ Features

⚡ Blazing Fast UI: Responsive design built with React.js and optimized for mobile-first users.
🔐 Secure Authentication: Role-based access control (Admin & User) using JWT and Bcrypt.
🛒 Advanced Cart System: Real-time quantity updates and persistent cart storage.
🛠 Admin Dashboard: Comprehensive suite for managing products, categories, and tracking orders.
🔍 Search & Filter: Dynamic product filtering by category and search functionality.
📦 Order Tracking: Complete workflow from order placement to delivery status.
🐳 Containerized: Fully Dockerized for consistent development and deployment environments.

🛠 Tech Stack
Frontend         Backend        DevOps / Tools
React 18         Node.js        Docker
Redux Toolkit    Express.js     GitHub Actions
Tailwind CSS     MongoDB        Vercel / Render
Lucide Icons     Mongoose       Postman

📁 Project Structure 
online-kirana-shop/
├── backend/
│   ├── controllers/    # Business logic
│   ├── models/         # MongoDB schemas
│   ├── routes/         # API endpoints
│   └── middleware/     # Auth & Error handling
├── frontend/
│   ├── src/
│   │   ├── components/ # Reusable UI components
│   │   ├── redux/      # State management
│   │   ├── pages/      # View components
│   │   └── hooks/      # Custom React hooks
└── docker-compose.yml  # Multi-container orchestration

🔧 Environment Variables
Create a .env file in the root directory:
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
NODE_ENV=development

🌍 Deployment
Frontend: Hosted on Render/Vercel
Backend: Hosted on Render
Database: MongoDB Atlas

🤝 Contributing
Contributions are welcome! If you have suggestions for improvement, please feel free to fork the repo and create a pull request.

📝 LicenseMIT License - feel free to use this for personal and commercial projects.

🔗 Links
GitHub: https://github.com/manojmatrix
Author: Manoj Kumar D
Made with ❤️ in Karnataka, India
