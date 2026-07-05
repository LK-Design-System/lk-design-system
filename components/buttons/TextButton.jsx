import React from 'react';

/**
 * LK ROBOTICS — TextButton
 * A no-chrome text action — inline links, card footers, "더보기". Takes the
 * signal ink (or neutral / danger); dims to ~72% on hover, optional trailing
 * arrow that nudges. Render as an anchor with `as="a"`.
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
        color, opacity: disabled ? 0.45 : (hover ? 0.72 : 1), cursor: disabled ? 'not-allowed' : 'pointer',
        textDecoration: underline ? 'underline' : 'none', textUnderlineOffset: '3px',
        transition: 'opacity var(--dur-fast) var(--ease-out)', ...style,
      }}
      {...rest}
    >
      <span>{children}</span>
      {arrow && (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ transform: hover && !disabled ? 'translateX(3px)' : 'none', transition: 'transform var(--dur-base) var(--ease-out)' }}>
          <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
        </svg>
      )}
    </Comp>
  );
}
