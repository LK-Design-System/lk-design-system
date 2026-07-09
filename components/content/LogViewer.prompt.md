**LogViewer** — 레벨 색상 로그·콘솔 스트림(필터 + tail 자동 스크롤). Code의 스트리밍 보완재.

```jsx
<LogViewer lines={[{ time: '10:42', level: 'error', source: 'nav', text: '...' }]} />
```

- **lines** `{time,level,source,text}[]` (level `debug·info·warn·error`) · **filter** · **autoScroll** · **height**.
