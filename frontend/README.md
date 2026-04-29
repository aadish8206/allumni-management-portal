# 💻 Alumni Connect: Frontend (React + Vite)

This is the frontend client for the Alumni Management Portal, built with modern React patterns and Vite for high performance.

## 🚀 Features
- **Dynamic Portals**: Separate dashboards for Admin, Student, and Alumni.
- **Real-time Stats**: Interactive charts using Recharts for administrator oversight.
- **Smart Filters**: Advanced search and filtering for the Alumni Directory.
- **Context API**: Global state management for authentication and user sessions.
- **Responsive Design**: Custom CSS built for accessibility and visual excellence.

## 🛠️ Tech Stack
- **Framework**: React 18
- **Build Tool**: Vite
- **Icons**: Lucide-React
- **Charts**: Recharts
- **HTTP Client**: Axios

## 🚦 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in this directory:
```env
VITE_API_URL=http://localhost:5000
```

### 3. Run Development Server
```bash
npm run dev
```

## 📂 Key Directory Structure
- `src/pages`: Contains the core portal logic (`AdminPortal.jsx`, `StudentPortal.jsx`, `AlumniPortal.jsx`).
- `src/context`: Authentication and global state handling.
- `src/components`: Shared UI components and modals.
- `index.css`: Global design system and premium themes.
