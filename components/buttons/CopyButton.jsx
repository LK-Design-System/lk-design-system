import React from 'react';

/**
 * LK ROBOTICS — CopyButton
 * Copies `value` to the clipboard and flips to a check + "복사됨" for ~1.4s. A
 * cool-gray flat button by default.
 */
export function CopyButton({ value, children = '복사', copiedLabel = '복사됨', size = 'md', style, ...rest }) {
  const [copied, setCopied] = React.useState(false);
  const copy = async () => {
    try { await navigator.clipboard.writeText(String(value)); } catch (e) { /* no-op */ }
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  };
  const h = size === 'sm' ? 36 : 44;
  return (
    <button
      type="button" onClick={copy}
      style={{ display: 'inline-flex', alignItems: 'center', gap: 7, height: h, padding: '0 14px', border: 'none', borderRadius: 'var(--radius-md)', cursor: 'pointer', background: copied ? 'var(--lk-accent-tint-2)' : 'var(--bw-indigo-tint)', color: copied ? 'var(--lk-accent-ink)' : 'var(--label-normal)', fontFamily: 'var(--font-sans)', fontSize: 14, fontWeight: 'var(--fw-bold)', letterSpacing: '-0.1px', transition: 'background var(--dur-fast) var(--ease-out), color var(--dur-fast) var(--ease-out)', ...style }}
      {...rest}
    >
      {copied
        ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
        : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="11" height="11" rx="2.5" /><path d="M5 15V5a2 2 0 0 1 2-2h10" /></svg>}
      <span>{copied ? copiedLabel : children}</span>
    </button>
  );
}
