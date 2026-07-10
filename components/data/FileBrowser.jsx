import React from 'react';
import { Icon } from '../icon/Icon.jsx';

const ROW_HEIGHT = 40;
const LEADING_SIZE = 24;

function getEntryKey(entry) {
  return entry.id ?? entry.name;
}

function canSelectEntry(entry, selectionMode) {
  if (selectionMode === 'any') return true;
  if (selectionMode === 'none') return false;
  if (selectionMode === 'folder') return entry.type === 'dir';
  return selectionMode === entry.type;
}

function getEntryActionLabel(entry, canOpen, canSelect) {
  if (entry.type === 'dir') {
    if (canOpen) return '폴더 열기';
    if (canSelect) return '폴더 선택';
    return '폴더';
  }
  return canSelect ? '파일 선택' : '파일';
}

function StateRow({ icon, children, tone = 'neutral', role, ariaLive }) {
  const color =
    tone === 'negative'
      ? 'var(--color-semantic-status-negative)'
      : 'var(--color-semantic-label-assistive)';

  return (
    <li
      aria-disabled="true"
      style={{
        minHeight: 104,
        display: 'grid',
        placeItems: 'center',
        padding: '20px 12px',
        boxSizing: 'border-box',
        color,
        fontSize: 'var(--label1-size)',
        lineHeight: 'var(--label1-line)',
        fontWeight: 'var(--fw-medium)',
        letterSpacing: 0,
        textAlign: 'center',
      }}
    >
      <span
        role={role}
        aria-live={ariaLive}
        style={{ display: 'inline-grid', gap: 8, justifyItems: 'center' }}
      >
        <Icon name={icon} size={20} aria-hidden="true" />
        <span>{children}</span>
      </span>
    </li>
  );
}

function UpButton({ disabled, onClick }) {
  const [hovered, setHovered] = React.useState(false);

  return (
    <button
      type="button"
      onClick={(event) => {
        if (!disabled && onClick) onClick(event);
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-label="상위 폴더로 이동"
      disabled={disabled}
      style={{
        width: 30,
        height: 30,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 0,
        border: '1px solid var(--color-semantic-line-normal-normal)',
        borderRadius: 'var(--radius-sm)',
        background: disabled
          ? 'var(--color-semantic-fill-normal)'
          : hovered
            ? 'var(--color-semantic-fill-alternative)'
            : 'var(--color-semantic-background-elevated-normal)',
        color: disabled
          ? 'var(--color-semantic-label-disable)'
          : 'var(--color-semantic-label-neutral)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        fontFamily: 'inherit',
        lineHeight: 0,
        flexShrink: 0,
        transition:
          'background var(--dur-fast) var(--ease-out), color var(--dur-fast) var(--ease-out)',
      }}
    >
      <Icon name="arrow-up" size={15} aria-hidden="true" />
    </button>
  );
}

function FileBrowserRow({ entry, selected, onOpen, onSelect, selectionMode, readOnly }) {
  const [hovered, setHovered] = React.useState(false);
  const isDir = entry.type === 'dir';
  const canOpen = isDir && !!onOpen;
  const canSelect = canSelectEntry(entry, selectionMode);
  const actionUnavailable = isDir ? !canOpen && !(canSelect && onSelect) : !(canSelect && onSelect);
  const unavailable = !!entry.disabled || actionUnavailable;
  const disabled = readOnly || unavailable;
  const isSelected = canSelect && selected != null && selected === getEntryKey(entry);
  const sizeText = entry.size == null ? '' : String(entry.size);
  const actionLabel = getEntryActionLabel(entry, canOpen, canSelect);
  const selectedLabel = isSelected ? ', 선택됨' : '';
  const sizeLabel = sizeText ? `, ${sizeText}` : '';
  const iconColor = unavailable
    ? 'var(--color-semantic-label-disable)'
    : isDir || isSelected
      ? 'var(--color-semantic-primary-normal)'
      : 'var(--color-semantic-label-assistive)';
  const titleColor = unavailable
    ? 'var(--color-semantic-label-disable)'
    : isSelected
      ? 'var(--color-semantic-primary-normal)'
      : 'var(--color-semantic-label-normal)';
  const background = disabled
    ? 'transparent'
    : hovered
      ? 'var(--color-semantic-fill-alternative)'
      : 'transparent';

  return (
    <li role="listitem" style={{ margin: 0, padding: 0 }}>
      <button
        type="button"
        disabled={disabled}
        aria-current={isSelected ? 'true' : undefined}
        aria-label={`${entry.name}, ${actionLabel}${sizeLabel}${selectedLabel}`}
        data-selected={isSelected ? '' : undefined}
        onClick={() => {
          if (disabled) return;
          if (canOpen) onOpen(entry);
          else if (canSelect && onSelect) onSelect(entry);
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          position: 'relative',
          display: 'grid',
          gridTemplateColumns: `${LEADING_SIZE}px minmax(0, 1fr) auto`,
          alignItems: 'center',
          gap: 10,
          width: '100%',
          minHeight: ROW_HEIGHT,
          padding: '0 10px',
          boxSizing: 'border-box',
          border: 'none',
          borderRadius: 'var(--radius-sm)',
          background,
          color: 'var(--color-semantic-label-normal)',
          cursor: unavailable ? 'not-allowed' : readOnly ? 'default' : 'pointer',
          textAlign: 'left',
          fontFamily: 'inherit',
          transition:
            'background var(--dur-fast) var(--ease-out), color var(--dur-fast) var(--ease-out)',
        }}
      >
        <span
          aria-hidden="true"
          style={{
            width: LEADING_SIZE,
            height: LEADING_SIZE,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: iconColor,
            flexShrink: 0,
          }}
        >
          <Icon name={isDir ? 'folder' : 'document'} size={18} aria-hidden="true" />
        </span>

        <span
          style={{
            minWidth: 0,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            color: titleColor,
            fontSize: 'var(--label1-size)',
            lineHeight: 'var(--label1-line)',
            fontWeight: isDir || isSelected ? 'var(--fw-semibold)' : 'var(--fw-medium)',
            letterSpacing: 0,
          }}
        >
          {entry.name}
        </span>

        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: 8,
            minWidth: 0,
            color: unavailable
              ? 'var(--color-semantic-label-disable)'
              : isSelected
                ? 'var(--color-semantic-primary-normal)'
                : 'var(--color-semantic-label-assistive)',
          }}
        >
          {entry.size != null && !isDir && (
            <span
              style={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                fontSize: 'var(--label2-size)',
                lineHeight: 'var(--label2-line)',
                fontWeight: 'var(--fw-medium)',
                fontVariantNumeric: 'tabular-nums',
                letterSpacing: 0,
              }}
            >
              {entry.size}
            </span>
          )}
          {isSelected && <Icon name="check" size={16} aria-hidden="true" />}
          {canOpen && <Icon name="chevron-right" size={14} aria-hidden="true" />}
        </span>
      </button>
    </li>
  );
}

