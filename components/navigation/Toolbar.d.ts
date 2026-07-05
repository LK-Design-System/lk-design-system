import * as React from 'react';

export interface ToolbarProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

/** 그룹화된 컨트롤(아이콘 버튼, 토글)을 위한 가로 컨테이너. */
export function Toolbar(props: ToolbarProps): JSX.Element;
