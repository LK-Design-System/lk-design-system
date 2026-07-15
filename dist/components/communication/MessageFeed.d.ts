import * as React from 'react';

export type MessageFeedFollowingReason = 'user-scroll' | 'jump-to-latest';

export interface MessageFeedProps extends Omit<React.HTMLAttributes<HTMLElement>, 'children'> {
  /** Accessible name for the focusable conversation log. @default "메시지 내역" */
  ariaLabel?: string;
  /** Message nodes in chronological DOM order. MessageFeed does not own a messages[] schema. */
  children?: React.ReactNode;
  /** Content shown inside the log when children are empty. */
  empty?: React.ReactNode;
  /** Maximum viewport height in pixels or CSS units. @default 400 */
  maxHeight?: number | string;
  /** Optional minimum viewport height for persistent conversation panels. */
  viewportMinHeight?: number | string;
  /** Mark the log as busy while its current contents are being updated. @default false */
  busy?: boolean;
  /** Show the history-loading action before the log. @default false */
  hasPrevious?: boolean;
  /** Disable the history action and mark the log busy while older messages load. @default false */
  loadingPrevious?: boolean;
  /** Request older messages. Return a promise or synchronously set loadingPrevious while retrieval runs; the product prepends the resulting children. */
  onLoadPrevious?: () => void | Promise<void>;
  /** History action label. @default "이전 메시지 불러오기" */
  loadPreviousLabel?: string;
  /** Controlled bottom-follow state. The consumer must update it from onFollowingChange. */
  following: boolean;
  /** Called when user scrolling changes the follow state or the latest-message action restores it. */
  onFollowingChange?: (following: boolean, reason: MessageFeedFollowingReason) => void;
  /** Product-owned count displayed with the latest-message action. @default 0 */
  unreadCount?: number;
  /** Latest-message action label. @default "최신 메시지로 이동" */
  jumpToLatestLabel?: string;
  /** Called after the latest-message action scrolls the viewport to the bottom. */
  onJumpToLatest?: () => void;
  /** Short phase-level announcement rendered in a live region separate from message tokens. */
  liveStatus?: React.ReactNode;
}

/** LK Product Extension: a chrome-free conversation log with controlled history and follow behavior. */
export function MessageFeed(props: MessageFeedProps): React.JSX.Element;
