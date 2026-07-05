import * as React from 'react';

export interface AvatarGroupItem {
  src?: string;
  name?: string;
}

export interface AvatarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  items: AvatarGroupItem[];
  /** "+N"으로 접히기 전 최대 아바타 수. @default 4 */
  max?: number;
  /** 지름(px). @default 36 */
  size?: number;
}

/** "+N" 오버플로 칩이 있는 겹친 아바타. */
export function AvatarGroup(props: AvatarGroupProps): JSX.Element;
