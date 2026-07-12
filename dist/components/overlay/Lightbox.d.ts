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
  style?: React.CSSProperties;
}

/** 이전/다음 + 키보드 지원이 있는 전체 화면 이미지 뷰어. */
export function Lightbox(props: LightboxProps): React.JSX.Element | null;
