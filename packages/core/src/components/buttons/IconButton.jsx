import React from 'react';

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
 * LK ROBOTICS — IconButton
 * Circular control wrapping a single icon glyph (source-model icon buttons are always
 * circular; pass `round={false}` to opt into the rounded-square look). Pass an
 * inline SVG as children. Matches Button's calm hover (minimal tone shift, no
 * lift).
 *
 * variant: soft (cool-gray) · solid (graphite) · signal (cyan-ink) ·
 *          ghost (hairline) · on-dark (translucent white, for navy)
 */
export function IconButton({
  children,
  variant = 'soft',
  size = 'medium',
  alternative = false,
  round = true,
  label,
  style,
  disabled = false,
  disable = false,
  onMouseEnter,
  onMouseLeave,
  onMouseDown,
  onMouseUp,
  onKeyDown,
  onKeyUp,
  onBlur,
  className,
  onClick,
  type,
  'aria-disabled': ariaDisabled,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const [pressed, setPressed] = React.useState(false);
  useMissingNameWarning(
    !label && rest['aria-labelledby'] == null,
    '[LDS] IconButton: label은 아이콘 전용 컨트롤의 접근 가능한 이름입니다. label(또는 aria-labelledby)을 전달하세요.',
  );
  const resolvedSize = typeof size === 'number'
    ? size
    : ({
        xsmall: 'var(--component-icon-button-size-xs)',
        xs: 'var(--component-icon-button-size-xs)',
        custom: 'var(--component-icon-button-size-custom)',
        small: 'var(--component-icon-button-size-sm)',
        sm: 'var(--component-icon-button-size-sm)',
        medium: 'var(--component-icon-button-size-md)',
        md: 'var(--component-icon-button-size-md)',
      }[size] || 'var(--component-icon-button-size-md)');
  const palettes = {
    soft:    { bg: 'var(--color-semantic-secondary-surface)', bgHover: 'var(--color-semantic-secondary-surface)', fg: 'var(--color-semantic-label-normal)', bd: 'none' },
    solid:   { bg: 'var(--color-semantic-secondary-normal)', bgHover: 'var(--color-semantic-secondary-normal)', fg: 'var(--color-semantic-static-white)', bd: 'none' },
    signal:  { bg: 'var(--color-semantic-primary-normal)', bgHover: 'var(--color-semantic-primary-normal)', fg: 'var(--color-semantic-static-white)', bd: 'none' },
    ghost:   { bg: 'var(--color-semantic-background-elevated-normal)', bgHover: 'var(--color-semantic-background-elevated-normal)', fg: 'var(--color-semantic-label-normal)', bd: '1px solid var(--color-semantic-line-solid-normal)' },
    plain:   { bg: 'transparent', bgHover: 'color-mix(in srgb, var(--viewer-foreground, var(--color-semantic-label-normal)) 7%, transparent)', fg: 'var(--viewer-foreground, var(--color-semantic-label-normal))', bd: '1px solid transparent' },
    'on-dark': {
      bg: 'color-mix(in srgb, var(--color-semantic-static-white) 10%, transparent)',
      bgHover: 'color-mix(in srgb, var(--color-semantic-static-white) 18%, transparent)',
      fg: 'var(--color-semantic-static-white)',
      bd: '1px solid color-mix(in srgb, var(--color-semantic-static-white) 18%, transparent)',
    },
  };
  const p = palettes[alternative ? 'on-dark' : variant] || palettes.soft;
  const disabledState = disabled || disable;
  const ariaBlocked = ariaDisabled === true || ariaDisabled === 'true';
  const blocked = disabledState || ariaBlocked;
  return (
    <button
      {...rest}
      type={type ?? 'button'}
      aria-label={label}
      aria-disabled={ariaBlocked || undefined}
      className={['lk-iconbtn', `lk-iconbtn--${variant}`, className].filter(Boolean).join(' ')}
      disabled={disabledState}
      onClick={(event) => {
        if (blocked) {
          event.preventDefault();
          return;
        }
        onClick?.(event);
      }}
      onMouseEnter={(e) => { setHover(true); onMouseEnter && onMouseEnter(e); }}
      onMouseLeave={(e) => { setHover(false); setPressed(false); onMouseLeave && onMouseLeave(e); }}
      onMouseDown={(e) => { if (!blocked) setPressed(true); onMouseDown?.(e); }}
      onMouseUp={(e) => { setPressed(false); onMouseUp?.(e); }}
      onKeyDown={(e) => {
        if (!blocked && (e.key === 'Enter' || e.key === ' ')) setPressed(true);
        onKeyDown?.(e);
      }}
      onKeyUp={(e) => {
        if (e.key === 'Enter' || e.key === ' ') setPressed(false);
        onKeyUp?.(e);
      }}
      onBlur={(e) => { setPressed(false); onBlur?.(e); }}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: resolvedSize,
        height: resolvedSize,
        color: blocked ? 'var(--color-semantic-label-disable)' : p.fg,
        background: blocked
          ? 'var(--color-semantic-fill-normal)'
          : pressed
            ? `color-mix(in srgb, ${p.bgHover || p.bg} 88%, var(--color-semantic-label-normal))`
            : hover
              ? `color-mix(in srgb, ${p.bgHover || p.bg} 96%, var(--color-semantic-label-normal))`
              : p.bg,
        border: blocked
          ? 'var(--border-thin) solid var(--color-semantic-line-normal-neutral)'
          : p.bd,
        borderRadius: round ? 'var(--radius-pill)' : 'var(--radius-md)',
        cursor: blocked ? 'not-allowed' : 'pointer',
        opacity: 1,
        boxShadow: 'none',
        transition: 'var(--component-button-transition)',
        WebkitTapHighlightColor: 'transparent',
        ...style,
      }}
    >
      {children}
    </button>
  );
}
