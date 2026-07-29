import * as React from 'react';

export type Floor = string | { value: string; label: React.ReactNode };

export interface FloorSelectorProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** 층 목록 — 문자열 또는 `{ value, label }`(위→아래 순서대로). */
  floors: Floor[];
  /** 제어되는 현재 층. */
  value?: string;
  /** 비제어 초기 층(기본 첫 항목). */
  defaultValue?: string;
  onChange?: (value: string) => void;
  /**
   * 놓이는 표면의 외형. Viewer 표면(다크 캔버스) 위에 얹을 때는 `dark`를 지정한다.
   * 기본 `light`의 채움·라벨 잉크는 다크 캔버스 위에서 약 1.3:1까지 떨어진다.
   * @default "light"
   */
  appearance?: 'light' | 'dark';
}

/** 층/레벨 선택기(빌딩 내비) — 단일 선택, 활성 층은 시그널 잉크. */
export function FloorSelector(props: FloorSelectorProps): React.JSX.Element;
