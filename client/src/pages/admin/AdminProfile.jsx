import React, { useState, useEffect } from 'react';
import { Save, Upload, Check, AlertCircle } from 'lucide-react';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { Skeleton } from '../../components/Skeleton';

export const AdminProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);
  const { addToast } = useToast();

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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.profile.update(profile);
      if (res.success) {
        setProfile(res.data);
        addToast('Profile updated successfully!', 'success');
      }
    } catch (err) {
      addToast(err.message || 'Failed to update profile', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingResume(true);
    try {
      const res = await api.upload(file);
      if (res.success) {
        setProfile((prev) => ({ ...prev, resumeUrl: res.data.fileUrl }));
        addToast('Resume uploaded! Click Save to apply.', 'success');
      }
    } catch (err) {
      addToast(err.message || 'Resume upload failed', 'error');
    } finally {
      setUploadingResume(false);
    }
  };

  if (loading) {
    return (
      <div className="card" style={{ padding: '2rem' }}>
        <Skeleton height={40} style={{ marginBottom: '1rem' }} />
        <Skeleton height={200} />
      </div>
    );
  }

  return (
    <div className="card" style={{ padding: '2rem' }}>
      <div style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1rem' }}>
        <h2 style={{ fontSize: '1.4rem' }}>Personal Profile & Visibility Controls</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Update hero details, biography, contact coordinates, and public visibility flags
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Core Identity */}
        <div>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: 'var(--accent-text)' }}>1. Core Identity & Titles</h3>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input
                type="text"
                name="fullName"
                className="form-input"
                value={profile?.fullName || ''}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Professional Title *</label>
              <input
                type="text"
                name="title"
                className="form-input"
                value={profile?.title || ''}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Secondary Subtitle / Elevator Tagline</label>
            <input
              type="text"
              name="subTitle"
              className="form-input"
              value={profile?.subTitle || ''}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Professional Biography</label>
            <textarea
              name="bio"
              className="form-textarea"
              rows={4}
              value={profile?.bio || ''}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Career Objective</label>
            <textarea
              name="careerObjective"
              className="form-textarea"
              rows={3}
              value={profile?.careerObjective || ''}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Contact Coordinates & Visibility */}
        <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: 'var(--accent-text)' }}>2. Contact Details & Privacy Toggles</h3>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                name="email"
                className="form-input"
                value={profile?.email || ''}
                onChange={handleChange}
              />
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.4rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                <input
                  type="checkbox"
                  name="isEmailPublic"
                  checked={profile?.isEmailPublic ?? true}
                  onChange={handleChange}
                />
                Make Email Visible to Public
              </label>
            </div>

            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input
                type="text"
                name="phone"
                className="form-input"
                value={profile?.phone || ''}
                onChange={handleChange}
              />
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.4rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                <input
                  type="checkbox"
                  name="isPhonePublic"
                  checked={profile?.isPhonePublic ?? false}
                  onChange={handleChange}
                />
                Make Phone Visible to Public
              </label>
            </div>

            <div className="form-group">
              <label className="form-label">Location (City, Country)</label>
              <input
                type="text"
                name="location"
                className="form-input"
                value={profile?.location || ''}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Date of Birth</label>
              <input
                type="date"
                name="dateOfBirth"
                className="form-input"
                value={profile?.dateOfBirth || ''}
                onChange={handleChange}
              />
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.4rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                <input
                  type="checkbox"
                  name="isDobPublic"
                  checked={profile?.isDobPublic ?? false}
                  onChange={handleChange}
                />
                Make DOB Visible to Public
              </label>
            </div>
          </div>
        </div>

        {/* Links & Resume File */}
        <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: 'var(--accent-text)' }}>3. Professional Links & Resume Document</h3>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">GitHub URL</label>
              <input
                type="url"
                name="github"
                className="form-input"
                value={profile?.github || ''}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">LinkedIn URL</label>
              <input
                type="url"
                name="linkedin"
                className="form-input"
                value={profile?.linkedin || ''}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">LeetCode URL</label>
              <input
                type="url"
                name="leetcode"
                className="form-input"
                value={profile?.leetcode || ''}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Portfolio URL</label>
              <input
                type="url"
                name="portfolioUrl"
                className="form-input"
                value={profile?.portfolioUrl || ''}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Resume PDF / Document</label>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <input
                type="text"
                name="resumeUrl"
                className="form-input"
                placeholder="Upload file or enter URL..."
                value={profile?.resumeUrl || ''}
                onChange={handleChange}
                style={{ flex: 1 }}
              />
              <label className="btn btn-secondary btn-sm" style={{ cursor: 'pointer', whiteSpace: 'nowrap' }}>
                <Upload size={14} /> {uploadingResume ? 'Uploading...' : 'Upload PDF'}
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleResumeUpload}
                  style={{ display: 'none' }}
                  disabled={uploadingResume}
                />
              </label>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1.25rem' }}>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            <Save size={16} />
            <span>{saving ? 'Saving changes...' : 'Save Profile Changes'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
