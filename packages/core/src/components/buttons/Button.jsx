import React from 'react';
import { Spinner } from '../status/Spinner.jsx';
import { componentVars, partClassName, partStyle } from '../internal/surface.js';

const pressedTone = (background) =>
  `color-mix(in srgb, ${background} 88%, var(--color-semantic-label-normal))`;

/* Development-only guard: an icon-only control with no accessible name is
   invisible to assistive tech and the failure is silent at runtime. Bundlers
   replace `process.env.NODE_ENV` at build time — the same contract React itself
   relies on — so this branch disappears from production builds. The try/catch
   keeps it inert in environments that never define `process` at all. */
function isDevelopmentBuild() {
  try {
    return process.env.NODE_ENV !== 'production';
  } catch {
    return false;
  }
}

function useMissingNameWarning(shouldWarn, message) {
  React.useEffect(() => {
    if (!shouldWarn || !isDevelopmentBuild()) return;
    console.warn(message);
  }, [shouldWarn, message]);
}

/**
 * LK ROBOTICS — Button
 * Solid, rounded-rect CTAs driven entirely by design-system tokens.
 * Calm by default: hover keeps solid fills visually stable, with only minimal
 * tone changes for low-emphasis variants. No animation, positional lift, or
 * press scale. `arrow` is deprecated and kept as a no-op for compatibility.
 *
 * variant: primary (LK azure — brand) · secondary (graphite) · signal (LK cyan-ink) ·
 *          dark (navy) · flat (cool-gray) · ghost (hairline) · on-dark (translucent, for navy sections)
 *          · danger (LDS safety extension; not a WDS parity axis)
 */
