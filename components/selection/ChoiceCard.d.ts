import * as React from "react";

export interface ChoiceCardProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "onSelect"
> {
  /** Selected state. @default false */
  selected?: boolean;
  /** Blocks pointer and keyboard interaction. @default false */
  disabled?: boolean;
  /** Uses checkbox semantics for multi-select choices. @default false */
  multiple?: boolean;
  /** Called with the next selected state. */
  onSelect?: (next: boolean) => void;
  /** Standard choice-card title. */
  title?: React.ReactNode;
  /** Standard choice-card description. */
  description?: React.ReactNode;
  /** Leading icon for the standard choice-card layout. */
  icon?: React.ReactNode;
  /** `frame` renders the framed selection treatment. @default "choice" */
  presentation?: "choice" | "frame";
  /** Semantic status tone for frame presentation. @default "normal" */
  status?: "normal" | "negative";
  /** Forces visual interaction state for documentation matrices. */
  interaction?: "normal" | "hovered" | "focused";
  /** Frame presentation radius. @default "md" */
  radius?: "sm" | "md" | "lg" | "xl";
  /** Frame presentation padding. @default "md" */
  padding?: "sm" | "md" | "lg" | "xl";
  /** Frame presentation shadow. @default "none" */
  shadow?: "none" | "xs" | "sm" | "md" | "lg";
  /** Shows the trailing selected indicator in choice presentation. @default true */
  showIndicator?: boolean;
  children?: React.ReactNode;
}

/** Selectable LDS option card, with framed treatment via `presentation="frame"`. */
export function ChoiceCard(props: ChoiceCardProps): JSX.Element;
