"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }"use client";


var _chunkVGM7HVYYcjs = require('./chunk-VGM7HVYY.cjs');

// components/data/Tree.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
function visibleItems(tree) {
  return Array.from(_nullishCoalesce(_optionalChain([tree, 'optionalAccess', _ => _.querySelectorAll, 'call', _2 => _2('[role="treeitem"]')]), () => ( [])));
}
function focusTreeItem(item, setFocusKey) {
  if (!item) return;
  setFocusKey(item.dataset.treeKey);
  item.focus();
}
function nodeId(node) {
  return node.id == null ? null : String(node.id);
}
function internalNodeKey(node, path) {
  const id = nodeId(node);
  return id == null ? `path:${path.join(".")}` : `id:${id}`;
}
function legacyExpansionValue(node) {
  const id = nodeId(node);
  if (id != null) return id;
  if (typeof node.label === "string" || typeof node.label === "number") return String(node.label);
  return null;
}
function initialExpandedKeys(nodes, defaultExpanded) {
  const requested = new Set(defaultExpanded.map(String));
  const keys = [];
  const visit = (items, parentPath = []) => {
    for (const [index, node] of items.entries()) {
      const path = [...parentPath, index];
      const focusKey = internalNodeKey(node, path);
      const legacyValue = legacyExpansionValue(node);
      if (legacyValue != null && requested.has(legacyValue)) keys.push(focusKey);
      visit(_nullishCoalesce(node.children, () => ( [])), path);
    }
  };
  visit(nodes);
  return keys;
}
function assertUniqueNodeIds(nodes, seen = /* @__PURE__ */ new Set()) {
  for (const node of nodes) {
    const id = nodeId(node);
    if (id != null) {
      if (seen.has(id)) {
        throw new Error(`Tree node IDs must be unique. Duplicate ID: "${id}".`);
      }
      seen.add(id);
    }
    assertUniqueNodeIds(_nullishCoalesce(node.children, () => ( [])), seen);
  }
}
function findNodePath(nodes, targetId, ancestors = [], parentPath = []) {
  for (const [index, node] of nodes.entries()) {
    const path = [...parentPath, index];
    const focusKey = internalNodeKey(node, path);
    if (nodeId(node) === targetId) return { focusKey, ancestors };
    const childPath = findNodePath(
      _nullishCoalesce(node.children, () => ( [])),
      targetId,
      [...ancestors, focusKey],
      path
    );
    if (childPath) return childPath;
  }
  return null;
}
function TreeNode({
  node,
  path,
  level,
  parentFocusKey,
  expandedSet,
  previewSet,
  setPreviewKey,
  toggle,
  onSelect,
  selectedKey,
  select,
  openOnHover,
  treeRef,
  focusKey,
  setFocusKey
}) {
  const key = internalNodeKey(node, path);
  const id = nodeId(node);
  const has = Boolean(_optionalChain([node, 'access', _3 => _3.children, 'optionalAccess', _4 => _4.length]));
  const open = has && (expandedSet.has(key) || previewSet.has(key));
  const [hovered, setHovered] = _react2.default.useState(false);
  const [focused, setFocused] = _react2.default.useState(false);
  const selected = id != null && selectedKey === id;
  const activate = () => {
    setFocusKey(key);
    if (has) toggle(key);
    if (id != null) select(id);
    _optionalChain([onSelect, 'optionalCall', _5 => _5(node)]);
  };
  const onKeyDown = (event) => {
    event.stopPropagation();
    const items = visibleItems(treeRef.current);
    const currentIndex = items.indexOf(event.currentTarget);
    if (currentIndex < 0) return;
    let target;
    if (event.key === "ArrowDown") target = items[currentIndex + 1];
    if (event.key === "ArrowUp") target = items[currentIndex - 1];
    if (event.key === "Home") target = items[0];
    if (event.key === "End") target = items.at(-1);
    if (event.key === "ArrowRight") {
      if (has && !open) {
        event.preventDefault();
        toggle(key);
        return;
      }
      if (has && open) target = items[currentIndex + 1];
    }
    if (event.key === "ArrowLeft") {
      if (has && open) {
        event.preventDefault();
        toggle(key);
        return;
      }
      if (parentFocusKey != null) target = items.find((item) => item.dataset.treeKey === parentFocusKey);
    }
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      activate();
      return;
    }
    if (target) {
      event.preventDefault();
      focusTreeItem(target, setFocusKey);
    }
  };
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, 
    "div",
    {
      role: "treeitem",
      "aria-expanded": has ? open : void 0,
      "aria-selected": selected,
      "aria-level": level + 1,
      tabIndex: focusKey === key ? 0 : -1,
      "data-tree-key": key,
      "data-tree-id": _nullishCoalesce(id, () => ( void 0)),
      "data-parent-key": _nullishCoalesce(parentFocusKey, () => ( void 0)),
      onClick: (event) => {
        event.stopPropagation();
        activate();
      },
      onKeyDown,
      onFocus: (event) => {
        if (event.target === event.currentTarget) {
          setFocused(true);
          setFocusKey(key);
          if (openOnHover && has) setPreviewKey(key, true);
        }
      },
      onBlur: (event) => {
        if (event.target === event.currentTarget) setFocused(false);
        if (openOnHover && has && !event.currentTarget.contains(event.relatedTarget)) setPreviewKey(key, false);
      },
      onMouseEnter: () => {
        setHovered(true);
        if (openOnHover && has) setPreviewKey(key, true);
      },
      onMouseLeave: () => {
        setHovered(false);
        if (openOnHover && has) setPreviewKey(key, false);
      },
      style: { outline: "none" },
      children: [
        /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, 
          "div",
          {
            style: {
              width: "100%",
              display: "flex",
              alignItems: "center",
              gap: 8,
              minHeight: 36,
              padding: "8px 10px",
              paddingLeft: 10 + level * 20,
              boxSizing: "border-box",
              border: selected ? "1px solid var(--color-semantic-primary-normal)" : "1px solid transparent",
              background: selected ? "var(--color-semantic-primary-surface-strong)" : hovered ? "var(--color-semantic-background-normal-alternative)" : "transparent",
              cursor: "pointer",
              borderRadius: "var(--radius-md)",
              textAlign: "left",
              fontFamily: "var(--font-sans)",
              fontSize: "var(--label1-size)",
              fontWeight: level === 0 ? "var(--fw-semibold)" : "var(--fw-medium)",
              color: level === 0 ? "var(--color-semantic-label-strong)" : "var(--color-semantic-label-normal)",
              boxShadow: focused ? "inset 0 0 0 2px var(--color-semantic-focus-indicator)" : "none",
              transition: "background var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out)"
            },
            children: [
              has ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkVGM7HVYYcjs.Icon, { name: "chevron-right-small", size: 14, color: "var(--color-semantic-label-alternative)", "aria-hidden": "true", style: { transform: open ? "rotate(90deg)" : "none", transition: "transform var(--dur-fast) var(--ease-out)", flexShrink: 0 } }) : /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { "aria-hidden": "true", style: { width: 14, flexShrink: 0 } }),
              node.icon,
              /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { children: node.label })
            ]
          }
        ),
        has && open && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { role: "group", children: node.children.map((child, index) => /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
          TreeNode,
          {
            node: child,
            path: [...path, index],
            level: level + 1,
            parentFocusKey: key,
            expandedSet,
            previewSet,
            setPreviewKey,
            toggle,
            onSelect,
            selectedKey,
            select,
            openOnHover,
            treeRef,
            focusKey,
            setFocusKey
          },
          internalNodeKey(child, [...path, index])
        )) })
      ]
    }
  );
}
var Tree = _react2.default.forwardRef(function Tree2({
  nodes = [],
  defaultExpanded = [],
  selectedId,
  defaultSelectedId,
  onSelectedIdChange,
  onSelect,
  openOnHover = false,
  ariaLabel = "Hierarchy",
  style,
  ...rest
}, forwardedRef) {
  assertUniqueNodeIds(nodes);
  const [expanded, setExpanded] = _react2.default.useState(() => new Set(initialExpandedKeys(nodes, defaultExpanded)));
  const [preview, setPreview] = _react2.default.useState(() => /* @__PURE__ */ new Set());
  const [focusKey, setFocusKey] = _react2.default.useState(() => nodes.length ? internalNodeKey(nodes[0], [0]) : "");
  const [internalSelectedKey, setInternalSelectedKey] = _react2.default.useState(() => defaultSelectedId == null ? null : String(defaultSelectedId));
  const [pendingFocusKey, setPendingFocusKey] = _react2.default.useState(null);
  const treeRef = _react2.default.useRef(null);
  const isSelectionControlled = selectedId !== void 0;
  const selectedKey = isSelectionControlled ? selectedId == null ? null : String(selectedId) : internalSelectedKey;
  const select = _react2.default.useCallback((key) => {
    if (!isSelectionControlled) setInternalSelectedKey(key);
    _optionalChain([onSelectedIdChange, 'optionalCall', _6 => _6(key)]);
  }, [isSelectionControlled, onSelectedIdChange]);
  const toggle = (key) => setExpanded((previous) => {
    const next = new Set(previous);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    return next;
  });
  const setPreviewKey = (key, active) => setPreview((previous) => {
    const next = new Set(previous);
    if (active) next.add(key);
    else next.delete(key);
    return next;
  });
  _react2.default.useEffect(() => {
    if (!nodes.length) return;
    const items = visibleItems(treeRef.current);
    if (!items.some((item) => item.dataset.treeKey === focusKey)) {
      setFocusKey(_nullishCoalesce(_optionalChain([items, 'access', _7 => _7[0], 'optionalAccess', _8 => _8.dataset, 'access', _9 => _9.treeKey]), () => ( "")));
    }
  }, [expanded, focusKey, nodes]);
  _react2.default.useEffect(() => {
    if (pendingFocusKey == null) return;
    setPendingFocusKey(null);
    const item = visibleItems(treeRef.current).find((candidate) => candidate.dataset.treeKey === pendingFocusKey);
    focusTreeItem(item, setFocusKey);
  }, [expanded, nodes, pendingFocusKey]);
  _react2.default.useImperativeHandle(forwardedRef, () => ({
    focusItem(id, { reveal = false } = {}) {
      setPendingFocusKey(null);
      const targetId = String(id);
      const path = findNodePath(nodes, targetId);
      if (!path) return;
      if (reveal) {
        setExpanded((previous) => /* @__PURE__ */ new Set([...previous, ...path.ancestors]));
        setPendingFocusKey(path.focusKey);
        return;
      }
      const visibleItem = visibleItems(treeRef.current).find((candidate) => candidate.dataset.treeKey === path.focusKey);
      focusTreeItem(visibleItem, setFocusKey);
    }
  }), [nodes]);
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
    "div",
    {
      ref: treeRef,
      role: "tree",
      "aria-label": ariaLabel,
      style: { display: "grid", gap: 2, fontFamily: "var(--font-sans)", ...style },
      ...rest,
      children: nodes.map((node, index) => /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
        TreeNode,
        {
          node,
          path: [index],
          level: 0,
          parentFocusKey: null,
          expandedSet: expanded,
          previewSet: preview,
          setPreviewKey,
          toggle,
          onSelect,
          selectedKey,
          select,
          openOnHover,
          treeRef,
          focusKey,
          setFocusKey
        },
        internalNodeKey(node, [index])
      ))
    }
  );
});



exports.Tree = Tree;
//# sourceMappingURL=chunk-STN4VWJ7.cjs.map