import React, { useState, useEffect } from 'react';
import { Heart, Tag, Sparkles } from 'lucide-react';
import { api } from '../services/api';
import { Skeleton } from '../components/Skeleton';
import { EmptyState } from '../components/EmptyState';
import { Badge } from '../components/Badge';

export const Interests = () => {
  const [interests, setInterests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInterests = async () => {
      try {
        const res = await api.interests.list();
        if (res.success) setInterests(res.data);
      } catch (err) {
        console.error('Failed to load interests:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchInterests();
  }, []);

  if (loading) {
    return (
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <Skeleton height={60} style={{ marginBottom: '1.5rem' }} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
          <Skeleton height={140} />
          <Skeleton height={140} />
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>Academic & Engineering Interests</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Intellectual focus areas, research domains, and technological passions
        </p>
      </div>

      {interests.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="No Interests Added"
          description="Interests have not been configured yet."
        />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))', gap: '1.25rem' }}>
          {interests.map((interest) => (
            <div key={interest._id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                <span className="badge badge-neutral" style={{ fontSize: '0.75rem' }}>{interest.category}</span>
                <Badge>{interest.interestLevel}</Badge>
              </div>

              <h3 style={{ fontSize: '1.15rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                {interest.name}
              </h3>

              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.25rem', flex: 1 }}>
                {interest.description}
              </p>

              {interest.relatedSkills && interest.relatedSkills.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginTop: 'auto', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem' }}>
                  {interest.relatedSkills.map((skill, idx) => (
                    <span key={idx} className="badge badge-info" style={{ fontSize: '0.7rem' }}>
                      {skill}
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
