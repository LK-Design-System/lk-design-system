import * as React from 'react';

export interface VisuallyHiddenProps extends React.HTMLAttributes<HTMLElement> {
  /** 렌더할 요소. @default "span" */
  as?: React.ElementType;
  children?: React.ReactNode;
}

/** 시각적으로는 숨기되 스크린 리더에는 남김. */
export function VisuallyHidden(props: VisuallyHiddenProps): JSX.Element;
