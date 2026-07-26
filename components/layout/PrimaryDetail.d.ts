import * as React from 'react';

export interface PrimaryDetailProps extends React.HTMLAttributes<HTMLDivElement> {
  primary: React.ReactNode;
  detail?: React.ReactNode;
  /** 상세 표시 여부. @default false */
  detailOpen?: boolean;
  /** 데스크톱 병렬 region 또는 좁은 폭 modal Drawer. @default "inline" */
  mode?: 'inline' | 'overlay';
  primaryLabel?: string;
  detailLabel?: string;
  detailTitle?: React.ReactNode;
  /** inline track 및 Drawer 너비. @default 360 */
  detailWidth?: number;
  detailFooter?: React.ReactNode;
  onDetailClose?: () => void;
  closeLabel?: string;
  /** overlay가 열릴 때 우선 초점을 받을 상세 내부 요소. */
  initialFocusRef?: React.RefObject<HTMLElement | null>;
  /** inline close 및 overlay dismiss 뒤 초점을 돌려보낼 선택 trigger. */
  returnFocusRef?: React.RefObject<HTMLElement | null>;
  /** overlay focus 복원. @default true */
  restoreFocus?: boolean;
  primaryStyle?: React.CSSProperties;
  detailStyle?: React.CSSProperties;
  detailBodyStyle?: React.CSSProperties;
}

/** 선택 가능한 기본 콘텐츠와 상세 region/Drawer를 연결하는 LDS Product 레이아웃 패턴입니다. */
export function PrimaryDetail(props: PrimaryDetailProps): React.JSX.Element;
