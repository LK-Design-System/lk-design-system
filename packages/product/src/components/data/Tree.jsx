import React from 'react';
import { Icon } from '@lk-robotics/lds-core/components/icon/Icon';

function visibleItems(tree) {
  return Array.from(tree?.querySelectorAll('[role="treeitem"]') ?? []);
}

function focusTreeItem(item, setFocusKey) {
  if (!item) return;
  setFocusKey(item.dataset.treeKey);
  item.focus();
}

function nodeId(node) {
  return node.id == null ? null : String(node.id);
}

function internalNodeKey(node, path) {
  const id = nodeId(node);
  return id == null ? `path:${path.join('.')}` : `id:${id}`;
}

function legacyExpansionValue(node) {
  const id = nodeId(node);
  if (id != null) return id;
  if (typeof node.label === 'string' || typeof node.label === 'number') return String(node.label);
  return null;
}

function initialExpandedKeys(nodes, defaultExpanded) {
  const requested = new Set(defaultExpanded.map(String));
  const keys = [];
  const visit = (items, parentPath = []) => {
    for (const [index, node] of items.entries()) {
      const path = [...parentPath, index];
      const focusKey = internalNodeKey(node, path);
      const legacyValue = legacyExpansionValue(node);
      if (legacyValue != null && requested.has(legacyValue)) keys.push(focusKey);
      visit(node.children ?? [], path);
    }
  };
  visit(nodes);
  return keys;
}

function expandedValuesForKeys(nodes, expandedKeys, parentPath = [], values = []) {
  for (const [index, node] of nodes.entries()) {
    const path = [...parentPath, index];
    const key = internalNodeKey(node, path);
    const value = legacyExpansionValue(node);
    if (value != null && expandedKeys.has(key)) values.push(value);
    expandedValuesForKeys(node.children ?? [], expandedKeys, path, values);
  }
  return values;
}

function assertUniqueNodeIds(nodes, seen = new Set()) {
  for (const node of nodes) {
    const id = nodeId(node);
    if (id != null) {
      if (seen.has(id)) {
        throw new Error(`Tree node IDs must be unique. Duplicate ID: "${id}".`);
      }
      seen.add(id);
    }
    assertUniqueNodeIds(node.children ?? [], seen);
  }
}

function findNodePath(nodes, targetId, ancestors = [], parentPath = []) {
  for (const [index, node] of nodes.entries()) {
    const path = [...parentPath, index];
    const focusKey = internalNodeKey(node, path);
    if (nodeId(node) === targetId) return { focusKey, ancestors };
    const childPath = findNodePath(
      node.children ?? [],
      targetId,
      [...ancestors, focusKey],
      path,
    );
    if (childPath) return childPath;
  }
  return null;
}

