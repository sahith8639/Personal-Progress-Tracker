import React, { useState, useEffect } from 'react';
import { Printer, Download, ArrowLeft, GraduationCap, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { Skeleton } from '../components/Skeleton';

export const AcademicSummary = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await api.export.getAcademicSummary();
        if (res.success) setData(res.data);
      } catch (err) {
        console.error('Failed to load academic summary:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, []);

  if (loading) {
    return (
      <div style={{ maxWidth: '850px', margin: '0 auto' }}>
        <Skeleton height={200} />
        <Skeleton height={400} />
      </div>
    );
  }

  const { profile, metrics, education, courses, certificates, skills, projects } = data || {};

  return (
    <div style={{ maxWidth: '850px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Action Header (Hidden in Print) */}
      <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to="/courses" className="btn btn-outline btn-sm">
          <ArrowLeft size={14} /> Back
        </Link>
        <button className="btn btn-primary btn-sm" onClick={() => window.print()}>
          <Printer size={15} /> Print / Save as PDF
        </button>
      </div>

      {/* Printable Report Document */}
      <div
        className="card"
        style={{
          padding: '2.5rem',
          background: '#fff',
          color: '#111827',
          borderColor: '#e5e7eb',
          boxShadow: 'none',
        }}
      >
        {/* Header */}
        <div style={{ borderBottom: '2px solid #1e293b', paddingBottom: '1.25rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 style={{ fontSize: '2rem', color: '#0f172a', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '0.2rem' }}>
              {profile?.fullName || 'Sahithsai Pasupula'}
            </h1>
            <div style={{ fontSize: '1rem', fontWeight: 600, color: '#2563eb' }}>
              {profile?.title}
            </div>
            <div style={{ fontSize: '0.85rem', color: '#475569', marginTop: '0.35rem' }}>
              {profile?.email} • {profile?.location} • {profile?.github}
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
              Cumulative CGPA
            </span>
            <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#2563eb', fontFamily: 'monospace' }}>
              {metrics?.cgpa ? metrics.cgpa.toFixed(2) : '8.70'}
            </div>
            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
              {metrics?.completedCredits} / {metrics?.totalCredits} Credits Completed
            </span>
          </div>
        </div>

        {/* Education Section */}
        <div style={{ marginBottom: '1.75rem' }}>
          <h2 style={{ fontSize: '1.15rem', color: '#0f172a', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.35rem', marginBottom: '0.75rem' }}>
            1. Formal Education
          </h2>
          {education?.map((edu) => (
            <div key={edu._id} style={{ marginBottom: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600, fontSize: '0.95rem' }}>
                <span>{edu.degree} — {edu.institution}</span>
                <span style={{ fontFamily: 'monospace' }}>{edu.startDate} – {edu.endDate}</span>
              </div>
              <div style={{ fontSize: '0.85rem', color: '#475569' }}>
                {edu.department} • CGPA: {edu.cgpa || 'N/A'}
              </div>
            </div>
          ))}
        </div>

        {/* Coursework & Grades Table */}
        <div style={{ marginBottom: '1.75rem' }}>
          <h2 style={{ fontSize: '1.15rem', color: '#0f172a', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.35rem', marginBottom: '0.75rem' }}>
            2. Academic Courses & Performance Record
          </h2>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.825rem' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #cbd5e1', textAlign: 'left' }}>
                <th style={{ padding: '0.5rem' }}>Code</th>
                <th style={{ padding: '0.5rem' }}>Course Name</th>
                <th style={{ padding: '0.5rem' }}>Semester</th>
                <th style={{ padding: '0.5rem' }}>Credits</th>
                <th style={{ padding: '0.5rem' }}>Grade</th>
                <th style={{ padding: '0.5rem' }}>Grade Point</th>
                <th style={{ padding: '0.5rem' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {courses?.map((c) => (
                <tr key={c._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '0.45rem', fontFamily: 'monospace', fontWeight: 600 }}>{c.code}</td>
                  <td style={{ padding: '0.45rem', fontWeight: 500 }}>{c.name}</td>
                  <td style={{ padding: '0.45rem' }}>{c.semester}</td>
                  <td style={{ padding: '0.45rem', fontFamily: 'monospace' }}>{c.credits}</td>
                  <td style={{ padding: '0.45rem', fontFamily: 'monospace', fontWeight: 700, color: '#059669' }}>{c.grade || '—'}</td>
                  <td style={{ padding: '0.45rem', fontFamily: 'monospace' }}>{c.gradePoint !== null ? c.gradePoint : '—'}</td>
                  <td style={{ padding: '0.45rem' }}>{c.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Certificates */}
        <div style={{ marginBottom: '1.75rem' }}>
          <h2 style={{ fontSize: '1.15rem', color: '#0f172a', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.35rem', marginBottom: '0.75rem' }}>
            3. Professional Certifications
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem', fontSize: '0.85rem' }}>
            {certificates?.map((cert) => (
              <div key={cert._id} style={{ padding: '0.4rem', border: '1px solid #f1f5f9', borderRadius: '4px' }}>
                <strong>{cert.name}</strong> — {cert.issuingOrganization} ({cert.issueDate})
                {cert.credentialId && <div style={{ fontSize: '0.75rem', color: '#64748b' }}>ID: {cert.credentialId}</div>}
              </div>
            ))}
          </div>
        </div>

        {/* Skills Summary */}
        <div style={{ marginBottom: '1.75rem' }}>
          <h2 style={{ fontSize: '1.15rem', color: '#0f172a', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.35rem', marginBottom: '0.75rem' }}>
            4. Core Technical Competencies
          </h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', fontSize: '0.8rem' }}>
            {skills?.map((s) => (
              <span key={s._id} style={{ background: '#f1f5f9', padding: '0.2rem 0.5rem', borderRadius: '4px', border: '1px solid #e2e8f0' }}>
                {s.name} ({s.proficiency}%)
              </span>
            ))}
          </div>
        </div>

        {/* Projects */}
        <div>
          <h2 style={{ fontSize: '1.15rem', color: '#0f172a', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.35rem', marginBottom: '0.75rem' }}>
            5. Key Projects
          </h2>
          {projects?.map((p) => (
            <div key={p._id} style={{ marginBottom: '0.6rem', fontSize: '0.85rem' }}>
              <strong>{p.name}</strong> ({p.category}) — {p.shortDescription}
              <div style={{ fontSize: '0.75rem', color: '#475569' }}>
                Technologies: {p.technologies?.join(', ')}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
