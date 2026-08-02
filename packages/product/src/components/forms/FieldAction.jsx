import React from 'react';
import { FormField } from '@lk-design-system/lds-core/components/forms/FormField';

const CONTROL_HEIGHTS = {
  sm: 'var(--control-h-sm)',
  md: 'var(--control-h-md)',
  lg: 'var(--control-h-lg)',
};

function normalizeSize(size) {
  return {
    small: 'sm',
    medium: 'md',
    large: 'lg',
  }[size] || size;
}

/**
 * A field plus one adjacent action with a shared density and responsive layout.
 * The field and action remain separate native controls; products retain value,
 * validation, submission, loading, and side-effect ownership.
 */
export const FieldAction = React.forwardRef(function FieldAction({
  as = 'div',
  field,
  action,
  size = 'md',
  label,
  helper,
  error,
  required = false,
  htmlFor,
  className,
  style,
  ...rest
}, forwardedRef) {
  const normalizedSize = normalizeSize(size);
  const controlHeight = CONTROL_HEIGHTS[normalizedSize] || CONTROL_HEIGHTS.md;
  const Comp = as;

  const fieldNode = React.isValidElement(field)
    ? React.cloneElement(field, {
        size: normalizedSize,
        style: {
          width: '100%',
          minWidth: 0,
          ...field.props.style,
        },
      })
    : field;
  const actionNode = React.isValidElement(action)
    ? React.cloneElement(action, {
        size: normalizedSize,
        style: {
          ...action.props.style,
          height: controlHeight,
        },
      })
    : action;

  return (
    <Comp
      {...rest}
      ref={forwardedRef}
      className={['lk-field-action', className].filter(Boolean).join(' ')}
      style={{
        width: '100%',
        minWidth: 0,
        containerType: 'inline-size',
        ...style,
      }}
    >
      <style>
        {`@container (max-width: 360px) {
          .lk-field-action__row {
            grid-template-columns: minmax(0, 1fr) !important;
          }
          .lk-field-action__action,
          .lk-field-action__action > .lk-btn {
            width: 100% !important;
          }
        }`}
      </style>
      <FormField
        label={label}
        helper={helper}
        error={error}
        required={required}
        htmlFor={htmlFor}
      >
        <div
          className="lk-field-action__row"
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1fr) max-content',
            alignItems: 'start',
            gap: 'var(--space-2)',
            minWidth: 0,
          }}
        >
          <div className="lk-field-action__field" style={{ minWidth: 0 }}>
            {fieldNode}
          </div>
          <div
            className="lk-field-action__action"
            style={{ display: 'inline-flex', alignItems: 'flex-start', minWidth: 0 }}
          >
            {actionNode}
          </div>
        </div>
      </FormField>
    </Comp>
  );
});
