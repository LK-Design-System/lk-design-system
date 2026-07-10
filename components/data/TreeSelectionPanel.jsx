import React from 'react';
import { Icon } from '../icon/Icon.jsx';

const ROW_HEIGHT = 36;
const INDENT = 18;
const CHECK_SIZE = 18;
const CARET_SIZE = 20;

function getNodeText(node) {
  if (node.searchText != null) return String(node.searchText);
  if (typeof node.label === 'string' || typeof node.label === 'number') return String(node.label);
  if (typeof node.description === 'string') return node.description;
  return node.id;
}

function nodeMatches(node, query) {
  if (!query) return true;
  const own = getNodeText(node).toLowerCase().includes(query);
  return own || (node.children || []).some((child) => nodeMatches(child, query));
}

function collectSelectableIds(node, cascade, inheritedDisabled = false, includeDisabled = true) {
  const disabled = inheritedDisabled || !!node.disabled;
  const children = node.children || [];
  const hasChildren = children.length > 0;
  const ids = [];

  if (!hasChildren && node.selectable !== false && (includeDisabled || !disabled)) {
    ids.push(node.id);
  }

  if (cascade) {
    for (const child of children) {
      ids.push(...collectSelectableIds(child, cascade, disabled, includeDisabled));
    }
  }

  return ids;
}

function getCheckState(ids, checkedSet) {
  if (ids.length === 0) return { checked: false, mixed: false };
  const checkedCount = ids.filter((id) => checkedSet.has(id)).length;
  return {
    checked: checkedCount === ids.length,
    mixed: checkedCount > 0 && checkedCount < ids.length,
  };
}

function StateRow({ children }) {
  return (
    <li
      aria-disabled="true"
      style={{
        listStyle: 'none',
        minHeight: 96,
        display: 'grid',
        placeItems: 'center',
        padding: '20px 12px',
        color: 'var(--color-semantic-label-assistive)',
        fontSize: 'var(--label2-size)',
        lineHeight: 'var(--label2-line)',
        fontWeight: 'var(--fw-medium)',
        letterSpacing: 0,
        textAlign: 'center',
      }}
    >
      {children}
    </li>
  );
}

function CheckControl({ label, checked, mixed, disabled, onToggle }) {
  const active = checked || mixed;

  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={mixed ? 'mixed' : checked}
      aria-label={label}
      disabled={disabled}
      onClick={(event) => {
        event.stopPropagation();
        if (!disabled) onToggle();
      }}
      style={{
        width: CHECK_SIZE,
        height: CHECK_SIZE,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 0,
        border: `1.5px solid ${
          disabled
            ? 'var(--color-semantic-line-normal-neutral)'
            : active
              ? 'var(--color-semantic-primary-normal)'
              : 'var(--color-semantic-line-normal-normal)'
        }`,
        borderRadius: 'var(--radius-5)',
        background: disabled
          ? 'var(--color-semantic-fill-normal)'
          : active
            ? 'var(--color-semantic-primary-normal)'
            : 'var(--color-semantic-background-elevated-normal)',
        color: disabled ? 'var(--color-semantic-label-disable)' : 'var(--color-semantic-static-white)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        flexShrink: 0,
        transition:
          'background var(--dur-fast) var(--ease-out), border-color var(--dur-fast) var(--ease-out), color var(--dur-fast) var(--ease-out)',
      }}
    >
      {checked && <Icon name="check" size={14} aria-hidden="true" />}
      {mixed && (
        <span
          aria-hidden="true"
          style={{
            width: 9,
            height: 2,
            borderRadius: 'var(--radius-pill)',
            background: 'currentColor',
          }}
        />
      )}
    </button>
  );
}

