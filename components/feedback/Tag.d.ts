import * as React from 'react';

export interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** 색상 톤. @default "signal" */
  tone?: 'signal' | 'neutral' | 'steel' | 'amber' | 'red';
  /** 부드러운 틴트 대신 솔리드로 채움. @default false */
  solid?: boolean;
  children?: React.ReactNode;
}

/**
 * 대문자·자간 오버라인 필 — 이브로우, 플랜 등급, 프로모 칩.
 */
export function Tag(props: TagProps): JSX.Element;
