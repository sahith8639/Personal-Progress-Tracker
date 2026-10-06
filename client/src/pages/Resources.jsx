import React, { useState, useEffect } from 'react';
import {
  Library,
  FileText,
  Search,
  Download,
  ExternalLink,
  BookOpen,
  Filter,
} from 'lucide-react';
import { api } from '../services/api';
import { Skeleton } from '../components/Skeleton';
import { EmptyState } from '../components/EmptyState';
import { Badge } from '../components/Badge';

const RESOURCE_TYPES = [
  'All Types',
  'PDF',
  'Notes',
  'Document',
  'GitHub Repository',
  'Website',
  'Video',
  'Presentation',
  'Image',
];

export const Resources = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All Types');
  const [subjectFilter, setSubjectFilter] = useState('All');

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const res = await api.resources.list();
        if (res.success) setResources(res.data);
      } catch (err) {
        console.error('Failed to load resources:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchResources();
  }, []);

  if (loading) {
    return (
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <Skeleton height={60} style={{ marginBottom: '1.5rem' }} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem' }}>
          <Skeleton height={140} />
          <Skeleton height={140} />
          <Skeleton height={140} />
        </div>
      </div>
    );
  }

  const distinctSubjects = ['All', ...new Set(resources.map((r) => r.subject).filter(Boolean))];

  const filteredResources = resources.filter((r) => {
    const matchesSearch =
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      (r.topic && r.topic.toLowerCase().includes(search.toLowerCase())) ||
      (r.description && r.description.toLowerCase().includes(search.toLowerCase()));

    const matchesType = typeFilter === 'All Types' || r.type === typeFilter;
    const matchesSubject = subjectFilter === 'All' || r.subject === subjectFilter;

    return matchesSearch && matchesType && matchesSubject;
  });

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>Academic Resource Library</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Curated collection of lecture notes, unit PDFs, reference guides, slides, and repositories
        </p>
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
              placeholder="Search resources by title, topic, or description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ paddingLeft: '2.4rem' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <select
              className="form-select"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              style={{ minWidth: '150px' }}
            >
              {RESOURCE_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>

            <select
              className="form-select"
              value={subjectFilter}
              onChange={(e) => setSubjectFilter(e.target.value)}
              style={{ minWidth: '160px' }}
            >
              {distinctSubjects.map((s) => (
                <option key={s} value={s}>
                  {s === 'All' ? 'All Subjects' : s}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Resources Grid */}
      {filteredResources.length === 0 ? (
        <EmptyState
          icon={Library}
          title="No Resources Found"
          description="No academic resources found matching your current filter criteria."
        />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(330px, 1fr))', gap: '1.25rem' }}>
          {filteredResources.map((res) => (
            <div key={res._id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                <span className="badge badge-neutral" style={{ fontSize: '0.7rem' }}>
                  {res.type}
                </span>
                {res.semester && (
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{res.semester}</span>
                )}
              </div>

              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.4rem', color: 'var(--text-primary)' }}>
                {res.title}
              </h3>

              <div style={{ fontSize: '0.85rem', color: 'var(--accent-text)', fontWeight: 500, marginBottom: '0.5rem' }}>
                {res.subject || 'General Study Material'}
                {res.topic && ` • ${res.topic}`}
              </div>

              {res.description && (
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1.25rem', flex: 1, lineHeight: 1.55 }}>
                  {res.description}
                </p>
              )}

              {/* Course link tag */}
              {res.courseId && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                  <BookOpen size={13} />
                  <span>Linked Course: {res.courseId.code} ({res.courseId.name})</span>
                </div>
              )}

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem' }}>
                {res.fileUrl && (
                  <a
                    href={res.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-secondary btn-sm"
                    style={{ flex: 1 }}
                  >
                    <Download size={14} /> Download File
                  </a>
                )}
                {res.externalUrl && (
                  <a
                    href={res.externalUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-primary btn-sm"
                    style={{ flex: 1 }}
                  >
                    <ExternalLink size={14} /> Open Resource
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
