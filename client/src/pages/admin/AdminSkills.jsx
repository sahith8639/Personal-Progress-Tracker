import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Code2, Search } from 'lucide-react';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { Modal } from '../../components/Modal';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { Skeleton } from '../../components/Skeleton';
import { Badge } from '../../components/Badge';

const SKILL_CATEGORIES = [
  'Programming Languages',
  'Web Development',
  'AI/ML',
  'Data Science',
  'Databases',
  'Tools',
  'Cloud',
  'Version Control',
  'Other',
];

const EMPTY_SKILL = {
  name: '',
  category: 'Programming Languages',
  proficiency: 75,
  experience: '1 year',
  status: 'Intermediate',
  technologies: [],
  isPublic: true,
};

export const AdminSkills = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null);
  const [formData, setFormData] = useState(EMPTY_SKILL);
  const [techsText, setTechsText] = useState('');
  const [saving, setSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const { addToast } = useToast();

  const fetchSkills = async () => {
    try {
      const res = await api.skills.list();
      if (res.success) setSkills(res.data);
    } catch (err) {
      addToast('Failed to load skills', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const handleOpenAdd = () => {
    setEditingSkill(null);
    setFormData(EMPTY_SKILL);
    setTechsText('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (skill) => {
    setEditingSkill(skill);
    setFormData(skill);
    setTechsText((skill.technologies || []).join(', '));
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
      proficiency: Number(formData.proficiency),
      technologies: techsText
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
    };

    try {
      if (editingSkill) {
        await api.skills.update(editingSkill._id, payload);
        addToast(`Skill ${formData.name} updated`, 'success');
      } else {
        await api.skills.create(payload);
        addToast(`Skill ${formData.name} added`, 'success');
      }
      setIsModalOpen(false);
      fetchSkills();
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
      await api.skills.delete(deleteTarget._id);
      addToast(`Skill ${deleteTarget.name} removed`, 'success');
      setDeleteTarget(null);
      fetchSkills();
    } catch (err) {
      addToast(err.message || 'Delete failed', 'error');
    } finally {
      setDeleting(false);
    }
  };

  const filtered = skills.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem' }}>Skills & Competency Management</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Configure skills, proficiencies, experience timelines, and tech tags
          </p>
        </div>
        <button className="btn btn-primary" onClick={handleOpenAdd}>
          <Plus size={16} /> Add Skill
        </button>
      </div>

      <div className="card" style={{ padding: '0.85rem 1.25rem' }}>
        <div style={{ position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            className="form-input"
            placeholder="Search skills..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: '2.4rem' }}
          />
        </div>
      </div>

      {loading ? (
        <Skeleton height={250} />
      ) : (
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Skill Name</th>
                <th>Category</th>
                <th>Proficiency</th>
                <th>Experience</th>
                <th>Status</th>
                <th>Visibility</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((skill) => (
                <tr key={skill._id}>
                  <td style={{ fontWeight: 600 }}>{skill.name}</td>
                  <td>{skill.category}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div className="progress-container" style={{ width: '80px', height: '6px' }}>
                        <div className="progress-bar-fill" style={{ width: `${skill.proficiency}%` }} />
                      </div>
                      <span className="font-mono" style={{ fontSize: '0.8rem' }}>{skill.proficiency}%</span>
                    </div>
                  </td>
                  <td>{skill.experience}</td>
                  <td><Badge>{skill.status}</Badge></td>
                  <td>
                    <span className={`badge ${skill.isPublic ? 'badge-success' : 'badge-neutral'}`} style={{ fontSize: '0.65rem' }}>
                      {skill.isPublic ? 'Public' : 'Private'}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                      <button className="btn-outline btn-sm" onClick={() => handleOpenEdit(skill)} title="Edit">
                        <Edit2 size={13} />
                      </button>
                      <button className="btn-danger btn-sm" onClick={() => setDeleteTarget(skill)} title="Delete">
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
        title={editingSkill ? 'Edit Skill' : 'Add New Skill'}
        maxWidth="600px"
      >
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Skill Name *</label>
            <input
              type="text"
              name="name"
              className="form-input"
              placeholder="e.g. PyTorch"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                name="category"
                className="form-select"
                value={formData.category}
                onChange={handleChange}
              >
                {SKILL_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Status</label>
              <select
                name="status"
                className="form-select"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="Learning">Learning</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
                <option value="Expert">Expert</option>
              </select>
            </div>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Proficiency % ({formData.proficiency}%)</label>
              <input
                type="range"
                name="proficiency"
                min="0"
                max="100"
                value={formData.proficiency}
                onChange={handleChange}
                style={{ width: '100%' }}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Experience Duration</label>
              <input
                type="text"
                name="experience"
                className="form-input"
                placeholder="e.g. 2 years"
                value={formData.experience}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Related Tools / Technologies (comma separated)</label>
            <input
              type="text"
              className="form-input"
              placeholder="Tensors, Autograd, Torchvision"
              value={techsText}
              onChange={(e) => setTechsText(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input
              type="checkbox"
              name="isPublic"
              checked={formData.isPublic}
              onChange={handleChange}
            />
            <label style={{ fontSize: '0.85rem' }}>Publicly visible</label>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving...' : editingSkill ? 'Save Skill' : 'Create Skill'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Skill"
        message={`Are you sure you want to delete ${deleteTarget?.name}?`}
        loading={deleting}
      />
    </div>
  );
};
