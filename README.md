Personal Academic, Portfolio & Learning Management System
Your Personal Academic, Portfolio & Learning Management System is built, connected to your local MongoDB database, seeded with sample records, and actively running.

🌐 Live System URLs
Frontend Application: http://localhost:5173
Backend REST API: http://localhost:5000/api/health
Admin Management Center: http://localhost:5173/admin
Admin Sign-In: http://localhost:5173/login
Default Administrator Credentials
Email: admin@portfolio.local
Password: AdminPassword@123 (A quick "Autofill Default Admin Credentials" button is also available on the login page).
🏗️ Architecture & Modules Overview
             MY PERSONAL SYSTEM
                     │
     ┌───────────────┼────────────────┐
     │               │                │
  ACADEMICS       CAREER          LEARNING
     │               │                │
  Courses          Projects        Skills
  Grades           Certificates    Progress
  Credits          Resume          Roadmaps
  GPA Calculator   Experience      Study Logs
     │               │                │
     └───────────────┼────────────────┘
                     │
               RESOURCES
                     │
             PDFs / Images / Notes / Links
1. Academics & Courses
Academic Course Database: Filter courses by semester, category, status, and keywords. Displays credit values, status badges, instructor details, and earned grades.
Automated GPA & CGPA Calculator: Automatically computed using: $$\text{GPA} = \frac{\sum (\text{Credit} \times \text{Grade Point})}{\sum \text{Credits}}$$
Configurable Grade Point System: Grade mappings (S → 10, A → 9, B → 8, C → 7, D → 6, E → 5, F → 0) are configurable directly from the Admin Dashboard and automatically synchronize across existing course records.
Course Details Page: Dedicated view for each course (e.g. CS501: Machine Learning) with syllabus topic checklists and attached course documents/notes.
Projected "What-If" CGPA Simulator: Test how grades on upcoming/planned credits will impact your cumulative CGPA.
2. Learning Progress & Roadmaps
Active Learning Tracker: Monitor topics with visual progress bars ($0% \to 100%$), current skill levels, target levels, and estimated vs completed hours.
Curriculum Roadmaps: Structured sequential milestones (e.g. Java → OOP → Collections → Exception Handling → DSA → Advanced DSA).
Daily / Weekly Progress Logs: Record study sessions, completed topics, and reflections.
Real-Time Study Metrics: Live calculation of This Week Study Hours, This Month Study Hours, and Learning Streak (Days).
3. Certificates & Credentials Repository
Manage credentials with issuer details, issue dates, credential IDs, verification links, and validated skill badges.
Upload certificate images/PDFs with download and preview options.
Filter by Year, Organization, Category, and Skill.
4. Project Showcase
Portfolio showcase cards with tech stack tags, status indicators, GitHub links, and live demo URLs.
5. Subject Resource Library
Dedicated repository for lecture notes, unit PDFs, cheat sheets, and repositories categorized by Course, Subject, Type, and Semester.
Secure local upload system via Multer with validation against dangerous executables.
6. Admin Management Center
Protected with JSON Web Tokens (JWT) and bcrypt password hashing.
Complete CRUD interfaces with modal dialogs and safety confirmation prompts.
Public vs Private Visibility Controls: Toggle visibility flags on phone numbers, email addresses, and individual records.
7. Central Dashboard & Analytics
Overview of academic performance (CGPA, credits, courses completed).
Learning progress metrics and study streak counters.
Audit feed showing recent system activities.
Global search modal accessible anywhere using Ctrl+K / Cmd+K.
8. Data Exports & Printable Summary
CSV Data Exports: Export courses, learning progress, and certificates as CSV spreadsheets.
Printable Academic Summary: Dedicated academic profile view at /academic-summary formatted for clean printing and PDF generation (window.print()).
9. Theme & Aesthetic Controls
Minimal, modern, academic, and technology-focused design using Inter, Outfit, and JetBrains Mono.
Persistent Light, Dark, and System theme options stored in localStorage.
🗄️ Database & Seeding
The application runs on MongoDB (mongodb://127.0.0.1:27017/PersonalPortfolioDB) across 13 Mongoose models:

User.js — Administrator credentials
Profile.js — Personal identity, career objective, contact info, privacy flags
Education.js — Degree timeline, percentages, coursework, achievements
Skill.js — Categorized skills with proficiency scores
Course.js — Enrolled and completed courses with syllabus subdocuments
GradeSetting.js — Institutional grade-point mappings
Resource.js — Attached PDFs, notes, documents, and web links
Certificate.js — Verified accreditations and credential IDs
Project.js — Showcase projects with technology tags
LearningItem.js — Active self-study goals with roadmap steps
StudyLog.js — Daily/weekly study time sessions and streak counters
Interest.js — Focus domains and related skills
ActivityLog.js — Audit log of recent actions
The database has been seeded using npm run seed.

💻 Commands Reference
Action	Command
Start Server	npm --prefix server start
Start Server (Dev Reload)	npm --prefix server run dev
Start Frontend	npm --prefix client run dev
Build Frontend	npm --prefix client run build
Re-seed Sample Data	npm run seed
📄 Key Files Created
Root Orchestration: 

package.json
, 

.env.example
, 

.gitignore
, 

README.md
Express Backend: 

server.js
, 

db.js
, 

seedData.js
API Routes: 

authRoutes.js
, 

courseRoutes.js
, 

learningRoutes.js
, 

exportRoutes.js
React Frontend: 

App.jsx
, 

index.css
, 

Layout.jsx
Frontend Pages: 

Home.jsx
, 

Courses.jsx
, 

CourseDetail.jsx
, 

GpaCalculator.jsx
, 

LearningProgress.jsx
, 

AdminLayout.jsx
