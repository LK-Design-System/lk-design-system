import * as React from 'react';

export type PadDirection = 'up' | 'down' | 'left' | 'right';

export interface DirectionalPadProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 방향 스텝 콜백. 누르고 있으면 rate Hz로 반복. */
  onStep?: (dir: PadDirection) => void;
  /** 홀드 반복 주기(Hz). @default 8 */
  rate?: number;
  /** 버튼 한 변 크기(px). @default 48 */
  size?: number;
  disabled?: boolean;
  /** 가운데 버튼 콘텐츠(예: HOME). */
  center?: React.ReactNode;
  onCenter?: () => void;
}

/** PTZ·짐벌·조그용 D-pad. 누르고 있으면 반복 스텝, 탭은 1회. 아날로그는 Joystick. */
export function DirectionalPad(props: DirectionalPadProps): JSX.Element;
