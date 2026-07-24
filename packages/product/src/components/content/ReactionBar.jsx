import React from 'react';
import { Icon } from '@lk-robotics/lds-core/components/icon/Icon';

// Compact large counts the way feeds do (1240 → "1.2천"), truncating rather than
// rounding so a value never crosses into the next unit (9999 → "9.9천", not
// "10천"). The accessible name keeps the full number, so screen-reader users
// still hear the exact count.
function formatCountKo(n) {
  if (typeof n !== 'number' || !Number.isFinite(n)) return n;
  const abs = Math.abs(n);
  if (abs < 1000) return String(n);
  const [divisor, unit] = abs < 10000 ? [1000, '천'] : abs < 100000000 ? [10000, '만'] : [100000000, '억'];
  return `${Math.floor((n / divisor) * 10) / 10}${unit}`;
}

/* The visible count duplicates what the button's accessible name already states,
   so it is hidden from assistive tech to avoid a double reading. */
function Count({ children }) {
  return (
    <span
      aria-hidden="true"
      style={{
        fontSize: 'var(--caption1-size)', fontWeight: 'var(--fw-medium)',
        color: 'var(--color-semantic-label-alternative)', fontVariantNumeric: 'tabular-nums',
      }}
    >
      {children}
    </span>
  );
}

/* A bare reaction control — feed engagement icons carry no persistent background
   or border, unlike the toolbar icon-button primitives. At rest it is just the
   glyph; a faint circular backdrop appears only on hover/pointer-press, and an
   active like turns the glyph filled + accent. Keyboard focus/activation and the
   :focus-visible ring come from the native <button>. */
function ReactionControl({ label, pressed, active, onClick, boxSize, children }) {
  const [hover, setHover] = React.useState(false);
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={pressed}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onBlur={() => setHover(false)}
      style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        width: boxSize, height: boxSize, padding: 0, border: 'none',
        background: hover ? 'var(--color-semantic-fill-normal)' : 'transparent',
        borderRadius: 'var(--radius-full)',
        color: active ? 'var(--color-semantic-primary-normal)' : 'var(--color-semantic-label-alternative)',
        cursor: 'pointer',
        transition: 'background var(--dur-fast) var(--ease-out), color var(--dur-fast) var(--ease-out)',
      }}
    >
      {children}
    </button>
  );
}

/**
 * LK ROBOTICS — ReactionBar
 * The engagement strip under a post, comment, or article: like (a toggle),
 * comment, and share, each with an optional count.
 *
 * The controls are BARE — no persistent background or border — because that is
 * how social feeds render engagement icons; the toolbar icon-button primitives
 * would wrap each glyph in a chip/circle. The like keeps an on/off `aria-pressed`
 * state and swaps heart ↔ heart-fill with an accent colour.
 *
 * Accessibility — each action's count is folded into the control's accessible
 * name (`좋아요 12개`) while the visible number is `aria-hidden`, so a control is
 * announced once with its count. The bar is a `role="group"`; name it with
 * `aria-label` when several bars share a page.
 */
export function ReactionBar({
  like,
  comment,
  share,
  size = 'md',
  align = 'start',
  formatCount = formatCountKo,
  children,
  style,
  ...rest
}) {
  const iconSize = size === 'sm' ? 18 : 20;
  const boxSize = size === 'sm' ? 28 : 32;

  // The like state lives here so the glyph can swap (heart ↔ heart-fill) and the
  // colour turn accent. Controlled when `like.active` is provided.
  const likeControlled = !!like && like.active !== undefined;
  const [likeInternal, setLikeInternal] = React.useState(like?.defaultActive ?? false);
  const likeActive = like ? (likeControlled ? like.active : likeInternal) : false;
  const handleLike = () => {
    const next = !likeActive;
    if (like && !likeControlled) setLikeInternal(next);
    like?.onToggle?.(next);
  };

  const withCount = (base, count) => (count == null ? base : `${base} ${count}개`);
  const item = { display: 'inline-flex', alignItems: 'center', gap: 'var(--space-1)' };

  return (
    <div
      role="group"
      style={{
        display: 'flex', alignItems: 'center', gap: 'var(--space-2)',
        justifyContent: align === 'between' ? 'space-between' : 'flex-start',
        ...style,
      }}
      {...rest}
    >
      {like && (
        <span style={item}>
          <ReactionControl
            label={withCount(like.label ?? '좋아요', like.count)}
            pressed={likeActive}
            active={likeActive}
            onClick={handleLike}
            boxSize={boxSize}
          >
            <Icon name={likeActive ? 'heart-fill' : 'heart'} size={iconSize} aria-hidden="true" />
          </ReactionControl>
          {like.count != null && <Count>{formatCount(like.count)}</Count>}
        </span>
      )}
      {comment && (
        <span style={item}>
          <ReactionControl label={withCount(comment.label ?? '댓글', comment.count)} onClick={comment.onClick} boxSize={boxSize}>
            <Icon name="message" size={iconSize} aria-hidden="true" />
          </ReactionControl>
          {comment.count != null && <Count>{formatCount(comment.count)}</Count>}
        </span>
      )}
      {share && (
        <span style={item}>
          <ReactionControl label={withCount(share.label ?? '공유', share.count)} onClick={share.onClick} boxSize={boxSize}>
            <Icon name="share" size={iconSize} aria-hidden="true" />
          </ReactionControl>
          {share.count != null && <Count>{formatCount(share.count)}</Count>}
        </span>
      )}
      {children}
    </div>
  );
}
