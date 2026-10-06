import React, { useState, useEffect } from 'react';
import { GraduationCap, Calendar, MapPin, Award, BookOpen } from 'lucide-react';
import { api } from '../services/api';
import { Skeleton } from '../components/Skeleton';
import { EmptyState } from '../components/EmptyState';

export const Education = () => {
  const [educationList, setEducationList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEdu = async () => {
      try {
        const res = await api.education.list();
        if (res.success) setEducationList(res.data);
      } catch (err) {
        console.error('Failed to load education records:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchEdu();
  }, []);

  if (loading) {
    return (
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <Skeleton height={180} />
        <Skeleton height={180} />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>Education</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Formal academic degrees, coursework, and collegiate achievements
        </p>
      </div>

      {educationList.length === 0 ? (
        <EmptyState
          icon={GraduationCap}
          title="No Education Records Found"
          description="Education records have not been added yet."
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {educationList.map((edu) => (
            <div key={edu._id} className="card" style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <h2 style={{ fontSize: '1.35rem', color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
                    {edu.degree}
                  </h2>
                  <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--accent-text)' }}>
                    {edu.institution}
                  </div>
                  {edu.university && (
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      Affiliated to {edu.university}
                    </div>
                  )}
                  {edu.department && (
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      {edu.department}
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.4rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    <Calendar size={14} />
                    <span>{edu.startDate} – {edu.endDate}</span>
                  </div>
                  {edu.location && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      <MapPin size={14} />
                      <span>{edu.location}</span>
                    </div>
                  )}
                  {edu.cgpa !== null && edu.cgpa !== undefined && (
                    <div className="badge badge-success font-mono" style={{ fontSize: '0.85rem', padding: '0.3rem 0.75rem' }}>
                      CGPA: {edu.cgpa} / 10.0
                    </div>
                  )}
                  {edu.percentage !== null && edu.percentage !== undefined && (
                    <div className="badge badge-info font-mono" style={{ fontSize: '0.8rem' }}>
                      Score: {edu.percentage}%
                    </div>
                  )}
                </div>
              </div>

              {edu.description && (
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                  {edu.description}
                </p>
              )}

              {edu.achievements && edu.achievements.length > 0 && (
                <div style={{ marginBottom: '1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                    <Award size={15} color="#d97706" /> Honors & Achievements
                  </div>
                  <ul style={{ paddingLeft: '1.25rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                    {edu.achievements.map((ach, i) => (
                      <li key={i} style={{ marginBottom: '0.25rem' }}>{ach}</li>
                    ))}
                  </ul>
                </div>
              )}

              {edu.relevantCoursework && edu.relevantCoursework.length > 0 && (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                    <BookOpen size={15} color="var(--accent-primary)" /> Relevant Coursework
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                    {edu.relevantCoursework.map((course, i) => (
                      <span key={i} className="badge badge-neutral" style={{ fontSize: '0.75rem' }}>
                        {course}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
