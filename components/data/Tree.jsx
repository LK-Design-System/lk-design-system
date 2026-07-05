import React from 'react';

function TreeNode({ node, level, expandedSet, toggle, onSelect }) {
  const key = node.id != null ? node.id : node.label;
  const has = node.children && node.children.length > 0;
  const open = expandedSet.has(key);
  return (
    <div>
      <button
        type="button"
        onClick={() => { if (has) toggle(key); onSelect && onSelect(node); }}
        onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--fill-normal)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
        style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 7, padding: '7px 8px', paddingLeft: 8 + level * 18, border: 'none', background: 'transparent', cursor: 'pointer', borderRadius: 'var(--radius-md)', textAlign: 'left', fontFamily: 'var(--font-sans)', fontSize: 14.5, color: 'var(--label-normal)' }}
      >
        {has
          ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--label-alternative)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" style={{ transform: open ? 'rotate(90deg)' : 'none', transition: 'transform var(--dur-fast) var(--ease-out)', flexShrink: 0 }}><path d="m9 18 6-6-6-6" /></svg>
          : <span style={{ width: 14, flexShrink: 0 }} />}
        {node.icon}
        <span>{node.label}</span>
      </button>
      {has && open && node.children.map((c, i) => <TreeNode key={i} node={c} level={level + 1} expandedSet={expandedSet} toggle={toggle} onSelect={onSelect} />)}
    </div>
  );
}

/**
 * LK ROBOTICS — Tree
 * An expandable hierarchy (조직도, 파일 트리). `nodes` are
 * `{ id?, label, icon?, children? }`; rotating caret + indent per level.
 */
export function Tree({ nodes = [], defaultExpanded = [], onSelect, style, ...rest }) {
  const [expanded, setExpanded] = React.useState(() => new Set(defaultExpanded));
  const toggle = (k) => setExpanded((prev) => { const n = new Set(prev); if (n.has(k)) n.delete(k); else n.add(k); return n; });
  return (
    <div style={{ fontFamily: 'var(--font-sans)', ...style }} {...rest}>
      {nodes.map((n, i) => <TreeNode key={i} node={n} level={0} expandedSet={expanded} toggle={toggle} onSelect={onSelect} />)}
    </div>
  );
}
