**Slider** — 시그널 잉크로 채워진 트랙과 화이트 노브가 있는 범위 컨트롤.

```jsx
<Slider defaultValue={40} showValue onChange={setV} />
<Slider value={v} min={0} max={10} step={1} onChange={setV} />
```

- **value / defaultValue / onChange** — 제어/비제어. **min / max / step** — 범위. **showValue** — 끝의 값 표시.
