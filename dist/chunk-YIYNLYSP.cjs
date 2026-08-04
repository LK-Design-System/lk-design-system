"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }"use client";


var _chunkQJNQGYQBcjs = require('./chunk-QJNQGYQB.cjs');


var _chunkLQ7SPTG7cjs = require('./chunk-LQ7SPTG7.cjs');


var _chunkMBKOVB2Kcjs = require('./chunk-MBKOVB2K.cjs');

// components/editor/LayerPanel.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
var LAYER_TONE = {
  offline: "var(--color-semantic-label-neutral)",
  signal: "var(--color-semantic-primary-normal)",
  positive: "var(--color-semantic-status-positive)",
  cautionary: "var(--color-semantic-status-cautionary)",
  negative: "var(--color-semantic-status-negative)"
};
function collectLayerIds(layers, predicate, ids = []) {
  for (const layer of layers) {
    if (predicate(layer)) ids.push(layer.id);
    if (layer.children) collectLayerIds(layer.children, predicate, ids);
  }
  return ids;
}
function collectFocusableLayerIds(layers, inheritedDisabled = false, ids = []) {
  for (const layer of layers) {
    const disabled = inheritedDisabled || Boolean(layer.disabled);
    if (!disabled) ids.push(layer.id);
    if (layer.children) collectFocusableLayerIds(layer.children, disabled, ids);
  }
  return ids;
}
function collectVisibleFocusableLayerIds(layers, expandedSet, inheritedDisabled = false, ids = []) {
  for (const layer of layers) {
    const disabled = inheritedDisabled || Boolean(layer.disabled);
    if (!disabled) ids.push(layer.id);
    if (layer.children && expandedSet.has(layer.id)) {
      collectVisibleFocusableLayerIds(layer.children, expandedSet, disabled, ids);
    }
  }
  return ids;
}
function collectExpandedLayerIds(layers, ids = []) {
  for (const layer of layers) {
    if ((_nullishCoalesce(_optionalChain([layer, 'access', _ => _.children, 'optionalAccess', _2 => _2.length]), () => ( 0))) > 0 && layer.expanded !== false) ids.push(layer.id);
    if (layer.children) collectExpandedLayerIds(layer.children, ids);
  }
  return ids;
}
function getLayerText(layer) {
  if (typeof layer.label === "string" || typeof layer.label === "number") return String(layer.label);
  if (typeof layer.description === "string") return layer.description;
  return layer.id;
}
function focusTreeRow(current, direction, onFocusLayer) {
  const tree = current.closest('[role="tree"]');
  if (!tree) return;
  const rows = Array.from(tree.querySelectorAll('[role="treeitem"]')).filter((row) => row.getAttribute("aria-disabled") !== "true");
  const index = rows.indexOf(current);
  if (index < 0) return;
  let target;
  if (direction === "first") target = rows[0];
  if (direction === "last") target = rows[rows.length - 1];
  if (direction === "next") target = rows[Math.min(index + 1, rows.length - 1)];
  if (direction === "previous") target = rows[Math.max(index - 1, 0)];
  if (direction === "child") {
    const level = Number(current.getAttribute("aria-level"));
    target = rows.slice(index + 1).find((row) => Number(row.getAttribute("aria-level")) === level + 1);
  }
  if (direction === "parent") {
    const level = Number(current.getAttribute("aria-level"));
    target = rows.slice(0, index).reverse().find((row) => Number(row.getAttribute("aria-level")) === level - 1);
  }
  if (target) {
    onFocusLayer(target.getAttribute("data-layer-id"));
    target.focus();
  }
}
function focusTreeRowByText(current, query, onFocusLayer) {
  const tree = current.closest('[role="tree"]');
  if (!tree) return;
  const rows = Array.from(tree.querySelectorAll('[role="treeitem"]')).filter((row) => row.getAttribute("aria-disabled") !== "true");
  const start = rows.indexOf(current);
  const ordered = [...rows.slice(start + 1), ...rows.slice(0, start + 1)];
  const normalized = query.toLocaleLowerCase();
  const target = ordered.find((row) => (row.getAttribute("data-layer-text") || "").toLocaleLowerCase().startsWith(normalized));
  if (target) {
    onFocusLayer(target.getAttribute("data-layer-id"));
    target.focus();
  }
}
function focusLayerAction(current, action = "visibility") {
  _optionalChain([current, 'access', _3 => _3.querySelector, 'call', _4 => _4(`[data-layer-action="${action}"]`), 'optionalAccess', _5 => _5.focus, 'call', _6 => _6()]);
}
function handleLayerActionKeyDown(event, nextAction) {
  const row = event.currentTarget.closest('[role="treeitem"]');
  if (!row) return;
  if (event.key === "Escape") {
    event.preventDefault();
    row.focus();
  }
  if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
    event.preventDefault();
    focusLayerAction(row, nextAction);
  }
}
function LayerRow({
  layer,
  depth,
  visibleSet,
  lockedSet,
  expandedSet,
  activeId,
  focusId,
  disabled,
  onFocusLayer,
  onSelect,
  onToggleVisible,
  onToggleLocked,
  onToggleExpanded,
  onTypeahead
}) {
  const [focused, setFocused] = _react2.default.useState(false);
  const layerDisabled = disabled || Boolean(layer.disabled);
  const visible = visibleSet.has(layer.id);
  const locked = lockedSet.has(layer.id);
  const active = activeId === layer.id;
  const labelText = getLayerText(layer);
  const color = LAYER_TONE[_chunkMBKOVB2Kcjs.normalizeStatusTone.call(void 0, layer.tone, "signal")] || LAYER_TONE.signal;
  const hasChildren = (_nullishCoalesce(_optionalChain([layer, 'access', _7 => _7.children, 'optionalAccess', _8 => _8.length]), () => ( 0))) > 0;
  const expanded = hasChildren && expandedSet.has(layer.id);
  const semanticStatus = _nullishCoalesce(layer.toneLabel, () => ( layer.status));
  const rowMeta = _nullishCoalesce(_nullishCoalesce(semanticStatus, () => ( layer.meta)), () => ( layer.count));
  const accessibleMeta = typeof rowMeta === "string" || typeof rowMeta === "number" ? `, ${rowMeta}` : "";
  const select = () => {
    if (layerDisabled) return;
    onFocusLayer(layer.id);
    onSelect(layer.id);
  };
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "li", { role: "none", style: { margin: 0, padding: 0, listStyle: "none" }, children: [
    /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
      "div",
      {
        role: "treeitem",
        "aria-level": depth + 1,
        "aria-selected": active,
        "aria-expanded": hasChildren ? expanded : void 0,
        "aria-disabled": layerDisabled || void 0,
        "aria-label": `${labelText}${accessibleMeta}, ${visible ? "\uD45C\uC2DC\uB428" : "\uC228\uAE40"}, ${locked ? "\uC7A0\uAE40" : "\uC7A0\uAE08 \uD574\uC81C"}`,
        "aria-keyshortcuts": layerDisabled ? void 0 : "F2",
        "aria-description": layerDisabled ? void 0 : "F2 \uD0A4\uB85C \uD45C\uC2DC \uBC0F \uC7A0\uAE08 \uC791\uC5C5\uC73C\uB85C \uC774\uB3D9",
        tabIndex: layerDisabled ? -1 : focusId === layer.id ? 0 : -1,
        "data-layer-id": layer.id,
        "data-layer-text": labelText,
        onFocus: (event) => {
          if (event.target !== event.currentTarget) return;
          setFocused(true);
          onFocusLayer(layer.id);
        },
        onBlur: (event) => {
          if (event.target === event.currentTarget) setFocused(false);
        },
        onClick: (event) => {
          if (!event.target.closest("button")) select();
        },
        onKeyDown: (event) => {
          if (event.target !== event.currentTarget) return;
          if (event.key === "ArrowDown") {
            event.preventDefault();
            focusTreeRow(event.currentTarget, "next", onFocusLayer);
          }
          if (event.key === "ArrowUp") {
            event.preventDefault();
            focusTreeRow(event.currentTarget, "previous", onFocusLayer);
          }
          if (event.key === "Home") {
            event.preventDefault();
            focusTreeRow(event.currentTarget, "first", onFocusLayer);
          }
          if (event.key === "End") {
            event.preventDefault();
            focusTreeRow(event.currentTarget, "last", onFocusLayer);
          }
          if (event.key === "ArrowRight" && hasChildren) {
            event.preventDefault();
            if (!expanded) onToggleExpanded(layer.id, true);
            else focusTreeRow(event.currentTarget, "child", onFocusLayer);
          }
          if (event.key === "ArrowLeft") {
            if (hasChildren && expanded) {
              event.preventDefault();
              onToggleExpanded(layer.id, false);
            } else if (depth > 0) {
              event.preventDefault();
              focusTreeRow(event.currentTarget, "parent", onFocusLayer);
            }
          }
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            select();
          }
          if (event.key === "F2") {
            event.preventDefault();
            focusLayerAction(event.currentTarget);
          }
          if (!event.altKey && !event.ctrlKey && !event.metaKey && event.key.length === 1 && event.key.trim() !== "") {
            event.preventDefault();
            onTypeahead(event.currentTarget, event.key);
          }
        },
        style: {
          padding: "var(--space-1) var(--space-2)",
          paddingLeft: `calc(var(--space-2) + ${depth} * var(--space-4))`,
          display: "grid",
          gridTemplateColumns: "20px minmax(0, 1fr) auto var(--component-toggle-icon-size-sm) var(--component-toggle-icon-size-sm)",
          alignItems: "center",
          gap: "var(--space-1)",
          minHeight: "var(--control-h-md)",
          borderRadius: "var(--radius-sm)",
          background: active ? "var(--color-semantic-fill-normal)" : "transparent",
          /* 스크롤 컨테이너 안의 행이라 외부 글로우는 가장자리에서 잘린다 —
             클리핑되는 행·셀의 표준인 inset focus-indicator를 쓴다. */
          boxShadow: focused ? "inset 0 0 0 2px var(--color-semantic-focus-indicator)" : "none",
          outline: "none",
          boxSizing: "border-box",
          cursor: layerDisabled ? "not-allowed" : "pointer"
        },
        children: [
          hasChildren ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
            "button",
            {
              type: "button",
              tabIndex: -1,
              disabled: layerDisabled,
              "aria-label": `${labelText} ${expanded ? "\uC811\uAE30" : "\uD3BC\uCE58\uAE30"}`,
              onClick: (event) => {
                event.stopPropagation();
                onToggleExpanded(layer.id, !expanded);
              },
              style: { width: 24, height: 24, margin: -2, display: "inline-flex", alignItems: "center", justifyContent: "center", padding: 0, border: 0, borderRadius: "var(--radius-sm)", background: "transparent", color: layerDisabled ? "var(--color-semantic-label-disable)" : "var(--color-semantic-label-neutral)", cursor: layerDisabled ? "not-allowed" : "pointer" },
              children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkLQ7SPTG7cjs.Icon, { name: expanded ? "chevron-down-small" : "chevron-right-small", size: 14, "aria-hidden": "true" })
            }
          ) : /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { "aria-hidden": "true", style: { width: 20, height: 20 } }),
          /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "span", { style: { minWidth: 0, display: "grid", gridTemplateColumns: "var(--space-2) minmax(0, 1fr)", alignItems: "center", gap: "var(--space-2)" }, children: [
            /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { "aria-hidden": "true", style: { width: "var(--space-2)", height: "var(--space-2)", borderRadius: "50%", background: color, opacity: visible ? 1 : 0.35 } }),
            /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "span", { style: { display: "grid", gap: "var(--space-0)", minWidth: 0, opacity: visible ? 1 : 0.55 }, children: [
              /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { style: { overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontSize: "var(--label2-size)", lineHeight: "var(--label2-line)", fontWeight: active ? "var(--fw-bold)" : "var(--fw-semibold)", letterSpacing: 0 }, children: layer.label }),
              layer.description != null && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { className: "lk-layer-panel__row-description", style: { overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: layerDisabled ? "var(--color-semantic-label-disable)" : "var(--color-semantic-label-neutral)", fontSize: "var(--caption1-size)", lineHeight: "var(--caption1-line)", fontWeight: "var(--fw-medium)", letterSpacing: 0 }, children: layer.description })
            ] })
          ] }),
          rowMeta != null && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { className: "lk-layer-panel__row-meta", style: { maxWidth: 76, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontSize: "var(--caption1-size)", lineHeight: "var(--caption1-line)", fontWeight: "var(--fw-bold)", color: layerDisabled ? "var(--color-semantic-label-disable)" : "var(--color-semantic-label-neutral)", fontVariantNumeric: "tabular-nums" }, children: rowMeta }),
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
            _chunkQJNQGYQBcjs.IconButton,
            {
              variant: "ghost",
              round: false,
              size: "sm",
              label: `${labelText} ${visible ? "\uC228\uAE30\uAE30" : "\uBCF4\uC774\uAE30"}`,
              "aria-pressed": visible,
              disabled: layerDisabled,
              "data-layer-action": "visibility",
              tabIndex: -1,
              style: { gridColumn: 4 },
              onClick: (event) => {
                event.stopPropagation();
                onToggleVisible(layer.id, !visible);
              },
              onKeyDown: (event) => handleLayerActionKeyDown(event, "lock"),
              children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkLQ7SPTG7cjs.Icon, { name: visible ? "eye" : "eye-slash", size: 16, "aria-hidden": "true" })
            }
          ),
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
            _chunkQJNQGYQBcjs.IconButton,
            {
              variant: locked ? "soft" : "ghost",
              round: false,
              size: "sm",
              label: `${labelText} ${locked ? "\uC7A0\uAE08 \uD574\uC81C" : "\uC7A0\uAE08"}`,
              "aria-pressed": locked,
              disabled: layerDisabled,
              "data-layer-action": "lock",
              tabIndex: -1,
              style: { gridColumn: 5 },
              onClick: (event) => {
                event.stopPropagation();
                onToggleLocked(layer.id, !locked);
              },
              onKeyDown: (event) => handleLayerActionKeyDown(event, "visibility"),
              children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkLQ7SPTG7cjs.Icon, { name: locked ? "lock" : "lock-open", size: 16, "aria-hidden": "true" })
            }
          )
        ]
      }
    ),
    hasChildren && expanded && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "ul", { role: "group", style: { margin: 0, padding: 0, listStyle: "none" }, children: layer.children.map((child) => /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
      LayerRow,
      {
        layer: child,
        depth: depth + 1,
        visibleSet,
        lockedSet,
        expandedSet,
        activeId,
        focusId,
        disabled: layerDisabled,
        onFocusLayer,
        onSelect,
        onToggleVisible,
        onToggleLocked,
        onToggleExpanded,
        onTypeahead
      },
      child.id
    )) })
  ] });
}
function LayerPanel({
  layers = [],
  activeLayerId,
  defaultActiveLayerId,
  onActiveLayerChange,
  visibleLayerIds,
  defaultVisibleLayerIds,
  onVisibleLayerIdsChange,
  lockedLayerIds,
  defaultLockedLayerIds,
  onLockedLayerIdsChange,
  expandedLayerIds,
  defaultExpandedLayerIds,
  onExpandedLayerIdsChange,
  title = "\uB808\uC774\uC5B4",
  label = "\uB808\uC774\uC5B4 \uBAA9\uB85D",
  emptyLabel = "\uB808\uC774\uC5B4\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4.",
  disabled = false,
  style,
  ...rest
}) {
  const initialVisible = _react2.default.useMemo(
    () => defaultVisibleLayerIds || collectLayerIds(layers, (layer) => layer.visible !== false),
    [defaultVisibleLayerIds, layers]
  );
  const initialLocked = _react2.default.useMemo(
    () => defaultLockedLayerIds || collectLayerIds(layers, (layer) => Boolean(layer.locked)),
    [defaultLockedLayerIds, layers]
  );
  const initialExpanded = _react2.default.useMemo(
    () => _nullishCoalesce(defaultExpandedLayerIds, () => ( collectExpandedLayerIds(layers))),
    [defaultExpandedLayerIds, layers]
  );
  const initialFocusableIds = collectFocusableLayerIds(layers);
  const initialActive = _nullishCoalesce(_nullishCoalesce(defaultActiveLayerId, () => ( initialFocusableIds[0])), () => ( _optionalChain([layers, 'access', _9 => _9[0], 'optionalAccess', _10 => _10.id])));
  const [internalActive, setInternalActive] = _react2.default.useState(initialActive);
  const [focusId, setFocusId] = _react2.default.useState(initialFocusableIds.includes(initialActive) ? initialActive : initialFocusableIds[0]);
  const [internalVisible, setInternalVisible] = _react2.default.useState(() => new Set(initialVisible));
  const [internalLocked, setInternalLocked] = _react2.default.useState(() => new Set(initialLocked));
  const [internalExpanded, setInternalExpanded] = _react2.default.useState(() => new Set(initialExpanded));
  const typeaheadRef = _react2.default.useRef({ query: "", time: 0 });
  const previousActiveRef = _react2.default.useRef(initialActive);
  const currentActive = activeLayerId !== void 0 ? activeLayerId : internalActive;
  const visibleSet = _react2.default.useMemo(
    () => visibleLayerIds !== void 0 ? new Set(visibleLayerIds) : internalVisible,
    [internalVisible, visibleLayerIds]
  );
  const lockedSet = _react2.default.useMemo(
    () => lockedLayerIds !== void 0 ? new Set(lockedLayerIds) : internalLocked,
    [internalLocked, lockedLayerIds]
  );
  const expandedSet = _react2.default.useMemo(
    () => expandedLayerIds !== void 0 ? new Set(expandedLayerIds) : internalExpanded,
    [expandedLayerIds, internalExpanded]
  );
  const layerIds = collectLayerIds(layers, () => true);
  const focusableLayerIds = collectVisibleFocusableLayerIds(layers, expandedSet, disabled);
  const focusableLayerKey = focusableLayerIds.join("|");
  _react2.default.useEffect(() => {
    const activeChanged = previousActiveRef.current !== currentActive;
    if (activeChanged && currentActive != null && focusableLayerIds.includes(currentActive)) {
      setFocusId(currentActive);
    } else if (!focusableLayerIds.includes(focusId)) {
      setFocusId(
        currentActive != null && focusableLayerIds.includes(currentActive) ? currentActive : focusableLayerIds[0]
      );
    }
    previousActiveRef.current = currentActive;
  }, [currentActive, focusId, focusableLayerKey]);
  const selectLayer = (id) => {
    if (disabled) return;
    if (activeLayerId === void 0) setInternalActive(id);
    _optionalChain([onActiveLayerChange, 'optionalCall', _11 => _11(id)]);
  };
  const setVisible = (id, visible) => {
    if (disabled) return;
    const next = new Set(visibleSet);
    if (visible) next.add(id);
    else next.delete(id);
    if (visibleLayerIds === void 0) setInternalVisible(next);
    _optionalChain([onVisibleLayerIdsChange, 'optionalCall', _12 => _12([...next], id, visible)]);
  };
  const setLocked = (id, locked) => {
    if (disabled) return;
    const next = new Set(lockedSet);
    if (locked) next.add(id);
    else next.delete(id);
    if (lockedLayerIds === void 0) setInternalLocked(next);
    _optionalChain([onLockedLayerIdsChange, 'optionalCall', _13 => _13([...next], id, locked)]);
  };
  const setExpanded = (id, expanded) => {
    if (disabled) return;
    const next = new Set(expandedSet);
    if (expanded) next.add(id);
    else next.delete(id);
    if (expandedLayerIds === void 0) setInternalExpanded(next);
    if (!expanded) setFocusId(id);
    _optionalChain([onExpandedLayerIdsChange, 'optionalCall', _14 => _14(layerIds.filter((layerId) => next.has(layerId)), id, expanded)]);
  };
  const typeahead = (current, key) => {
    const now = Date.now();
    const previous = typeaheadRef.current;
    const normalizedKey = key.toLocaleLowerCase();
    const withinWindow = now - previous.time < 500;
    const repeatedCharacter = withinWindow && previous.query.length > 0 && [...previous.query].every((character) => character === normalizedKey);
    const query = withinWindow && !repeatedCharacter ? `${previous.query}${normalizedKey}` : normalizedKey;
    typeaheadRef.current = { query, time: now };
    focusTreeRowByText(current, query, setFocusId);
  };
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
    "section",
    {
      className: "lk-layer-panel",
      style: {
        display: "grid",
        gridTemplateRows: "auto minmax(0, 1fr)",
        gap: "var(--space-2)",
        width: "100%",
        minWidth: 0,
        height: "100%",
        padding: "var(--space-3)",
        boxSizing: "border-box",
        containerType: "inline-size",
        fontFamily: "var(--font-sans)",
        ...style
      },
      ...rest,
      children: [
        /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { style: { display: "flex", alignItems: "center", gap: "var(--space-2)", minWidth: 0 }, children: [
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkLQ7SPTG7cjs.Icon, { name: "layers", size: 16, "aria-hidden": "true" }),
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "strong", { style: { minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontSize: "var(--label1-size)", lineHeight: "var(--label1-line)", fontWeight: "var(--fw-bold)", color: "var(--color-semantic-label-strong)", letterSpacing: 0 }, children: title }),
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { style: { marginLeft: "auto", fontSize: "var(--caption1-size)", lineHeight: "var(--caption1-line)", fontWeight: "var(--fw-bold)", color: "var(--color-semantic-label-neutral)", fontVariantNumeric: "tabular-nums" }, children: layerIds.length })
        ] }),
        layers.length === 0 ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { role: "status", style: { display: "grid", placeItems: "center", minHeight: 120, color: "var(--color-semantic-label-neutral)", fontSize: "var(--label2-size)", lineHeight: "var(--label2-line)", fontWeight: "var(--fw-medium)", textAlign: "center" }, children: emptyLabel }) : /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
          "ul",
          {
            role: "tree",
            "aria-label": label,
            "aria-multiselectable": "false",
            "aria-disabled": disabled || void 0,
            style: { minHeight: 0, overflow: "auto", margin: 0, padding: 0, listStyle: "none" },
            children: layers.map((layer) => /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
              LayerRow,
              {
                layer,
                depth: 0,
                visibleSet,
                lockedSet,
                expandedSet,
                activeId: currentActive,
                focusId,
                disabled,
                onFocusLayer: setFocusId,
                onSelect: selectLayer,
                onToggleVisible: setVisible,
                onToggleLocked: setLocked,
                onToggleExpanded: setExpanded,
                onTypeahead: typeahead
              },
              layer.id
            ))
          }
        )
      ]
    }
  );
}



exports.LayerPanel = LayerPanel;
//# sourceMappingURL=chunk-YIYNLYSP.cjs.map