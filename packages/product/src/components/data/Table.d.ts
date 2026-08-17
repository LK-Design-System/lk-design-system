import * as React from 'react';

export interface TableColumn<Row extends Record<string, unknown> = Record<string, unknown>> {
  /** 셀 값을 위한 행 객체의 키. */
  key: keyof Row & string;
  label: React.ReactNode;
  align?: 'left' | 'center' | 'right';
  width?: number | string;
  /** Let this column consume remaining width and ellipsize overflowing plain text. Prefer one truncate column per table; custom render layouts must also allow their own contents to shrink. @default false */
  truncate?: boolean;
  /** 전체 행을 받는 커스텀 셀 렌더러. */
  render?: (row: Row) => React.ReactNode;
}

export interface TableProps<Row extends Record<string, unknown> = Record<string, unknown>> extends React.HTMLAttributes<HTMLDivElement> {
  columns: TableColumn<Row>[];
  rows: Row[];
  /** 행 밀도. @default "md" */
  size?: 'sm' | 'md';
  /** 행 호버 워시. @default true */
  hover?: boolean;
  /**
   * 모든 데이터 행에 가장 조용한 fill 밴드를 깝니다. 라벨과 측정값 사이가
   * 먼 넓은 표에서 헤어라인 대신 밴드가 행의 시선을 잇습니다. 교차(지브라)가
   * 아니라 전 행 밴드입니다 — 행이 적을 때 줄무늬는 강조로 오독됩니다.
   * @default false
   */
  banded?: boolean;
  /** 표 위에 보이는 `<caption>`. 표의 접근 가능한 이름이 됩니다. */
  caption?: React.ReactNode;
  /** 보이는 캡션이 없을 때 `<table>`에 붙는 aria-label. */
  tableLabel?: string;
  /** 표 밖의 제목 요소 id. 보이는 캡션이 없을 때 `<table>`의 aria-labelledby가 됩니다. */
  tableLabelledBy?: string;
  /** 행을 식별하는 컬럼 key. 지정하면 해당 셀이 `<th scope="row">`로 렌더링됩니다. */
  rowHeaderKey?: keyof Row & string;
  /**
   * 행을 묶는 필드 key. 같은 값의 **연속 구간**마다 표 전체를 가로지르는
   * `<th scope="colgroup">` 그룹 헤더가 한 번 열립니다. 흩어진 같은 값은
   * 모으지 않고 두 번째 구간을 엽니다 — 호출자의 행 순서가 곧 보고의
   * 순서이기 때문입니다. 그룹 행은 밴드를 입지 않습니다.
   */
  groupKey?: keyof Row & string;
  /** React key로 쓸 안정적인 행 식별자. 생략하면 `row.id`, 그다음 배열 index를 씁니다. */
  getRowId?: (row: Row, index: number) => React.Key;
  /** 행별 className, style, data attribute와 이벤트를 `<tr>`에 전달합니다. */
  getRowProps?: (row: Row, index: number) => React.HTMLAttributes<HTMLTableRowElement>;
}

export interface TableCellStyleOptions {
  /** Cell padding. @default "14px 16px" */
  padding?: number | string;
  /** Logical text alignment. @default "left" */
  align?: 'left' | 'center' | 'right';
  width?: number | string;
  /** Apply the Table flexible-column constraint and text overflow treatment. @default false */
  truncate?: boolean;
}

/** LDS Table 머리글 셀의 공개 스타일. 제품 소유 native table과 시각을 맞출 때 사용합니다. */
export function getTableHeaderCellStyle(options?: TableCellStyleOptions): React.CSSProperties;
/** LDS Table 데이터 셀의 공개 스타일. 제품 소유 native table과 시각을 맞출 때 사용합니다. */
export function getTableDataCellStyle(options?: TableCellStyleOptions): React.CSSProperties;

/** 차분한 데이터 표 — 캡션 헤더, tabular 행, 호버 워시, 커스텀 셀. */
export function Table<Row extends Record<string, unknown> = Record<string, unknown>>(props: TableProps<Row>): React.JSX.Element;
