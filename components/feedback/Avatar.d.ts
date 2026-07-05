import * as React from 'react';

export interface AvatarProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** 이미지 URL. 생략하면 이니셜로 폴백. */
  src?: string;
  alt?: string;
  /** 폴백 이니셜을 만드는 데 쓰는 이름. */
  name?: string;
  /** 픽셀 지름. @default 48 */
  size?: number;
  /** 상태 점. */
  status?: 'online' | 'busy' | 'offline';
  /** 이미지 위에 겹칠 때의 화이트 헤일로 링. @default false */
  ring?: boolean;
}

/** 상태 점(옵션)이 있는 둥근 사진; 이니셜은 쿨 그레이 틴트로 폴백. */
export function Avatar(props: AvatarProps): JSX.Element;
