import React from 'react';

/**
 * LK ROBOTICS — TextButton
 * A no-chrome text action — inline links, card footers, "더보기". Takes the
 * signal ink (or neutral / danger); dims slightly on hover. `arrow` is
 * deprecated and kept as a no-op for compatibility. Render as an anchor with
 * `as="a"`.
 */
export function TextButton({
  children, tone = 'signal', size = 'md', arrow = false, underline = false,
  disabled = false, as = 'button', style, onMouseEnter, onMouseLeave, ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const color = tone === 'neutral' ? 'var(--label-neutral)' : tone === 'danger' ? 'var(--bw-red)' : 'var(--lk-accent-ink)';
  const fs = size === 'sm' ? 14 : size === 'lg' ? 17 : 16;
  const Comp = as;
  return (
    <Comp
      className="lk-textbtn"
      disabled={as === 'button' ? disabled : undefined}
      onMouseEnter={(e) => { setHover(true); onMouseEnter && onMouseEnter(e); }}
      onMouseLeave={(e) => { setHover(false); onMouseLeave && onMouseLeave(e); }}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 4, padding: 0, border: 'none', background: 'transparent',
        fontFamily: 'var(--font-sans)', fontSize: fs, fontWeight: 'var(--fw-semibold)', letterSpacing: '0.006em',
        color, opacity: disabled ? 0.45 : (hover ? 'var(--component-button-text-hover-opacity)' : 1), cursor: disabled ? 'not-allowed' : 'pointer',
        textDecoration: underline ? 'underline' : 'none', textUnderlineOffset: '3px',
        transition: 'var(--component-button-transition)', ...style,
      }}
      {...rest}
    >
      <span>{children}</span>
    </Comp>
  );
}
