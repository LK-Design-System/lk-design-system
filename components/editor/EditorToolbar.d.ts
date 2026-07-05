import * as React from 'react';

export interface EditorTool {
  value: string;
  /** 아이콘 노드(예: <Icon name="…" />). */
  icon?: React.ReactNode;
  /** 접근성 라벨 + 툴팁. */
  label?: string;
}

export interface EditorToolbarProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** 툴 목록 — `{ value, icon, label }`. */
  items: EditorTool[];
  /** 제어되는 선택 툴. */
  value?: string;
  /** 비제어 초기 툴(기본 첫 항목). */
  defaultValue?: string;
  onChange?: (value: string) => void;
  /** @default "vertical" */
  orientation?: 'vertical' | 'horizontal';
}

/** 캔버스 에디터용 단일 선택 툴 그룹(선택·그리기·지우기·폴리곤·팬). 활성 툴은 시그널 잉크. */
export function EditorToolbar(props: EditorToolbarProps): JSX.Element;
