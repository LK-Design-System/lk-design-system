**IconPicker** — 선택 가능한 아이콘 타일 그리드(빌딩·마커·카테고리 아이콘 지정).

```jsx
<IconPicker
  options={[{ value: 'dock', icon: <Icon name="anchor" />, label: '도킹' }]}
  defaultValue="dock"
  onChange={setIcon}
/>
```

- `options`는 `{value, icon, label?, disabled?}[]`입니다. `label`은 타일의 accessible name과 hover title로 사용합니다.
- `value/defaultValue`, `onChange(value)`, `columns`, `size`, `disabled`, `emptyLabel`을 지원합니다. 그룹 자체의 접근 가능 이름은 컴포넌트 `label` prop(기본 `아이콘 선택`)입니다.
- Compare against common icon picker expectations before changing it: single selected value, radio-group semantics, disabled options, empty state, keyboard navigation, accessible labels for icon-only tiles, and stable tile sizing.
- 라디오그룹으로 동작하며 그룹 전체가 **Tab stop 하나**만 갖습니다. Tab stop은 이동 위치를 따르고, 이동 위치가 없거나 비활성이면 선택 위치(없으면 첫 활성 타일)로 되돌아갑니다. controlled 사용에서 `onChange`가 `value`를 갱신하지 않아도 Tab stop이 둘로 갈라지지 않습니다.
- `columns`가 시각 그리드를 만들므로 `Arrow Left/Right`는 선형으로 순환 이동하고 `Arrow Up/Down`은 한 행(`columns`개)씩 이동합니다. 같은 열에 활성 타일이 없으면 같은 방향으로 계속 찾고 그리드 밖이면 제자리에 머뭅니다. `Home/End`는 첫/마지막 활성 타일로 갑니다. 모든 이동은 선택을 함께 옮기고 `disabled` 타일은 건너뜁니다.
- 빈 상태 안내는 역할 없는 정적 텍스트입니다. `aria-disabled` 같은 상태 속성을 붙이지 않습니다.
- hover는 neutral fill, keyboard focus는 LDS focus ring, selection은 primary surface/border로 분리합니다.
- Layer: LDS Product extension. Local WDS `.fig` inspection did not find an exact Icon Picker component set; use WDS/LDS icon foundation assets without claiming WDS component variant parity.
- DS 관행상 타일은 semantic line/fill/background token과 `Icon` registry 기반 아이콘을 사용하고, legacy border/background 토큰이나 임의 SVG를 넣지 않습니다.

## External research basis

- [WAI-ARIA Radio Group pattern](https://www.w3.org/WAI/ARIA/apg/patterns/radio/)에 따라 하나의 Tab stop, Arrow 이동, `radio`/`aria-checked` 단일 선택 계약을 사용합니다.
- [Apple Focus and selection](https://developer.apple.com/design/human-interface-guidelines/focus-and-selection/)을 따라 focus ring과 selected surface를 서로 다른 상태로 보여줍니다.
