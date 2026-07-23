import * as React from 'react';

export interface ScrollAreaProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 최대 높이(px 또는 CSS). @default 280 */
  maxHeight?: number | string;
  /**
   * 스크롤 영역의 접근 가능한 이름(`aria-label`). 실제로 스크롤되는 영역은
   * 키보드 포커스를 받으므로 이름이 반드시 필요합니다.
   */
  label?: string;
  /** `label` 대신 화면의 기존 제목을 참조할 때 쓰는 `aria-labelledby` id. */
  labelledBy?: string;
  /**
   * 키보드 포커스 가능 여부. `"auto"`는 내용이 실제로 넘칠 때만
   * `tabIndex=0` + `role="region"`을 부여합니다(W3C `scrollable-region-focusable`).
   * @default "auto"
   */
  focusable?: boolean | 'auto';
  children?: React.ReactNode;
}

/** 얇은 커스텀 스크롤바가 있는 스크롤 컨테이너. 넘칠 때만 키보드 포커스 대상이 됩니다. */
export function ScrollArea(props: ScrollAreaProps): React.JSX.Element;
