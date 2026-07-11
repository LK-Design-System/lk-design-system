import React from 'react';
import { Spinner } from '../status/Spinner.jsx';

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
  loadingLabel = 'Loading',
  as = 'button',
  style,
  onMouseEnter,
  onMouseLeave,
  onClick,
  type,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const normalizedSize = {
    small: 'sm',
    medium: 'md',
    large: 'lg',
  }[size] || size;
  const normalizedColor = color === 'assistive' ? 'assistive' : color === 'primary' ? 'primary' : undefined;
  const textColor = normalizedColor === 'assistive'
    ? 'var(--color-semantic-label-alternative)'
    : normalizedColor === 'primary'
      ? 'var(--color-semantic-primary-heavy)'
      : tone === 'neutral' ? 'var(--color-semantic-label-neutral)' : tone === 'danger' ? 'var(--color-semantic-status-negative-text)' : 'var(--color-semantic-primary-heavy)';
  const fs = normalizedSize === 'sm' ? 'var(--label1-size)' : normalizedSize === 'lg' ? 17 : 'var(--body1-size)';
  const ls = normalizedSize === 'sm' ? 'var(--label1-spacing)' : 'var(--body1-spacing)';
  const h = normalizedSize === 'sm' ? 28 : normalizedSize === 'lg' ? 36 : 32;
  const disabledState = disabled || disable || loading;
  const Comp = as;
  return (
    <Comp
      className="lk-textbtn"
      disabled={as === 'button' ? disabledState : undefined}
      type={as === 'button' ? (type ?? 'button') : undefined}
      aria-busy={loading || undefined}
      aria-disabled={as !== 'button' && disabledState ? true : undefined}
      onMouseEnter={(e) => { setHover(true); onMouseEnter && onMouseEnter(e); }}
      onMouseLeave={(e) => { setHover(false); onMouseLeave && onMouseLeave(e); }}
      onClick={(e) => {
        if (disabledState) {
          e.preventDefault();
          return;
        }
        onClick && onClick(e);
      }}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 4, minHeight: h, padding: 0, border: 'none', background: 'transparent',
        fontFamily: 'var(--font-sans)', fontSize: fs, fontWeight: 'var(--fw-semibold)', letterSpacing: ls,
        color: disabledState ? 'var(--color-semantic-label-disable)' : textColor,
        opacity: !disabledState && hover ? 'var(--component-button-text-hover-opacity)' : 1,
        cursor: disabledState ? 'not-allowed' : 'pointer',
        textDecoration: underline ? 'underline' : 'none', textUnderlineOffset: '3px',
        transition: 'var(--component-button-transition)', ...style,
      }}
      {...rest}
    >
      {loading && (
        <>
          <Spinner size={14} color="currentColor" aria-hidden="true" />
          <span style={{ position: 'absolute', width: 1, height: 1, padding: 0, margin: -1, overflow: 'hidden', clip: 'rect(0, 0, 0, 0)', whiteSpace: 'nowrap', border: 0 }}>
            {loadingLabel}
          </span>
        </>
      )}
      <span>{children}</span>
    </Comp>
  );
}
