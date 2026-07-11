import React from 'react';

/**
 * LK ROBOTICS — FormField
 * A labelled wrapper for any control: label (+ required mark), the control
 * (children), and a helper or error line. Error state tints the message red.
 */
export function FormField({ label, required = false, helper, error, htmlFor, children, style, ...rest }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontFamily: 'var(--font-sans)', ...style }} {...rest}>
      {label != null && (
        <label htmlFor={htmlFor} style={{ fontSize: 'var(--label1-size)', fontWeight: 'var(--fw-bold)', letterSpacing: 0, color: 'var(--color-semantic-label-normal)' }}>
          {label}
          {required && <span style={{ color: 'var(--color-semantic-status-negative-text)', marginLeft: 3 }}>*</span>}
        </label>
      )}
      {children}
      {(error != null || helper != null) && (
        <span style={{ fontSize: 'var(--label2-size)', lineHeight: 1.5, color: error != null ? 'var(--color-semantic-status-negative-text)' : 'var(--color-semantic-label-neutral)' }}>{error != null ? error : helper}</span>
      )}
    </div>
  );
}
