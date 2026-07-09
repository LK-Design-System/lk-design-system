import * as React from 'react';

export interface TreeSelectNode {
  id: string;
  label: React.ReactNode;
  children?: TreeSelectNode[];
}

export interface TreeSelectProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultChecked'> {
  nodes?: TreeSelectNode[];
  /** 제어형 체크 id 배열. */
  checked?: string[];
  /** 비제어형 초기 체크 id 배열. */
  defaultChecked?: string[];
  onChange?: (checkedIds: string[]) => void;
  /** @default "검색" */
  placeholder?: string;
}

/** 검색·체크 가능한 트리(다중 선택). Tree/TopicTree의 pick-many 보완재. */
export function TreeSelect(props: TreeSelectProps): JSX.Element;
