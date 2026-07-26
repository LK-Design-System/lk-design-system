import * as React from 'react';

export interface FabProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** @default "signal" */
  variant?: 'signal' | 'dark' | 'primary' | 'secondary' | 'white';
  /** 지름: sm 48 · md 56 · lg 64. @default "md" */
  size?: 'sm' | 'md' | 'lg';
  /** 접근성 이름(필수 — 아이콘 전용). 누락 시 development 빌드에서 console 경고. */
  label: string;
  /** 폼 안에서 의도치 않은 제출을 막기 위해 기본값은 `button`입니다. */
  type?: 'button' | 'submit' | 'reset';
  children?: React.ReactNode;
}

/**
 * 둥글고 떠 있는 플로팅 액션 버튼.
 * `{...rest}`는 Button·IconButton과 동일하게 가장 먼저 펼쳐지므로 `type`,
 * `aria-label`, `disabled`, 이벤트 핸들러 계약이 consumer prop에 덮이지 않습니다.
 */
export function Fab(props: FabProps): React.JSX.Element;
