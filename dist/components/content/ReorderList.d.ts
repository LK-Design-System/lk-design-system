import * as React from 'react';

export interface ReorderItem {
  id: string;
  label: React.ReactNode;
  detail?: React.ReactNode;
  trailing?: React.ReactNode;
  disabled?: boolean;
}

export interface ReorderMeta {
  activeId: string;
  from: number;
  to: number;
  reason: 'drag' | 'keyboard' | 'button';
}

export interface ReorderListProps extends React.HTMLAttributes<HTMLUListElement> {
  items?: ReorderItem[];
  /** 새 id 순서와 이동 메타 정보를 전달합니다. 생략하면 목록은 읽기 전용이며 drag/keyboard/button 이동이 비활성화됩니다. */
  onReorder?: (nextIds: string[], meta: ReorderMeta) => void;
  /** 행 밀도. @default "comfortable" */
  density?: 'comfortable' | 'compact';
  /** 순번 열을 표시합니다. @default false */
  showIndex?: boolean;
  /** 위/아래 이동 버튼을 표시합니다. @default true */
  showMoveButtons?: boolean;
  /** 전체 정렬 조작을 비활성화합니다. @default false */
  disabled?: boolean;
  /** 항목이 없을 때 표시할 문구. */
  emptyLabel?: React.ReactNode;
  /** label이 ReactNode일 때 접근성 라벨을 별도로 지정합니다. */
  getItemLabel?: (item: ReorderItem, index: number) => string;
}

/** 범용 sortable list primitive. 작업 단계 저작은 StepList를 사용합니다. */
export function ReorderList(props: ReorderListProps): React.JSX.Element;
