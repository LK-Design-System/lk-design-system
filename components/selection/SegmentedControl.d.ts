import * as React from "react";

export type SegmentOption =
  | string
  | {
      value: string;
      label: React.ReactNode;
      icon?: React.ReactNode;
      disabled?: boolean;
      interaction?:
        | "normal"
        | "inactive"
        | "hovered"
        | "focused"
        | "active"
        | "active-focused";
    };

export interface SegmentedControlProps {
  /** 옵션 — 일반 문자열 또는 `{ value, label }`. */
  options: SegmentOption[];
  /** 제어되는 선택 값. */
  value?: string;
  /** 비제어 초기 값(기본값은 첫 옵션). */
  defaultValue?: string;
  onChange?: (value: string) => void;
  /** visual variant. @default "solid" */
  variant?: "solid" | "outlined";
  /** 높이. @default "md" */
  size?: "sm" | "md" | "lg" | "small" | "medium" | "large";
  interaction?:
    "normal" | "inactive" | "hovered" | "focused" | "active" | "active-focused";
  /** 세그먼트를 컨테이너 폭까지 늘림. @default false */
  full?: boolean;
  /** resize axis. `fill` stretches segments; `hug` keeps intrinsic width. */
  resize?: "fill" | "hug";
  /** Blocks all segment buttons. */
  disabled?: boolean;
  /** disabled alias. */
  disable?: boolean;
  style?: React.CSSProperties;
}

/** 단일 선택 세그먼트 토글 — 활성 세그먼트가 화이트 필로 올라감. */
export function SegmentedControl(props: SegmentedControlProps): JSX.Element;
