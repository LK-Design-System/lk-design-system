import * as React from 'react';

export type LightboxImage = string | { src: string; alt?: string };

export interface LightboxProps {
  open?: boolean;
  images: LightboxImage[];
  /** 현재 인덱스. @default 0 */
  index?: number;
  onClose?: () => void;
  onIndexChange?: (index: number) => void;
  initialFocusRef?: React.RefObject<HTMLElement | null>;
  returnFocusRef?: React.RefObject<HTMLElement | null>;
  restoreFocus?: boolean;
  /** 다이얼로그의 접근 가능한 이름. @default "이미지 뷰어" */
  ariaLabel?: string;
  /** 닫기 버튼의 접근 가능한 이름. @default "닫기" */
  closeLabel?: string;
  /** 이전 이미지 버튼의 접근 가능한 이름. @default "이전 이미지" */
  previousLabel?: string;
  /** 다음 이미지 버튼의 접근 가능한 이름. @default "다음 이미지" */
  nextLabel?: string;
  /** 위치 표시와 슬라이드 알림 문구를 만드는 formatter. @default (n, total) => `이미지 ${n} / ${total}` */
  positionLabel?: (position: number, total: number) => string;
  style?: React.CSSProperties;
}

/** 이전/다음 + 키보드 지원이 있는 전체 화면 이미지 뷰어. */
export function Lightbox(props: LightboxProps): React.JSX.Element | null;
