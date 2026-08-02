import React from 'react';
import { FormField } from './FormField.jsx';
import { componentVars, partClassName, partStyle } from '../internal/surface.js';

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
  classNames,
  styles,
  vars,
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
      data-slot="root"
      data-size={normalizedSize}
      className={partClassName(classNames, 'root', 'lk-field-action', className) || undefined}
      style={{
        ...componentVars(vars, '--lds-field-action-'),
        width: '100%',
        minWidth: 0,
        containerType: 'inline-size',
        ...partStyle(styles, 'root'),
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
        data-slot="fieldStack"
        className={partClassName(classNames, 'fieldStack') || undefined}
        style={partStyle(styles, 'fieldStack')}
        label={label}
        helper={helper}
        error={error}
        required={required}
        htmlFor={htmlFor}
      >
        <div
          data-slot="row"
          className={partClassName(classNames, 'row', 'lk-field-action__row') || undefined}
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1fr) max-content',
            alignItems: 'start',
            gap: 'var(--lds-field-action-gap, var(--space-2))',
            minWidth: 0,
            ...partStyle(styles, 'row'),
          }}
        >
          <div data-slot="field" className={partClassName(classNames, 'field', 'lk-field-action__field') || undefined} style={{ minWidth: 0, ...partStyle(styles, 'field') }}>
            {fieldNode}
          </div>
          <div
            data-slot="action"
            className={partClassName(classNames, 'action', 'lk-field-action__action') || undefined}
            style={{ display: 'inline-flex', alignItems: 'flex-start', minWidth: 0, ...partStyle(styles, 'action') }}
          >
            {actionNode}
          </div>
        </div>
      </FormField>
    </Comp>
  );
});
