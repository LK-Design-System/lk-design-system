import * as React from 'react';

export type ConversationMessageDirection = 'inbound' | 'outbound' | 'system';
export type ConversationMessageAuthorRole = 'user' | 'assistant' | 'human-agent' | 'system';
export type ConversationMessagePresentation = 'document' | 'bubble';
export type ConversationMessageGroupPosition = 'single' | 'first' | 'middle' | 'last';

export interface ConversationMessageAction {
  /** Stable identifier used as the React key and the data-message-action hook. */
  key: string;
  /** 16px glyph rendered inside an icon-only IconButton. */
  icon: React.ReactNode;
  /** Accessible name mapped to the IconButton aria-label. */
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  /** Toggle state for feedback or other persistent actions. Omit for momentary actions. */
  pressed?: boolean;
}

export type ConversationMessageLifecycle =
  | { kind: 'static' }
  | {
      kind: 'delivery';
      state: 'queued' | 'sending' | 'sent' | 'read' | 'failed' | 'cancelled';
    }
  | {
      kind: 'response';
      state: 'pending' | 'streaming' | 'stopping' | 'complete' | 'cancelled' | 'failed';
    };

interface ConversationMessageBaseProps extends Omit<React.HTMLAttributes<HTMLElement>, 'children'> {
  /** Position within a visually grouped run from the same author. @default 'single' */
  groupPosition?: ConversationMessageGroupPosition;
  /** Static content, outbound delivery state, or inbound response generation state. @default { kind: 'static' } */
  lifecycle?: ConversationMessageLifecycle;
  /** Visible author identity. */
  author: React.ReactNode;
  /** Accessible author name when author is not plain text. */
  authorLabel?: string;
  /** Visible role badge next to the author name. Defaults to 'AI' for assistant and '상담원' for human-agent; `null` hides it. Decorative — the accessible role name is always announced separately. */
  roleBadgeLabel?: React.ReactNode;
  /** Avatar shown for single/first participant messages. Grouped runs reserve the same 32px token column even when later items omit this prop. */
  avatar?: React.ReactNode;
  /** Human-readable timestamp. */
  timestamp?: React.ReactNode;
  /** Machine-readable ISO date/time for the time element. */
  dateTime?: string;
  /** Optional lifecycle label override. `null` suppresses it; delivery sent, delivery read, and response complete are silent by default (read surfaces as a bubble-foot receipt instead). */
  statusLabel?: React.ReactNode;
  /** Attachment content rendered after the response status and message body. */
  attachments?: React.ReactNode;
  /** Source or provenance content supplied as a composition slot. */
  sources?: React.ReactNode;
  /** Render the `sources` slot on the same footer row as the action bar (ChatGPT-style) instead of its own row above the actions. The sources node stays a sibling of the `메시지 동작` group — not a member — so it still announces as provenance. Pair with a collapsible `SourceDisclosure` so its resting footprint is a single "출처" toggle. @default false */
  inlineSources?: boolean;
  /** Additional message-level actions rendered as a composition slot after the built-in action bar. */
  actions?: React.ReactNode;
  /** Primary icon action bar rendered below the body. Each entry becomes an icon-only IconButton; products own the glyph and handlers. Coexists with the `actions` slot. */
  messageActions?: ConversationMessageAction[];
  /** Failed-response body content. When set, a muted warning glyph is prefixed and the redundant lifecycle status label is suppressed by default. Not a live region — the MessageFeed log announces it. */
  error?: React.ReactNode;
  /** Called only from failed delivery/response retry controls. No lifecycle transition is inferred. */
  onRetry?: () => void;
  retryLabel?: React.ReactNode;
  children?: React.ReactNode;
}

type ConversationMessageSystemProps = ConversationMessageBaseProps & {
  /** System entries always use a centered tinted chip. */
  authorRole: 'system';
  direction?: 'system';
  presentation?: never;
};

type ConversationMessageParticipantProps = ConversationMessageBaseProps & {
  /** Sender category selects default placement and presentation. */
  authorRole: Exclude<ConversationMessageAuthorRole, 'system'>;
  /** User defaults outbound; assistant and human-agent default inbound. */
  direction?: Exclude<ConversationMessageDirection, 'system'>;
  /** Assistant defaults document; user and human-agent default bubble. */
  presentation?: ConversationMessagePresentation;
};

export type ConversationMessageProps =
  | ConversationMessageSystemProps
  | ConversationMessageParticipantProps;

/** LK Product Extension for product-neutral document and bubble conversation turns. */
export function ConversationMessage(props: ConversationMessageProps): React.JSX.Element;
