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
    ? 'var(--label-neutral)'
    : normalizedColor === 'primary'
      ? 'var(--color-primary)'
      : tone === 'neutral' ? 'var(--label-neutral)' : tone === 'danger' ? 'var(--bw-red)' : 'var(--lk-accent-ink)';
  const fs = normalizedSize === 'sm' ? 14 : normalizedSize === 'lg' ? 17 : 16;
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
        fontFamily: 'var(--font-sans)', fontSize: fs, fontWeight: 'var(--fw-semibold)', letterSpacing: 0,
        color: textColor, opacity: disabledState ? 0.45 : (hover ? 'var(--component-button-text-hover-opacity)' : 1), cursor: disabledState ? 'not-allowed' : 'pointer',
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
