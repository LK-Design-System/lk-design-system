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
  /**
   * 밀도. 이 선택기의 제자리는 Viewer 컨트롤 레일이라 ViewerToolbar(28px 버튼)와
   * 높이를 맞춘 `sm`이 기본이다. 패널 전체를 겨눌 수 있는 단독 배치에는 44px 타깃의
   * `md`를 쓴다. `sm`도 WCAG 2.5.8(AA, 24×24)은 충족하며, 2.5.5(AAA, 44×44)가
   * 필요한 화면에서는 `md`를 지정한다.
   * @default "sm"
   */
  size?: 'md' | 'sm';
}

/** 층/레벨 선택기(빌딩 내비) — 단일 선택, 활성 층은 시그널 잉크. */
export function FloorSelector(props: FloorSelectorProps): React.JSX.Element;
