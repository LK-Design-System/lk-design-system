import * as React from 'react';

export interface EmptyStateProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  /** 아이콘 노드(부드러운 시안 타일에 렌더). */
  icon?: React.ReactNode;
  /** 굵은 제목. */
  title?: React.ReactNode;
  /** 뮤트 설명. */
  description?: React.ReactNode;
  /** 액션 노드(예: Button). */
  action?: React.ReactNode;
}

/** 빈 목록 / 결과 없음 / 오류를 위한 중앙 플레이스홀더. */
export function EmptyState(props: EmptyStateProps): React.JSX.Element;
