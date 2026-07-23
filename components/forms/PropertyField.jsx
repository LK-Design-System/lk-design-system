import React from 'react';
import { Button } from '../buttons/Button.jsx';
import { Switch } from '../selection/Switch.jsx';

/* label이 ReactNode여도 접근 가능 이름이 범용어로 붕괴하지 않도록 텍스트를 추출한다. */
function getLabelText(label) {
  if (label == null || typeof label === 'boolean') return '';
  if (typeof label === 'string' || typeof label === 'number') return String(label);
  if (Array.isArray(label)) return label.map(getLabelText).join('');
  if (React.isValidElement(label)) return getLabelText(label.props?.children);
  return '';
}

function normalizeNumberValue(value) {
  if (value === '') return '';
  const numeric = Number(value);
  return Number.isNaN(numeric) ? '' : numeric;
}

/**
 * LDS Product Selection and Input — PropertyField
 * A single tunable parameter row: label + control + per-field Apply. It is a
 * product settings pattern, not a new input primitive.
 */
export function PropertyField({
  label,
  hint,
  value: committed,
  type = 'text',
  min,
  max,
  step = 1,
  unit,
  disabled = false,
  readOnly = false,
  applyLabel = '적용',
  dirtyLabel = '변경됨',
  onApply,
  style,
  ...rest
}) {
  const fieldId = React.useId();
  const inputId = `property-${fieldId}`;
  const labelId = `${inputId}-label`;
  const hintId = hint != null ? `${inputId}-hint` : undefined;
  const unitId = type !== 'toggle' && unit != null ? `${inputId}-unit` : undefined;
  const dirtyId = `${inputId}-dirty`;
  const labelText = getLabelText(label).trim() || '속성';
  const applyText = typeof applyLabel === 'string' ? applyLabel : '적용';
  const [draft, setDraft] = React.useState(committed);
  const [focused, setFocused] = React.useState(false);

  React.useEffect(() => {
    setDraft(committed);
  }, [committed]);

  const dirty = draft !== committed;
  const interactionDisabled = disabled || readOnly;
  const canApply = dirty && !interactionDisabled && typeof onApply === 'function';
  const controlDisabled = disabled;
  const controlReadOnly = readOnly;
  const isToggle = type === 'toggle';
  /* 이름은 label 하나로 고정하고, dirty는 이름이 아니라 설명으로 노출한다(APG). */
  const descriptionIds = [hintId, unitId, dirty ? dirtyId : null].filter(Boolean).join(' ') || undefined;

  const apply = () => {
    if (canApply) onApply(draft);
  };

  /* Switch는 자체 <label>로 input을 감싸므로 두 번째 label을 만들지 않는다.
     보이는 라벨은 aria-labelledby로 연결하고 클릭 시 네이티브 입력을 대신 활성화한다. */
  const activateToggle = () => {
    if (typeof document === 'undefined') return;
    document.getElementById(inputId)?.click();
  };

  return (
    <div data-disabled={disabled ? "" : undefined}
      style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(128px, 1fr) auto auto',
        alignItems: 'center',
        columnGap: 'var(--space-3)',
        rowGap: 'var(--space-2)',
        width: '100%',
        minWidth: 0,
        padding: '8px 0',
        fontFamily: 'var(--font-sans)',
        boxSizing: 'border-box',
        ...style,
      }}
      {...rest}
    >
      <div style={{ display: 'grid', gap: 2, minWidth: 0 }}>
        {React.createElement(
          isToggle ? 'span' : 'label',
          {
            id: labelId,
            htmlFor: isToggle ? undefined : inputId,
            onClick: isToggle ? activateToggle : undefined,
            style: {
              minWidth: 0,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              fontSize: 'var(--label2-size)',
              lineHeight: 'var(--label2-line)',
              fontWeight: 'var(--fw-semibold)',
              letterSpacing: 0,
              cursor: isToggle && !disabled && !readOnly ? 'pointer' : undefined,
              color: disabled
                ? 'var(--color-semantic-label-disable)'
                : 'var(--color-semantic-label-normal)',
            },
          },
          label,
          dirty && (
            <span
              key="dirty-dot"
              aria-hidden="true"
              title={dirtyLabel}
              style={{
                marginLeft: 4,
                color: 'var(--color-semantic-status-cautionary)',
              }}
            >
              •
            </span>
          ),
        )}
        {/* dirty는 이름이 아니라 aria-describedby로 전달한다. */}
        <span id={dirtyId} hidden>{dirtyLabel}</span>
        {hint != null && (
          <span
            id={hintId}
            style={{
              minWidth: 0,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              fontSize: 'var(--caption1-size)',
              lineHeight: 'var(--caption1-line)',
              fontWeight: 'var(--fw-medium)',
              letterSpacing: 0,
              color: disabled
                ? 'var(--color-semantic-label-disable)'
                : 'var(--color-semantic-label-neutral)',
            }}
          >
            {hint}
          </span>
        )}
      </div>

      {isToggle ? (
        <Switch
          size="sm"
          id={inputId}
          checked={!!draft}
          disabled={disabled}
          readOnly={readOnly}
          aria-labelledby={labelId}
          aria-describedby={descriptionIds}
          onChange={(next) => setDraft(next)}
        />
      ) : (
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: 6,
            minWidth: 0,
          }}
        >
          <input
            id={inputId}
            type={type === 'number' ? 'number' : 'text'}
            value={draft ?? ''}
            min={min}
            max={max}
            step={step}
            disabled={controlDisabled}
            readOnly={controlReadOnly}
            aria-describedby={descriptionIds}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onChange={(event) => {
              setDraft(
                type === 'number'
                  ? normalizeNumberValue(event.target.value)
                  : event.target.value
              );
            }}
            onKeyDown={(event) => {
              if (event.key === 'Enter') apply();
              if (event.key === 'Escape') setDraft(committed);
            }}
            style={{
              width: type === 'number' ? 88 : 160,
              height: 34,
              padding: '0 10px',
              border: `1px solid ${
                focused
                  ? 'var(--component-input-border-color-focus)'
                  : dirty
                  ? 'var(--color-semantic-status-cautionary)'
                  : 'var(--component-input-border-color)'
              }`,
              borderRadius: 'var(--radius-md)',
              outline: 'none',
              boxShadow: focused ? 'var(--component-input-focus-shadow)' : 'none',
              background: controlDisabled
                ? 'var(--color-semantic-fill-normal)'
                : 'var(--color-semantic-background-elevated-normal)',
              fontFamily: 'inherit',
              fontSize: 'var(--label2-size)',
              lineHeight: 'var(--label2-line)',
              fontWeight: 'var(--fw-semibold)',
              letterSpacing: 0,
              color: controlDisabled
                ? 'var(--color-semantic-label-disable)'
                : 'var(--color-semantic-label-normal)',
              textAlign: type === 'number' ? 'right' : 'left',
              fontVariantNumeric: 'tabular-nums',
              boxSizing: 'border-box',
              transition: 'border-color var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out)',
            }}
          />
          {unit != null && (
            <span
              id={unitId}
              style={{
                minWidth: 24,
                fontSize: 'var(--caption1-size)',
                lineHeight: 'var(--caption1-line)',
                fontWeight: 'var(--fw-medium)',
                letterSpacing: 0,
                color: disabled
                  ? 'var(--color-semantic-label-disable)'
                  : 'var(--color-semantic-label-neutral)',
              }}
            >
              {unit}
            </span>
          )}
        </span>
      )}

      <Button
        size="sm"
        variant="solid"
        color="primary"
        disabled={!canApply}
        onClick={apply}
        aria-label={`${labelText} ${applyText}`}
      >
        {applyLabel}
      </Button>
    </div>
  );
}
