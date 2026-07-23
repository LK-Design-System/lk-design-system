**ColorSwatch** — 제한된 색 목록에서 하나를 고르는 단일 선택 스와치 행.

```jsx
<ColorSwatch
  colors={[
    { value: '#0067A8', label: '브랜드 파랑' },
    { value: '#5E6E86', label: '중립 회색' },
    { value: '#CF6360', label: '경고 빨강' },
  ]}
  defaultValue="#0067A8"
  onChange={setColor}
/>
```

## 재사용 계약

- **colors** — 문자열 CSS 색 또는 `{value, label?, disabled?}` 항목의 배열. **value / defaultValue / onChange(color)** — 선택된 색. **size**(px, 기본 28) · **shape**(`rounded · circle`) · **label**(radiogroup 접근 가능 이름, 기본 `색상 선택`) · **disabled**(그룹 전체 비활성).
- 색상 스와치 묶음은 관행상 **단일 선택 그룹**이므로 `radiogroup` + `radio` + `aria-checked`로 노출합니다. 선택 상태를 링 색만으로 표현하지 않습니다.
- 항목의 접근 가능 이름은 `label`입니다. **한국어 색 이름을 항상 제공하세요.** `#CF6360`이나 `var(--color-…)` 같은 원시 CSS 값은 이름으로 쓰지 않으며, `label`이 없으면 위치 기반 한국어 이름(`색상 1`, `색상 2` …)으로 대체합니다.
- 선택은 시그널 잉크 링 **그리고 흰 체크 표시**로 동시에 전달합니다. 체크에는 어두운 halo를 덧입혀 밝은 색 위에서도 형태가 보이게 합니다. 색 대비만으로 선택을 구분하지 않습니다.
- 키보드는 APG Radio Group 계약입니다. 그룹 전체가 Tab stop 하나(선택된 스와치, 없으면 첫 활성 스와치)를 갖고 `Arrow Left/Right/Up/Down`이 순환 이동하면서 선택을 함께 옮기며 `Home/End`는 처음/끝으로 갑니다. `disabled` 항목은 이동에서 건너뜁니다.
- 제품이 허용한 소수의 색 토큰을 고르는 용도입니다. 임의 색상 입력, 그라디언트, 팔레트 편집에는 전용 색상 편집기를 사용하세요.

## External research basis

- [WAI-ARIA Radio Group pattern](https://www.w3.org/WAI/ARIA/apg/patterns/radio/) — 단일 Tab stop, 방향키 이동+선택, `radio`/`aria-checked` 계약.
- [WCAG 2.2 Use of Color (1.4.1)](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html) — 선택 상태를 색만으로 전달하지 않도록 체크 표시를 병행합니다.
- Polaris ColorPicker·Fluent SwatchPicker의 색상명 라벨 관행을 따라 스와치마다 사람이 읽는 이름을 요구합니다.
