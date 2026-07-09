import * as React from 'react';

export interface WheelPickerOption {
  value: string | number;
  label: React.ReactNode;
}

export interface WheelPickerProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
  /** 문자열/숫자 또는 {value, label} 배열. */
  options?: Array<string | number | WheelPickerOption>;
  value?: string | number;
  defaultValue?: string | number;
  onChange?: (value: string | number) => void;
  /** 각 행 높이(px). @default 36 */
  itemHeight?: number;
  /** 보이는 행 수(홀수 권장). @default 5 */
  visible?: number;
}

/** iOS식 드럼/휠 선택기(스크롤-스냅 컬럼, 중앙 하이라이트). */
export function WheelPicker(props: WheelPickerProps): JSX.Element;
