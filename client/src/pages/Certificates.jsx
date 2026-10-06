import React, { useState, useEffect } from 'react';
import {
  Award,
  Calendar,
  ExternalLink,
  Download,
  Search,
  Filter,
  CheckCircle,
  BookOpen,
} from 'lucide-react';
import { api } from '../services/api';
import { Skeleton } from '../components/Skeleton';
import { EmptyState } from '../components/EmptyState';

export const Certificates = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [orgFilter, setOrgFilter] = useState('All');

  useEffect(() => {
    const fetchCerts = async () => {
      try {
        const res = await api.certificates.list();
        if (res.success) setCertificates(res.data);
      } catch (err) {
        console.error('Failed to load certificates:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCerts();
  }, []);

  if (loading) {
    return (
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <Skeleton height={60} style={{ marginBottom: '1.5rem' }} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem' }}>
          <Skeleton height={180} />
          <Skeleton height={180} />
        </div>
      </div>
    );
  }

  const distinctCategories = ['All', ...new Set(certificates.map((c) => c.category).filter(Boolean))];
  const distinctOrgs = ['All', ...new Set(certificates.map((c) => c.issuingOrganization).filter(Boolean))];

  const filteredCerts = certificates.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.issuingOrganization.toLowerCase().includes(search.toLowerCase()) ||
      (c.credentialId && c.credentialId.toLowerCase().includes(search.toLowerCase())) ||
      (c.skills && c.skills.some((s) => s.toLowerCase().includes(search.toLowerCase())));

    const matchesCategory = categoryFilter === 'All' || c.category === categoryFilter;
    const matchesOrg = orgFilter === 'All' || c.issuingOrganization === orgFilter;

    return matchesSearch && matchesCategory && matchesOrg;
  });

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>Certificates & Accreditations</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Verified technical specializations, professional credentials, and verified licenses
          </p>
        </div>

        <a
          href={api.export.getCertificatesCsvUrl()}
          download="certificates-record.csv"
          className="btn btn-outline btn-sm"
        >
          <Download size={14} /> Export CSV
        </a>
      </div>

      {/* Filter and Search Bar */}
      <div className="card" style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
          <div style={{ flex: 1, minWidth: '240px', position: 'relative' }}>
            <Search
              size={16}
              style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
            />
            <input
              type="text"
              className="form-input"
              placeholder="Search certificates by title, organization, or skill..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ paddingLeft: '2.4rem' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <select
              className="form-select"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              style={{ minWidth: '150px' }}
            >
              {distinctCategories.map((c) => (
                <option key={c} value={c}>{c === 'All' ? 'All Categories' : c}</option>
              ))}
            </select>

            <select
              className="form-select"
              value={orgFilter}
              onChange={(e) => setOrgFilter(e.target.value)}
              style={{ minWidth: '150px' }}
            >
              {distinctOrgs.map((o) => (
                <option key={o} value={o}>{o === 'All' ? 'All Organizations' : o}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Certificates Grid */}
      {filteredCerts.length === 0 ? (
        <EmptyState
          icon={Award}
          title="No Certificates Found"
          description="No certificates matched your search criteria."
        />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(330px, 1fr))', gap: '1.25rem' }}>
          {filteredCerts.map((cert) => (
            <div key={cert._id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                <span className="badge badge-info" style={{ fontSize: '0.7rem' }}>
                  {cert.category}
                </span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Calendar size={13} /> {cert.issueDate}
                </span>
              </div>

              <h3 style={{ fontSize: '1.15rem', fontWeight: 600, marginBottom: '0.25rem' }}>{cert.name}</h3>
              <div style={{ fontSize: '0.9rem', color: 'var(--accent-text)', fontWeight: 600, marginBottom: '0.75rem' }}>
                {cert.issuingOrganization}
              </div>

              {cert.description && (
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1rem', flex: 1, lineHeight: 1.55 }}>
                  {cert.description}
                </p>
              )}

              {cert.credentialId && (
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                  Credential ID: <span className="font-mono">{cert.credentialId}</span>
                </div>
              )}

              {/* Skills Tags */}
              {cert.skills && cert.skills.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '1rem' }}>
                  {cert.skills.map((skill, idx) => (
                    <span key={idx} className="badge badge-neutral" style={{ fontSize: '0.7rem' }}>
                      {skill}
                    </span>
                  ))}
                </div>
              )}

              {/* Linked Course */}
              {cert.courseId && (
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '1rem' }}>
                  <BookOpen size={13} /> Linked: {cert.courseId.name} ({cert.courseId.code})
                </div>
              )}

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem' }}>
                {cert.fileUrl && (
                  <a
                    href={cert.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-secondary btn-sm"
                    style={{ flex: 1 }}
                  >
                    <Download size={14} /> Certificate File
                  </a>
                )}
                {cert.credentialUrl && (
                  <a
                    href={cert.credentialUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-primary btn-sm"
                    style={{ flex: 1 }}
                  >
                    <ExternalLink size={14} /> Verify Credential
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
