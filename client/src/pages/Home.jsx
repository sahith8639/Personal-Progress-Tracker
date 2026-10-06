import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Download,
  Mail,
  BookOpen,
  Award,
  Code2,
  TrendingUp,
  GraduationCap,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { Github, Linkedin } from '../components/SocialIcons';
import { api } from '../services/api';
import { Skeleton } from '../components/Skeleton';
import { Badge } from '../components/Badge';

export const Home = () => {
  const [profile, setProfile] = useState(null);
  const [overview, setOverview] = useState(null);
  const [topSkills, setTopSkills] = useState([]);
  const [featuredProjects, setFeaturedProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profRes, overRes, skillsRes, projRes] = await Promise.all([
          api.profile.get(),
          api.dashboard.getOverview(),
          api.skills.list(),
          api.projects.list(),
        ]);

        if (profRes.success) setProfile(profRes.data);
        if (overRes.success) setOverview(overRes.data);
        if (skillsRes.success) setTopSkills(skillsRes.data.slice(0, 6));
        if (projRes.success) setFeaturedProjects(projRes.data.slice(0, 3));
      } catch (err) {
        console.error('Error fetching home data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '1rem 0' }}>
        <Skeleton height={240} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', margin: '1.5rem 0' }}>
          <Skeleton height={100} />
          <Skeleton height={100} />
          <Skeleton height={100} />
          <Skeleton height={100} />
        </div>
      </div>
    );
  }

  const name = profile?.fullName || 'Sahithsai Pasupula';
  const title = profile?.title || 'Artificial Intelligence & Machine Learning Student';
  const subTitle = profile?.subTitle || 'Aspiring AI/ML Engineer | Software Developer | Problem Solver';
  const bio = profile?.bio || 'Undergraduate student passionate about Artificial Intelligence and Systems Engineering.';

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
      {/* Hero Section */}
      <section
        className="card"
        style={{
          padding: '2.5rem',
          background: 'linear-gradient(135deg, var(--bg-surface) 0%, var(--bg-secondary) 100%)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', maxWidth: '780px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span className="badge badge-info" style={{ fontSize: '0.8rem', padding: '0.25rem 0.75rem' }}>
              <Sparkles size={13} /> Academic Portfolio & System
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Class of 2028</span>
          </div>

          <div>
            <h1 style={{ fontSize: '2.35rem', letterSpacing: '-0.02em', marginBottom: '0.4rem' }}>
              Hi, I'm <span style={{ color: 'var(--accent-primary)' }}>{name}</span>
            </h1>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
              {title}
            </h2>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', fontWeight: 500 }}>
              {subTitle}
            </p>
          </div>

          <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.65 }}>
            {bio}
          </p>

          {/* Action Buttons & Links */}
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.875rem', marginTop: '0.5rem' }}>
            <Link to="/about" className="btn btn-primary">
              <span>View Full Profile</span>
              <ArrowRight size={16} />
            </Link>

            <Link to="/courses" className="btn btn-secondary">
              <BookOpen size={16} />
              <span>Explore Courses</span>
            </Link>

            {profile?.resumeUrl ? (
              <a href={profile.resumeUrl} target="_blank" rel="noreferrer" className="btn btn-outline">
                <Download size={16} />
                <span>Resume</span>
              </a>
            ) : null}

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginLeft: 'auto' }}>
              {profile?.github && (
                <a href={profile.github} target="_blank" rel="noreferrer" className="btn-outline btn-sm" title="GitHub">
                  <Github size={16} />
                </a>
              )}
              {profile?.linkedin && (
                <a href={profile.linkedin} target="_blank" rel="noreferrer" className="btn-outline btn-sm" title="LinkedIn">
                  <Linkedin size={16} />
                </a>
              )}
              {profile?.email && (
                <a href={`mailto:${profile.email}`} className="btn-outline btn-sm" title="Email">
                  <Mail size={16} />
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Academic & Learning Metric Cards */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>CURRENT CGPA</span>
            <GraduationCap size={18} color="var(--accent-primary)" />
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 700 }} className="font-mono">
            {overview?.academics?.cgpa ? overview.academics.cgpa.toFixed(2) : '8.70'}
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--status-success-text)' }}>
            Completed {overview?.academics?.completedCredits || 15} Credits
          </span>
        </div>

        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>COURSES</span>
            <BookOpen size={18} color="#059669" />
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 700 }} className="font-mono">
            {overview?.academics?.completedCourses || 4} / {overview?.academics?.totalCourses || 6}
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Completed Academic Courses</span>
        </div>

        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>ACTIVE LEARNING</span>
            <TrendingUp size={18} color="#d97706" />
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 700 }} className="font-mono">
            {overview?.learning?.activeLearning || 3}
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Avg. Progress {overview?.learning?.avgProgress || 64}%
          </span>
        </div>

        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>CERTIFICATES</span>
            <Award size={18} color="#7c3aed" />
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 700 }} className="font-mono">
            {overview?.certificates?.total || 3}
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Verified Credentials</span>
        </div>
      </section>

      {/* Featured Skills & Focus */}
      <section>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem' }}>Core Technical Competencies</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Key skills and proficiency index</p>
          </div>
          <Link to="/skills" className="btn btn-outline btn-sm">
            <span>View All Skills</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem' }}>
          {topSkills.map((s) => (
            <div key={s._id} className="card" style={{ padding: '1rem 1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{s.name}</span>
                <span className="badge badge-neutral" style={{ fontSize: '0.7rem' }}>{s.category}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div className="progress-container" style={{ flex: 1, height: '7px' }}>
                  <div className="progress-bar-fill" style={{ width: `${s.proficiency}%` }} />
                </div>
                <span className="font-mono" style={{ fontSize: '0.75rem', fontWeight: 600 }}>
                  {s.proficiency}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Projects */}
      <section>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem' }}>Featured Engineering Projects</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Recent AI, systems, and software developments</p>
          </div>
          <Link to="/projects" className="btn btn-outline btn-sm">
            <span>View All Projects</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
          {featuredProjects.map((p) => (
            <div key={p._id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 600 }}>{p.name}</h4>
                <Badge>{p.status}</Badge>
              </div>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1.25rem', flex: 1 }}>
                {p.shortDescription}
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '1.25rem' }}>
                {p.technologies?.map((tech, i) => (
                  <span key={i} className="badge badge-neutral" style={{ fontSize: '0.7rem' }}>
                    {tech}
                  </span>
                ))}
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem' }}>
                {p.githubUrl && (
                  <a href={p.githubUrl} target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm" style={{ flex: 1 }}>
                    <Github size={14} /> GitHub
                  </a>
                )}
                {p.liveDemoUrl && (
                  <a href={p.liveDemoUrl} target="_blank" rel="noreferrer" className="btn btn-primary btn-sm" style={{ flex: 1 }}>
                    <ExternalLink size={14} /> Live Demo
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
