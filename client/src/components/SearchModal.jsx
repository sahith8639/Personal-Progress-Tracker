import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, BookOpen, Award, Code, FolderGit2, FileText, CheckCircle2 } from 'lucide-react';
import { Modal } from './Modal';
import { api } from '../services/api';

export const SearchModal = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!query.trim()) {
      setResults(null);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await api.dashboard.search(query);
        if (res.success) {
          setResults(res.results);
        }
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = (path) => {
    navigate(path);
    onClose();
  };

  const totalResults =
    results &&
    (results.courses.length +
      results.skills.length +
      results.projects.length +
      results.certificates.length +
      results.resources.length +
      results.learning.length);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Global Academic Search" maxWidth="640px">
      <div style={{ position: 'relative', marginBottom: '1.25rem' }}>
        <Search
          size={18}
          style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
        />
        <input
          type="text"
          className="form-input"
          placeholder="Search courses, skills, certificates, projects, resources..."
          style={{ paddingLeft: '2.5rem' }}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
        />
      </div>

      {loading && <div style={{ textAlign: 'center', padding: '1rem', color: 'var(--text-muted)' }}>Searching...</div>}

      {!loading && results && totalResults === 0 && (
        <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-muted)' }}>
          No results found matching "{query}"
        </div>
      )}

      {!loading && results && totalResults > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '420px', overflowY: 'auto' }}>
          {results.courses.length > 0 && (
            <div>
              <div className="nav-section-title" style={{ paddingLeft: 0 }}>Courses</div>
              {results.courses.map((c) => (
                <div
                  key={c._id}
                  onClick={() => handleSelect(`/courses/${c._id}`)}
                  style={{
                    padding: '0.6rem 0.8rem',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--bg-secondary)',
                    marginBottom: '0.35rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <BookOpen size={16} color="var(--accent-primary)" />
                    <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{c.code}: {c.name}</span>
                  </div>
                  <span className="badge badge-neutral" style={{ fontSize: '0.7rem' }}>{c.status}</span>
                </div>
              ))}
            </div>
          )}

          {results.skills.length > 0 && (
            <div>
              <div className="nav-section-title" style={{ paddingLeft: 0 }}>Skills</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {results.skills.map((s) => (
                  <span
                    key={s._id}
                    onClick={() => handleSelect('/skills')}
                    className="badge badge-info"
                    style={{ cursor: 'pointer', padding: '0.3rem 0.6rem' }}
                  >
                    <Code size={13} /> {s.name} ({s.proficiency}%)
                  </span>
                ))}
              </div>
            </div>
          )}

          {results.projects.length > 0 && (
            <div>
              <div className="nav-section-title" style={{ paddingLeft: 0 }}>Projects</div>
              {results.projects.map((p) => (
                <div
                  key={p._id}
                  onClick={() => handleSelect('/projects')}
                  style={{
                    padding: '0.6rem 0.8rem',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--bg-secondary)',
                    marginBottom: '0.35rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}
                >
                  <FolderGit2 size={16} color="var(--accent-primary)" />
                  <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{p.name}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>({p.category})</span>
                </div>
              ))}
            </div>
          )}

          {results.certificates.length > 0 && (
            <div>
              <div className="nav-section-title" style={{ paddingLeft: 0 }}>Certificates</div>
              {results.certificates.map((cert) => (
                <div
                  key={cert._id}
                  onClick={() => handleSelect('/certificates')}
                  style={{
                    padding: '0.6rem 0.8rem',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--bg-secondary)',
                    marginBottom: '0.35rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}
                >
                  <Award size={16} color="#d97706" />
                  <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{cert.name}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>— {cert.issuingOrganization}</span>
                </div>
              ))}
            </div>
          )}

          {results.resources.length > 0 && (
            <div>
              <div className="nav-section-title" style={{ paddingLeft: 0 }}>Resources</div>
              {results.resources.map((res) => (
                <div
                  key={res._id}
                  onClick={() => handleSelect('/resources')}
                  style={{
                    padding: '0.6rem 0.8rem',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--bg-secondary)',
                    marginBottom: '0.35rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}
                >
                  <FileText size={16} color="var(--text-muted)" />
                  <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{res.title}</span>
                  <span className="badge badge-neutral" style={{ fontSize: '0.65rem' }}>{res.type}</span>
                </div>
              ))}
            </div>
          )}

          {results.learning.length > 0 && (
            <div>
              <div className="nav-section-title" style={{ paddingLeft: 0 }}>Learning Items</div>
              {results.learning.map((item) => (
                <div
                  key={item._id}
                  onClick={() => handleSelect('/learning')}
                  style={{
                    padding: '0.6rem 0.8rem',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--bg-secondary)',
                    marginBottom: '0.35rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <CheckCircle2 size={16} color="#10b981" />
                    <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{item.title}</span>
                  </div>
                  <span className="font-mono" style={{ fontSize: '0.8rem' }}>{item.currentProgress}%</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </Modal>
  );
};
