import React from 'react';
import { Icon } from '../icon/Icon.jsx';

const DEFAULT_TOOLBAR_ITEMS = [
  { value: 'body', label: '본문', icon: 'document' },
  { value: 'tag', label: '태그', icon: 'tag' },
  { value: 'attachment', label: '첨부', icon: 'attachment' },
  { value: 'preview', label: '미리보기', icon: 'eye' },
];

function ToolbarButton({ item, active, disabled, onAction }) {
  const [hover, setHover] = React.useState(false);
  const isDisabled = disabled || item.disabled;
  const label = item.label || item.value;
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={active || undefined}
      title={label}
      disabled={isDisabled}
      onClick={(event) => { if (!isDisabled) onAction && onAction(item.value, item, event); }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 34,
        height: 34,
        border: '1px solid var(--color-semantic-line-normal-normal)',
        borderRadius: 'var(--radius-sm)',
        background: active ? 'var(--color-semantic-primary-surface-strong)' : hover && !isDisabled ? 'var(--color-semantic-fill-normal)' : 'var(--color-semantic-background-elevated-normal)',
        color: active ? 'var(--color-semantic-primary-normal)' : 'var(--color-semantic-label-alternative)',
        cursor: isDisabled ? 'not-allowed' : 'pointer',
        opacity: isDisabled ? 0.45 : 1,
        transition: 'background var(--dur-fast) var(--ease-out), color var(--dur-fast) var(--ease-out), border-color var(--dur-fast) var(--ease-out)',
      }}
    >
      {item.icon ? <Icon name={item.icon} size={17} aria-hidden="true" /> : item.children}
    </button>
  );
}

/**
 * LK ROBOTICS — ContentEditor
 * Writing editor shell for notices, board posts, operation notes, and document
 * drafts. It defines title/body fields, editor toolbar placement, save status,
 * metadata, and action slots without bundling a rich-text engine.
 */
