import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Library, Upload, ExternalLink } from 'lucide-react';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { Modal } from '../../components/Modal';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { Skeleton } from '../../components/Skeleton';

const RESOURCE_TYPES = [
  'PDF',
  'Notes',
  'Document',
  'GitHub Repository',
  'Website',
  'Video',
  'Presentation',
  'Image',
  'Other',
];

const EMPTY_RES = {
  title: '',
  courseId: '',
  subject: '',
  type: 'PDF',
  semester: '',
  topic: '',
  fileUrl: '',
  externalUrl: '',
  description: '',
  isPublic: true,
};

export const AdminResources = () => {
  const [resources, setResources] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRes, setEditingRes] = useState(null);
  const [formData, setFormData] = useState(EMPTY_RES);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const { addToast } = useToast();

  const fetchData = async () => {
    try {
      const [resData, courseData] = await Promise.all([
        api.resources.list(),
        api.courses.list(),
      ]);
      if (resData.success) setResources(resData.data);
      if (courseData.success) setCourses(courseData.data);
    } catch (err) {
      addToast('Failed to load resources', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenAdd = () => {
    setEditingRes(null);
    setFormData(EMPTY_RES);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (res) => {
    setEditingRes(res);
    setFormData({
      ...res,
      courseId: res.courseId?._id || res.courseId || '',
    });
    setIsModalOpen(true);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const res = await api.upload(file);
      if (res.success) {
        setFormData((prev) => ({
          ...prev,
          fileUrl: res.data.fileUrl,
          originalFileName: res.data.originalName,
          fileSize: res.data.size,
          mimeType: res.data.mimeType,
        }));
        addToast('File uploaded successfully', 'success');
      }
    } catch (err) {
      addToast(err.message || 'File upload failed', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      ...formData,
      courseId: formData.courseId || null,
    };

    try {
      if (editingRes) {
        await api.resources.update(editingRes._id, payload);
        addToast(`Resource updated`, 'success');
      } else {
        await api.resources.create(payload);
        addToast(`Resource created`, 'success');
      }
      setIsModalOpen(false);
      fetchData();
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
      await api.resources.delete(deleteTarget._id);
      addToast(`Resource deleted`, 'success');
      setDeleteTarget(null);
      fetchData();
    } catch (err) {
      addToast(err.message || 'Failed to delete resource', 'error');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem' }}>Resource Library Management</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Upload PDFs, documents, lecture notes, or attach external links
          </p>
        </div>
        <button className="btn btn-primary" onClick={handleOpenAdd}>
          <Plus size={16} /> Add Resource
        </button>
      </div>

      {loading ? (
        <Skeleton height={250} />
      ) : (
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Type</th>
                <th>Subject / Topic</th>
                <th>Linked Course</th>
                <th>Location</th>
                <th>Visibility</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {resources.map((res) => (
                <tr key={res._id}>
                  <td style={{ fontWeight: 600 }}>{res.title}</td>
                  <td><span className="badge badge-neutral" style={{ fontSize: '0.7rem' }}>{res.type}</span></td>
                  <td>{res.subject || '—'} {res.topic && `(${res.topic})`}</td>
                  <td>{res.courseId ? res.courseId.code || res.courseId.name : '—'}</td>
                  <td>
                    {res.fileUrl ? (
                      <span className="badge badge-info" style={{ fontSize: '0.65rem' }}>File Upload</span>
                    ) : res.externalUrl ? (
                      <span className="badge badge-neutral" style={{ fontSize: '0.65rem' }}>Web Link</span>
                    ) : '—'}
                  </td>
                  <td>
                    <span className={`badge ${res.isPublic ? 'badge-success' : 'badge-neutral'}`} style={{ fontSize: '0.65rem' }}>
                      {res.isPublic ? 'Public' : 'Private'}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                      <button className="btn-outline btn-sm" onClick={() => handleOpenEdit(res)} title="Edit">
                        <Edit2 size={13} />
                      </button>
                      <button className="btn-danger btn-sm" onClick={() => setDeleteTarget(res)} title="Delete">
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
        title={editingRes ? 'Edit Resource' : 'Add New Resource'}
        maxWidth="680px"
      >
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Resource Title *</label>
            <input
              type="text"
              name="title"
              className="form-input"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Resource Type</label>
              <select
                name="type"
                className="form-select"
                value={formData.type}
                onChange={handleChange}
              >
                {RESOURCE_TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Link to Course</label>
              <select
                name="courseId"
                className="form-select"
                value={formData.courseId}
                onChange={handleChange}
              >
                <option value="">-- Standalone Resource --</option>
                {courses.map((c) => (
                  <option key={c._id} value={c._id}>{c.code}: {c.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Subject / Discipline</label>
              <input
                type="text"
                name="subject"
                className="form-input"
                placeholder="e.g. Machine Learning"
                value={formData.subject}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Topic / Unit</label>
              <input
                type="text"
                name="topic"
                className="form-input"
                placeholder="e.g. Unit 2: Decision Trees"
                value={formData.topic}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Upload or Link */}
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Upload Local Document / PDF</label>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <input
                  type="text"
                  name="fileUrl"
                  className="form-input"
                  placeholder="Uploaded Path"
                  value={formData.fileUrl}
                  onChange={handleChange}
                  style={{ flex: 1 }}
                />
                <label className="btn btn-secondary btn-sm" style={{ cursor: 'pointer', whiteSpace: 'nowrap' }}>
                  <Upload size={14} /> {uploading ? 'Uploading...' : 'Upload'}
                  <input
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg,.webp,.doc,.docx,.ppt,.pptx,.txt"
                    onChange={handleFileUpload}
                    style={{ display: 'none' }}
                    disabled={uploading}
                  />
                </label>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Or External URL / Repo Link</label>
              <input
                type="url"
                name="externalUrl"
                className="form-input"
                placeholder="https://github.com/..."
                value={formData.externalUrl}
                onChange={handleChange}
              />
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
              {saving ? 'Saving...' : editingRes ? 'Save Resource' : 'Create Resource'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Resource"
        message={`Are you sure you want to delete ${deleteTarget?.title}?`}
        loading={deleting}
      />
    </div>
  );
};
