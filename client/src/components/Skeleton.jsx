import React from 'react';

export const Skeleton = ({ height = 24, width = '100%', borderRadius, style }) => {
  return (
    <div
      className="skeleton"
      style={{
        height: typeof height === 'number' ? `${height}px` : height,
        width: typeof width === 'number' ? `${width}px` : width,
        borderRadius: borderRadius || 'var(--radius-md)',
        marginBottom: '0.75rem',
        ...style,
      }}
    />
  );
};
