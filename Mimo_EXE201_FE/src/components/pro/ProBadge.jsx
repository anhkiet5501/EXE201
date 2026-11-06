import React from 'react';

/** Huy hiệu vương miện dành cho thành viên Mimo Pro. */
export default function ProBadge({ size = 'md', label = 'PRO', title = 'Thành viên Mimo Pro' }) {
  const small = size === 'sm';
  return (
    <span
      title={title}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: small ? '2px' : '4px',
        padding: small ? '1px 6px' : '3px 10px',
        borderRadius: '999px',
        background: 'linear-gradient(135deg, #F59E0B, #D97706)',
        color: '#FFFFFF',
        fontSize: small ? '10px' : '11.5px',
        fontWeight: 900,
        letterSpacing: '0.4px',
        boxShadow: '0 2px 6px rgba(217, 119, 6, 0.35)',
        verticalAlign: 'middle',
        whiteSpace: 'nowrap',
      }}
    >
      <span>👑</span>
      <span>{label}</span>
    </span>
  );
}
