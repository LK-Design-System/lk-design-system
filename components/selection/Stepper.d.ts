import * as React from 'react';

export interface StepperProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
  /** 제어되는 값. */
  value?: number;
  /** 비제어 초기 값. @default 0 */
  defaultValue?: number;
  /** 하한(클램프). 유한할 때만 `aria-valuemin` / `Home` 키가 활성화됩니다. */
  min?: number;
  /** 상한(클램프). 유한할 때만 `aria-valuemax` / `End` 키가 활성화됩니다. */
  max?: number;
  /** 누를 때마다 증가폭. @default 1 */
  step?: number;
  /** PageUp/PageDown 증가폭. @default step * 10 */
  largeStep?: number;
  onChange?: (value: number) => void;
  /** 높이. @default "md" */
  size?: 'sm' | 'md';
  disabled?: boolean;
  /**
   * 조절 대상의 이름(예: `도입 대수`). `role="group"`과 내부 `spinbutton`의 접근
   * 가능한 이름이 되고, +/− 버튼 이름(`도입 대수 증가`)의 접두어가 됩니다.
   * 생략하면 `aria-label`, 그다음 `수량`이 사용됩니다.
   */
  label?: string;
  /** 감소 버튼 이름 재정의. @default `${label} 감소` */
  decrementLabel?: string;
  /** 증가 버튼 이름 재정의. @default `${label} 증가` */
  incrementLabel?: string;
  /** 숫자 대신 읽힐 텍스트를 만듭니다(`aria-valuetext`). 예: `(v) => `${v}대`` */
  valueText?: (value: number) => string;
  /** 길게 누를 때 자동 반복이 시작되기까지의 지연(ms). @default 400 */
  repeatDelay?: number;
  /** 자동 반복 간격(ms). @default 80 */
  repeatInterval?: number;
  style?: React.CSSProperties;
}

/**
 * tabular 값의 숫자 +/− 스테퍼; [min, max]로 클램프.
 * 값은 APG `role="spinbutton"`이며 Arrow/Page/Home/End 키를 소유합니다.
 */
export function Stepper(props: StepperProps): React.JSX.Element;
