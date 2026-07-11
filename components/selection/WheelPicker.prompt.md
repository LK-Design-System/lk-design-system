**WheelPicker**는 한 번에 하나의 값을 고르는 scroll-snap listbox입니다.

```jsx
<WheelPicker options={['B1', '1F', '2F', '3F']} defaultValue="1F" onChange={setFloor} />
```

- **options**는 primitive 또는 `{ value, label, disabled }` 항목을 받습니다. **value / defaultValue / onChange**, **itemHeight**, 홀수로 보정되는 **visible**, **width**, **label**, **emptyLabel**, **disabled**, **readOnly**를 지원합니다.
- `listbox`, `aria-activedescendant`, `aria-selected`를 사용하며 ArrowUp/ArrowDown, PageUp/PageDown, Home/End로 값을 이동합니다. disabled option은 건너뜁니다.
- `readOnly`는 focus와 읽기를 허용하지만 값 변경을 막습니다. `disabled`는 상호작용과 Tab 진입을 막습니다.
- Layer: LDS Product extension. WDS `Presentation/Picker/Wheels`의 Date/Time variant parity를 주장하지 않습니다.
- 외곽 카드, inset pane, 중앙 띠, fade mask를 추가하지 않습니다. 깊이는 선택 행과 주변 행의 type scale·weight·3D transform으로만 표현하며 모든 활성 option 텍스트는 대비를 유지합니다.
- 긴 목록 검색이 필요한 경우 Select, Combobox, TreePicker를 사용합니다.

## External research basis

- [Apple Pickers](https://developer.apple.com/design/human-interface-guidelines/pickers)
- [Apple Focus and selection](https://developer.apple.com/design/human-interface-guidelines/focus-and-selection/)
- [WCAG 2.2 Contrast Minimum](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html)
