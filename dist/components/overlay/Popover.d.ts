import * as React from 'react';

export interface PopoverProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 패널을 토글하는 요소. */
  trigger: React.ReactNode;
  /** 패널 콘텐츠. */
  children: React.ReactNode;
  /** 앵커 방향. @default "left" */
  align?: 'left' | 'right';
  /** 패널 너비(px). @default 260 */
  width?: number;
  /** 제어된 열림 상태. */
  open?: boolean;
  /** 비제어 초기 열림 상태. @default false */
  defaultOpen?: boolean;
  /** 열림 상태 변경 알림. */
  onOpenChange?: (open: boolean) => void;
  /** 비모달 dialog 표면의 접근 가능한 이름. @default "팝오버" */
  ariaLabel?: string;
}

/** 임의의 콘텐츠를 담는 앵커드 플로팅 패널; 바깥 클릭/Escape 시 닫힘. */
export function Popover(props: PopoverProps): React.JSX.Element;
