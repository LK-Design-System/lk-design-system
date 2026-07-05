import * as React from 'react';

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** 비주얼 스타일. @default "soft" */
  variant?: 'soft' | 'solid' | 'signal' | 'ghost' | 'on-dark';
  /** 정사각/원형의 픽셀 크기. @default 44 */
  size?: number;
  /** 8px 라운드 사각형 대신 완전 원형. @default false */
  round?: boolean;
  /** 접근성 라벨(필수 — 버튼에 보이는 텍스트가 없음). */
  label?: string;
  /** 단일 인라인 SVG 글리프. */
  children?: React.ReactNode;
}

/** 아이콘 하나를 감싸는 콤팩트 정사각/원형 컨트롤(내비 화살표, 맨 위로, 닫기). */
export function IconButton(props: IconButtonProps): JSX.Element;
