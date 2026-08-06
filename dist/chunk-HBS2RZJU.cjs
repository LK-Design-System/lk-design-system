"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }"use client";


var _chunkOB6YCFMZcjs = require('./chunk-OB6YCFMZ.cjs');


var _chunkB6GRMPJUcjs = require('./chunk-B6GRMPJU.cjs');

// components/data/TreePicker.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
var CHECK_INDICATOR_SIZE = 18;
var CHECK_INDICATOR_MARK_SIZE = 16;
function nodeText(node) {
  if (node.searchText != null) return String(node.searchText);
  if (typeof node.label === "string" || typeof node.label === "number") return String(node.label);
  if (typeof node.description === "string") return node.description;
  return String(node.id);
}
function matchesQuery(node, query) {
  if (!query) return true;
  if (nodeText(node).toLowerCase().includes(query)) return true;
  return (_nullishCoalesce(node.children, () => ( []))).some((child) => matchesQuery(child, query));
}
function isSelectable(node) {
  const branch = (_nullishCoalesce(_optionalChain([node, 'access', _ => _.children, 'optionalAccess', _2 => _2.length]), () => ( 0))) > 0;
  return _nullishCoalesce(node.selectable, () => ( !branch));
}
function selectionIds(node, behavior, inheritedDisabled = false, includeDisabled = true) {
  const disabled = inheritedDisabled || Boolean(node.disabled);
  const children = _nullishCoalesce(node.children, () => ( []));
  const ids = [];
  if (behavior === "independent") {
    if (isSelectable(node) && (includeDisabled || !disabled)) ids.push(node.id);
    return ids;
  }
  if (children.length === 0) {
    if (isSelectable(node) && (includeDisabled || !disabled)) ids.push(node.id);
    return ids;
  }
  for (const child of children) ids.push(...selectionIds(child, behavior, disabled, includeDisabled));
  return ids;
}
function selectionState(ids, selectedSet) {
  const count = ids.filter((id) => selectedSet.has(id)).length;
  return {
    checked: ids.length > 0 && count === ids.length,
    mixed: count > 0 && count < ids.length
  };
}
function visibleTreeNodes(nodes, query, expandedSet, parentId = null, inheritedDisabled = false, result = []) {
  for (const node of nodes) {
    if (!matchesQuery(node, query)) continue;
    const disabled = inheritedDisabled || Boolean(node.disabled);
    result.push({ id: node.id, parentId, node, disabled });
    const expanded = Boolean(query) || expandedSet.has(node.id);
    if (expanded && (_nullishCoalesce(_optionalChain([node, 'access', _3 => _3.children, 'optionalAccess', _4 => _4.length]), () => ( 0))) > 0) visibleTreeNodes(node.children, query, expandedSet, node.id, disabled, result);
  }
  return result;
}
function PickerNode({
  node,
  parentId,
  depth,
  query,
  selectedSet,
  expandedSet,
  selectionBehavior,
  disabled,
  activeId,
  registerNode,
  focusNode,
  focusFirstChild,
  moveFocus,
  onTypeAhead,
  onToggleSelection,
  onToggleExpanded
}) {
  const [focused, setFocused] = _react2.default.useState(false);
  const [hovered, setHovered] = _react2.default.useState(false);
  const [expandHovered, setExpandHovered] = _react2.default.useState(false);
  const groupId = _react2.default.useId();
  if (!matchesQuery(node, query)) return null;
  const children = _nullishCoalesce(node.children, () => ( []));
  const branch = children.length > 0;
  const nodeDisabled = disabled || Boolean(node.disabled);
  const expanded = query ? true : expandedSet.has(node.id);
  const visibleSelectionIds = selectionIds(node, selectionBehavior, false, true);
  const actionableSelectionIds = selectionIds(node, selectionBehavior, nodeDisabled, false);
  const selectable = nodeDisabled ? visibleSelectionIds.length > 0 : actionableSelectionIds.length > 0;
  const state = selectionState(actionableSelectionIds.length > 0 ? actionableSelectionIds : visibleSelectionIds, selectedSet);
  const indicatorDisabled = nodeDisabled || actionableSelectionIds.length === 0;
  const indicatorOn = state.checked || state.mixed;
  const indicatorMarkColor = indicatorDisabled ? "var(--color-semantic-label-disable)" : "var(--color-semantic-static-white)";
  const toggleSelection = () => {
    if (!nodeDisabled && actionableSelectionIds.length > 0) onToggleSelection(actionableSelectionIds, state.checked);
  };
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "li", { role: "none", style: { margin: 0, padding: 0, listStyle: "none" }, children: [
    /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
      "div",
      {
        ref: (element) => registerNode(node.id, element),
        role: "treeitem",
        "aria-level": depth + 1,
        "aria-expanded": branch ? expanded : void 0,
        "aria-owns": branch && expanded ? groupId : void 0,
        "aria-checked": selectable ? state.mixed ? "mixed" : state.checked : void 0,
        "aria-disabled": nodeDisabled || void 0,
        tabIndex: nodeDisabled ? -1 : activeId === node.id ? 0 : -1,
        "data-tree-picker-id": node.id,
        onFocus: () => {
          setFocused(true);
          focusNode(node.id, false);
        },
        onBlur: () => setFocused(false),
        onMouseEnter: () => setHovered(true),
        onMouseLeave: () => setHovered(false),
        onClick: (event) => {
          if (event.target.closest("button, label")) return;
          if (selectable) toggleSelection();
          else if (branch && !query) onToggleExpanded(node.id);
        },
        onKeyDown: (event) => {
          if (event.target !== event.currentTarget) return;
          if (event.key === "ArrowDown") {
            event.preventDefault();
            moveFocus(node.id, "next");
          }
          if (event.key === "ArrowUp") {
            event.preventDefault();
            moveFocus(node.id, "previous");
          }
          if (event.key === "Home") {
            event.preventDefault();
            moveFocus(node.id, "first");
          }
          if (event.key === "End") {
            event.preventDefault();
            moveFocus(node.id, "last");
          }
          if (event.key === "ArrowRight") {
            event.preventDefault();
            if (branch && !expanded && !query) onToggleExpanded(node.id);
            else if (branch) focusFirstChild(node.id);
          }
          if (event.key === "ArrowLeft") {
            event.preventDefault();
            if (branch && expanded && !query) onToggleExpanded(node.id);
            else focusNode(parentId);
          }
          if (event.key === " " || event.key === "Enter") {
            event.preventDefault();
            if (selectable) toggleSelection();
            else if (branch && !query) onToggleExpanded(node.id);
          }
          if (event.key.length === 1 && event.key !== " " && !event.altKey && !event.ctrlKey && !event.metaKey) {
            event.preventDefault();
            onTypeAhead(node.id, event.key);
          }
        },
        style: {
          padding: "var(--space-1) var(--space-2)",
          paddingLeft: `calc(var(--space-2) + ${depth} * var(--space-4))`,
          display: "grid",
          gridTemplateColumns: "var(--component-toggle-icon-size-sm) auto minmax(0, 1fr)",
          alignItems: "center",
          columnGap: "var(--space-0)",
          minHeight: "var(--control-h-md)",
          borderRadius: "var(--radius-sm)",
          background: focused ? "var(--color-semantic-fill-alternative)" : hovered && !nodeDisabled ? "var(--color-semantic-fill-normal)" : "transparent",
          boxShadow: focused ? "0 0 0 4px var(--color-semantic-focus-ring)" : "none",
          outline: "none",
          cursor: nodeDisabled ? "not-allowed" : "pointer",
          position: "relative",
          zIndex: focused ? 1 : 0,
          transition: "background var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out)"
        },
        children: [
          branch && !query ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
            "span",
            {
              "aria-hidden": "true",
              "data-tree-picker-expand": "",
              onMouseEnter: () => setExpandHovered(true),
              onMouseLeave: () => setExpandHovered(false),
              onClick: (event) => {
                event.stopPropagation();
                if (!nodeDisabled) onToggleExpanded(node.id);
              },
              style: { display: "inline-flex", alignItems: "center", justifyContent: "center", width: "var(--component-toggle-icon-size-sm)", height: "var(--component-toggle-icon-size-sm)", lineHeight: 0, borderRadius: "var(--radius-sm)", background: expandHovered && !nodeDisabled ? "var(--color-semantic-fill-alternative)" : "transparent", cursor: nodeDisabled ? "not-allowed" : "pointer", transition: "background var(--dur-fast) var(--ease-out)" },
              children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { style: { display: "inline-flex", transform: expanded ? "rotate(90deg)" : "none", transition: "transform var(--dur-fast) var(--ease-out)" }, children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkB6GRMPJUcjs.Icon, { name: "chevron-right", size: 16, "aria-hidden": "true" }) })
            }
          ) : /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { "aria-hidden": "true", style: { width: "var(--component-toggle-icon-size-sm)" } }),
          selectable ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
            "span",
            {
              "aria-hidden": "true",
              "data-tree-picker-check": "",
              "data-tree-picker-check-state": state.mixed ? "mixed" : state.checked ? "checked" : "unchecked",
              style: { display: "inline-flex", alignItems: "center", justifyContent: "center", lineHeight: 0 },
              children: /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
                "span",
                {
                  style: {
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: CHECK_INDICATOR_SIZE,
                    height: CHECK_INDICATOR_SIZE,
                    flexShrink: 0,
                    boxSizing: "border-box",
                    background: indicatorDisabled ? indicatorOn ? "var(--color-semantic-fill-strong)" : "var(--color-semantic-fill-normal)" : indicatorOn ? "var(--color-semantic-primary-normal)" : "var(--color-semantic-background-elevated-normal)",
                    border: `1.5px solid ${indicatorDisabled ? "var(--color-semantic-line-normal-neutral)" : indicatorOn ? "var(--color-semantic-primary-normal)" : "var(--color-semantic-line-solid-normal)"}`,
                    borderRadius: "var(--radius-5)",
                    transition: "background var(--dur-fast) var(--ease-out), border-color var(--dur-fast) var(--ease-out)"
                  },
                  children: [
                    state.mixed && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { style: { width: CHECK_INDICATOR_SIZE - 8, height: 2, borderRadius: "var(--radius-pill)", background: indicatorMarkColor } }),
                    !state.mixed && state.checked && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkB6GRMPJUcjs.Icon, { name: "check", size: CHECK_INDICATOR_MARK_SIZE, color: indicatorMarkColor, "aria-hidden": "true" })
                  ]
                }
              )
            }
          ) : /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { "aria-hidden": "true" }),
          /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "span", { style: { minWidth: 0, marginLeft: "var(--space-2)", display: "flex", alignItems: "center", gap: "var(--space-2)", flexWrap: "wrap" }, children: [
            /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "span", { style: { minWidth: 0, display: "grid", gap: "var(--space-0)", flex: "1 1 10rem" }, children: [
              /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { title: typeof node.label === "string" ? node.label : void 0, style: { minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: nodeDisabled ? "var(--color-semantic-label-disable)" : "var(--color-semantic-label-normal)", fontSize: "var(--label2-size)", fontWeight: branch ? "var(--fw-semibold)" : "var(--fw-medium)" }, children: node.label }),
              node.description != null && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { style: { minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: nodeDisabled ? "var(--color-semantic-label-disable)" : "var(--color-semantic-label-neutral)", fontSize: "var(--caption1-size)" }, children: node.description })
            ] }),
            node.meta != null && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { style: { marginLeft: "auto", color: nodeDisabled ? "var(--color-semantic-label-disable)" : "var(--color-semantic-label-neutral)", fontSize: "var(--caption1-size)", whiteSpace: "nowrap", fontVariantNumeric: "tabular-nums" }, children: node.meta })
          ] })
        ]
      }
    ),
    branch && expanded && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "ul", { id: groupId, role: "group", style: { margin: 0, padding: 0, listStyle: "none" }, children: children.map((child) => /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
      PickerNode,
      {
        node: child,
        parentId: node.id,
        depth: depth + 1,
        query,
        selectedSet,
        expandedSet,
        selectionBehavior,
        disabled: nodeDisabled,
        activeId,
        registerNode,
        focusNode,
        focusFirstChild,
        moveFocus,
        onTypeAhead,
        onToggleSelection,
        onToggleExpanded
      },
      child.id
    )) })
  ] });
}
function TreePicker({
  nodes = [],
  selectedIds,
  defaultSelectedIds = [],
  onSelectedIdsChange,
  expandedIds,
  defaultExpandedIds = [],
  onExpandedIdsChange,
  query,
  defaultQuery = "",
  onQueryChange,
  selectionBehavior = "descendants",
  searchLabel = "\uACC4\uCE35 \uAC80\uC0C9",
  searchPlaceholder = "\uAC80\uC0C9",
  label = "\uACC4\uCE35\uC5D0\uC11C \uC120\uD0DD",
  emptyMessage = "\uC120\uD0DD\uD560 \uD56D\uBAA9\uC774 \uC5C6\uC2B5\uB2C8\uB2E4.",
  noResultsMessage = "\uC77C\uCE58\uD558\uB294 \uD56D\uBAA9\uC774 \uC5C6\uC2B5\uB2C8\uB2E4.",
  maxHeight = 280,
  disabled = false,
  style,
  ...rest
}) {
  const treeId = _react2.default.useId();
  const nodeRefs = _react2.default.useRef(/* @__PURE__ */ new Map());
  const typeAheadRef = _react2.default.useRef({ value: "", timer: null });
  const selectionControlled = selectedIds !== void 0;
  const [internalSelectedIds, setInternalSelectedIds] = _react2.default.useState(defaultSelectedIds);
  const currentSelectedIds = selectionControlled ? selectedIds : internalSelectedIds;
  const selectedSet = new Set(currentSelectedIds);
  const expansionControlled = expandedIds !== void 0;
  const [internalExpandedIds, setInternalExpandedIds] = _react2.default.useState(defaultExpandedIds);
  const currentExpandedIds = expansionControlled ? expandedIds : internalExpandedIds;
  const expandedSet = new Set(currentExpandedIds);
  const queryControlled = query !== void 0;
  const [internalQuery, setInternalQuery] = _react2.default.useState(defaultQuery);
  const currentQuery = queryControlled ? query : internalQuery;
  const normalizedQuery = currentQuery.trim().toLowerCase();
  const visibleNodes = nodes.filter((node) => matchesQuery(node, normalizedQuery));
  const visibleRows = visibleTreeNodes(nodes, normalizedQuery, expandedSet, null, disabled);
  const visibleIds = visibleRows.filter((row) => !row.disabled).map((row) => row.id);
  const preferredActiveId = _nullishCoalesce(visibleIds.find((id) => selectedSet.has(id)), () => ( visibleIds[0]));
  const visibleIdsKey = JSON.stringify(visibleIds);
  const [activeId, setActiveId] = _react2.default.useState(preferredActiveId);
  _react2.default.useEffect(() => {
    if (!visibleIds.includes(activeId)) setActiveId(preferredActiveId);
  }, [activeId, preferredActiveId, visibleIdsKey]);
  const registerNode = (id, element) => {
    if (element) nodeRefs.current.set(id, element);
    else nodeRefs.current.delete(id);
  };
  const focusNode = (id, moveDomFocus = true) => {
    if (id == null || !visibleIds.includes(id)) return;
    setActiveId(id);
    if (moveDomFocus) _optionalChain([nodeRefs, 'access', _5 => _5.current, 'access', _6 => _6.get, 'call', _7 => _7(id), 'optionalAccess', _8 => _8.focus, 'call', _9 => _9()]);
  };
  const focusFirstChild = (parentId) => {
    const child = visibleRows.find((row) => row.parentId === parentId && !row.disabled);
    focusNode(_optionalChain([child, 'optionalAccess', _10 => _10.id]));
  };
  const moveFocus = (id, direction) => {
    const index = visibleIds.indexOf(id);
    if (index < 0 || visibleIds.length === 0) return;
    if (direction === "first") focusNode(visibleIds[0]);
    if (direction === "last") focusNode(visibleIds[visibleIds.length - 1]);
    if (direction === "next") focusNode(visibleIds[Math.min(index + 1, visibleIds.length - 1)]);
    if (direction === "previous") focusNode(visibleIds[Math.max(index - 1, 0)]);
  };
  const typeAhead = (id, key) => {
    const normalizedKey = key.toLocaleLowerCase();
    const previous = typeAheadRef.current.value;
    const repeatedCharacter = previous.length > 0 && [...previous].every((character) => character === normalizedKey);
    const nextValue = repeatedCharacter ? normalizedKey : `${previous}${normalizedKey}`;
    typeAheadRef.current.value = nextValue;
    if (typeAheadRef.current.timer != null) window.clearTimeout(typeAheadRef.current.timer);
    typeAheadRef.current.timer = window.setTimeout(() => {
      typeAheadRef.current.value = "";
      typeAheadRef.current.timer = null;
    }, 500);
    const currentIndex = visibleIds.indexOf(id);
    const orderedIds = currentIndex < 0 ? visibleIds : [...visibleIds.slice(currentIndex + 1), ...visibleIds.slice(0, currentIndex + 1)];
    const match = orderedIds.find((candidateId) => {
      const row = visibleRows.find((candidate) => candidate.id === candidateId);
      return row && nodeText(row.node).toLocaleLowerCase().startsWith(nextValue);
    });
    focusNode(match);
  };
  _react2.default.useEffect(() => () => {
    if (typeAheadRef.current.timer != null) window.clearTimeout(typeAheadRef.current.timer);
  }, []);
  const commitSelection = (next) => {
    const nextIds = [...next];
    if (!selectionControlled) setInternalSelectedIds(nextIds);
    _optionalChain([onSelectedIdsChange, 'optionalCall', _11 => _11(nextIds)]);
  };
  const toggleSelection = (ids, allSelected) => {
    if (disabled || ids.length === 0) return;
    const next = new Set(selectedSet);
    for (const id of ids) {
      if (allSelected) next.delete(id);
      else next.add(id);
    }
    commitSelection(next);
  };
  const toggleExpanded = (id) => {
    if (disabled || normalizedQuery) return;
    const next = new Set(expandedSet);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    const nextIds = [...next];
    if (!expansionControlled) setInternalExpandedIds(nextIds);
    _optionalChain([onExpandedIdsChange, 'optionalCall', _12 => _12(nextIds)]);
  };
  const changeQuery = (value) => {
    if (!queryControlled) setInternalQuery(value);
    _optionalChain([onQueryChange, 'optionalCall', _13 => _13(value)]);
  };
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { style: { width: "100%", minWidth: 0, display: "grid", gap: "var(--space-2)", fontFamily: "var(--font-sans)", ...style }, ...rest, children: [
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
      _chunkOB6YCFMZcjs.Input,
      {
        type: "search",
        size: "sm",
        label: searchLabel,
        value: currentQuery,
        onChange: (event) => changeQuery(event.target.value),
        placeholder: searchPlaceholder,
        disabled,
        leadingIcon: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkB6GRMPJUcjs.Icon, { name: "search", size: 16, "aria-hidden": "true" }),
        "aria-controls": treeId
      }
    ),
    visibleNodes.length === 0 ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
      "div",
      {
        id: treeId,
        role: "status",
        style: { minHeight: 104, maxHeight, display: "grid", placeItems: "center", padding: "var(--space-4)", boxSizing: "border-box", color: "var(--color-semantic-label-neutral)", textAlign: "center", fontSize: "var(--label2-size)", border: "1px solid var(--color-semantic-line-normal-normal)", borderRadius: "var(--radius-md)", background: "var(--color-semantic-background-elevated-normal)" },
        children: nodes.length === 0 ? emptyMessage : noResultsMessage
      }
    ) : /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
      "ul",
      {
        id: treeId,
        role: "tree",
        "aria-label": label,
        "aria-multiselectable": "true",
        "aria-disabled": disabled || void 0,
        style: { minHeight: 104, maxHeight, margin: 0, padding: "var(--space-1)", overflow: "auto", listStyle: "none", border: "1px solid var(--color-semantic-line-normal-normal)", borderRadius: "var(--radius-md)", background: "var(--color-semantic-background-elevated-normal)" },
        children: visibleNodes.map((node) => /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
          PickerNode,
          {
            node,
            parentId: null,
            depth: 0,
            query: normalizedQuery,
            selectedSet,
            expandedSet,
            selectionBehavior,
            disabled,
            activeId,
            registerNode,
            focusNode,
            focusFirstChild,
            moveFocus,
            onTypeAhead: typeAhead,
            onToggleSelection: toggleSelection,
            onToggleExpanded: toggleExpanded
          },
          node.id
        ))
      }
    )
  ] });
}



exports.TreePicker = TreePicker;
//# sourceMappingURL=chunk-HBS2RZJU.cjs.map