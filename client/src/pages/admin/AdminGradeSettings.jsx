import React, { useState, useEffect } from 'react';
import { Sliders, Save, Plus, Trash2, RefreshCw } from 'lucide-react';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { Skeleton } from '../../components/Skeleton';

export const AdminGradeSettings = () => {
  const [mappings, setMappings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { addToast } = useToast();

  const fetchGrades = async () => {
    try {
      const res = await api.courses.getGradesConfig();
      if (res.success) setMappings(res.data);
    } catch (err) {
      addToast('Failed to load grade mappings', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGrades();
  }, []);

  const handleFieldChange = (index, field, value) => {
    setMappings((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleAddRow = () => {
    setMappings((prev) => [
      ...prev,
      { grade: '', point: 0, description: '' },
    ]);
  };

  const handleRemoveRow = (index) => {
    setMappings((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const formatted = mappings.map((m) => ({
        grade: m.grade.toUpperCase().trim(),
        point: Number(m.point),
        description: m.description || '',
      }));

      const res = await api.courses.updateGradesConfig(formatted);
      if (res.success) {
        setMappings(res.data);
        addToast('Grade mappings saved and existing courses synchronized!', 'success');
      }
    } catch (err) {
      addToast(err.message || 'Failed to save grade configuration', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Skeleton height={250} />;
  }

  return (
    <div className="card" style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem' }}>Academic Grade Point (GPA) Configuration</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Configure institutional letter-grade to grade-point multiplier mappings (e.g. S → 10, A → 9)
          </p>
        </div>

        <button type="button" className="btn btn-secondary btn-sm" onClick={handleAddRow}>
          <Plus size={14} /> Add Grade Row
        </button>
      </div>

      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th style={{ width: '120px' }}>Letter Grade</th>
                <th style={{ width: '140px' }}>Grade Point (0-10)</th>
                <th>Standard Description / Tier</th>
                <th style={{ width: '80px', textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {mappings.map((row, idx) => (
                <tr key={idx}>
                  <td>
                    <input
                      type="text"
                      className="form-input"
                      value={row.grade}
                      placeholder="e.g. S"
                      onChange={(e) => handleFieldChange(idx, 'grade', e.target.value)}
                      required
                      style={{ fontWeight: 700, textTransform: 'uppercase' }}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="10"
                      className="form-input"
                      value={row.point}
                      onChange={(e) => handleFieldChange(idx, 'point', e.target.value)}
                      required
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      className="form-input"
                      value={row.description || ''}
                      placeholder="e.g. Outstanding / Exceptional"
                      onChange={(e) => handleFieldChange(idx, 'description', e.target.value)}
                    />
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button
                      type="button"
                      className="btn-danger btn-sm"
                      onClick={() => handleRemoveRow(idx)}
                      disabled={mappings.length <= 1}
                    >
                      <Trash2 size={13} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            <Save size={16} />
            <span>{saving ? 'Synchronizing Courses...' : 'Save & Synchronize All Courses'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
