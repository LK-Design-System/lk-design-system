import * as React from 'react';

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  /** 밴드의 배경 서피스. 생략하면 투명. */
  surface?: 'subtle' | 'band' | 'raised' | 'inverse';
  /** 반응형 세로 패딩 재정의(숫자 = px). 기본값 `--gap-section`. */
  py?: number | string;
  /** 자식을 중앙 정렬 반응형 컨테이너로 감싸기. @default true */
  container?: boolean;
  /** 내부 컨테이너 요소의 스타일. */
  innerStyle?: React.CSSProperties;
  children?: React.ReactNode;
}

/** 반응형 세로 리듬 + 선택적 서피스가 있는 전체 폭 페이지 밴드. */
export function Section(props: SectionProps): JSX.Element;
