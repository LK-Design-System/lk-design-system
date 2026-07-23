import * as React from 'react';

export interface PushBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** 표시할 숫자(`dot`과 함께 쓸 땐 생략). */
  count?: number;
  /** 숫자 대신 점만 표시. @default false */
  dot?: boolean;
  /** 클램프: 초과 값은 "max+"로 표시. @default 99 */
  max?: number;
  /** @default "negative" */
  tone?: 'negative' | 'signal' | 'navy';
  /**
   * 보조기술에 전달할 배지 텍스트. 감싼 컨트롤이 이미 접근 가능한 이름을 가지면
   * 그 이름 뒤에 붙고("알림" → "알림 읽지 않음 7건"), 아니면 visually-hidden
   * 텍스트로 렌더됩니다.
   *
   * 기본값: `count`가 있으면 `"읽지 않음 N건"`(클램프 시 `"읽지 않음 99건 이상"`),
   * `dot`만 있으면 값이 없으므로 침묵합니다. `label={false}` 또는 `label={null}`로
   * 완전히 장식 처리할 수 있습니다.
   */
  label?: string | false | null;
  children?: React.ReactNode;
}

/** 자식의 우상단에 붙는 알림 점 / 카운트. 시각 오버레이는 장식이며 카운트는 `label`로 노출됩니다. */
export function PushBadge(props: PushBadgeProps): React.JSX.Element;
