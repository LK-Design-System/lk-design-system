import React from 'react';
import { Spinner } from '../status/Spinner.jsx';

const BRAND_FOREGROUND = 'color-mix(in srgb, var(--color-semantic-primary-normal) 60%, var(--color-semantic-label-normal))';

/**
 * LK ROBOTICS — TextButton
 * A no-chrome text action — inline links, card footers, "더보기". Takes the
 * signal ink (or neutral / danger); dims slightly on hover. `arrow` is
 * deprecated and kept as a no-op for compatibility. Render as an anchor with
 * `as="a"`.
 */
export function TextButton({
  children,
  tone = 'signal',
  color,
  size = 'md',
  arrow = false,
  underline = false,
  disabled = false,
  disable = false,
  loading = false,
  loadingLabel = '불러오는 중',
  as = 'button',
  className,
  style,
  onMouseEnter,
  onMouseLeave,
  onMouseDown,
  onMouseUp,
  onKeyDown,
  onKeyUp,
  onBlur,
  onClick,
  type,
  'aria-label': ariaLabel,
  'aria-disabled': ariaDisabled,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const [pressed, setPressed] = React.useState(false);
  const normalizedSize = {
    small: 'sm',
    medium: 'md',
    large: 'lg',
  }[size] || size;
  const normalizedColor = color === 'assistive' ? 'assistive' : color === 'primary' ? 'primary' : undefined;
  const textColor = normalizedColor === 'assistive'
    ? 'var(--color-semantic-label-alternative)'
    : normalizedColor === 'primary'
      ? BRAND_FOREGROUND
      : tone === 'neutral' ? 'var(--color-semantic-label-neutral)' : tone === 'danger' ? 'var(--color-semantic-status-negative-text)' : BRAND_FOREGROUND;
  const fs = normalizedSize === 'sm' ? 'var(--label1-size)' : normalizedSize === 'lg' ? 17 : 'var(--body1-size)';
  const ls = normalizedSize === 'sm' ? 'var(--label1-spacing)' : 'var(--body1-spacing)';
  const h = normalizedSize === 'sm' ? 28 : normalizedSize === 'lg' ? 36 : 32;
  /* `loading` must not remove the control from the tab order — see Button. */
  const nativeDisabled = disabled || disable;
  const disabledState = nativeDisabled || loading;
  const ariaBlocked = ariaDisabled === true || ariaDisabled === 'true';
  const blocked = disabledState || ariaBlocked;
  const Comp = as;
  return (
    <Comp
      {...rest}
      className={['lk-textbtn', className].filter(Boolean).join(' ')}
      disabled={as === 'button' ? nativeDisabled : undefined}
      type={as === 'button' ? (type ?? 'button') : undefined}
      aria-label={loading ? loadingLabel : ariaLabel}
      aria-busy={loading || undefined}
      aria-disabled={ariaBlocked || loading || (as !== 'button' && disabledState) || undefined}
      onMouseEnter={(e) => { setHover(true); onMouseEnter && onMouseEnter(e); }}
      onMouseLeave={(e) => { setHover(false); setPressed(false); onMouseLeave && onMouseLeave(e); }}
      onMouseDown={(e) => { if (!blocked) setPressed(true); onMouseDown?.(e); }}
      onMouseUp={(e) => { setPressed(false); onMouseUp?.(e); }}
      onKeyDown={(e) => {
        if (!blocked && (e.key === 'Enter' || e.key === ' ')) setPressed(true);
        onKeyDown?.(e);
      }}
      onKeyUp={(e) => {
        if (e.key === 'Enter' || e.key === ' ') setPressed(false);
        onKeyUp?.(e);
      }}
      onBlur={(e) => { setPressed(false); onBlur?.(e); }}
      onClick={(e) => {
        if (blocked) {
          e.preventDefault();
          return;
        }
        onClick && onClick(e);
      }}
      style={{
        position: 'relative', display: 'inline-flex', alignItems: 'center', gap: 4, minHeight: h, padding: 0, border: 'none', background: 'transparent',
        fontFamily: 'var(--font-sans)', fontSize: fs, fontWeight: 'var(--fw-semibold)', letterSpacing: ls,
        color: blocked ? 'var(--color-semantic-label-disable)' : textColor,
        opacity: blocked ? 1 : pressed ? 0.76 : hover ? 'var(--component-button-text-hover-opacity)' : 1,
        cursor: blocked ? 'not-allowed' : 'pointer',
        textDecoration: underline ? 'underline' : 'none', textUnderlineOffset: '3px',
        transition: 'var(--component-button-transition)', ...style,
      }}
    >
      {loading && (
        <>
          <span aria-hidden="true" style={{ position: 'absolute', inset: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
            <Spinner size={14} color="currentColor" />
          </span>
          <span style={{ position: 'absolute', width: 1, height: 1, padding: 0, margin: -1, overflow: 'hidden', clip: 'rect(0, 0, 0, 0)', whiteSpace: 'nowrap', border: 0 }}>
            {loadingLabel}
          </span>
        </>
      )}
      <span aria-hidden={loading || undefined} style={{ visibility: loading ? 'hidden' : undefined }}>{children}</span>
    </Comp>
  );
}