export const Button = React.forwardRef(function Button({
  children,
  variant = 'primary',
  color,
  size = 'md',          // sm | md | lg
  arrow = false,
  full = false,
  disabled = false,
  disable = false,
  iconOnly = false,
  loading = false,
  loadingLabel = '불러오는 중',
  as = 'button',
  className,
  style,
  classNames,
  styles,
  vars,
  onMouseEnter,
  onMouseLeave,
  onMouseDown,
  onMouseUp,
  onKeyDown,
  onKeyUp,
  onBlur,
  onClick,
  type,
  'aria-label': ariaLabel,
  'aria-disabled': ariaDisabled,
  'aria-busy': ariaBusy,
  ...rest
}, forwardedRef) {
  const [hover, setHover] = React.useState(false);
  const [pressed, setPressed] = React.useState(false);

  useMissingNameWarning(
    iconOnly && !ariaLabel && rest['aria-labelledby'] == null,
    '[LDS] Button: iconOnly 버튼에는 aria-label(또는 aria-labelledby)이 필요합니다. 접근 가능한 이름이 없으면 스크린 리더에 이름 없는 버튼으로 노출됩니다.',
  );

  const heights = {
    sm: 'var(--component-button-height-sm)',
    md: 'var(--component-button-height-md)',
    lg: 'var(--component-button-height-lg)',
  };
  const pads = {
    sm: 'var(--component-button-padding-sm)',
    md: 'var(--component-button-padding-md)',
    lg: 'var(--component-button-padding-lg)',
  };
  const fonts = {
    sm: 'var(--component-button-font-size-sm)',
    md: 'var(--component-button-font-size-md)',
    lg: 'var(--component-button-font-size-lg)',
  };
  const lineHeights = {
    sm: 'var(--component-button-line-height-sm)',
    md: 'var(--component-button-line-height-md)',
    lg: 'var(--component-button-line-height-lg)',
  };
  const letterSpacings = {
    sm: 'var(--component-button-letter-spacing-sm)',
    md: 'var(--component-button-letter-spacing-md)',
    lg: 'var(--component-button-letter-spacing-lg)',
  };
  const gaps = {
    sm: 'var(--component-button-gap-sm)',
    md: 'var(--component-button-gap-md)',
    lg: 'var(--component-button-gap-lg)',
  };
  const radii = {
    sm: 'var(--component-button-radius-sm)',
    md: 'var(--component-button-radius-md)',
    lg: 'var(--component-button-radius-lg)',
  };
  const iconSizes = {
    sm: 'var(--component-button-icon-size-sm)',
    md: 'var(--component-button-icon-size-md)',
    lg: 'var(--component-button-icon-size-lg)',
  };
  const iconOnlyIconSizes = {
    sm: 'var(--component-button-icon-only-icon-size-sm)',
    md: 'var(--component-button-icon-only-icon-size-md)',
    lg: 'var(--component-button-icon-only-icon-size-lg)',
  };

  const normalizedSize = {
    small: 'sm',
    medium: 'md',
    large: 'lg',
  }[size] || size;
  const iconSize = iconOnly
    ? (iconOnlyIconSizes[normalizedSize] || iconOnlyIconSizes.md)
    : (iconSizes[normalizedSize] || iconSizes.md);
  const content = React.Children.toArray(children).map((child, index) => (
    typeof child === 'string' || typeof child === 'number'
      ? <span key={`text-${index}`}>{child}</span>
      : (
        <span
          key={`icon-${index}`}
          style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: iconSize, flexShrink: 0 }}
        >
          {child}
        </span>
      )
  ));
  const normalizedVariant = String(variant || 'primary').toLowerCase();
  const normalizedColor = String(color || 'primary').toLowerCase();
  const wdsVariant =
    normalizedVariant === 'solid' || normalizedVariant === 'outlined'
      ? `${normalizedVariant}-${normalizedColor === 'assistive' ? 'assistive' : 'primary'}`
      : normalizedVariant;

  const palettes = {
    primary: { bg: 'var(--component-button-primary-bg)', bgHover: 'var(--component-button-primary-bg-hover)', fg: 'var(--component-button-primary-fg)', bd: 'none', elevated: true },
    secondary: { bg: 'var(--component-button-secondary-bg)', bgHover: 'var(--component-button-secondary-bg-hover)', fg: 'var(--component-button-secondary-fg)', bd: 'none', elevated: true },
    signal: { bg: 'var(--component-button-signal-bg)', bgHover: 'var(--component-button-signal-bg-hover)', fg: 'var(--component-button-signal-fg)', bd: 'none', elevated: true },
    danger: { bg: 'var(--component-button-danger-bg)', bgHover: 'var(--component-button-danger-bg-hover)', fg: 'var(--component-button-danger-fg)', bd: 'none', elevated: false },
    dark: { bg: 'var(--component-button-dark-bg)', bgHover: 'var(--component-button-dark-bg-hover)', fg: 'var(--component-button-dark-fg)', bd: 'none', elevated: true },
    flat: { bg: 'var(--component-button-flat-bg)', bgHover: 'var(--component-button-flat-bg-hover)', fg: 'var(--component-button-flat-fg)', bd: 'none', elevated: false },
    ghost: { bg: 'var(--component-button-ghost-bg)', bgHover: 'var(--component-button-ghost-bg-hover)', fg: 'var(--component-button-ghost-fg)', bd: 'var(--component-button-ghost-border)', bdHover: 'var(--component-button-ghost-border-hover)', elevated: false },
    'on-dark': { bg: 'var(--component-button-on-dark-bg)', bgHover: 'var(--component-button-on-dark-bg-hover)', fg: 'var(--component-button-on-dark-fg)', bd: 'var(--component-button-on-dark-border)', elevated: false },
    'solid-primary': { bg: 'var(--component-button-primary-bg)', bgHover: 'var(--component-button-primary-bg-hover)', fg: 'var(--component-button-primary-fg)', bd: 'none', elevated: true },
    'solid-assistive': { bg: 'var(--component-button-flat-bg)', bgHover: 'var(--component-button-flat-bg-hover)', fg: 'var(--component-button-flat-fg)', bd: 'none', elevated: false },
    'outlined-primary': { bg: 'transparent', bgHover: 'var(--color-semantic-primary-surface-normal)', fg: 'var(--color-semantic-primary-normal)', bd: 'var(--border-thin) solid var(--color-semantic-line-normal-normal)', bdHover: 'var(--border-thin) solid var(--color-semantic-line-normal-normal)', elevated: false },
    'outlined-assistive': { bg: 'transparent', bgHover: 'var(--color-semantic-fill-normal)', fg: 'var(--color-semantic-label-normal)', bd: 'var(--border-thin) solid var(--color-semantic-line-normal-normal)', bdHover: 'var(--border-thin) solid var(--color-semantic-line-solid-normal)', elevated: false },
  };
  const p = palettes[wdsVariant] || palettes.primary;
  /* Only an explicit `disabled`/`disable` removes the control from the tab
     order. `loading` keeps it focusable (Polaris / Carbon) so a keyboard user
     who just activated the button does not lose focus to <body>; activation is
     blocked through aria-disabled + the click guard instead.

     `loading="inline"` is the second loading presentation: the spinner sits
     beside the label and the variant palette stays, instead of the default
     swap-for-spinner on the disabled palette. It exists for controls whose
     words must survive the wait — a safety stop that reads "정지 요청 중"
     may not become an unlabeled grey pill mid-request. Activation semantics
     (aria-busy, aria-disabled, click guard, focus retention) are identical
     in both modes; only the presentation differs. */
  /* Every aria attribute below must consume loadingActive, never the raw
     `loading` prop: the prop can be the string "inline", and a truthy string
     leaks verbatim into the attribute — aria-busy="inline" is not a boolean
     the accessibility tree accepts. */
  const loadingActive = Boolean(loading);
  const loadingInline = loading === 'inline';
  const nativeDisabled = disabled || disable;
  const disabledState = nativeDisabled || loadingActive;
  const ariaBlocked = ariaDisabled === true || ariaDisabled === 'true';
  const blocked = disabledState || ariaBlocked;
  const visuallyBlocked = nativeDisabled || ariaBlocked || (loadingActive && !loadingInline);
  const active = !blocked;
  const outlinedLike = wdsVariant.startsWith('outlined') || wdsVariant === 'ghost';
  const disabledBorder = outlinedLike
    ? 'var(--border-thin) solid var(--color-semantic-line-normal-neutral)'
    : p.bd;
  // Resolve disabled semantic roles at the use site. A component alias declared
  // on :root would otherwise retain its light value inside a nested dark scope.
  const disabledFg = 'var(--color-semantic-label-disable)';
  const disabledBg = outlinedLike ? 'transparent' : 'var(--color-semantic-fill-normal)';

  const composed = {
    ...componentVars(vars, '--lds-button-'),
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: `var(--lds-button-gap, ${gaps[normalizedSize] || gaps.md})`,
    height: `var(--lds-button-height, ${heights[normalizedSize] || heights.md})`,
    minWidth: iconOnly ? (heights[normalizedSize] || heights.md) : undefined,
    padding: iconOnly ? 0 : `var(--lds-button-padding, ${pads[normalizedSize] || pads.md})`,
    width: full ? '100%' : undefined,
    fontFamily: 'var(--font-sans)',
    fontSize: fonts[normalizedSize] || fonts.md,
    lineHeight: lineHeights[normalizedSize] || lineHeights.md,
    fontWeight: wdsVariant.endsWith('-assistive')
      ? 'var(--component-button-font-weight-assistive)'
      : 'var(--component-button-font-weight)',
    letterSpacing: letterSpacings[normalizedSize] || letterSpacings.md,
    position: 'relative',
    color: visuallyBlocked ? disabledFg : p.fg,
    background: visuallyBlocked
      ? disabledBg
      : pressed
        ? pressedTone(p.bgHover || p.bg)
        : hover && !blocked
          ? `color-mix(in srgb, ${p.bgHover || p.bg} 96%, var(--color-semantic-label-normal))`
          : p.bg,
    border: visuallyBlocked ? disabledBorder : (active && hover && p.bdHover) ? p.bdHover : p.bd,
    borderRadius: `var(--lds-button-radius, ${radii[normalizedSize] || radii.md})`,
    boxShadow: active && p.elevated ? 'var(--component-button-shadow-rest)' : 'none',
    transform: 'none',
    // Inline loading is temporal, not forbidden — the wait cursor, not the ban.
    cursor: blocked ? (loadingInline && !visuallyBlocked ? 'progress' : 'not-allowed') : 'pointer',
    opacity: 1,
    transition: 'var(--component-button-transition)',
    whiteSpace: 'nowrap',
    textDecoration: 'none',
    WebkitTapHighlightColor: 'transparent',
    ...partStyle(styles, 'root'),
    ...style,
  };

  const Comp = as;
  return (
    <Comp
      {...rest}
      ref={forwardedRef}
      data-slot="root"
      data-disabled={blocked ? 'true' : undefined}
      data-loading={loadingActive ? (loadingInline ? 'inline' : 'true') : undefined}
      data-size={normalizedSize}
      data-variant={wdsVariant}
      className={partClassName(classNames, 'root', 'lk-btn', `lk-btn--${wdsVariant}`, className)}
      style={composed}
      disabled={as === 'button' ? nativeDisabled : undefined}
      type={as === 'button' ? (type ?? 'button') : undefined}
      aria-label={loading === true ? loadingLabel : ariaLabel}
      aria-busy={loadingActive || ariaBusy || undefined}
      aria-disabled={ariaBlocked || loadingActive || (as !== 'button' && disabledState) || undefined}
      onMouseEnter={(e) => { setHover(true); onMouseEnter && onMouseEnter(e); }}
      onMouseLeave={(e) => { setHover(false); setPressed(false); onMouseLeave && onMouseLeave(e); }}
      onMouseDown={(e) => { if (!blocked) setPressed(true); onMouseDown && onMouseDown(e); }}
      onMouseUp={(e) => { setPressed(false); onMouseUp && onMouseUp(e); }}
      onKeyDown={(e) => {
        if (!blocked && (e.key === 'Enter' || e.key === ' ')) setPressed(true);
        onKeyDown?.(e);
      }}
      onKeyUp={(e) => {
        if (e.key === 'Enter' || e.key === ' ') setPressed(false);
        onKeyUp?.(e);
      }}
      onBlur={(e) => { setPressed(false); onBlur?.(e); }}
      onClick={(e) => {
        if (blocked) {
          e.preventDefault();
          return;
        }
        onClick && onClick(e);
      }}
    >
      {loading === true && (
        <>
          <span
            aria-hidden="true"
            data-slot="loader"
            className={partClassName(classNames, 'loader') || undefined}
            style={{ position: 'absolute', inset: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', ...partStyle(styles, 'loader') }}
          >
            <Spinner size={16} color="currentColor" />
          </span>
          <span style={{ position: 'absolute', width: 1, height: 1, padding: 0, margin: -1, overflow: 'hidden', clip: 'rect(0, 0, 0, 0)', whiteSpace: 'nowrap', border: 0 }}>
            {loadingLabel}
          </span>
        </>
      )}
      <span
        data-slot="content"
        className={partClassName(classNames, 'content') || undefined}
        aria-hidden={loading === true || undefined}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: gaps[normalizedSize] || gaps.md,
          visibility: loading === true ? 'hidden' : undefined,
          ...partStyle(styles, 'content'),
        }}
      >
        {loadingInline && (
          <span aria-hidden="true" style={{ display: 'inline-flex' }}>
            <Spinner size={14} color="currentColor" />
          </span>
        )}
        {content}
      </span>
    </Comp>
  );
});
