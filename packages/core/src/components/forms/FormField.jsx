import React from 'react';
import { FieldLabel, FieldMessage } from './field-shared.js';

/**
 * LK ROBOTICS — FormField
 * A labelled wrapper for any control: label (+ required mark), the control
 * (children), and a helper or error line. Error state tints the message red.
 */
export function FormField({ label, required = false, helper, error, htmlFor, children, style, ...rest }) {
  const message = error ?? helper;
  return (
    <div {...rest} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--component-input-stack-gap)', minWidth: 0, fontFamily: 'var(--font-sans)', ...style }}>
      <FieldLabel htmlFor={htmlFor} label={label} required={required} />
      {children}
      <FieldMessage message={message} error={error} />
    </div>
  );
}
