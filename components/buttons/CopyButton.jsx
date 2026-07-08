import React from 'react';
import { Button } from './Button.jsx';

/**
 * LK ROBOTICS — CopyButton
 * Copies `value` to the clipboard and flips to a check + "복사됨" for ~1.4s. A
 * cool-gray flat button by default — composed from Button (variant="flat") so
 * the rest fill/transition come from the button tokens. Geometry and typography
 * are explicit style overrides: the 36/44 heights predate the Button height
 * scale (32/40/48) and are preserved exactly. Candidate for future
 * normalization onto the token scale (needs design sign-off).
 */
export function CopyButton({ value, children = '복사', copiedLabel = '복사됨', size = 'md', style, ...rest }) {
  const [copied, setCopied] = React.useState(false);
  const copy = async () => {
    try { await navigator.clipboard.writeText(String(value)); } catch (e) { /* no-op */ }
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  };
  return (
    <Button
      variant="flat"
      size={size}
      onClick={copy}
      style={{
        // Overrides that intentionally diverge from the Button md/sm recipe —
        // kept to avoid any visual change; normalize in a future pass.
        gap: 7,
        height: size === 'sm' ? 36 : 44,
        padding: '0 14px',
        borderRadius: 'var(--radius-md)',
        fontSize: 14,
        lineHeight: 'normal',
        fontWeight: 'var(--fw-bold)',
        letterSpacing: 0,
        color: copied ? 'var(--color-semantic-primary-normal)' : 'var(--color-semantic-label-normal)',
        ...(copied ? { background: 'var(--lk-accent-tint-2)' } : null),
        ...style,
      }}
      {...rest}
    >
      {copied
        ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
        : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="11" height="11" rx="2.5" /><path d="M5 15V5a2 2 0 0 1 2-2h10" /></svg>}
      {copied ? copiedLabel : children}
    </Button>
  );
}
