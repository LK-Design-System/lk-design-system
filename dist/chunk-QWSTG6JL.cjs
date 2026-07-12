"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }"use client";


var _chunkVGM7HVYYcjs = require('./chunk-VGM7HVYY.cjs');

// components/data/Tree.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
function visibleItems(tree) {
  return Array.from(_nullishCoalesce(_optionalChain([tree, 'optionalAccess', _ => _.querySelectorAll, 'call', _2 => _2('[role="treeitem"]')]), () => ( [])));
}
function focusItem(tree, item, setFocusKey) {
  if (!item) return;
  setFocusKey(item.dataset.treeKey);
  item.focus();
}
function TreeNode({
  node,
  level,
  parentKey,
  expandedSet,
  previewSet,
  setPreviewKey,
  toggle,
  onSelect,
  openOnHover,
  treeRef,
  focusKey,
  setFocusKey
}) {
  const key = String(node.id != null ? node.id : node.label);
  const has = Boolean(_optionalChain([node, 'access', _3 => _3.children, 'optionalAccess', _4 => _4.length]));
  const open = has && (expandedSet.has(key) || previewSet.has(key));
  const [hovered, setHovered] = _react2.default.useState(false);
  const [focused, setFocused] = _react2.default.useState(false);
  const activate = () => {
    setFocusKey(key);
    if (has) toggle(key);
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
      if (parentKey != null) target = items.find((item) => item.dataset.treeKey === String(parentKey));
    }
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      activate();
      return;
    }
    if (target) {
      event.preventDefault();
      focusItem(treeRef.current, target, setFocusKey);
    }
  };
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, 
    "div",
    {
      role: "treeitem",
      "aria-expanded": has ? open : void 0,
      "aria-level": level + 1,
      tabIndex: focusKey === key ? 0 : -1,
      "data-tree-key": key,
      "data-parent-key": parentKey == null ? void 0 : String(parentKey),
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
              border: "1px solid transparent",
              background: hovered ? "var(--color-semantic-background-normal-alternative)" : "transparent",
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
            level: level + 1,
            parentKey: key,
            expandedSet,
            previewSet,
            setPreviewKey,
            toggle,
            onSelect,
            openOnHover,
            treeRef,
            focusKey,
            setFocusKey
          },
          _nullishCoalesce(child.id, () => ( `${key}-${index}`))
        )) })
      ]
    }
  );
}
function Tree({ nodes = [], defaultExpanded = [], onSelect, openOnHover = false, ariaLabel = "Hierarchy", style, ...rest }) {
  const [expanded, setExpanded] = _react2.default.useState(() => new Set(defaultExpanded.map(String)));
  const [preview, setPreview] = _react2.default.useState(() => /* @__PURE__ */ new Set());
  const [focusKey, setFocusKey] = _react2.default.useState(() => String(_nullishCoalesce(_nullishCoalesce(_optionalChain([nodes, 'access', _6 => _6[0], 'optionalAccess', _7 => _7.id]), () => ( _optionalChain([nodes, 'access', _8 => _8[0], 'optionalAccess', _9 => _9.label]))), () => ( ""))));
  const treeRef = _react2.default.useRef(null);
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
      setFocusKey(_nullishCoalesce(_optionalChain([items, 'access', _10 => _10[0], 'optionalAccess', _11 => _11.dataset, 'access', _12 => _12.treeKey]), () => ( "")));
    }
  }, [expanded, focusKey, nodes.length]);
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
          level: 0,
          parentKey: null,
          expandedSet: expanded,
          previewSet: preview,
          setPreviewKey,
          toggle,
          onSelect,
          openOnHover,
          treeRef,
          focusKey,
          setFocusKey
        },
        _nullishCoalesce(node.id, () => ( index))
      ))
    }
  );
}



exports.Tree = Tree;
//# sourceMappingURL=chunk-QWSTG6JL.cjs.map