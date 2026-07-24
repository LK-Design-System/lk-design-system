import React from 'react';
import { Avatar } from '@lk-robotics/lds-core/components/feedback/Avatar';
import { Button } from '@lk-robotics/lds-core/components/buttons/Button';
import { IconButton } from '@lk-robotics/lds-core/components/buttons/IconButton';
import { Icon } from '@lk-robotics/lds-core/components/icon/Icon';
import { ListCell } from '@lk-robotics/lds-core/components/content/ListCell';
import { DropdownMenu } from '@lk-robotics/lds-core/components/overlay/DropdownMenu';
import { ExpandableText } from '../content/ExpandableText.jsx';
import { ReactionBar } from '../content/ReactionBar.jsx';

/**
 * LK ROBOTICS — FeedCard
 * A social feed post: an author header (avatar, name, source·time, a follow
 * control and an overflow menu), a body that clamps behind "더 보기", an optional
 * cover, and an engagement bar (like / comment / share).
 *
 * Unlike `NewsCard`/`ListingCard` — which are a single link — a feed post holds
 * MANY controls (author link, follow, overflow, like, comment, share, expand),
 * so it is NOT a card-as-link. It is an `<article>` region named by its author,
 * and every control inside is an independent focus stop.
 *
 * It composes rather than reinvents: the header is a `ListCell`
 * (avatar + name + meta + trailing), the body an `ExpandableText`, the footer a
 * `ReactionBar`, the overflow a `DropdownMenu`. FeedCard owns only the post
 * anatomy and its region semantics; data, follow/like state, and routing belong
 * to the product.
 */
export function FeedCard({
  author = {},
  meta,
  following,
  onFollowToggle,
  followLabel,
  menuItems,
  menuLabel = '게시물 옵션',
  cover,
  coverAlt = '',
  clamp = 3,
  like,
  comment,
  share,
  headingLevel,
  children,
  style,
  'aria-label': ariaLabel,
  ...rest
}) {
  const { name, src, variant = 'person', href } = author;
  const showFollow = onFollowToggle !== undefined || following !== undefined;
  const showMenu = Array.isArray(menuItems) && menuItems.length > 0;
  const hasReactions = !!(like || comment || share);
  const resolvedFollowLabel = followLabel ?? (following ? '팔로잉' : '팔로우');

  // The author name is a heading when a level is given (so the feed has a
  // navigable document outline), otherwise plain text; a href turns it into a
  // profile link either way.
  const HeadingTag = headingLevel ? `h${headingLevel}` : 'span';
  const nameInner = href
    ? <a href={href} style={{ color: 'inherit', textDecoration: 'none' }}>{name}</a>
    : name;
  const nameNode = (
    <HeadingTag style={{ margin: 0, fontSize: 'var(--body2-size)', fontWeight: 'var(--fw-bold)', color: 'var(--color-semantic-label-strong)' }}>
      {nameInner}
    </HeadingTag>
  );

  let trailing;
  if (showFollow || showMenu) {
    trailing = (
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)' }}>
        {showFollow && (
          <Button variant={following ? 'ghost' : 'secondary'} size="sm" onClick={onFollowToggle}>
            {resolvedFollowLabel}
          </Button>
        )}
        {showMenu && (
          <DropdownMenu
            align="right"
            items={menuItems}
            trigger={
              <IconButton variant="ghost" round size="sm" label={menuLabel}>
                <Icon name="more-vertical" size={20} aria-hidden="true" />
              </IconButton>
            }
          />
        )}
      </div>
    );
  }

  return (
    <article
      aria-label={ariaLabel ?? (name ? `${name}님의 게시물` : undefined)}
      style={{
        background: 'var(--component-card-bg)',
        border: 'var(--component-card-border)',
        borderRadius: 'var(--component-card-radius)',
        overflow: 'hidden',
        ...style,
      }}
      {...rest}
    >
      <div style={{ padding: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
        <ListCell
          leading={<Avatar src={src} name={name} variant={variant} size="medium" />}
          title={nameNode}
          description={meta}
          trailing={trailing}
          paddingX={0}
          verticalPadding="none"
        />
        {children != null && children !== '' && (
          clamp === false
            ? (
              <div style={{ color: 'var(--color-semantic-label-normal)', fontSize: 'var(--body1-size)', lineHeight: 'var(--body1-line)', whiteSpace: 'pre-wrap', wordBreak: 'keep-all', overflowWrap: 'anywhere' }}>
                {children}
              </div>
            )
            : <ExpandableText lines={clamp}>{children}</ExpandableText>
        )}
      </div>
      {cover && (
        <div style={{ aspectRatio: '16 / 9', overflow: 'hidden', background: 'var(--color-semantic-background-normal-alternative)' }}>
          <img src={cover} alt={coverAlt} loading="lazy" decoding="async" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
      )}
      {hasReactions && (
        <div style={{ padding: 'var(--space-2) var(--space-4) var(--space-3)' }}>
          <ReactionBar like={like} comment={comment} share={share} />
        </div>
      )}
    </article>
  );
}
