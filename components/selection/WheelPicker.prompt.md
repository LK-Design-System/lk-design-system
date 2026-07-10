**WheelPicker** — iOS식 드럼/휠 선택기. 스크롤-스냅 listbox 중앙 행을 현재 선택값으로 쓰며, 층·시간·속도 단계처럼 짧은 순차 옵션에 씁니다.

```jsx
<WheelPicker options={['B1','1F','2F','3F']} defaultValue="1F" onChange={setFloor} />
```

- **options** `string|number|{value,label,disabled}[]` · **value/defaultValue/onChange** · **itemHeight** · **visible**(짝수는 다음 홀수로 보정) · **width** · **label** · **emptyLabel** · **disabled/disable** · **readOnly**.
- Compare against common wheel picker expectations before changing it: controlled/uncontrolled value, centered selected row, scroll snap, disabled-option skipping, keyboard movement, empty state, readable selected option, and clear read-only vs disabled behavior.
- listbox는 `aria-activedescendant`와 `aria-selected`를 유지합니다. ArrowUp/ArrowDown, PageUp/PageDown, Home/End로 값을 이동합니다.
- `disabled` option은 스크롤/키보드/클릭 선택에서 건너뜁니다. `readOnly`는 focus와 읽기는 허용하지만 값 변경은 막습니다.
- Layer: LDS Product extension. WDS has `Presentation/Picker/Wheels` with Date/Time axes, but this component is a generic LK product wheel picker and must not claim WDS Date/Time variant parity.
- 시각은 중앙 clear selector zone, 위/아래 fade mask, 약한 원근감으로 wheel/drum picker처럼 보여야 합니다. 선택창은 카드/버튼처럼 보이는 inset pane, 외곽선, 진한 strip으로 만들지 말고, 선택 행의 선명도와 주변 행 opacity 감소로만 중심을 드러냅니다. 선택 행은 `headline1`, 바로 위/아래 행은 `body1`, 두 칸 이상 떨어진 행은 `label1` 수준의 크기 위계를 유지합니다. 선택 행에서 두 칸 떨어진 항목도 흐릿하게나마 읽혀야 합니다. 단, LDS Product에서는 과한 3D skeuomorphic 렌더링보다 semantic token 기반의 절제된 깊이를 우선합니다.
- 긴 문구나 많은 데이터 검색에는 쓰지 않습니다. 검색/필터가 필요하면 Select, Combobox, TreeSelectionPanel 같은 명시적 선택 컴포넌트를 우선합니다.
