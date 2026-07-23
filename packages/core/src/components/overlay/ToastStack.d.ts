import * as React from 'react';

export interface ToastStackProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 모서리 / 가장자리. @default "bottom-right" */
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left' | 'bottom-center';
  gap?: number;
  /**
   * 스택이 살아 있는 동안 유지되는 polite/assertive 라이브 영역 한 쌍을 렌더링하고,
   * 하위 `Toast`가 자기 메시지를 그쪽으로 announce하게 합니다. 끄면 각 Toast가 스스로
   * 라이브 영역이 됩니다(삽입과 동시에 생기는 라이브 영역은 announce 신뢰도가 낮습니다).
   * @default true
   */
  liveRegion?: boolean;
  children?: React.ReactNode;
}

/** Toast 자식을 쌓는 고정 뷰포트 + 상시 라이브 영역 호스트. */
export function ToastStack(props: ToastStackProps): React.JSX.Element;
