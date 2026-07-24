import React from 'react';
import { Icon } from '../icon/Icon.jsx';
import { ToggleIcon } from '../buttons/ToggleIcon.jsx';
import { IconButton } from '../buttons/IconButton.jsx';

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

/**
 * LK ROBOTICS — ReactionBar
 * The engagement strip under a post, comment, or article: like (a toggle),
 * comment, and share, each with an optional count. Reuses `ToggleIcon` for the
 * like state and `IconButton` for the one-shot actions rather than reinventing
 * icon controls.
 *
 * Accessibility — each action's count is folded into the control's accessible
 * name (`좋아요 12개`) and the visible number is `aria-hidden`, so a control is
 * announced once with its count. The like control carries `aria-pressed` via
 * `ToggleIcon`, so its label stays the static noun and the pressed state conveys
 * on/off. The bar is a `role="group"`; name it with `aria-label` when several
 * bars share a page.
 */
export function ReactionBar({
  like,
  comment,
  share,
  size = 'md',
  align = 'start',
  children,
  style,
  ...rest
}) {
  const iconSize = size === 'sm' ? 18 : 20;
  const controlSize = size === 'sm' ? 'sm' : 'md';

  // The like state lives here so the glyph can swap (heart ↔ heart-fill) on top
  // of ToggleIcon's colour toggle. Controlled when `like.active` is provided.
  const likeControlled = !!like && like.active !== undefined;
  const [likeInternal, setLikeInternal] = React.useState(like?.defaultActive ?? false);
  const likeActive = like ? (likeControlled ? like.active : likeInternal) : false;
  const handleLike = (next) => {
    if (like && !likeControlled) setLikeInternal(next);
    like?.onToggle?.(next);
  };

  const withCount = (base, count) => (count == null ? base : `${base} ${count}개`);
  const item = { display: 'inline-flex', alignItems: 'center', gap: 'var(--space-1)' };

  return (
    <div
      role="group"
      style={{
        display: 'flex', alignItems: 'center', gap: 'var(--space-3)',
        justifyContent: align === 'between' ? 'space-between' : 'flex-start',
        ...style,
      }}
      {...rest}
    >
      {like && (
        <span style={item}>
          <ToggleIcon
            pressed={likeActive}
            onChange={handleLike}
            size={controlSize}
            variant="plain"
            label={withCount(like.label ?? '좋아요', like.count)}
          >
            <Icon name={likeActive ? 'heart-fill' : 'heart'} size={iconSize} aria-hidden="true" />
          </ToggleIcon>
          {like.count != null && <Count>{like.count}</Count>}
        </span>
      )}
      {comment && (
        <span style={item}>
          <IconButton
            variant="ghost"
            round
            size={controlSize}
            label={withCount(comment.label ?? '댓글', comment.count)}
            onClick={comment.onClick}
          >
            <Icon name="message" size={iconSize} aria-hidden="true" />
          </IconButton>
          {comment.count != null && <Count>{comment.count}</Count>}
        </span>
      )}
      {share && (
        <span style={item}>
          <IconButton
            variant="ghost"
            round
            size={controlSize}
            label={withCount(share.label ?? '공유', share.count)}
            onClick={share.onClick}
          >
            <Icon name="share" size={iconSize} aria-hidden="true" />
          </IconButton>
          {share.count != null && <Count>{share.count}</Count>}
        </span>
      )}
      {children}
    </div>
  );
}
