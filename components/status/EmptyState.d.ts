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
  /** 아이콘 타일의 semantic status tone. @default "signal" */
  tone?: 'signal' | 'info' | 'positive' | 'success' | 'cautionary' | 'warning' | 'negative' | 'error' | 'offline';
  /**
   * `title`이 렌더되는 heading 레벨. 주변 문서 개요에 맞춰 h2–h6 중 선택합니다.
   * @default 2
   */
  headingLevel?: 2 | 3 | 4 | 5 | 6;
}

/**
 * 빈 목록 / 결과 없음 / 오류를 위한 중앙 플레이스홀더.
 * `title`은 실제 heading(`h2`–`h6`)으로 렌더되어 heading 탐색으로 도달할 수 있습니다.
 */
export function EmptyState(props: EmptyStateProps): React.JSX.Element;
