import React from 'react';
import { Button } from '../buttons/Button.jsx';

const DIGITS = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

function resolveDecimalSeparator(locale) {
  try {
    return new Intl.NumberFormat(locale).formatToParts(1.1)
      .find((part) => part.type === 'decimal')?.value ?? '.';
  } catch {
    return '.';
  }
}

function resolveLengthLimit(maxLength) {
  return Number.isInteger(maxLength) && maxLength >= 0 ? maxLength : undefined;
}

function isConfirmableValue(value, { mode, allowNegative, min, max, maxLength }) {
  const completePattern = mode === 'decimal'
    ? /^-?\d+(?:\.\d+)?$/
    : /^-?\d+$/;

  if (!completePattern.test(value)) return false;
  if (!allowNegative && value.startsWith('-')) return false;
  if (maxLength !== undefined && value.length > maxLength) return false;

  const numericValue = Number(value);
  if (!Number.isFinite(numericValue)) return false;
  if (min !== undefined && numericValue < min) return false;
  if (max !== undefined && numericValue > max) return false;
  return true;
}

function EmptyKeyCell() {
  return (
    <span
      aria-hidden="true"
      style={{ minHeight: 'var(--component-button-height-lg)' }}
    />
  );
}

/**
 * Three-column, controlled numeric keypad for kiosk and embedded product flows.
 * Values stay canonical strings so partial decimal/sign input is never coerced.
 */
export function VirtualKeypad({
  value,
  onChange,
  onConfirm,
  mode = 'integer',
  allowNegative = false,
  locale = 'ko-KR',
  min,
  max,
  maxLength,
  disabled = false,
  confirmDisabled = false,
  targetId,
  clearLabel = '모두 지우기',
  backspaceLabel = '마지막 자리 지우기',
  signLabel = '부호 전환',
  confirmLabel = '확인',
  className,
  style,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  ...rest
}) {
  const currentValue = String(value ?? '');
  const lengthLimit = resolveLengthLimit(maxLength);
  const canGrow = lengthLimit === undefined || currentValue.length < lengthLimit;
  const decimalSeparator = resolveDecimalSeparator(locale);
  const changeUnavailable = disabled || typeof onChange !== 'function';
  const confirmValid = isConfirmableValue(currentValue, {
    mode,
    allowNegative,
    min,
    max,
    maxLength: lengthLimit,
  });
  const confirmUnavailable = disabled
    || confirmDisabled
    || !confirmValid
    || typeof onConfirm !== 'function';

  const preserveTargetFocus = (event) => {
    if (!targetId) return;
    const ownerDocument = event.currentTarget.ownerDocument;
    const target = ownerDocument.getElementById(targetId);
    if (target?.tagName === 'INPUT' && ownerDocument.activeElement === target) {
      event.preventDefault();
    }
  };

  const commit = (nextValue, meta) => {
    if (changeUnavailable || nextValue === currentValue) return;
    if (lengthLimit !== undefined && nextValue.length > lengthLimit) return;
    onChange(nextValue, meta);
  };

  const commonButtonProps = {
    size: 'lg',
    full: true,
    'aria-controls': targetId,
    onPointerDown: preserveTargetFocus,
    style: {
      minWidth: 0,
      paddingInline: 'var(--space-2)',
      fontVariantNumeric: 'tabular-nums',
    },
  };

  const renderDigit = (digit) => (
    <Button
      {...commonButtonProps}
      key={digit}
      variant="flat"
      disabled={changeUnavailable || !canGrow}
      data-keypad-action="digit"
      data-keypad-key={digit}
      onClick={() => commit(`${currentValue}${digit}`, { action: 'digit', key: digit })}
    >
      {digit}
    </Button>
  );

  const toggleSign = () => {
    const nextValue = currentValue.startsWith('-')
      ? currentValue.slice(1)
      : `-${currentValue}`;
    commit(nextValue, { action: 'sign', key: '-' });
  };

  const insertDecimal = () => {
    if (currentValue.includes('.')) return;
    const nextValue = currentValue === ''
      ? '0.'
      : currentValue === '-'
        ? '-0.'
        : `${currentValue}.`;
    commit(nextValue, { action: 'decimal', key: '.' });
  };

  return (
    <div
      {...rest}
      role="group"
      aria-label={ariaLabel ?? (ariaLabelledBy ? undefined : '숫자 키패드')}
      aria-labelledby={ariaLabelledBy}
      aria-disabled={disabled || undefined}
      data-lds-virtual-keypad=""
      data-mode={mode}
      data-confirm-valid={confirmValid ? 'true' : 'false'}
      className={className}
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
        gap: 'var(--space-2)',
        width: 'min(100%, 304px)',
        maxWidth: '100%',
        padding: 'var(--space-3)',
        boxSizing: 'border-box',
        border: 'var(--border-thin) solid var(--color-semantic-line-normal-normal)',
        borderRadius: 'var(--radius-xl)',
        background: 'var(--color-semantic-background-normal-alternative)',
        color: 'var(--color-semantic-label-normal)',
        fontFamily: 'var(--font-sans)',
        touchAction: 'manipulation',
        userSelect: 'none',
        ...style,
      }}
    >
      {DIGITS.map(renderDigit)}

      {allowNegative ? (
        <Button
          {...commonButtonProps}
          variant="ghost"
          aria-label={signLabel}
          disabled={changeUnavailable || (!currentValue.startsWith('-') && !canGrow)}
          data-keypad-action="sign"
          data-keypad-key="-"
          onClick={toggleSign}
        >
          ±
        </Button>
      ) : <EmptyKeyCell />}

      {renderDigit('0')}

      {mode === 'decimal' ? (
        <Button
          {...commonButtonProps}
          variant="ghost"
          disabled={changeUnavailable || currentValue.includes('.') || !canGrow}
          data-keypad-action="decimal"
          data-keypad-key="."
          onClick={insertDecimal}
        >
          {decimalSeparator}
        </Button>
      ) : <EmptyKeyCell />}

      <Button
        {...commonButtonProps}
        variant="ghost"
        aria-label={clearLabel}
        disabled={changeUnavailable || currentValue.length === 0}
        data-keypad-action="clear"
        data-keypad-key="Clear"
        onClick={() => commit('', { action: 'clear', key: 'Clear' })}
      >
        C
      </Button>

      <Button
        {...commonButtonProps}
        variant="ghost"
        aria-label={backspaceLabel}
        disabled={changeUnavailable || currentValue.length === 0}
        data-keypad-action="backspace"
        data-keypad-key="Backspace"
        onClick={() => commit(currentValue.slice(0, -1), { action: 'backspace', key: 'Backspace' })}
      >
        ⌫
      </Button>

      <Button
        {...commonButtonProps}
        variant="primary"
        disabled={confirmUnavailable}
        data-keypad-action="confirm"
        data-keypad-key="Enter"
        onClick={() => onConfirm?.(currentValue)}
      >
        {confirmLabel}
      </Button>
    </div>
  );
}