function TreeSelectionPanelNode({
  node,
  depth,
  query,
  checkedSet,
  expandedSet,
  cascade,
  disabled,
  toggleNode,
  toggleOpen,
}) {
  if (!nodeMatches(node, query)) return null;

  const children = node.children || [];
  const hasChildren = children.length > 0;
  const nodeDisabled = disabled || !!node.disabled;
  const expanded = query ? true : expandedSet.has(node.id);
  const stateIds = collectSelectableIds(node, cascade, false, true);
  const actionIds = collectSelectableIds(node, cascade, nodeDisabled, false);
  const showCheckbox = stateIds.length > 0;
  const checkboxDisabled = nodeDisabled || actionIds.length === 0;
  const checkState = getCheckState(stateIds, checkedSet);
  const labelText = getNodeText(node);
  const canToggleByRow = showCheckbox && !checkboxDisabled;
  const expandLabel = `${labelText} ${expanded ? '접기' : '펼치기'}`;

  const handleRowAction = () => {
    if (hasChildren) toggleOpen(node.id);
    else if (canToggleByRow) toggleNode(actionIds, checkState.checked);
  };

  return (
    <li style={{ listStyle: 'none', margin: 0, padding: 0 }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `${CARET_SIZE}px ${CHECK_SIZE}px minmax(0, 1fr)`,
          alignItems: 'center',
          gap: 6,
          minHeight: ROW_HEIGHT,
          padding: '3px 8px',
          paddingLeft: 8 + depth * INDENT,
          boxSizing: 'border-box',
          borderRadius: 'var(--radius-sm)',
        }}
      >
        {hasChildren ? (
          <button
            type="button"
            aria-label={expandLabel}
            aria-expanded={expanded}
            disabled={nodeDisabled}
            onClick={(event) => {
              event.stopPropagation();
              if (!nodeDisabled) toggleOpen(node.id);
            }}
            style={{
              width: CARET_SIZE,
              height: CARET_SIZE,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 0,
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              background: 'transparent',
              color: nodeDisabled
                ? 'var(--color-semantic-label-disable)'
                : 'var(--color-semantic-label-alternative)',
              cursor: nodeDisabled ? 'default' : 'pointer',
            }}
          >
            <span
              aria-hidden="true"
              style={{
                display: 'inline-flex',
                transform: expanded ? 'rotate(90deg)' : 'none',
                transition: 'transform var(--dur-fast) var(--ease-out)',
              }}
            >
              <Icon name="chevron-right" size={14} aria-hidden="true" />
            </span>
          </button>
        ) : (
          <span aria-hidden="true" style={{ width: CARET_SIZE, height: CARET_SIZE }} />
        )}

        {showCheckbox ? (
          <CheckControl
            label={`${labelText} 선택`}
            checked={checkState.checked}
            mixed={checkState.mixed}
            disabled={checkboxDisabled}
            onToggle={() => toggleNode(actionIds, checkState.checked)}
          />
        ) : (
          <span aria-hidden="true" style={{ width: CHECK_SIZE, height: CHECK_SIZE }} />
        )}

        <button
          type="button"
          aria-expanded={hasChildren ? expanded : undefined}
          disabled={nodeDisabled || (!hasChildren && !canToggleByRow)}
          onClick={handleRowAction}
          style={{
            minWidth: 0,
            width: '100%',
            minHeight: 30,
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1fr) auto',
            alignItems: 'center',
            gap: 6,
            padding: '0 6px',
            border: 'none',
            borderRadius: 'var(--radius-sm)',
            background: 'transparent',
            color: nodeDisabled
              ? 'var(--color-semantic-label-disable)'
              : depth === 0
                ? 'var(--color-semantic-label-strong)'
                : 'var(--color-semantic-label-normal)',
            cursor: nodeDisabled || (!hasChildren && !canToggleByRow) ? 'default' : 'pointer',
            textAlign: 'left',
            fontFamily: 'var(--font-sans)',
          }}
        >
          <span style={{ display: 'grid', gap: 1, minWidth: 0 }}>
            <span
              style={{
                minWidth: 0,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                fontSize: 'var(--label2-size)',
                lineHeight: 'var(--label2-line)',
                fontWeight: hasChildren ? 'var(--fw-semibold)' : 'var(--fw-medium)',
                letterSpacing: 0,
              }}
            >
              {node.label}
            </span>
            {node.description != null && (
              <span
                style={{
                  minWidth: 0,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  color: nodeDisabled
                    ? 'var(--color-semantic-label-disable)'
                    : 'var(--color-semantic-label-assistive)',
                  fontSize: 'var(--caption1-size)',
                  lineHeight: 'var(--caption1-line)',
                  fontWeight: 'var(--fw-medium)',
                  letterSpacing: 0,
                }}
              >
                {node.description}
              </span>
            )}
          </span>

          {node.meta != null && (
            <span
              style={{
                maxWidth: 96,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                color: nodeDisabled
                  ? 'var(--color-semantic-label-disable)'
                  : 'var(--color-semantic-label-alternative)',
                fontSize: 'var(--caption1-size)',
                lineHeight: 'var(--caption1-line)',
                fontWeight: 'var(--fw-medium)',
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {node.meta}
            </span>
          )}
        </button>
      </div>

      {hasChildren && expanded && (
        <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
          {children.map((child) => (
            <TreeSelectionPanelNode
              key={child.id}
              node={child}
              depth={depth + 1}
              query={query}
              checkedSet={checkedSet}
              expandedSet={expandedSet}
              cascade={cascade}
              disabled={nodeDisabled}
              toggleNode={toggleNode}
              toggleOpen={toggleOpen}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

export function TreeSelectionPanel({
  nodes = [],
  checked,
  defaultChecked = [],
  onChange,
  query,
  defaultQuery = '',
  onQueryChange,
  placeholder = '검색',
  label = '트리 선택',
  defaultExpanded = [],
  cascade = true,
  height = 260,
  emptyLabel = '항목이 없습니다',
  noResultsLabel = '검색 결과가 없습니다',
  disabled = false,
  style,
  ...rest
}) {
  const isCheckedControlled = checked !== undefined;
  const [internalChecked, setInternalChecked] = React.useState(() => new Set(defaultChecked));
  const checkedSet = isCheckedControlled ? new Set(checked) : internalChecked;
  const isQueryControlled = query !== undefined;
  const [internalQuery, setInternalQuery] = React.useState(defaultQuery);
  const currentQuery = isQueryControlled ? query : internalQuery;
  const normalizedQuery = currentQuery.trim().toLowerCase();
  const [expanded, setExpanded] = React.useState(() => new Set(defaultExpanded));
  const visibleNodes = nodes.filter((node) => nodeMatches(node, normalizedQuery));

  const commitChecked = (next) => {
    if (!isCheckedControlled) setInternalChecked(next);
    onChange && onChange([...next]);
  };

  const setQuery = (value) => {
    if (!isQueryControlled) setInternalQuery(value);
    onQueryChange && onQueryChange(value);
  };

  const toggleNode = (ids, allChecked) => {
    if (disabled || ids.length === 0) return;
    const next = new Set(checkedSet);
    for (const id of ids) {
      if (allChecked) next.delete(id);
      else next.add(id);
    }
    commitChecked(next);
  };

  const toggleOpen = (id) => {
    if (disabled) return;
    setExpanded((previous) => {
      const next = new Set(previous);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div
      style={{
        display: 'grid',
        gap: 'var(--space-2)',
        width: '100%',
        maxWidth: 360,
        minWidth: 0,
        fontFamily: 'var(--font-sans)',
        ...style,
      }}
      {...rest}
    >
      <div style={{ position: 'relative', minWidth: 0 }}>
        <span
          aria-hidden="true"
          style={{
            position: 'absolute',
            left: 10,
            top: '50%',
            transform: 'translateY(-50%)',
            display: 'inline-flex',
            color: 'var(--color-semantic-label-assistive)',
            pointerEvents: 'none',
          }}
        >
          <Icon name="search" size={15} aria-hidden="true" />
        </span>
        <input
          value={currentQuery}
          onChange={(event) => setQuery(event.target.value)}
          disabled={disabled}
          placeholder={placeholder}
          aria-label={placeholder}
          style={{
            width: '100%',
            height: 36,
            padding: '0 34px',
            boxSizing: 'border-box',
            border: '1px solid var(--color-semantic-line-normal-normal)',
            borderRadius: 'var(--radius-md)',
            background: disabled
              ? 'var(--color-semantic-fill-normal)'
              : 'var(--color-semantic-background-elevated-normal)',
            color: disabled
              ? 'var(--color-semantic-label-disable)'
              : 'var(--color-semantic-label-normal)',
            fontFamily: 'var(--font-sans)',
            fontSize: 'var(--label2-size)',
            lineHeight: 'var(--label2-line)',
            fontWeight: 'var(--fw-medium)',
            letterSpacing: 0,
          }}
        />
        {currentQuery && !disabled && (
          <button
            type="button"
            aria-label="검색어 지우기"
            onClick={() => setQuery('')}
            style={{
              position: 'absolute',
              right: 7,
              top: '50%',
              transform: 'translateY(-50%)',
              width: 24,
              height: 24,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 0,
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              background: 'transparent',
              color: 'var(--color-semantic-label-assistive)',
              cursor: 'pointer',
            }}
          >
            <Icon name="circle-close-fill" size={15} aria-hidden="true" />
          </button>
        )}
      </div>

      <ul
        aria-label={label}
        aria-disabled={disabled ? 'true' : undefined}
        style={{
          margin: 0,
          padding: 4,
          listStyle: 'none',
          border: '1px solid var(--color-semantic-line-normal-normal)',
          borderRadius: 'var(--radius-md)',
          background: 'var(--color-semantic-background-elevated-normal)',
          maxHeight: height,
          minHeight: 0,
          overflow: 'auto',
          boxSizing: 'border-box',
        }}
      >
        {nodes.length === 0 ? (
          <StateRow>{emptyLabel}</StateRow>
        ) : visibleNodes.length === 0 ? (
          <StateRow>{noResultsLabel}</StateRow>
        ) : (
          visibleNodes.map((node) => (
            <TreeSelectionPanelNode
              key={node.id}
              node={node}
              depth={0}
              query={normalizedQuery}
              checkedSet={checkedSet}
              expandedSet={expanded}
              cascade={cascade}
              disabled={disabled}
              toggleNode={toggleNode}
              toggleOpen={toggleOpen}
            />
          ))
        )}
      </ul>
    </div>
  );
}
