import * as React from 'react';
import type { SourceDisclosureItem } from '../content/SourceDisclosure.js';

export type ConversationMessageDirection = 'inbound' | 'outbound' | 'system';
export type ConversationMessageAuthorRole = 'user' | 'assistant' | 'human-agent' | 'system';
export type ConversationMessageVariant = 'soft' | 'solid';
export type ConversationMessageGroupPosition = 'single' | 'first' | 'middle' | 'last';
type ConversationMessageNonSystemDirection = Exclude<ConversationMessageDirection, 'system'>;
type ConversationMessagePlainText = string | number | readonly (string | number)[];

export type ConversationMessageLifecycle =
  | { kind: 'static' }
  | {
      kind: 'delivery';
      state: 'queued' | 'sending' | 'sent' | 'failed' | 'cancelled';
    }
  | {
      kind: 'response';
      state: 'pending' | 'streaming' | 'stopping' | 'complete' | 'cancelled' | 'failed';
    };

interface ConversationMessageBaseProps extends Omit<React.HTMLAttributes<HTMLElement>, 'children'> {
  /** Semantic sender category. It never derives visual direction. */
  authorRole: ConversationMessageAuthorRole;
  /** Position within a visually grouped run from the same author. @default 'single' */
  groupPosition?: ConversationMessageGroupPosition;
  /** Static content, outbound delivery state, or inbound response generation state. @default { kind: 'static' } */
  lifecycle?: ConversationMessageLifecycle;
  /** Visible author identity. */
  author: React.ReactNode;
  /** Accessible author name when author is not plain text. */
  authorLabel?: string;
  /** Avatar slot. Rendered in a 32px slot for single/first non-system messages only. */
  avatar?: React.ReactNode;
  /** Human-readable timestamp. */
  timestamp?: React.ReactNode;
  /** Machine-readable ISO date/time for the time element. */
  dateTime?: string;
  /** Optional lifecycle label override. `null` suppresses the marker; response complete is silent by default. */
  statusLabel?: React.ReactNode;
  /** Attachment row/list supplied by the product. */
  attachments?: React.ReactNode;
  /** Provenance rendered with SourceDisclosure below the message body. */
  sources?: SourceDisclosureItem[];
  /** Full provenance list by default; compact exposes a count disclosure for product-validated supporting sources before revealing the same list. @default 'full' */
  sourcePresentation?: 'full' | 'compact';
  /** Additional message-level actions. */
  actions?: React.ReactNode;
  /** Called only from failed delivery/response retry controls. No lifecycle transition is inferred. */
  onRetry?: () => void;
  /** Called only from pending/streaming response stop controls. No completion is inferred. */
  onStop?: () => void;
  retryLabel?: React.ReactNode;
  stopLabel?: React.ReactNode;
}

type ConversationMessageSystemProps = ConversationMessageBaseProps & {
  /** System placement always renders a neutral line, regardless of variant. */
  direction: 'system';
  variant?: ConversationMessageVariant;
  children?: React.ReactNode;
};

type ConversationMessageSoftProps = ConversationMessageBaseProps & {
  /** Visual placement. Soft selects the inbound neutral or outbound tinted branch. */
  direction: ConversationMessageNonSystemDirection;
  variant?: 'soft';
  children?: React.ReactNode;
};

type ConversationMessageSolidProps = ConversationMessageBaseProps & {
  /** Visual placement. Solid never derives authorRole. */
  direction: ConversationMessageNonSystemDirection;
  /** Explicit shrink-wrapped primary surface with pre-wrapped plain text. */
  variant: 'solid';
  /** Required non-empty plain message body. Use soft for links, headings, markdown, or other rich content. */
  children: ConversationMessagePlainText;
};

export type ConversationMessageProps =
  | ConversationMessageSystemProps
  | ConversationMessageSoftProps
  | ConversationMessageSolidProps;

/** A single conversation article; MessageFeed owns ordered log/live-region behavior. */
export function ConversationMessage(props: ConversationMessageProps): React.JSX.Element;
