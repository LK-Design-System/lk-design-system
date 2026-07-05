**Stepper** — 소량 수량용 숫자 +/− 컨트롤(도입 대수, 수량). 쿨 그레이 아이콘 버튼이 tabular 값을 양옆에서 감싸고, `[min, max]`로 클램프하며 도달한 끝을 비활성화합니다.

```jsx
<Stepper defaultValue={1} min={0} max={9} onChange={setQty} />
<Stepper value={qty} min={0} onChange={setQty} size="sm" />
```

- **value / defaultValue / onChange** — 제어/비제어. **min / max / step**은 범위와 증가폭을 정합니다.
- **size** `sm|md`. 값은 `tabular-nums`로 렌더돼 떨리지 않습니다. 자유 숫자 입력에는 `Input type="number"`를 쓰세요.
