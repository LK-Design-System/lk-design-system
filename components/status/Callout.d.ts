import * as React from 'react';

export interface CalloutProps extends React.HTMLAttributes<HTMLDivElement> {
  /** @default "signal" */
  tone?: 'signal' | 'positive' | 'cautionary' | 'negative' | 'navy';
  title?: React.ReactNode;
  icon?: React.ReactNode;
  children?: React.ReactNode;
}

/** 좌측 강조 바가 있는 강조 노트 블록 — 안내 / 팁. */
export function Callout(props: CalloutProps): JSX.Element;
