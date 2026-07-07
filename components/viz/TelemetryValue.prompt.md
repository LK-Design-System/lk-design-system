**TelemetryValue** — 값, 단위, freshness, timestamp를 함께 표시하는 compact telemetry readout.

```jsx
<TelemetryValue
  label="RSSI"
  value="-71"
  unit="dBm"
  tone="cautionary"
  timestamp="10:42:18 KST"
/>
```

- stale 값에는 `stale`을 주어 현재값처럼 보이지 않게 합니다.
- 큰 원형 지표는 `TelemetryGauge`, 행/테이블 셀/밀도 높은 패널 안의 작은 수치는 `TelemetryValue`를 쓰세요.
- 테이블에서는 한 컬럼에 하나의 데이터 속성만 담습니다. 값 컬럼에는 값과 단위만 두고, timestamp/freshness/status는 별도 컬럼으로 분리하세요. stale 색만 필요하고 상태 컬럼이 따로 있으면 `showStaleBadge={false}`를 사용하세요.
