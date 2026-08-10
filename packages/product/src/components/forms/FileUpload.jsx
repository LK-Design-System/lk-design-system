import React from 'react';
import { useFieldMetadata } from '@lk-design-system/lds-core/components/forms/field-shared';
import { Icon } from '@lk-design-system/lds-core/components/icon/Icon';
import { useResolvedControlSize } from '@lk-design-system/lds-core/components/internal/component-density';

function matchesAccept(file, accept) {
  const rules = String(accept ?? '')
    .split(',')
    .map((rule) => rule.trim().toLowerCase())
    .filter(Boolean);
  if (rules.length === 0) return true;

  const name = String(file?.name ?? '').toLowerCase();
  const type = String(file?.type ?? '').toLowerCase();
  return rules.some((rule) => {
    if (rule.startsWith('.')) return name.endsWith(rule);
    if (rule.endsWith('/*')) return type.startsWith(rule.slice(0, -1));
    return type === rule;
  });
}

/** Native file input enhanced with a keyboard-accessible drag-and-drop target. */
export function FileUpload({
  onFiles,
  onRejectedFiles,
  accept,
  multiple = false,
  capture,
  inputAriaLabel,
  inputAriaDescribedBy,
  inputAriaInvalid,
  hint = '클릭하거나 파일을 끌어다 놓으세요',
  disabled = false,
  size,
  className,
  style,
  onDragEnter,
  onDragOver,
  onDragLeave,
  onDrop,
  ...rest
}) {
  const resolvedSize = useResolvedControlSize(size);
  const normalizedSize = resolvedSize === 'small' ? 'sm' : resolvedSize === 'medium' ? 'md' : resolvedSize;
  const compact = normalizedSize === 'sm';
  // The field engine owns id derivation and normalises the caller-supplied
  // description ids. Its label/message stack does not apply: the visible
  // <label> here is the drop target itself, and the description channel is
  // wholly external — this component has no helper/error props of its own.
  const { fieldId: inputId, describedBy } = useFieldMetadata({ prefix: 'file-upload', describedBy: inputAriaDescribedBy });
  const [drag, setDrag] = React.useState(false);
  const [focused, setFocused] = React.useState(false);
  const [names, setNames] = React.useState([]);
  const [rejectedNames, setRejectedNames] = React.useState([]);

  const handle = (files) => {
    const candidates = Array.from(files ?? []);
    const limited = multiple ? candidates : candidates.slice(0, 1);
    const overflow = multiple ? [] : candidates.slice(1);
    const accepted = limited.filter((file) => matchesAccept(file, accept));
    const rejected = [
      ...limited.filter((file) => !matchesAccept(file, accept)),
      ...overflow,
    ];

    setNames(accepted.map((file) => file.name));
    setRejectedNames(rejected.map((file) => file.name));
    onFiles?.(accepted);
    if (rejected.length > 0) onRejectedFiles?.(rejected);
  };

  // USWDS File input: a rejected file must reach assistive technology, not only
  // the onRejectedFiles callback, so the status region carries both outcomes.
  const statusMessage = [
    names.length > 0 ? `${names.join(', ')}, 선택됨` : '',
    rejectedNames.length > 0 ? `${rejectedNames.join(', ')}, 허용되지 않는 파일이라 제외됨` : '',
  ].filter(Boolean).join('. ');

  return (
    <div
      {...rest}
      className={['lk-file-upload', className].filter(Boolean).join(' ')}
      aria-disabled={disabled || undefined}
      data-size={normalizedSize}
      data-drag-active={drag ? '' : undefined}
      data-focus-visible={focused ? '' : undefined}
      onDragEnter={(event) => {
        event.preventDefault();
        if (!disabled) setDrag(true);
        onDragEnter?.(event);
      }}
      onDragOver={(event) => {
        event.preventDefault();
        if (!disabled) setDrag(true);
        onDragOver?.(event);
      }}
      onDragLeave={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setDrag(false);
        onDragLeave?.(event);
      }}
      onDrop={(event) => {
        event.preventDefault();
        setDrag(false);
        if (!disabled) handle(event.dataTransfer.files);
        onDrop?.(event);
      }}
      style={{
        position: 'relative',
        width: '100%',
        minWidth: 0,
        boxSizing: 'border-box',
        border: `1.5px dashed ${drag || focused ? 'var(--component-input-border-color-focus)' : 'var(--color-semantic-line-solid-normal)'}`,
        borderRadius: 'var(--component-input-radius)',
        background: disabled
          ? 'var(--color-semantic-fill-normal)'
          : drag
            ? 'var(--color-semantic-primary-surface-normal)'
            : 'var(--component-input-bg)',
        boxShadow: focused ? 'var(--component-input-focus-shadow)' : 'none',
        color: disabled ? 'var(--color-semantic-label-disable)' : 'var(--color-semantic-label-neutral)',
        fontFamily: 'var(--font-sans)',
        transition: 'border-color var(--dur-fast) var(--ease-out), background var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out)',
        ...style,
      }}
    >
      <input
        id={inputId}
        type="file"
        accept={accept}
        multiple={multiple}
        capture={capture}
        disabled={disabled}
        aria-label={inputAriaLabel}
        aria-describedby={describedBy}
        aria-invalid={inputAriaInvalid}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onChange={(event) => {
          handle(event.currentTarget.files);
          event.currentTarget.value = '';
        }}
        style={{
          position: 'absolute',
          width: 1,
          height: 1,
          padding: 0,
          margin: -1,
          overflow: 'hidden',
          clip: 'rect(0, 0, 0, 0)',
          whiteSpace: 'nowrap',
          border: 0,
        }}
      />
      <label
        htmlFor={inputId}
        style={{
          minHeight: compact ? 112 : 144,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: compact ? 'var(--space-2)' : 'var(--space-3)',
          padding: compact ? 'var(--space-4) var(--space-3)' : 'var(--space-6) var(--space-4)',
          boxSizing: 'border-box',
          textAlign: 'center',
          cursor: disabled ? 'not-allowed' : 'pointer',
        }}
      >
        <span
          aria-hidden="true"
          style={{
            display: 'inline-flex',
            width: compact ? 32 : 40,
            height: compact ? 32 : 40,
            borderRadius: 'var(--radius-md)',
            background: disabled ? 'var(--color-semantic-fill-strong)' : 'var(--color-semantic-primary-surface-normal)',
            color: disabled ? 'var(--color-semantic-label-disable)' : 'var(--color-semantic-primary-normal)',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Icon name="upload" size={20} aria-hidden="true" />
        </span>
        <span
          style={{
            maxWidth: '100%',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            color: names.length > 0 && !disabled ? 'var(--color-semantic-label-normal)' : 'inherit',
            fontSize: 'var(--label1-size)',
            lineHeight: 'var(--label1-line)',
            fontWeight: 'var(--fw-semibold)',
            wordBreak: 'break-word',
          }}
        >
          {hint}
        </span>
        {names.length > 0 && (
          <span
            aria-hidden="true"
            style={{
              maxWidth: '100%',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              color: disabled ? 'var(--color-semantic-label-disable)' : 'var(--color-semantic-label-normal)',
              fontSize: 'var(--caption1-size)',
              lineHeight: 'var(--caption1-line)',
              fontWeight: 'var(--fw-medium)',
              wordBreak: 'break-word',
            }}
          >
            {names.join(', ')}
          </span>
        )}
      </label>
      <span
        role="status"
        aria-live="polite"
        style={{
          position: 'absolute',
          width: 1,
          height: 1,
          padding: 0,
          margin: -1,
          overflow: 'hidden',
          clip: 'rect(0, 0, 0, 0)',
          whiteSpace: 'nowrap',
          border: 0,
        }}
      >
        {statusMessage}
      </span>
    </div>
  );
}