function TreeNode({
  node,
  path,
  level,
  parentFocusKey,
  expandedSet,
  previewSet,
  setPreviewKey,
  toggle,
  onSelect,
  selectedKey,
  select,
  openOnHover,
  treeRef,
  focusKey,
  setFocusKey,
}) {
  const key = internalNodeKey(node, path);
  const id = nodeId(node);
  const has = Boolean(node.children?.length);
  const open = has && (expandedSet.has(key) || previewSet.has(key));
  const disabled = Boolean(node.disabled);
  const [hovered, setHovered] = React.useState(false);
  const [focused, setFocused] = React.useState(false);
  const selected = id != null && selectedKey === id;
  const activate = () => {
    setFocusKey(key);
    if (disabled) return;
    if (has) toggle(key, node);
    if (id != null) select(id);
    onSelect?.(node);
  };
  const onKeyDown = (event) => {
    event.stopPropagation();
    const items = visibleItems(treeRef.current);
    const currentIndex = items.indexOf(event.currentTarget);
    if (currentIndex < 0) return;
    let target;
    if (event.key === 'ArrowDown') target = items[currentIndex + 1];
    if (event.key === 'ArrowUp') target = items[currentIndex - 1];
    if (event.key === 'Home') target = items[0];
    if (event.key === 'End') target = items.at(-1);
    if (event.key === 'ArrowRight') {
      if (has && !open) {
        event.preventDefault();
        if (!disabled) toggle(key, node);
        return;
      }
      if (has && open) target = items[currentIndex + 1];
    }
    if (event.key === 'ArrowLeft') {
      if (has && open) {
        event.preventDefault();
        if (!disabled) toggle(key, node);
        return;
      }
      if (parentFocusKey != null) target = items.find((item) => item.dataset.treeKey === parentFocusKey);
    }
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      activate();
      return;
    }
    if (target) {
      event.preventDefault();
      focusTreeItem(target, setFocusKey);
    }
  };

  return (
    <div
      role="treeitem"
      aria-expanded={has ? open : undefined}
      aria-selected={selected}
      aria-disabled={disabled || undefined}
      aria-label={node.ariaLabel}
      aria-level={level + 1}
      tabIndex={focusKey === key ? 0 : -1}
      data-tree-key={key}
      data-tree-id={id ?? undefined}
      data-parent-key={parentFocusKey ?? undefined}
      onClick={(event) => {
        event.stopPropagation();
        activate();
      }}
      onKeyDown={onKeyDown}
      onFocus={(event) => {
        if (event.target === event.currentTarget) {
          setFocused(true);
          setFocusKey(key);
          if (openOnHover && has) setPreviewKey(key, true);
        }
      }}
      onBlur={(event) => {
        if (event.target === event.currentTarget) setFocused(false);
        if (openOnHover && has && !event.currentTarget.contains(event.relatedTarget)) setPreviewKey(key, false);
      }}
      onMouseEnter={() => {
        setHovered(true);
        if (openOnHover && has) setPreviewKey(key, true);
      }}
      onMouseLeave={() => {
        setHovered(false);
        if (openOnHover && has) setPreviewKey(key, false);
      }}
      style={{ outline: 'none' }}
    >
      <div
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          minHeight: 36,
          padding: '8px 10px',
          paddingLeft: `calc(var(--space-2-5) + ${level * 20}px)`,
          boxSizing: 'border-box',
          border: selected ? '1px solid var(--color-semantic-primary-normal)' : '1px solid transparent',
          background: selected ? 'var(--color-semantic-primary-surface-strong)' : hovered ? 'var(--color-semantic-background-normal-alternative)' : 'transparent',
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.55 : 1,
          borderRadius: 'var(--radius-md)',
          textAlign: 'left',
          fontFamily: 'var(--font-sans)',
          fontSize: 'var(--label1-size)',
          fontWeight: level === 0 ? 'var(--fw-semibold)' : 'var(--fw-medium)',
          color: level === 0 ? 'var(--color-semantic-label-strong)' : 'var(--color-semantic-label-normal)',
          boxShadow: focused ? 'inset 0 0 0 2px var(--color-semantic-focus-indicator)' : 'none',
          transition: 'background var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out)',
        }}
      >
        {has
          ? <Icon name="chevron-right-small" size={14} color="var(--color-semantic-label-alternative)" aria-hidden="true" style={{ transform: open ? 'rotate(90deg)' : 'none', transition: 'transform var(--dur-fast) var(--ease-out)', flexShrink: 0 }} />
          : <span aria-hidden="true" style={{ width: 14, flexShrink: 0 }} />}
        {node.icon}
        {/* A floor, not just minWidth:0. This column is the only flexible one
            in the row (meta shrinks reluctantly, `end` not at all), so it
            absorbed the entire deficit: in a 209px panel with two trailing
            badges it collapsed to 33px and broke a one-line hint into six
            fragments of two syllables each. The row's identity text is the last
            thing that may be sacrificed — the deficit belongs on `meta`, which
            already carries an ellipsis for exactly that. */}
        <span style={{ display: 'grid', gap: 2, minWidth: '10ch', flex: 1 }}>
          <span style={{ minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {node.label}
          </span>
          {node.description != null && (
            <span style={{ color: 'var(--color-semantic-label-neutral)', fontSize: 'var(--caption2-size)', lineHeight: 1.35, fontWeight: 'var(--fw-medium)', overflowWrap: 'anywhere' }}>
              {node.description}
            </span>
          )}
        </span>
        {node.meta != null && (
          <span style={{ marginLeft: 'auto', flex: '0 1 auto', minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--color-semantic-label-alternative)', fontSize: 'var(--caption1-size)', fontWeight: 'var(--fw-medium)' }}>
            {node.meta}
          </span>
        )}
        {node.end != null && (
          <span
            data-tree-row-end=""
            onClick={(event) => event.stopPropagation()}
            onPointerDown={(event) => event.stopPropagation()}
            style={{ display: 'inline-flex', alignItems: 'center', flex: '0 0 auto' }}
          >
            {node.end}
          </span>
        )}
      </div>
      {has && open && (
        <div role="group">
          {node.children.map((child, index) => (
            <TreeNode
              key={internalNodeKey(child, [...path, index])}
              node={child}
              path={[...path, index]}
              level={level + 1}
              parentFocusKey={key}
              expandedSet={expandedSet}
              previewSet={previewSet}
              setPreviewKey={setPreviewKey}
              toggle={toggle}
              onSelect={onSelect}
              selectedKey={selectedKey}
              select={select}
              openOnHover={openOnHover}
              treeRef={treeRef}
              focusKey={focusKey}
              setFocusKey={setFocusKey}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * LK ROBOTICS - Tree
 * Expandable hierarchy with one roving tab stop and APG tree-view keyboard
 * navigation. Nodes are `{ id?, label, icon?, children? }`.
 */
export const Tree = React.forwardRef(function Tree({
  nodes = [],
  expandedIds,
  defaultExpanded = [],
  onExpandedIdsChange,
  selectedId,
  defaultSelectedId,
  onSelectedIdChange,
  onSelect,
  openOnHover = false,
  ariaLabel,
  'aria-label': htmlAriaLabel,
  style,
  ...rest
}, forwardedRef) {
  assertUniqueNodeIds(nodes);
  const [internalExpanded, setInternalExpanded] = React.useState(() => new Set(initialExpandedKeys(nodes, defaultExpanded)));
  const [preview, setPreview] = React.useState(() => new Set());
  const [focusKey, setFocusKey] = React.useState(() => nodes.length ? internalNodeKey(nodes[0], [0]) : '');
  const [internalSelectedKey, setInternalSelectedKey] = React.useState(() => defaultSelectedId == null ? null : String(defaultSelectedId));
  const [pendingFocusKey, setPendingFocusKey] = React.useState(null);
  const treeRef = React.useRef(null);
  const isExpansionControlled = expandedIds !== undefined;
  const expandedSet = isExpansionControlled
    ? new Set(initialExpandedKeys(nodes, expandedIds))
    : internalExpanded;
  const isSelectionControlled = selectedId !== undefined;
  const selectedKey = isSelectionControlled
    ? (selectedId == null ? null : String(selectedId))
    : internalSelectedKey;
  const select = React.useCallback((key) => {
    if (!isSelectionControlled) setInternalSelectedKey(key);
    onSelectedIdChange?.(key);
  }, [isSelectionControlled, onSelectedIdChange]);
  const commitExpanded = (next) => {
    if (!isExpansionControlled) setInternalExpanded(next);
    onExpandedIdsChange?.(expandedValuesForKeys(nodes, next));
  };
  const toggle = (key) => {
    const next = new Set(expandedSet);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    commitExpanded(next);
  };
  const setPreviewKey = (key, active) => setPreview((previous) => {
    const next = new Set(previous);
    if (active) next.add(key);
    else next.delete(key);
    return next;
  });

  React.useEffect(() => {
    if (!nodes.length) return;
    const items = visibleItems(treeRef.current);
    if (!items.some((item) => item.dataset.treeKey === focusKey)) {
      setFocusKey(items[0]?.dataset.treeKey ?? '');
    }
  }, [expandedSet, focusKey, nodes]);

  React.useEffect(() => {
    if (pendingFocusKey == null) return;
    setPendingFocusKey(null);
    const item = visibleItems(treeRef.current)
      .find((candidate) => candidate.dataset.treeKey === pendingFocusKey);
    focusTreeItem(item, setFocusKey);
  }, [expandedSet, nodes, pendingFocusKey]);

  React.useImperativeHandle(forwardedRef, () => ({
    focusItem(id, { reveal = false } = {}) {
      setPendingFocusKey(null);
      const targetId = String(id);
      const path = findNodePath(nodes, targetId);
      if (!path) return;
      if (reveal) {
        commitExpanded(new Set([...expandedSet, ...path.ancestors]));
        setPendingFocusKey(path.focusKey);
        return;
      }
      const visibleItem = visibleItems(treeRef.current)
        .find((candidate) => candidate.dataset.treeKey === path.focusKey);
      focusTreeItem(visibleItem, setFocusKey);
    },
  }), [expandedSet, nodes]);

  return (
    <div
      ref={treeRef}
      role="tree"
      aria-label={ariaLabel ?? htmlAriaLabel ?? (rest['aria-labelledby'] == null ? 'Hierarchy' : undefined)}
      style={{ display: 'grid', gap: 'var(--space-0-5)', fontFamily: 'var(--font-sans)', ...style }}
      {...rest}
    >
      {nodes.map((node, index) => (
        <TreeNode
          key={internalNodeKey(node, [index])}
          node={node}
          path={[index]}
          level={0}
          parentFocusKey={null}
          expandedSet={expandedSet}
          previewSet={preview}
          setPreviewKey={setPreviewKey}
          toggle={toggle}
          onSelect={onSelect}
          selectedKey={selectedKey}
          select={select}
          openOnHover={openOnHover}
          treeRef={treeRef}
          focusKey={focusKey}
          setFocusKey={setFocusKey}
        />
      ))}
    </div>
  );
});
