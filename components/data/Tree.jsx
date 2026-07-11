import React from 'react';

function TreeNode({ node, level, expandedSet, previewSet, setPreviewKey, toggle, onSelect, openOnHover }) {
  const key = node.id != null ? node.id : node.label;
  const has = node.children && node.children.length > 0;
  const open = expandedSet.has(key) || previewSet.has(key);
  const [hovered, setHovered] = React.useState(false);
  const previewHandlers = openOnHover && has
    ? {
        onMouseEnter: () => setPreviewKey(key, true),
        onMouseLeave: () => setPreviewKey(key, false),
        onFocus: () => setPreviewKey(key, true),
        onBlur: (event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) setPreviewKey(key, false);
        },
      }
    : {};

  return (
    <div {...previewHandlers}>
      <button
        type="button"
        aria-expanded={has ? open : undefined}
        onClick={() => { if (has) toggle(key); onSelect && onSelect(node); }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          minHeight: 36,
          padding: '8px 10px',
          paddingLeft: 10 + level * 20,
          border: '1px solid transparent',
          background: hovered ? 'var(--color-semantic-background-normal-alternative)' : 'transparent',
          cursor: 'pointer',
          borderRadius: 'var(--radius-md)',
          textAlign: 'left',
          fontFamily: 'var(--font-sans)',
          fontSize: 'var(--label1-size)',
          fontWeight: level === 0 ? 'var(--fw-semibold)' : 'var(--fw-medium)',
          color: level === 0 ? 'var(--color-semantic-label-strong)' : 'var(--color-semantic-label-normal)',
          transition: 'background var(--dur-fast) var(--ease-out), border-color var(--dur-fast) var(--ease-out)',
        }}
      >
        {has
          ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-semantic-label-alternative)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" style={{ transform: open ? 'rotate(90deg)' : 'none', transition: 'transform var(--dur-fast) var(--ease-out)', flexShrink: 0 }}><path d="m9 18 6-6-6-6" /></svg>
          : <span style={{ width: 14, flexShrink: 0 }} />}
        {node.icon}
        <span>{node.label}</span>
      </button>
      {has && open && node.children.map((c, i) => (
        <TreeNode
          key={i}
          node={c}
          level={level + 1}
          expandedSet={expandedSet}
          previewSet={previewSet}
          setPreviewKey={setPreviewKey}
          toggle={toggle}
          onSelect={onSelect}
          openOnHover={openOnHover}
        />
      ))}
    </div>
  );
}

/**
 * LK ROBOTICS — Tree
 * An expandable hierarchy (조직도, 파일 트리). `nodes` are
 * `{ id?, label, icon?, children? }`; rotating caret + indent per level.
 */
export function Tree({ nodes = [], defaultExpanded = [], onSelect, openOnHover = false, style, ...rest }) {
  const [expanded, setExpanded] = React.useState(() => new Set(defaultExpanded));
  const [preview, setPreview] = React.useState(() => new Set());
  const toggle = (k) => setExpanded((prev) => { const n = new Set(prev); if (n.has(k)) n.delete(k); else n.add(k); return n; });
  const setPreviewKey = (key, active) => setPreview((prev) => {
    const next = new Set(prev);
    if (active) next.add(key);
    else next.delete(key);
    return next;
  });

  return (
    <div style={{ display: 'grid', gap: 2, fontFamily: 'var(--font-sans)', ...style }} {...rest}>
      {nodes.map((n, i) => (
        <TreeNode
          key={i}
          node={n}
          level={0}
          expandedSet={expanded}
          previewSet={preview}
          setPreviewKey={setPreviewKey}
          toggle={toggle}
          onSelect={onSelect}
          openOnHover={openOnHover}
        />
      ))}
    </div>
  );
}
