import * as React from "react";

export type CategoryItem =
  | string
  | {
      value: string;
      label: React.ReactNode;
      active?: boolean;
      disabled?: boolean;
      style?: React.CSSProperties;
    };

export interface CategoryProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  items: CategoryItem[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string, item: Exclude<CategoryItem, string>) => void;
  /** variant axis. @default "normal" */
  variant?: "normal" | "alternative";
  /** size axis: small 24, medium 32, large 36, xlarge 40. @default "medium" */
  size?: "small" | "sm" | "medium" | "md" | "large" | "lg" | "xlarge" | "xl";
  /** horizontal padding axis. @default false */
  padding?: boolean;
  /** verticalPadding axis. @default false */
  verticalPadding?: boolean;
  /** scroll axis. @default "auto" */
  scroll?: "auto" | boolean;
  itemStyle?: React.CSSProperties;
}

/** navigation category chip group. */
export function Category(props: CategoryProps): React.JSX.Element;
