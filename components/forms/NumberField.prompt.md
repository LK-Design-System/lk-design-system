**NumberField** — 인라인 상/하 스테퍼가 있는 숫자 입력.

```jsx
<NumberField label="투입 대수" helper="최대 20대" defaultValue={3} min={0} max={20} onChange={setQty} />
```

- **value / defaultValue / onChange** — 제어/비제어. **min / max / step** — 범위. 콤팩트한 ± 전용 컨트롤에는 `Stepper`를 쓰세요.
- 클램프는 값이 확정될 때만 일어납니다. 편집 중에는 `max=20`에서 `25`를 타이핑하거나 필드를 비워 둘 수 있고, blur·Enter·스테퍼로 확정하는 순간 [min, max]로 클램프됩니다. 빈 채로 blur하면 마지막 확정값으로 되돌아갑니다. **onChange**는 편집 중에는 파싱된 중간값을, 확정 시점에는 클램프된 값을 전달합니다.
- **label** / **helper** / **error** / **invalid** — label을 주면 `htmlFor`로 연결된 필드 레이블·메시지 스택을 함께 렌더링하고, 그렇지 않으면 셸만 렌더링해 `FormField` 같은 상위 표면에 맡깁니다. **error**나 **invalid**는 `aria-invalid`와 오류 테두리를 함께 켭니다. **fieldStyle**은 label/helper/error를 포함한 바깥 스택, **style**은 스테퍼가 붙은 입력 셸을 스타일링합니다.
- native number input이 spinbutton semantics를 소유하고 inline step action은 보조 조작입니다. 보조 action 이름에는 field 이름을 포함합니다. focus/disabled/readOnly는 `Input`과 같은 component token(`fieldBackground`·`fieldBorderColor`)을 사용하며 `type="number"`는 consumer가 덮어쓰지 못합니다.

## External research basis

- [WAI-ARIA Spinbutton pattern](https://www.w3.org/WAI/ARIA/apg/patterns/spinbutton/)의 native editing·Arrow key 기대를 보존합니다.
- [WCAG 2.2 Focus Appearance](https://www.w3.org/WAI/WCAG22/Understanding/focus-appearance.html)에 맞춰 field 전체에 LDS focus ring을 표시합니다.
- 편집 중 중간값 허용과 확정 시 클램프는 [Carbon Number input](https://carbondesignsystem.com/components/number-input/usage/)·[Spectrum NumberField](https://spectrum.adobe.com/page/number-field/)의 관례를 따릅니다.
