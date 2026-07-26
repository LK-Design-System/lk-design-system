**Stepper** — 소량 수량용 숫자 +/− 컨트롤(도입 대수, 수량). 쿨 그레이 아이콘 버튼이 tabular 값을 양옆에서 감싸고, `[min, max]`로 클램프하며 끝에 도달하면 해당 버튼을 사용 불가로 표시합니다(포커스는 유지).

```jsx
<Stepper label="도입 대수" defaultValue={1} min={0} max={9} onChange={setQty} />
<Stepper label="수량" value={qty} min={0} onChange={setQty} size="sm" />
<Stepper label="로봇" defaultValue={2} min={0} max={9} valueText={(v) => `${v}대`} />
```

- **value / defaultValue / onChange** — 제어/비제어. **min / max / step**은 범위와 증가폭을 정합니다. **largeStep**은 PageUp/PageDown 폭(기본 `step * 10`).
- **label** — 조절 대상의 이름. 접근성의 기준점이므로 **항상 지정하세요**(생략 시 `수량`).
- **valueText** — 숫자만으로 의미가 부족할 때 `aria-valuetext`를 제공합니다.
- **decrementLabel / incrementLabel** — +/− 버튼 이름을 직접 지정합니다(기본은 `label` 기반).
- **repeatDelay / repeatInterval** — 길게 누르기 자동 반복 타이밍.
- **size** `sm|md`. 값은 `tabular-nums`로 렌더돼 떨리지 않습니다. 자유 숫자 입력에는 `Input type="number"`를 쓰세요.

## 접근성 계약

### 채택한 패턴: APG spinbutton (native `input type="number"` 아님)

두 가지 표준 선택지를 비교했습니다.

| | APG `role="spinbutton"` | Carbon NumberInput(`input type="number"`) |
|---|---|---|
| 자유 텍스트 입력 | 불가(의도한 제약) | 가능 |
| 시각 결과 | 기존 tabular `<span>` 그대로 | 캐럿·네이티브 스핀 화살표 리셋 필요 |
| Home/End/PageUp/PageDown | 직접 정의 | 브라우저 미지원 |

**spinbutton을 선택한 이유**: 이 컴포넌트는 문서상 "자유 숫자 입력은 `Input type='number'`를 쓰라"고 이미 역할을 분리하고 있어, 편집 가능한 텍스트 필드 의미를 갖는 native number input은 계약과 어긋납니다. 또한 값 표시의 시각 출력(폭, tabular 정렬, 캐럿 없음)을 그대로 유지할 수 있습니다.

### 구조와 키보드

- 래퍼는 `role="group"`이며 `label`(또는 `aria-label` / `aria-labelledby`)로 이름을 갖습니다.
- 값은 `role="spinbutton"` + `tabIndex=0` + `aria-valuenow` / `aria-valuemin` / `aria-valuemax` / `aria-valuetext`를 소유합니다. `min`/`max`가 무한대일 때는 해당 `aria-value*`를 노출하지 않습니다.
- 키보드(spinbutton 포커스 시): `ArrowUp`/`ArrowDown` = ±`step`, `PageUp`/`PageDown` = ±`largeStep`, `Home` = `min`, `End` = `max`.
- +/− 버튼은 하드코딩된 영문 `decrease`/`increase` 대신 맥락 있는 한국어 이름(`도입 대수 증가`)을 가집니다. 아이콘은 `aria-hidden`입니다.
- **경계에서 native `disabled`를 쓰지 않습니다.** 값이 `min`/`max`에 닿으면 버튼은 `aria-disabled="true"`가 되고 포커스 가능한 상태로 남으며 활성화는 무시됩니다. native `disabled`로 바꾸면 그 순간 포커스가 `<body>`로 떨어져 키보드 사용자가 위치를 잃습니다.
- **라이브 리전 중복 방지**: 값 요소의 `aria-live`는 spinbutton이 포커스를 갖고 있지 않을 때만 `polite`입니다. 포커스가 있으면 `aria-valuenow` 변경으로 이미 읽히므로 `off`로 전환해 두 번 읽는 것을 막습니다.
- **길게 누르기 자동 반복**: 포인터를 누르고 있으면 `repeatDelay`(400ms) 후 `repeatInterval`(80ms)마다 반복됩니다. 타이머는 `pointerup`/`pointerleave`/`pointercancel`/`blur`/언마운트/`disabled` 전환에서 모두 정리됩니다. 포인터 경로는 `pointerdown`에서 1회 증감하고 뒤따르는 `click`을 삼켜 이중 증감을 막습니다(키보드 `Enter`/`Space` 활성화는 `click` 경로를 그대로 사용).

### 근거

- [WAI-ARIA APG Spinbutton pattern](https://www.w3.org/WAI/ARIA/apg/patterns/spinbutton/) — 역할, `aria-value*`, Arrow/Page/Home/End 키 계약.
- [WAI-ARIA APG Spinbutton example (date picker)](https://www.w3.org/WAI/ARIA/apg/patterns/spinbutton/examples/datepicker-spinbuttons/) — 값 요소가 포커스를 갖고 인접 버튼이 보조 컨트롤이 되는 구조.
- [Carbon Number input accessibility](https://carbondesignsystem.com/components/number-input/accessibility/) — 대안으로 검토한 native number input 접근법과 버튼 이름 요구사항.
- [Apple HIG — Steppers](https://developer.apple.com/design/human-interface-guidelines/steppers) — 길게 누르기 자동 반복 관례.
- [WCAG 2.2 2.4.3 Focus Order](https://www.w3.org/TR/WCAG22/#focus-order) — 경계에서 포커스를 잃지 않아야 하는 근거.
