import * as React from 'react';

export interface ChecklistItemProps extends React.HTMLAttributes<HTMLElement> {
  /** 시그널 잉크 체크 대신 레드 크로스 + 취소선 표시(제외 항목). @default false */
  cross?: boolean;
  /** 라벨을 흐리게(약한 톤) 표시. 취소선은 `cross`가 담당합니다. @default false */
  muted?: boolean;
  /** 다크 서피스에 렌더. @default false */
  dark?: boolean;
  /**
   * 행 엘리먼트. 기본은 `li` — 여러 행은 `ul`/`ol` 안에 넣어 목록으로 읽히게
   * 합니다. 목록이 아닌 단독 행에만 `"div"`를 쓰세요.
   * @default "li"
   */
  as?: 'li' | 'div';
  /**
   * 포함/제외 상태의 텍스트 대안(시각적으로 숨겨져 스크린리더에만 전달).
   * 기본값은 `cross`에 따라 `"포함"` 또는 `"제외"`이며, 다른 어휘가 필요하면
   * 직접 지정합니다(예: `"지원"` / `"미지원"`). 주변 문맥이 이미 상태를
   * 전달할 때만 `null`로 끄세요.
   */
  stateLabel?: React.ReactNode;
  children?: React.ReactNode;
}

/** 기능 행 — 시그널 잉크 체크(또는 레드 크로스) + 라벨. 브랜드의 핵심 리스트 스타일. */
export function ChecklistItem(props: ChecklistItemProps): React.JSX.Element;
