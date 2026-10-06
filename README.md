# Personal Academic, Portfolio & Learning Management System

> A full-stack, responsive, database-driven digital academic ecosystem and personal learning management dashboard built with React, Node.js, Express, and MongoDB.

---

## 📌 Overview

This platform functions as a unified digital portfolio and academic management hub tailored for engineering and computer science students. Rather than relying on static or hard-coded web templates, every course, grade, credit point, certificate, project, and study log is persisted in a local MongoDB database (or MongoDB Atlas in production) and is fully manageable through an authenticated **Admin Dashboard**.

---

## 🚀 Key Features

### 1. 🎓 Academics & Courses
- **Academic Database**: Track course codes, credit units, semesters, instructors, and completion status (*Completed*, *Currently Learning*, *Not Completed*, *Planned*, *Dropped*).
- **Automated GPA / CGPA Calculation**: Computed using the official weighted equation:
  $$\text{GPA} = \frac{\sum (\text{Credits} \times \text{Grade Point})}{\sum \text{Credits}}$$
- **Configurable Grade Point System**: Configure custom letter-grade mappings (*S → 10, A → 9, B → 8, C → 7, D → 6, E → 5, F → 0*) via the Admin Console, which automatically synchronizes and recalculates course points.
- **Dedicated Course Details Page**: Individual breakdown for every course displaying syllabus topics with progress checkboxes and linked downloadable lecture notes, assignment PDFs, and references.
- **Interactive What-If CGPA Simulator**: Project expected graduation CGPA by simulating future credit allocations and anticipated grade points.

### 2. 🧠 Learning Progress Tracker & Roadmaps
- **Active Learning Tracks**: Monitor ongoing skills and topics with progress percentages ($0\% \to 100\%$), estimated hours, current skill level, and target level.
- **Sequential Curriculum Roadmaps**: Step-by-step milestones (e.g. *Java → OOP → Collections → Exception Handling → DSA → Advanced DSA*).
- **Daily / Weekly Study Time Logs**: Log focused study sessions with hours studied, completed topics, and reflections.
- **Real-Time Analytics**: Automatic tracking of **This Week Study Hours**, **This Month Study Hours**, and consecutive **Study Streaks (Days)**.

### 3. 📜 Certificates & Credentials Repository
- Register earned credentials with issuing organizations, credential IDs, verification URLs, validated skills badges, and linked coursework.
- Multi-filtering by Year, Issuing Organization, Category, and Skill.
- Local certificate document / image upload with download and preview options.

### 4. 💼 Projects Showcase
- Detailed cards highlighting engineering applications, research projects, and systems tools.
- Tech stack tags, status badges (*Completed*, *In Progress*, *Planned*), GitHub repository links, and live deployment URLs.

### 5. 📚 Subject Resource Library
- Centralized academic file and documentation repository categorized by Course, Subject, Type (*PDF*, *Notes*, *Document*, *Video*, *Website*, *GitHub Repository*), Semester, and Topic.
- File upload support via Multer with validation against dangerous file formats.

### 6. 🔐 Admin Console & Privacy Controls
- Protected with JSON Web Tokens (JWT) and `bcrypt` password hashing.
- Complete CRUD interfaces with responsive modal dialogs and safety confirmation prompts.
- **Public vs Private Data Toggles**: Toggle visibility flags on phone numbers, email addresses, and specific portfolio records.

### 7. 📊 Global Search & Data Export
- Instant global search modal with keyboard shortcut (`Ctrl+K` / `Cmd+K`) searching across courses, skills, certificates, projects, and learning items.
- CSV data exports for academic courses, learning progress, and certificates.
- Dedicated printable **Academic Summary Report** optimized for clean browser printing (`window.print()`).

### 8. 🎨 Design & Aesthetic Excellence
- Minimal, modern, academic, and technology-focused aesthetics with clean typography (`Inter`, `Outfit`, `JetBrains Mono`).
- Zero distractive confetti or neon glows; clean 200–400ms CSS transitions.
- Light, Dark, and System Theme support with persistent user preferences in `localStorage`.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite, Vanilla CSS Design System, React Router 6, Lucide Icons |
| **Backend** | Node.js, Express.js, Multer, JSON Web Tokens (JWT), bcryptjs, Morgan |
| **Database** | MongoDB & Mongoose ORM |
| **File Storage** | Local Storage (`/uploads`) with easy Cloudinary / S3 pluggability |

