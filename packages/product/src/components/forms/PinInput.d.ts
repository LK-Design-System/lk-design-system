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
  /** 모든 cell에 `aria-invalid`와 오류 테두리를 적용. @default false */
  invalid?: boolean;
  /**
   * 입력을 허용하는 문자 집합. 허용되지 않는 문자는 타이핑·붙여넣기 모두에서
   * 무시되고 `inputMode`도 함께 따라갑니다.
   * @default "numeric"
   */
  charset?: 'numeric' | 'alphanumeric' | 'any';
  /**
   * 각 cell에 부여하는 자동 채우기 힌트. 기본값은 iOS/Android의 SMS 코드
   * 자동 채우기를 켜는 `one-time-code`입니다.
   * @default "one-time-code"
   */
  autoComplete?: string;
  /** @default "md" */
  size?: 'sm' | 'md';
  style?: React.CSSProperties;
}

/** 코드 / OTP용 단일 문자 박스 행. */
export function PinInput(props: PinInputProps): React.JSX.Element;
