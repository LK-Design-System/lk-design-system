import * as React from 'react';
import type { SourceDisclosureItem } from '../content/SourceDisclosure.js';

export type ConversationMessageDirection = 'inbound' | 'outbound' | 'system';
export type ConversationMessageAuthorRole = 'user' | 'assistant' | 'human-agent' | 'system';
export type ConversationMessageGroupPosition = 'single' | 'first' | 'middle' | 'last';

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

export interface ConversationMessageProps extends React.HTMLAttributes<HTMLElement> {
  /** Visual placement and surface treatment. It never derives authorRole. */
  direction: ConversationMessageDirection;
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
  /** Optional lifecycle label override. */
  statusLabel?: React.ReactNode;
  /** Attachment row/list supplied by the product. */
  attachments?: React.ReactNode;
  /** Provenance rendered with SourceDisclosure below the message body. */
  sources?: SourceDisclosureItem[];
  /** Additional message-level actions. */
  actions?: React.ReactNode;
  /** Called only from failed delivery/response retry controls. No lifecycle transition is inferred. */
  onRetry?: () => void;
  /** Called only from pending/streaming response stop controls. No completion is inferred. */
  onStop?: () => void;
  retryLabel?: React.ReactNode;
  stopLabel?: React.ReactNode;
  children?: React.ReactNode;
}

/** A single conversation article; MessageFeed owns ordered log/live-region behavior. */
export function ConversationMessage(props: ConversationMessageProps): React.JSX.Element;
