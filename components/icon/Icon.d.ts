import React from "react";

export type IconName =
  | "arrow-left" | "arrow-right" | "arrow-up" | "arrow-down" | "arrow-up-right"
  | "android" | "apple" | "dot"
  | "bell" | "bookmark"
  | "bookmark-fill" | "bubble" | "bulb" | "business-bag" | "calendar" | "check"
  | "chevron-down" | "chevron-left" | "chevron-right" | "chevron-up"
  | "circle-check" | "circle-check-fill" | "circle-exclamation" | "circle-info"
  | "clock" | "close" | "company" | "crown" | "document" | "download"
  | "external-link" | "eye" | "eye-slash" | "filter" | "fire" | "globe" | "heart"
  | "home" | "home-fill" | "location" | "lock" | "magic-wand" | "mail" | "minus"
  | "more-horizontal" | "more-vertical" | "nav-career" | "nav-menu" | "nav-mypage"
  | "nav-recruit" | "nav-social" | "person" | "persons" | "plus" | "search"
  | "send" | "setting" | "share" | "sparkle" | "star" | "star-fill" | "tag"
  | "trash" | "upload" | "verified-check"
  | "circle" | "circle-fill" | "circle-dot" | "square" | "square-fill" | "square-check" | "square-caret" | "pin" | "ticket" | "ticket-fill"
  | "heart-fill" | "line-horizontal" | "play" | "triangle-exclamation"
  | "robot" | "joystick" | "waypoint" | "route" | "zone" | "layers" | "lidar" | "battery" | "battery-charging" | "gauge" | "signal" | "crosshair" | "compass" | "map" | "cpu" | "camera";

export interface IconProps extends React.SVGAttributes<SVGElement> {
  /** 24px 아이콘 세트의 글리프 이름. */
  name: IconName;
  /** 렌더되는 정사각 크기(px). 기본 24. */
  size?: number;
  /** 색상 재정의(그 외에는 currentColor 상속). */
  color?: string;
}

/** 사용 가능한 모든 아이콘 이름(반복용). */
export const ICON_NAMES: IconName[];

/**
 * Icon — 인라인 SVG로 렌더되는 단일 24px 글리프.
 * 단색; currentColor로 텍스트 색을 상속. 인터랙티브 컨트롤에는 IconButton과
 * 함께 쓰거나, 텍스트 옆에 인라인으로 배치.
 */
export function Icon(props: IconProps): JSX.Element;
export default Icon;
