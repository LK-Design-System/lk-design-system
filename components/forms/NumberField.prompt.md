**NumberField** — 인라인 상/하 스테퍼가 있는 숫자 입력.

```jsx
<NumberField defaultValue={3} min={0} max={20} onChange={setQty} />
```

- **value / defaultValue / onChange** — 제어/비제어. **min / max / step** — 범위. 콤팩트한 ± 전용 컨트롤에는 `Stepper`를 쓰세요.
