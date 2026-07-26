import * as React from 'react';

export interface PasswordInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value' | 'defaultValue' | 'size' | 'style' | 'type'> {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  label?: React.ReactNode;
  helper?: React.ReactNode;
  error?: React.ReactNode;
  invalid?: boolean;
  status?: 'normal' | 'positive' | 'negative';
  size?: 'sm' | 'md' | 'small' | 'medium';
  revealLabel?: string;
  hideLabel?: string;
  /**
   * Browser autofill hint for the password field. Keep the default on sign-in
   * forms; pass `"new-password"` on sign-up / change-password forms so the
   * password manager offers a generated value instead of the stored one.
   * @default "current-password"
   */
  autoComplete?: string;
  /**
   * Caps Lock warning shown while the field has focus. Pass `''` to suppress
   * the warning entirely.
   * @default "Caps Lock이 켜져 있습니다."
   */
  capsLockLabel?: string;
  /** Styles for the label/control/message stack. */
  fieldStyle?: React.CSSProperties;
  /** Styles for the input control shell. */
  style?: React.CSSProperties;
}

/** Password field with a contextual show/hide action. */
export function PasswordInput(props: PasswordInputProps): React.JSX.Element;
