"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }"use client";


var _chunk677EM4M2cjs = require('./chunk-677EM4M2.cjs');

// components/feedback/Avatar.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
var PLACEHOLDER_PATHS = {
  person: "M24 0H0V24H24V0ZM12.0007 5.90324C10.3806 5.90324 9.06734 7.21654 9.06734 8.83657C9.06734 10.4566 10.3806 11.7699 12.0007 11.7699C13.6207 11.7699 14.934 10.4566 14.934 8.83657C14.934 7.21654 13.6207 5.90324 12.0007 5.90324ZM7.94485 13.9487C9.02103 13.369 10.4593 13.0673 12.0006 13.0673C13.5419 13.0673 14.9802 13.369 16.0564 13.9487C17.1318 14.528 17.9339 15.4448 17.9339 16.6673L17.9339 16.8852C17.9339 17.0096 17.934 17.1363 17.9251 17.2446C17.9153 17.3651 17.8916 17.5146 17.814 17.6667C17.7086 17.8737 17.5403 18.042 17.3334 18.1474C17.1812 18.225 17.0317 18.2487 16.9112 18.2585C16.803 18.2674 16.6763 18.2674 16.5519 18.2674H16.5519L7.44952 18.2679C7.32508 18.2679 7.1984 18.268 7.0901 18.2591C6.96962 18.2493 6.82012 18.2256 6.66795 18.1481C6.46096 18.0426 6.29267 17.8743 6.1872 17.6673C6.10967 17.5152 6.08595 17.3657 6.07611 17.2452C6.06726 17.1369 6.06728 17.0102 6.0673 16.8858L6.0673 16.6673C6.0673 15.4448 6.86943 14.528 7.94485 13.9487Z",
  company: "M24 0H0V24H24V0ZM7.91302 5.40129H7.91304H12.0909H12.0909C12.3518 5.40128 12.5828 5.40127 12.7742 5.4169C12.9781 5.43356 13.1893 5.4709 13.395 5.57568C13.696 5.72908 13.9408 5.97384 14.0942 6.2749C14.199 6.48054 14.2363 6.69177 14.253 6.89563C14.2686 7.08704 14.2686 7.31806 14.2686 7.57901V7.57903V7.57905V7.57906L14.2686 10.7346H16.0908H16.0908H16.0909H16.0909C16.3519 10.7346 16.5828 10.7346 16.7742 10.7502C16.9781 10.7669 17.1893 10.8042 17.3949 10.909C17.696 11.0624 17.9408 11.3072 18.0942 11.6082C18.1989 11.8139 18.2363 12.0251 18.2529 12.229C18.2686 12.4204 18.2686 12.6514 18.2686 12.9124V18.6013H13.6827L13.6686 18.6014L13.6545 18.6013H10.0109L10.0019 18.6014L9.99291 18.6013H5.73527L5.73527 7.57903V7.57901C5.73526 7.31803 5.73525 7.08706 5.75089 6.89563C5.76754 6.69177 5.80488 6.48054 5.90966 6.2749C6.06306 5.97384 6.30782 5.72908 6.60888 5.57568C6.81452 5.4709 7.02575 5.43356 7.22961 5.4169C7.42102 5.40127 7.65205 5.40128 7.91302 5.40129ZM13.0686 17.4013H10.6019V15.3347C10.6019 15.0033 10.3333 14.7347 10.0019 14.7347C9.67054 14.7347 9.40191 15.0033 9.40191 15.3347V17.4013H6.93529V7.40125C6.93529 6.9823 6.94269 6.91512 6.95486 6.87765C6.99443 6.75587 7.08991 6.6604 7.21168 6.62083C7.24915 6.60865 7.31633 6.60125 7.73528 6.60125H12.2686C12.6876 6.60125 12.7547 6.60865 12.7922 6.62083C12.914 6.6604 13.0095 6.75587 13.049 6.87765C13.0612 6.91512 13.0686 6.9823 13.0686 7.40125V17.4013ZM14.2686 17.4013H17.0686V12.7346C17.0686 12.3156 17.0612 12.2485 17.049 12.211C17.0094 12.0892 16.914 11.9937 16.7922 11.9542C16.7547 11.942 16.6875 11.9346 16.2686 11.9346H14.2686V17.4013ZM8.06858 8.66802C8.06858 8.33665 8.33721 8.06802 8.66858 8.06802H11.3352C11.6666 8.06802 11.9352 8.33665 11.9352 8.66802C11.9352 8.99939 11.6666 9.26802 11.3352 9.26802H8.66858C8.33721 9.26802 8.06858 8.99939 8.06858 8.66802ZM8.06858 11.3347C8.06858 11.0033 8.33721 10.7347 8.66858 10.7347H11.3352C11.6666 10.7347 11.9352 11.0033 11.9352 11.3347C11.9352 11.6661 11.6666 11.9347 11.3352 11.9347H8.66858C8.33721 11.9347 8.06858 11.6661 8.06858 11.3347Z",
  academy: "M24 0H0V24H24V0ZM12.269 5.79861C12.1001 5.71416 11.9013 5.71416 11.7324 5.79861L5.33352 8.99804C5.19712 9.06621 5.06051 9.13449 4.95386 9.20056C4.84988 9.26497 4.67173 9.38631 4.56945 9.60198C4.44939 9.85511 4.44939 10.1488 4.56945 10.4019C4.67173 10.6176 4.84988 10.7389 4.95386 10.8033C5.06051 10.8694 5.19713 10.9377 5.33354 11.0058L7.06739 11.8728L7.06733 14.9292V14.9292C7.06688 15.3292 7.06651 15.666 7.17305 15.9749C7.2665 16.2458 7.41899 16.4926 7.61951 16.6973C7.84815 16.9307 8.14953 17.081 8.50756 17.2595L10.8355 18.4235C11.1288 18.5704 11.376 18.6944 11.6442 18.7447C11.8798 18.7889 12.1216 18.7889 12.3572 18.7447C12.6254 18.6944 12.8726 18.5704 13.1659 18.4235L15.4939 17.2595L15.4939 17.2595C15.8519 17.081 16.1533 16.9307 16.3819 16.6973C16.5824 16.4926 16.7349 16.2458 16.8284 15.9749C16.9349 15.666 16.9345 15.3292 16.9341 14.9292L16.934 11.8728L18.3207 11.1794V14.0019C18.3207 14.3332 18.5893 14.6019 18.9207 14.6019C19.2521 14.6019 19.5207 14.3332 19.5207 14.0019V10.0512C19.5288 9.89823 19.4992 9.74375 19.4319 9.60198C19.3297 9.38631 19.1515 9.26497 19.0475 9.20056C18.9409 9.13449 18.8043 9.06621 18.6678 8.99803L12.269 5.79861ZM15.734 12.4728L12.269 14.2053C12.1001 14.2897 11.9013 14.2897 11.7324 14.2053L8.26738 12.4728V14.8501C8.26738 15.3722 8.27521 15.4901 8.30746 15.5836C8.34291 15.6864 8.40075 15.78 8.47681 15.8576C8.54602 15.9283 8.648 15.988 9.11499 16.2215L11.315 17.3215C11.6959 17.512 11.784 17.55 11.8655 17.5653C11.9548 17.582 12.0466 17.582 12.1359 17.5653C12.2174 17.55 12.3055 17.512 12.6864 17.3215L14.8864 16.2215C15.3534 15.988 15.4554 15.9283 15.5246 15.8576C15.6007 15.78 15.6585 15.6864 15.6939 15.5836C15.7262 15.4901 15.734 15.3722 15.734 14.8501V12.4728ZM12.0007 12.9978L6.00902 10.0019L12.0007 7.00609L17.9924 10.0019L12.0007 12.9978Z"
};
PLACEHOLDER_PATHS.education = PLACEHOLDER_PATHS.academy;
var AVATAR_SIZES = {
  xsmall: 24,
  small: 32,
  default: 40,
  medium: 40,
  large: 48,
  xlarge: 56
};
function initialsFromName(name) {
  return name ? String(name).trim().split(/\s+/).map((part) => part[0]).filter(Boolean).slice(0, 2).join("").toUpperCase() : "";
}
function resolveAvatarSize(size) {
  return typeof size === "number" ? size : AVATAR_SIZES[size] || AVATAR_SIZES.default;
}
var SQUARE_RADIUS_STEPS = [
  [24, "var(--radius-sm)"],
  [32, "var(--radius-8)"],
  [40, "var(--radius-10)"],
  [48, "var(--radius-12)"],
  [56, "var(--radius-14)"]
];
function resolveAvatarRadius(variant, size) {
  if (variant === "person") return "var(--radius-pill)";
  let radius = SQUARE_RADIUS_STEPS[0][1];
  for (const [threshold, value] of SQUARE_RADIUS_STEPS) {
    if (size >= threshold) radius = value;
  }
  return radius;
}
function normalizeVariant(variant = "person") {
  const normalized = variant === "education" ? "academy" : variant;
  return PLACEHOLDER_PATHS[normalized] ? normalized : "person";
}
function resolvePlaceholderKind(placeholder, variant) {
  if (placeholder === true) return normalizeVariant(variant);
  if (placeholder === false || placeholder === "initials" || placeholder == null)
    return "initials";
  return normalizeVariant(placeholder);
}
function resolveInteractionStyle(interaction) {
  const state = interaction === true ? "normal" : interaction;
  const states = {
    hovered: { boxShadow: "0 0 0 1px var(--color-semantic-line-solid-normal)" },
    focused: {
      boxShadow: "0 0 0 3px color-mix(in srgb, var(--color-semantic-primary-normal) 22%, transparent)"
    },
    pressed: {
      transform: "scale(0.96)",
      boxShadow: "0 0 0 1px var(--color-semantic-line-solid-normal)"
    }
  };
  return states[state] || {};
}
var STATUS_LABELS = {
  online: "\uC628\uB77C\uC778",
  busy: "\uB2E4\uB978 \uC6A9\uBB34 \uC911",
  offline: "\uC624\uD504\uB77C\uC778"
};
function defaultPushBadgeLabel(pushBadge) {
  if (pushBadge === true) return "\uC0C8 \uC54C\uB9BC \uC788\uC74C";
  if (typeof pushBadge === "number") return `\uC77D\uC9C0 \uC54A\uC74C ${pushBadge}\uAC74`;
  const text = String(pushBadge).trim();
  if (!text) return "\uC0C8 \uC54C\uB9BC \uC788\uC74C";
  return /^\d+\+?$/.test(text) ? `\uC77D\uC9C0 \uC54A\uC74C ${text}\uAC74` : text;
}
function resolveAlternative(explicit, fallback) {
  if (explicit === false || explicit === null) return null;
  if (explicit != null && explicit !== true) return explicit;
  return fallback || null;
}
function PlaceholderGlyph({ kind, deactivated }) {
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
    "svg",
    {
      "aria-hidden": "true",
      width: "58%",
      height: "58%",
      viewBox: "0 0 24 24",
      fill: "none",
      style: {
        display: "block",
        color: deactivated ? "var(--color-semantic-background-elevated-normal)" : "var(--color-semantic-label-assistive)"
      },
      children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
        "path",
        {
          fillRule: "evenodd",
          clipRule: "evenodd",
          d: PLACEHOLDER_PATHS[kind] || PLACEHOLDER_PATHS.person,
          fill: "currentColor",
          fillOpacity: deactivated ? 1 : 0.72
        }
      )
    }
  );
}
function Avatar({
  src,
  alt = "",
  name,
  variant = "person",
  size = "medium",
  status,
  statusLabel,
  ring = false,
  placeholder = "initials",
  deactivated = false,
  interaction = false,
  pushBadge = false,
  pushBadgeLabel,
  borderColor,
  borderWeight = 0,
  style,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  ...rest
}) {
  const generatedId = _react2.default.useId();
  const resolvedSize = resolveAvatarSize(size);
  const normalizedVariant = normalizeVariant(variant);
  const initials = initialsFromName(name);
  const statusColor = status === "online" ? "var(--color-semantic-primary-normal)" : status === "busy" ? "var(--color-semantic-status-negative)" : "var(--color-semantic-interaction-inactive)";
  const placeholderKind = resolvePlaceholderKind(
    placeholder,
    normalizedVariant
  );
  const showInitials = placeholderKind === "initials" && initials;
  const fallbackBg = deactivated ? "var(--color-semantic-interaction-inactive)" : "var(--color-semantic-secondary-surface)";
  const fallbackFg = deactivated ? "var(--color-semantic-background-elevated-normal)" : "var(--color-semantic-label-normal)";
  const interactionStyle = resolveInteractionStyle(interaction);
  const resolvedBorderWeight = borderColor && !borderWeight ? 1 : borderWeight;
  const border = resolvedBorderWeight ? `${typeof resolvedBorderWeight === "number" ? `${resolvedBorderWeight}px` : resolvedBorderWeight} solid ${borderColor || "var(--color-semantic-line-normal-normal)"}` : "none";
  const ringShadow = ring ? "0 0 0 4px var(--color-semantic-background-elevated-normal), 0 0 0 5px var(--color-semantic-line-solid-normal)" : "";
  const stateShadow = interactionStyle.boxShadow || "";
  const boxShadow = [ringShadow, stateShadow].filter(Boolean).join(", ") || "none";
  const avatarRadius = resolveAvatarRadius(normalizedVariant, resolvedSize);
  const avatarBoxStyle = {
    width: "100%",
    height: "100%",
    borderRadius: avatarRadius,
    border,
    boxSizing: "border-box",
    boxShadow,
    transform: interactionStyle.transform,
    transition: "box-shadow var(--dur-fast) var(--ease-out), transform var(--dur-fast) var(--ease-out)"
  };
  const showPushBadge = pushBadge !== false && pushBadge != null && !deactivated;
  const pushBadgeSize = Math.max(10, Math.round(resolvedSize * 0.28));
  const pushBadgeText = pushBadge === true ? "" : pushBadge;
  const showStatus = Boolean(status) && !deactivated;
  const statusAlternative = showStatus ? resolveAlternative(statusLabel, STATUS_LABELS[status]) : null;
  const pushBadgeAlternative = showPushBadge ? resolveAlternative(pushBadgeLabel, defaultPushBadgeLabel(pushBadge)) : null;
  const alternatives = [statusAlternative, pushBadgeAlternative].filter(Boolean);
  const named = ariaLabel != null || ariaLabelledBy != null;
  const foldIntoLabel = typeof ariaLabel === "string" && ariaLabel !== "";
  const alternativeIds = alternatives.map((_, index) => `${generatedId}-alt-${index}`);
  const composedLabel = foldIntoLabel ? [ariaLabel, ...alternatives].join(", ") : ariaLabel;
  const composedLabelledBy = named && !foldIntoLabel && alternativeIds.length ? [ariaLabelledBy, ...alternativeIds].filter(Boolean).join(" ") : ariaLabelledBy;
  const renderAlternativeText = alternatives.length > 0 && !foldIntoLabel;
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
    "span",
    {
      role: named ? "img" : void 0,
      "aria-label": composedLabel,
      "aria-labelledby": composedLabelledBy,
      "aria-disabled": deactivated || void 0,
      "data-variant": normalizedVariant,
      "data-interaction": interaction === true ? "normal" : interaction || void 0,
      style: {
        position: "relative",
        display: "inline-flex",
        width: resolvedSize,
        height: resolvedSize,
        flexShrink: 0,
        cursor: interaction ? "pointer" : void 0,
        ...style
      },
      ...rest,
      children: [
        src ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
          "img",
          {
            src,
            alt: alt || name || "",
            width: resolvedSize,
            height: resolvedSize,
            style: { ...avatarBoxStyle, display: "block", objectFit: "cover" }
          }
        ) : /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
          "span",
          {
            style: {
              ...avatarBoxStyle,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              background: fallbackBg,
              color: fallbackFg,
              fontFamily: "var(--font-sans)",
              fontWeight: "var(--fw-bold)",
              fontSize: Math.round(resolvedSize * 0.38)
            },
            children: showInitials ? initials : /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
              PlaceholderGlyph,
              {
                kind: placeholderKind === "initials" ? normalizedVariant : placeholderKind,
                deactivated
              }
            )
          }
        ),
        deactivated && /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
          "span",
          {
            "aria-hidden": "true",
            style: {
              position: "absolute",
              inset: 0,
              borderRadius: avatarRadius,
              overflow: "hidden",
              pointerEvents: "none"
            },
            children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
              "span",
              {
                style: {
                  position: "absolute",
                  left: "-24%",
                  top: "50%",
                  width: "148%",
                  height: Math.max(4, Math.round(resolvedSize * 0.12)),
                  borderRadius: "var(--radius-pill)",
                  background: "color-mix(in srgb, var(--color-semantic-interaction-inactive) 76%, var(--color-semantic-background-elevated-normal))",
                  transform: "translateY(-50%) rotate(-45deg)",
                  transformOrigin: "center"
                }
              }
            )
          }
        ),
        showStatus && /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
          "span",
          {
            "aria-hidden": "true",
            "data-avatar-status": status,
            style: {
              position: "absolute",
              right: 0,
              bottom: 0,
              width: Math.max(10, resolvedSize * 0.24),
              height: Math.max(10, resolvedSize * 0.24),
              background: statusColor,
              borderRadius: "50%",
              border: "2px solid var(--color-semantic-background-elevated-normal)"
            }
          }
        ),
        renderAlternativeText && alternatives.map((text, index) => /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunk677EM4M2cjs.VisuallyHidden, { id: alternativeIds[index], children: text }, alternativeIds[index])),
        showPushBadge && /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
          "span",
          {
            "aria-hidden": "true",
            style: {
              position: "absolute",
              top: -2,
              right: -2,
              minWidth: pushBadgeSize,
              height: pushBadgeSize,
              paddingInline: pushBadgeText ? 4 : 0,
              borderRadius: "var(--radius-pill)",
              border: "2px solid var(--color-semantic-background-elevated-normal)",
              boxSizing: "border-box",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              background: "var(--color-semantic-primary-normal)",
              color: "var(--color-semantic-static-white)",
              fontSize: Math.max(9, Math.round(resolvedSize * 0.2)),
              fontWeight: "var(--fw-bold)",
              lineHeight: 1
            },
            children: pushBadgeText
          }
        )
      ]
    }
  );
}



exports.Avatar = Avatar;
//# sourceMappingURL=chunk-5ZIVVBEB.cjs.map