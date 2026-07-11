import * as React from 'react';

export interface PinInputProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** 박스 수. @default 6 */
  length?: number;
  value?: string;
  defaultValue?: string;
  /** Incomplete interior cells are serialized as spaces so their positions survive controlled updates. */
  onChange?: (value: string) => void;
  /** 모든 박스가 채워지면 발생. */
  onComplete?: (value: string) => void;
  /** 문자 숨김. @default false */
  mask?: boolean;
  disabled?: boolean;
  /** @default "md" */
  size?: 'sm' | 'md';
  style?: React.CSSProperties;
}

/** 코드 / OTP용 단일 문자 박스 행. */
export function PinInput(props: PinInputProps): JSX.Element;
