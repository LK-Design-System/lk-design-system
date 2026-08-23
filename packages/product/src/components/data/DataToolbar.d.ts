import * as React from 'react';
import type { LdsClassNames, LdsStyles, LdsVars } from '@lk-design-system/lds-core/component-authoring';

export type DataToolbarPart = 'root' | 'header' | 'heading' | 'title' | 'count' | 'description' | 'actions' | 'controls' | 'search' | 'filters';
export type DataToolbarVariable =
  | '--lds-data-toolbar-padding'
  | '--lds-data-toolbar-gap'
  | '--lds-data-toolbar-search-max-width';

export type DataToolbarSize = 'sm' | 'md';

export interface DataToolbarFilterContext {
  /** 검색 필드와 같은 필터 control 밀도. */
  size: DataToolbarSize;
}

export interface DataToolbarProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  /** 테이블/그리드 제목. */
  title?: React.ReactNode;
  /** 제목 아래 설명. */
  description?: React.ReactNode;
  /** 전체 결과 수. ko-KR 천 단위 구분으로 렌더링됩니다(`3941` → `3,941개`). */
  count?: number;
  /** Render the search control. Set false for count/filter/action-only collections. @default true */
  searchable?: boolean;
  /** 제어 검색어. */
  searchValue?: string;
  /** 비제어 검색어 초기값. @default "" */
  defaultSearchValue?: string;
  /** 검색어 변경 콜백. */
  onSearchChange?: (value: string) => void;
  /** 검색 input placeholder와 accessible name. @default "검색" */
  searchPlaceholder?: string;
  /** 필터 chip/menu 슬롯. 함수면 검색 필드와 같은 control size를 받습니다. */
  filters?: React.ReactNode | ((context: DataToolbarFilterContext) => React.ReactNode);
  /** 우측 일반 액션 슬롯. */
  actions?: React.ReactNode;
  /** 밀도. @default "md" */
  size?: DataToolbarSize;
  /** 외곽선 소유. "embedded"는 툴바 자체 테두리·radius를 제거하고 하단 divider만 남겨, 부모 표면(section·Card) 안에서 헤더로 결합합니다. @default "standalone" */
  variant?: 'standalone' | 'embedded';
  classNames?: LdsClassNames<DataToolbarPart>;
  styles?: LdsStyles<DataToolbarPart>;
  vars?: LdsVars<DataToolbarVariable>;
}

/** DataGrid/Table 상단의 검색, 필터, 결과 수, 액션을 정렬하는 툴바. 선택 bulk action은 DataGrid가 담당합니다. */
export const DataToolbar: React.ForwardRefExoticComponent<DataToolbarProps & React.RefAttributes<HTMLDivElement>>;
