# NextHire Job Portal

NextHire is a modern, premium job portal web application built on the MERN stack (MongoDB, Express, React, Node.js). It features a clean, responsive **light mode** design system built with Vanilla CSS and implements standard candidate and recruiter workflows.

---

## 🌟 Key Features

### 👤 For Job Seekers
- **Explore & Filter Jobs**: Advanced sidebar filters search by keyword (title, company, description), location, and employment type (Full-time, Part-time, Contract, Remote, Internship).
- **Interactive Listings**: Seamless page transitions and dedicated job specification views showing company info, salary ranges, location, and key requirements.
- **Application Hub**: Apply for jobs directly by supplying a cover letter and linking/syncing resumes.
- **Seeker Dashboard**: Track submitted applications, review application dates, and monitor live status changes (Pending, Shortlisted, Accepted, Rejected).

### 💼 For Recruiters / Employers
- **Job Creation & Management**: Publish new job listings with title, description, company, salary ranges, types, and bulleted candidate requirements.
- **Applicants Control Center**: Inspect candidate details, list skills/experience, read cover letters, open candidate resume links, and accept/shortlist/reject candidates in real time.
- **CRUD Operations**: Edit active job listings or delete postings (which automatically clears associated applicant logs).

---

## 🛠️ Tech Stack

- **Frontend**: React (Vite-based), React Router DOM (client-side routing), Lucide React (icons), and Vanilla CSS custom variable designs (Light Mode).
- **Backend**: Node.js, Express.js (REST API endpoints), jsonwebtoken (JWT session security), bcryptjs (password hashing).
- **Database**: 
  - **Primary**: MongoDB (Mongoose object data modeling).
  - **Fallback**: Auto-initializing, local file-based database (`backend/data/db.json`) that simulates MongoDB operations. *Ensures the app runs out-of-the-box even without a local MongoDB service.*

---

## 🚀 How to Run Locally

### 1. Prerequisite
Ensure you have [Node.js](https://nodejs.org/) installed.

### 2. Clone/Open the Project Directory
Navigate to the root project folder:
```bash
cd full-stack-job-portal
```

### 3. Setup and Run the Backend
Navigate to the `backend` folder, install dependencies, and start the development server:
```bash
cd backend
npm install
npm run dev
```
*Note: The backend will start on **port 5000**. If no `MONGO_URI` is provided in `backend/.env`, it will automatically create and seed `backend/data/db.json` with demo accounts and job posts.*

### 4. Setup and Run the Frontend
In a new terminal window, navigate to the `frontend` folder, install dependencies, and start the React dev server:
```bash
cd ../frontend
npm install
npm run dev
```
*Note: The React application will start on **port 5173**.*

### 5. Access the App
Go to your browser and open:
👉 **[http://localhost:5173](http://localhost:5173)**

---

## 🔑 Demo Test Accounts

The database is pre-seeded with two accounts (password for both is `password123`):

1. **Job Seeker**:
   - **Email**: `seeker@nexthire.com`
   - **Password**: `password123`
2. **Recruiter / Employer**:
   - **Email**: `recruiter@nexthire.com`
   - **Password**: `password123`
