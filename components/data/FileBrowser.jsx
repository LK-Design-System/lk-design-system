import React from 'react';
import { Icon } from '../icon/Icon.jsx';

// Same visually-hidden recipe the rest of the library uses (DataGrid, Chip,
// ToastStack): readable by assistive tech, absolutely positioned so it never
// participates in the flex/grid flow it is dropped into.
const SR_ONLY_STYLE = {
  position: 'absolute',
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
  whiteSpace: 'nowrap',
  border: 0,
};

function entryKey(entry) {
  return entry.id ?? entry.name;
}

function isSelectable(entry, mode) {
  if (mode === 'file-or-folder') return true;
  if (mode === 'none') return false;
  if (mode === 'folder') return entry.kind === 'directory';
  return entry.kind === 'file';
}

function StateRow({ children, role }) {
  return <li role={role} style={{ minHeight: 104, display: 'grid', placeItems: 'center', padding: 'var(--space-4)', color: 'var(--color-semantic-label-strong)', fontSize: 'var(--label1-size)', textAlign: 'center' }}>{children}</li>;
}

function DirectoryOpenButton({ entry, disabled, onNavigate }) {
  if (typeof onNavigate !== 'function') return null;
  return (
    <button
      type="button"
      aria-label={`${entry.name} 폴더 열기`}
      title={`${entry.name} 폴더 열기`}
      disabled={disabled}
      onClick={() => onNavigate(entry)}
      style={{ width: 30, height: 30, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: 0, border: '1px solid var(--color-semantic-line-normal-normal)', borderRadius: 'var(--radius-sm)', background: 'var(--color-semantic-background-elevated-normal)', color: disabled ? 'var(--color-semantic-label-disable)' : 'var(--color-semantic-label-neutral)', cursor: disabled ? 'not-allowed' : 'pointer' }}
    >
      <Icon name="chevron-right" size={14} aria-hidden="true" />
    </button>
  );
}

