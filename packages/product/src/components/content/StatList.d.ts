import * as React from 'react';

export interface StatListItem {
  /** 항목 라벨(예: "팔로워"). 값과 함께 접근 이름에 합성됩니다. */
  label: React.ReactNode;
  /** 항목 값(예: 128, "3,000P"). `tabular-nums`로 정렬됩니다. */
  value: React.ReactNode;
  /** 있으면 항목 전체가 링크가 됩니다(예: 팔로워 목록으로 이동). */
  href?: string;
}

export interface StatListProps extends React.HTMLAttributes<HTMLUListElement> {
  /** 라벨-값 쌍 목록. 비어 있으면 아무것도 렌더하지 않습니다. */
  items?: StatListItem[];
  /** 텍스트 크기. @default "md" */
  size?: 'sm' | 'md';
}

/** 라벨 붙은 스탯을 한 줄에 나열하는 인라인 목록 — 프로필·계정 마스트헤드의 메타 행. */
export function StatList(props: StatListProps): React.JSX.Element | null;
