import React from 'react';
import { Icon } from '../icon/Icon.jsx';

const radiusMap = {
  sm: 'var(--radius-frame-sm)',
  md: 'var(--radius-frame-md)',
  lg: 'var(--radius-frame-lg)',
  xl: 'var(--radius-frame-xl)',
};

const paddingMap = {
  sm: 'var(--space-3)',
  md: 'var(--space-4)',
  lg: 'var(--space-5)',
  xl: 'var(--space-6)',
};

const shadowMap = {
  none: 'none',
  xs: 'var(--shadow-xs)',
  sm: 'var(--shadow-sm)',
  md: 'var(--shadow-md)',
  lg: 'var(--shadow-lg)',
};

function joinIds(...ids) {
  const merged = ids.filter(Boolean).join(' ').trim();
  return merged || undefined;
}

/**
 * Selectable option card. Interactive cards use a native radio or checkbox.
 *
 * Naming — the native input previously forced `aria-label={title}`, which
 * overrode the wrapping `<label>` and dropped `description` from both the name
 * and the description. Now the title element names the input (`aria-labelledby`)
 * and the description is attached as a hint (`aria-describedby`, the GOV.UK
 * hint convention), so both are announced and neither is duplicated.
 */
export function ChoiceCard({
  children,
  selected = false,
  disabled = false,
  multiple = false,
  onSelect,
  name,
  inputValue,
  inputProps = {},
  title,
  description,
  icon,
  presentation = 'choice',
  status = 'normal',
  interaction,
  radius = 'md',
  padding = 'md',
  shadow,
  showIndicator = true,
  style,
  tabIndex,
  role,
  'aria-label': ariaLabel,
  onClick,
  onFocus,
  onBlur,
  onMouseEnter,
  onMouseLeave,
  onKeyDown,
  ...rootProps
}) {
  const autoId = React.useId();
  const inputId = inputProps.id ?? `choice-card-${autoId}`;
  const [hovered, setHovered] = React.useState(false);
  const [focused, setFocused] = React.useState(false);
  const isFrame = presentation === 'frame';
  const nativeChoice = typeof onSelect === 'function' && (role == null || role === 'radio' || role === 'checkbox');
  const customInteractive = !nativeChoice && !disabled && (onSelect || onClick);
  const resolvedRole = nativeChoice
    ? undefined
    : (role ?? (customInteractive ? (multiple ? 'checkbox' : 'radio') : undefined));
  const resolvedShadow = shadow ?? (isFrame ? 'xs' : 'none');
  const activeHover = hovered || interaction === 'hovered';
  const activeFocus = focused || interaction === 'focused';
  const interactive = nativeChoice || customInteractive;
  const Root = nativeChoice ? 'label' : 'div';
  const showsText = !isFrame;
  const titleId = showsText && title != null ? `${inputId}-title` : undefined;
  const descriptionId = showsText && description != null ? `${inputId}-description` : undefined;
  const explicitName = ariaLabel ?? inputProps['aria-label'];

  const choiceBorder = disabled
    ? 'var(--color-semantic-line-normal-neutral)'
    : selected
      ? 'var(--color-semantic-primary-normal)'
    : activeHover && !disabled
      ? 'var(--color-semantic-line-solid-normal)'
      : 'var(--color-semantic-line-normal-normal)';
  const frameBorder = disabled
    ? 'var(--color-semantic-line-normal-normal)'
    : status === 'negative'
      ? 'var(--color-semantic-status-negative)'
      : selected || activeFocus
        ? 'var(--color-semantic-primary-normal)'
        : activeHover
          ? 'var(--color-semantic-line-solid-normal)'
          : 'var(--color-semantic-line-normal-normal)';
  const frameInset = selected || activeFocus || status === 'negative' ? 2 : 1;
  const frameShadow = [
    shadowMap[resolvedShadow] && shadowMap[resolvedShadow] !== 'none' ? shadowMap[resolvedShadow] : null,
    `inset 0 0 0 ${frameInset}px ${frameBorder}`,
    activeFocus && !disabled ? '0 0 0 4px var(--color-semantic-focus-ring)' : null,
  ].filter(Boolean).join(', ');
  const choiceShadow = [
    `inset 0 0 0 ${selected ? 1.5 : 1}px ${choiceBorder}`,
    activeFocus && !disabled ? '0 0 0 4px var(--color-semantic-focus-ring)' : null,
  ].filter(Boolean).join(', ');

  const toggleCustom = () => {
    if (!disabled && onSelect) onSelect(multiple ? !selected : true);
  };
  const handleClick = (event) => {
    if (disabled) {
      event.preventDefault();
      return;
    }
    onClick?.(event);
    if (!nativeChoice && !event.defaultPrevented) toggleCustom();
  };
  const handleKeyDown = (event) => {
    onKeyDown?.(event);
    if (event.defaultPrevented || disabled || nativeChoice) return;
    if ((event.key === 'Enter' || event.key === ' ') && onSelect) {
      event.preventDefault();
      toggleCustom();
    }
  };

  const frameStyle = {
    position: 'relative',
    display: 'block',
    padding: paddingMap[padding] ?? paddingMap.md,
    borderRadius: radiusMap[radius] ?? radiusMap.md,
    background: disabled
      ? 'var(--color-semantic-fill-normal)'
      : selected
        ? 'var(--color-semantic-primary-surface-strong)'
        : 'var(--color-semantic-background-elevated-normal)',
    boxShadow: frameShadow,
    color: disabled ? 'var(--color-semantic-label-disable)' : 'var(--color-semantic-label-normal)',
    cursor: disabled ? 'not-allowed' : interactive ? 'pointer' : 'default',
    outline: 'none',
    transition: 'background var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out), color var(--dur-fast) var(--ease-out)',
    ...style,
  };

  const choiceStyle = {
    position: 'relative',
    display: 'flex',
    alignItems: 'flex-start',
    gap: 12,
    padding: 16,
    borderRadius: 'var(--radius-xl)',
    background: disabled
      ? 'var(--color-semantic-fill-normal)'
      : selected
        ? 'var(--color-semantic-primary-surface-normal)'
        : 'var(--color-semantic-background-elevated-normal)',
    color: disabled ? 'var(--color-semantic-label-disable)' : undefined,
    boxShadow: choiceShadow,
    cursor: disabled ? 'not-allowed' : interactive ? 'pointer' : 'default',
    transition: 'box-shadow var(--dur-fast) var(--ease-out), background var(--dur-fast) var(--ease-out)',
    outline: 'none',
    ...style,
  };

  return (
    <Root
      {...rootProps}
      htmlFor={nativeChoice ? inputId : undefined}
      role={resolvedRole}
      aria-checked={resolvedRole === 'checkbox' || resolvedRole === 'radio' ? selected : undefined}
      aria-selected={resolvedRole && ['option', 'tab', 'row', 'gridcell', 'treeitem'].includes(resolvedRole) ? selected || undefined : undefined}
      aria-disabled={!nativeChoice && disabled ? true : undefined}
      aria-label={!nativeChoice ? ariaLabel : undefined}
      aria-labelledby={!nativeChoice && resolvedRole
        ? (rootProps['aria-labelledby'] ?? (ariaLabel ? undefined : titleId))
        : rootProps['aria-labelledby']}
      aria-describedby={!nativeChoice && resolvedRole
        ? joinIds(rootProps['aria-describedby'], descriptionId)
        : rootProps['aria-describedby']}
      data-presentation={presentation}
      data-selected={selected ? '' : undefined}
      data-disabled={disabled ? '' : undefined}
      data-status={isFrame ? status : undefined}
      data-interaction={activeFocus ? 'focused' : activeHover ? 'hovered' : 'normal'}
      tabIndex={nativeChoice ? undefined : disabled ? -1 : (tabIndex ?? (customInteractive || resolvedRole ? 0 : undefined))}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onFocus={(event) => {
        if (!nativeChoice) setFocused(true);
        onFocus?.(event);
      }}
      onBlur={(event) => {
        if (!nativeChoice) setFocused(false);
        onBlur?.(event);
      }}
      onMouseEnter={(event) => { setHovered(true); onMouseEnter?.(event); }}
      onMouseLeave={(event) => { setHovered(false); onMouseLeave?.(event); }}
      style={isFrame ? frameStyle : choiceStyle}
    >
      {nativeChoice && (
        <input
          {...inputProps}
          id={inputId}
          type={multiple ? 'checkbox' : 'radio'}
          name={name ?? inputProps.name}
          value={inputValue ?? inputProps.value}
          checked={selected}
          disabled={disabled}
          tabIndex={tabIndex ?? inputProps.tabIndex}
          aria-label={explicitName}
          // The title element names the control; the wrapping <label> keeps that
          // job only when there is no title (e.g. a children-only card).
          aria-labelledby={explicitName ? undefined : (inputProps['aria-labelledby'] ?? titleId)}
          aria-describedby={joinIds(inputProps['aria-describedby'], descriptionId)}
          onChange={(event) => {
            inputProps.onChange?.(event);
            if (!event.defaultPrevented) onSelect(multiple ? event.target.checked : true);
          }}
          onFocus={(event) => {
            setFocused(true);
            inputProps.onFocus?.(event);
          }}
          onBlur={(event) => {
            setFocused(false);
            inputProps.onBlur?.(event);
          }}
          style={{
            position: 'absolute',
            width: 1,
            height: 1,
            padding: 0,
            margin: -1,
            overflow: 'hidden',
            clip: 'rect(0, 0, 0, 0)',
            whiteSpace: 'nowrap',
            border: 0,
            ...inputProps.style,
          }}
        />
      )}
      {!isFrame && icon != null && (
        <span
          aria-hidden="true"
          style={{
            flexShrink: 0,
            color: disabled
              ? 'var(--color-semantic-label-disable)'
              : selected
                ? 'var(--color-semantic-label-normal)'
                : 'var(--color-semantic-label-neutral)',
            display: 'inline-flex',
          }}
        >
          {icon}
        </span>
      )}
      <div style={isFrame ? undefined : { flex: 1, minWidth: 0 }}>
        {!isFrame && title != null && (
          <div id={titleId} style={{ fontSize: 'var(--body2-size)', fontWeight: 'var(--fw-bold)', letterSpacing: 0, color: disabled ? 'var(--color-semantic-label-disable)' : 'var(--color-semantic-label-strong)', wordBreak: 'keep-all' }}>
            {title}
          </div>
        )}
        {!isFrame && description != null && (
          <div id={descriptionId} style={{ marginTop: 'var(--space-1)', fontSize: 'var(--label2-size)', lineHeight: 1.55, color: disabled ? 'var(--color-semantic-label-disable)' : 'var(--color-semantic-label-neutral)', wordBreak: 'keep-all' }}>
            {description}
          </div>
        )}
        {children}
      </div>
      {!isFrame && showIndicator && (
        <span
          aria-hidden="true"
          data-choice-indicator=""
          style={{
            flexShrink: 0,
            width: 20,
            height: 20,
            borderRadius: multiple ? 'var(--radius-sm)' : '50%',
            background: disabled
              ? selected
                ? 'var(--color-semantic-fill-normal)'
                : 'transparent'
              : selected
                ? 'var(--color-semantic-primary-normal)'
                : 'transparent',
            boxShadow: disabled || !selected
              ? 'inset 0 0 0 1.5px var(--color-semantic-line-normal-neutral)'
              : 'none',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: disabled ? 'var(--color-semantic-label-disable)' : 'var(--color-semantic-static-white)',
            transition: 'background var(--dur-fast) var(--ease-out)',
          }}
        >
          {selected && (multiple
            ? <Icon name="check" size={12} aria-hidden="true" />
            : <span style={{ width: 12, height: 12, borderRadius: '50%', background: 'currentColor' }} />)}
        </span>
      )}
    </Root>
  );
}
