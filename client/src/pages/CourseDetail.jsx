import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  BookOpen,
  Calendar,
  User,
  GraduationCap,
  CheckCircle2,
  Circle,
  FileText,
  Download,
  ExternalLink,
  Plus,
  Layers,
} from 'lucide-react';
import { api } from '../services/api';
import { Skeleton } from '../components/Skeleton';
import { Badge } from '../components/Badge';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const CourseDetail = () => {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const { addToast } = useToast();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newTopicTitle, setNewTopicTitle] = useState('');
  const [addingTopic, setAddingTopic] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await api.courses.get(id);
        if (res.success) setCourse(res.data);
      } catch (err) {
        console.error('Failed to load course details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [id]);

  const handleToggleTopic = async (topic) => {
    if (!isAuthenticated) return;
    try {
      const res = await api.courses.updateTopic(course._id, topic._id, {
        completed: !topic.completed,
      });
      if (res.success) {
        setCourse((prev) => ({
          ...prev,
          topics: prev.topics.map((t) =>
            t._id === topic._id ? { ...t, completed: !t.completed } : t
          ),
        }));
        addToast('Topic progress updated', 'success');
      }
    } catch (err) {
      addToast(err.message || 'Failed to update topic', 'error');
    }
  };

  const handleAddTopic = async (e) => {
    e.preventDefault();
    if (!newTopicTitle.trim()) return;
    try {
      const res = await api.courses.addTopic(course._id, { title: newTopicTitle.trim(), completed: false });
      if (res.success) {
        setCourse(res.data);
        setNewTopicTitle('');
        setAddingTopic(false);
        addToast('Topic added to course syllabus', 'success');
      }
    } catch (err) {
      addToast(err.message || 'Failed to add topic', 'error');
    }
  };

  if (loading) {
    return (
      <div style={{ maxWidth: '950px', margin: '0 auto' }}>
        <Skeleton height={180} />
        <Skeleton height={250} />
      </div>
    );
  }

  if (!course) {
    return (
      <div style={{ maxWidth: '950px', margin: '0 auto', textAlign: 'center', padding: '3rem 1rem' }}>
        <h2>Course not found</h2>
        <Link to="/courses" className="btn btn-primary" style={{ marginTop: '1rem' }}>
          Back to Courses
        </Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '950px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Top Navigation */}
      <div>
        <Link to="/courses" className="btn btn-outline btn-sm" style={{ marginBottom: '1rem' }}>
          <ArrowLeft size={14} /> Back to Courses
        </Link>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <span className="font-mono badge badge-neutral" style={{ fontWeight: 700 }}>
                {course.code}
              </span>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{course.category}</span>
            </div>
            <h1 style={{ fontSize: '2.1rem' }}>{course.name}</h1>
          </div>
          <Badge size="lg">{course.status}</Badge>
        </div>
      </div>

      {/* Course Highlights Cards */}
      <div className="card" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.25rem' }}>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>SEMESTER & YEAR</span>
            <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{course.semester}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{course.academicYear}</div>
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>CREDITS</span>
            <div style={{ fontWeight: 700, fontSize: '1.2rem' }} className="font-mono">{course.credits} Credits</div>
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>GRADE EARNED</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span className="badge badge-success font-mono" style={{ fontSize: '0.95rem', fontWeight: 700 }}>
                {course.grade || 'In Progress'}
              </span>
              {course.gradePoint !== null && (
                <span className="font-mono" style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  ({course.gradePoint} Points)
                </span>
              )}
            </div>
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>INSTRUCTOR</span>
            <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{course.instructor || 'Department Faculty'}</div>
            {course.institution && (
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{course.institution}</div>
            )}
          </div>
        </div>

        {course.description && (
          <div style={{ marginTop: '1.5rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1.25rem' }}>
            <h4 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Course Overview</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem', lineHeight: 1.65 }}>
              {course.description}
            </p>
          </div>
        )}
      </div>

      {/* Topics Covered */}
      <div className="card">
        <div className="card-header">
          <div>
            <h3 style={{ fontSize: '1.2rem' }}>Syllabus & Topics Covered</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Detailed curriculum units and comprehension checkpoints
            </p>
          </div>
          {isAuthenticated && (
            <button className="btn btn-secondary btn-sm" onClick={() => setAddingTopic(!addingTopic)}>
              <Plus size={14} /> Add Topic
            </button>
          )}
        </div>

        {addingTopic && (
          <form onSubmit={handleAddTopic} style={{ marginBottom: '1.25rem', display: 'flex', gap: '0.5rem' }}>
            <input
              type="text"
              className="form-input"
              placeholder="Enter new syllabus topic..."
              value={newTopicTitle}
              onChange={(e) => setNewTopicTitle(e.target.value)}
              autoFocus
            />
            <button type="submit" className="btn btn-primary btn-sm">Add</button>
            <button type="button" className="btn btn-outline btn-sm" onClick={() => setAddingTopic(false)}>Cancel</button>
          </form>
        )}

        {course.topics && course.topics.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {course.topics.map((t) => (
              <div
                key={t._id}
                onClick={() => handleToggleTopic(t)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.625rem 0.875rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-secondary)',
                  cursor: isAuthenticated ? 'pointer' : 'default',
                  transition: 'background var(--transition-fast)',
                }}
              >
                {t.completed ? (
                  <CheckCircle2 size={18} color="#059669" />
                ) : (
                  <Circle size={18} color="var(--text-muted)" />
                )}
                <span
                  style={{
                    fontSize: '0.9rem',
                    color: t.completed ? 'var(--text-primary)' : 'var(--text-secondary)',
                    textDecoration: t.completed ? 'none' : 'none',
                    fontWeight: t.completed ? 500 : 400,
                  }}
                >
                  {t.title}
                </span>
                {isAuthenticated && (
                  <span style={{ marginLeft: 'auto', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    (Click to toggle)
                  </span>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No topics registered yet.</p>
        )}
      </div>

      {/* Course Resources */}
      <div className="card">
        <div className="card-header">
          <div>
            <h3 style={{ fontSize: '1.2rem' }}>Attached Course Resources</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Lecture notes, slides, PDFs, code repositories, and reference materials
            </p>
          </div>
          {isAuthenticated && (
            <Link to="/admin" className="btn btn-secondary btn-sm">
              <Plus size={14} /> Add Resource
            </Link>
          )}
        </div>

        {course.resources && course.resources.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {course.resources.map((res) => (
              <div
                key={res._id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.875rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                  background: 'var(--bg-surface)',
                  gap: '1rem',
                  flexWrap: 'wrap',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, minWidth: '240px' }}>
                  <div
                    style={{
                      padding: '0.5rem',
                      background: 'var(--bg-secondary)',
                      borderRadius: 'var(--radius-sm)',
                      color: 'var(--accent-primary)',
                    }}
                  >
                    <FileText size={20} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.925rem' }}>{res.title}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {res.type} {res.topic && `• ${res.topic}`}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {res.fileUrl && (
                    <a
                      href={res.fileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-secondary btn-sm"
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
                    >
                      <ExternalLink size={14} /> Open Link
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            No specific documents or links uploaded for this course yet.
          </p>
        )}
      </div>
    </div>
  );
};
