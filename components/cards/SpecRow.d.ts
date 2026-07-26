import * as React from 'react';

export interface SpecRowProps extends React.HTMLAttributes<HTMLElement> {
  /** 스펙 이름(왼쪽, 뮤트 — label-alternative). `dt`로 렌더됩니다. */
  label?: React.ReactNode;
  /** 스펙 값(오른쪽 — label-normal, tabular-nums). `dd`로 렌더됩니다. */
  value?: React.ReactNode;
  /** 라벨 컬럼 폭. DescriptionList와 동일 비율. @default "34%" */
  labelWidth?: string;
  /** 하단 헤어라인. 목록의 마지막 행에서 `false`로 끕니다. @default true */
  divider?: boolean;
  /**
   * 여러 행이 하나의 사양표를 이룰 때 사용합니다. 호출부가 바깥에 `dl`을 두고
   * 각 행에 `grouped`를 주면 행은 `dl`의 유효한 래퍼(`div`)로 렌더되어
   * 사양표 전체가 하나의 정의 목록으로 읽힙니다. 기본값(`false`)에서는 행
   * 자체가 단일 쌍 `dl`이 됩니다.
   * @default false
   */
  grouped?: boolean;
}

/**
 * 제품 스펙 표의 키/값 한 행, 하단 헤어라인으로 구분.
 * 라벨/값은 `dt`/`dd`로 연관되며, 시맨틱 토큰만 사용 — 라이트 시트에 기본,
 * 네이비 무대에선 `data-theme="dark"` 래퍼 안에서 그대로 동작.
 */
export function SpecRow(props: SpecRowProps): React.JSX.Element;
