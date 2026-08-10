"use client";
import {
  ViewerFrame
<<<<<<<< HEAD:dist/chunk-4QF2MGHF.js
<<<<<<<< HEAD:dist/chunk-4QF2MGHF.js
<<<<<<<< HEAD:dist/chunk-4QF2MGHF.js
} from "./chunk-5TPCN5QY.js";
========
} from "./chunk-J7LDEJ26.js";
>>>>>>>> codex/consolidate-release-check:dist/chunk-BTXJVNHT.js
========
} from "./chunk-QOMPBONB.js";
>>>>>>>> codex/consolidate-release-ci:dist/chunk-TDRZAMH3.js
========
} from "./chunk-X5ZKLB3D.js";
>>>>>>>> codex/consolidate-ci-clean2:dist/chunk-MPPPDD4U.js

// components/viz/Scene3DFrame.jsx
import React from "react";
import { jsx } from "react/jsx-runtime";
function Scene3DFrame({
  children,
  title,
  badges,
  hud,
  toolbar,
  overlay,
  status,
  state,
  availability,
  connection,
  freshness,
  playback,
  stateLabel,
  stateDescription,
  stateIcon,
  stateAction,
  loading = false,
  empty,
  label,
  appearance = "dark",
  variant = "standalone",
  style,
  ...rest
}) {
  const usesExplicitAxes = availability != null || connection != null || freshness != null || playback != null;
  const usesLegacyEmpty = !usesExplicitAxes && state == null && !loading && empty != null;
  const resolvedState = usesExplicitAxes ? state : state ?? (loading ? "loading" : usesLegacyEmpty ? "no-source" : "ready");
  const resolvedStateLabel = stateLabel ?? (usesLegacyEmpty ? empty : void 0);
  const resolvedLabel = label ?? (typeof title === "string" && title.trim() ? `${title} 3D \uBDF0\uD3EC\uD2B8` : "3D \uBDF0\uD3EC\uD2B8");
  return /* @__PURE__ */ jsx(
    ViewerFrame,
    {
      ...rest,
      label: resolvedLabel,
      appearance,
      variant,
      source: title,
      badges,
      hud,
      toolbar,
      toolbarPlacement: "bottom-right",
      overlay,
      status,
      state: resolvedState,
      availability,
      connection,
      freshness,
      playback,
      stateLabel: resolvedStateLabel,
      stateDescription,
      stateIcon,
      stateAction,
      style: { height: "100%", minHeight: 220, ...style },
      children
    }
  );
}

export {
  Scene3DFrame
};
<<<<<<<< HEAD:dist/chunk-4QF2MGHF.js
<<<<<<<< HEAD:dist/chunk-4QF2MGHF.js
<<<<<<<< HEAD:dist/chunk-4QF2MGHF.js
//# sourceMappingURL=chunk-4QF2MGHF.js.map
========
//# sourceMappingURL=chunk-BTXJVNHT.js.map
>>>>>>>> codex/consolidate-release-check:dist/chunk-BTXJVNHT.js
========
//# sourceMappingURL=chunk-TDRZAMH3.js.map
>>>>>>>> codex/consolidate-release-ci:dist/chunk-TDRZAMH3.js
========
//# sourceMappingURL=chunk-MPPPDD4U.js.map
>>>>>>>> codex/consolidate-ci-clean2:dist/chunk-MPPPDD4U.js
