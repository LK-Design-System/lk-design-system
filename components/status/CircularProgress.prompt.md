**CircularProgress** - circular progress indicator.

```jsx
<CircularProgress value={72} label="Report progress" showValue />
<CircularProgress indeterminate label="Processing" />
<CircularProgress value={4} max={5} tone="positive" size={40} />
```

- **value / max** define determinate progress.
- **indeterminate** renders an unknown-duration rotating arc and omits `aria-valuenow`.
- **size / thickness** control the ring geometry.
- **tone**: `signal`, `positive`, `cautionary`, or `negative`.
- **label / showValue** provide accessible and visible progress context.
- Motion respects `prefers-reduced-motion`. The rotating ring gets its animation from an inline style, so the injected `@media (prefers-reduced-motion: reduce)` rule declares `animation:none!important` — dropping `!important` silently disables the guard (WCAG 2.3.3). Same mechanism as `Skeleton`/`Spinner`.
- Indeterminate `aria-valuetext`는 `ProgressBar`와 같은 한국어 문구 `진행 중`입니다.
