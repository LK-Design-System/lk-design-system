"use client";
import {
  StatusIndicator
} from "./chunk-NITZ4TPV.js";
import {
  StatusBadge
} from "./chunk-LACIHR4Y.js";
import {
  Icon
} from "./chunk-RUENHK23.js";

// components/viz/ElevatorFleetOverview.jsx
import React2 from "react";

// ../lk-design-system/packages/core/dist/chunk-F72DWVHV.js
import React from "react";
import { jsx } from "react/jsx-runtime";
function ScrollArea({
  children,
  maxHeight = 280,
  label,
  labelledBy,
  focusable = "auto",
  scrollbar = "auto",
  gutter = "stable",
  className,
  style,
  ...rest
}) {
  const nodeRef = React.useRef(null);
  const [overflows, setOverflows] = React.useState(false);
  React.useEffect(() => {
    if (focusable !== "auto") return void 0;
    const node = nodeRef.current;
    if (!node) return void 0;
    const measure = () => {
      const next = node.scrollHeight - node.clientHeight > 1 || node.scrollWidth - node.clientWidth > 1;
      setOverflows((prev) => prev === next ? prev : next);
    };
    measure();
    if (typeof ResizeObserver === "undefined") return void 0;
    const ro = new ResizeObserver(measure);
    ro.observe(node);
    for (const child of Array.from(node.children)) ro.observe(child);
    return () => ro.disconnect();
  }, [focusable, children, maxHeight]);
  const isFocusable = focusable === "auto" ? overflows : !!focusable;
  const named = label != null || labelledBy != null || rest["aria-label"] != null || rest["aria-labelledby"] != null;
  React.useEffect(() => {
    if (!isFocusable || named || rest.role != null) return;
    const env = typeof globalThis.process !== "undefined" ? globalThis.process.env : void 0;
    if (env && env.NODE_ENV === "production") return;
    console.warn(
      "ScrollArea: a scrollable region is keyboard focusable and needs an accessible name \u2014 pass `label` (or `labelledBy`)."
    );
  }, [isFocusable, named, rest.role]);
  return /* @__PURE__ */ jsx(
    "div",
    {
      ...rest,
      ref: nodeRef,
      className: ["lk-scroll-surface", "lk-scrollarea", className].filter(Boolean).join(" "),
      "data-scrollbar": scrollbar,
      "data-scroll-gutter": gutter,
      role: rest.role ?? (isFocusable && named ? "region" : void 0),
      "aria-label": rest["aria-label"] ?? label,
      "aria-labelledby": rest["aria-labelledby"] ?? labelledBy,
      tabIndex: rest.tabIndex ?? (isFocusable ? 0 : void 0),
      style: {
        maxHeight,
        overflow: "auto",
        scrollbarGutter: gutter === "stable" ? "stable" : "auto",
        ...style
      },
      children
    }
  );
}

