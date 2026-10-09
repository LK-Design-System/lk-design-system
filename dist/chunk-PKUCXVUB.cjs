"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }"use client";


var _chunkTAUPYJRFcjs = require('./chunk-TAUPYJRF.cjs');


var _chunk3UKT3QUIcjs = require('./chunk-3UKT3QUI.cjs');


var _chunkCRYFD2LAcjs = require('./chunk-CRYFD2LA.cjs');


var _chunkXLRNY734cjs = require('./chunk-XLRNY734.cjs');


var _chunkOAQNNGUQcjs = require('./chunk-OAQNNGUQ.cjs');


var _chunkLRPJVRUDcjs = require('./chunk-LRPJVRUD.cjs');


var _chunk7OXVB7WXcjs = require('./chunk-7OXVB7WX.cjs');

// components/communication/ConversationList.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
var CONVERSATION_LIST_STYLES = `
  .lk-conversation-list__row{position:relative;display:flex;align-items:center;gap:var(--space-1);min-height:var(--component-conversation-list-row-height);padding-inline-end:var(--space-1);border-radius:var(--radius-lg);background:transparent;transition:background var(--dur-fast) var(--ease-out)}
  .lk-conversation-list__row:hover{background:var(--component-conversation-list-hover-surface)}
  .lk-conversation-list__row[data-current="true"]{background:var(--component-conversation-list-active-surface)}
  .lk-conversation-list__row[data-current="true"]:hover{background:var(--component-conversation-list-active-hover-surface)}
  .lk-conversation-list__row:has(.lk-conversation-list__link:active){background:var(--component-conversation-list-pressed-surface)}
  .lk-conversation-list__link{flex:1 1 auto;min-width:0;align-self:stretch;display:flex;align-items:center;padding:0 var(--space-2);border-radius:var(--radius-lg);color:var(--component-conversation-list-muted-foreground);font-family:var(--font-sans);font-size:var(--label1-size);line-height:var(--label1-line);font-weight:var(--fw-medium);text-decoration:none;transition:color var(--dur-fast) var(--ease-out)}
  .lk-conversation-list__row:hover .lk-conversation-list__link{color:var(--component-conversation-list-hover-foreground)}
  .lk-conversation-list__row[data-current="true"] .lk-conversation-list__link{color:var(--component-conversation-list-foreground);font-weight:var(--fw-bold)}
  .lk-conversation-list__link:focus-visible{outline-color:var(--component-conversation-list-focus-indicator)!important;outline-offset:-2px!important}
  .lk-conversation-list__title{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
  .lk-conversation-list__action{position:absolute;inset-inline-end:var(--space-1);flex-shrink:0;opacity:0;pointer-events:none;transition:opacity var(--dur-fast) var(--ease-out)}
  .lk-conversation-list__row:hover .lk-conversation-list__action,
  .lk-conversation-list__row:focus-within .lk-conversation-list__action,
  .lk-conversation-list__row[data-current="true"] .lk-conversation-list__action,
  .lk-conversation-list__action:has([aria-expanded="true"]){opacity:1;pointer-events:auto}
  .lk-conversation-list__row:has(.lk-conversation-list__action):hover .lk-conversation-list__link,
  .lk-conversation-list__row:has(.lk-conversation-list__action):focus-within .lk-conversation-list__link,
  .lk-conversation-list__row:has(.lk-conversation-list__action)[data-current="true"] .lk-conversation-list__link,
  .lk-conversation-list__row:has([aria-expanded="true"]) .lk-conversation-list__link{padding-inline-end:calc(var(--space-8) + var(--space-1))}
  @media(hover:none){.lk-conversation-list__action{opacity:1;pointer-events:auto}.lk-conversation-list__row:has(.lk-conversation-list__action) .lk-conversation-list__link{padding-inline-end:calc(var(--space-8) + var(--space-1))}}
  @media(forced-colors:active){.lk-conversation-list__row[data-current="true"] .lk-conversation-list__link{background:Highlight;color:HighlightText;background:SelectedItem;color:SelectedItemText}}
  @media(prefers-reduced-motion:reduce){.lk-conversation-list__row,.lk-conversation-list__link,.lk-conversation-list__action{transition:none!important}}
`;
var DEFAULT_ACTIONS = [];
function ConversationList({
  groups = [],
  currentId,
  renderLink,
  itemActions = DEFAULT_ACTIONS,
  onItemAction,
  moreLabel = (item) => `${item.title} \uB354 \uBCF4\uAE30`,
  headingLevel = 3,
  loading = false,
  error,
  onRetry,
  retryLabel = "\uB2E4\uC2DC \uC2DC\uB3C4",
  emptyLabel = "\uC544\uC9C1 \uB300\uD654\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4.",
  hasMore = false,
  onLoadMore,
  loadingMore = false,
  loadMoreLabel = "\uB354 \uBD88\uB7EC\uC624\uAE30",
  className,
  style,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  ...rest
}) {
  const panel = _react2.default.useContext(_chunkTAUPYJRFcjs.ShellPanelContext);
  const generatedId = _react2.default.useId().replace(/:/g, "");
  const labelledBy = ariaLabel ? void 0 : _nullishCoalesce(ariaLabelledBy, () => ( _optionalChain([panel, 'optionalAccess', _ => _.titleId])));
  const HeadingTag = `h${Math.min(6, Math.max(1, Number(headingLevel) || 3))}`;
  const itemCount = groups.reduce((total, group) => total + (_optionalChain([group, 'access', _2 => _2.items, 'optionalAccess', _3 => _3.length]) || 0), 0);
  let body;
  if (loading && itemCount === 0) {
    body = /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { "data-slot": "loading", "aria-busy": "true", style: { display: "grid", gap: "var(--space-2)", padding: "var(--space-2) var(--space-3)" }, children: [0, 1, 2, 3].map((index) => /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkXLRNY734cjs.Skeleton, { variant: "text", length: index % 2 ? "75%" : "100%" }, index)) });
  } else if (error != null && itemCount === 0) {
    body = /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
      _chunk3UKT3QUIcjs.ResourceState,
      {
        "data-slot": "error",
        state: "error",
        messageVariant: "embedded",
        headingLevel: Math.min(6, Number(headingLevel) || 3),
        description: error === true ? void 0 : error,
        action: onRetry ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkCRYFD2LAcjs.TextButton, { size: "sm", onClick: onRetry, children: retryLabel }) : void 0
      }
    );
  } else if (itemCount === 0) {
    body = /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "p", { "data-slot": "empty", style: { margin: 0, padding: "var(--space-2) var(--space-3)", color: "var(--component-conversation-list-muted-foreground)", fontSize: "var(--label1-size)", lineHeight: "var(--label1-line)" }, children: emptyLabel });
  } else {
    body = groups.filter((group) => _optionalChain([group, 'access', _4 => _4.items, 'optionalAccess', _5 => _5.length])).map((group) => {
      const headingId = `lk-conversation-group-${generatedId}-${group.id}`;
      return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "section", { "data-slot": "group", "aria-labelledby": headingId, style: { display: "grid", gridTemplateColumns: "minmax(0, 1fr)", gap: "var(--space-0-5)", minWidth: 0 }, children: [
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, HeadingTag, { id: headingId, "data-slot": "groupHeading", style: { margin: 0, padding: "var(--space-3) var(--space-3) var(--space-1)", fontSize: "var(--label2-size)", lineHeight: "var(--label2-line)", fontWeight: "var(--fw-medium)", letterSpacing: 0, color: "var(--component-conversation-list-group-foreground)" }, children: group.label }),
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "ul", { role: "list", style: { display: "grid", gridTemplateColumns: "minmax(0, 1fr)", gap: "var(--space-0-5)", margin: 0, padding: 0, listStyle: "none", minWidth: 0 }, children: group.items.map((item) => {
          const current = _nullishCoalesce(item.current, () => ( (currentId != null && item.id === currentId)));
          const linkProps = {
            className: "lk-conversation-list__link",
            "data-slot": "link",
            href: item.href,
            title: typeof item.title === "string" ? item.title : void 0,
            "aria-current": current ? "page" : void 0,
            onClick: item.onClick,
            children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { className: "lk-conversation-list__title", children: item.title })
          };
          const actions = typeof itemActions === "function" ? itemActions(item) : itemActions;
          return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "li", { className: "lk-conversation-list__row", "data-slot": "row", "data-current": current ? "true" : void 0, children: [
            renderLink ? renderLink(item, linkProps) : /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "a", { ...linkProps }),
            _optionalChain([actions, 'optionalAccess', _6 => _6.length]) > 0 && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { className: "lk-conversation-list__action", "data-slot": "rowAction", children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
              _chunkOAQNNGUQcjs.DropdownMenu,
              {
                align: "right",
                trigger: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkLRPJVRUDcjs.IconButton, { variant: "plain", size: "xs", round: false, label: moreLabel(item), children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunk7OXVB7WXcjs.Icon, { name: "more-horizontal", size: 16, "aria-hidden": "true" }) }),
                items: actions.map((action) => action.divider ? { divider: true } : {
                  label: action.label,
                  icon: action.icon,
                  danger: action.danger,
                  disabled: action.disabled,
                  onClick: () => _optionalChain([onItemAction, 'optionalCall', _7 => _7(action.id, item)])
                })
              }
            ) })
          ] }, item.id);
        }) })
      ] }, group.id);
    });
  }
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
    "nav",
    {
      "aria-label": ariaLabel,
      "aria-labelledby": labelledBy,
      "aria-busy": loading || loadingMore ? true : void 0,
      className: ["lk-conversation-list", className].filter(Boolean).join(" "),
      style: { display: "grid", gridTemplateColumns: "minmax(0, 1fr)", gap: "var(--space-1)", minWidth: 0, fontFamily: "var(--font-sans)", ...style },
      ...rest,
      children: [
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "style", { children: CONVERSATION_LIST_STYLES }),
        body,
        hasMore && itemCount > 0 && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { "data-slot": "loadMore", style: { padding: "var(--space-2) var(--space-3)" }, children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkCRYFD2LAcjs.TextButton, { size: "sm", onClick: onLoadMore, disabled: loadingMore, "aria-busy": loadingMore || void 0, children: loadMoreLabel }) })
      ]
    }
  );
}



exports.ConversationList = ConversationList;
//# sourceMappingURL=chunk-PKUCXVUB.cjs.map