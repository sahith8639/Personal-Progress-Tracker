import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Education } from './pages/Education';
import { Skills } from './pages/Skills';
import { Courses } from './pages/Courses';
import { CourseDetail } from './pages/CourseDetail';
import { GpaCalculator } from './pages/GpaCalculator';
import { Resources } from './pages/Resources';
import { Certificates } from './pages/Certificates';
import { Projects } from './pages/Projects';
import { LearningProgress } from './pages/LearningProgress';
import { Interests } from './pages/Interests';
import { Dashboard } from './pages/Dashboard';
import { AcademicSummary } from './pages/AcademicSummary';
import { Login } from './pages/Login';
import { AdminLayout } from './pages/admin/AdminLayout';

export function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/education" element={<Education />} />
        <Route path="/skills" element={<Skills />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/courses/:id" element={<CourseDetail />} />
        <Route path="/gpa-calculator" element={<GpaCalculator />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/certificates" element={<Certificates />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/learning" element={<LearningProgress />} />
        <Route path="/interests" element={<Interests />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/academic-summary" element={<AcademicSummary />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin/*" element={<AdminLayout />} />
        {/* Fallback route */}
        <Route path="*" element={<Home />} />
      </Routes>
    </Layout>
  );
}

export default App;
