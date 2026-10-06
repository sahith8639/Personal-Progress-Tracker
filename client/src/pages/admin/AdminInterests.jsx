import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Heart } from 'lucide-react';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { Modal } from '../../components/Modal';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { Skeleton } from '../../components/Skeleton';
import { Badge } from '../../components/Badge';

const EMPTY_INTEREST = {
  name: '',
  category: 'Technology & AI',
  description: '',
  interestLevel: 'High',
  relatedSkills: [],
  isPublic: true,
};

export const AdminInterests = () => {
  const [interests, setInterests] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingInterest, setEditingInterest] = useState(null);
  const [formData, setFormData] = useState(EMPTY_INTEREST);
  const [skillsText, setSkillsText] = useState('');
  const [saving, setSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const { addToast } = useToast();

  const fetchInterests = async () => {
    try {
      const res = await api.interests.list();
      if (res.success) setInterests(res.data);
    } catch (err) {
      addToast('Failed to load interests', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInterests();
  }, []);

  const handleOpenAdd = () => {
    setEditingInterest(null);
    setFormData(EMPTY_INTEREST);
    setSkillsText('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingInterest(item);
    setFormData(item);
    setSkillsText((item.relatedSkills || []).join(', '));
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
      relatedSkills: skillsText
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
    };

    try {
      if (editingInterest) {
        await api.interests.update(editingInterest._id, payload);
        addToast(`Updated interest ${formData.name}`, 'success');
      } else {
        await api.interests.create(payload);
        addToast(`Created interest ${formData.name}`, 'success');
      }
      setIsModalOpen(false);
      fetchInterests();
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
      await api.interests.delete(deleteTarget._id);
      addToast(`Interest deleted`, 'success');
      setDeleteTarget(null);
      fetchInterests();
    } catch (err) {
      addToast(err.message || 'Failed to delete interest', 'error');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem' }}>Interests & Domain Focus</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Curate research domains, academic passions, and priority levels
          </p>
        </div>
        <button className="btn btn-primary" onClick={handleOpenAdd}>
          <Plus size={16} /> Add Interest
        </button>
      </div>

      {loading ? (
        <Skeleton height={200} />
      ) : (
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Domain / Interest Name</th>
                <th>Category</th>
                <th>Priority Level</th>
                <th>Related Skills</th>
                <th>Visibility</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {interests.map((interest) => (
                <tr key={interest._id}>
                  <td style={{ fontWeight: 600 }}>{interest.name}</td>
                  <td>{interest.category}</td>
                  <td><Badge>{interest.interestLevel}</Badge></td>
                  <td>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                      {interest.relatedSkills?.map((s, idx) => (
                        <span key={idx} className="badge badge-neutral" style={{ fontSize: '0.65rem' }}>{s}</span>
                      ))}
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${interest.isPublic ? 'badge-success' : 'badge-neutral'}`} style={{ fontSize: '0.65rem' }}>
                      {interest.isPublic ? 'Public' : 'Private'}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                      <button className="btn-outline btn-sm" onClick={() => handleOpenEdit(interest)} title="Edit">
                        <Edit2 size={13} />
                      </button>
                      <button className="btn-danger btn-sm" onClick={() => setDeleteTarget(interest)} title="Delete">
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
        title={editingInterest ? 'Edit Interest' : 'Add New Interest'}
        maxWidth="550px"
      >
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Interest Name *</label>
            <input
              type="text"
              name="name"
              className="form-input"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Category</label>
              <input
                type="text"
                name="category"
                className="form-input"
                value={formData.category}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Interest Level</label>
              <select
                name="interestLevel"
                className="form-select"
                value={formData.interestLevel}
                onChange={handleChange}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Very High">Very High</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              name="description"
              className="form-textarea"
              rows={2}
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Related Skills (comma separated)</label>
            <input
              type="text"
              className="form-input"
              placeholder="PyTorch, Machine Learning"
              value={skillsText}
              onChange={(e) => setSkillsText(e.target.value)}
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
              {saving ? 'Saving...' : editingInterest ? 'Save Changes' : 'Create Interest'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Interest"
        message={`Are you sure you want to delete ${deleteTarget?.name}?`}
        loading={deleting}
      />
    </div>
  );
};
