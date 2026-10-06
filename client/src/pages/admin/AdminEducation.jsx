import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, GraduationCap } from 'lucide-react';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { Modal } from '../../components/Modal';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { Skeleton } from '../../components/Skeleton';

const EMPTY_EDU = {
  degree: '',
  institution: '',
  university: '',
  department: '',
  startDate: '',
  endDate: '',
  cgpa: '',
  percentage: '',
  location: '',
  description: '',
  achievements: [],
  relevantCoursework: [],
  isPublic: true,
  order: 0,
};

export const AdminEducation = () => {
  const [eduList, setEduList] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState(EMPTY_EDU);
  const [achievementsText, setAchievementsText] = useState('');
  const [courseworkText, setCourseworkText] = useState('');
  const [saving, setSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const { addToast } = useToast();

  const fetchEdu = async () => {
    try {
      const res = await api.education.list();
      if (res.success) setEduList(res.data);
    } catch (err) {
      addToast('Failed to load education records', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEdu();
  }, []);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData(EMPTY_EDU);
    setAchievementsText('');
    setCourseworkText('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (edu) => {
    setEditingItem(edu);
    setFormData({
      ...edu,
      cgpa: edu.cgpa !== null && edu.cgpa !== undefined ? edu.cgpa : '',
      percentage: edu.percentage !== null && edu.percentage !== undefined ? edu.percentage : '',
    });
    setAchievementsText((edu.achievements || []).join('\n'));
    setCourseworkText((edu.relevantCoursework || []).join(', '));
    setIsModalOpen(true);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      ...formData,
      cgpa: formData.cgpa === '' ? null : Number(formData.cgpa),
      percentage: formData.percentage === '' ? null : Number(formData.percentage),
      achievements: achievementsText
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean),
      relevantCoursework: courseworkText
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
    };

    try {
      if (editingItem) {
        await api.education.update(editingItem._id, payload);
        addToast('Education record updated', 'success');
      } else {
        await api.education.create(payload);
        addToast('Education record added', 'success');
      }
      setIsModalOpen(false);
      fetchEdu();
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
      await api.education.delete(deleteTarget._id);
      addToast('Education record removed', 'success');
      setDeleteTarget(null);
      fetchEdu();
    } catch (err) {
      addToast(err.message || 'Delete failed', 'error');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem' }}>Education Credentials Management</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Maintain degrees, colleges, scores, and academic honors
          </p>
        </div>
        <button className="btn btn-primary" onClick={handleOpenAdd}>
          <Plus size={16} /> Add Education
        </button>
      </div>

      {loading ? (
        <Skeleton height={250} />
      ) : (
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Degree</th>
                <th>Institution</th>
                <th>Timeline</th>
                <th>CGPA / %</th>
                <th>Visibility</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {eduList.map((edu) => (
                <tr key={edu._id}>
                  <td style={{ fontWeight: 600 }}>{edu.degree}</td>
                  <td>{edu.institution}</td>
                  <td>{edu.startDate} – {edu.endDate}</td>
                  <td className="font-mono">
                    {edu.cgpa !== null ? `CGPA: ${edu.cgpa}` : edu.percentage !== null ? `${edu.percentage}%` : '—'}
                  </td>
                  <td>
                    <span className={`badge ${edu.isPublic ? 'badge-success' : 'badge-neutral'}`} style={{ fontSize: '0.65rem' }}>
                      {edu.isPublic ? 'Public' : 'Private'}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                      <button className="btn-outline btn-sm" onClick={() => handleOpenEdit(edu)} title="Edit">
                        <Edit2 size={13} />
                      </button>
                      <button className="btn-danger btn-sm" onClick={() => setDeleteTarget(edu)} title="Delete">
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

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? 'Edit Education Record' : 'Add Education Record'}
        maxWidth="680px"
      >
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Degree Name *</label>
              <input
                type="text"
                name="degree"
                className="form-input"
                placeholder="e.g. B.Tech in Artificial Intelligence"
                value={formData.degree}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Institution / College *</label>
              <input
                type="text"
                name="institution"
                className="form-input"
                placeholder="e.g. XYZ College of Engineering"
                value={formData.institution}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Affiliated University</label>
              <input
                type="text"
                name="university"
                className="form-input"
                value={formData.university}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Department</label>
              <input
                type="text"
                name="department"
                className="form-input"
                placeholder="e.g. Department of CSE"
                value={formData.department}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Start Date</label>
              <input
                type="text"
                name="startDate"
                className="form-input"
                placeholder="2024"
                value={formData.startDate}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">End Date</label>
              <input
                type="text"
                name="endDate"
                className="form-input"
                placeholder="2028"
                value={formData.endDate}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">CGPA (out of 10.0)</label>
              <input
                type="number"
                step="0.01"
                name="cgpa"
                className="form-input"
                placeholder="8.5"
                value={formData.cgpa}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Percentage (%)</label>
              <input
                type="number"
                step="0.1"
                name="percentage"
                className="form-input"
                placeholder="85.0"
                value={formData.percentage}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Honors & Achievements (one per line)</label>
            <textarea
              className="form-textarea"
              rows={2}
              value={achievementsText}
              onChange={(e) => setAchievementsText(e.target.value)}
              placeholder="Academic Merit Scholarship&#10;Department Rank 2"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Relevant Coursework (comma separated)</label>
            <input
              type="text"
              className="form-input"
              value={courseworkText}
              onChange={(e) => setCourseworkText(e.target.value)}
              placeholder="Data Structures, Algorithms, Machine Learning, DBMS"
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input
              type="checkbox"
              name="isPublic"
              checked={formData.isPublic}
              onChange={handleChange}
            />
            <label style={{ fontSize: '0.85rem' }}>Visible on public site</label>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving...' : editingItem ? 'Save Record' : 'Add Record'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Education Record"
        message={`Are you sure you want to delete ${deleteTarget?.degree}?`}
        loading={deleting}
      />
    </div>
  );
};
