import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, FolderGit2, Upload } from 'lucide-react';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { Modal } from '../../components/Modal';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { Skeleton } from '../../components/Skeleton';
import { Badge } from '../../components/Badge';

const EMPTY_PROJECT = {
  name: '',
  shortDescription: '',
  detailedDescription: '',
  technologies: [],
  category: 'Machine Learning',
  githubUrl: '',
  liveDemoUrl: '',
  startDate: '',
  endDate: '',
  status: 'In Progress',
  imageUrl: '',
  docUrl: '',
  isPublic: true,
};

export const AdminProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [formData, setFormData] = useState(EMPTY_PROJECT);
  const [techsText, setTechsText] = useState('');
  const [saving, setSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const { addToast } = useToast();

  const fetchProjects = async () => {
    try {
      const res = await api.projects.list();
      if (res.success) setProjects(res.data);
    } catch (err) {
      addToast('Failed to load projects', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleOpenAdd = () => {
    setEditingProject(null);
    setFormData(EMPTY_PROJECT);
    setTechsText('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (proj) => {
    setEditingProject(proj);
    setFormData(proj);
    setTechsText((proj.technologies || []).join(', '));
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
      technologies: techsText
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
    };

    try {
      if (editingProject) {
        await api.projects.update(editingProject._id, payload);
        addToast(`Project ${formData.name} updated`, 'success');
      } else {
        await api.projects.create(payload);
        addToast(`Project ${formData.name} created`, 'success');
      }
      setIsModalOpen(false);
      fetchProjects();
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
      await api.projects.delete(deleteTarget._id);
      addToast(`Project deleted`, 'success');
      setDeleteTarget(null);
      fetchProjects();
    } catch (err) {
      addToast(err.message || 'Failed to delete project', 'error');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem' }}>Projects Showcase Management</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Maintain repositories, deployment URLs, tech stacks, and descriptions
          </p>
        </div>
        <button className="btn btn-primary" onClick={handleOpenAdd}>
          <Plus size={16} /> Add Project
        </button>
      </div>

      {loading ? (
        <Skeleton height={250} />
      ) : (
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Project Name</th>
                <th>Category</th>
                <th>Status</th>
                <th>Technologies</th>
                <th>Visibility</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((proj) => (
                <tr key={proj._id}>
                  <td style={{ fontWeight: 600 }}>{proj.name}</td>
                  <td>{proj.category}</td>
                  <td><Badge>{proj.status}</Badge></td>
                  <td>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                      {proj.technologies?.slice(0, 3).map((t, i) => (
                        <span key={i} className="badge badge-neutral" style={{ fontSize: '0.65rem' }}>{t}</span>
                      ))}
                      {proj.technologies?.length > 3 && (
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>+{proj.technologies.length - 3}</span>
                      )}
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${proj.isPublic ? 'badge-success' : 'badge-neutral'}`} style={{ fontSize: '0.65rem' }}>
                      {proj.isPublic ? 'Public' : 'Private'}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                      <button className="btn-outline btn-sm" onClick={() => handleOpenEdit(proj)} title="Edit">
                        <Edit2 size={13} />
                      </button>
                      <button className="btn-danger btn-sm" onClick={() => setDeleteTarget(proj)} title="Delete">
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
        title={editingProject ? 'Edit Project' : 'Add New Project'}
        maxWidth="680px"
      >
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Project Name *</label>
              <input
                type="text"
                name="name"
                className="form-input"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Category</label>
              <input
                type="text"
                name="category"
                className="form-input"
                placeholder="AI / Full-Stack / CV"
                value={formData.category}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Short Description (for preview cards) *</label>
            <input
              type="text"
              name="shortDescription"
              className="form-input"
              value={formData.shortDescription}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Detailed Description</label>
            <textarea
              name="detailedDescription"
              className="form-textarea"
              rows={3}
              value={formData.detailedDescription}
              onChange={handleChange}
            />
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">GitHub Repository URL</label>
              <input
                type="url"
                name="githubUrl"
                className="form-input"
                value={formData.githubUrl}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Live Demo URL</label>
              <input
                type="url"
                name="liveDemoUrl"
                className="form-input"
                value={formData.liveDemoUrl}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Status</label>
              <select
                name="status"
                className="form-select"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="Completed">Completed</option>
                <option value="In Progress">In Progress</option>
                <option value="Planned">Planned</option>
                <option value="Paused">Paused</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Technologies (comma separated)</label>
              <input
                type="text"
                className="form-input"
                placeholder="React, PyTorch, MongoDB"
                value={techsText}
                onChange={(e) => setTechsText(e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
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
              {saving ? 'Saving...' : editingProject ? 'Save Changes' : 'Create Project'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Project"
        message={`Are you sure you want to delete ${deleteTarget?.name}?`}
        loading={deleting}
      />
    </div>
  );
};
