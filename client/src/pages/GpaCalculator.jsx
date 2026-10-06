import React, { useState, useEffect } from 'react';
import { Calculator, Award, BookOpen, Sparkles, RefreshCw } from 'lucide-react';
import { api } from '../services/api';
import { Skeleton } from '../components/Skeleton';

export const GpaCalculator = () => {
  const [courses, setCourses] = useState([]);
  const [stats, setStats] = useState(null);
  const [gradeConfig, setGradeConfig] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedSemester, setSelectedSemester] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Simulation state
  const [simTargetCredits, setSimTargetCredits] = useState(20);
  const [simExpectedGradePoint, setSimExpectedGradePoint] = useState(9.5);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cRes, sRes, gRes] = await Promise.all([
          api.courses.list(),
          api.courses.getStats(),
          api.courses.getGradesConfig(),
        ]);
        if (cRes.success) setCourses(cRes.data);
        if (sRes.success) setStats(sRes.data);
        if (gRes.success) setGradeConfig(gRes.data);
      } catch (err) {
        console.error('Failed to load GPA data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <Skeleton height={150} style={{ marginBottom: '1.5rem' }} />
        <Skeleton height={300} />
      </div>
    );
  }

  // Filter courses for live calculation
  const filteredCourses = courses.filter((c) => {
    const semMatch = selectedSemester === 'All' || c.semester === selectedSemester;
    const catMatch = selectedCategory === 'All' || c.category === selectedCategory;
    return semMatch && catMatch;
  });

  // Calculate GPA for the selected subset
  let subsetCredits = 0;
  let subsetEarnedPoints = 0;
  filteredCourses.forEach((c) => {
    if (c.status === 'Completed' && c.gradePoint !== null && c.gradePoint !== undefined) {
      const cr = Number(c.credits) || 0;
      subsetCredits += cr;
      subsetEarnedPoints += cr * Number(c.gradePoint);
    }
  });

  const subsetGPA = subsetCredits > 0 ? (subsetEarnedPoints / subsetCredits).toFixed(2) : '0.00';

  // What-if projected CGPA calculation:
  // Current earned total points = stats.cgpa * stats.completedCredits
  const currentTotalEarned = (stats?.cgpa || 0) * (stats?.completedCredits || 0);
  const projectedTotalCredits = (stats?.completedCredits || 0) + Number(simTargetCredits);
  const projectedEarnedPoints = currentTotalEarned + (Number(simTargetCredits) * Number(simExpectedGradePoint));
  const projectedCGPA = projectedTotalCredits > 0 ? (projectedEarnedPoints / projectedTotalCredits).toFixed(2) : '0.00';

  const distinctSemesters = ['All', ...new Set(courses.map((c) => c.semester).filter(Boolean))];
  const distinctCategories = ['All', ...new Set(courses.map((c) => c.category).filter(Boolean))];

  return (
    <div style={{ maxWidth: '1050px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>GPA & CGPA Academic Calculator</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Formula: <span className="font-mono" style={{ background: 'var(--bg-secondary)', padding: '0.15rem 0.4rem', borderRadius: '4px' }}>GPA = Σ(Credit × Grade Point) / Σ(Credits)</span>
        </p>
      </div>

      {/* Main Metrics Strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
        <div className="card" style={{ padding: '1.25rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>CUMULATIVE CGPA</span>
          <div style={{ fontSize: '2.2rem', fontWeight: 700, color: 'var(--accent-primary)' }} className="font-mono">
            {stats?.cgpa ? stats.cgpa.toFixed(2) : '0.00'}
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Overall Academic Standing</span>
        </div>

        <div className="card" style={{ padding: '1.25rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>TOTAL PROGRAM CREDITS</span>
          <div style={{ fontSize: '2.2rem', fontWeight: 700 }} className="font-mono">
            {stats?.totalCredits || 0}
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Across All Enrolled Courses</span>
        </div>

        <div className="card" style={{ padding: '1.25rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>COMPLETED CREDITS</span>
          <div style={{ fontSize: '2.2rem', fontWeight: 700, color: 'var(--status-success-text)' }} className="font-mono">
            {stats?.completedCredits || 0}
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Graded & Successfully Passed</span>
        </div>

        <div className="card" style={{ padding: '1.25rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>REMAINING CREDITS</span>
          <div style={{ fontSize: '2.2rem', fontWeight: 700, color: 'var(--status-warning-text)' }} className="font-mono">
            {stats?.remainingCredits || 0}
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>In-Progress & Planned</span>
        </div>
      </div>

      {/* Filtered Subset Calculator */}
      <div className="card">
        <div className="card-header">
          <div>
            <h3 style={{ fontSize: '1.15rem' }}>Sub-Group Performance Analysis</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Filter by specific semester or category to examine modular GPA
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Selected Subset GPA</span>
            <div className="font-mono" style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--accent-text)' }}>
              {subsetGPA}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
          <div style={{ flex: 1, minWidth: '180px' }}>
            <label className="form-label">Filter by Semester</label>
            <select
              className="form-select"
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
            >
              {distinctSemesters.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div style={{ flex: 1, minWidth: '180px' }}>
            <label className="form-label">Filter by Category</label>
            <select
              className="form-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {distinctCategories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Course</th>
                <th>Credits (C)</th>
                <th>Grade</th>
                <th>Grade Point (G)</th>
                <th>Credit × Point</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredCourses.map((c) => (
                <tr key={c._id}>
                  <td style={{ fontWeight: 600 }}>{c.code}: {c.name}</td>
                  <td className="font-mono">{c.credits}</td>
                  <td>
                    {c.grade ? (
                      <span className="badge badge-success font-mono">{c.grade}</span>
                    ) : (
                      '—'
                    )}
                  </td>
                  <td className="font-mono">{c.gradePoint !== null && c.gradePoint !== undefined ? c.gradePoint : '—'}</td>
                  <td className="font-mono">
                    {c.status === 'Completed' && c.gradePoint !== null
                      ? (c.credits * c.gradePoint).toFixed(1)
                      : '—'}
                  </td>
                  <td>
                    <span className="badge badge-neutral" style={{ fontSize: '0.7rem' }}>{c.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Semester Breakdown Table */}
      {stats?.semesterAnalytics && stats.semesterAnalytics.length > 0 && (
        <div className="card">
          <h3 style={{ fontSize: '1.15rem', marginBottom: '1rem' }}>Semester-by-Semester GPA Breakdown</h3>
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Semester</th>
                  <th>Total Courses</th>
                  <th>Total Credits</th>
                  <th>Completed Credits</th>
                  <th>Semester GPA</th>
                </tr>
              </thead>
              <tbody>
                {stats.semesterAnalytics.map((sem, idx) => (
                  <tr key={idx}>
                    <td style={{ fontWeight: 600 }}>{sem.semester}</td>
                    <td className="font-mono">{sem.coursesCount}</td>
                    <td className="font-mono">{sem.totalCredits}</td>
                    <td className="font-mono">{sem.completedCredits}</td>
                    <td>
                      <span className="badge badge-info font-mono" style={{ fontSize: '0.85rem', fontWeight: 700 }}>
                        {sem.gpa}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* What-If Projected CGPA Simulator */}
      <div className="card" style={{ background: 'linear-gradient(135deg, var(--bg-surface) 0%, var(--bg-secondary) 100%)' }}>
        <div className="card-header">
          <div>
            <h3 style={{ fontSize: '1.15rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sparkles size={18} color="var(--accent-primary)" /> Projected "What-If" CGPA Simulator
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Simulate prospective performance on future credits to forecast your graduation CGPA
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Projected CGPA</span>
            <div className="font-mono" style={{ fontSize: '2rem', fontWeight: 700, color: '#059669' }}>
              {projectedCGPA}
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
          <div>
            <label className="form-label">Upcoming Simulated Credits</label>
            <input
              type="number"
              className="form-input"
              value={simTargetCredits}
              min="1"
              max="160"
              onChange={(e) => setSimTargetCredits(Number(e.target.value))}
            />
          </div>

          <div>
            <label className="form-label">Expected Average Grade Point (out of 10.0)</label>
            <input
              type="number"
              step="0.1"
              className="form-input"
              value={simExpectedGradePoint}
              min="0"
              max="10"
              onChange={(e) => setSimExpectedGradePoint(Number(e.target.value))}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
