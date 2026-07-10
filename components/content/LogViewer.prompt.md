**LogViewer** — 레벨 색상 로그·콘솔 스트림(필터 + tail 자동 스크롤). `Code`의 정적 코드 블록 보완재인 Content component입니다.

```jsx
<LogViewer lines={[{ time: '10:42', level: 'error', source: 'nav', text: '...' }]} />
```

- **lines** `{time,level,source,text}[]` (level `debug·info·warn·error`) · **filter/search/tools/copyable** · **autoScroll** · **height** · **density** `compact|comfortable` · **wrap** · **virtualized/overscan** · **initialQuery** · **onClear/onCopyLine**.
- Compare against common log viewer expectations before changing it: level filters, search, tail pause/resume, latest jump, clear visible logs, per-line copy, empty/search-empty states, fixed-height scrolling, and large-list rendering.
- Layer: LDS Product extension. Local WDS `.fig` inspection did not find an exact Log Viewer component set; align it with content/code/list conventions without claiming WDS variant parity.
- Keep it as a presentational stream viewer. Do not open ROS/websocket connections, own log retention policy, or implement command execution here; feed lines and handlers from the product shell.
- Accessibility expectations: `role="log"`, `aria-live` follows paused/tailing state, toolbar buttons have text labels, filter chips expose pressed state, and virtualization must preserve readable row content.
