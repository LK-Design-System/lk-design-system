import React from 'react';

/**
 * LK ROBOTICS — ReorderList
 * Drag-to-reorder rows with a grip handle and a sequence badge (task steps,
 * pipeline stages). Items are {id, label, detail}. HTML5 drag-and-drop;
 * `onReorder(nextIds)` fires on drop. Controlled (`items`) list, order held by
 * the host. Keyboard: focus a row and use Alt+↑/↓ to move it.
 */
export function ReorderList({ items = [], onReorder, style, ...rest }) {
  const [dragId, setDragId] = React.useState(null);
  const ids = items.map((i) => i.id);

  const move = (from, to) => {
    if (to < 0 || to >= ids.length || from === to) return;
    const next = ids.slice();
    next.splice(to, 0, next.splice(from, 1)[0]);
    onReorder && onReorder(next);
  };

  return (
    <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 'var(--space-2)', width: 'fit-content', minWidth: 280, fontFamily: 'var(--font-sans)', ...style }} {...rest}>
      {items.map((it, idx) => (
        <li key={it.id}
          draggable
          onDragStart={() => setDragId(it.id)}
          onDragEnd={() => setDragId(null)}
          onDragOver={(e) => { e.preventDefault(); }}
          onDrop={(e) => { e.preventDefault(); if (dragId != null) move(ids.indexOf(dragId), idx); setDragId(null); }}
          onKeyDown={(e) => { if (e.altKey && e.key === 'ArrowUp') { e.preventDefault(); move(idx, idx - 1); } if (e.altKey && e.key === 'ArrowDown') { e.preventDefault(); move(idx, idx + 1); } }}
          tabIndex={0}
          aria-label={`${idx + 1}. ${it.label}`}
          style={{
            display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 'var(--radius-md)',
            border: '1px solid var(--color-semantic-line-normal-normal)', background: 'var(--color-semantic-background-elevated-normal)',
            opacity: dragId === it.id ? 0.4 : 1, cursor: 'grab', boxShadow: 'var(--shadow-xs)',
          }}
        >
          <span aria-hidden="true" style={{ color: 'var(--color-semantic-label-assistive)', flexShrink: 0, cursor: 'grab', display: 'inline-flex' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><circle cx="9" cy="6" r="1.6" /><circle cx="15" cy="6" r="1.6" /><circle cx="9" cy="12" r="1.6" /><circle cx="15" cy="12" r="1.6" /><circle cx="9" cy="18" r="1.6" /><circle cx="15" cy="18" r="1.6" /></svg>
          </span>
          <span aria-hidden="true" style={{ flexShrink: 0, width: 22, height: 22, borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: 'var(--lk-accent-tint)', color: 'var(--color-semantic-primary-normal)', fontSize: 12, fontWeight: 'var(--fw-bold)', fontVariantNumeric: 'tabular-nums' }}>{idx + 1}</span>
          <span style={{ flex: 1, minWidth: 0 }}>
            <span style={{ display: 'block', fontSize: 14, fontWeight: 'var(--fw-semibold)', color: 'var(--color-semantic-label-normal)' }}>{it.label}</span>
            {it.detail != null && <span style={{ display: 'block', fontSize: 12.5, color: 'var(--color-semantic-label-alternative)', marginTop: 1 }}>{it.detail}</span>}
          </span>
        </li>
      ))}
    </ul>
  );
}
