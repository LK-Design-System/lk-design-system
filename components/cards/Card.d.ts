import * as React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 기본 그림자 깊이. @default "md" */
  elevation?: 'none' | 'sm' | 'md' | 'lg';
  /** 호버 시 리프트 + 그림자 심화. @default false */
  interactive?: boolean;
  /** 다크 섹션용 네이비 서피스. @default false */
  dark?: boolean;
  /** 기본 32px 패딩을 재정의. */
  padding?: number | string;
  children?: React.ReactNode;
}

/** 중립 화이트(또는 네이비) 서피스 — 헤어라인 보더, 부드러운 네이비 그림자, 16px 반경. */
export function Card(props: CardProps): JSX.Element;
