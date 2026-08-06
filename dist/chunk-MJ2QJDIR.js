"use client";
import {
  tdStyle,
  thStyle
} from "./chunk-IGVXI6D7.js";
import {
  IconButton
} from "./chunk-EFNOOM3R.js";
import {
  Icon
} from "./chunk-ON44Y65B.js";

// components/data/DataGrid.jsx
import React from "react";
import { jsx, jsxs } from "react/jsx-runtime";
function compareValues(a, b, dir) {
  if (a == null && b == null) return 0;
  if (a == null) return 1;
  if (b == null) return -1;
  const result = typeof a === "number" && typeof b === "number" ? a - b : String(a).localeCompare(String(b), "ko");
  return dir === "desc" ? -result : result;
}
function sortRowEntries(entries, sortModel) {
  if (!sortModel.length) return entries;
  return [...entries].sort((a, b) => {
    for (const sort of sortModel) {
      const result = compareValues(a.row[sort.key], b.row[sort.key], sort.dir);
      if (result !== 0) return result;
    }
    return a.sourceIndex - b.sourceIndex;
  });
}
function normalizeSortModel(model = []) {
  const seen = /* @__PURE__ */ new Set();
  const normalized = [];
  for (const entry of Array.isArray(model) ? model : []) {
    if (entry?.key == null || seen.has(entry.key)) continue;
    seen.add(entry.key);
    normalized.push({ key: entry.key, dir: entry.dir === "desc" ? "desc" : "asc" });
  }
  return normalized;
}
function legacySortModel(sort) {
  return sort?.key == null ? [] : normalizeSortModel([sort]);
}
function columnLabelText(column) {
  if (column.accessibleLabel) return column.accessibleLabel;
  if (typeof column.label === "string" || typeof column.label === "number") return String(column.label);
  return String(column.key);
}
function isPinnedStart(column) {
  return column.pinned === "start" || column.pinned === "left";
}
function isPinnedEnd(column) {
  return column.pinned === "end" || column.pinned === "right";
}
function orderColumns(columns, columnOrder) {
  const byKey = new Map(columns.map((column) => [column.key, column]));
  const seen = /* @__PURE__ */ new Set();
  const ordered = [];
  for (const key of columnOrder ?? []) {
    if (seen.has(key) || !byKey.has(key)) continue;
    seen.add(key);
    ordered.push(byKey.get(key));
  }
  for (const column of columns) {
    if (seen.has(column.key)) continue;
    seen.add(column.key);
    ordered.push(column);
  }
  return [
    ...ordered.filter(isPinnedStart),
    ...ordered.filter((column) => !isPinnedStart(column) && !isPinnedEnd(column)),
    ...ordered.filter(isPinnedEnd)
  ];
}
function cssSize(value) {
  return typeof value === "number" ? `${value}px` : value;
}
function sumCssSizes(values) {
  const terms = values.filter((value) => value != null && value !== 0).map(cssSize);
  if (!terms.length) return 0;
  if (terms.length === 1) return terms[0];
  return `calc(${terms.join(" + ")})`;
}
function decorateVisibleColumns(columns, logicalIndexByKey, utilityWidth) {
  const decorations = /* @__PURE__ */ new Map();
  const startWidths = utilityWidth ? [utilityWidth] : [];
  for (const column of columns.filter(isPinnedStart)) {
    const resolvedWidth = column.width ?? column.minWidth ?? 160;
    decorations.set(column.key, { pinSide: "start", pinOffset: sumCssSizes(startWidths), resolvedWidth });
    startWidths.push(resolvedWidth);
  }
  const endWidths = [];
  for (const column of [...columns].reverse().filter(isPinnedEnd)) {
    const resolvedWidth = column.width ?? column.minWidth ?? 160;
    decorations.set(column.key, { pinSide: "end", pinOffset: sumCssSizes(endWidths), resolvedWidth });
    endWidths.push(resolvedWidth);
  }
  return columns.map((column) => ({
    ...column,
    ...decorations.get(column.key),
    logicalIndex: logicalIndexByKey.get(column.key)
  }));
}
var CHECK_IMG = `url("data:image/svg+xml,%3Csvg width='16' height='16' viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M4 8.2L6.7 10.8L12 5.2' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`;
var DASH_IMG = `url("data:image/svg+xml,%3Csvg width='16' height='16' viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M4 8h8' stroke='white' stroke-width='2' stroke-linecap='round'/%3E%3C/svg%3E")`;
function checkboxStyle(checked, indeterminate = false, disabled = false) {
  const filled = checked || indeterminate;
  return {
    appearance: "none",
    WebkitAppearance: "none",
    width: 16,
    height: 16,
    margin: 0,
    borderRadius: "var(--radius-5)",
    border: `1px solid ${filled ? "var(--color-semantic-primary-normal)" : "var(--color-semantic-line-solid-normal)"}`,
    backgroundColor: filled ? "var(--color-semantic-primary-normal)" : "var(--color-semantic-background-elevated-normal)",
    backgroundImage: indeterminate ? DASH_IMG : checked ? CHECK_IMG : "none",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.5 : 1,
    verticalAlign: "middle"
  };
}
function SelectionCheckbox({ checked, indeterminate = false, disabled = false, ...rest }) {
  const inputRef = React.useRef(null);
  React.useLayoutEffect(() => {
    if (inputRef.current) inputRef.current.indeterminate = indeterminate;
  }, [indeterminate]);
  return /* @__PURE__ */ jsx(
    "input",
    {
      ...rest,
      ref: inputRef,
      type: "checkbox",
      checked,
      disabled,
      style: checkboxStyle(checked, indeterminate, disabled)
    }
  );
}
function explicitSelection(selectedIds = []) {
  return { mode: "explicit", selectedIds: [...new Set(selectedIds)] };
}
function normalizeSelectionModel(model) {
  if (model?.mode === "allMatching") {
    return { mode: "allMatching", excludedIds: [...new Set(model.excludedIds ?? [])] };
  }
  return explicitSelection(model?.selectedIds);
}
function excludeIneligibleRows(model, ineligibleIds) {
  const normalized = normalizeSelectionModel(model);
  if (normalized.mode === "allMatching") {
    return {
      mode: "allMatching",
      excludedIds: [.../* @__PURE__ */ new Set([...normalized.excludedIds, ...ineligibleIds])]
    };
  }
  return explicitSelection(normalized.selectedIds.filter((id) => !ineligibleIds.has(id)));
}
function selectedCountFor(model, totalCount) {
  if (model.mode === "allMatching") {
    return Math.max(0, totalCount - new Set(model.excludedIds).size);
  }
  return new Set(model.selectedIds).size;
}
var visuallyHiddenStyle = {
  position: "absolute",
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: "hidden",
  clip: "rect(0, 0, 0, 0)",
  whiteSpace: "nowrap",
  border: 0
};
var ROW_INTERACTIVE_SELECTOR = [
  "button",
  "a",
  "input",
  "select",
  "textarea",
  '[role="button"]',
  '[role="link"]',
  '[role="checkbox"]',
  '[role="radio"]',
  '[role="switch"]',
  '[role="combobox"]',
  '[role="listbox"]',
  '[role="option"]',
  '[role="menuitem"]',
  '[role="menuitemcheckbox"]',
  '[role="menuitemradio"]',
  '[role="slider"]',
  '[role="spinbutton"]',
  '[contenteditable]:not([contenteditable="false"])'
].join(", ");
function isInteractiveRowTarget(target) {
  return Boolean(target?.closest?.(ROW_INTERACTIVE_SELECTOR));
}
function utilityCellStyle({ offset, header = false, stickyHeader = false, stickyHeaderOffset = 0, background }) {
  return {
    position: "sticky",
    insetInlineStart: offset,
    top: header && stickyHeader ? stickyHeaderOffset : void 0,
    zIndex: header && stickyHeader ? 5 : header ? 3 : 2,
    background
  };
}
function columnPositionStyle(column, { header = false, stickyHeader = false, stickyHeaderOffset = 0, selected = false }) {
  const pinned = column.pinSide != null;
  const verticallySticky = header && stickyHeader;
  const style = {
    boxSizing: "border-box",
    width: column.width ?? (pinned ? column.resolvedWidth : void 0),
    minWidth: column.minWidth ?? (pinned ? column.resolvedWidth : void 0)
  };
  if (pinned || verticallySticky) style.position = "sticky";
  if (column.pinSide === "start") style.insetInlineStart = column.pinOffset;
  if (column.pinSide === "end") style.insetInlineEnd = column.pinOffset;
  if (verticallySticky) style.top = stickyHeaderOffset;
  if (pinned || verticallySticky) {
    style.background = header ? "var(--color-semantic-background-elevated-normal)" : selected ? "var(--color-semantic-primary-surface-normal)" : "var(--color-semantic-background-elevated-normal)";
    style.zIndex = pinned && verticallySticky ? 4 : verticallySticky ? 3 : 1;
  }
  return style;
}
function DataGrid({
  columns = [],
  rows = [],
  visibleColumnKeys,
  columnOrder,
  tableLabel,
  selectable = false,
  selectedRows,
  defaultSelectedRows = [],
  onSelectionChange,
  selectionModel: controlledSelectionModel,
  defaultSelectionModel,
  onSelectionModelChange,
  selectAllScope = "page",
  totalCount,
  selectionEntityLabel = "\uD56D\uBAA9",
  getRowSelectionLabel,
  getRowCanSelect,
  getRowId,
  sort: controlledSort,
  defaultSort = { key: null, dir: "asc" },
  onSortChange,
  sortModel: controlledSortModel,
  defaultSortModel,
  onSortModelChange,
  multiSort = false,
  sortingMode = "client",
  expandedRowIds,
  defaultExpandedRowIds = [],
  onExpandedRowIdsChange,
  getRowCanExpand,
  renderExpandedRow,
  editingCell,
  onRowActivate,
  bulkActions,
  onClearSelection,
  stickyHeader = false,
  stickyHeaderOffset = 0,
  loading = false,
  loadingLabel = "\uBD88\uB7EC\uC624\uB294 \uC911",
  error,
  emptyLabel = "\uD45C\uC2DC\uD560 \uD56D\uBAA9\uC774 \uC5C6\uC2B5\uB2C8\uB2E4.",
  stateActions,
  size = "md",
  variant = "standalone",
  className,
  style,
  ...rest
}) {
  const instanceId = React.useId().replace(/:/g, "");
  const usesControlledSortModel = controlledSortModel !== void 0;
  const usesLegacyControlledSort = !usesControlledSortModel && controlledSort !== void 0;
  const sortControlled = usesControlledSortModel || usesLegacyControlledSort;
  const [internalSortModel, setInternalSortModel] = React.useState(() => normalizeSortModel(defaultSortModel ?? legacySortModel(defaultSort)));
  const sortModel = usesControlledSortModel ? normalizeSortModel(controlledSortModel) : usesLegacyControlledSort ? legacySortModel(controlledSort) : internalSortModel;
  const primarySort = sortModel[0];
  const usesSelectionModel = controlledSelectionModel !== void 0;
  const usesLegacyControlledSelection = !usesSelectionModel && selectedRows !== void 0;
  const selectionControlled = usesSelectionModel || usesLegacyControlledSelection;
  const [internalSelectionModel, setInternalSelectionModel] = React.useState(() => normalizeSelectionModel(defaultSelectionModel ?? explicitSelection(defaultSelectedRows)));
  const selection = usesSelectionModel ? normalizeSelectionModel(controlledSelectionModel) : usesLegacyControlledSelection ? explicitSelection(selectedRows) : internalSelectionModel;
  const expansionControlled = expandedRowIds !== void 0;
  const [internalExpandedRowIds, setInternalExpandedRowIds] = React.useState(() => [...new Set(defaultExpandedRowIds)]);
  const resolvedExpandedRowIds = expansionControlled ? [...new Set(expandedRowIds)] : internalExpandedRowIds;
  const expandedIdSet = new Set(resolvedExpandedRowIds);
  const expandable = typeof renderExpandedRow === "function";
  const pad = size === "sm" ? "10px 12px" : "13px 16px";
  const headerH = size === "sm" ? 50 : 58;
  const utilityCount = (expandable ? 1 : 0) + (selectable ? 1 : 0);
  const utilityWidth = utilityCount * 44;
  const orderedColumns = orderColumns(columns, columnOrder);
  const logicalIndexByKey = new Map(orderedColumns.map((column, index) => [column.key, utilityCount + index + 1]));
  const visibleKeySet = visibleColumnKeys === void 0 ? null : new Set(visibleColumnKeys);
  const visibleColumns = decorateVisibleColumns(
    orderedColumns.filter((column) => visibleKeySet == null || visibleKeySet.has(column.key)),
    logicalIndexByKey,
    utilityWidth
  );
  const logicalColumnCount = utilityCount + orderedColumns.length;
  const colSpan = Math.max(1, utilityCount + visibleColumns.length);
  const entries = rows.map((row, index) => {
    const id = getRowId ? getRowId(row, index) : index;
    return {
      row,
      id,
      sourceIndex: index,
      canSelect: !selectable || !getRowCanSelect || getRowCanSelect(row, id) !== false
    };
  });
  const sorted = sortingMode === "manual" ? entries : sortRowEntries(entries, sortModel);
  const ineligibleVisibleIdSet = new Set(
    sorted.filter((entry) => !entry.canSelect).map((entry) => entry.id)
  );
  const effectiveSelection = excludeIneligibleRows(selection, ineligibleVisibleIdSet);
  const selectedIdSet = new Set(effectiveSelection.mode === "explicit" ? effectiveSelection.selectedIds : []);
  const excludedIdSet = new Set(effectiveSelection.mode === "allMatching" ? effectiveSelection.excludedIds : []);
  const rowIsSelected = (rowId) => effectiveSelection.mode === "allMatching" ? !excludedIdSet.has(rowId) : selectedIdSet.has(rowId);
  const applySortModel = (nextModel) => {
    const normalized = normalizeSortModel(nextModel);
    if (!sortControlled) setInternalSortModel(normalized);
    onSortModelChange?.(normalized);
    if (!usesControlledSortModel) {
      onSortChange?.(normalized[0] ?? { key: null, dir: "asc" });
    }
  };
  const toggleSort = (column) => {
    if (!column.sortable) return;
    const sortIndex = sortModel.findIndex((entry) => entry.key === column.key);
    let next;
    if (multiSort) {
      if (sortIndex < 0) next = [...sortModel, { key: column.key, dir: "asc" }];
      else if (sortModel[sortIndex].dir === "asc") {
        next = sortModel.map((entry, index) => index === sortIndex ? { ...entry, dir: "desc" } : entry);
      } else {
        next = sortModel.filter((_, index) => index !== sortIndex);
      }
    } else {
      const dir = sortIndex === 0 && sortModel[0].dir === "asc" ? "desc" : "asc";
      next = [{ key: column.key, dir }];
    }
    applySortModel(next);
  };
  const resolvedTotalCount = Math.max(0, totalCount ?? rows.length);
  const applySelection = (nextModel) => {
    const normalized = excludeIneligibleRows(nextModel, ineligibleVisibleIdSet);
    if (!selectionControlled) setInternalSelectionModel(normalized);
    onSelectionModelChange?.(normalized);
    if (!usesSelectionModel && normalized.mode === "explicit") {
      onSelectionChange?.(normalized.selectedIds);
    }
  };
  const clearSelection = () => {
    applySelection(explicitSelection());
    onClearSelection?.();
  };
  const toggleRow = (id, canSelect) => {
    if (!canSelect) return;
    if (effectiveSelection.mode === "allMatching") {
      const excludedIds = new Set(effectiveSelection.excludedIds);
      if (excludedIds.has(id)) excludedIds.delete(id);
      else excludedIds.add(id);
      applySelection({ mode: "allMatching", excludedIds: [...excludedIds] });
      return;
    }
    const selectedIds = new Set(effectiveSelection.selectedIds);
    if (selectedIds.has(id)) selectedIds.delete(id);
    else selectedIds.add(id);
    applySelection(explicitSelection([...selectedIds]));
  };
  const visibleIds = sorted.filter((entry) => entry.canSelect).map((entry) => entry.id);
  const visibleSelectedCount = visibleIds.filter((id) => rowIsSelected(id)).length;
  const pageAllOn = selectable && visibleIds.length > 0 && visibleSelectedCount === visibleIds.length;
  const selectedCount = selectedCountFor(effectiveSelection, resolvedTotalCount);
  const eligibleTotalCount = Math.max(0, resolvedTotalCount - ineligibleVisibleIdSet.size);
  const allMatchingOn = selectable && eligibleTotalCount > 0 && effectiveSelection.mode === "allMatching" && selectedCount === eligibleTotalCount;
  const scopeChecked = selectAllScope === "allMatching" ? allMatchingOn : pageAllOn;
  const scopeIndeterminate = selectAllScope === "allMatching" ? selectedCount > 0 && !scopeChecked : visibleSelectedCount > 0 && !scopeChecked;
  const scopeCount = selectAllScope === "allMatching" ? eligibleTotalCount : visibleIds.length;
  const scopeLabel = selectAllScope === "allMatching" ? "\uC804\uCCB4 \uACB0\uACFC" : "\uD604\uC7AC \uD398\uC774\uC9C0";
  const selectAllDisabled = scopeCount === 0;
  const selectAllLabel = `${scopeLabel} ${selectionEntityLabel} ${scopeCount}\uAC1C ${scopeChecked ? "\uC120\uD0DD \uD574\uC81C" : "\uC120\uD0DD"}`;
  const toggleAll = () => {
    if (selectAllScope === "allMatching") {
      if (scopeChecked) applySelection(explicitSelection());
      else applySelection({ mode: "allMatching", excludedIds: [...ineligibleVisibleIdSet] });
      return;
    }
    if (effectiveSelection.mode === "allMatching") {
      const excludedIds = new Set(effectiveSelection.excludedIds);
      if (pageAllOn) visibleIds.forEach((id) => excludedIds.add(id));
      else visibleIds.forEach((id) => excludedIds.delete(id));
      applySelection({ mode: "allMatching", excludedIds: [...excludedIds] });
      return;
    }
    const selectedIds = new Set(effectiveSelection.selectedIds);
    if (pageAllOn) visibleIds.forEach((id) => selectedIds.delete(id));
    else visibleIds.forEach((id) => selectedIds.add(id));
    applySelection(explicitSelection([...selectedIds]));
  };
  const applyExpandedRowIds = (nextIds) => {
    const normalized = [...new Set(nextIds)];
    if (!expansionControlled) setInternalExpandedRowIds(normalized);
    onExpandedRowIdsChange?.(normalized);
  };
  const toggleExpandedRow = (id) => {
    const nextIds = new Set(resolvedExpandedRowIds);
    if (nextIds.has(id)) nextIds.delete(id);
    else nextIds.add(id);
    applyExpandedRowIds([...nextIds]);
  };
  const selecting = selectable && selectedCount > 0;
  const bulkActionContext = {
    selectionModel: effectiveSelection,
    selectedCount,
    totalCount: resolvedTotalCount,
    pageSelectedCount: visibleSelectedCount,
    clearSelection
  };
  const renderedBulkActions = typeof bulkActions === "function" ? bulkActions(bulkActionContext) : bulkActions;
  const headerBackground = "var(--color-semantic-background-elevated-normal)";
  const bandBackground = "var(--color-semantic-primary-surface-strong)";
  const expansionColumnIndex = expandable ? 1 : null;
  const selectionColumnIndex = selectable ? expandable ? 2 : 1 : null;
  const expansionOffset = 0;
  const selectionOffset = expandable ? 44 : 0;
  const resourceState = loading ? "loading" : error != null ? "error" : sorted.length === 0 ? "empty" : null;
  return /* @__PURE__ */ jsxs(
    "div",
    {
      ...rest,
      className: ["lk-scroll-surface", className].filter(Boolean).join(" "),
      "data-scrollbar": "auto",
      "data-scroll-gutter": "auto",
      "aria-busy": loading || void 0,
      style: { overflowX: "auto", scrollbarGutter: "auto", ...variant === "embedded" ? null : { border: "1px solid var(--color-semantic-line-solid-normal)", borderRadius: "var(--radius-lg)" }, ...style },
      children: [
        /* @__PURE__ */ jsx("span", { role: "status", "aria-live": "polite", "aria-atomic": "true", style: visuallyHiddenStyle, children: selectedCount > 0 ? `${selectedCount}\uAC1C \uC120\uD0DD\uB428` : "" }),
        /* @__PURE__ */ jsx("span", { role: "status", "aria-live": "polite", "aria-atomic": "true", style: visuallyHiddenStyle, children: loading ? loadingLabel : error == null && sorted.length === 0 ? emptyLabel : "" }),
        /* @__PURE__ */ jsxs(
          "table",
          {
            "aria-label": tableLabel,
            "aria-colcount": logicalColumnCount || void 0,
            style: { width: "100%", height: resourceState ? "100%" : void 0, borderCollapse: "collapse", fontFamily: "var(--font-sans)" },
            children: [
              /* @__PURE__ */ jsxs("thead", { children: [
                selecting && /* @__PURE__ */ jsxs("tr", { style: { height: 0 }, children: [
                  expandable && /* @__PURE__ */ jsx("th", { scope: "col", "aria-colindex": expansionColumnIndex, style: visuallyHiddenStyle, children: "\uC138\uBD80 \uC815\uBCF4" }),
                  selectable && /* @__PURE__ */ jsx("th", { scope: "col", "aria-colindex": selectionColumnIndex, style: visuallyHiddenStyle, children: "\uC120\uD0DD" }),
                  visibleColumns.map((column) => /* @__PURE__ */ jsx("th", { scope: "col", "aria-colindex": column.logicalIndex, style: visuallyHiddenStyle, children: columnLabelText(column) }, column.key))
                ] }),
                selecting ? /* @__PURE__ */ jsxs("tr", { style: { height: headerH }, children: [
                  expandable && /* @__PURE__ */ jsx(
                    "td",
                    {
                      "aria-colindex": expansionColumnIndex,
                      style: {
                        padding: pad,
                        width: 44,
                        borderBottom: "1px solid var(--color-semantic-line-solid-normal)",
                        ...utilityCellStyle({ offset: expansionOffset, header: true, stickyHeader, stickyHeaderOffset, background: bandBackground })
                      }
                    }
                  ),
                  selectable && /* @__PURE__ */ jsx(
                    "td",
                    {
                      "aria-colindex": selectionColumnIndex,
                      style: {
                        padding: pad,
                        width: 44,
                        textAlign: "left",
                        borderBottom: "1px solid var(--color-semantic-line-solid-normal)",
                        ...utilityCellStyle({ offset: selectionOffset, header: true, stickyHeader, stickyHeaderOffset, background: bandBackground })
                      },
                      children: /* @__PURE__ */ jsx(SelectionCheckbox, { checked: scopeChecked, indeterminate: scopeIndeterminate, disabled: selectAllDisabled, onChange: toggleAll, "aria-label": selectAllLabel })
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "td",
                    {
                      colSpan: Math.max(1, visibleColumns.length),
                      style: {
                        padding: 0,
                        background: bandBackground,
                        borderBottom: "1px solid var(--color-semantic-line-solid-normal)",
                        position: stickyHeader ? "sticky" : void 0,
                        top: stickyHeader ? stickyHeaderOffset : void 0,
                        zIndex: stickyHeader ? 3 : void 0
                      },
                      children: /* @__PURE__ */ jsxs("div", { role: "group", "aria-label": `${selectionEntityLabel} \uC77C\uAD04 \uC791\uC5C5`, style: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: "var(--space-3)", flexWrap: "wrap", minHeight: headerH, padding: size === "sm" ? "0 8px 0 12px" : "0 8px 0 16px" }, children: [
                        /* @__PURE__ */ jsxs("span", { "data-grid-selection-count": true, style: { color: "var(--color-semantic-label-strong)", fontSize: "var(--label2-size)", fontWeight: "var(--fw-semibold)", fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }, children: [
                          selectedCount,
                          "\uAC1C \uC120\uD0DD\uB428"
                        ] }),
                        /* @__PURE__ */ jsxs("div", { style: { display: "inline-flex", alignItems: "center", justifyContent: "flex-end", gap: "var(--space-2)", flexWrap: "wrap", marginLeft: "auto" }, children: [
                          renderedBulkActions,
                          /* @__PURE__ */ jsx(IconButton, { variant: "plain", size: "small", round: false, label: `${selectionEntityLabel} \uC120\uD0DD \uBAA8\uB450 \uD574\uC81C`, title: `${selectionEntityLabel} \uC120\uD0DD \uBAA8\uB450 \uD574\uC81C`, onClick: clearSelection, children: /* @__PURE__ */ jsx(Icon, { name: "close", size: 15, "aria-hidden": "true" }) })
                        ] })
                      ] })
                    }
                  )
                ] }) : /* @__PURE__ */ jsxs("tr", { style: { height: headerH }, children: [
                  expandable && /* @__PURE__ */ jsx(
                    "th",
                    {
                      scope: "col",
                      "aria-colindex": expansionColumnIndex,
                      style: {
                        padding: pad,
                        width: 44,
                        borderBottom: "1px solid var(--color-semantic-line-solid-normal)",
                        ...utilityCellStyle({ offset: expansionOffset, header: true, stickyHeader, stickyHeaderOffset, background: headerBackground })
                      },
                      children: /* @__PURE__ */ jsx("span", { style: visuallyHiddenStyle, children: "\uC138\uBD80 \uC815\uBCF4" })
                    }
                  ),
                  selectable && /* @__PURE__ */ jsx(
                    "th",
                    {
                      scope: "col",
                      "aria-colindex": selectionColumnIndex,
                      style: {
                        padding: pad,
                        width: 44,
                        textAlign: "left",
                        borderBottom: "1px solid var(--color-semantic-line-solid-normal)",
                        ...utilityCellStyle({ offset: selectionOffset, header: true, stickyHeader, stickyHeaderOffset, background: headerBackground })
                      },
                      children: /* @__PURE__ */ jsx(SelectionCheckbox, { checked: scopeChecked, indeterminate: scopeIndeterminate, disabled: selectAllDisabled, onChange: toggleAll, "aria-label": selectAllLabel })
                    }
                  ),
                  visibleColumns.map((column) => {
                    const sortIndex = sortModel.findIndex((entry) => entry.key === column.key);
                    const sortEntry = sortIndex >= 0 ? sortModel[sortIndex] : null;
                    const label = columnLabelText(column);
                    const directionLabel = sortEntry?.dir === "desc" ? "\uB0B4\uB9BC\uCC28\uC21C" : "\uC624\uB984\uCC28\uC21C";
                    const sortButtonLabel = sortEntry ? sortModel.length > 1 ? `${label}, ${sortIndex + 1}\uC21C\uC704 ${directionLabel} \uC815\uB82C, \uC815\uB82C \uBCC0\uACBD` : `${label}, ${directionLabel} \uC815\uB82C, \uC815\uB82C \uBCC0\uACBD` : `${label}, \uC815\uB82C`;
                    return /* @__PURE__ */ jsx(
                      "th",
                      {
                        scope: "col",
                        "aria-colindex": column.logicalIndex,
                        "aria-sort": column.sortable && primarySort?.key === column.key ? primarySort.dir === "desc" ? "descending" : "ascending" : void 0,
                        "data-column-key": column.key,
                        "data-pinned": column.pinSide || void 0,
                        style: {
                          ...thStyle(pad),
                          textAlign: column.align || "left",
                          userSelect: "none",
                          ...columnPositionStyle(column, { header: true, stickyHeader, stickyHeaderOffset })
                        },
                        children: column.sortable ? /* @__PURE__ */ jsxs(
                          "button",
                          {
                            type: "button",
                            "aria-label": sortButtonLabel,
                            onClick: () => toggleSort(column),
                            style: { display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "var(--space-1-5)", minWidth: 24, minHeight: 24, padding: 0, border: 0, background: "transparent", cursor: "pointer", font: "inherit", letterSpacing: "inherit", textTransform: "inherit", color: "inherit" },
                            children: [
                              column.label,
                              /* @__PURE__ */ jsx(Icon, { name: sortEntry?.dir === "desc" ? "chevron-down-small" : "chevron-up-small", size: 12, "aria-hidden": "true", style: { opacity: sortEntry ? 1 : 0.3 } }),
                              sortEntry && sortModel.length > 1 && /* @__PURE__ */ jsx("span", { "aria-hidden": "true", style: { fontSize: 10, fontVariantNumeric: "tabular-nums" }, children: sortIndex + 1 })
                            ]
                          }
                        ) : /* @__PURE__ */ jsx("span", { style: { display: "inline-flex", alignItems: "center", gap: "var(--space-1-5)" }, children: column.label })
                      },
                      column.key
                    );
                  })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("tbody", { children: [
                resourceState && /* @__PURE__ */ jsx("tr", { "data-grid-state": resourceState, style: { height: "100%" }, children: /* @__PURE__ */ jsx("td", { colSpan, style: { height: "100%", padding: "var(--space-4)", textAlign: "center", verticalAlign: "middle", borderBottom: 0 }, children: /* @__PURE__ */ jsx("div", { className: "lk-data-grid__state", style: { display: "grid", placeItems: "center", minHeight: "var(--space-16)" }, children: /* @__PURE__ */ jsxs("div", { role: error != null ? "alert" : void 0, style: { display: "inline-grid", justifyItems: "center", gap: "var(--space-2)", color: error != null ? "var(--color-semantic-status-negative-text)" : "var(--color-semantic-label-alternative)", fontFamily: "var(--font-sans)", fontSize: "var(--label1-size)", lineHeight: "var(--label1-line)" }, children: [
                  /* @__PURE__ */ jsx("span", { children: loading ? loadingLabel : error ?? emptyLabel }),
                  stateActions
                ] }) }) }) }),
                !loading && error == null && sorted.map(({ row, id, sourceIndex, canSelect }) => {
                  const selected = rowIsSelected(id);
                  const rowLabel = getRowSelectionLabel ? getRowSelectionLabel(row, id) : `${selectionEntityLabel} ${String(id)}`;
                  const rowExpandable = expandable && (getRowCanExpand ? getRowCanExpand(row, id) : true);
                  const expanded = rowExpandable && expandedIdSet.has(id);
                  const detailId = `${instanceId}-detail-${sourceIndex}`;
                  const activate = (event) => {
                    if (!onRowActivate) return;
                    if (isInteractiveRowTarget(event.target)) return;
                    onRowActivate(row, id, event);
                  };
                  return /* @__PURE__ */ jsxs(React.Fragment, { children: [
                    /* @__PURE__ */ jsxs(
                      "tr",
                      {
                        "aria-selected": selectable ? selected : void 0,
                        tabIndex: onRowActivate ? 0 : void 0,
                        onClick: activate,
                        onKeyDown: onRowActivate ? (event) => {
                          if (isInteractiveRowTarget(event.target)) return;
                          if (event.key === "Enter" || event.key === " ") {
                            event.preventDefault();
                            onRowActivate(row, id, event);
                          }
                        } : void 0,
                        style: { background: selected ? "var(--color-semantic-primary-surface-normal)" : "transparent", cursor: onRowActivate ? "pointer" : void 0 },
                        children: [
                          expandable && /* @__PURE__ */ jsx(
                            "td",
                            {
                              "aria-colindex": expansionColumnIndex,
                              style: {
                                padding: size === "sm" ? "9px 6px" : "12px 6px",
                                width: 44,
                                textAlign: "center",
                                borderBottom: "1px solid var(--color-semantic-line-solid-normal)",
                                ...utilityCellStyle({ offset: expansionOffset, background: selected ? "var(--color-semantic-primary-surface-normal)" : headerBackground })
                              },
                              children: rowExpandable && /* @__PURE__ */ jsx(
                                IconButton,
                                {
                                  variant: "plain",
                                  size: "small",
                                  round: false,
                                  label: `${rowLabel} \uC138\uBD80 \uC815\uBCF4 ${expanded ? "\uC811\uAE30" : "\uD3BC\uCE58\uAE30"}`,
                                  "aria-expanded": expanded,
                                  "aria-controls": detailId,
                                  onClick: () => toggleExpandedRow(id),
                                  children: /* @__PURE__ */ jsx(Icon, { name: expanded ? "chevron-up-small" : "chevron-down-small", size: 16, "aria-hidden": "true" })
                                }
                              )
                            }
                          ),
                          selectable && /* @__PURE__ */ jsx(
                            "td",
                            {
                              "aria-colindex": selectionColumnIndex,
                              style: {
                                padding: pad,
                                width: 44,
                                borderBottom: "1px solid var(--color-semantic-line-solid-normal)",
                                ...utilityCellStyle({ offset: selectionOffset, background: selected ? "var(--color-semantic-primary-surface-normal)" : headerBackground })
                              },
                              children: /* @__PURE__ */ jsx(
                                SelectionCheckbox,
                                {
                                  checked: selected,
                                  disabled: !canSelect,
                                  onChange: () => toggleRow(id, canSelect),
                                  "aria-label": canSelect ? `${rowLabel} ${selected ? "\uC120\uD0DD \uD574\uC81C" : "\uC120\uD0DD"}` : `${rowLabel} \uC120\uD0DD\uD560 \uC218 \uC5C6\uC74C`
                                }
                              )
                            }
                          ),
                          visibleColumns.map((column) => {
                            const cellEditing = editingCell?.rowId === id && editingCell?.columnKey === column.key && typeof column.editor === "function";
                            const content = cellEditing ? column.editor(row, id) : typeof column.render === "function" ? column.render(row, id) : row[column.key];
                            return /* @__PURE__ */ jsx(
                              "td",
                              {
                                "aria-colindex": column.logicalIndex,
                                "data-column-key": column.key,
                                "data-editing": cellEditing || void 0,
                                "data-pinned": column.pinSide || void 0,
                                style: {
                                  ...tdStyle(pad),
                                  textAlign: column.align || "left",
                                  ...columnPositionStyle(column, { selected })
                                },
                                children: content
                              },
                              column.key
                            );
                          })
                        ]
                      }
                    ),
                    expanded && /* @__PURE__ */ jsx("tr", { "data-expanded-row-for": String(id), children: /* @__PURE__ */ jsx("td", { colSpan, style: { padding: 0, borderBottom: "1px solid var(--color-semantic-line-solid-normal)", background: "var(--color-semantic-background-elevated-normal)" }, children: /* @__PURE__ */ jsx("div", { id: detailId, role: "region", "aria-label": `${rowLabel} \uC138\uBD80 \uC815\uBCF4`, style: { padding: size === "sm" ? "var(--space-3) var(--space-4)" : "var(--space-4)" }, children: renderExpandedRow(row, id) }) }) })
                  ] }, id);
                })
              ] })
            ]
          }
        )
      ]
    }
  );
}

export {
  DataGrid
};
//# sourceMappingURL=chunk-MJ2QJDIR.js.map