/**
 * LDS Product Data — FileBrowser
 * Server-side file / directory navigator. Presentational: the host supplies the
 * current `path`, `entries` ([{name, type:'dir'|'file', size}]), and handles
 * `onOpen(dir)` / `onUp` / `onSelect(entry)`. Renders a path bar, an up control,
 * and a typed row list. Pairs with Modal for folder or file picking flows.
 */
export function FileBrowser({
  path = '/',
  entries = [],
  selected,
  selectionMode = 'file',
  onOpen,
  onUp,
  onSelect,
  height = 300,
  emptyLabel = '비어 있습니다',
  loading = false,
  loadingLabel = '불러오는 중입니다',
  error,
  readOnly = false,
  style,
  'aria-label': ariaLabel,
  ...rest
}) {
  const hasError = error != null;
  const upDisabled = readOnly || loading || path === '/' || !onUp;

  return (
    <div
      role="group"
      aria-label={ariaLabel || '파일 브라우저'}
      aria-busy={loading ? 'true' : undefined}
      aria-disabled={readOnly ? 'true' : undefined}
      style={{
        display: 'grid',
        gridTemplateRows: 'auto minmax(0, 1fr)',
        width: '100%',
        maxWidth: 420,
        minWidth: 0,
        border: '1px solid var(--color-semantic-line-normal-normal)',
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
        background: 'var(--color-semantic-background-elevated-normal)',
        fontFamily: 'var(--font-sans)',
        boxSizing: 'border-box',
        ...style,
      }}
      {...rest}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          minWidth: 0,
          padding: '8px 10px',
          borderBottom: '1px solid var(--color-semantic-line-normal-normal)',
          background: 'var(--color-semantic-background-elevated-alternative)',
          boxSizing: 'border-box',
        }}
      >
        <UpButton disabled={upDisabled} onClick={onUp} />
        <code
          aria-label={`현재 경로 ${path}`}
          title={path}
          style={{
            minWidth: 0,
            flex: 1,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            direction: 'rtl',
            textAlign: 'left',
            color: 'var(--color-semantic-label-neutral)',
            fontFamily: 'var(--font-mono)',
            fontSize: 'var(--label2-size)',
            lineHeight: 'var(--label2-line)',
            fontWeight: 'var(--fw-medium)',
            letterSpacing: 0,
          }}
        >
          {path}
        </code>
        {readOnly && (
          <span
            aria-label="읽기 전용"
            title="읽기 전용"
            style={{
              width: 24,
              height: 24,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              color: 'var(--color-semantic-label-assistive)',
            }}
          >
            <Icon name="lock" size={15} aria-hidden="true" />
          </span>
        )}
      </div>

      <ul
        role="list"
        aria-label="파일 및 폴더"
        aria-busy={loading ? 'true' : undefined}
        style={{
          display: 'grid',
          gap: 2,
          listStyle: 'none',
          margin: 0,
          padding: 4,
          overflow: 'auto',
          maxHeight: height,
          minHeight: 0,
          boxSizing: 'border-box',
        }}
      >
        {loading ? (
          <StateRow icon="hourglass" role="status" ariaLive="polite">
            {loadingLabel}
          </StateRow>
        ) : hasError ? (
          <StateRow icon="circle-exclamation" tone="negative" role="alert">
            {error}
          </StateRow>
        ) : entries.length === 0 ? (
          <StateRow icon="folder">{emptyLabel}</StateRow>
        ) : (
          entries.map((entry) => (
            <FileBrowserRow
              key={getEntryKey(entry)}
              entry={entry}
              selected={selected}
              selectionMode={selectionMode}
              readOnly={readOnly}
              onOpen={onOpen}
              onSelect={onSelect}
            />
          ))
        )}
      </ul>
    </div>
  );
}
