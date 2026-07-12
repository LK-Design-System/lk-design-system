import * as React from 'react';

export interface SecretFieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'style' | 'onCopy' | 'type' | 'readOnly' | 'size'> {
  /** Matches the underlying LDS Input size axis. */
  size?: 'sm' | 'md' | 'lg' | 'small' | 'medium' | 'large';
  label?: React.ReactNode;
  value?: string;
  helper?: React.ReactNode;
  error?: React.ReactNode;
  invalid?: boolean;
  /**
   * Accessible context prefixed to reveal/copy action names. Required to
   * distinguish complex ReactNode labels; pass `false` when action label props
   * already contain their complete accessible names.
   */
  actionContext?: string | false;
  revealable?: boolean;
  copyable?: boolean;
  revealDurationMs?: number;
  revealed?: boolean;
  defaultRevealed?: boolean;
  onRevealChange?: (revealed: boolean) => void;
  onCopy?: (value: string) => void;
  onCopyError?: (error: unknown) => void;
  /** Action text. The visible field label is added to the accessible button name. */
  revealLabel?: string;
  /** Action text. The visible field label is added to the accessible button name. */
  hideLabel?: string;
  /** Action text. The visible field label is added to the accessible button name. */
  copyLabel?: string;
  /** Success text used by both the button name and live feedback. */
  copiedLabel?: string;
  /** Failure text used by both the button name and live feedback. */
  copyErrorLabel?: string;
  disabled?: boolean;
  style?: React.CSSProperties;
}

/** Read-only secret field with controlled reveal duration and copy feedback. */
export function SecretField(props: SecretFieldProps): React.JSX.Element;
