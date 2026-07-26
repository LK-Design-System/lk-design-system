import * as React from "react";
import type { AvatarProps } from "./Avatar";

export interface AvatarGroupItem extends Pick<
  AvatarProps,
  | "src"
  | "alt"
  | "name"
  | "status"
  | "variant"
  | "placeholder"
  | "deactivated"
  | "interaction"
  | "pushBadge"
> {}

export interface AvatarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  items: AvatarGroupItem[];
  /** Maximum visible avatars. Legacy overflow uses +N unless trailingContent is enabled. @default 4 */
  max?: number;
  /** Avatar diameter in px or Avatar Group size key. group size keys map to xsmall 24, default 32, small 40. @default 32 */
  size?: number | "xsmall" | "default" | "small";
  /** Default variant passed to items unless an item overrides it. @default 'person' */
  variant?: AvatarProps["variant"];
  /** Default placeholder mode passed to items unless an item overrides it. @default 'initials' */
  placeholder?: AvatarProps["placeholder"];
  /** trailingContent slot. `true` renders `외 N명` unless trailingLabel is provided. @default false */
  trailingContent?: boolean | React.ReactNode;
  /** Label used when trailingContent is true. */
  trailingLabel?: React.ReactNode;
  /**
   * Root role. Defaults to `"group"` when `aria-label` / `aria-labelledby` is
   * supplied so the group summary label is exposed, and to no role otherwise.
   */
  role?: string;
}

/**
 * Overlapping avatars with variants, sizes, and trailingContent support.
 * A named group exposes `role="group"` so its `aria-label` reaches assistive
 * technology.
 */
export function AvatarGroup(props: AvatarGroupProps): React.JSX.Element;
