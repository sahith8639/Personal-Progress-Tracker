import React, { useState, useEffect } from 'react';
import { Code2, Filter, Layers } from 'lucide-react';
import { api } from '../services/api';
import { Skeleton } from '../components/Skeleton';
import { EmptyState } from '../components/EmptyState';
import { Badge } from '../components/Badge';
import { ProgressBar } from '../components/ProgressBar';

const CATEGORIES = [
  'All Categories',
  'Programming Languages',
  'AI/ML',
  'Data Science',
  'Web Development',
  'Databases',
  'Tools',
  'Cloud',
  'Version Control',
];

export const Skills = () => {
  const [skills, setSkills] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All Categories');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const res = await api.skills.list();
        if (res.success) setSkills(res.data);
      } catch (err) {
        console.error('Failed to load skills:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSkills();
  }, []);

  if (loading) {
    return (
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <Skeleton height={50} style={{ marginBottom: '1.5rem' }} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
          <Skeleton height={140} />
          <Skeleton height={140} />
          <Skeleton height={140} />
          <Skeleton height={140} />
        </div>
      </div>
    );
  }

  const filteredSkills =
    activeCategory === 'All Categories'
      ? skills
      : skills.filter((s) => s.category === activeCategory);

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>Skills & Competencies</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Categorized technical skills, proficiencies, tools, and experience levels
        </p>
      </div>

      {/* Category Filter Pills */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            className={`btn btn-sm ${activeCategory === cat ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {filteredSkills.length === 0 ? (
        <EmptyState
          icon={Code2}
          title="No Skills Found"
          description={`No skills found under ${activeCategory}.`}
        />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))', gap: '1.25rem' }}>
          {filteredSkills.map((skill) => (
            <div key={skill._id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 600 }}>{skill.name}</h3>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{skill.category}</div>
                </div>
                <Badge>{skill.status}</Badge>
              </div>

              <div>
                <ProgressBar
                  value={skill.proficiency}
                  max={100}
                  label={`${skill.experience || 'Proficiency'} (${skill.proficiency}%)`}
                  height={7}
                />
              </div>

              {skill.technologies && skill.technologies.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginTop: 'auto', paddingTop: '0.5rem' }}>
                  {skill.technologies.map((t, idx) => (
                    <span key={idx} className="badge badge-neutral" style={{ fontSize: '0.7rem' }}>
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
