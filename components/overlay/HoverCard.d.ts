import * as React from 'react';

export interface HoverCardProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** 호버 시 카드를 드러내는 요소. */
  trigger: React.ReactNode;
  children: React.ReactNode;
  /** 앵커 방향. @default "left" */
  align?: 'left' | 'right';
  /** 너비(px). @default 280 */
  width?: number;
  /** 제어된 열림 상태. */
  open?: boolean;
  /** 비제어 초기 열림 상태. @default false */
  defaultOpen?: boolean;
  /** 열림 상태 변경 알림. */
  onOpenChange?: (open: boolean) => void;
  /** 포인터로 열릴 때의 지연(ms). @default 120 */
  openDelay?: number;
  /** 포인터/초점이 떠난 뒤 닫히는 지연(ms). @default 120 */
  closeDelay?: number;
}

/** hover/focus로 열리는 비상호작용 미리보기; Escape로 닫힘. */
export function HoverCard(props: HoverCardProps): React.JSX.Element;
