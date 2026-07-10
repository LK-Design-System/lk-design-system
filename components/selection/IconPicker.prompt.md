**IconPicker** — 선택 가능한 아이콘 타일 그리드(빌딩·마커·카테고리 아이콘 지정).

```jsx
<IconPicker
  options={[{ value: 'dock', icon: <Icon name="anchor" />, label: '도킹' }]}
  defaultValue="dock"
  onChange={setIcon}
/>
```

- `options`는 `{value, icon, label?, disabled?}[]`입니다. `label`은 타일의 accessible name과 hover title로 사용합니다.
- `value/defaultValue`, `onChange(value)`, `columns`, `size`, `disabled`, `emptyLabel`을 지원합니다.
- Compare against common icon picker expectations before changing it: single selected value, radio-group semantics, disabled options, empty state, keyboard navigation, accessible labels for icon-only tiles, and stable tile sizing.
- 라디오그룹으로 동작하며 Arrow/Home/End 키로 선택을 이동합니다.
- Layer: LDS Product extension. Local WDS `.fig` inspection did not find an exact Icon Picker component set; use WDS/LDS icon foundation assets without claiming WDS component variant parity.
- DS 관행상 타일은 semantic line/fill/background token과 `Icon` registry 기반 아이콘을 사용하고, legacy border/background 토큰이나 임의 SVG를 넣지 않습니다.