// components/viz/ElevatorFleetOverview.jsx
import { jsx as jsx2, jsxs } from "react/jsx-runtime";
var STATUS_PRESENTATION = {
  normal: {
    tone: "positive",
    accent: "var(--color-semantic-primary-normal)",
    currentSurface: "var(--color-semantic-primary-surface-normal)",
    currentText: "var(--color-semantic-label-strong)"
  },
  maintenance: {
    tone: "cautionary",
    accent: "var(--color-semantic-status-cautionary)",
    currentSurface: "var(--color-semantic-status-cautionary-surface)",
    currentText: "var(--color-semantic-status-cautionary-text)"
  },
  fault: {
    tone: "negative",
    accent: "var(--color-semantic-status-negative)",
    currentSurface: "var(--color-semantic-status-negative-surface)",
    currentText: "var(--color-semantic-status-negative-text)"
  },
  offline: {
    tone: "offline",
    accent: "var(--color-semantic-label-alternative)",
    currentSurface: "var(--color-semantic-background-normal-alternative)",
    currentText: "var(--color-semantic-label-alternative)",
    borderStyle: "dashed"
  },
  unknown: {
    tone: "offline",
    accent: "var(--color-semantic-label-alternative)",
    currentSurface: "var(--color-semantic-background-normal-alternative)",
    currentText: "var(--color-semantic-label-alternative)"
  }
};
var STATUS_PRIORITY = {
  normal: 0,
  unknown: 1,
  maintenance: 2,
  offline: 3,
  fault: 4
};
function normalizeStatus(status) {
  return STATUS_PRESENTATION[status] ? status : "unknown";
}
function getBuildingStatus(elevators) {
  if (!elevators.length) return "unknown";
  return elevators.reduce((current, elevator) => {
    const next = normalizeStatus(elevator.status);
    return STATUS_PRIORITY[next] > STATUS_PRIORITY[current] ? next : current;
  }, "normal");
}
function getAttentionCount(buildings) {
  const elevators = buildings.flatMap((building) => building.elevators ?? []);
  return elevators.filter((elevator) => normalizeStatus(elevator.status) !== "normal").length;
}
function useElevatorFleetStyles() {
  React2.useEffect(() => {
    if (typeof document === "undefined" || document.getElementById("lk-elevator-fleet-css")) return;
    const element = document.createElement("style");
    element.id = "lk-elevator-fleet-css";
    element.textContent = [
      "@keyframes lk-elevator-direction-up{0%,100%{transform:translateY(0)}50%{transform:translateY(-2px)}}",
      "@keyframes lk-elevator-direction-down{0%,100%{transform:translateY(0)}50%{transform:translateY(2px)}}",
      '.lk-elevator-direction[data-direction="up"]{animation:lk-elevator-direction-up calc(var(--dur-slow) * 5) var(--ease-in-out) infinite}',
      '.lk-elevator-direction[data-direction="down"]{animation:lk-elevator-direction-down calc(var(--dur-slow) * 5) var(--ease-in-out) infinite}',
      ".lk-elevator-fleet-scroll:focus-visible{outline-offset:-2px!important}",
      "@media (max-width:600px){.lk-elevator-fleet-heading{align-items:flex-start!important;flex-direction:column!important}}",
      "@container (max-width:600px){.lk-elevator-fleet-heading{align-items:flex-start!important;flex-direction:column!important}}",
      "@media (prefers-reduced-motion:reduce){.lk-elevator-direction{animation:none!important;transform:none!important}}"
    ].join("");
    document.head.appendChild(element);
  }, []);
}
function LandingDoor({ active, color }) {
  const size = active ? 24 : 20;
  return /* @__PURE__ */ jsxs(
    "span",
    {
      "aria-hidden": "true",
      "data-door-variant": active ? "solid" : "outlined",
      style: {
        width: size,
        height: size,
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        overflow: "hidden",
        border: `2px solid ${color}`,
        borderRadius: 2,
        boxSizing: "border-box",
        background: active ? color : "transparent"
      },
      children: [
        /* @__PURE__ */ jsx2("span", { style: { borderRight: `1px solid ${active ? "var(--color-semantic-static-white)" : color}` } }),
        /* @__PURE__ */ jsx2("span", { style: { borderLeft: `1px solid ${active ? "var(--color-semantic-static-white)" : color}` } })
      ]
    }
  );
}
function FloorRow({
  floor,
  active,
  presentation,
  belowGround = false,
  groundLine = false
}) {
  const inactiveColor = "var(--color-semantic-line-normal-normal)";
  const iconColor = active ? presentation.accent : inactiveColor;
  const rowBorder = groundLine ? "2px solid var(--color-semantic-label-assistive)" : "1px solid var(--color-semantic-line-normal-normal)";
  return /* @__PURE__ */ jsxs(
    "span",
    {
      "aria-hidden": "true",
      "data-current-floor": active ? "true" : void 0,
      style: {
        height: 40,
        display: "grid",
        gridTemplateColumns: "40px minmax(32px, 1fr)",
        alignItems: "center",
        gap: "var(--space-1)",
        paddingInline: "var(--space-2)",
        boxSizing: "border-box",
        borderTop: rowBorder,
        background: active ? presentation.currentSurface : belowGround ? "var(--color-semantic-background-normal-alternative)" : "transparent",
        color: active ? presentation.currentText : "var(--color-semantic-label-alternative)",
        fontSize: "var(--caption1-size)",
        fontWeight: active ? "var(--fw-bold)" : "var(--fw-regular)",
        fontVariantNumeric: "tabular-nums"
      },
      children: [
        /* @__PURE__ */ jsx2("span", { children: floor }),
        /* @__PURE__ */ jsx2("span", { style: { display: "grid", placeItems: "center" }, children: /* @__PURE__ */ jsx2(LandingDoor, { active, color: iconColor }) })
      ]
    }
  );
}
function ElevatorColumn({ building, elevator }) {
  const floors = building.floors ?? [];
  const groundIndex = building.groundFloor == null ? -1 : floors.indexOf(building.groundFloor);
  const status = normalizeStatus(elevator.status);
  const presentation = STATUS_PRESENTATION[status];
  const direction = elevator.direction ?? "idle";
  const offline = status === "offline";
  const directionIcon = !offline && direction === "up" ? "chevron-up-small" : !offline && direction === "down" ? "chevron-down-small" : null;
  const directionLabel = elevator.directionLabel ?? (direction === "up" ? "\uC0C1\uC2B9 \uC911" : direction === "down" ? "\uD558\uAC15 \uC911" : "\uC815\uC9C0");
  const positionSummary = offline ? `${elevator.name} \uB9C8\uC9C0\uB9C9 \uD655\uC778 \uC704\uCE58 ${elevator.currentFloor}, ${elevator.statusLabel ?? status}` : `${elevator.name} \uD604\uC7AC \uC704\uCE58 ${elevator.currentFloor}, ${directionLabel}, ${elevator.statusLabel ?? status}`;
  return /* @__PURE__ */ jsxs(
    "article",
    {
      className: "lk-elevator-column",
      "data-elevator-id": elevator.id,
      "data-elevator-status": status,
      style: {
        position: "relative",
        flex: "0 0 144px",
        width: 144,
        minWidth: 0,
        display: "grid",
        alignContent: "start",
        gap: "var(--space-2)"
      },
      children: [
        /* @__PURE__ */ jsx2(
          "div",
          {
            style: {
              minHeight: 72,
              display: "grid",
              alignContent: "center",
              gap: "var(--space-1)",
              padding: "var(--space-2) var(--space-3)",
              boxSizing: "border-box",
              border: "1px solid var(--color-semantic-line-normal-normal)",
              borderStyle: presentation.borderStyle ?? "solid",
              borderRadius: "var(--component-card-radius)",
              background: offline ? "var(--color-semantic-background-normal-alternative)" : "var(--color-semantic-background-elevated-normal)"
            },
            children: /* @__PURE__ */ jsxs("span", { style: { display: "grid", gap: "var(--space-1)", minWidth: 0 }, children: [
              /* @__PURE__ */ jsxs(
                "span",
                {
                  style: {
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "var(--space-2)",
                    color: "var(--color-semantic-label-alternative)",
                    fontSize: "var(--caption2-size)",
                    fontVariantNumeric: "tabular-nums"
                  },
                  children: [
                    /* @__PURE__ */ jsx2("span", { children: elevator.id.toUpperCase() }),
                    /* @__PURE__ */ jsx2(StatusIndicator, { tone: presentation.tone, children: elevator.statusLabel ?? status })
                  ]
                }
              ),
              /* @__PURE__ */ jsxs("span", { style: { display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: "var(--space-2)", minWidth: 0 }, children: [
                /* @__PURE__ */ jsx2(
                  "strong",
                  {
                    style: {
                      flex: "1 1 auto",
                      minWidth: 0,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      color: "var(--color-semantic-label-strong)",
                      fontSize: "var(--heading2-size)",
                      lineHeight: "var(--heading2-line)"
                    },
                    children: elevator.name
                  }
                ),
                status !== "normal" && elevator.updatedLabel && /* @__PURE__ */ jsx2(
                  "span",
                  {
                    style: {
                      flex: "0 0 auto",
                      color: "var(--color-semantic-label-alternative)",
                      fontSize: "var(--caption2-size)",
                      fontVariantNumeric: "tabular-nums",
                      whiteSpace: "nowrap"
                    },
                    children: elevator.updatedLabel
                  }
                )
              ] })
            ] })
          }
        ),
        /* @__PURE__ */ jsxs(
          "div",
          {
            style: {
              overflow: "hidden",
              border: "1px solid var(--color-semantic-line-normal-normal)",
              borderStyle: presentation.borderStyle ?? "solid",
              borderRadius: "var(--component-card-radius)",
              background: offline ? "var(--color-semantic-background-normal-alternative)" : "var(--color-semantic-background-elevated-normal)"
            },
            children: [
              /* @__PURE__ */ jsxs(
                "div",
                {
                  style: {
                    height: 48,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "var(--space-2)",
                    paddingInline: "var(--space-3)",
                    boxSizing: "border-box",
                    borderBottom: "1px solid var(--color-semantic-line-solid-_strong)",
                    background: "var(--color-semantic-background-elevated-normal)",
                    textAlign: "center"
                  },
                  children: [
                    /* @__PURE__ */ jsxs(
                      "span",
                      {
                        style: {
                          display: "inline-flex",
                          alignItems: "baseline",
                          gap: "var(--space-1)"
                        },
                        children: [
                          /* @__PURE__ */ jsx2(
                            "strong",
                            {
                              "data-position-value": elevator.currentFloor,
                              style: {
                                color: offline ? "var(--color-semantic-label-alternative)" : "var(--color-semantic-label-strong)",
                                fontSize: "var(--body1-size)",
                                lineHeight: "var(--body1-line)",
                                fontVariantNumeric: "tabular-nums"
                              },
                              children: elevator.currentFloor
                            }
                          ),
                          offline && /* @__PURE__ */ jsx2(
                            "span",
                            {
                              style: {
                                color: "var(--color-semantic-label-alternative)",
                                fontSize: "var(--caption2-size)",
                                whiteSpace: "nowrap"
                              },
                              children: "\xB7 \uB9C8\uC9C0\uB9C9 \uC704\uCE58"
                            }
                          )
                        ]
                      }
                    ),
                    !offline && /* @__PURE__ */ jsx2(
                      "span",
                      {
                        className: "lk-elevator-direction",
                        "aria-hidden": "true",
                        "data-direction": directionIcon ? direction : "idle",
                        "data-direction-glyph": directionIcon ? direction : "idle",
                        style: {
                          width: 16,
                          height: 16,
                          display: "inline-grid",
                          placeItems: "center",
                          flex: "0 0 auto",
                          color: directionIcon ? "var(--color-semantic-primary-normal)" : "var(--color-semantic-label-alternative)",
                          fontSize: "var(--body1-size)",
                          lineHeight: 1
                        },
                        children: directionIcon ? /* @__PURE__ */ jsx2(Icon, { name: directionIcon, size: 16, "aria-hidden": "true" }) : "\u2014"
                      }
                    )
                  ]
                }
              ),
              /* @__PURE__ */ jsx2(
                "div",
                {
                  role: "img",
                  "aria-label": positionSummary,
                  children: floors.map((floor, index) => /* @__PURE__ */ jsx2(
                    FloorRow,
                    {
                      floor,
                      active: floor === elevator.currentFloor,
                      presentation,
                      belowGround: groundIndex >= 0 && index > groundIndex,
                      groundLine: groundIndex >= 0 && index === groundIndex + 1
                    },
                    floor
                  ))
                }
              )
            ]
          }
        )
      ]
    }
  );
}
function BuildingGroup({ building, headingLevel, headingId }) {
  const Heading = `h${headingLevel}`;
  const elevators = building.elevators ?? [];
  const status = getBuildingStatus(elevators);
  const presentation = STATUS_PRESENTATION[status];
  const attentionCount = elevators.filter(
    (elevator) => normalizeStatus(elevator.status) !== "normal"
  ).length;
  return /* @__PURE__ */ jsxs(
    "section",
    {
      "aria-labelledby": headingId,
      "data-building-id": building.id,
      style: {
        flex: "0 0 auto"
      },
      children: [
        /* @__PURE__ */ jsxs(
          "header",
          {
            style: {
              minHeight: 36,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "var(--space-3)",
              padding: "0 var(--space-1) var(--space-2)",
              boxSizing: "border-box"
            },
            children: [
              /* @__PURE__ */ jsx2(
                Heading,
                {
                  id: headingId,
                  style: {
                    margin: 0,
                    color: "var(--color-semantic-label-strong)",
                    fontSize: "var(--body1-size)",
                    lineHeight: "var(--body1-line)"
                  },
                  children: building.name
                }
              ),
              attentionCount > 0 && /* @__PURE__ */ jsx2(StatusBadge, { tone: presentation.tone, children: building.statusLabel ?? `${attentionCount}\uB300 \uD655\uC778` })
            ]
          }
        ),
        elevators.length ? /* @__PURE__ */ jsx2("div", { style: { display: "flex", alignItems: "flex-start", gap: "var(--space-2)" }, children: elevators.map((elevator) => /* @__PURE__ */ jsx2(
          ElevatorColumn,
          {
            building,
            elevator
          },
          elevator.id
        )) }) : /* @__PURE__ */ jsx2(
          "div",
          {
            role: "status",
            style: {
              width: 240,
              minHeight: 200,
              display: "grid",
              placeItems: "center",
              padding: "var(--space-4)",
              boxSizing: "border-box",
              color: "var(--color-semantic-label-alternative)",
              fontSize: "var(--label1-size)",
              textAlign: "center"
            },
            children: building.emptyMessage ?? "\uD45C\uC2DC\uD560 \uC5D8\uB9AC\uBCA0\uC774\uD130 \uC815\uBCF4\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4."
          }
        )
      ]
    }
  );
}
function ElevatorFleetOverview({
  buildings = [],
  label = "\uAC74\uBB3C\uBCC4 \uC5D8\uB9AC\uBCA0\uC774\uD130 \uD604\uD669",
  headingLevel = 3,
  emptyMessage = "\uD45C\uC2DC\uD560 \uAC74\uBB3C\uC774 \uC5C6\uC2B5\uB2C8\uB2E4.",
  style,
  ...rest
}) {
  useElevatorFleetStyles();
  const instanceId = React2.useId().replace(/:/g, "");
  const attentionCount = getAttentionCount(buildings);
  if (!buildings.length) {
    return /* @__PURE__ */ jsx2(
      "div",
      {
        role: "status",
        style: {
          minHeight: 180,
          display: "grid",
          placeItems: "center",
          padding: "var(--space-5)",
          boxSizing: "border-box",
          border: "1px solid var(--color-semantic-line-solid-_strong)",
          borderRadius: "var(--component-card-radius)",
          background: "var(--color-semantic-background-elevated-normal)",
          color: "var(--color-semantic-label-alternative)",
          fontFamily: "var(--font-sans)",
          fontSize: "var(--label1-size)",
          textAlign: "center",
          ...style
        },
        ...rest,
        children: emptyMessage
      }
    );
  }
  return /* @__PURE__ */ jsxs(
    "section",
    {
      "aria-label": label,
      style: {
        width: "100%",
        maxWidth: "100%",
        overflow: "hidden",
        border: "1px solid var(--color-semantic-line-solid-_strong)",
        borderRadius: "var(--component-card-radius)",
        background: "var(--color-semantic-background-elevated-normal)",
        color: "var(--color-semantic-label-normal)",
        fontFamily: "var(--font-sans)",
        boxSizing: "border-box",
        containerType: "inline-size",
        ...style
      },
      ...rest,
      children: [
        /* @__PURE__ */ jsxs(
          "header",
          {
            className: "lk-elevator-fleet-heading",
            style: {
              minHeight: 56,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "var(--space-4)",
              padding: "var(--space-3) var(--space-4)",
              borderBottom: "1px solid var(--color-semantic-line-solid-_strong)",
              boxSizing: "border-box",
              background: "var(--color-semantic-background-normal-alternative)"
            },
            children: [
              /* @__PURE__ */ jsx2("strong", { style: { color: "var(--color-semantic-label-strong)", fontSize: "var(--body1-size)" }, children: "\uCEA0\uD37C\uC2A4 \uC5D8\uB9AC\uBCA0\uC774\uD130 \uBAA8\uB2C8\uD130\uB9C1" }),
              attentionCount > 0 && /* @__PURE__ */ jsxs(StatusBadge, { tone: "cautionary", children: [
                attentionCount,
                "\uB300 \uD655\uC778"
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsx2(
          ScrollArea,
          {
            className: "lk-elevator-fleet-scroll",
            label: "\uAC74\uBB3C \uBC0F \uC5D8\uB9AC\uBCA0\uC774\uD130 \uC704\uCE58 \uBE44\uAD50",
            maxHeight: "none",
            scrollbar: "compact",
            gutter: "stable",
            style: {
              width: "100%",
              maxWidth: "100%",
              overflowX: "auto",
              overflowY: "hidden",
              background: "var(--color-semantic-background-normal-normal)"
            },
            children: /* @__PURE__ */ jsx2(
              "div",
              {
                style: {
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "var(--space-6)",
                  width: "max-content",
                  minWidth: "100%",
                  padding: "var(--space-3)",
                  boxSizing: "border-box"
                },
                children: buildings.map((building, buildingIndex) => /* @__PURE__ */ jsx2(
                  BuildingGroup,
                  {
                    building,
                    headingLevel,
                    headingId: `lk-elevator-${instanceId}-building-${buildingIndex}`
                  },
                  building.id
                ))
              }
            )
          }
        )
      ]
    }
  );
}

export {
  ElevatorFleetOverview
};
//# sourceMappingURL=chunk-3FYD6T5J.js.map