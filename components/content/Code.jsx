import React from 'react';

const MONO = 'var(--font-mono, ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace)';

/**
 * LK ROBOTICS — Code
 * Monospace code. Inline by default (tinted chip); `block` renders a navy
 * `<pre>` for multi-line snippets.
 */
export function Code({ children, block = false, style, ...rest }) {
  if (block) {
    return (
      <pre style={{ margin: 0, padding: '14px 16px', background: 'var(--surface-inverse)', color: 'var(--label-on-dark)', borderRadius: 'var(--radius-lg)', overflowX: 'auto', fontFamily: MONO, fontSize: 13, lineHeight: 1.6, ...style }} {...rest}>
        <code>{children}</code>
      </pre>
    );
  }
  return (
    <code style={{ padding: '2px 6px', background: 'var(--fill-strong)', color: 'var(--label-normal)', borderRadius: 'var(--radius-sm)', fontFamily: MONO, fontSize: '0.9em', ...style }} {...rest}>
      {children}
    </code>
  );
}
