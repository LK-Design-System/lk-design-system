"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }"use client";


var _chunkVUE3JCSZcjs = require('./chunk-VUE3JCSZ.cjs');


var _chunkSMSPAH2Mcjs = require('./chunk-SMSPAH2M.cjs');


var _chunkVHQHPPYQcjs = require('./chunk-VHQHPPYQ.cjs');

// components/data/AnnotatedImage.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
var ANNOTATION_TONE = {
  signal: "var(--color-semantic-primary-normal)",
  positive: "var(--color-semantic-status-positive)",
  cautionary: "var(--color-semantic-status-cautionary)",
  negative: "var(--color-semantic-status-negative)",
  // Compatibility aliases; prefer LDS status tone names above.
  warning: "var(--color-semantic-status-cautionary)",
  danger: "var(--color-semantic-status-negative)",
  neutral: "var(--color-semantic-label-neutral)"
};
function toneLabelColor(tone) {
  return tone === "neutral" ? "var(--color-semantic-inverse-label)" : "var(--color-semantic-static-black)";
}
function fraction(value) {
  return Math.max(0, Math.min(1, Number(value) || 0));
}
function percent(value) {
  return `${fraction(value) * 100}%`;
}
var REGION_LABEL_BAND_HEIGHT = 28;
function regionRect(region) {
  const left = fraction(region.x);
  const top = fraction(region.y);
  return { left, top, right: Math.min(1, left + fraction(region.width)), bottom: Math.min(1, top + fraction(region.height)) };
}
function rectsOverlap(a, b) {
  return a.left < b.right && b.left < a.right && a.top < b.bottom && b.top < a.bottom;
}
function regionLabelPlacement(region, index, regions, overlay, frameHeight) {
  if (!overlay.height || !frameHeight) return "outside-top";
  const band = REGION_LABEL_BAND_HEIGHT / overlay.height;
  const rect = regionRect(region);
  const others = regions.filter((_, i) => i !== index).map(regionRect);
  if (overlay.top + rect.top * overlay.height < REGION_LABEL_BAND_HEIGHT) return "inside-top";
  const topStrip = { left: rect.left, right: rect.right, top: rect.top - band, bottom: rect.top };
  if (!others.some((other) => rectsOverlap(topStrip, other))) return "outside-top";
  const bottomStrip = { left: rect.left, right: rect.right, top: rect.bottom, bottom: rect.bottom + band };
  if (overlay.top + rect.bottom * overlay.height + REGION_LABEL_BAND_HEIGHT <= frameHeight && !others.some((other) => rectsOverlap(bottomStrip, other))) return "outside-bottom";
  return "inside-top";
}
var REGION_LABEL_POSITION = {
  // The tag sits flush against the box outline, detection-tool style: sharing the box's fill
  // color and touching its stroke is what visually binds the label to its region.
  "outside-top": { left: "calc(-1 * var(--border-thick))", bottom: "calc(100% + var(--border-thick))", borderRadius: "var(--radius-xs) var(--radius-xs) 0 0" },
  "outside-bottom": { left: "calc(-1 * var(--border-thick))", top: "calc(100% + var(--border-thick))", borderRadius: "0 0 var(--radius-xs) var(--radius-xs)" },
  "inside-top": { left: 0, top: 0, borderRadius: "0 0 var(--radius-xs) 0" }
};
function imageContentBox(frame, image, objectFit) {
  if (!frame.width || !frame.height || !image.width || !image.height) {
    return { left: 0, top: 0, width: frame.width, height: frame.height };
  }
  if (objectFit === "fill") return { left: 0, top: 0, width: frame.width, height: frame.height };
  const containScale = Math.min(frame.width / image.width, frame.height / image.height);
  const scale = objectFit === "cover" ? Math.max(frame.width / image.width, frame.height / image.height) : objectFit === "none" ? 1 : objectFit === "scale-down" ? Math.min(1, containScale) : containScale;
  const width = image.width * scale;
  const height = image.height * scale;
  return { left: (frame.width - width) / 2, top: (frame.height - height) / 2, width, height };
}
function annotationLabel(annotation, fallback) {
  return _nullishCoalesce(annotation.label, () => ( fallback));
}
function pointLabelPosition(point) {
  const x = Math.max(0, Math.min(1, Number(point.x) || 0));
  const y = Math.max(0, Math.min(1, Number(point.y) || 0));
  const horizontal = x > 0.65 ? { right: "calc(100% + var(--space-1))" } : { left: "calc(100% + var(--space-1))" };
  if (y < 0.12) return { ...horizontal, top: "100%", marginTop: "var(--space-1)" };
  if (y > 0.88) return { ...horizontal, bottom: "100%", marginBottom: "var(--space-1)" };
  return { ...horizontal, top: "50%", transform: "translateY(-50%)" };
}
function AnnotatedImage({
  src,
  alt,
  caption,
  regions = [],
  points = [],
  annotationsVisible,
  defaultAnnotationsVisible = true,
  onAnnotationsVisibleChange,
  loadingMessage = "\uC774\uBBF8\uC9C0\uB97C \uBD88\uB7EC\uC624\uB294 \uC911\uC785\uB2C8\uB2E4.",
  emptyMessage = "\uD45C\uC2DC\uD560 \uC774\uBBF8\uC9C0\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4.",
  errorMessage = "\uC774\uBBF8\uC9C0\uB97C \uBD88\uB7EC\uC624\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4. \uC7A0\uC2DC \uD6C4 \uB2E4\uC2DC \uC2DC\uB3C4\uD574 \uC8FC\uC138\uC694.",
  summaryLabel = "\uC774\uBBF8\uC9C0 \uC8FC\uC11D \uC694\uC57D",
  aspectRatio = "16 / 9",
  objectFit = "contain",
  labelDisplay = "auto",
  style,
  ...rest
}) {
  const controlled = annotationsVisible !== void 0;
  const [internalVisible, setInternalVisible] = _react2.default.useState(defaultAnnotationsVisible);
  const visible = controlled ? annotationsVisible : internalVisible;
  const [imageState, setImageState] = _react2.default.useState(src ? "loading" : "empty");
  const [imageSize, setImageSize] = _react2.default.useState({ width: 0, height: 0 });
  const [frameSize, setFrameSize] = _react2.default.useState({ width: 0, height: 0 });
  const frameRef = _react2.default.useRef(null);
  const overlayId = _react2.default.useId();
  const detailsId = _react2.default.useId();
  const annotations = regions.length + points.length;
  const overlayBox = imageContentBox(frameSize, imageSize, objectFit);
  _react2.default.useEffect(() => {
    setImageState(src ? "loading" : "empty");
    setImageSize({ width: 0, height: 0 });
  }, [src]);
  _react2.default.useLayoutEffect(() => {
    const frame = frameRef.current;
    if (!frame) return void 0;
    const measure = () => setFrameSize({ width: frame.clientWidth, height: frame.clientHeight });
    measure();
    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", measure);
      return () => window.removeEventListener("resize", measure);
    }
    const observer = new ResizeObserver(measure);
    observer.observe(frame);
    return () => observer.disconnect();
  }, [aspectRatio, src]);
  const setVisible = (next) => {
    if (!controlled) setInternalVisible(next);
    _optionalChain([onAnnotationsVisibleChange, 'optionalCall', _2 => _2(next)]);
  };
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
    "figure",
    {
      "data-label-display": labelDisplay,
      style: { display: "grid", gap: "var(--space-3)", width: "100%", minWidth: 0, margin: 0, boxSizing: "border-box", fontFamily: "var(--font-sans)", ...style },
      ...rest,
      children: [
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "style", { children: `.lk-annotated-image__point-label {
          display: inline-flex;
        }
        @container (max-width: 420px) {
          .lk-annotated-image__label-text[data-collapse="true"],
          .lk-annotated-image__point-label[data-collapse="true"] {
            display: none;
          }
        }` }),
        /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
          "div",
          {
            ref: frameRef,
            style: {
              position: "relative",
              width: "100%",
              minHeight: src ? void 0 : "12rem",
              aspectRatio: src ? aspectRatio : void 0,
              overflow: "hidden",
              border: "1px solid var(--color-semantic-line-normal-normal)",
              borderRadius: "var(--radius-lg)",
              background: "var(--color-semantic-inverse-background)",
              containerType: "inline-size"
            },
            children: [
              src && /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
                "img",
                {
                  src,
                  alt,
                  "aria-details": annotations > 0 ? detailsId : void 0,
                  onLoad: (event) => {
                    setImageSize({ width: event.currentTarget.naturalWidth, height: event.currentTarget.naturalHeight });
                    setImageState("loaded");
                  },
                  onError: () => setImageState("error"),
                  style: { display: "block", width: "100%", height: "100%", objectFit }
                }
              ),
              imageState !== "loaded" && /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
                "div",
                {
                  role: imageState === "error" ? "alert" : "status",
                  style: { position: "absolute", inset: 0, display: "grid", placeItems: "center", padding: "var(--space-6)", color: "var(--color-semantic-inverse-label-neutral-soft)", textAlign: "center", background: "var(--color-semantic-inverse-background)" },
                  children: imageState === "loading" ? loadingMessage : imageState === "error" ? errorMessage : emptyMessage
                }
              ),
              imageState === "loaded" && annotations > 0 && /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
                _chunkSMSPAH2Mcjs.ToggleIcon,
                {
                  size: "sm",
                  variant: "on-dark",
                  pressed: visible,
                  onChange: setVisible,
                  label: "\uC8FC\uC11D \uD45C\uC2DC",
                  title: visible ? "\uC8FC\uC11D \uC228\uAE30\uAE30" : "\uC8FC\uC11D \uBCF4\uAE30",
                  "aria-controls": overlayId,
                  style: { position: "absolute", zIndex: 2, top: "var(--space-3)", right: "var(--space-3)", boxShadow: "var(--shadow-md)" },
                  children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkVHQHPPYQcjs.Icon, { name: visible ? "eye" : "eye-slash", size: 16, "aria-hidden": "true" })
                }
              ),
              imageState === "loaded" && annotations > 0 && /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
                "div",
                {
                  id: overlayId,
                  "aria-hidden": "true",
                  hidden: !visible,
                  style: { position: "absolute", left: overlayBox.left, top: overlayBox.top, width: overlayBox.width, height: overlayBox.height, pointerEvents: "none" },
                  children: [
                    regions.map((region, index) => {
                      const color = _nullishCoalesce(ANNOTATION_TONE[region.tone], () => ( ANNOTATION_TONE.signal));
                      const label = annotationLabel(region, `\uC601\uC5ED ${index + 1}`);
                      const marker = index + 1;
                      const placement = regionLabelPlacement(region, index, regions, overlayBox, frameSize.height);
                      return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { style: { position: "absolute", left: percent(region.x), top: percent(region.y), width: percent(region.width), height: percent(region.height), boxSizing: "border-box", border: `var(--border-thick) solid ${color}`, borderRadius: "var(--radius-xs)" }, children: /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "span", { style: { position: "absolute", ...REGION_LABEL_POSITION[placement], display: "inline-flex", alignItems: "center", gap: "var(--space-1)", maxWidth: placement === "inside-top" ? "min(12.5rem, 100%)" : "12.5rem", padding: "var(--space-1) var(--space-2)", overflow: "hidden", boxSizing: "border-box", background: color, color: toneLabelColor(_nullishCoalesce(region.tone, () => ( "signal"))), fontSize: "var(--caption1-size)", lineHeight: "var(--caption1-line)", fontWeight: "var(--fw-bold)" }, children: [
                        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { style: { flexShrink: 0, fontVariantNumeric: "tabular-nums" }, children: marker }),
                        /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
                          "span",
                          {
                            className: "lk-annotated-image__label-text",
                            "data-collapse": labelDisplay === "auto" ? "true" : void 0,
                            style: { display: labelDisplay === "index" ? "none" : void 0, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
                            children: [
                              label,
                              region.score != null ? ` ${Math.round(region.score * 100)}%` : ""
                            ]
                          }
                        )
                      ] }) }, _nullishCoalesce(region.id, () => ( index)));
                    }),
                    points.map((point, index) => {
                      const color = _nullishCoalesce(ANNOTATION_TONE[point.tone], () => ( ANNOTATION_TONE.cautionary));
                      const marker = regions.length + index + 1;
                      const pointText = annotationLabel(point, point.value != null ? /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _jsxruntime.Fragment, { children: [
                        point.value,
                        point.unit
                      ] }) : `\uC9C0\uC810 ${index + 1}`);
                      return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "span", { style: { position: "absolute", left: percent(point.x), top: percent(point.y), width: percent((_nullishCoalesce(point.radius, () => ( 0.03))) * 2), minWidth: 18, aspectRatio: "1", transform: "translate(-50%, -50%)", display: "grid", placeItems: "center", border: `var(--border-thick) solid ${color}`, borderRadius: "50%", background: "color-mix(in srgb, var(--color-semantic-inverse-background) 82%, transparent)", color: "var(--color-semantic-inverse-label)", fontSize: "var(--caption2-size)", lineHeight: 1, fontWeight: "var(--fw-bold)", fontVariantNumeric: "tabular-nums" }, children: [
                        marker,
                        labelDisplay !== "index" && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { className: "lk-annotated-image__point-label", "data-collapse": labelDisplay === "auto" ? "true" : void 0, style: { position: "absolute", ...pointLabelPosition(point), alignItems: "center", maxWidth: "10rem", padding: "var(--space-1) var(--space-2)", overflow: "hidden", borderRadius: "var(--radius-xs)", background: color, color: toneLabelColor(_nullishCoalesce(point.tone, () => ( "cautionary"))), fontSize: "var(--caption1-size)", lineHeight: "var(--caption1-line)", fontWeight: "var(--fw-bold)" }, children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { style: { minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: pointText }) })
                      ] }, _nullishCoalesce(point.id, () => ( index)));
                    })
                  ]
                }
              )
            ]
          }
        ),
        (caption != null || annotations > 0) && /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "figcaption", { style: { display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "var(--space-2) var(--space-3)", flexWrap: "wrap", color: "var(--color-semantic-label-neutral)", fontSize: "var(--caption1-size)", lineHeight: "var(--caption1-line)" }, children: [
          caption != null && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { children: caption }),
          annotations > 0 && /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
            _chunkVUE3JCSZcjs.Collapsible,
            {
              id: detailsId,
              "data-annotation-summary": "",
              density: "compact",
              align: "end",
              title: `${summaryLabel} (${annotations})`,
              style: { flex: "0 1 auto", maxWidth: "100%", minWidth: 0, marginLeft: "auto" },
              children: /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "ol", { style: { margin: 0, paddingLeft: "var(--space-5)", color: "var(--color-semantic-label-neutral)", fontSize: "var(--caption1-size)", lineHeight: "var(--caption1-line)" }, children: [
                regions.map((region, index) => /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "li", { children: [
                  "\uC601\uC5ED \xB7 ",
                  annotationLabel(region, `\uC601\uC5ED ${index + 1}`),
                  region.score != null ? `, \uC2E0\uB8B0\uB3C4 ${Math.round(region.score * 100)}%` : ""
                ] }, _nullishCoalesce(region.id, () => ( index)))),
                points.map((point, index) => /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "li", { children: [
                  "\uC9C0\uC810 \xB7 ",
                  annotationLabel(point, `\uC9C0\uC810 ${index + 1}`),
                  point.value != null && /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _jsxruntime.Fragment, { children: [
                    ", ",
                    point.value,
                    point.unit
                  ] })
                ] }, _nullishCoalesce(point.id, () => ( index))))
              ] })
            }
          )
        ] })
      ]
    }
  );
}



exports.AnnotatedImage = AnnotatedImage;
//# sourceMappingURL=chunk-QS5KKQDS.cjs.map