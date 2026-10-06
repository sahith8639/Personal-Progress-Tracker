import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Filter,
  Download,
  Search,
  ChevronRight,
  Calculator,
  User,
  GraduationCap,
} from 'lucide-react';
import { api } from '../services/api';
import { Skeleton } from '../components/Skeleton';
import { EmptyState } from '../components/EmptyState';
import { Badge } from '../components/Badge';

export const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [semesterFilter, setSemesterFilter] = useState('All');

  useEffect(() => {
    const fetchCoursesAndStats = async () => {
      try {
        const [cRes, sRes] = await Promise.all([
          api.courses.list(),
          api.courses.getStats(),
        ]);
        if (cRes.success) setCourses(cRes.data);
        if (sRes.success) setStats(sRes.data);
      } catch (err) {
        console.error('Failed to load courses:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCoursesAndStats();
  }, []);

  if (loading) {
    return (
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <Skeleton height={100} style={{ marginBottom: '1.5rem' }} />
        <Skeleton height={350} />
      </div>
    );
  }

  // Get distinct semesters
  const semesters = ['All', ...new Set(courses.map((c) => c.semester).filter(Boolean))];

  const filteredCourses = courses.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.code.toLowerCase().includes(search.toLowerCase()) ||
      (c.instructor && c.instructor.toLowerCase().includes(search.toLowerCase()));

    const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
    const matchesSemester = semesterFilter === 'All' || c.semester === semesterFilter;

    return matchesSearch && matchesStatus && matchesSemester;
  });

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>Academic Course Database</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Comprehensive course enrollment, syllabus, grades, credits, and linked study resources
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link to="/gpa-calculator" className="btn btn-secondary btn-sm">
            <Calculator size={15} /> GPA Calculator
          </Link>
          <a
            href={api.export.getCoursesCsvUrl()}
            download="academic-courses.csv"
            className="btn btn-outline btn-sm"
          >
            <Download size={15} /> Export CSV
          </a>
        </div>
      </div>

      {/* Metrics Summary Strip */}
      {stats && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
          <div className="card" style={{ padding: '1rem 1.25rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>TOTAL COURSES</span>
            <div style={{ fontSize: '1.6rem', fontWeight: 700 }} className="font-mono">{stats.totalCourses}</div>
          </div>
          <div className="card" style={{ padding: '1rem 1.25rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>COMPLETED</span>
            <div style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--status-success-text)' }} className="font-mono">
              {stats.statusCounts['Completed'] || 0}
            </div>
          </div>
          <div className="card" style={{ padding: '1rem 1.25rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>CURRENTLY LEARNING</span>
            <div style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--status-warning-text)' }} className="font-mono">
              {stats.statusCounts['Currently Learning'] || 0}
            </div>
          </div>
          <div className="card" style={{ padding: '1rem 1.25rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>TOTAL CREDITS</span>
            <div style={{ fontSize: '1.6rem', fontWeight: 700 }} className="font-mono">
              {stats.completedCredits} / {stats.totalCredits}
            </div>
          </div>
          <div className="card" style={{ padding: '1rem 1.25rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>CUMULATIVE CGPA</span>
            <div style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--accent-primary)' }} className="font-mono">
              {stats.cgpa ? stats.cgpa.toFixed(2) : '0.00'}
            </div>
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="card" style={{ padding: '1rem 1.25rem' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
          <div style={{ flex: 1, minWidth: '240px', position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              className="form-input"
              placeholder="Search course name, code, or instructor..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ paddingLeft: '2.4rem' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <select
              className="form-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ minWidth: '150px' }}
            >
              <option value="All">All Statuses</option>
              <option value="Completed">Completed</option>
              <option value="Currently Learning">Currently Learning</option>
              <option value="Not Completed">Not Completed</option>
              <option value="Planned">Planned</option>
              <option value="Dropped">Dropped</option>
            </select>

            <select
              className="form-select"
              value={semesterFilter}
              onChange={(e) => setSemesterFilter(e.target.value)}
              style={{ minWidth: '140px' }}
            >
              {semesters.map((sem) => (
                <option key={sem} value={sem}>
                  {sem === 'All' ? 'All Semesters' : sem}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Courses List */}
      {filteredCourses.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No Courses Match Your Filter"
          description="Try adjusting your search query, status, or semester filter."
        />
      ) : (
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Course</th>
                <th>Code</th>
                <th>Semester</th>
                <th>Credits</th>
                <th>Grade</th>
                <th>Grade Point</th>
                <th>Status</th>
                <th>Instructor</th>
                <th style={{ textAlign: 'right' }}>Details</th>
              </tr>
            </thead>
            <tbody>
              {filteredCourses.map((c) => (
                <tr key={c._id}>
                  <td>
                    <Link
                      to={`/courses/${c._id}`}
                      style={{ fontWeight: 600, color: 'var(--accent-text)', display: 'block' }}
                    >
                      {c.name}
                    </Link>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{c.category}</span>
                  </td>
                  <td className="font-mono" style={{ fontWeight: 600 }}>{c.code}</td>
                  <td>{c.semester}</td>
                  <td className="font-mono">{c.credits}</td>
                  <td>
                    {c.grade ? (
                      <span className="badge badge-success font-mono" style={{ fontWeight: 700 }}>
                        {c.grade}
                      </span>
                    ) : (
                      <span style={{ color: 'var(--text-muted)' }}>—</span>
                    )}
                  </td>
                  <td className="font-mono">
                    {c.gradePoint !== null && c.gradePoint !== undefined ? c.gradePoint : '—'}
                  </td>
                  <td>
                    <Badge>{c.status}</Badge>
                  </td>
                  <td>
                    {c.instructor ? (
                      <span style={{ fontSize: '0.85rem' }}>{c.instructor}</span>
                    ) : (
                      <span style={{ color: 'var(--text-muted)' }}>—</span>
                    )}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <Link to={`/courses/${c._id}`} className="btn btn-outline btn-sm">
                      <span>View</span>
                      <ChevronRight size={14} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
