import * as React from "react";

export type ThumbnailRatio =
  | "1/1"
  | "5/4"
  | "4/3"
  | "3/2"
  | "16/10"
  | "1.618/1"
  | "16/9"
  | "2/1"
  | "21/9"
  | "4/5"
  | "3/4"
  | "2/3"
  | "10/16"
  | "1/1.618"
  | "9/16"
  | "1/2"
  | "9/21";

export interface ThumbnailProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 이미지 URL. 생략하면 중립 플레이스홀더로 채움. */
  src?: string;
  /** 이미지의 대체 텍스트. */
  alt?: string;
  /** ratio preset or CSS/number aspect ratio. @default "1/1" */
  ratio?: ThumbnailRatio | number | string;
  /** 둥근 모서리: true = --radius-md, false = 사각, 또는 숫자/CSS 길이. @default true */
  radius?: boolean | number | string;
  /** border toggle (WDS bakes a 1px hairline into every thumbnail). @default true */
  border?: boolean | string;
  /** 이미지의 object-fit. @default "cover" */
  fit?: "cover" | "contain";
  /** 오버레이 노드(배지, 재생 글리프, 재생시간). */
  overlay?: React.ReactNode;
  /** 오버레이 위치. @default "top-left" */
  overlayAlign?:
    "top-left" | "top-right" | "bottom-left" | "bottom-right" | "center";
  /** src가 없을 때 플레이스홀더 아이콘을 표시. @default true */
  placeholder?: boolean;
  /** 플레이스홀더 아이콘 이름. @default "image" */
  placeholderIcon?: string;
  children?: React.ReactNode;
}

/** Thumbnail media tile with ratio, radius, border, placeholder, and overlay slot. */
export function Thumbnail(props: ThumbnailProps): React.JSX.Element;
