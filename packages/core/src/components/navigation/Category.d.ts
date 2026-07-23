import * as React from "react";

export type CategoryItem =
  | string
  | {
      value: string;
      label: React.ReactNode;
      /**
       * Uncontrolled INITIAL selection seed only. Ignored after mount and
       * ignored when `value`/`defaultValue` is provided; it never forces a
       * second checked chip at render time.
       */
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
  /** Accessible name of the radiogroup container. @default "카테고리" */
  ariaLabel?: string;
  itemStyle?: React.CSSProperties;
}

/**
 * navigation category chip group. Single-select `role="radiogroup"`:
 * chips are `role="radio"` with `aria-checked`, the selected (or first
 * enabled) chip is the single Tab stop, and Arrow/Home/End keys move focus
 * and select, skipping disabled chips.
 */
export function Category(props: CategoryProps): React.JSX.Element;
