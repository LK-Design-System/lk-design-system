import React from 'react';
import { Input } from './Input.jsx';
import { IconButton } from '../buttons/IconButton.jsx';
import { Icon } from '../icon/Icon.jsx';

function textLabel(value, fallback) {
  return typeof value === 'string' || typeof value === 'number' ? String(value).trim() || fallback : fallback;
}

function contextualActionLabel(fieldLabel, actionLabel) {
  const action = textLabel(actionLabel, '동작');
  if (!fieldLabel) return action;
  return action.includes(fieldLabel) ? action : `${fieldLabel} ${action}`;
}

/*
  `navigator.clipboard` is exposed only in a secure context. A product served
  over plain HTTP on a LAN hostname has no Clipboard API at all, so a copy
  button there could previously do nothing but fail — and this field usually
  carries a value the user is shown exactly once.

  The fallback is the legacy selection command, which browsers still honour
  inside a user gesture and which does not require a secure context. It runs
  only when the modern API is missing, so nothing changes where the Clipboard
  API exists.
*/
async function writeToClipboard(value) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value);
    return;
  }
  if (typeof document === 'undefined' || typeof document.execCommand !== 'function') {
    throw new Error('Clipboard API is unavailable.');
  }
  const carrier = document.createElement('textarea');
  carrier.value = value;
  carrier.readOnly = true;
  carrier.setAttribute('aria-hidden', 'true');
  carrier.tabIndex = -1;
  // The node has to stay selectable, so it is hidden by size and opacity
  // rather than `display: none`, which would make the selection uncopyable.
  // `position: fixed` keeps the surrounding layout and scroll position still.
  Object.assign(carrier.style, {
    position: 'fixed',
    top: '0',
    left: '0',
    width: '1px',
    height: '1px',
    padding: '0',
    border: '0',
    opacity: '0',
  });
  const previouslyFocused = document.activeElement;
  document.body.appendChild(carrier);
  try {
    carrier.select();
    carrier.setSelectionRange(0, value.length);
    if (!document.execCommand('copy')) throw new Error('Clipboard API is unavailable.');
  } finally {
    carrier.remove();
    if (previouslyFocused && typeof previouslyFocused.focus === 'function') previouslyFocused.focus();
  }
}

