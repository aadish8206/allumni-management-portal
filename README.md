# 🎓 Centralized Alumni Management Portal
### SIH Problem Statement — 25017

<div align="center">

![Alumni Portal Banner](https://img.shields.io/badge/SIH-25017-blue?style=for-the-badge&logo=graduation-cap)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![PHP](https://img.shields.io/badge/PHP-777BB4?style=for-the-badge&logo=php&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)

**A full-stack, role-based centralized platform to connect Alumni, Students, and Institutions.**

</div>

---

## 📌 Problem Statement

Most educational institutions lack a reliable, centralized system to manage alumni data. Once students graduate, their contact information and career updates are lost across WhatsApp groups and mailing lists. This platform solves that.

---

## 🗂️ Project Structure

```
Alumini-Management-Portal/
├── backend/               ← Node.js + Express REST API
│   ├── models/            ← MongoDB Mongoose schemas
│   ├── routes/            ← API route handlers
│   ├── middleware/        ← JWT auth & role checking
│   ├── server.js          ← Entry point
│   └── .env               ← Environment config (not uploaded)
│
├── frontend/              ← React + Vite SPA
│   └── src/
│       ├── context/       ← AuthContext (JWT state)
│       ├── pages/         ← AdminPortal, StudentPortal, AlumniPortal
│       └── App.jsx        ← Role-based routing
│
└── php/                   ← PHP Demo Programs (XAMPP)
    ├── index.php          ← Demo dashboard
    ├── welcome.php        ← Demo #1: Date & Time
    ├── form_post.php      ← Demo #2: POST Form
    ├── strings.php        ← Demo #3: String Manipulation
    └── arrays.php         ← Demo #4: Arrays
```

---

## ✨ Features by Portal

### 🔴 Admin Portal (Institute Level)
| Feature | Description |
|---------|-------------|
| 📊 Dashboard Stats | Total alumni, students, verified, pending counts |
| ✅ User Verification | Verify or delete registered alumni/students |
| 💰 Fundraising Tools | View all donations, project-wise totals |
| 📢 Resource & Announcements | Post notes, updates for students & alumni |

### 🟢 Student Portal (Class & Career)
| Feature | Description |
|---------|-------------|
| 🔍 Alumni Directory | Filter by batch, year, department |
| 🌟 Mentorship Access | Find and request alumni mentors |
| 💼 Opportunity Board | View internships, jobs, and referrals |
| 📚 Resource Hub | Access notes and campus announcements |

### 🟡 Alumni Portal (Engagement)
| Feature | Description |
|---------|-------------|
| 📨 Direct Contact | Inbox/Sent messaging with students & fellow alumni |
| 👤 Professional Profile | Edit career status, company, LinkedIn, bio |
| 🤝 Giving Back | Post jobs, offer mentorship, donate to projects |
| 📅 Event Manager | Organize batch reunions, RSVP to events |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite, Lucide Icons, Vanilla CSS |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas (Mongoose ODM) |
| Auth | JWT (JSON Web Tokens) + bcryptjs |
| PHP Demos | PHP 8+ via XAMPP Apache |

---

## 🚀 Step-by-Step Setup Guide

### ✅ Prerequisites — Install These First

| Tool | Download Link |
|------|--------------|
| Node.js (v18+) | https://nodejs.org |
| MongoDB Atlas (free) | https://cloud.mongodb.com |
| XAMPP (for PHP) | https://www.apachefriends.org |
| Git | https://git-scm.com |

---

### 📥 Step 1 — Clone the Repository

Open your terminal and run:

```bash
git clone https://github.com/aadish8206/allumni-management-portal.git
cd allumni-management-portal
```

---

### 🔧 Step 2 — Configure the Backend

```bash
cd backend
```

Create a `.env` file inside the `backend/` folder with this content:

```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/alumni_portal
JWT_SECRET=your_super_secret_key
```

> 🔒 Replace `<username>` and `<password>` with your MongoDB Atlas credentials.

Install backend dependencies:

```bash
npm install
```

---

### ▶️ Step 3 — Start the Backend Server

```bash
node server.js
```

✅ You should see:
```
Server started on port 5000
MongoDB Connected successfully
```

---

### 🎨 Step 4 — Setup the Frontend

Open a **new terminal** window:

```bash
cd frontend
npm install
```

---

### ▶️ Step 5 — Start the Frontend (React)

```bash
npm run dev
```

✅ Open your browser and go to:
```
http://localhost:5173
```

---

### 🐘 Step 6 — Run the PHP Demos (Optional)

1. Open **XAMPP Control Panel**
2. Click **Start** next to **Apache**
3. Copy the `php/` folder to `C:\xampp\htdocs\alumni-php\`
4. Open your browser:
```
http://localhost/alumni-php/index.php
```

---

## 🔐 How Login Works

```
Register → Select Role (Admin / Student / Alumni)
         ↓
Login → JWT Token issued
         ↓
Role detected → Redirect to specific portal
         ↓
Admin    → /admin-portal
Student  → /student-portal
Alumni   → /alumni-portal
```

> Each portal is **fully isolated** — a student cannot access the alumni or admin portal.

---

## 🐘 PHP Demo Programs

| # | File | Concepts Covered |
|---|------|-----------------|
| 1 | `welcome.php` | `date()`, `date_default_timezone_set()` |
| 2 | `form_post.php` | `$_POST`, `$_SERVER["REQUEST_METHOD"]`, `htmlspecialchars()` |
| 3 | `strings.php` | `strrev()`, `strlen()`, `substr()`, `strtoupper()`, `strtolower()` |
| 4 | `arrays.php` | Indexed, Associative, Multidimensional arrays, `sort()`, `count()` |

---

## 📡 API Endpoints

### Auth
| Method | Endpoint | Access |
|--------|----------|--------|
| POST | `/api/auth/register` | Public |
| POST | `/api/auth/login` | Public |

### Users
| Method | Endpoint | Access |
|--------|----------|--------|
| GET | `/api/users/me` | All roles |
| GET | `/api/users/admin/users` | Admin only |
| PUT | `/api/users/admin/verify/:id` | Admin only |
| GET | `/api/users/directory` | Student / Alumni / Admin |

### Jobs, Events, Messages, Mentorship, Donations, Resources
All protected by JWT and role-based middleware.

---

## 👥 Team & Stakeholders

- 🎓 **Alumni** — Networking, mentoring, giving back
- 📖 **Students** — Mentorship, opportunities, resources
- 🏫 **Administrators** — Platform management, verification, fundraising
- 🏛️ **Institution** — Accreditation support, NAAC/NIRF data

---

## 📄 License

This project is built for **Smart India Hackathon (SIH) 2025** — Problem Statement **25017**.

---

<div align="center">
  Made with ❤️ for SIH 25017
</div>
