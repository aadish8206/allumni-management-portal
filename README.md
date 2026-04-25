<div align="center">

<h1>🎓 Alumni Management Portal</h1>

<p>
  <strong>A full-stack MERN platform connecting students, alumni & administrators — seamlessly.</strong>
</p>

<h3><a href="https://allumni-management-portal-1.onrender.com">🔴 Live Demo</a></h3>

<p>
  <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express" />
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/PHP-777BB4?style=for-the-badge&logo=php&logoColor=white" alt="PHP" />
</p>

<p>
  <img src="https://img.shields.io/badge/License-ISC-blue?style=flat-square" alt="License" />
  <img src="https://img.shields.io/badge/Status-Active-brightgreen?style=flat-square" alt="Status" />
  <img src="https://img.shields.io/badge/PRs-Welcome-orange?style=flat-square" alt="PRs Welcome" />
</p>

</div>

---

## 📋 Table of Contents

- [✨ Features](#-features)
- [🏗️ Tech Stack](#️-tech-stack)
- [📁 Project Structure](#-project-structure)
- [🚀 Getting Started](#-getting-started)
- [🔌 API Endpoints](#-api-endpoints)
- [👥 User Roles](#-user-roles)
- [⚙️ Environment Variables](#️-environment-variables)
- [🤝 Contributing](#-contributing)

---

## ✨ Features

The portal provides a tailored experience for three distinct user roles:

### 🛡️ Admin
- Full control over users, events, and resources
- Manage job postings and mentorship programmes
- Monitor donations and community messages

### 🎓 Alumni
- Post and browse **job opportunities**
- Share & access **learning resources**
- Offer **mentorship** to current students
- Donate to the institution
- Connect via **real-time messaging**
- Participate in **events**

### 🧑‍🎓 Students
- Browse **job listings** posted by alumni
- Request **mentorship** from alumni
- Access **resources** shared by the community
- Register for **events**
- Send messages within the portal

---

## 🏗️ Tech Stack

| Layer      | Technology                              |
|------------|------------------------------------------|
| **Frontend** | React 19, React Router v7, Vite 8, Lucide React, Axios |
| **Backend**  | Node.js, Express 5, Mongoose 9         |
| **Database** | MongoDB                                |
| **Auth**     | JWT (jsonwebtoken), bcryptjs           |
| **Supplementary** | PHP (form handling & string utilities) |
| **Tooling**  | ESLint, dotenv, CORS                   |

---

## 📦 Dependencies

### Backend
- **`express`** (^5.2.1) - Web framework for handling API routes
- **`mongoose`** (^9.4.1) - MongoDB object modeling for schemas
- **`jsonwebtoken`** (^9.0.3) - Token-based authentication
- **`bcryptjs`** (^3.0.3) - Password hashing and security
- **`cors`** (^2.8.6) - Cross-origin resource sharing
- **`dotenv`** (^17.4.2) - Environment variable management

### Frontend
- **`react`** (^19.2.4) & **`react-dom`** (^19.2.4) - Core UI libraries
- **`react-router-dom`** (^7.14.1) - Client-side routing
- **`axios`** (^1.15.0) - Promise-based HTTP client for API requests
- **`lucide-react`** (^1.8.0) - Clean, customizable icon library

### Dev Tooling
- **`vite`** (^8.0.4) - Fast frontend build tool and dev server
- **`eslint`** (^9.39.4) - JavaScript/JSX linting

---

## 📁 Project Structure

```
Alumini-Management-Portal/
├── backend/
│   ├── middleware/          # Auth middleware (JWT verification)
│   ├── models/              # Mongoose schemas
│   │   ├── User.js
│   │   ├── Event.js
│   │   ├── JobPost.js
│   │   ├── Mentorship.js
│   │   ├── Message.js
│   │   ├── Donation.js
│   │   └── Resource.js
│   ├── routes/              # Express route handlers
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   ├── jobRoutes.js
│   │   ├── eventRoutes.js
│   │   ├── messageRoutes.js
│   │   ├── mentorshipRoutes.js
│   │   ├── donationRoutes.js
│   │   └── resourceRoutes.js
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── context/         # AuthContext (global auth state)
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── AdminPortal.jsx
│   │   │   ├── AlumniPortal.jsx
│   │   │   └── StudentPortal.jsx
│   │   ├── App.jsx          # Route definitions & protected routes
│   │   └── main.jsx
│   └── package.json
│
├── php/                     # Supplementary PHP utilities
│   ├── index.php
│   ├── welcome.php
│   ├── form_post.php
│   ├── strings.php
│   └── arrays.php
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18+ and **npm**
- **MongoDB** running locally or a MongoDB Atlas connection string

### 1. Clone the Repository

```bash
git clone https://github.com/aadish8206/allumni-management-portal.git
cd allumni-management-portal
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside `backend/`:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/alumni_portal
JWT_SECRET=your_super_secret_key
```

Start the backend server:

```bash
node server.js
```

The API will be running at `http://localhost:5000`.

### 3. Frontend Setup

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

The React app will be available at `http://localhost:5173`.

---

## 🔌 API Endpoints

### 🔐 Authentication — `/api/auth`

> No token required for these routes.

| Method | Endpoint               | Description                                           |
|--------|------------------------|-------------------------------------------------------|
| `POST` | `/api/auth/register`   | Register a new user (name, email, password, role, batch, department) |
| `POST` | `/api/auth/login`      | Login and receive a JWT token + user info             |

Both endpoints return:
```json
{
  "token": "<jwt>",
  "user": { "id": "...", "name": "...", "email": "...", "role": "..." }
}
```

---

### 🛡️ Protected Routes

> All routes below require `Authorization: Bearer <token>` in the request header.

| Method   | Endpoint                  | Description                        |
|----------|---------------------------|------------------------------------|
| `GET`    | `/api/users`              | Get all users                      |
| `GET`    | `/api/jobs`               | Get all job postings               |
| `POST`   | `/api/jobs`               | Create a new job posting           |
| `DELETE` | `/api/jobs/:id`           | Delete a job posting               |
| `GET`    | `/api/events`             | Get all events                     |
| `POST`   | `/api/events`             | Create an event                    |
| `DELETE` | `/api/events/:id`         | Delete an event                    |
| `GET`    | `/api/messages`           | Get messages                       |
| `POST`   | `/api/messages`           | Send a message                     |
| `GET`    | `/api/mentorship`         | Get all mentorship requests        |
| `POST`   | `/api/mentorship`         | Create a mentorship request        |
| `PUT`    | `/api/mentorship/:id`     | Update mentorship status           |
| `GET`    | `/api/donations`          | Get all donations                  |
| `POST`   | `/api/donations`          | Make a donation                    |
| `GET`    | `/api/resources`          | Get shared resources               |
| `POST`   | `/api/resources`          | Upload a resource                  |
| `DELETE` | `/api/resources/:id`      | Delete a resource                  |

>

---

## 👥 User Roles

The platform uses **role-based access control (RBAC)** with JWT authentication.

| Role      | Access                                                   |
|-----------|----------------------------------------------------------|
| `admin`   | `/admin-portal/*` — full platform management            |
| `alumni`  | `/alumni-portal/*` — jobs, mentoring, resources, events |
| `student` | `/student-portal/*` — browse jobs, request mentorship   |

After login, users are automatically redirected to their role-specific portal. Accessing another role's portal redirects back to the correct one.

---

## ⚙️ Environment Variables

| Variable       | Description                          | Default                                      |
|----------------|--------------------------------------|----------------------------------------------|
| `PORT`         | Port for the Express server          | `5000`                                       |
| `MONGODB_URI`  | MongoDB connection string            | `mongodb://127.0.0.1:27017/alumni_portal`    |
| `JWT_SECRET`   | Secret key for signing JWT tokens    | —                                            |

---

## 🤝 Contributing

Contributions are welcome! Here's how to get started:

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** your changes: `git commit -m 'Add amazing feature'`
4. **Push** to the branch: `git push origin feature/amazing-feature`
5. **Open** a Pull Request

---

<div align="center">

Made with ❤️ for SIH 25017

</div>
