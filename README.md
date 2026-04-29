# 🎓 Alumni Connect: Complete Management System

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](https://github.com/aadish8206/allumni-management-portal)
[![Framework: React](https://img.shields.io/badge/Framework-React-blue)](https://reactjs.org/)
[![Backend: Node.js](https://img.shields.io/badge/Backend-Node.js-green)](https://nodejs.org/)

**Alumni Connect** is a professional MERN-stack platform designed to bridge the gap between current students and alumni. It features automated role transitions, secure admin-mediated networking, and a live referral job board.

---

## 🚀 Core Features

### 1. Automated Lifecycle Management
- **Smart Role Transition**: A daily background service (`node-cron`) automatically promotes students to the "Alumni" role upon reaching their graduation year.
- **LinkedIn Manual Sync**: A built-in tool for alumni to quickly update their professional experience (Job Title, Company) without expensive API fees.

### 2. Admin Oversight & Security
- **Approval-Gate Networking**: Direct student-to-alumni messaging is blocked by default. Admins must approve mentorship/contact requests to unlock communication.
- **Verification System**: Full control over alumni account verification and resume management.
- **Analytical Dashboard**: Real-time stats on user distribution, donations, and campaign progress.

### 3. Student & Career Tools
- **Advanced Alumni Directory**: Search and filter by skills, company, batch, or department.
- **Interactive Job Board**: View internships, jobs, and referrals posted by alumni.
- **Direct Referral Requests**: Request referrals directly from alumni posters through the approved messaging system.
- **Resource Hub**: Access campus resources, study materials, and official announcements in PDF format.

### 4. Alumni & Institution Engagement
- **Opportunity Posting**: Alumni can post jobs and mentor slots to give back to the campus.
- **Fundraising & Donations**: Integrated donation system for campus development projects.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React 18, Vite, Lucide Icons, Recharts |
| **Backend** | Node.js, Express.js, Node-cron |
| **Database** | MongoDB Atlas (Mongoose) |
| **Auth** | JWT (JSON Web Tokens) & BcryptJS |
| **Email** | Nodemailer (Gmail SMTP) |

---

## 📂 Project Structure

```text
├── backend/
│   ├── models/          # Database Schemas
│   ├── routes/          # API Endpoints
│   ├── services/        # Logic (Email, Cron Automation)
│   └── server.js        # Entry point
└── frontend/
    ├── src/
    │   ├── context/     # Global State & Auth
    │   ├── pages/       # Portals (Admin, Student, Alumni)
    │   └── App.jsx      # Main Logic & Routing
```

---

## 🚦 Installation & Setup

### Prerequisites
- Node.js & npm
- MongoDB Atlas Account

### 1. Backend Setup
1. Navigate to the backend folder: `cd backend`
2. Install dependencies: `npm install`
3. Create a `.env` file:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_atlas_uri
   JWT_SECRET=your_jwt_secret
   SMTP_USER=your_gmail@gmail.com
   SMTP_PASS=your_google_app_password
   # Render compatibility
   EMAIL_USER=your_gmail@gmail.com
   EMAIL_PASS=your_google_app_password
   ```
4. Start the server: `npm run dev`

### 2. Frontend Setup
1. Navigate to the frontend folder: `cd frontend`
2. Install dependencies: `npm install`
3. Create a `.env` file:
   ```env
   VITE_API_URL=http://localhost:5000
   ```
4. Start the application: `npm run dev`

---

## 🌐 Deployment
This project is optimized for **Render**. 
- **Backend**: Connect the `backend/` folder and set the environment variables in the Render dashboard.
- **Frontend**: Connect the `frontend/` folder and set `VITE_API_URL` to your live backend URL.

---

## 🤝 Support
For any issues or feature requests, please open an issue on the GitHub repository.

---

**Developed with focus on Security, Automation, and Career Growth.**
