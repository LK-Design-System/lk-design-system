import * as React from "react";

export type MessageComposerState = "idle" | "submitting" | "streaming" | "stopping";
export type MessageComposerDensity = "comfortable" | "compact";
export type MessageComposerLayout = "stacked" | "inline";
export type MessageComposerSubmitMode = "enter" | "modifier-enter" | "button-only";
export type MessageComposerSubmitReason = "enter" | "modifier-enter" | "button";

export type MessageComposerTextareaProps = Omit<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  | "value"
  | "defaultValue"
  | "disabled"
  | "readOnly"
  | "maxLength"
  | "rows"
  | "placeholder"
>;

interface MessageComposerBaseProps extends Omit<
  React.FormHTMLAttributes<HTMLFormElement>,
  'children' | 'onChange' | 'onSubmit' | 'onInput'
> {
  /** Controlled draft value. MessageComposer never clears it after submit. */
  value: string;
  /** Receives the next controlled value and original textarea change event. */
  onValueChange: (value: string, event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  /** Receives the current value and the explicit submit trigger. */
  onSubmit: (value: string, reason: MessageComposerSubmitReason) => void;
  /** Product-owned request/response lifecycle. @default "idle" */
  state?: MessageComposerState;
  /** Composer-owned spacing density. Stacked inputs start at 40px comfortable / 32px compact; inline starts at 44px. All keep 16px input text. @default "comfortable" */
  density?: MessageComposerDensity;
  /** Inline puts a simple textarea and 44px send/stop control on one row (~50px shell). Long drafts grow up to maxRows. Attachments or leading/trailing actions use the full-width stacked anatomy, retaining the 44px primary target. @default "stacked" */
  layout?: MessageComposerLayout;
  /** Keyboard submission rule. modifier-enter accepts Alt-free Ctrl/Meta+Enter only. @default "enter" */
  submitMode?: MessageComposerSubmitMode;
  /** Explicit submit eligibility. Defaults to whether the trimmed value is non-empty. */
  canSubmit?: boolean;
  /** Keep the draft focusable but prevent editing and submission. @default false */
  readOnly?: boolean;
  /** Visible status text. Defaults to the current non-idle state's neutral label; `null` suppresses it. */
  statusLabel?: React.ReactNode;
  /** Accessible name for the composer form. @default "메시지 작성" */
  formLabel?: string;
  /** Accessible label for the internal textarea. @default "메시지 입력" */
  inputLabel?: string;
  /** Internal textarea placeholder. @default "메시지를 입력하세요." */
  placeholder?: string;
  /** Supporting text announced with the textarea. */
  description?: React.ReactNode;
  /** Native maximum character count and visible counter. */
  maxLength?: number;
  /** Minimum autosize rows; grows with content and container width up to maxRows. @default 1 */
  minRows?: number;
  /** Maximum autosize rows before internal scrolling. @default 6 */
  maxRows?: number;
  /** Attachment preview/list slot rendered inside the composer shell before the control row. */
  attachments?: React.ReactNode;
  /** Actions rendered at the leading edge of the action band below the textarea. */
  leadingActions?: React.ReactNode;
  /** Actions rendered at the trailing edge of the action band before the primary send/stop control. */
  trailingActions?: React.ReactNode;
  /** Accessible name for the submit control (stacked 32px / inline 44px). @default "메시지 보내기" */
  submitLabel?: string;
  /** Accessible name for the stop control (stacked 32px / inline 44px). @default "응답 중지" */
  stopLabel?: string;
  /** Requests transport cancellation in submitting/streaming states. */
  onStop?: () => void;
  /** Native textarea attributes and event hooks not owned by the controlled contract. */
  textareaProps?: MessageComposerTextareaProps;
}

type MessageComposerEnabledProps = {
  disabled?: false;
  disabledReason?: never;
};

type MessageComposerDisabledProps = {
  disabled: true;
  /** Required explanation rendered before controls and referenced by the textarea. */
  disabledReason: React.ReactNode;
};

export type MessageComposerProps = MessageComposerBaseProps & (
  | MessageComposerEnabledProps
  | MessageComposerDisabledProps
);

/** LK Product Extension: a product-neutral controlled composer for general conversations. */
export function MessageComposer(props: MessageComposerProps): React.JSX.Element;
