import * as React from "react";

export interface AvatarProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Image URL. Falls back when omitted. */
  src?: string;
  alt?: string;
  /** Name used for initials and accessible image fallback text. */
  name?: string;
  /** avatar variant. `education` is kept as a backwards-compatible alias for `academy`. @default 'person' */
  variant?: "person" | "company" | "academy" | "education";
  /** Avatar diameter in px or size key. size keys map to xsmall 24, small 32, medium/default 40, large 48, xlarge 56. @default 40 */
  size?:
    number | "xsmall" | "small" | "default" | "medium" | "large" | "xlarge";
  /** Optional status dot. Hidden when deactivated is true. */
  status?: "online" | "busy" | "offline";
  /** White halo for stacked avatars or image surfaces. @default false */
  ring?: boolean;
  /** Fallback rendering aligned to avatar resource placeholders. @default 'initials' */
  placeholder?:
    boolean | "initials" | "person" | "company" | "academy" | "education";
  /** Shows the deactivated slash treatment and suppresses the status dot. @default false */
  deactivated?: boolean;
  /** Static interaction state for examples and visual parity checks. @default false */
  interaction?: false | true | "normal" | "hovered" | "focused" | "pressed";
  /** pushBadge state. `true` renders a dot; string/number renders compact text. @default false */
  pushBadge?: boolean | string | number;
  /** Optional customization hook matching the borderColor example. */
  borderColor?: string;
  /** Optional customization hook matching the borderWeight example. */
  borderWeight?: number | string;
}

/** Round identity image with variants, sizes, placeholders, interaction states, pushBadge, and deactivated treatment. */
export function Avatar(props: AvatarProps): JSX.Element;
