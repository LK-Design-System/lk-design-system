import * as React from 'react';

export interface ScrollAreaProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 최대 높이(px 또는 CSS). @default 280 */
  maxHeight?: number | string;
  children?: React.ReactNode;
}

/** 얇은 커스텀 스크롤바가 있는 스크롤 컨테이너. */
export function ScrollArea(props: ScrollAreaProps): React.JSX.Element;