/** File and directory navigation with selection kept as a separate action. */
export function FileBrowser({
  path = '/',
  entries = [],
  selectedId,
  selectionMode = 'file',
  onNavigate,
  onUp,
  onSelectionChange,
  maxHeight = 300,
  emptyMessage = '이 위치에 항목이 없습니다.',
  loading = false,
  loadingMessage = '항목을 불러오는 중입니다.',
  error,
  disabled = false,
  navigationDisabled = false,
  pathLabel = '현재 경로',
  listLabel = '파일과 폴더',
  style,
  'aria-label': ariaLabel,
  ...rest
}) {
  const upDisabled = disabled || navigationDisabled || loading || path === '/' || typeof onUp !== 'function';

  return (
    <div
      role="group"
      aria-label={ariaLabel ?? '파일 브라우저'}
      aria-busy={loading || undefined}
      aria-disabled={disabled || undefined}
      style={{ display: 'grid', gridTemplateRows: 'auto minmax(0, 1fr)', width: '100%', maxWidth: 440, minWidth: 0, border: '1px solid var(--color-semantic-line-normal-normal)', borderRadius: 'var(--radius-md)', overflow: 'hidden', background: 'var(--color-semantic-background-elevated-normal)', fontFamily: 'var(--font-sans)', boxSizing: 'border-box', ...style }}
      {...rest}
    >
      <header style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', minWidth: 0, padding: 'var(--space-2) var(--space-3)', borderBottom: '1px solid var(--color-semantic-line-normal-normal)', background: 'var(--color-semantic-background-elevated-alternative)' }}>
        <button
          type="button"
          aria-label="상위 폴더로 이동"
          /* Reaching the root disables this button as a result of the user's own
             activation. A native `disabled` would drop keyboard focus to <body>
             at that moment, so the control stays focusable and blocks activation
             through aria-disabled instead — the same focusable-disabled contract
             Button.jsx applies while loading. */
          aria-disabled={upDisabled || undefined}
          onClick={() => { if (!upDisabled) onUp?.(); }}
          style={{ width: 30, height: 30, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, padding: 0, border: '1px solid var(--color-semantic-line-normal-normal)', borderRadius: 'var(--radius-sm)', background: 'var(--color-semantic-background-elevated-normal)', color: upDisabled ? 'var(--color-semantic-label-disable)' : 'var(--color-semantic-label-neutral)', cursor: upDisabled ? 'not-allowed' : 'pointer' }}
        >
          <Icon name="arrow-up" size={15} aria-hidden="true" />
        </button>
        {/* `code` is a naming-prohibited role, so an aria-label on it is dropped
            or read instead of the visible path (ARIA in HTML, WCAG 2.5.3). The
            context is supplied as real text next to the unchanged visible path. */}
        <span style={SR_ONLY_STYLE}>{pathLabel}</span>
        <code title={path} style={{ minWidth: 0, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--color-semantic-label-strong)', fontFamily: 'var(--font-mono)', fontSize: 'var(--label2-size)' }}>{path}</code>
      </header>

      <ul aria-label={listLabel} style={{ display: 'grid', gap: 2, margin: 0, padding: 4, overflow: 'auto', maxHeight, listStyle: 'none' }}>
        {loading ? <StateRow role="status">{loadingMessage}</StateRow> : error != null ? <StateRow role="alert">{error}</StateRow> : entries.length === 0 ? <StateRow>{emptyMessage}</StateRow> : entries.map((entry) => {
          const key = entryKey(entry);
          const directory = entry.kind === 'directory';
          const selectable = isSelectable(entry, selectionMode);
          const selected = selectable && selectedId != null && selectedId === key;
          const rowDisabled = disabled || Boolean(entry.disabled);
          const navigationAvailable = directory && !navigationDisabled && typeof onNavigate === 'function';
          const primarySelects = selectable && typeof onSelectionChange === 'function';
          const primaryNavigates = !primarySelects && navigationAvailable;
          const primaryDisabled = rowDisabled || (!primarySelects && !primaryNavigates);

          return (
            <li key={key} style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) auto', gap: 4, alignItems: 'center' }}>
              <button
                type="button"
                aria-pressed={primarySelects ? selected : undefined}
                /* aria-pressed already carries the selection state, so the name
                   must not repeat it. Without a toggle (no selection callback)
                   the selected row would otherwise be signalled by colour only,
                   so the text cue is kept for exactly that case (WCAG 1.4.1). */
                aria-label={`${entry.name}, ${directory ? '폴더' : '파일'}${selected && !primarySelects ? ', 선택됨' : ''}`}
                disabled={primaryDisabled}
                onClick={() => {
                  if (primarySelects) onSelectionChange(entry);
                  else if (primaryNavigates) onNavigate(entry);
                }}
                style={{ display: 'grid', gridTemplateColumns: '24px minmax(0, 1fr) auto', gap: 'var(--space-2)', alignItems: 'center', minHeight: 42, minWidth: 0, padding: '0 var(--space-3)', border: selected ? '1px solid var(--color-semantic-line-normal-strong)' : '1px solid transparent', borderRadius: 'var(--radius-sm)', background: selected ? 'var(--color-semantic-fill-normal)' : 'transparent', color: rowDisabled ? 'var(--color-semantic-label-disable)' : 'var(--color-semantic-label-strong)', textAlign: 'left', cursor: primaryDisabled ? 'default' : 'pointer', fontFamily: 'inherit' }}
              >
                <Icon name={directory ? 'folder' : 'document'} size={18} aria-hidden="true" />
                <span style={{ minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: 'var(--label1-size)', fontWeight: directory || selected ? 'var(--fw-semibold)' : 'var(--fw-medium)' }}>{entry.name}</span>
                {entry.meta != null && <span style={{ color: rowDisabled ? 'var(--color-semantic-label-disable)' : 'var(--color-semantic-label-neutral)', fontSize: 'var(--caption1-size)', whiteSpace: 'nowrap' }}>{entry.meta}</span>}
              </button>
              {directory && primarySelects && <DirectoryOpenButton entry={entry} disabled={rowDisabled || navigationDisabled} onNavigate={onNavigate} />}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
