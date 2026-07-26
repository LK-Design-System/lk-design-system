import React from 'react';
import { Icon } from '../icon/Icon.jsx';

export function mergeIds(...values) {
  const ids = values
    .flatMap((value) => String(value || '').split(/\s+/))
    .map((value) => value.trim())
    .filter(Boolean);
  return ids.length ? [...new Set(ids)].join(' ') : undefined;
}

export function useFieldMetadata({ prefix, id, label, helper, error, describedBy }) {
  const autoId = React.useId();
  const fieldId = id ?? `${prefix}-${autoId}`;
  const message = error ?? helper;
  const messageId = message != null ? `${fieldId}-message` : undefined;
  return {
    fieldId,
    message,
    messageId,
    describedBy: mergeIds(describedBy, messageId),
    hasMetadata: label != null || message != null,
  };
}

export function FieldLabel({ htmlFor, id, label, required = false, disabled = false }) {
  if (label == null) return null;
  return React.createElement(
    'label',
    {
      id,
      htmlFor,
      style: {
        color: disabled
          ? 'var(--color-semantic-label-disable)'
          : 'var(--color-semantic-label-normal)',
        fontSize: 'var(--component-input-label-font-size)',
        lineHeight: 'var(--component-input-label-line-height)',
        letterSpacing: 'var(--component-input-label-letter-spacing)',
        fontWeight: 'var(--component-input-label-font-weight)',
      },
    },
    label,
    required && React.createElement('span', { style: { color: 'var(--color-semantic-status-negative)' } }, ' *'),
  );
}

export function FieldMessage({ id, message, error, status = 'normal' }) {
  if (message == null) return null;
  return React.createElement(
    'span',
    {
      id,
      role: error != null ? 'alert' : undefined,
      style: {
        color: error != null || status === 'negative'
          ? 'var(--color-semantic-status-negative-text)'
          : status === 'positive'
            ? 'var(--color-semantic-status-positive-text)'
            : 'var(--color-semantic-label-neutral)',
        fontSize: 'var(--caption1-size)',
        lineHeight: 'var(--caption1-line)',
      },
    },
    message,
  );
}

export function FieldStack({ fieldId, labelId, label, required, messageId, message, error, status, fieldStyle, children }) {
  return React.createElement(
    'div',
    // `position: relative` anchors the absolutely positioned screen-reader live
    // regions that fields render (Caps Lock warnings, copy results) to the field
    // instead of the page, without adding a grid row.
    { style: { position: 'relative', display: 'grid', minWidth: 0, gap: 'var(--component-input-stack-gap)', ...fieldStyle } },
    React.createElement(FieldLabel, { htmlFor: fieldId, id: labelId, label, required }),
    children,
    React.createElement(FieldMessage, { id: messageId, message, error, status }),
  );
}

export function FieldStatusIcon({ invalid = false, status = 'normal', size = 16 }) {
  if (!invalid && status !== 'positive') return null;
  const negative = invalid || status === 'negative';
  return React.createElement(Icon, {
    name: negative ? 'circle-close-fill' : 'circle-check-fill',
    size,
    color: negative ? 'var(--color-semantic-status-negative)' : 'var(--color-semantic-status-positive)',
    'aria-hidden': 'true',
    style: { flex: '0 0 auto' },
  });
}

export function fieldBorderColor({ disabled = false, readOnly = false, invalid = false, status = 'normal', focused = false, hovered = false }) {
  if (disabled) return 'var(--color-semantic-line-normal-neutral)';
  if (invalid || status === 'negative') return 'var(--component-input-border-color-invalid)';
  if (status === 'positive') return 'var(--color-semantic-status-positive)';
  if (focused) return 'var(--component-input-border-color-focus)';
  if (hovered && !readOnly) return 'var(--color-semantic-line-solid-normal)';
  return 'var(--component-input-border-color)';
}

export function fieldBackground({ disabled = false, readOnly = false }) {
  if (disabled) return 'var(--color-semantic-fill-normal)';
  if (readOnly) return 'var(--color-semantic-fill-alternative)';
  return 'var(--color-semantic-background-elevated-normal)';
}
