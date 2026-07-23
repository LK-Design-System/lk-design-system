import React from 'react';

const visuallyHidden = {
  position: 'absolute',
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
  whiteSpace: 'nowrap',
  border: 0,
};

/**
 * LK ROBOTICS — Chip
 * Mixed-case keyword chip — white box, hairline border, per-size source-model radius. The
 * recurring "applied product / capability" token (적용 제품, 핵심 기술). Pass
 * `as="a"` + `href` for a link chip; hover lifts the border + text to the
 * signal ink.
 *
 * Accessibility — an `onClick` chip renders a real `<button>` (unless `as` is set
 * explicitly) so it is reachable by Tab and activated by Enter/Space. When a
 * toggle state (`selected` / `active` / `pressed`) is also supplied the button
 * carries `aria-pressed`, so selection is not conveyed by colour alone
 * (WCAG 2.2 1.4.1 Use of Colour). A non-interactive selected chip cannot own
 * `aria-pressed`, so it appends a visually hidden `selectedLabel` instead.
 */
export function Chip(props) {
  const {
    children,
    as,
    size = 'md',
    variant = 'default',
    active = false,
    selected = false,
    pressed,
    disabled = false,
    disable = false,
    leading,
    thumbnail,
    selectedLabel = '선택됨',
    style,
    onMouseEnter,
    onMouseLeave,
    onClick,
    onKeyDown,
    ...rest
  } = props;
  const [hover, setHover] = React.useState(false);
  const disabledState = disabled || disable;
  const pressedState = pressed ?? (active || selected);
  const hasToggleState = 'selected' in props || 'active' in props || 'pressed' in props;
  const interactive = typeof onClick === 'function';
  // Default element: a real button as soon as the chip does something on click.
  const resolvedAs = as ?? (interactive ? 'button' : 'span');
  const isButton = resolvedAs === 'button';
  // A non-button element that still handles clicks needs button semantics by hand.
  const needsButtonRole = interactive && !isButton && resolvedAs !== 'a';
  const activeState = active || selected || (hover && !disabledState);
  const normalizedSize = {
    xsmall: 'xs',
    small: 'sm',
    medium: 'md',
    large: 'lg',
  }[size] || size;
  const sizes = {
    xs: {
      height: 'var(--component-chip-height-xs)',
      paddingX: 'var(--component-chip-padding-x-xs)',
      fontSize: 'var(--component-chip-font-size-xs)',
      letterSpacing: 'var(--component-chip-letter-spacing-xs)',
      gap: 'var(--component-chip-gap-xs)',
      radius: 'var(--component-chip-radius-xs)',
      media: 'var(--component-chip-media-size-xs)',
    },
    sm: {
      height: 'var(--component-chip-height-sm)',
      paddingX: 'var(--component-chip-padding-x-sm)',
      fontSize: 'var(--component-chip-font-size-sm)',
      letterSpacing: 'var(--component-chip-letter-spacing-sm)',
      gap: 'var(--component-chip-gap-sm)',
      radius: 'var(--component-chip-radius-sm)',
      media: 'var(--component-chip-media-size-sm)',
    },
    md: {
      height: 'var(--component-chip-height-md)',
      paddingX: 'var(--component-chip-padding-x-md)',
      fontSize: 'var(--component-chip-font-size-md)',
      letterSpacing: 'var(--component-chip-letter-spacing-md)',
      gap: 'var(--component-chip-gap-md)',
      radius: 'var(--component-chip-radius-md)',
      media: 'var(--component-chip-media-size-md)',
    },
    lg: {
      height: 'var(--component-chip-height-lg)',
      paddingX: 'var(--component-chip-padding-x-lg)',
      fontSize: 'var(--component-chip-font-size-lg)',
      letterSpacing: 'var(--component-chip-letter-spacing-lg)',
      gap: 'var(--component-chip-gap-lg)',
      radius: 'var(--component-chip-radius-lg)',
      media: 'var(--component-chip-media-size-lg)',
    },
  };
  const s = sizes[normalizedSize] || sizes.md;
  const palettes = {
    default: {
      bg: activeState ? 'var(--component-chip-bg-selected)' : 'var(--component-chip-bg)',
      bgHover: activeState ? 'var(--component-chip-bg-selected)' : 'var(--component-chip-bg-hover)',
      fg: activeState ? 'var(--component-chip-fg-active)' : 'var(--component-chip-fg)',
      border: activeState ? 'var(--component-chip-border-active)' : 'var(--component-chip-border)',
    },
    outlined: {
      bg: 'transparent',
      bgHover: activeState ? 'var(--component-chip-bg-selected)' : 'transparent',
      fg: activeState ? 'var(--component-chip-fg-active)' : 'var(--component-chip-fg)',
      border: activeState ? 'var(--component-chip-border-active)' : 'var(--component-chip-border)',
    },
    solid: {
      bg: 'var(--component-chip-solid-bg)',
      bgHover: 'var(--component-chip-solid-bg)',
      fg: 'var(--component-chip-solid-fg)',
      border: 'var(--component-chip-solid-border)',
    },
  };
  const p = palettes[variant] || palettes.default;
  const Comp = resolvedAs;
  // aria-pressed only belongs on something with button semantics.
  const ariaPressed = hasToggleState && (isButton || needsButtonRole) && !disabledState
    ? pressedState
    : undefined;
  // Colour is not the only selection cue for a plain, non-interactive chip.
  const hiddenSelectedLabel = ariaPressed === undefined && pressedState && selectedLabel
    ? selectedLabel
    : null;
  return (
    <Comp
      type={isButton ? (rest.type ?? 'button') : undefined}
      disabled={isButton ? disabledState : undefined}
      aria-disabled={!isButton && disabledState ? true : undefined}
      role={needsButtonRole ? (rest.role ?? 'button') : rest.role}
      tabIndex={needsButtonRole && !disabledState ? (rest.tabIndex ?? 0) : rest.tabIndex}
      aria-pressed={ariaPressed}
      onMouseEnter={(e) => { setHover(true); onMouseEnter && onMouseEnter(e); }}
      onMouseLeave={(e) => { setHover(false); onMouseLeave && onMouseLeave(e); }}
      onKeyDown={(e) => {
        onKeyDown && onKeyDown(e);
        if (e.defaultPrevented || !needsButtonRole || disabledState) return;
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick(e);
        }
      }}
      onClick={(e) => {
        if (disabledState) {
          e.preventDefault();
          return;
        }
        onClick && onClick(e);
      }}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: s.gap, height: s.height, paddingInline: s.paddingX,
        background: hover && !disabledState ? p.bgHover : p.bg,
        border: p.border,
        borderRadius: s.radius,
        fontFamily: 'var(--font-sans)', fontSize: s.fontSize, fontWeight: 'var(--component-chip-font-weight)', letterSpacing: s.letterSpacing,
        color: disabledState ? 'var(--color-semantic-label-disable)' : p.fg,
        opacity: 1,
        margin: isButton ? 0 : undefined,
        appearance: isButton ? 'none' : undefined,
        WebkitAppearance: isButton ? 'none' : undefined,
        whiteSpace: 'nowrap', textDecoration: 'none',
        cursor: disabledState ? 'not-allowed' : (resolvedAs === 'a' || onClick || rest.onClick ? 'pointer' : 'default'),
        transition: 'color var(--dur-fast) var(--ease-out), border-color var(--dur-fast) var(--ease-out), background var(--dur-fast) var(--ease-out)',
        ...style,
      }}
      {...rest}
    >
      {thumbnail && (
        <span
          aria-hidden="true"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: s.media,
            height: s.media,
            borderRadius: 'var(--radius-sm)',
            overflow: 'hidden',
            flexShrink: 0,
            marginLeft: `calc(${s.gap} * -1)`,
          }}
        >
          {thumbnail}
        </span>
      )}
      {!thumbnail && leading && (
        <span aria-hidden="true" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          {leading}
        </span>
      )}
      {children}
      {hiddenSelectedLabel && <span style={visuallyHidden}>{hiddenSelectedLabel}</span>}
    </Comp>
  );
}
