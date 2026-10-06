import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Flame,
  Clock,
  Calendar,
  CheckCircle2,
  Circle,
  Download,
  Plus,
  ArrowRight,
  BookOpen,
} from 'lucide-react';
import { api } from '../services/api';
import { Skeleton } from '../components/Skeleton';
import { EmptyState } from '../components/EmptyState';
import { Badge } from '../components/Badge';
import { ProgressBar } from '../components/ProgressBar';

export const LearningProgress = () => {
  const [items, setItems] = useState([]);
  const [stats, setStats] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [itemsRes, statsRes, logsRes] = await Promise.all([
          api.learning.list(),
          api.learning.getStats(),
          api.learning.getLogs(),
        ]);
        if (itemsRes.success) setItems(itemsRes.data);
        if (statsRes.success) setStats(statsRes.data);
        if (logsRes.success) setLogs(logsRes.data);
      } catch (err) {
        console.error('Failed to load learning data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <Skeleton height={120} style={{ marginBottom: '1.5rem' }} />
        <Skeleton height={250} />
      </div>
    );
  }

  const filteredItems = items.filter((item) => {
    return statusFilter === 'All' || item.status === statusFilter;
  });

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>Learning Progress & Roadmaps</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Active subjects, curriculum roadmaps, target milestones, and dedicated study time logs
          </p>
        </div>

        <a
          href={api.export.getLearningCsvUrl()}
          download="learning-progress.csv"
          className="btn btn-outline btn-sm"
        >
          <Download size={14} /> Export CSV
        </a>
      </div>

      {/* Analytics & Streak Strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>LEARNING STREAK</span>
            <Flame size={20} color="#ea580c" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: '#ea580c' }} className="font-mono">
            {stats?.streak || 0} Days
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Consecutive study sessions</span>
        </div>

        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>THIS WEEK STUDY</span>
            <Clock size={20} color="var(--accent-primary)" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 700 }} className="font-mono">
            {stats?.weekHours || 0} Hours
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--status-success-text)' }}>Logged this week</span>
        </div>

        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>THIS MONTH STUDY</span>
            <Calendar size={20} color="#059669" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 700 }} className="font-mono">
            {stats?.monthHours || 0} Hours
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Total for current month</span>
        </div>

        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>AVG PROGRESS</span>
            <TrendingUp size={20} color="#7c3aed" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: '#7c3aed' }} className="font-mono">
            {stats?.avgProgress || 0}%
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Across active curricula</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        {['All', 'Learning', 'Completed', 'Not Started', 'Paused'].map((status) => (
          <button
            key={status}
            className={`btn btn-sm ${statusFilter === status ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setStatusFilter(status)}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Learning Items Grid */}
      {filteredItems.length === 0 ? (
        <EmptyState
          icon={TrendingUp}
          title="No Learning Items Found"
          description="No learning tracks found under the selected filter."
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          {filteredItems.map((item) => (
            <div key={item._id} className="card" style={{ padding: '1.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                    <span className="badge badge-neutral" style={{ fontSize: '0.7rem' }}>{item.category}</span>
                    <span className="badge badge-info" style={{ fontSize: '0.7rem' }}>Priority: {item.priority}</span>
                  </div>
                  <h2 style={{ fontSize: '1.35rem', fontWeight: 600 }}>{item.title}</h2>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Badge>{item.status}</Badge>
                </div>
              </div>

              {item.description && (
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                  {item.description}
                </p>
              )}

              {/* Progress & Hours Bar */}
              <div style={{ marginBottom: '1.25rem' }}>
                <ProgressBar
                  value={item.currentProgress}
                  max={100}
                  label={`Progress: ${item.currentProgress}%`}
                  height={9}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.35rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  <span>
                    Study Time: <strong className="font-mono">{item.hoursCompleted}</strong> / {item.totalEstimatedHours} Hours
                  </span>
                  <span>
                    Level: <strong style={{ color: 'var(--text-primary)' }}>{item.currentLevel}</strong> → Target: <strong style={{ color: 'var(--accent-text)' }}>{item.targetLevel}</strong>
                  </span>
                </div>
              </div>

              {/* Learning Roadmap Steps */}
              {item.roadmap && item.roadmap.length > 0 && (
                <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1.25rem', marginTop: '1rem' }}>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <BookOpen size={15} color="var(--accent-primary)" /> Roadmap Progression
                  </h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.625rem' }}>
                    {item.roadmap.map((step, idx) => (
                      <div
                        key={idx}
                        style={{
                          padding: '0.6rem 0.8rem',
                          background: 'var(--bg-secondary)',
                          borderRadius: 'var(--radius-md)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.6rem',
                        }}
                      >
                        {step.status === 'Completed' ? (
                          <CheckCircle2 size={16} color="#059669" />
                        ) : (
                          <Circle size={16} color="var(--text-muted)" />
                        )}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: '0.85rem', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {step.topic}
                          </div>
                          {step.notes && (
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{step.notes}</div>
                          )}
                        </div>
                        <span className="badge badge-neutral" style={{ fontSize: '0.65rem' }}>{step.status}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {item.notes && (
                <div style={{ marginTop: '1rem', fontSize: '0.85rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                  Notes: {item.notes}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Daily / Weekly Progress Log */}
      <div className="card">
        <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Clock size={18} color="var(--accent-primary)" /> Recent Daily Study Sessions
        </h3>

        {logs.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No study logs recorded yet.</p>
        ) : (
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Topic / Subject Studied</th>
                  <th>Hours</th>
                  <th>Key Topics Completed</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                {logs.slice(0, 10).map((log) => (
                  <tr key={log._id}>
                    <td style={{ whiteSpace: 'nowrap', fontSize: '0.85rem' }}>
                      {new Date(log.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td style={{ fontWeight: 600 }}>{log.subjectOrTopic}</td>
                    <td className="font-mono" style={{ fontWeight: 600, color: 'var(--accent-text)' }}>
                      {log.hoursStudied}h
                    </td>
                    <td>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                        {log.topicsCompleted?.map((t, idx) => (
                          <span key={idx} className="badge badge-neutral" style={{ fontSize: '0.65rem' }}>{t}</span>
                        ))}
                      </div>
                    </td>
                    <td style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      {log.notes || '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