export function ContentEditor({
  'aria-label': ariaLabel = '글 작성 에디터',
  titleLabel = '제목',
  titlePlaceholder = '제목을 입력하세요',
  titleValue,
  defaultTitleValue = '',
  onTitleChange,
  bodyLabel = '본문',
  placeholder = '내용을 입력하세요',
  value,
  defaultValue = '',
  onValueChange,
  toolbar,
  toolbarItems = DEFAULT_TOOLBAR_ITEMS,
  activeToolbarItems = [],
  onToolbarAction,
  meta,
  status,
  helper,
  actions,
  footer,
  required = false,
  invalid = false,
  disabled = false,
  readOnly = false,
  busy = false,
  rows = 12,
  maxLength,
  id,
  titleId,
  bodyId,
  titleInputProps,
  textareaProps,
  style,
  ...rest
}) {
  const generatedId = React.useId();
  const rootId = id || `content-editor-${generatedId}`;
  const resolvedTitleId = titleId || `${rootId}-title`;
  const resolvedBodyId = bodyId || `${rootId}-body`;
  const [titleFocus, setTitleFocus] = React.useState(false);
  const [bodyFocus, setBodyFocus] = React.useState(false);
  const [internalTitle, setInternalTitle] = React.useState(defaultTitleValue);
  const [internalValue, setInternalValue] = React.useState(defaultValue);
  const isTitleControlled = titleValue !== undefined;
  const isValueControlled = value !== undefined;
  const currentTitle = isTitleControlled ? titleValue : internalTitle;
  const currentValue = isValueControlled ? value : internalValue;
  const activeSet = React.useMemo(() => new Set(activeToolbarItems), [activeToolbarItems]);
  const hasFooter = meta != null || status != null || helper != null || actions != null || footer != null || maxLength != null;
  const bodyLength = String(currentValue ?? '').length;
  const ring = invalid
    ? 'var(--color-semantic-status-negative)'
    : (titleFocus || bodyFocus) ? 'var(--color-semantic-primary-normal)' : 'var(--color-semantic-line-normal-normal)';

  const handleTitleChange = (event) => {
    const next = event.target.value;
    if (!isTitleControlled) setInternalTitle(next);
    onTitleChange && onTitleChange(next, event);
    titleInputProps && titleInputProps.onChange && titleInputProps.onChange(event);
  };

  const handleValueChange = (event) => {
    const next = event.target.value;
    if (!isValueControlled) setInternalValue(next);
    onValueChange && onValueChange(next, event);
    textareaProps && textareaProps.onChange && textareaProps.onChange(event);
  };

  return (
    <section
      id={rootId}
      aria-label={ariaLabel}
      aria-busy={busy || undefined}
      style={{
        display: 'grid',
        gridTemplateRows: 'auto auto minmax(180px, 1fr) auto',
        width: '100%',
        minWidth: 0,
        overflow: 'hidden',
        border: `1px solid ${ring}`,
        borderRadius: 'var(--radius-md)',
        background: 'var(--color-semantic-background-elevated-normal)',
        boxShadow: titleFocus || bodyFocus ? '0 0 0 4px var(--color-semantic-focus-ring)' : 'none',
        fontFamily: 'var(--font-sans)',
        color: 'var(--color-semantic-label-normal)',
        transition: 'border-color var(--dur-base) var(--ease-out), box-shadow var(--dur-base) var(--ease-out)',
        ...style,
      }}
      {...rest}
    >
      <div style={{ display: 'grid', gap: 'var(--space-2)', padding: 'var(--space-4) var(--space-4) var(--space-3)' }}>
        <label htmlFor={resolvedTitleId} style={{ fontSize: 13, lineHeight: 1.4, fontWeight: 'var(--fw-bold)', color: invalid ? 'var(--color-semantic-status-negative)' : 'var(--color-semantic-label-alternative)' }}>
          {titleLabel}{required && <span style={{ color: 'var(--color-semantic-status-negative)' }}> *</span>}
        </label>
        <input
          id={resolvedTitleId}
          value={currentTitle}
          placeholder={titlePlaceholder}
          disabled={disabled}
          readOnly={readOnly}
          {...titleInputProps}
          onChange={handleTitleChange}
          onFocus={(event) => { setTitleFocus(true); titleInputProps && titleInputProps.onFocus && titleInputProps.onFocus(event); }}
          onBlur={(event) => { setTitleFocus(false); titleInputProps && titleInputProps.onBlur && titleInputProps.onBlur(event); }}
          style={{
            width: '100%',
            minWidth: 0,
            border: 'none',
            outline: 'none',
            background: 'transparent',
            color: 'var(--color-semantic-label-strong)',
            fontFamily: 'var(--font-sans)',
            fontSize: 22,
            lineHeight: 1.35,
            fontWeight: 'var(--fw-extra)',
            letterSpacing: 0,
            opacity: disabled ? 0.55 : 1,
            ...titleInputProps?.style,
          }}
        />
      </div>
      <div
        role="toolbar"
        aria-label="글 편집 도구"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 'var(--space-3)',
          padding: '8px var(--space-4)',
          borderTop: '1px solid var(--color-semantic-line-normal-normal)',
          borderBottom: '1px solid var(--color-semantic-line-normal-normal)',
          background: 'var(--color-semantic-background-normal-alternative)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', minWidth: 0 }}>
          {toolbar != null
            ? toolbar
            : toolbarItems.map((item) => (
              <ToolbarButton
                key={item.value}
                item={item}
                active={activeSet.has(item.value)}
                disabled={disabled || readOnly}
                onAction={onToolbarAction}
              />
            ))}
        </div>
        {status != null && (
          <div role="status" aria-live="polite" style={{ flexShrink: 0, color: 'var(--color-semantic-label-alternative)', fontSize: 13, lineHeight: 1.35 }}>
            {status}
          </div>
        )}
      </div>
      <div style={{ display: 'grid', gap: 'var(--space-2)', padding: 'var(--space-4)' }}>
        <label htmlFor={resolvedBodyId} style={{ fontSize: 13, lineHeight: 1.4, fontWeight: 'var(--fw-bold)', color: invalid ? 'var(--color-semantic-status-negative)' : 'var(--color-semantic-label-alternative)' }}>
          {bodyLabel}{required && <span style={{ color: 'var(--color-semantic-status-negative)' }}> *</span>}
        </label>
        <textarea
          id={resolvedBodyId}
          value={currentValue}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
          rows={rows}
          maxLength={maxLength}
          aria-invalid={invalid || undefined}
          {...textareaProps}
          onChange={handleValueChange}
          onFocus={(event) => { setBodyFocus(true); textareaProps && textareaProps.onFocus && textareaProps.onFocus(event); }}
          onBlur={(event) => { setBodyFocus(false); textareaProps && textareaProps.onBlur && textareaProps.onBlur(event); }}
          style={{
            width: '100%',
            minHeight: 220,
            resize: 'vertical',
            border: 'none',
            outline: 'none',
            background: 'transparent',
            color: 'var(--color-semantic-label-normal)',
            fontFamily: 'var(--font-sans)',
            fontSize: 15,
            lineHeight: 1.68,
            letterSpacing: 0,
            boxSizing: 'border-box',
            opacity: disabled ? 0.55 : 1,
            ...textareaProps?.style,
          }}
        />
      </div>
      {hasFooter && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 'var(--space-3)',
            flexWrap: 'wrap',
            padding: '10px var(--space-4)',
            borderTop: '1px solid var(--color-semantic-line-normal-normal)',
            background: 'var(--color-semantic-background-normal-alternative)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', flexWrap: 'wrap', minWidth: 0, color: 'var(--color-semantic-label-alternative)', fontSize: 12.5, lineHeight: 1.45 }}>
            {meta != null && <span>{meta}</span>}
            {helper != null && <span>{helper}</span>}
            {maxLength != null && <span>{bodyLength}/{maxLength}</span>}
            {footer}
          </div>
          {actions != null && <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 'var(--space-2)', flexWrap: 'wrap' }}>{actions}</div>}
        </div>
      )}
    </section>
  );
}
