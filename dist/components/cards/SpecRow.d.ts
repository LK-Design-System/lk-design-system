import * as React from 'react';

export interface SpecRowProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 스펙 이름(왼쪽, 뮤트 — label-alternative). */
  label?: React.ReactNode;
  /** 스펙 값(오른쪽 — label-normal, tabular-nums). */
  value?: React.ReactNode;
  /** 라벨 컬럼 폭. DescriptionList와 동일 비율. @default "34%" */
  labelWidth?: string;
}

/**
 * 제품 스펙 표의 키/값 한 행, 하단 헤어라인으로 구분.
 * 시맨틱 토큰만 사용 — 라이트 시트에 기본, 네이비 무대에선
 * `data-theme="dark"` 래퍼 안에서 그대로 동작.
 */
export function SpecRow(props: SpecRowProps): React.JSX.Element;
