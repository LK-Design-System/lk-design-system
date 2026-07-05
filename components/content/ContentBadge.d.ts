import * as React from 'react';

export interface ContentBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** 상태 톤. @default "signal" */
  tone?: 'signal' | 'navy' | 'neutral' | 'positive' | 'cautionary' | 'negative';
  /** 웨이트. @default "soft" */
  variant?: 'solid' | 'soft' | 'outline';
  /** @default "md" */
  size?: 'sm' | 'md' | 'lg';
  children?: React.ReactNode;
}

/** 콘텐츠에 붙는 작은 사각 라벨(NEW, 즉시지원). */
export function ContentBadge(props: ContentBadgeProps): JSX.Element;