---

## 📂 Project Structure

```text
personal-academic-management/
│
├── client/                      # Frontend Application (React + Vite)
│   ├── src/
│   │   ├── components/          # Reusable UI (Layout, Modal, SearchModal, Badges, etc.)
│   │   ├── context/             # AuthContext, ThemeContext, ToastContext
│   │   ├── pages/               # Home, About, Courses, CourseDetail, GpaCalculator,
│   │   │   │                    # Resources, Certificates, Projects, LearningProgress,
│   │   │   │                    # Interests, Dashboard, AcademicSummary, Login
│   │   │   └── admin/           # Admin Console views (Courses, Skills, Profile, Grades, etc.)
│   │   ├── services/            # Clean Fetch API client layer
│   │   ├── index.css            # CSS variables, typography, and responsive design system
│   │   ├── App.jsx              # Application router
│   │   └── main.jsx             # React DOM root
│   ├── index.html
│   ├── vite.config.js           # API and upload proxy configuration
│   └── package.json
│
├── server/                      # Backend API (Node.js + Express)
│   ├── config/                  # Mongoose database connection
│   ├── middleware/              # Auth, Multer file upload, Error handling
│   ├── models/                  # 13 Mongoose Schemas (User, Course, Skill, Resource, etc.)
│   ├── routes/                  # Express REST routes (/api/courses, /api/auth, /api/learning, etc.)
│   ├── seed/                    # Comprehensive database seeder script
│   ├── uploads/                 # Local directory for uploaded PDFs and documents
│   ├── server.js                # Express app entry point
│   ├── .env                     # Server environment variables
│   └── package.json
│
├── .env.example                 # Environment configuration template
├── .gitignore                   # Git exclusions
├── README.md                    # System documentation
└── package.json                 # Root script orchestration
```

---

## ⚙️ Installation & Setup

### Prerequisites
- **Node.js**: v18.0.0 or higher (Tested on Node v24.x)
- **MongoDB**: Local MongoDB instance running on `localhost:27017` or a MongoDB Atlas URI

### 1. Clone & Install Dependencies

From the project root:

```bash
# Install root, backend, and frontend packages
npm --prefix server install
npm --prefix client install
```

### 2. Configure Environment Variables

The backend loads configuration from `server/.env`. A template is provided in `.env.example`:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/PersonalPortfolioDB
JWT_SECRET=super_secret_jwt_key_academic_portfolio_2026_dev
ADMIN_EMAIL=admin@portfolio.local
ADMIN_PASSWORD=AdminPassword@123
CLIENT_URL=http://localhost:5173
```

> **For MongoDB Atlas (Production)**:
> Replace `MONGODB_URI` with your connection string:
> `MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/PersonalPortfolioDB?retryWrites=true&w=majority`

### 3. Seed the Database

Populate MongoDB with realistic computer science and artificial intelligence student records:

```bash
npm run seed
# or: npm --prefix server run seed
```

This populates:
- **Admin Account**: `admin@portfolio.local` / `AdminPassword@123`
- Default Profile & Bio
- Education Records (B.Tech AIML & Senior Secondary)
- Categorized Skills & Proficiencies
- Courses with Credits, Grades, and Topics (CS501, CS302, CS403, etc.)
- Grade Point Settings (S=10, A=9, B=8, C=7, D=6, E=5, F=0)
- Verified Certificates with Credentials
- Project Showcases
- Active Learning Roadmaps & Study Session Logs
- Academic Interests

---

## 🏃 Running the Application

### Start Backend Server

```bash
npm --prefix server start
# Or with auto-reload: npm --prefix server run dev
```
*Backend will be running on `http://localhost:5000`.*

### Start Frontend Application

```bash
npm --prefix client run dev
```
*Frontend will be running on `http://localhost:5173`.*

---

## 🔑 Administrator Credentials

To access the Admin Management Center:
1. Navigate to `http://localhost:5173/login` or click **Admin Sign In** in the top navigation bar.
2. Sign in with:
   - **Email**: `admin@portfolio.local`
   - **Password**: `AdminPassword@123`
   *(An "Autofill Default Admin Credentials" button is provided on the login form for convenience).*

---

## 📡 REST API Documentation

