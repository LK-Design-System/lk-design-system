**ConnectionBadge** — 연결 상태(신호 막대 + 라벨). MQTT / rosbridge 연결 표시에 씁니다.

```jsx
<ConnectionBadge status="online" />
<ConnectionBadge status="reconnecting" size="sm" />
<ConnectionBadge status="offline" label="연결 끊김" />
```

- **status** `online · reconnecting · weak · offline` · **label**(기본 한국어) · **showLabel** · **size** `sm · md`. reconnecting은 자동으로 깜빡입니다.
