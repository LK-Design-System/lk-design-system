import React from 'react';
import { Button } from '@lk-robotics/lds-core/components/buttons/Button';
import { Icon } from '@lk-robotics/lds-core/components/icon/Icon';

const VISUALLY_HIDDEN_STYLE = {
  position: 'absolute',
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: 'hidden',
  clip: 'rect(0 0 0 0)',
  whiteSpace: 'nowrap',
  border: 0,
};

const STATE_LABELS = {
  idle: null,
  submitting: '메시지를 보내는 중입니다.',
  streaming: '응답을 생성하는 중입니다.',
  stopping: '응답 중지를 요청하는 중입니다.',
};

const LINE_HEIGHT = 24;
const TEXTAREA_VERTICAL_INSET = 24;
const COMPACT_TEXTAREA_HEIGHT = 48;
const COMPACT_TEXTAREA_HEIGHT_TOKEN = 'var(--space-12)';
const ACTION_SLOT_SIZE_TOKEN = 'var(--component-button-height-sm)';

const useSafeLayoutEffect = typeof window === 'undefined'
  ? React.useEffect
  : React.useLayoutEffect;

function mergeIds(...ids) {
  const merged = ids
    .flatMap((id) => String(id || '').split(/\s+/))
    .filter(Boolean);
  return merged.length > 0 ? [...new Set(merged)].join(' ') : undefined;
}

/**
 * LK Product Extension for general conversations. MessageComposer owns a
 * product-neutral elevated input shell, controlled draft behavior, submit
 * modes, IME safety, disabled-reason, and focus contracts. Products own
 * transport state and compose optional actions into its slots.
 */