### Authentication (`/api/auth`)
- `POST /api/auth/login` — Authenticate admin and return JWT
- `GET /api/auth/me` — Verify active admin token
- `POST /api/auth/change-password` — Change password (Protected)

### Profile (`/api/profile`)
- `GET /api/profile` — Fetch portfolio profile (masks private fields for public viewers)
- `PUT /api/profile` — Update profile details and visibility settings (Protected)

### Courses & Grades (`/api/courses`)
- `GET /api/courses` — List courses (filters: `semester`, `status`, `category`, `search`)
- `GET /api/courses/stats` — Calculate cumulative CGPA, credits, and semester trends
- `GET /api/courses/grades-config` — Fetch configurable grade point mappings
- `PUT /api/courses/grades-config` — Update grade point table & synchronize courses (Protected)
- `GET /api/courses/:id` — Course detail with attached resources & syllabus topics
- `POST /api/courses` — Add new course (Protected)
- `PUT /api/courses/:id` — Update course (Protected)
- `DELETE /api/courses/:id` — Remove course (Protected)
- `POST /api/courses/:id/topics` — Append syllabus topic (Protected)
- `PUT /api/courses/:id/topics/:topicId` — Toggle topic status (Protected)
- `DELETE /api/courses/:id/topics/:topicId` — Remove topic (Protected)

### Learning Progress (`/api/learning`)
- `GET /api/learning` — List tracked subjects and roadmaps
- `GET /api/learning/stats` — Compute study streaks, weekly/monthly study hours
- `GET /api/learning/logs` — List study session records
- `POST /api/learning/logs` — Record new study session (Protected)
- `DELETE /api/learning/logs/:id` — Remove study session (Protected)
- `POST /api/learning` — Create learning track (Protected)
- `PUT /api/learning/:id` — Update track (Protected)
- `DELETE /api/learning/:id` — Delete track (Protected)

### Resources & Certificates (`/api/resources`, `/api/certificates`)
- `GET /api/resources` — Filter resources by course, subject, or type
- `POST /api/resources` — Create resource record (Protected)
- `DELETE /api/resources/:id` — Delete resource & local file (Protected)
- `GET /api/certificates` — Filter certificates by year, org, skill
- `POST /api/certificates` — Add certificate (Protected)

### Uploads & Data Exports (`/api/upload`, `/api/export`)
- `POST /api/upload` — Multipart single file upload for PDFs, images, docs (Protected)
- `GET /api/export/courses/csv` — Stream courses database as CSV
- `GET /api/export/certificates/csv` — Stream certificates as CSV
- `GET /api/export/learning/csv` — Stream learning progress as CSV
- `GET /api/export/academic-summary` — Complete JSON package for academic summary report

---

## 🚢 Production Deployment Guide

### Deploying Backend to Render
1. Create a **Web Service** on [Render](https://render.com).
2. Root directory: `server`.
3. Build command: `npm install`.
4. Start command: `node server.js`.
5. Environment Variables:
   - `PORT`: `5000`
   - `MONGODB_URI`: *Your MongoDB Atlas connection URI*
   - `JWT_SECRET`: *A strong random key*
   - `CLIENT_URL`: *Your frontend production URL*

### Deploying Frontend to Vercel / Netlify
1. Create a project on [Vercel](https://vercel.com).
2. Root directory: `client`.
3. Build command: `npm run build`.
4. Output directory: `dist`.
5. Proxy rewrite: Configure `vercel.json` rewrites for `/api/(.*)` to point to your Render backend URL.

---

## 🧪 Quality Assurance & Testing Checklist

- [x] **Database Connectivity**: Verified local MongoDB port 27017 and collection persistence.
- [x] **Authentication Flow**: Tested JWT generation, protected endpoints, and incorrect credentials rejection.
- [x] **GPA Equation**: Confirmed $\sum(\text{Credit} \times \text{Point}) / \sum\text{Credits}$ matches verified calculations.
- [x] **CRUD Operations**: Validated create, read, update, and delete actions across all collections.
- [x] **File Uploads**: Verified MIME-type validation, unique filenames, and static file serving.
- [x] **Search & Filters**: Verified query filtering across categories, statuses, and global search terms.
- [x] **Responsive Layout**: Tested sidebar drawer behavior and breakpoints for desktop, tablet, and mobile.
- [x] **Theme Persistence**: Tested Light, Dark, and System theme toggles across reload cycles.
