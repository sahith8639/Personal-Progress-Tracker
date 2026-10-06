import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  GraduationCap,
  BookOpen,
  TrendingUp,
  Award,
  FolderGit2,
  Clock,
  Sparkles,
  ArrowRight,
  Flame,
} from 'lucide-react';
import { api } from '../services/api';
import { Skeleton } from '../components/Skeleton';
import { ProgressBar } from '../components/ProgressBar';

export const Dashboard = () => {
  const [overview, setOverview] = useState(null);
  const [profile, setProfile] = useState(null);
  const [courseStats, setCourseStats] = useState(null);
  const [learningStats, setLearningStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [overRes, profRes, cStatsRes, lStatsRes] = await Promise.all([
          api.dashboard.getOverview(),
          api.profile.get(),
          api.courses.getStats(),
          api.learning.getStats(),
        ]);
        if (overRes.success) setOverview(overRes.data);
        if (profRes.success) setProfile(profRes.data);
        if (cStatsRes.success) setCourseStats(cStatsRes.data);
        if (lStatsRes.success) setLearningStats(lStatsRes.data);
      } catch (err) {
        console.error('Failed to load dashboard:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <Skeleton height={140} style={{ marginBottom: '1.5rem' }} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
          <Skeleton height={120} />
          <Skeleton height={120} />
          <Skeleton height={120} />
        </div>
        <Skeleton height={250} />
      </div>
    );
  }

  const name = profile?.fullName ? profile.fullName.split(' ')[0] : 'Scholar';

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
      {/* Welcome Banner */}
      <div
        className="card"
        style={{
          padding: '2rem',
          background: 'linear-gradient(135deg, var(--bg-surface) 0%, var(--bg-secondary) 100%)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.25rem',
        }}
      >
        <div>
          <span style={{ fontSize: '0.85rem', color: 'var(--accent-text)', fontWeight: 600 }}>
            DIGITAL ACADEMIC & PROFESSIONAL SYSTEM
          </span>
          <h1 style={{ fontSize: '2.2rem', marginTop: '0.25rem' }}>Welcome, {name}</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Central tracking control for courses, credentials, projects, and study milestones
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link to="/courses" className="btn btn-primary btn-sm">
            <BookOpen size={15} /> All Courses
          </Link>
          <Link to="/learning" className="btn btn-secondary btn-sm">
            <TrendingUp size={15} /> Learning Hub
          </Link>
        </div>
      </div>

      {/* Main Pillars Summary Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
        {/* Academics */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.05rem', color: 'var(--text-muted)' }}>Overall Academic Performance</h3>
            <GraduationCap size={20} color="var(--accent-primary)" />
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <span className="font-mono" style={{ fontSize: '2.2rem', fontWeight: 700, color: 'var(--accent-primary)' }}>
              {courseStats?.cgpa ? courseStats.cgpa.toFixed(2) : '0.00'}
            </span>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>CGPA</span>
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            <div>Credits Completed: <strong className="font-mono">{courseStats?.completedCredits || 0}</strong> / {courseStats?.totalCredits || 0}</div>
            <div>Courses Completed: <strong className="font-mono">{courseStats?.statusCounts['Completed'] || 0}</strong></div>
          </div>
        </div>

        {/* Learning */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.05rem', color: 'var(--text-muted)' }}>Active Learning Status</h3>
            <TrendingUp size={20} color="#059669" />
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <span className="font-mono" style={{ fontSize: '2.2rem', fontWeight: 700, color: '#059669' }}>
              {learningStats?.avgProgress || 0}%
            </span>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Avg. Progress</span>
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            <div>Active Tracks: <strong className="font-mono">{learningStats?.activeCount || 0}</strong></div>
            <div>Study Streak: <strong className="font-mono" style={{ color: '#ea580c' }}>{learningStats?.streak || 0} Days 🔥</strong></div>
          </div>
        </div>

        {/* Credentials & Projects */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.05rem', color: 'var(--text-muted)' }}>Credentials & Showcase</h3>
            <Award size={20} color="#7c3aed" />
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <span className="font-mono" style={{ fontSize: '2.2rem', fontWeight: 700, color: '#7c3aed' }}>
              {overview?.certificates?.total || 0}
            </span>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Certificates</span>
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            <div>Completed Projects: <strong className="font-mono">{overview?.projects?.completed || 0}</strong></div>
            <div>In-Progress Projects: <strong className="font-mono">{overview?.projects?.inProgress || 0}</strong></div>
          </div>
        </div>
      </div>

      {/* Semester GPA Performance Breakdown */}
      {courseStats?.semesterAnalytics && courseStats.semesterAnalytics.length > 0 && (
        <div className="card">
          <div className="card-header">
            <div>
              <h3 style={{ fontSize: '1.2rem' }}>Academic Trend: GPA by Semester</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Semester credit load and grade points earned</p>
            </div>
            <Link to="/gpa-calculator" className="btn btn-outline btn-sm">
              <span>View Calculator</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            {courseStats.semesterAnalytics.map((sem, idx) => (
              <div
                key={idx}
                style={{
                  padding: '1rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
                  {sem.semester}
                </div>
                <div className="font-mono" style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--accent-primary)', marginBottom: '0.25rem' }}>
                  {sem.gpa}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Credits: {sem.completedCredits} / {sem.totalCredits}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent System Activity Feed */}
      <div className="card">
        <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Clock size={18} color="var(--accent-primary)" /> Recent Activity & Updates
        </h3>

        {overview?.recentActivities && overview.recentActivities.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {overview.recentActivities.map((act) => (
              <div
                key={act._id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-secondary)',
                  gap: '1rem',
                  flexWrap: 'wrap',
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>
                    {act.action}: <span style={{ color: 'var(--text-primary)' }}>{act.entityTitle}</span>
                  </div>
                  {act.details && (
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{act.details}</div>
                  )}
                </div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {new Date(act.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No recent activities logged.</p>
        )}
      </div>
    </div>
  );
};
