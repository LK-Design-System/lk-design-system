import * as React from 'react';

export interface ReorderItem {
  id: string;
  label: React.ReactNode;
  detail?: React.ReactNode;
}

export interface ReorderListProps extends React.HTMLAttributes<HTMLUListElement> {
  items?: ReorderItem[];
  /** 드롭 시 새 id 순서를 전달. */
  onReorder?: (nextIds: string[]) => void;
}

/** 드래그로 순서를 바꾸는 리스트(핸들 + 시퀀스 배지). Alt+↑/↓ 키보드 이동. */
export function ReorderList(props: ReorderListProps): JSX.Element;
