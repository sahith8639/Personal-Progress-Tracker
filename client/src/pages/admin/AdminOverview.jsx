import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  GraduationCap,
  Code2,
  Award,
  FolderGit2,
  Library,
  TrendingUp,
  User,
  Plus,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { api } from '../../services/api';
import { Skeleton } from '../../components/Skeleton';

export const AdminOverview = ({ onSelectTab }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        const res = await api.dashboard.getOverview();
        if (res.success) setStats(res.data);
      } catch (err) {
        console.error('Failed to load admin stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOverview();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
        <Skeleton height={140} />
        <Skeleton height={140} />
        <Skeleton height={140} />
      </div>
    );
  }

  const managementCards = [
    {
      title: 'Profile & Contact Details',
      desc: 'Edit name, professional titles, bio, resume URL, and public visibility controls.',
      tab: 'profile',
      icon: User,
      count: '1 Active Profile',
    },
    {
      title: 'Academic Courses',
      desc: 'Add, update grades, configure course codes, credits, and syllabus topics.',
      tab: 'courses',
      icon: BookOpen,
      count: `${stats?.academics?.totalCourses || 0} Courses registered`,
    },
    {
      title: 'Education History',
      desc: 'Manage collegiate and pre-university credentials, scores, and coursework.',
      tab: 'education',
      icon: GraduationCap,
      count: 'History records',
    },
    {
      title: 'Skills & Proficiencies',
      desc: 'Manage categories, update proficiency percentages, and experience tags.',
      tab: 'skills',
      icon: Code2,
      count: `${stats?.learning?.totalSkills || 0} Skills indexed`,
    },
    {
      title: 'Certificates & Credentials',
      desc: 'Upload credential documents, specify issuer organizations and verification URLs.',
      tab: 'certificates',
      icon: Award,
      count: `${stats?.certificates?.total || 0} Certificates`,
    },
    {
      title: 'Project Showcase',
      desc: 'Showcase repositories, deployment links, tech stacks, and project descriptions.',
      tab: 'projects',
      icon: FolderGit2,
      count: `${stats?.projects?.total || 0} Projects`,
    },
    {
      title: 'Resource Library',
      desc: 'Upload PDFs, notes, lecture cheat sheets, and external reference repositories.',
      tab: 'resources',
      icon: Library,
      count: 'Documents & Notes',
    },
    {
      title: 'Learning Tracker & Study Logs',
      desc: 'Record active skill learning goals, roadmap milestones, and daily study hours.',
      tab: 'learning',
      icon: TrendingUp,
      count: `${stats?.learning?.activeLearning || 0} Active Tracks`,
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h2 style={{ fontSize: '1.4rem', marginBottom: '0.25rem' }}>Direct Management Quick-Links</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Instantly jump to any section to insert, update, or remove entries in your MongoDB database
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
        {managementCards.map((c, i) => {
          const Icon = c.icon;
          return (
            <div
              key={i}
              className="card"
              style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column' }}
              onClick={() => onSelectTab(c.tab)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <div
                  style={{
                    padding: '0.5rem',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--accent-primary-subtle)',
                    color: 'var(--accent-primary)',
                  }}
                >
                  <Icon size={18} />
                </div>
                <span className="badge badge-neutral" style={{ fontSize: '0.7rem' }}>{c.count}</span>
              </div>

              <h3 style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: '0.35rem' }}>{c.title}</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem', flex: 1, lineHeight: 1.5 }}>
                {c.desc}
              </p>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-text)', fontWeight: 600, fontSize: '0.85rem', marginTop: 'auto' }}>
                <span>Manage entries</span>
                <ArrowRight size={14} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
