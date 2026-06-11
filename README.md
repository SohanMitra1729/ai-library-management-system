# NexusLib - AI-Powered Library Management System

## Overview

NexusLib is a modern full-stack Library Management System built to streamline library operations and enhance student learning through AI-powered features.

The platform supports book catalog management, issue and return workflows, reservations, fine management, analytics dashboards, AI recommendations, and personalized study planning.

---

## Features

### Authentication & Authorization

* JWT-based authentication
* Secure login and registration
* Role-based access control
* Student and Librarian dashboards

### Library Management

* Book catalog management
* Search and filtering
* Book issue and return
* Book reservation system
* Availability tracking
* Inventory management

### Fine Management

* Automated fine calculation
* Fine status tracking
* Fine collection analytics
* Student fine history

### Analytics Dashboard

* Borrowing statistics
* Reservation trends
* Fine collection insights
* Real-time library metrics

### AI Features

* AI-powered book recommendations
* Personalized study planner
* Learning roadmap generation
* Goal-based study planning

### Cloud Deployment

* Frontend deployed on Vercel
* Backend deployed on Railway
* MySQL cloud database integration

---

## Tech Stack

### Frontend

* React.js
* Axios
* React Router
* Tailwind CSS
* Recharts

### Backend

* Node.js
* Express.js
* JWT Authentication
* REST APIs

### Database

* MySQL

### Cloud & DevOps

* Railway
* Vercel
* GitHub

### AI

* Google Gemini API

---

## System Architecture

Frontend (React.js)

↓

REST API (Node.js + Express.js)

↓

Authentication Layer (JWT)

↓

MySQL Database (Railway)

↓

AI Services (Gemini API)

---

## Screenshots

### Login Page

Modern authentication system with secure access control.

### Analytics Dashboard

Real-time borrowing, reservation, and fine analytics.

### AI Study Planner

Generates personalized learning roadmaps based on goals and duration.

### Book Catalog

Advanced search and filtering for library resources.

---

## Installation

### Clone Repository

```bash
git clone https://github.com/SohanMitra1729/ai-library-management-system.git
cd ai-library-management-system
```

### Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file:

```env
DB_HOST=your_database_host
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_NAME=your_database_name

JWT_SECRET=your_jwt_secret

GEMINI_API_KEY=your_gemini_api_key
```

Start backend:

```bash
npm start
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

## Project Highlights

* Full-stack web application
* Cloud deployment using Railway and Vercel
* JWT authentication and authorization
* AI-powered recommendation system
* AI study planner
* Real-time analytics dashboard
* Fine and reservation management
* Responsive modern UI

---

## Future Enhancements

* Email notifications
* QR-based book issuing
* OCR-based book entry
* Advanced recommendation engine
* Mobile application
* Predictive analytics for library demand

---

## Author

**Marthula Sohan Mitra**

GitHub: https://github.com/SohanMitra1729

NIT Silchar - Computer Science and Engineering

Research Intern - DRDO
