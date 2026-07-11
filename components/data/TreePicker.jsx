import React from 'react';
import { IconButton } from '../buttons/IconButton.jsx';
import { Checkbox } from '../forms/Checkbox.jsx';
import { Input } from '../forms/Input.jsx';
import { Icon } from '../icon/Icon.jsx';

function nodeText(node) {
  if (node.searchText != null) return String(node.searchText);
  if (typeof node.label === 'string' || typeof node.label === 'number') return String(node.label);
  if (typeof node.description === 'string') return node.description;
  return String(node.id);
}

function matchesQuery(node, query) {
  if (!query) return true;
  if (nodeText(node).toLowerCase().includes(query)) return true;
  return (node.children ?? []).some((child) => matchesQuery(child, query));
}

function isSelectable(node) {
  const branch = (node.children?.length ?? 0) > 0;
  return node.selectable ?? !branch;
}

function selectionIds(node, behavior, inheritedDisabled = false, includeDisabled = true) {
  const disabled = inheritedDisabled || Boolean(node.disabled);
  const children = node.children ?? [];
  const ids = [];

  if (behavior === 'independent') {
    if (isSelectable(node) && (includeDisabled || !disabled)) ids.push(node.id);
    return ids;
  }

  if (children.length === 0) {
    if (isSelectable(node) && (includeDisabled || !disabled)) ids.push(node.id);
    return ids;
  }

  for (const child of children) ids.push(...selectionIds(child, behavior, disabled, includeDisabled));
  return ids;
}

function selectionState(ids, selectedSet) {
  const count = ids.filter((id) => selectedSet.has(id)).length;
  return {
    checked: ids.length > 0 && count === ids.length,
    mixed: count > 0 && count < ids.length,
  };
}

function visibleTreeNodes(nodes, query, expandedSet, parentId = null, inheritedDisabled = false, result = []) {
  for (const node of nodes) {
    if (!matchesQuery(node, query)) continue;
    const disabled = inheritedDisabled || Boolean(node.disabled);
    result.push({ id: node.id, parentId, node, disabled });
    const expanded = Boolean(query) || expandedSet.has(node.id);
    if (expanded && (node.children?.length ?? 0) > 0) visibleTreeNodes(node.children, query, expandedSet, node.id, disabled, result);
  }
  return result;
}

