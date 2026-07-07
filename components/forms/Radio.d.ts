import * as React from "react";

export interface RadioProps {
  /** 컨트롤 옆 라벨. */
  label?: React.ReactNode;
  /** 이 옵션의 선택 여부. */
  checked?: boolean;
  /** Initial checked state for uncontrolled usage. */
  defaultChecked?: boolean;
  /** 라디오 세트가 공유하는 그룹 이름. */
  name?: string;
  /** 이 옵션의 값. */
  value?: string;
  /** 네이티브 change 핸들러. */
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  /** 컨트롤 크기. @default "md" */
  size?: "sm" | "md" | "small" | "medium";
  /** fixed visual state for evidence matrices. */
  state?: "unchecked" | "checked";
  /** custom typography emphasis alias. */
  bold?: boolean;
  /** 라벨 간격을 좁힘. @default false */
  tight?: boolean;
  interaction?: "normal" | "inactive" | "hovered" | "focused";
  /** 흐림 + 상호작용 차단. @default false */
  disabled?: boolean;
  /** disabled alias. */
  disable?: boolean;
  labelStyle?: React.CSSProperties;
  style?: React.CSSProperties;
  id?: string;
  "aria-label"?: string;
}

/** 라디오 컨트롤 — 선택되면 LK 시그널 잉크 점으로 채워지는 헤어라인 링. */
export function Radio(props: RadioProps): JSX.Element;
