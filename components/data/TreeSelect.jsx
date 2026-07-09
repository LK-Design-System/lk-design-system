import React from 'react';

/**
 * LK ROBOTICS — TreeSelect
 * Searchable, checkable tree — the pick-many complement to Tree/TopicTree.
 * Nodes are {id, label, children}. Type to filter (matching branches stay
 * expanded), toggle leaf checkboxes; `onChange` returns the checked id set.
 * Controlled (`checked`) or uncontrolled (`defaultChecked`).
 */
function matches(node, q) {
  if (!q) return true;
  if (String(node.label).toLowerCase().includes(q)) return true;
  return (node.children || []).some((c) => matches(c, q));
}

export function TreeSelect({ nodes = [], checked, defaultChecked = [], onChange, placeholder = '검색', style, ...rest }) {
  const controlled = checked !== undefined;
  const [internal, setInternal] = React.useState(() => new Set(defaultChecked));
  const set = controlled ? new Set(checked) : internal;
  const [q, setQ] = React.useState('');
  const [open, setOpen] = React.useState(() => new Set());
  const query = q.trim().toLowerCase();

  const commit = (next) => { if (!controlled) setInternal(next); onChange && onChange([...next]); };
  const toggle = (id) => { const next = new Set(set); next.has(id) ? next.delete(id) : next.add(id); commit(next); };
  const toggleOpen = (id) => setOpen((o) => { const n = new Set(o); n.has(id) ? n.delete(id) : n.add(id); return n; });

  const Row = ({ node, depth }) => {
    const isBranch = node.children && node.children.length;
    if (!matches(node, query)) return null;
    const expanded = query ? true : open.has(node.id);
    return (
      <li style={{ listStyle: 'none' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, height: 30, paddingLeft: 8 + depth * 16, paddingRight: 8, borderRadius: 'var(--radius-sm)', cursor: isBranch ? 'pointer' : 'default' }}
          onClick={isBranch ? () => toggleOpen(node.id) : undefined}>
          {isBranch ? (
            <span aria-hidden="true" style={{ width: 14, display: 'inline-flex', color: 'var(--color-semantic-label-alternative)', transform: expanded ? 'rotate(90deg)' : 'none', transition: 'transform var(--dur-fast) var(--ease-out)' }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
            </span>
          ) : (
            <input type="checkbox" checked={set.has(node.id)} onChange={() => toggle(node.id)} onClick={(e) => e.stopPropagation()} aria-label={String(node.label)}
              style={{ width: 15, height: 15, accentColor: 'var(--color-semantic-primary-normal)', flexShrink: 0 }} />
          )}
          <span style={{ fontSize: 13.5, fontWeight: isBranch ? 'var(--fw-semibold)' : 'var(--fw-medium)', color: 'var(--color-semantic-label-normal)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{node.label}</span>
        </div>
        {isBranch && expanded && <ul style={{ margin: 0, padding: 0 }}>{node.children.map((c) => <Row key={c.id} node={c} depth={depth + 1} />)}</ul>}
      </li>
    );
  };

  return (
    <div style={{ display: 'grid', gap: 'var(--space-2)', width: 280, fontFamily: 'var(--font-sans)', ...style }} {...rest}>
      <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={placeholder} aria-label={placeholder}
        style={{ height: 34, padding: '0 10px', border: '1px solid var(--bw-border)', borderRadius: 'var(--radius-md)', outline: 'none', background: 'var(--bw-white)', fontFamily: 'inherit', fontSize: 13.5, color: 'var(--color-semantic-label-normal)' }} />
      <ul role="tree" style={{ margin: 0, padding: 4, listStyle: 'none', border: '1px solid var(--color-semantic-line-normal-normal)', borderRadius: 'var(--radius-md)', background: 'var(--color-semantic-background-elevated-normal)', maxHeight: 260, overflow: 'auto' }}>
        {nodes.map((n) => <Row key={n.id} node={n} depth={0} />)}
      </ul>
    </div>
  );
}