export function MessageComposer({
  value,
  onValueChange,
  onSubmit,
  state = 'idle',
  submitMode = 'enter',
  canSubmit,
  readOnly = false,
  statusLabel,
  formLabel = '메시지 작성',
  inputLabel = '메시지 입력',
  placeholder = '메시지를 입력하세요.',
  description,
  maxLength,
  minRows = 1,
  maxRows = 6,
  attachments,
  leadingActions,
  trailingActions,
  submitLabel = '메시지 보내기',
  stopLabel = '응답 중지',
  onStop,
  textareaProps = {},
  disabled = false,
  disabledReason,
  className,
  style,
  ...formProps
}) {
  const missingDisabledReason = disabledReason == null
    || (typeof disabledReason === 'string' && disabledReason.trim().length === 0);
  if (disabled && missingDisabledReason) {
    throw new Error('MessageComposer requires disabledReason when disabled is true.');
  }

  const generatedId = React.useId();
  const textareaRef = React.useRef(null);
  const compositionSessionRef = React.useRef(false);
  const [focused, setFocused] = React.useState(false);

  const {
    id: providedId,
    className: textareaClassName,
    style: textareaStyle,
    onChange: onTextareaChange,
    onKeyDown: onTextareaKeyDown,
    onFocus: onTextareaFocus,
    onBlur: onTextareaBlur,
    onCompositionStart: onTextareaCompositionStart,
    onCompositionEnd: onTextareaCompositionEnd,
    'aria-describedby': externalDescriptionIds,
    enterKeyHint: providedEnterKeyHint,
    ...restTextareaProps
  } = textareaProps;

  const textareaId = providedId || `message-composer-${generatedId}`;
  const descriptionId = description != null ? `${textareaId}-description` : undefined;
  const disabledReasonId = disabled ? `${textareaId}-disabled-reason` : undefined;
  const counterId = maxLength != null ? `${textareaId}-counter` : undefined;
  const statusId = `${textareaId}-status`;
  const normalizedMinRows = Math.max(1, Math.floor(Number(minRows) || 1));
  const normalizedMaxRows = Math.max(normalizedMinRows, Math.floor(Number(maxRows) || 6));
  const minimumHeight = Math.max(
    COMPACT_TEXTAREA_HEIGHT,
    normalizedMinRows * LINE_HEIGHT + TEXTAREA_VERTICAL_INSET,
  );
  const maximumHeight = Math.max(
    minimumHeight,
    normalizedMaxRows * LINE_HEIGHT + TEXTAREA_VERTICAL_INSET,
  );
  const nonIdle = state !== 'idle';
  const valueCanSubmit = String(value).trim().length > 0;
  const submitAllowed = !disabled
    && !readOnly
    && !nonIdle
    && (canSubmit ?? valueCanSubmit);
  const stopAllowed = !disabled
    && (state === 'submitting' || state === 'streaming')
    && typeof onStop === 'function';
  const resolvedStatusLabel = statusLabel !== undefined
    ? statusLabel
    : STATE_LABELS[state] ?? null;

  const resizeTextarea = React.useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = '0px';
    const nextHeight = Math.min(maximumHeight, Math.max(minimumHeight, textarea.scrollHeight));
    textarea.style.height = `${nextHeight}px`;
    textarea.style.overflowY = textarea.scrollHeight > maximumHeight ? 'auto' : 'hidden';
  }, [maximumHeight, minimumHeight]);

  useSafeLayoutEffect(() => {
    resizeTextarea();
  }, [resizeTextarea, value]);

  const restoreTextareaFocus = React.useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea || disabled) return;
    try {
      textarea.focus({ preventScroll: true });
    } catch {
      textarea.focus();
    }
  }, [disabled]);

  const submitValue = React.useCallback((reason) => {
    if (!submitAllowed) return;
    onSubmit?.(value, reason);
    // The composer does not clear the controlled value or infer a transport
    // transition. It only restores the editing focus after the callback.
    restoreTextareaFocus();
  }, [onSubmit, restoreTextareaFocus, submitAllowed, value]);

  const handleKeyDown = (event) => {
    onTextareaKeyDown?.(event);
    if (event.defaultPrevented || event.key !== 'Enter') return;

    const nativeEvent = event.nativeEvent || event;
    const composing = compositionSessionRef.current
      || nativeEvent.isComposing === true
      || event.isComposing === true
      || nativeEvent.keyCode === 229;
    if (composing || event.shiftKey || submitMode === 'button-only') return;

    if (submitMode === 'modifier-enter') {
      if (event.altKey || (!event.ctrlKey && !event.metaKey)) return;
      event.preventDefault();
      submitValue('modifier-enter');
      return;
    }

    if (event.ctrlKey || event.metaKey || event.altKey) return;
    event.preventDefault();
    submitValue('enter');
  };

  const hasLeadingActions = leadingActions != null;
  const hasTrailingActions = trailingActions != null;
  const textareaDescriptionIds = mergeIds(
    externalDescriptionIds,
    descriptionId,
    disabledReasonId,
    counterId,
  );

  return (
    <form
      {...formProps}
      className={['lk-message-composer', className].filter(Boolean).join(' ')}
      aria-label={formLabel}
      aria-busy={nonIdle || undefined}
      aria-disabled={disabled || undefined}
      data-state={state}
      data-submit-mode={submitMode}
      onSubmit={(event) => {
        event.preventDefault();
        submitValue('button');
      }}
      style={{
        display: 'grid',
        alignContent: 'start',
        gap: 'var(--space-2)',
        width: '100%',
        maxWidth: '100%',
        minWidth: 0,
        boxSizing: 'border-box',
        color: 'var(--color-semantic-label-normal)',
        fontFamily: 'var(--font-sans)',
        ...style,
      }}
    >
      <label htmlFor={textareaId} style={VISUALLY_HIDDEN_STYLE}>{inputLabel}</label>

      {description != null && (
        <p
          id={descriptionId}
          data-composer-description=""
          style={{
            margin: 0,
            color: 'var(--color-semantic-label-neutral)',
            fontSize: 'var(--caption1-size)',
            lineHeight: 'var(--caption1-line)',
          }}
        >
          {description}
        </p>
      )}

      {disabled && (
        <p
          id={disabledReasonId}
          data-composer-disabled-reason=""
          style={{
            margin: 0,
            color: 'var(--color-semantic-label-neutral)',
            fontSize: 'var(--caption1-size)',
            lineHeight: 'var(--caption1-line)',
          }}
        >
          {disabledReason}
        </p>
      )}

      <div
        data-composer-shell=""
        data-focused={focused ? 'true' : undefined}
        aria-disabled={disabled || undefined}
        inert={disabled || undefined}
        onClickCapture={disabled
          ? (event) => {
              event.preventDefault();
              event.stopPropagation();
            }
          : undefined}
        style={{
          display: 'grid',
          gap: 0,
          width: '100%',
          minWidth: 0,
          padding: 'var(--space-1)',
          boxSizing: 'border-box',
          background: disabled
            ? 'var(--color-semantic-fill-normal)'
            : readOnly
              ? 'var(--color-semantic-background-normal-alternative)'
              : 'var(--color-semantic-background-elevated-normal)',
          border: `var(--component-input-border-width) solid ${focused && !disabled
            ? 'var(--color-semantic-primary-normal)'
            : 'var(--color-semantic-line-normal-normal)'}`,
          borderRadius: 'var(--radius-xl)',
          boxShadow: focused && !disabled
            ? '0 0 0 var(--space-1) var(--color-semantic-focus-ring)'
            : 'var(--shadow-sm)',
          transition: 'border-color var(--dur-base) var(--ease-out), box-shadow var(--dur-base) var(--ease-out)',
        }}
      >
        {attachments != null && (
          <div
            data-composer-attachments=""
            style={{
              minWidth: 0,
              padding: 'var(--space-2) var(--space-2) 0',
              overflowWrap: 'anywhere',
            }}
          >
            {attachments}
          </div>
        )}

        <div
          data-composer-control-row=""
          style={{
            display: 'grid',
            gap: 0,
            width: '100%',
            minWidth: 0,
            boxSizing: 'border-box',
          }}
        >
          <textarea
            {...restTextareaProps}
            ref={textareaRef}
            id={textareaId}
            className={textareaClassName}
            data-composer-input=""
            rows={1}
            value={value}
            disabled={disabled}
            readOnly={readOnly}
            maxLength={maxLength}
            placeholder={placeholder}
            enterKeyHint={providedEnterKeyHint ?? (submitMode === 'enter' ? 'send' : 'enter')}
            aria-describedby={textareaDescriptionIds}
            onChange={(event) => {
              onValueChange?.(event.target.value, event);
              onTextareaChange?.(event);
            }}
            onKeyDown={handleKeyDown}
            onFocus={(event) => {
              setFocused(true);
              onTextareaFocus?.(event);
            }}
            onBlur={(event) => {
              setFocused(false);
              onTextareaBlur?.(event);
            }}
            onCompositionStart={(event) => {
              compositionSessionRef.current = true;
              onTextareaCompositionStart?.(event);
            }}
            onCompositionEnd={(event) => {
              compositionSessionRef.current = false;
              onTextareaCompositionEnd?.(event);
            }}
            style={{
              display: 'block',
              width: '100%',
              minWidth: 0,
              minHeight: normalizedMinRows === 1 ? COMPACT_TEXTAREA_HEIGHT_TOKEN : minimumHeight,
              maxHeight: maximumHeight,
              height: normalizedMinRows === 1 ? COMPACT_TEXTAREA_HEIGHT_TOKEN : minimumHeight,
              padding: 'var(--space-3) var(--space-2)',
              boxSizing: 'border-box',
              resize: 'none',
              overflowX: 'hidden',
              overflowY: 'hidden',
              border: 0,
              outline: 0,
              background: 'transparent',
              color: disabled
                ? 'var(--color-semantic-label-disable)'
                // Reference the semantic label directly: --component-input-text-color is
                // resolved once at :root, so it does not flip inside a dark theme scope.
                : 'var(--color-semantic-label-normal)',
              caretColor: 'var(--color-semantic-primary-normal)',
              fontFamily: 'var(--font-sans)',
              fontSize: 'var(--component-input-font-size)',
              lineHeight: 'var(--body1-line)',
              letterSpacing: 'var(--component-input-letter-spacing)',
              cursor: disabled ? 'not-allowed' : 'text',
              ...textareaStyle,
            }}
          />

          <div
            data-composer-actions-row=""
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-1)',
              width: '100%',
              minWidth: 0,
              minHeight: ACTION_SLOT_SIZE_TOKEN,
              padding: '0 var(--space-1) var(--space-1)',
              boxSizing: 'border-box',
              flexWrap: 'wrap',
            }}
          >
            {hasLeadingActions && (
              <div
                role="group"
                aria-label="메시지 앞쪽 동작"
                data-composer-leading-actions=""
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-1)',
                  flex: '1 1 auto',
                  minWidth: 0,
                  flexWrap: 'wrap',
                }}
              >
                {leadingActions}
              </div>
            )}

            {!hasLeadingActions && <span aria-hidden="true" style={{ flex: '1 1 auto' }} />}

            {hasTrailingActions && (
              <div
                role="group"
                aria-label="메시지 뒤쪽 동작"
                data-composer-trailing-actions=""
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-1)',
                  minWidth: 0,
                  marginInlineStart: hasLeadingActions ? 'auto' : 0,
                  flexWrap: 'wrap',
                }}
              >
                {trailingActions}
              </div>
            )}

            <div
              data-composer-primary-action=""
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: ACTION_SLOT_SIZE_TOKEN,
                minWidth: ACTION_SLOT_SIZE_TOKEN,
                minHeight: ACTION_SLOT_SIZE_TOKEN,
                boxSizing: 'border-box',
              }}
            >
              {nonIdle ? (
                <Button
                  type="button"
                  size="sm"
                  variant="primary"
                  iconOnly
                  aria-label={stopLabel}
                  disabled={!stopAllowed}
                  onClick={() => {
                    if (!stopAllowed) return;
                    onStop();
                  }}
                >
                  <Icon name="square-fill" size={16} aria-hidden="true" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  size="sm"
                  variant="primary"
                  iconOnly
                  aria-label={submitLabel}
                  disabled={!submitAllowed}
                >
                  <Icon name="send-fill" size={18} aria-hidden="true" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {(resolvedStatusLabel != null || maxLength != null) && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: 'var(--space-3)',
            minWidth: 0,
            color: 'var(--color-semantic-label-alternative)',
            fontSize: 'var(--caption2-size)',
            lineHeight: 'var(--caption2-line)',
          }}
        >
          <span id={statusId} role={resolvedStatusLabel != null ? 'status' : undefined}>
            {resolvedStatusLabel}
          </span>
          {maxLength != null && (
            <span id={counterId} data-composer-counter="" style={{ marginInlineStart: 'auto', fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}>
              {String(value).length}/{maxLength}
            </span>
          )}
        </div>
      )}
    </form>
  );
}
