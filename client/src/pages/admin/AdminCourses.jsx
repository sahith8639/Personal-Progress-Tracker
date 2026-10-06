import React, { useState, useEffect } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  BookOpen,
  Search,
  CheckCircle2,
  X,
} from 'lucide-react';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { Modal } from '../../components/Modal';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { Skeleton } from '../../components/Skeleton';
import { Badge } from '../../components/Badge';

const EMPTY_COURSE = {
  name: '',
  code: '',
  semester: 'Semester 1',
  academicYear: '2024 - 2025',
  category: 'Core Computer Science',
  credits: 4,
  grade: '',
  gradePoint: null,
  status: 'Completed',
  instructor: '',
  institution: '',
  startDate: '',
  completionDate: '',
  description: '',
  topics: [],
  isPublic: true,
};

export const AdminCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [formData, setFormData] = useState(EMPTY_COURSE);
  const [saving, setSaving] = useState(false);

  // Topic input inside modal
  const [topicInput, setTopicInput] = useState('');

  // Delete State
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const { addToast } = useToast();

  const fetchCourses = async () => {
    try {
      const res = await api.courses.list();
      if (res.success) setCourses(res.data);
    } catch (err) {
      addToast('Failed to load courses', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleOpenAdd = () => {
    setEditingCourse(null);
    setFormData(EMPTY_COURSE);
    setTopicInput('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (course) => {
    setEditingCourse(course);
    setFormData({
      ...course,
      topics: course.topics || [],
    });
    setTopicInput('');
    setIsModalOpen(true);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleAddTopic = () => {
    if (!topicInput.trim()) return;
    setFormData((prev) => ({
      ...prev,
      topics: [...prev.topics, { title: topicInput.trim(), completed: false }],
    }));
    setTopicInput('');
  };

  const handleRemoveTopic = (idx) => {
    setFormData((prev) => ({
      ...prev,
      topics: prev.topics.filter((_, i) => i !== idx),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingCourse) {
        const res = await api.courses.update(editingCourse._id, formData);
        if (res.success) {
          addToast(`Updated course ${formData.code}`, 'success');
        }
      } else {
        const res = await api.courses.create(formData);
        if (res.success) {
          addToast(`Created course ${formData.code}`, 'success');
        }
      }
      setIsModalOpen(false);
      fetchCourses();
    } catch (err) {
      addToast(err.message || 'Operation failed', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await api.courses.delete(deleteTarget._id);
      if (res.success) {
        addToast(`Course ${deleteTarget.code} deleted`, 'success');
        setDeleteTarget(null);
        fetchCourses();
      }
    } catch (err) {
      addToast(err.message || 'Failed to delete course', 'error');
    } finally {
      setDeleting(false);
    }
  };

  const filtered = courses.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem' }}>Academic Courses Management</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Add courses, configure credits & grades, and maintain topic coverage
          </p>
        </div>

        <button className="btn btn-primary" onClick={handleOpenAdd}>
          <Plus size={16} /> Add Course
        </button>
      </div>

      {/* Search Input */}
      <div className="card" style={{ padding: '0.85rem 1.25rem' }}>
        <div style={{ position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            className="form-input"
            placeholder="Search courses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: '2.4rem' }}
          />
        </div>
      </div>

      {/* Courses Table */}
      {loading ? (
        <Skeleton height={300} />
      ) : (
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Course Name</th>
                <th>Semester</th>
                <th>Credits</th>
                <th>Grade</th>
                <th>Status</th>
                <th>Topics</th>
                <th>Public</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((course) => (
                <tr key={course._id}>
                  <td className="font-mono" style={{ fontWeight: 600 }}>{course.code}</td>
                  <td>
                    <span style={{ fontWeight: 500 }}>{course.name}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>{course.category}</span>
                  </td>
                  <td>{course.semester}</td>
                  <td className="font-mono">{course.credits}</td>
                  <td className="font-mono" style={{ fontWeight: 700, color: '#059669' }}>
                    {course.grade || '—'}
                  </td>
                  <td>
                    <Badge>{course.status}</Badge>
                  </td>
                  <td style={{ fontSize: '0.8rem' }}>
                    {course.topics?.length || 0} Topics
                  </td>
                  <td>
                    <span className={`badge ${course.isPublic ? 'badge-success' : 'badge-neutral'}`} style={{ fontSize: '0.65rem' }}>
                      {course.isPublic ? 'Public' : 'Private'}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                      <button className="btn-outline btn-sm" onClick={() => handleOpenEdit(course)} title="Edit">
                        <Edit2 size={13} />
                      </button>
                      <button className="btn-danger btn-sm" onClick={() => setDeleteTarget(course)} title="Delete">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add / Edit Course Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCourse ? `Edit Course: ${editingCourse.code}` : 'Add New Academic Course'}
        maxWidth="740px"
      >
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Course Name *</label>
              <input
                type="text"
                name="name"
                className="form-input"
                placeholder="e.g. Machine Learning"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Course Code *</label>
              <input
                type="text"
                name="code"
                className="form-input"
                placeholder="e.g. CS501"
                value={formData.code}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Semester *</label>
              <input
                type="text"
                name="semester"
                className="form-input"
                placeholder="e.g. Semester 4"
                value={formData.semester}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Academic Year</label>
              <input
                type="text"
                name="academicYear"
                className="form-input"
                placeholder="2024 - 2025"
                value={formData.academicYear}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Category</label>
              <input
                type="text"
                name="category"
                className="form-input"
                placeholder="Core / Elective / AI/ML"
                value={formData.category}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Credits *</label>
              <input
                type="number"
                name="credits"
                className="form-input"
                min="0"
                step="0.5"
                value={formData.credits}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Grade (e.g. S, A, B, C, D, E, F)</label>
              <input
                type="text"
                name="grade"
                className="form-input"
                placeholder="S"
                value={formData.grade}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Status</label>
              <select
                name="status"
                className="form-select"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="Completed">Completed</option>
                <option value="Currently Learning">Currently Learning</option>
                <option value="Not Completed">Not Completed</option>
                <option value="Planned">Planned</option>
                <option value="Dropped">Dropped</option>
              </select>
            </div>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Instructor Name</label>
              <input
                type="text"
                name="instructor"
                className="form-input"
                value={formData.instructor}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Institution</label>
              <input
                type="text"
                name="institution"
                className="form-input"
                value={formData.institution}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Description / Course Scope</label>
            <textarea
              name="description"
              className="form-textarea"
              rows={2}
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          {/* Topics Syllabus Section */}
          <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
            <label className="form-label">Course Topics / Syllabus Checkpoints</label>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <input
                type="text"
                className="form-input"
                placeholder="Enter syllabus topic..."
                value={topicInput}
                onChange={(e) => setTopicInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTopic();
                  }
                }}
              />
              <button type="button" className="btn btn-secondary btn-sm" onClick={handleAddTopic}>
                Add
              </button>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
              {formData.topics.map((t, idx) => (
                <span
                  key={idx}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    padding: '0.25rem 0.6rem',
                    background: 'var(--bg-secondary)',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.8rem',
                  }}
                >
                  <span>{t.title}</span>
                  <button type="button" onClick={() => handleRemoveTopic(idx)} style={{ color: 'var(--status-danger-text)' }}>
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
            <input
              type="checkbox"
              name="isPublic"
              checked={formData.isPublic}
              onChange={handleChange}
            />
            <label style={{ fontSize: '0.85rem' }}>Visible on public website</label>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving...' : editingCourse ? 'Save Changes' : 'Create Course'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Course Record"
        message={`Are you sure you want to delete ${deleteTarget?.code}: ${deleteTarget?.name}? This action cannot be undone.`}
        loading={deleting}
      />
    </div>
  );
};
