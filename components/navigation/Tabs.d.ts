import * as React from "react";

export type TabItem =
  | string
  | {
      value: string;
      label: React.ReactNode;
      count?: number;
      /**
       * Uncontrolled INITIAL selection only. Ignored after mount and
       * ignored when `value`/`defaultValue` is provided; it never forces a
       * second selected tab at render time.
       */
      active?: boolean;
      disabled?: boolean;
      trailing?: React.ReactNode;
      trailingIconButton?: boolean | React.ReactNode;
      /**
       * Overrides the auto-generated tab id (`useId()`-based). Set it when a
       * panel needs a stable `aria-labelledby` reference to this tab.
       */
      tabId?: string;
      /**
       * Id of the consumer-rendered panel. Applied as `aria-controls` on the
       * tab. The consumer marks the panel with `role="tabpanel"`,
       * `id={panelId}`, `aria-labelledby={tab id}`, and `tabIndex={0}`.
       */
      panelId?: string;
      style?: React.CSSProperties;
    };

export interface TabsProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
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
  /** Inline padding. `true` preserves the legacy 8px value; a number or CSS length sets an explicit inset. @default false */
  padding?: boolean | number | string;
  /** trailingIconButton axis. @default false */
  trailingIconButton?: boolean | React.ReactNode;
  /** scroll axis. @default "auto" */
  scroll?: "auto" | boolean;
}

/** underline tab navigation with hug/fill resize, size, padding, trailing icon, and scroll axes. */
export function Tabs(props: TabsProps): React.JSX.Element;
