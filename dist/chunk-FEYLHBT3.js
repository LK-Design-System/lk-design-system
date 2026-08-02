"use client";
import {
  Input
} from "./chunk-NBR64B5X.js";
import {
  Icon
} from "./chunk-JNVDI5OO.js";

// components/data/TreePicker.jsx
import React from "react";
import { jsx, jsxs } from "react/jsx-runtime";
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
  return (node.children ?? []).some((child) => matchesQuery(child, query));
}
function isSelectable(node) {
  const branch = (node.children?.length ?? 0) > 0;
  return node.selectable ?? !branch;
}
function selectionIds(node, behavior, inheritedDisabled = false, includeDisabled = true) {
  const disabled = inheritedDisabled || Boolean(node.disabled);
  const children = node.children ?? [];
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
    if (expanded && (node.children?.length ?? 0) > 0) visibleTreeNodes(node.children, query, expandedSet, node.id, disabled, result);
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
  const [focused, setFocused] = React.useState(false);
  const [hovered, setHovered] = React.useState(false);
  const [expandHovered, setExpandHovered] = React.useState(false);
  const groupId = React.useId();
  if (!matchesQuery(node, query)) return null;
  const children = node.children ?? [];
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
  return /* @__PURE__ */ jsxs("li", { role: "none", style: { margin: 0, padding: 0, listStyle: "none" }, children: [
    /* @__PURE__ */ jsxs(
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
          branch && !query ? /* @__PURE__ */ jsx(
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
              children: /* @__PURE__ */ jsx("span", { style: { display: "inline-flex", transform: expanded ? "rotate(90deg)" : "none", transition: "transform var(--dur-fast) var(--ease-out)" }, children: /* @__PURE__ */ jsx(Icon, { name: "chevron-right", size: 16, "aria-hidden": "true" }) })
            }
          ) : /* @__PURE__ */ jsx("span", { "aria-hidden": "true", style: { width: "var(--component-toggle-icon-size-sm)" } }),
          selectable ? /* @__PURE__ */ jsx(
            "span",
            {
              "aria-hidden": "true",
              "data-tree-picker-check": "",
              "data-tree-picker-check-state": state.mixed ? "mixed" : state.checked ? "checked" : "unchecked",
              style: { display: "inline-flex", alignItems: "center", justifyContent: "center", lineHeight: 0 },
              children: /* @__PURE__ */ jsxs(
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
                    state.mixed && /* @__PURE__ */ jsx("span", { style: { width: CHECK_INDICATOR_SIZE - 8, height: 2, borderRadius: "var(--radius-pill)", background: indicatorMarkColor } }),
                    !state.mixed && state.checked && /* @__PURE__ */ jsx(Icon, { name: "check", size: CHECK_INDICATOR_MARK_SIZE, color: indicatorMarkColor, "aria-hidden": "true" })
                  ]
                }
              )
            }
          ) : /* @__PURE__ */ jsx("span", { "aria-hidden": "true" }),
          /* @__PURE__ */ jsxs("span", { style: { minWidth: 0, marginLeft: "var(--space-2)", display: "flex", alignItems: "center", gap: "var(--space-2)", flexWrap: "wrap" }, children: [
            /* @__PURE__ */ jsxs("span", { style: { minWidth: 0, display: "grid", gap: "var(--space-0)", flex: "1 1 10rem" }, children: [
              /* @__PURE__ */ jsx("span", { title: typeof node.label === "string" ? node.label : void 0, style: { minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: nodeDisabled ? "var(--color-semantic-label-disable)" : "var(--color-semantic-label-normal)", fontSize: "var(--label2-size)", fontWeight: branch ? "var(--fw-semibold)" : "var(--fw-medium)" }, children: node.label }),
              node.description != null && /* @__PURE__ */ jsx("span", { style: { minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: nodeDisabled ? "var(--color-semantic-label-disable)" : "var(--color-semantic-label-neutral)", fontSize: "var(--caption1-size)" }, children: node.description })
            ] }),
            node.meta != null && /* @__PURE__ */ jsx("span", { style: { marginLeft: "auto", color: nodeDisabled ? "var(--color-semantic-label-disable)" : "var(--color-semantic-label-neutral)", fontSize: "var(--caption1-size)", whiteSpace: "nowrap", fontVariantNumeric: "tabular-nums" }, children: node.meta })
          ] })
        ]
      }
    ),
    branch && expanded && /* @__PURE__ */ jsx("ul", { id: groupId, role: "group", style: { margin: 0, padding: 0, listStyle: "none" }, children: children.map((child) => /* @__PURE__ */ jsx(
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
  const treeId = React.useId();
  const nodeRefs = React.useRef(/* @__PURE__ */ new Map());
  const typeAheadRef = React.useRef({ value: "", timer: null });
  const selectionControlled = selectedIds !== void 0;
  const [internalSelectedIds, setInternalSelectedIds] = React.useState(defaultSelectedIds);
  const currentSelectedIds = selectionControlled ? selectedIds : internalSelectedIds;
  const selectedSet = new Set(currentSelectedIds);
  const expansionControlled = expandedIds !== void 0;
  const [internalExpandedIds, setInternalExpandedIds] = React.useState(defaultExpandedIds);
  const currentExpandedIds = expansionControlled ? expandedIds : internalExpandedIds;
  const expandedSet = new Set(currentExpandedIds);
  const queryControlled = query !== void 0;
  const [internalQuery, setInternalQuery] = React.useState(defaultQuery);
  const currentQuery = queryControlled ? query : internalQuery;
  const normalizedQuery = currentQuery.trim().toLowerCase();
  const visibleNodes = nodes.filter((node) => matchesQuery(node, normalizedQuery));
  const visibleRows = visibleTreeNodes(nodes, normalizedQuery, expandedSet, null, disabled);
  const visibleIds = visibleRows.filter((row) => !row.disabled).map((row) => row.id);
  const preferredActiveId = visibleIds.find((id) => selectedSet.has(id)) ?? visibleIds[0];
  const visibleIdsKey = JSON.stringify(visibleIds);
  const [activeId, setActiveId] = React.useState(preferredActiveId);
  React.useEffect(() => {
    if (!visibleIds.includes(activeId)) setActiveId(preferredActiveId);
  }, [activeId, preferredActiveId, visibleIdsKey]);
  const registerNode = (id, element) => {
    if (element) nodeRefs.current.set(id, element);
    else nodeRefs.current.delete(id);
  };
  const focusNode = (id, moveDomFocus = true) => {
    if (id == null || !visibleIds.includes(id)) return;
    setActiveId(id);
    if (moveDomFocus) nodeRefs.current.get(id)?.focus();
  };
  const focusFirstChild = (parentId) => {
    const child = visibleRows.find((row) => row.parentId === parentId && !row.disabled);
    focusNode(child?.id);
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
  React.useEffect(() => () => {
    if (typeAheadRef.current.timer != null) window.clearTimeout(typeAheadRef.current.timer);
  }, []);
  const commitSelection = (next) => {
    const nextIds = [...next];
    if (!selectionControlled) setInternalSelectedIds(nextIds);
    onSelectedIdsChange?.(nextIds);
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
    onExpandedIdsChange?.(nextIds);
  };
  const changeQuery = (value) => {
    if (!queryControlled) setInternalQuery(value);
    onQueryChange?.(value);
  };
  return /* @__PURE__ */ jsxs("div", { style: { width: "100%", minWidth: 0, display: "grid", gap: "var(--space-2)", fontFamily: "var(--font-sans)", ...style }, ...rest, children: [
    /* @__PURE__ */ jsx(
      Input,
      {
        type: "search",
        size: "sm",
        label: searchLabel,
        value: currentQuery,
        onChange: (event) => changeQuery(event.target.value),
        placeholder: searchPlaceholder,
        disabled,
        leadingIcon: /* @__PURE__ */ jsx(Icon, { name: "search", size: 16, "aria-hidden": "true" }),
        "aria-controls": treeId
      }
    ),
    visibleNodes.length === 0 ? /* @__PURE__ */ jsx(
      "div",
      {
        id: treeId,
        role: "status",
        style: { minHeight: 104, maxHeight, display: "grid", placeItems: "center", padding: "var(--space-4)", boxSizing: "border-box", color: "var(--color-semantic-label-neutral)", textAlign: "center", fontSize: "var(--label2-size)", border: "1px solid var(--color-semantic-line-normal-normal)", borderRadius: "var(--radius-md)", background: "var(--color-semantic-background-elevated-normal)" },
        children: nodes.length === 0 ? emptyMessage : noResultsMessage
      }
    ) : /* @__PURE__ */ jsx(
      "ul",
      {
        id: treeId,
        role: "tree",
        "aria-label": label,
        "aria-multiselectable": "true",
        "aria-disabled": disabled || void 0,
        style: { minHeight: 104, maxHeight, margin: 0, padding: "var(--space-1)", overflow: "auto", listStyle: "none", border: "1px solid var(--color-semantic-line-normal-normal)", borderRadius: "var(--radius-md)", background: "var(--color-semantic-background-elevated-normal)" },
        children: visibleNodes.map((node) => /* @__PURE__ */ jsx(
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

export {
  TreePicker
};
//# sourceMappingURL=chunk-FEYLHBT3.js.map