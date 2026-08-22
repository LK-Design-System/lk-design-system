"use client";
import {
  Select
} from "./chunk-AXAQA3VG.js";
import {
  Button
} from "./chunk-4I4M7JVV.js";
import {
  Icon
} from "./chunk-S26PXDE3.js";

// components/data/RefreshControl.jsx
import React from "react";
import { jsx, jsxs } from "react/jsx-runtime";
function RefreshControl({
  refreshing = false,
  onRefresh,
  lastUpdated,
  lastUpdatedLabel = "\uB9C8\uC9C0\uB9C9 \uC5C5\uB370\uC774\uD2B8",
  refreshLabel = "\uC0C8\uB85C\uACE0\uCE68",
  autoRefreshValue,
  autoRefreshOptions,
  onAutoRefreshChange,
  autoRefreshLabel = "\uC790\uB3D9 \uC0C8\uB85C\uACE0\uCE68 \uAC04\uACA9",
  disabled = false,
  unavailableReason,
  size = "sm",
  style,
  ...rest
}) {
  const reasonId = React.useId();
  const unavailable = disabled || refreshing;
  const refreshDisabled = disabled || typeof onRefresh !== "function";
  const autoRefreshDisabled = disabled || typeof onAutoRefreshChange !== "function";
  return /* @__PURE__ */ jsxs(
    "div",
    {
      role: "group",
      "aria-label": "\uB370\uC774\uD130 \uC0C8\uB85C\uACE0\uCE68",
      "aria-describedby": disabled && unavailableReason ? reasonId : void 0,
      style: { display: "flex", alignItems: "center", gap: "var(--space-2)", flexWrap: "wrap", minWidth: 0, fontFamily: "var(--font-sans)", ...style },
      ...rest,
      children: [
        lastUpdated != null && /* @__PURE__ */ jsxs("span", { "data-refresh-freshness": true, style: { minWidth: 0, overflowWrap: "anywhere", color: "var(--color-semantic-label-alternative)", fontSize: "var(--caption1-size)", lineHeight: "var(--caption1-line)" }, children: [
          lastUpdatedLabel,
          ": ",
          lastUpdated
        ] }),
        Array.isArray(autoRefreshOptions) && autoRefreshOptions.length > 0 && /* @__PURE__ */ jsx(
          Select,
          {
            value: autoRefreshValue,
            onChange: onAutoRefreshChange,
            options: autoRefreshOptions,
            size,
            disabled: autoRefreshDisabled,
            "aria-label": autoRefreshLabel,
            style: { width: 150 }
          }
        ),
        /* @__PURE__ */ jsx(
          Button,
          {
            type: "button",
            size,
            variant: "ghost",
            iconOnly: true,
            "aria-label": refreshLabel,
            title: refreshLabel,
            loading: refreshing,
            loadingLabel: `${refreshLabel} \uC911`,
            disabled: refreshDisabled,
            style: { color: refreshDisabled || refreshing ? "var(--color-semantic-label-disable)" : "var(--color-semantic-label-normal)" },
            onClick: unavailable ? void 0 : onRefresh,
            "aria-describedby": disabled && unavailableReason ? reasonId : void 0,
            children: !refreshing && /* @__PURE__ */ jsx(Icon, { name: "refresh", size: 16, "aria-hidden": "true" })
          }
        ),
        disabled && unavailableReason != null && /* @__PURE__ */ jsx("span", { id: reasonId, "data-unavailable-reason": true, style: { flexBasis: "100%", color: "var(--color-semantic-label-neutral)", fontSize: "var(--caption1-size)", lineHeight: "var(--caption1-line)" }, children: unavailableReason })
      ]
    }
  );
}

export {
  RefreshControl
};
//# sourceMappingURL=chunk-NU33QXDC.js.map