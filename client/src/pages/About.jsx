import React, { useState, useEffect } from 'react';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  Target,
  Download,
  Code,
  Globe,
  ExternalLink,
} from 'lucide-react';
import { Github, Linkedin, Twitter } from '../components/SocialIcons';
import { api } from '../services/api';
import { Skeleton } from '../components/Skeleton';

export const About = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.profile.get();
        if (res.success) setProfile(res.data);
      } catch (err) {
        console.error('Failed to load profile:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div style={{ maxWidth: '850px', margin: '0 auto' }}>
        <Skeleton height={200} />
        <Skeleton height={150} />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Page Title */}
      <div>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>About Me</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Personal background, career goals, and professional contact links
        </p>
      </div>

      {/* Main Profile Card */}
      <div className="card" style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <div
            style={{
              width: '80px',
              height: '80px',
              borderRadius: 'var(--radius-lg)',
              background: 'var(--accent-primary-subtle)',
              color: 'var(--accent-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem',
              fontWeight: 700,
            }}
          >
            {profile?.fullName ? profile.fullName.charAt(0) : 'S'}
          </div>

          <div style={{ flex: 1, minWidth: '240px' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>{profile?.fullName}</h2>
            <div style={{ color: 'var(--accent-text)', fontWeight: 600, fontSize: '0.95rem', marginBottom: '0.25rem' }}>
              {profile?.title}
            </div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              {profile?.subTitle}
            </div>
          </div>

          {profile?.resumeUrl && (
            <a href={profile.resumeUrl} target="_blank" rel="noreferrer" className="btn btn-primary btn-sm">
              <Download size={14} /> Resume
            </a>
          )}
        </div>

        {/* Bio Section */}
        <div style={{ marginTop: '2rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1.5rem' }}>
          <h3 style={{ fontSize: '1.05rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <Briefcase size={17} color="var(--accent-primary)" /> Biography
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem', lineHeight: 1.7 }}>
            {profile?.bio}
          </p>
        </div>

        {/* Career Objective */}
        <div style={{ marginTop: '1.5rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1.5rem' }}>
          <h3 style={{ fontSize: '1.05rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <Target size={17} color="#059669" /> Career Objective
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem', lineHeight: 1.7 }}>
            {profile?.careerObjective}
          </p>
        </div>
      </div>

      {/* Details & Social Profiles Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {/* Contact Information */}
        <div className="card">
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1.25rem' }}>Contact Details</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.9rem' }}>
            {profile?.email && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-secondary)' }}>
                <Mail size={16} color="var(--accent-primary)" />
                <span>{profile.email}</span>
              </div>
            )}
            {profile?.phone && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-secondary)' }}>
                <Phone size={16} color="var(--accent-primary)" />
                <span>{profile.phone}</span>
              </div>
            )}
            {profile?.location && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-secondary)' }}>
                <MapPin size={16} color="var(--accent-primary)" />
                <span>{profile.location}</span>
              </div>
            )}
            {profile?.dateOfBirth && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-secondary)' }}>
                <Calendar size={16} color="var(--accent-primary)" />
                <span>{profile.dateOfBirth}</span>
              </div>
            )}
          </div>
        </div>

        {/* Professional Profiles */}
        <div className="card">
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1.25rem' }}>Professional Handles</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {profile?.github && (
              <a
                href={profile.github}
                target="_blank"
                rel="noreferrer"
                className="btn btn-secondary btn-sm"
                style={{ justifyContent: 'flex-start' }}
              >
                <Github size={15} /> GitHub Profile
                <ExternalLink size={12} style={{ marginLeft: 'auto' }} />
              </a>
            )}
            {profile?.linkedin && (
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noreferrer"
                className="btn btn-secondary btn-sm"
                style={{ justifyContent: 'flex-start' }}
              >
                <Linkedin size={15} /> LinkedIn Profile
                <ExternalLink size={12} style={{ marginLeft: 'auto' }} />
              </a>
            )}
            {profile?.leetcode && (
              <a
                href={profile.leetcode}
                target="_blank"
                rel="noreferrer"
                className="btn btn-secondary btn-sm"
                style={{ justifyContent: 'flex-start' }}
              >
                <Code size={15} /> LeetCode Profile
                <ExternalLink size={12} style={{ marginLeft: 'auto' }} />
              </a>
            )}
            {profile?.portfolioUrl && (
              <a
                href={profile.portfolioUrl}
                target="_blank"
                rel="noreferrer"
                className="btn btn-secondary btn-sm"
                style={{ justifyContent: 'flex-start' }}
              >
                <Globe size={15} /> Portfolio Website
                <ExternalLink size={12} style={{ marginLeft: 'auto' }} />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
