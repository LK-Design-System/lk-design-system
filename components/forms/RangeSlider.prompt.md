**RangeSlider** — 핸들 사이가 시그널 잉크로 채워지는 두 노브 범위.

```jsx
<RangeSlider defaultValue={[20, 80]} showValue onChange={setRange} />
```

- **value / defaultValue / onChange** — `[low, high]` 튜플. **min / max / step** — 범위. 핸들은 서로 교차할 수 없습니다.