/** Read-only secret field with controlled reveal duration and copy feedback. */
export function SecretField({
  label = '비밀 값',
  value = '',
  helper,
  error,
  invalid = false,
  actionContext,
  revealable = true,
  copyable = true,
  revealDurationMs = 10000,
  revealed,
  defaultRevealed = false,
  onRevealChange,
  onCopy,
  onCopyError,
  revealLabel = '보기',
  hideLabel = '숨기기',
  copyLabel = '복사',
  copiedLabel = '복사됨',
  copyErrorLabel = '복사 실패',
  disabled = false,
  size = 'md',
  id,
  style,
  ...rest
}) {
  const controlled = revealed !== undefined;
  const [internalRevealed, setInternalRevealed] = React.useState(defaultRevealed);
  const [copyState, setCopyState] = React.useState('idle');
  const requestedShow = controlled ? revealed : internalRevealed;
  const hasValue = String(value).length > 0;
  const canReveal = revealable && !disabled && hasValue;
  const show = canReveal && requestedShow;
  const timerRef = React.useRef(null);
  const copyTimerRef = React.useRef(null);
  const copyRequestRef = React.useRef(0);
  const onRevealChangeRef = React.useRef(onRevealChange);
  const autoId = React.useId();
  const inputId = id ?? `secret-${autoId}`;
  const fieldLabel = actionContext === false ? '' : textLabel(actionContext ?? label, '비밀 값');
  onRevealChangeRef.current = onRevealChange;

  React.useEffect(() => {
    if (!requestedShow || canReveal) return;
    if (!controlled) setInternalRevealed(false);
    onRevealChangeRef.current?.(false);
  }, [canReveal, controlled, requestedShow]);

  React.useEffect(() => {
    if (timerRef.current) window.clearTimeout(timerRef.current);
    if (!show || revealDurationMs <= 0) return undefined;
    timerRef.current = window.setTimeout(() => {
      if (!controlled) setInternalRevealed(false);
      onRevealChangeRef.current?.(false);
    }, revealDurationMs);
    return () => window.clearTimeout(timerRef.current);
  }, [controlled, revealDurationMs, show]);

  React.useEffect(() => {
    copyRequestRef.current += 1;
    if (copyTimerRef.current) window.clearTimeout(copyTimerRef.current);
    setCopyState('idle');
  }, [copyable, disabled, value]);

  React.useEffect(() => () => {
    copyRequestRef.current += 1;
    if (copyTimerRef.current) window.clearTimeout(copyTimerRef.current);
  }, []);

  const setShow = (next) => {
    if (next && !canReveal) return;
    if (!controlled) setInternalRevealed(next);
    onRevealChangeRef.current?.(next);
  };

  const copy = async () => {
    if (disabled || !copyable || !hasValue) return;
    if (copyTimerRef.current) window.clearTimeout(copyTimerRef.current);
    const copiedValue = String(value);
    const requestId = ++copyRequestRef.current;
    try {
      await writeToClipboard(copiedValue);
      onCopy?.(copiedValue);
      if (requestId !== copyRequestRef.current) return;
      setCopyState('success');
    } catch (error) {
      onCopyError?.(error);
      if (requestId !== copyRequestRef.current) return;
      setCopyState('error');
    }
    copyTimerRef.current = window.setTimeout(() => setCopyState('idle'), 1400);
  };
  const revealActionLabel = contextualActionLabel(fieldLabel, show ? hideLabel : revealLabel);
  const copyActionText = copyState === 'success' ? copiedLabel : copyState === 'error' ? copyErrorLabel : copyLabel;
  const copyActionLabel = contextualActionLabel(fieldLabel, copyActionText);
  const copyTone = disabled || !hasValue
    ? undefined
    : copyState === 'success'
      ? 'var(--color-semantic-status-positive)'
      : copyState === 'error'
        ? 'var(--color-semantic-status-negative)'
        : undefined;
  const actions = revealable || copyable ? (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-0)' }}>
      {revealable && <IconButton variant="plain" round={false} size="sm" disabled={disabled || !hasValue} aria-controls={inputId} onClick={() => setShow(!show)} label={revealActionLabel}><Icon name={show ? 'eye-slash' : 'eye'} size={16} aria-hidden="true" /></IconButton>}
      {copyable && <IconButton variant="plain" round={false} size="sm" disabled={disabled || !hasValue} aria-controls={inputId} onClick={copy} label={copyActionLabel} style={copyTone ? { color: copyTone } : undefined}><Icon name={copyState === 'success' ? 'circle-check' : copyState === 'error' ? 'circle-close' : 'copy'} size={16} aria-hidden="true" /></IconButton>}
    </span>
  ) : undefined;
  const autoHideNotice = show && revealDurationMs > 0
    ? `${Math.ceil(revealDurationMs / 1000)}초 후 자동으로 숨깁니다.`
    : '';
  return (
    // `position: relative` anchors the sr-only announcer below to this field
    // instead of the document body.
    <div style={{ position: 'relative', display: 'grid', gap: 'var(--space-1)', ...style }}>
      <Input
        {...rest}
        id={inputId}
        label={label}
        value={value}
        type={show ? 'text' : 'password'}
        readOnly
        disabled={disabled}
        invalid={invalid}
        error={error}
        size={size}
        helper={helper ?? (autoHideNotice || undefined)}
        actionRight={actions}
        autoComplete="off"
        autoCapitalize="off"
        autoCorrect="off"
        spellCheck={false}
      />
      <span role="status" aria-live="polite" style={{ position: 'absolute', width: 1, height: 1, padding: 0, margin: -1, overflow: 'hidden', clip: 'rect(0, 0, 0, 0)', whiteSpace: 'nowrap', border: 0 }}>
        {copyState === 'success' || copyState === 'error'
          ? copyActionLabel
          : autoHideNotice /* WCAG 2.2.1: the reveal time limit must be announced, not only shown as helper text. */}
      </span>
    </div>
  );
}
