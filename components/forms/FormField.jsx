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
        <label htmlFor={htmlFor} style={{ fontSize: 14, fontWeight: 'var(--fw-bold)', letterSpacing: 0, color: 'var(--color-semantic-label-normal)' }}>
          {label}
          {required && <span style={{ color: 'var(--bw-red)', marginLeft: 3 }}>*</span>}
        </label>
      )}
      {children}
      {(error != null || helper != null) && (
        <span style={{ fontSize: 13, lineHeight: 1.5, color: error != null ? 'var(--bw-red)' : 'var(--color-semantic-label-alternative)' }}>{error != null ? error : helper}</span>
      )}
    </div>
  );
}
