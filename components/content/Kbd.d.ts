import * as React from 'react';

export interface KbdProps extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode;
}

/** 단축키용 키보드 키 글리프. */
export function Kbd(props: KbdProps): React.JSX.Element;
