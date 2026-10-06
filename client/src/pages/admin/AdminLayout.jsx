import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Shield,
  User,
  BookOpen,
  GraduationCap,
  Code2,
  Award,
  FolderGit2,
  Library,
  TrendingUp,
  Heart,
  Settings,
  Sliders,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { AdminOverview } from './AdminOverview';
import { AdminProfile } from './AdminProfile';
import { AdminCourses } from './AdminCourses';
import { AdminEducation } from './AdminEducation';
import { AdminSkills } from './AdminSkills';
import { AdminCertificates } from './AdminCertificates';
import { AdminProjects } from './AdminProjects';
import { AdminResources } from './AdminResources';
import { AdminLearning } from './AdminLearning';
import { AdminInterests } from './AdminInterests';
import { AdminGradeSettings } from './AdminGradeSettings';

export const AdminLayout = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { user, isAuthenticated, loading, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login');
    }
  }, [loading, isAuthenticated, navigate]);

  if (loading || !isAuthenticated) {
    return <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>Verifying Administrator Session...</div>;
  }

  const tabs = [
    { id: 'overview', label: 'Console Overview', icon: Shield },
    { id: 'profile', label: 'Profile & Bio', icon: User },
    { id: 'courses', label: 'Courses & Syllabus', icon: BookOpen },
    { id: 'education', label: 'Education History', icon: GraduationCap },
    { id: 'skills', label: 'Skills & Levels', icon: Code2 },
    { id: 'certificates', label: 'Certificates', icon: Award },
    { id: 'projects', label: 'Projects Showcase', icon: FolderGit2 },
    { id: 'resources', label: 'Resource Library', icon: Library },
    { id: 'learning', label: 'Learning & Roadmaps', icon: TrendingUp },
    { id: 'interests', label: 'Interests', icon: Heart },
    { id: 'grades', label: 'GPA Grade Mapping', icon: Sliders },
  ];

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Top Banner */}
      <div
        className="card"
        style={{
          padding: '1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          background: 'linear-gradient(135deg, var(--bg-surface) 0%, var(--bg-secondary) 100%)',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span className="badge badge-success" style={{ fontSize: '0.75rem' }}>Authenticated</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{user?.email}</span>
          </div>
          <h1 style={{ fontSize: '1.8rem', marginTop: '0.25rem' }}>Admin Management Center</h1>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn btn-outline btn-sm" onClick={() => logout()}>
            <LogOut size={14} /> Sign Out
          </button>
        </div>
      </div>

      {/* Tabs Bar */}
      <div style={{ display: 'flex', gap: '0.4rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`btn btn-sm ${isActive ? 'btn-primary' : 'btn-secondary'}`}
              style={{ whiteSpace: 'nowrap' }}
            >
              <Icon size={14} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <div>
        {activeTab === 'overview' && <AdminOverview onSelectTab={setActiveTab} />}
        {activeTab === 'profile' && <AdminProfile />}
        {activeTab === 'courses' && <AdminCourses />}
        {activeTab === 'education' && <AdminEducation />}
        {activeTab === 'skills' && <AdminSkills />}
        {activeTab === 'certificates' && <AdminCertificates />}
        {activeTab === 'projects' && <AdminProjects />}
        {activeTab === 'resources' && <AdminResources />}
        {activeTab === 'learning' && <AdminLearning />}
        {activeTab === 'interests' && <AdminInterests />}
        {activeTab === 'grades' && <AdminGradeSettings />}
      </div>
    </div>
  );
};
