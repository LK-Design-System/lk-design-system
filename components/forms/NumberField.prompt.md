**NumberField** — 인라인 상/하 스테퍼가 있는 숫자 입력.

```jsx
<NumberField defaultValue={3} min={0} max={20} onChange={setQty} />
```

- **value / defaultValue / onChange** — 제어/비제어. **min / max / step** — 범위. 콤팩트한 ± 전용 컨트롤에는 `Stepper`를 쓰세요.
- native number input이 spinbutton semantics를 소유하고 inline step action은 보조 조작입니다. 보조 action 이름에는 field 이름을 포함합니다. focus/disabled/readOnly는 `Input`과 같은 component token을 사용하며 `type="number"`는 consumer가 덮어쓰지 못합니다.

## External research basis

- [WAI-ARIA Spinbutton pattern](https://www.w3.org/WAI/ARIA/apg/patterns/spinbutton/)의 native editing·Arrow key 기대를 보존합니다.
- [WCAG 2.2 Focus Appearance](https://www.w3.org/WAI/WCAG22/Understanding/focus-appearance.html)에 맞춰 field 전체에 LDS focus ring을 표시합니다.
