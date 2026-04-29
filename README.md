# 🎓 Alumni Connect: Advanced Management Portal

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](https://github.com/aadish8206/allumni-management-portal)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Framework: React](https://img.shields.io/badge/Framework-React-blue)](https://reactjs.org/)
[![Backend: Node.js](https://img.shields.io/badge/Backend-Node.js-green)](https://nodejs.org/)

**Alumni Connect** is a professional networking and mentorship platform designed for educational institutions. It facilitates seamless interaction between current students and alumni while providing administrators with full oversight of the ecosystem.

---

## 🌟 Vision & Purpose
Most alumni portals are static directories. **Alumni Connect** transforms the portal into a dynamic ecosystem where:
- **Automation** handles administrative drudgery (role transitions).
- **Admin Oversight** ensures student safety and high-quality mentorship.
- **Actionable Opportunities** allow students to turn job posts into real referrals.

---

## 🚀 Key Modules & Features

### 🏛️ 1. Administrative Control Center
- **User Management**: Verify alumni profiles and manage student resumes.
- **Mentorship Approval Queue**: Every student-alumni connection request must be approved by an admin before messaging is enabled.
- **Fundraising & Campaigns**: Launch donation drives for campus projects with real-time progress tracking.
- **Institutional Resources**: Post campus updates, study notes, and official announcements.

### 🎓 2. Student Career Portal
- **Alumni Directory**: Filter alumni by batch, skills, location, or current company.
- **Smart Mentorship Matching**: AI-style skill matching that shows you the best mentors for your specific goals.
- **Real-Time Referrals**: "Request Referral" buttons on the job board that connect you directly to the alumni poster.
- **Resource Hub**: Download PDFs of study materials and campus updates.

### 💼 3. Alumni Engagement Portal
- **LinkedIn Manual Sync**: Update your profile professional stats in one click without expensive API costs.
- **Giving Back**: Post job openings, internships, and offer mentorship slots.
- **Event Manager**: Organize batch reunions or seminar workshops.

### 🤖 4. Background Automation
- **Auto-Transition Engine**: A `node-cron` service that runs daily to promote graduating students to Alumni status based on their graduation year.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React 18, Vite, Tailwind-style Custom CSS |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB Atlas (Mongoose ODM) |
| **Authentication** | JSON Web Tokens (JWT) & BcryptJS |
| **Icons & UI** | Lucide-React, Recharts (Analytics) |
| **Deployment** | Render (Backend), Vercel/Netlify (Frontend) |

---

## 📂 Project Structure

```text
├── backend/
│   ├── models/          # Mongoose Schemas (User, Job, Mentorship, etc.)
│   ├── routes/          # Express API Endpoints
│   ├── services/        # Logic for Cron Jobs & Email
│   ├── utils/           # Helper functions
│   └── server.js        # Entry point
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable UI elements
│   │   ├── context/     # Auth & Global State
│   │   ├── pages/       # Major Portals (Admin, Student, Alumni)
│   │   └── App.jsx      # Routing Logic
```

---

## 🚦 Quick Start Guide

### Prerequisites
- Node.js installed
- MongoDB Atlas account

### 1. Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file:
```env
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
SMTP_USER=your_gmail_address
SMTP_PASS=your_google_app_password
```
Run the server:
```bash
npm run dev
```

### 2. Frontend Setup
```bash
cd frontend
npm install
```
Create a `.env` file:
```env
VITE_API_URL=http://localhost:5000
```
Run the client:
```bash
npm run dev
```

---

## 🔒 Security Features
- **Strict Messaging Policy**: Student-Alumni messaging is 403-Forbidden unless an `APPROVED` mentorship status exists in the database.
- **Admin Verification**: Alumni accounts can be locked behind an admin verification toggle.
- **Secure File Storage**: Resumes and documents are stored as Base64 strings (or optionally connected to S3/Cloudinary).

---

## 🤝 Contributing
Contributions are welcome! Please follow these steps:
1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License
Distributed under the MIT License. See `LICENSE` for more information.

---

**Developed with ❤️ for the Global Alumni Community.**
