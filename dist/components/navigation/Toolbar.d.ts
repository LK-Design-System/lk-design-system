import * as React from 'react';

export interface ToolbarProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  /** Arrow-key direction and visual layout. @default "horizontal" */
  orientation?: 'horizontal' | 'vertical';
  /** Accessible toolbar name. @default "도구 모음" */
  label?: string;
  /** Selector for roving-tab-stop items owned by this toolbar. */
  itemSelector?: string;
  /** Preferred `data-lk-toolbar-key` when no remembered item exists. */
  preferredItemKey?: React.Key;
  /** Keep aria-disabled commands keyboard-discoverable. @default false */
  includeAriaDisabledItems?: boolean;
  /** Stop handled arrow/Home/End navigation from reaching an outer canvas. @default false */
  stopNavigationPropagation?: boolean;
}

/** 그룹화된 컨트롤을 위한 한 개의 Tab stop과 방향키 탐색을 제공하는 컨테이너. */
export function Toolbar(props: ToolbarProps): React.JSX.Element;
