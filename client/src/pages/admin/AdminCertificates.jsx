import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Award, Upload } from 'lucide-react';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { Modal } from '../../components/Modal';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { Skeleton } from '../../components/Skeleton';

const EMPTY_CERT = {
  name: '',
  issuingOrganization: '',
  issueDate: '',
  credentialId: '',
  credentialUrl: '',
  category: 'AI & Data Science',
  description: '',
  fileUrl: '',
  skills: [],
  courseId: '',
  isPublic: true,
};

export const AdminCertificates = () => {
  const [certs, setCerts] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCert, setEditingCert] = useState(null);
  const [formData, setFormData] = useState(EMPTY_CERT);
  const [skillsText, setSkillsText] = useState('');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const { addToast } = useToast();

  const fetchData = async () => {
    try {
      const [certRes, courseRes] = await Promise.all([
        api.certificates.list(),
        api.courses.list(),
      ]);
      if (certRes.success) setCerts(certRes.data);
      if (courseRes.success) setCourses(courseRes.data);
    } catch (err) {
      addToast('Failed to load certificates', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenAdd = () => {
    setEditingCert(null);
    setFormData(EMPTY_CERT);
    setSkillsText('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cert) => {
    setEditingCert(cert);
    setFormData({
      ...cert,
      courseId: cert.courseId?._id || cert.courseId || '',
    });
    setSkillsText((cert.skills || []).join(', '));
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
        setFormData((prev) => ({ ...prev, fileUrl: res.data.fileUrl }));
        addToast('Certificate file uploaded', 'success');
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
      skills: skillsText
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
    };

    try {
      if (editingCert) {
        await api.certificates.update(editingCert._id, payload);
        addToast(`Updated certificate ${formData.name}`, 'success');
      } else {
        await api.certificates.create(payload);
        addToast(`Added certificate ${formData.name}`, 'success');
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
      await api.certificates.delete(deleteTarget._id);
      addToast(`Certificate deleted`, 'success');
      setDeleteTarget(null);
      fetchData();
    } catch (err) {
      addToast(err.message || 'Failed to delete certificate', 'error');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem' }}>Certificates Management</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Upload accreditation documents and link to academic coursework
          </p>
        </div>
        <button className="btn btn-primary" onClick={handleOpenAdd}>
          <Plus size={16} /> Add Certificate
        </button>
      </div>

      {loading ? (
        <Skeleton height={250} />
      ) : (
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Certificate</th>
                <th>Issuer</th>
                <th>Issue Date</th>
                <th>Credential ID</th>
                <th>Linked Course</th>
                <th>Visibility</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {certs.map((cert) => (
                <tr key={cert._id}>
                  <td style={{ fontWeight: 600 }}>{cert.name}</td>
                  <td>{cert.issuingOrganization}</td>
                  <td>{cert.issueDate}</td>
                  <td className="font-mono">{cert.credentialId || '—'}</td>
                  <td>{cert.courseId ? cert.courseId.code || cert.courseId.name : '—'}</td>
                  <td>
                    <span className={`badge ${cert.isPublic ? 'badge-success' : 'badge-neutral'}`} style={{ fontSize: '0.65rem' }}>
                      {cert.isPublic ? 'Public' : 'Private'}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                      <button className="btn-outline btn-sm" onClick={() => handleOpenEdit(cert)} title="Edit">
                        <Edit2 size={13} />
                      </button>
                      <button className="btn-danger btn-sm" onClick={() => setDeleteTarget(cert)} title="Delete">
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
        title={editingCert ? 'Edit Certificate' : 'Add New Certificate'}
        maxWidth="680px"
      >
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Certificate Name *</label>
              <input
                type="text"
                name="name"
                className="form-input"
                placeholder="e.g. Machine Learning Specialization"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Issuing Organization *</label>
              <input
                type="text"
                name="issuingOrganization"
                className="form-input"
                placeholder="e.g. DeepLearning.AI / Stanford"
                value={formData.issuingOrganization}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Issue Date / Year</label>
              <input
                type="text"
                name="issueDate"
                className="form-input"
                placeholder="2025"
                value={formData.issueDate}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Category</label>
              <input
                type="text"
                name="category"
                className="form-input"
                placeholder="AI / Data Science / Web"
                value={formData.category}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Credential ID</label>
              <input
                type="text"
                name="credentialId"
                className="form-input"
                placeholder="ABC123XYZ"
                value={formData.credentialId}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Credential Verification URL</label>
              <input
                type="url"
                name="credentialUrl"
                className="form-input"
                placeholder="https://coursera.org/verify/..."
                value={formData.credentialUrl}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Linked Academic Course</label>
              <select
                name="courseId"
                className="form-select"
                value={formData.courseId}
                onChange={handleChange}
              >
                <option value="">-- No Course Linked --</option>
                {courses.map((c) => (
                  <option key={c._id} value={c._id}>{c.code}: {c.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Certificate Document / Image File</label>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <input
                  type="text"
                  name="fileUrl"
                  className="form-input"
                  placeholder="URL or Uploaded Path"
                  value={formData.fileUrl}
                  onChange={handleChange}
                  style={{ flex: 1 }}
                />
                <label className="btn btn-secondary btn-sm" style={{ cursor: 'pointer', whiteSpace: 'nowrap' }}>
                  <Upload size={14} /> {uploading ? 'Uploading...' : 'Upload'}
                  <input
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg,.webp"
                    onChange={handleFileUpload}
                    style={{ display: 'none' }}
                    disabled={uploading}
                  />
                </label>
              </div>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Validated Skills (comma separated)</label>
            <input
              type="text"
              className="form-input"
              placeholder="Machine Learning, Python, Scikit-learn"
              value={skillsText}
              onChange={(e) => setSkillsText(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description / Scope</label>
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
              {saving ? 'Saving...' : editingCert ? 'Save Changes' : 'Create Certificate'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Certificate"
        message={`Are you sure you want to delete ${deleteTarget?.name}?`}
        loading={deleting}
      />
    </div>
  );
};
