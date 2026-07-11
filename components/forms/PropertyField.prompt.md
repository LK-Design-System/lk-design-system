**PropertyField** — 설정·튜닝 패널의 단일 파라미터 행입니다. 새 input primitive가 아니라 `Input` 계열 토큰, `Switch`, `Button` 문법을 조합한 Product/Selection and Input pattern입니다.

```jsx
<PropertyField label="max_vel" type="number" unit="m/s" value={0.8} onApply={apply} />
<PropertyField label="자동 복구" type="toggle" value={true} onApply={apply} />
```

- **label**(필수 문자열) · **hint** · **value** · **type** `number|text|toggle` · **min/max/step** · **unit** · **disabled/readOnly** · **applyLabel** · **dirtyLabel** · **onApply(value)**.
- `value`는 커밋된 baseline입니다. 내부 draft가 baseline과 달라질 때만 dirty dot과 Apply 활성 상태가 나타납니다. `Enter`는 적용, `Escape`는 draft를 baseline으로 되돌립니다.
- Compare against common property/settings field expectations before changing it: label and hint, typed value editor, committed vs draft value, dirty indication, explicit apply, disabled/read-only state, keyboard commit/reset, and clear separation from full form submission.
- Layer: LDS Product Selection and Input extension. It composes existing input, switch, and button behavior for settings panels rather than replacing primitive form fields.
- text/number 입력은 semantic/component input token을 따르고, toggle은 `Switch`, 적용 액션은 `Button`을 사용합니다. Apply 핸들러가 없거나 disabled/readOnly면 적용 버튼은 비활성입니다.
- compact input도 LDS focus ring과 AA text role을 유지합니다. `hint`는 모든 editor에, `unit`은 text/number editor에 `aria-describedby`로 연결합니다. toggle의 readOnly는 focus를 유지한 채 변경만 막습니다.
- 필드 단위로 즉시 커밋해야 하는 네비게이션 튜닝, 로봇 설정, 런타임 파라미터 패널에 사용합니다. 폼 전체 submit 흐름에는 `FormField` + `Input`/`Select` 조합을 우선합니다.

## External research basis

- [Material Design text fields](https://m3.material.io/components/text-fields/overview)는 label, supporting text, prefix/suffix, focus 상태를 하나의 field anatomy로 연결합니다. PropertyField는 이 중 compact editor·hint·unit만 재사용합니다.
- [WCAG 2.2 Contrast Minimum](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html)에 따라 작은 hint/unit 텍스트는 4.5:1을 충족하는 semantic foreground를 사용합니다.
