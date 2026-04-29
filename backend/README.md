# ⚙️ Alumni Connect: Backend (Node.js + Express)

This is the backend server for the Alumni Management Portal, providing secure APIs, automated services, and database management.

## 🚀 Features
- **RESTful API**: Secure endpoints for user management, jobs, mentorship, and donations.
- **JWT Authentication**: Token-based security with bcrypt password hashing.
- **Auto-Transition (Cron)**: Daily automated promotion of students to alumni roles via `node-cron`.
- **Admin Oversight**: Moderation logic for mentorship requests and account verification.
- **Email Service**: Automated notifications using Nodemailer (Gmail SMTP).

## 🛠️ Tech Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Automation**: Node-cron
- **Mailing**: Nodemailer

## 🚦 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in this directory:
```env
PORT=5000
MONGODB_URI=your_mongodb_atlas_uri
JWT_SECRET=your_jwt_secret_key
SMTP_USER=your_gmail_address
SMTP_PASS=your_google_app_password
EMAIL_USER=your_gmail_address  # For Render compatibility
EMAIL_PASS=your_app_password   # For Render compatibility
```

### 3. Run Server
```bash
# Production mode
npm start

# Development mode
npm run dev
```

## 📂 Key Directory Structure
- `models/`: Database schemas and validation.
- `routes/`: API endpoint routing logic.
- `services/`: Background tasks (`cronService.js`) and mailing (`emailService.js`).
- `server.js`: Application entry point and database connection.
