**ConnectionBadge** — 연결 상태(신호 막대 + 라벨). MQTT / rosbridge 연결 표시에 씁니다.

```jsx
<ConnectionBadge status="online" />
<ConnectionBadge status="connecting" size="sm" />
<ConnectionBadge status="stale" label="마지막 수신 지연" />
<ConnectionBadge status="error" />
```

- **status** `connecting · online · reconnecting · weak · stale · error · offline` · **label**(기본 한국어) · **showLabel** · **size** `sm · md`.
- Badge는 간결한 현재 상태만 표시합니다. 마지막 수신 시각과 지연 설명은 `DescriptionList`, 재연결 액션은 `ActionArea`와 `Button`을 제품에서 조합합니다.
