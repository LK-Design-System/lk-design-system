import * as React from "react";

export type MessageComposerState = "idle" | "submitting" | "streaming" | "stopping";
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

interface MessageComposerBaseProps {
  /** Controlled draft value. MessageComposer never clears it after submit. */
  value: string;
  /** Receives the next controlled value and original textarea change event. */
  onValueChange: (value: string, event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  /** Receives the current value and the explicit submit trigger. */
  onSubmit: (value: string, reason: MessageComposerSubmitReason) => void;
  /** Product-owned request/response lifecycle. @default "idle" */
  state?: MessageComposerState;
  /** Keyboard submission rule. @default "enter" */
  submitMode?: MessageComposerSubmitMode;
  /** Explicit submit eligibility. Defaults to whether the trimmed value is non-empty. */
  canSubmit?: boolean;
  /** Keep the draft focusable but prevent editing and submission. @default false */
  readOnly?: boolean;
  /** Visible status text. Defaults to the current non-idle state's neutral label. */
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
  /** Minimum autosize rows; one row starts at 44px. @default 1 */
  minRows?: number;
  /** Maximum autosize rows before internal scrolling. @default 6 */
  maxRows?: number;
  /** Attachment preview/list slot rendered before the control row. */
  attachments?: React.ReactNode;
  /** 32px attachment utility action. */
  attachmentAction?: React.ReactNode;
  /** Additional 32px utility actions. */
  secondaryActions?: React.ReactNode;
  /** Accessible name for the 32px submit control. @default "메시지 보내기" */
  submitLabel?: string;
  /** Accessible name for the 32px stop control. @default "응답 중지" */
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

/** Compact controlled message composer for the LK Product communication family. */
export function MessageComposer(props: MessageComposerProps): React.JSX.Element;
