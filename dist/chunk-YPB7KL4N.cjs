"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }"use client";

// components/content/Prose.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
var MONO = 'var(--font-mono, ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace)';
var PROSE_CSS = `
.lk-prose{color:var(--color-semantic-label-neutral);font-family:var(--font-sans);line-height:var(--label1-reading-line);letter-spacing:var(--label1-spacing);word-break:keep-all;overflow-wrap:anywhere;}
.lk-prose > :first-child{margin-top:0;}
.lk-prose > :last-child{margin-bottom:0;}
.lk-prose p{margin:var(--space-4) 0;font-size:var(--label1-size);}
.lk-prose h1,.lk-prose h2,.lk-prose h3,.lk-prose h4,.lk-prose h5,.lk-prose h6{color:var(--color-semantic-label-strong);font-weight:var(--fw-extra);letter-spacing:0;margin:var(--space-8) 0 var(--space-4);line-height:1.3;}
.lk-prose h1{font-size:var(--heading1-size);}
.lk-prose h2{font-size:var(--heading2-size);}
.lk-prose h3{font-size:var(--headline1-size);}
.lk-prose h4{font-size:var(--headline2-size);}
.lk-prose h5,.lk-prose h6{font-size:var(--body1-size);font-weight:var(--fw-bold);}
.lk-prose ul,.lk-prose ol{margin:var(--space-4) 0;padding-inline-start:var(--space-5);font-size:var(--label1-size);}
.lk-prose li{margin:var(--space-2) 0;}
.lk-prose li > ul,.lk-prose li > ol{margin:var(--space-2) 0;}
.lk-prose a{color:var(--color-semantic-primary-normal);text-underline-offset:2px;}
.lk-prose strong{font-weight:var(--fw-bold);color:var(--color-semantic-label-strong);}
.lk-prose em{font-style:italic;}
.lk-prose del{text-decoration:line-through;color:var(--color-semantic-label-alternative);}
.lk-prose code{padding:2px 6px;background:var(--color-semantic-fill-strong);color:var(--color-semantic-label-normal);border-radius:var(--radius-sm);font-family:${MONO};font-size:0.9em;overflow-wrap:anywhere;}
.lk-prose pre{margin:var(--space-4) 0;padding:var(--space-4);background:var(--color-semantic-inverse-background);color:var(--color-semantic-inverse-label);border-radius:var(--radius-lg);overflow-x:auto;font-family:${MONO};font-size:var(--label2-size);line-height:1.6;}
.lk-prose pre code{padding:0;background:transparent;color:inherit;border-radius:0;font-size:1em;}
.lk-prose blockquote{margin:var(--space-4) 0;padding:var(--space-3) var(--space-4);background:var(--color-semantic-fill-alternative);border-radius:var(--radius-sm);color:var(--color-semantic-label-normal);}
.lk-prose hr{margin:var(--space-8) 0;border:0;border-top:1px solid var(--color-semantic-line-normal-normal);}
.lk-prose img{max-width:100%;height:auto;border-radius:var(--radius-md);}
.lk-prose table{width:100%;margin:var(--space-4) 0;border-collapse:collapse;font-size:var(--label2-size);}
.lk-prose th,.lk-prose td{padding:var(--space-2) var(--space-3);border:1px solid var(--color-semantic-line-normal-normal);text-align:start;}
.lk-prose th{background:var(--color-semantic-fill-normal);font-weight:var(--fw-bold);color:var(--color-semantic-label-strong);}
.lk-prose ul.contains-task-list,.lk-prose li.task-list-item{list-style:none;}
.lk-prose li.task-list-item{padding-inline-start:0;}
`;
var useSafeLayoutEffect = typeof window === "undefined" ? _react2.default.useEffect : _react2.default.useLayoutEffect;
function useProseStyles() {
  useSafeLayoutEffect(() => {
    if (typeof document === "undefined" || document.getElementById("lk-prose-css")) return;
    const el = document.createElement("style");
    el.id = "lk-prose-css";
    el.textContent = PROSE_CSS;
    document.head.appendChild(el);
  }, []);
}
function Prose({ children, measure = "68ch", style, className, ...rest }) {
  useProseStyles();
  const root = _react2.default.useRef(null);
  _react2.default.useEffect(() => {
    const element = root.current;
    if (!element || typeof ResizeObserver === "undefined") return void 0;
    const update = () => {
      for (const block of element.querySelectorAll("pre")) {
        const scrolls = block.scrollWidth > block.clientWidth + 1;
        if (scrolls) block.setAttribute("tabindex", "0");
        else if (block.getAttribute("tabindex") === "0") block.removeAttribute("tabindex");
      }
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(element);
    return () => observer.disconnect();
  }, [children]);
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
    "div",
    {
      ref: root,
      className: className ? `lk-prose ${className}` : "lk-prose",
      style: { maxWidth: measure, minWidth: 0, ...style },
      ...rest,
      children
    }
  );
}



exports.Prose = Prose;
//# sourceMappingURL=chunk-YPB7KL4N.cjs.map