function PickerNode({
  node,
  parentId,
  depth,
  query,
  selectedSet,
  expandedSet,
  selectionBehavior,
  disabled,
  activeId,
  registerNode,
  focusNode,
  focusFirstChild,
  moveFocus,
  onToggleSelection,
  onToggleExpanded,
}) {
  const [focused, setFocused] = React.useState(false);
  if (!matchesQuery(node, query)) return null;
  const children = node.children ?? [];
  const branch = children.length > 0;
  const nodeDisabled = disabled || Boolean(node.disabled);
  const expanded = query ? true : expandedSet.has(node.id);
  const visibleSelectionIds = selectionIds(node, selectionBehavior, false, true);
  const actionableSelectionIds = selectionIds(node, selectionBehavior, nodeDisabled, false);
  const selectable = visibleSelectionIds.length > 0;
  const state = selectionState(visibleSelectionIds, selectedSet);
  const label = nodeText(node);

  const toggleSelection = () => {
    if (!nodeDisabled && actionableSelectionIds.length > 0) onToggleSelection(actionableSelectionIds, state.checked);
  };

  return (
    <li role="none" style={{ margin: 0, padding: 0, listStyle: 'none' }}>
    <div
      ref={(element) => registerNode(node.id, element)}
      role="treeitem"
      aria-level={depth + 1}
      aria-expanded={branch ? expanded : undefined}
      aria-checked={selectable ? (state.mixed ? 'mixed' : state.checked) : undefined}
      aria-disabled={nodeDisabled || undefined}
      tabIndex={nodeDisabled ? -1 : activeId === node.id ? 0 : -1}
      data-tree-picker-id={node.id}
      onFocus={() => {
        setFocused(true);
        focusNode(node.id, false);
      }}
      onBlur={() => setFocused(false)}
      onClick={(event) => {
        if (event.target.closest('button, label')) return;
        if (selectable) toggleSelection();
        else if (branch && !query) onToggleExpanded(node.id);
      }}
      onKeyDown={(event) => {
        if (event.target !== event.currentTarget) return;
        if (event.key === 'ArrowDown') { event.preventDefault(); moveFocus(node.id, 'next'); }
        if (event.key === 'ArrowUp') { event.preventDefault(); moveFocus(node.id, 'previous'); }
        if (event.key === 'Home') { event.preventDefault(); moveFocus(node.id, 'first'); }
        if (event.key === 'End') { event.preventDefault(); moveFocus(node.id, 'last'); }
        if (event.key === 'ArrowRight') {
          event.preventDefault();
          if (branch && !expanded && !query) onToggleExpanded(node.id);
          else if (branch) focusFirstChild(node.id);
        }
        if (event.key === 'ArrowLeft') {
          event.preventDefault();
          if (branch && expanded && !query) onToggleExpanded(node.id);
          else focusNode(parentId);
        }
        if (event.key === ' ' || event.key === 'Enter') {
          event.preventDefault();
          if (selectable) toggleSelection();
          else if (branch && !query) onToggleExpanded(node.id);
        }
      }}
      style={{
        padding: 'var(--space-1) var(--space-2)',
        paddingLeft: `calc(var(--space-2) + ${depth} * var(--space-4))`,
        display: 'grid',
        gridTemplateColumns: 'var(--component-toggle-icon-size-sm) auto minmax(0, 1fr)',
        alignItems: 'center',
        columnGap: 'var(--space-0)',
        minHeight: 'var(--control-h-md)',
        borderRadius: 'var(--radius-sm)',
        background: focused ? 'var(--color-semantic-fill-alternative)' : 'transparent',
        boxShadow: focused ? '0 0 0 3px var(--color-semantic-focus-ring)' : 'none',
        outline: 'none',
        cursor: nodeDisabled ? 'not-allowed' : 'pointer',
      }}
    >
      {branch && !query ? (
        <span
          onClick={(event) => event.stopPropagation()}
          style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', lineHeight: 0 }}
        >
          <IconButton
            variant="ghost"
            round={false}
            onClick={() => onToggleExpanded(node.id)}
            label={`${label} ${expanded ? '접기' : '펼치기'}`}
            size="sm"
            disabled={nodeDisabled}
            tabIndex={-1}
            aria-expanded={expanded}
            style={{ background: 'transparent', border: 'none', borderRadius: 'var(--radius-sm)' }}
          >
            <span aria-hidden="true" style={{ display: 'inline-flex', transform: expanded ? 'rotate(90deg)' : 'none', transition: 'transform var(--dur-fast) var(--ease-out)' }}>
              <Icon name="chevron-right" size={16} aria-hidden="true" />
            </span>
          </IconButton>
        </span>
      ) : (
        <span aria-hidden="true" style={{ width: 'var(--component-toggle-icon-size-sm)' }} />
      )}

      {selectable ? (
        <span
          onClick={(event) => event.stopPropagation()}
          style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', lineHeight: 0 }}
        >
          <Checkbox
            checked={state.checked}
            indeterminate={state.mixed}
            disabled={nodeDisabled || actionableSelectionIds.length === 0}
            onChange={toggleSelection}
            aria-label={`${label} 선택`}
            aria-hidden="true"
            tabIndex={-1}
          />
        </span>
      ) : <span aria-hidden="true" />}

      <span style={{ minWidth: 0, marginLeft: 'var(--space-2)', display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) auto', alignItems: 'center', gap: 'var(--space-2)' }}>
        <span style={{ minWidth: 0, display: 'grid', gap: 'var(--space-0)' }}>
          <span style={{ minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: 'var(--label2-size)', fontWeight: branch ? 'var(--fw-semibold)' : 'var(--fw-medium)' }}>{node.label}</span>
          {node.description != null && <span style={{ minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: nodeDisabled ? 'var(--color-semantic-label-disable)' : 'var(--color-semantic-label-neutral)', fontSize: 'var(--caption1-size)' }}>{node.description}</span>}
        </span>
        {node.meta != null && <span style={{ color: nodeDisabled ? 'var(--color-semantic-label-disable)' : 'var(--color-semantic-label-neutral)', fontSize: 'var(--caption1-size)', whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums' }}>{node.meta}</span>}
      </span>
    </div>

      {branch && expanded && (
        <ul role="group" style={{ margin: 0, padding: 0, listStyle: 'none' }}>
          {children.map((child) => (
            <PickerNode
              key={child.id}
              node={child}
              parentId={node.id}
              depth={depth + 1}
              query={query}
              selectedSet={selectedSet}
              expandedSet={expandedSet}
              selectionBehavior={selectionBehavior}
              disabled={nodeDisabled}
              activeId={activeId}
              registerNode={registerNode}
              focusNode={focusNode}
              focusFirstChild={focusFirstChild}
              moveFocus={moveFocus}
              onToggleSelection={onToggleSelection}
              onToggleExpanded={onToggleExpanded}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

/** Hierarchical multi-select input with explicit controlled selection and expansion state. */
export function TreePicker({
  nodes = [],
  selectedIds,
  defaultSelectedIds = [],
  onSelectedIdsChange,
  expandedIds,
  defaultExpandedIds = [],
  onExpandedIdsChange,
  query,
  defaultQuery = '',
  onQueryChange,
  selectionBehavior = 'descendants',
  searchLabel = '계층 검색',
  searchPlaceholder = '검색',
  label = '계층에서 선택',
  emptyMessage = '선택할 항목이 없습니다.',
  noResultsMessage = '일치하는 항목이 없습니다.',
  maxHeight = 280,
  disabled = false,
  style,
  ...rest
}) {
  const treeId = React.useId();
  const nodeRefs = React.useRef(new Map());
  const selectionControlled = selectedIds !== undefined;
  const [internalSelectedIds, setInternalSelectedIds] = React.useState(defaultSelectedIds);
  const currentSelectedIds = selectionControlled ? selectedIds : internalSelectedIds;
  const selectedSet = new Set(currentSelectedIds);

  const expansionControlled = expandedIds !== undefined;
  const [internalExpandedIds, setInternalExpandedIds] = React.useState(defaultExpandedIds);
  const currentExpandedIds = expansionControlled ? expandedIds : internalExpandedIds;
  const expandedSet = new Set(currentExpandedIds);

  const queryControlled = query !== undefined;
  const [internalQuery, setInternalQuery] = React.useState(defaultQuery);
  const currentQuery = queryControlled ? query : internalQuery;
  const normalizedQuery = currentQuery.trim().toLowerCase();
  const visibleNodes = nodes.filter((node) => matchesQuery(node, normalizedQuery));
  const visibleRows = visibleTreeNodes(nodes, normalizedQuery, expandedSet, null, disabled);
  const visibleIds = visibleRows.filter((row) => !row.disabled).map((row) => row.id);
  const [activeId, setActiveId] = React.useState(visibleIds[0]);

  React.useEffect(() => {
    if (!visibleIds.includes(activeId)) setActiveId(visibleIds[0]);
  }, [activeId, visibleIds.join('|')]);

  const registerNode = (id, element) => {
    if (element) nodeRefs.current.set(id, element);
    else nodeRefs.current.delete(id);
  };

  const focusNode = (id, moveDomFocus = true) => {
    if (id == null || !visibleIds.includes(id)) return;
    setActiveId(id);
    if (moveDomFocus) nodeRefs.current.get(id)?.focus();
  };

  const focusFirstChild = (parentId) => {
    const child = visibleRows.find((row) => row.parentId === parentId && !row.disabled);
    focusNode(child?.id);
  };

  const moveFocus = (id, direction) => {
    const index = visibleIds.indexOf(id);
    if (index < 0 || visibleIds.length === 0) return;
    if (direction === 'first') focusNode(visibleIds[0]);
    if (direction === 'last') focusNode(visibleIds[visibleIds.length - 1]);
    if (direction === 'next') focusNode(visibleIds[Math.min(index + 1, visibleIds.length - 1)]);
    if (direction === 'previous') focusNode(visibleIds[Math.max(index - 1, 0)]);
  };

  const commitSelection = (next) => {
    const nextIds = [...next];
    if (!selectionControlled) setInternalSelectedIds(nextIds);
    onSelectedIdsChange?.(nextIds);
  };

  const toggleSelection = (ids, allSelected) => {
    if (disabled || ids.length === 0) return;
    const next = new Set(selectedSet);
    for (const id of ids) {
      if (allSelected) next.delete(id);
      else next.add(id);
    }
    commitSelection(next);
  };

  const toggleExpanded = (id) => {
    if (disabled || normalizedQuery) return;
    const next = new Set(expandedSet);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    const nextIds = [...next];
    if (!expansionControlled) setInternalExpandedIds(nextIds);
    onExpandedIdsChange?.(nextIds);
  };

  const changeQuery = (value) => {
    if (!queryControlled) setInternalQuery(value);
    onQueryChange?.(value);
  };

  return (
    <div style={{ width: '100%', minWidth: 0, display: 'grid', gap: 'var(--space-2)', fontFamily: 'var(--font-sans)', ...style }} {...rest}>
      <Input
        type="search"
        size="sm"
        label={searchLabel}
        value={currentQuery}
        onChange={(event) => changeQuery(event.target.value)}
        placeholder={searchPlaceholder}
        disabled={disabled}
        leadingIcon={<Icon name="search" size={16} aria-hidden="true" />}
        aria-controls={treeId}
      />

      {visibleNodes.length === 0 ? (
        <div
          id={treeId}
          role="status"
          style={{ minHeight: 104, maxHeight, display: 'grid', placeItems: 'center', padding: 'var(--space-4)', boxSizing: 'border-box', color: 'var(--color-semantic-label-neutral)', textAlign: 'center', fontSize: 'var(--label2-size)', border: '1px solid var(--color-semantic-line-normal-normal)', borderRadius: 'var(--radius-md)', background: 'var(--color-semantic-background-elevated-normal)' }}
        >
          {nodes.length === 0 ? emptyMessage : noResultsMessage}
        </div>
      ) : (
        <ul
          id={treeId}
          role="tree"
          aria-label={label}
          aria-multiselectable="true"
          aria-disabled={disabled || undefined}
          style={{ minHeight: 104, maxHeight, margin: 0, padding: 'var(--space-1)', overflow: 'auto', listStyle: 'none', border: '1px solid var(--color-semantic-line-normal-normal)', borderRadius: 'var(--radius-md)', background: 'var(--color-semantic-background-elevated-normal)' }}
        >
          {visibleNodes.map((node) => (
          <PickerNode
            key={node.id}
            node={node}
            parentId={null}
            depth={0}
            query={normalizedQuery}
            selectedSet={selectedSet}
            expandedSet={expandedSet}
            selectionBehavior={selectionBehavior}
            disabled={disabled}
            activeId={activeId}
            registerNode={registerNode}
            focusNode={focusNode}
            focusFirstChild={focusFirstChild}
            moveFocus={moveFocus}
            onToggleSelection={toggleSelection}
            onToggleExpanded={toggleExpanded}
          />
          ))}
        </ul>
      )}
    </div>
  );
}
