import * as React from "react";

export type TabItem =
  | string
  | {
      value: string;
      label: React.ReactNode;
      count?: number;
      active?: boolean;
      disabled?: boolean;
      trailing?: React.ReactNode;
      trailingIconButton?: boolean | React.ReactNode;
      style?: React.CSSProperties;
    };

export interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  items: TabItem[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string, item: Exclude<TabItem, string>) => void;
  /** Legacy fill prop. Prefer `resize="fill"`. @default false */
  full?: boolean;
  /** resize axis. @default "hug" */
  resize?: "hug" | "fill";
  /** size axis. @default "medium" */
  size?: "small" | "sm" | "medium" | "md" | "large" | "lg";
  /** padding axis. @default false */
  padding?: boolean;
  /** trailingIconButton axis. @default false */
  trailingIconButton?: boolean | React.ReactNode;
  /** scroll axis. @default "auto" */
  scroll?: "auto" | boolean;
  /** 활성 탭 강조. `alternative`는 잉크 대신 브랜드 primary 색을 씁니다. @default "normal" */
  variant?: "normal" | "alternative";
}

/** underline tab navigation with hug/fill resize, size, padding, trailing icon, and scroll axes. */
export function Tabs(props: TabsProps): JSX.Element;
