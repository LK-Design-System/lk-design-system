import * as React from 'react';

export interface SecretFieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'style' | 'onCopy' | 'type' | 'readOnly' | 'size'> {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  label?: React.ReactNode;
  value?: string;
  helper?: React.ReactNode;
  revealable?: boolean;
  copyable?: boolean;
  revealDurationMs?: number;
  revealed?: boolean;
  defaultRevealed?: boolean;
  onRevealChange?: (revealed: boolean) => void;
  onCopy?: (value: string) => void;
  onCopyError?: (error: unknown) => void;
  copyLabel?: string;
  copiedLabel?: string;
  copyErrorLabel?: string;
  disabled?: boolean;
  style?: React.CSSProperties;
}

/** Read-only secret field with controlled reveal duration and copy feedback. */
export function SecretField(props: SecretFieldProps): JSX.Element;
