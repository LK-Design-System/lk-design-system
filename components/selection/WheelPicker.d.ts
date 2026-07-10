import * as React from 'react';

export interface WheelPickerOption {
  value: string | number;
  label: React.ReactNode;
  disabled?: boolean;
}

export interface WheelPickerProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
  /** 문자열/숫자 또는 {value, label} 배열. */
  options?: Array<string | number | WheelPickerOption>;
  value?: string | number;
  defaultValue?: string | number;
  onChange?: (value: string | number, option: WheelPickerOption) => void;
  /** 각 행 높이(px). @default 36 */
  itemHeight?: number;
  /** 보이는 행 수(홀수 권장). @default 5 */
  visible?: number;
  /** 컴포넌트 너비. @default 128 */
  width?: React.CSSProperties['width'];
  /** Listbox accessible name. @default "휠 선택" */
  label?: string;
  /** option이 없을 때 중앙에 표시할 문구. @default "선택 항목 없음" */
  emptyLabel?: React.ReactNode;
  disabled?: boolean;
  disable?: boolean;
  readOnly?: boolean;
}

/** iOS식 드럼/휠 선택기(스크롤-스냅 컬럼, 중앙 하이라이트). */
export function WheelPicker(props: WheelPickerProps): JSX.Element;
