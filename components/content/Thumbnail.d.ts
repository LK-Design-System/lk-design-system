import * as React from 'react';

export interface ThumbnailProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 이미지 URL. 생략하면 중립 플레이스홀더로 채움. */
  src?: string;
  /** 이미지의 대체 텍스트. */
  alt?: string;
  /** 종횡비(너비 / 높이). @default 1 */
  ratio?: number;
  /** 둥근 모서리: true = --radius-md, false = 사각, 또는 숫자/CSS 길이. @default true */
  radius?: boolean | number | string;
  /** 이미지의 object-fit. @default "cover" */
  fit?: 'cover' | 'contain';
  /** 오버레이 노드(배지, 재생 글리프, 재생시간). */
  overlay?: React.ReactNode;
  /** 오버레이 모서리. @default "top-left" */
  overlayAlign?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  children?: React.ReactNode;
}

/** 비율 고정 미디어 타일 + 선택적 반경 + 오버레이 슬롯. */
export function Thumbnail(props: ThumbnailProps): JSX.Element;
