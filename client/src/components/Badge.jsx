import React from 'react';

export const Badge = ({ children, variant = 'neutral', size = 'md' }) => {
  let badgeClass = 'badge-neutral';

  const lower = String(children || variant).toLowerCase();

  if (['completed', 'expert', 'high', 'very high', 'success', 's', 'a'].includes(lower)) {
    badgeClass = 'badge-success';
  } else if (['currently learning', 'in progress', 'intermediate', 'medium', 'warning', 'b', 'c'].includes(lower)) {
    badgeClass = 'badge-warning';
  } else if (['not completed', 'dropped', 'low', 'danger', 'f'].includes(lower)) {
    badgeClass = 'badge-danger';
  } else if (['planned', 'learning', 'beginner', 'info', 'd', 'e'].includes(lower)) {
    badgeClass = 'badge-info';
  }

  if (variant === 'success') badgeClass = 'badge-success';
  if (variant === 'warning') badgeClass = 'badge-warning';
  if (variant === 'danger') badgeClass = 'badge-danger';
  if (variant === 'info') badgeClass = 'badge-info';
  if (variant === 'neutral') badgeClass = 'badge-neutral';

  return (
    <span className={`badge ${badgeClass}`} style={size === 'sm' ? { fontSize: '0.7rem', padding: '0.15rem 0.5rem' } : {}}>
      {children}
    </span>
  );
};
