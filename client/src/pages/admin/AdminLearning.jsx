import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, TrendingUp, Clock, X, Check } from 'lucide-react';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { Modal } from '../../components/Modal';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { Skeleton } from '../../components/Skeleton';
import { Badge } from '../../components/Badge';

const EMPTY_LEARNING = {
  title: '',
  category: 'Software Engineering',
  description: '',
  startDate: '',
  targetDate: '',
  currentProgress: 20,
  status: 'Learning',
  priority: 'High',
  hoursCompleted: 0,
  totalEstimatedHours: 60,
  currentLevel: 'Beginner',
  targetLevel: 'Advanced',
  notes: '',
  roadmap: [],
  isPublic: true,
};

const EMPTY_LOG = {
  date: new Date().toISOString().split('T')[0],
  subjectOrTopic: '',
  hoursStudied: 2.0,
  topicsCompleted: '',
  notes: '',
  learningItemId: '',
};

export const AdminLearning = () => {
  const [items, setItems] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Learning Item Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState(EMPTY_LEARNING);
  const [roadmapStepInput, setRoadmapStepInput] = useState('');
  const [savingItem, setSavingItem] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Study Log Modal
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [logFormData, setLogFormData] = useState(EMPTY_LOG);
  const [savingLog, setSavingLog] = useState(false);

  const { addToast } = useToast();

  const fetchData = async () => {
    try {
      const [itemsRes, logsRes] = await Promise.all([
        api.learning.list(),
        api.learning.getLogs(),
      ]);
      if (itemsRes.success) setItems(itemsRes.data);
      if (logsRes.success) setLogs(logsRes.data);
    } catch (err) {
      addToast('Failed to load learning data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData(EMPTY_LEARNING);
    setRoadmapStepInput('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setFormData(item);
    setRoadmapStepInput('');
    setIsModalOpen(true);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleAddRoadmapStep = () => {
    if (!roadmapStepInput.trim()) return;
    setFormData((prev) => ({
      ...prev,
      roadmap: [
        ...prev.roadmap,
        { topic: roadmapStepInput.trim(), status: 'Not Started', progress: 0 },
      ],
    }));
    setRoadmapStepInput('');
  };

  const handleRemoveRoadmapStep = (idx) => {
    setFormData((prev) => ({
      ...prev,
      roadmap: prev.roadmap.filter((_, i) => i !== idx),
    }));
  };

  const handleSubmitItem = async (e) => {
    e.preventDefault();
    setSavingItem(true);

    const payload = {
      ...formData,
      currentProgress: Number(formData.currentProgress),
      hoursCompleted: Number(formData.hoursCompleted),
      totalEstimatedHours: Number(formData.totalEstimatedHours),
    };

    try {
      if (editingItem) {
        await api.learning.update(editingItem._id, payload);
        addToast(`Updated learning track ${formData.title}`, 'success');
      } else {
        await api.learning.create(payload);
        addToast(`Created learning track ${formData.title}`, 'success');
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      addToast(err.message || 'Operation failed', 'error');
    } finally {
      setSavingItem(false);
    }
  };

  const handleDeleteItem = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api.learning.delete(deleteTarget._id);
      addToast(`Deleted learning track`, 'success');
      setDeleteTarget(null);
      fetchData();
    } catch (err) {
      addToast(err.message || 'Failed to delete item', 'error');
    } finally {
      setDeleting(false);
    }
  };

  // Study log submission
  const handleSubmitLog = async (e) => {
    e.preventDefault();
    setSavingLog(true);

    const payload = {
      ...logFormData,
      hoursStudied: Number(logFormData.hoursStudied),
      topicsCompleted: logFormData.topicsCompleted
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      learningItemId: logFormData.learningItemId || null,
    };

    try {
      await api.learning.createLog(payload);
      addToast('Study session logged!', 'success');
      setIsLogModalOpen(false);
      setLogFormData(EMPTY_LOG);
      fetchData();
    } catch (err) {
      addToast(err.message || 'Failed to log study session', 'error');
    } finally {
      setSavingLog(false);
    }
  };

  const handleDeleteLog = async (id) => {
    try {
      await api.learning.deleteLog(id);
      addToast('Study log removed', 'success');
      fetchData();
    } catch (err) {
      addToast(err.message || 'Failed to delete log', 'error');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Learning Items Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem' }}>Learning Tracks & Roadmaps</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Track active self-study subjects, roadmaps, and competency targets
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn btn-secondary" onClick={() => setIsLogModalOpen(true)}>
            <Clock size={16} /> Log Study Time
          </button>
          <button className="btn btn-primary" onClick={handleOpenAdd}>
            <Plus size={16} /> Add Learning Track
          </button>
        </div>
      </div>

      {loading ? (
        <Skeleton height={250} />
      ) : (
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Skill / Track Name</th>
                <th>Category</th>
                <th>Progress</th>
                <th>Hours Logged</th>
                <th>Levels</th>
                <th>Status</th>
                <th>Roadmap</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item._id}>
                  <td style={{ fontWeight: 600 }}>{item.title}</td>
                  <td>{item.category}</td>
                  <td className="font-mono">{item.currentProgress}%</td>
                  <td className="font-mono">{item.hoursCompleted} / {item.totalEstimatedHours}h</td>
                  <td style={{ fontSize: '0.8rem' }}>{item.currentLevel} → {item.targetLevel}</td>
                  <td><Badge>{item.status}</Badge></td>
                  <td style={{ fontSize: '0.8rem' }}>{item.roadmap?.length || 0} Steps</td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                      <button className="btn-outline btn-sm" onClick={() => handleOpenEdit(item)} title="Edit">
                        <Edit2 size={13} />
                      </button>
                      <button className="btn-danger btn-sm" onClick={() => setDeleteTarget(item)} title="Delete">
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

      {/* Study Logs Management Section */}
      <div className="card">
        <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>Study Logs Audit</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1rem' }}>
          Daily record of study sessions contributing to your total hours and streaks
        </p>

        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Subject / Topic</th>
                <th>Hours</th>
                <th>Notes</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {logs.slice(0, 15).map((log) => (
                <tr key={log._id}>
                  <td style={{ whiteSpace: 'nowrap', fontSize: '0.85rem' }}>
                    {new Date(log.date).toLocaleDateString()}
                  </td>
                  <td style={{ fontWeight: 500 }}>{log.subjectOrTopic}</td>
                  <td className="font-mono" style={{ fontWeight: 600 }}>{log.hoursStudied}h</td>
                  <td style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{log.notes || '—'}</td>
                  <td style={{ textAlign: 'right' }}>
                    <button className="btn-danger btn-sm" onClick={() => handleDeleteLog(log._id)}>
                      <Trash2 size={13} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Learning Item Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? 'Edit Learning Track' : 'Add New Learning Track'}
        maxWidth="680px"
      >
        <form onSubmit={handleSubmitItem} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Title *</label>
              <input
                type="text"
                name="title"
                className="form-input"
                placeholder="e.g. Java & Advanced DSA"
                value={formData.title}
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
                placeholder="AI / Systems / Web"
                value={formData.category}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Current Progress % ({formData.currentProgress}%)</label>
              <input
                type="range"
                name="currentProgress"
                min="0"
                max="100"
                value={formData.currentProgress}
                onChange={handleChange}
                style={{ width: '100%' }}
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
                <option value="Learning">Learning</option>
                <option value="Completed">Completed</option>
                <option value="Not Started">Not Started</option>
                <option value="Paused">Paused</option>
              </select>
            </div>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Hours Completed</label>
              <input
                type="number"
                name="hoursCompleted"
                className="form-input"
                value={formData.hoursCompleted}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Total Estimated Hours</label>
              <input
                type="number"
                name="totalEstimatedHours"
                className="form-input"
                value={formData.totalEstimatedHours}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Current Level</label>
              <select
                name="currentLevel"
                className="form-select"
                value={formData.currentLevel}
                onChange={handleChange}
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Target Level</label>
              <select
                name="targetLevel"
                className="form-select"
                value={formData.targetLevel}
                onChange={handleChange}
              >
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
                <option value="Expert">Expert</option>
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

          {/* Roadmap Steps Manager */}
          <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
            <label className="form-label">Roadmap Milestones / Sequential Topics</label>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <input
                type="text"
                className="form-input"
                placeholder="Enter roadmap step (e.g. OOP, Collections, DSA)..."
                value={roadmapStepInput}
                onChange={(e) => setRoadmapStepInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddRoadmapStep();
                  }
                }}
              />
              <button type="button" className="btn btn-secondary btn-sm" onClick={handleAddRoadmapStep}>
                Add
              </button>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
              {formData.roadmap.map((step, idx) => (
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
                  <span>{step.topic}</span>
                  <button type="button" onClick={() => handleRemoveRoadmapStep(idx)} style={{ color: 'var(--status-danger-text)' }}>
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={savingItem}>
              {savingItem ? 'Saving...' : editingItem ? 'Save Changes' : 'Create Track'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Log Study Session Modal */}
      <Modal
        isOpen={isLogModalOpen}
        onClose={() => setIsLogModalOpen(false)}
        title="Log Study Session"
        maxWidth="500px"
      >
        <form onSubmit={handleSubmitLog} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Subject / Topic Studied *</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Java Multithreading"
              value={logFormData.subjectOrTopic}
              onChange={(e) => setLogFormData((p) => ({ ...p, subjectOrTopic: e.target.value }))}
              required
            />
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Hours Studied *</label>
              <input
                type="number"
                step="0.5"
                min="0.1"
                className="form-input"
                value={logFormData.hoursStudied}
                onChange={(e) => setLogFormData((p) => ({ ...p, hoursStudied: e.target.value }))}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Date</label>
              <input
                type="date"
                className="form-input"
                value={logFormData.date}
                onChange={(e) => setLogFormData((p) => ({ ...p, date: e.target.value }))}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Linked Learning Track</label>
            <select
              className="form-select"
              value={logFormData.learningItemId}
              onChange={(e) => setLogFormData((p) => ({ ...p, learningItemId: e.target.value }))}
            >
              <option value="">-- General / Independent --</option>
              {items.map((i) => (
                <option key={i._id} value={i._id}>{i.title}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Key Topics Completed (comma separated)</label>
            <input
              type="text"
              className="form-input"
              placeholder="Thread pools, Condition variables"
              value={logFormData.topicsCompleted}
              onChange={(e) => setLogFormData((p) => ({ ...p, topicsCompleted: e.target.value }))}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Notes / Reflection</label>
            <textarea
              className="form-textarea"
              rows={2}
              value={logFormData.notes}
              onChange={(e) => setLogFormData((p) => ({ ...p, notes: e.target.value }))}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setIsLogModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={savingLog}>
              {savingLog ? 'Saving...' : 'Save Study Log'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteItem}
        title="Delete Learning Track"
        message={`Are you sure you want to delete ${deleteTarget?.title}?`}
        loading={deleting}
      />
    </div>
  );
};
