import React from 'react';
import { Input } from './Input.jsx';
import { IconButton } from '../buttons/IconButton.jsx';
import { Icon } from '../icon/Icon.jsx';

/** Read-only secret field with controlled reveal duration and copy feedback. */
export function SecretField({
  label = '비밀 값',
  value = '',
  helper,
  revealable = true,
  copyable = true,
  revealDurationMs = 10000,
  revealed,
  defaultRevealed = false,
  onRevealChange,
  onCopy,
  onCopyError,
  copyLabel = '복사',
  copiedLabel = '복사됨',
  copyErrorLabel = '복사 실패',
  disabled = false,
  style,
  ...rest
}) {
  const controlled = revealed !== undefined;
  const [internalRevealed, setInternalRevealed] = React.useState(defaultRevealed);
  const [copyState, setCopyState] = React.useState('idle');
  const show = controlled ? revealed : internalRevealed;
  const timerRef = React.useRef(null);
  const copyTimerRef = React.useRef(null);
  const onRevealChangeRef = React.useRef(onRevealChange);
  onRevealChangeRef.current = onRevealChange;

  React.useEffect(() => {
    if (timerRef.current) window.clearTimeout(timerRef.current);
    if (!show || revealDurationMs <= 0) return undefined;
    timerRef.current = window.setTimeout(() => {
      if (!controlled) setInternalRevealed(false);
      onRevealChangeRef.current?.(false);
    }, revealDurationMs);
    return () => window.clearTimeout(timerRef.current);
  }, [controlled, revealDurationMs, show]);

  React.useEffect(() => () => {
    if (copyTimerRef.current) window.clearTimeout(copyTimerRef.current);
  }, []);
  const setShow = (next) => {
    if (!controlled) setInternalRevealed(next);
    onRevealChangeRef.current?.(next);
  };
  const copy = async () => {
    if (copyTimerRef.current) window.clearTimeout(copyTimerRef.current);
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard API is unavailable.');
      await navigator.clipboard.writeText(String(value));
      setCopyState('success');
      onCopy?.(value);
    } catch (error) {
      setCopyState('error');
      onCopyError?.(error);
    }
    copyTimerRef.current = window.setTimeout(() => setCopyState('idle'), 1400);
  };
  const actions = revealable || copyable ? (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-0)' }}>
      {revealable && <IconButton variant="plain" round={false} size="sm" disabled={disabled} onClick={() => setShow(!show)} label={show ? '비밀 값 숨기기' : '비밀 값 보기'}><Icon name={show ? 'eye-slash' : 'eye'} size={16} aria-hidden="true" /></IconButton>}
      {copyable && <IconButton variant="plain" round={false} size="sm" disabled={disabled} onClick={copy} label={copyState === 'success' ? copiedLabel : copyState === 'error' ? copyErrorLabel : copyLabel}><Icon name={copyState === 'success' ? 'circle-check' : 'copy'} size={16} aria-hidden="true" /></IconButton>}
    </span>
  ) : undefined;
  return (
    <div style={{ display: 'grid', gap: 'var(--space-1)', ...style }}>
      <Input
        {...rest}
        label={label}
        value={value}
        type={show ? 'text' : 'password'}
        readOnly
        disabled={disabled}
        helper={helper ?? (show && revealDurationMs > 0 ? `${Math.ceil(revealDurationMs / 1000)}초 후 자동으로 숨깁니다.` : undefined)}
        actionRight={actions}
        autoComplete="off"
        spellCheck={false}
      />
      <span role="status" aria-live="polite" style={{ position: 'absolute', width: 1, height: 1, padding: 0, margin: -1, overflow: 'hidden', clip: 'rect(0, 0, 0, 0)', whiteSpace: 'nowrap', border: 0 }}>
        {copyState === 'success' ? copiedLabel : copyState === 'error' ? copyErrorLabel : ''}
      </span>
    </div>
  );
}
