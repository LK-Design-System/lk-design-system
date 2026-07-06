import * as React from 'react';

export interface TableColumn<Row extends Record<string, unknown> = Record<string, unknown>> {
  /** 셀 값을 위한 행 객체의 키. */
  key: keyof Row & string;
  label: React.ReactNode;
  align?: 'left' | 'center' | 'right';
  width?: number | string;
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
}

/** 차분한 데이터 표 — 캡션 헤더, tabular 행, 호버 워시, 커스텀 셀. */
export function Table<Row extends Record<string, unknown> = Record<string, unknown>>(props: TableProps<Row>): JSX.Element;
