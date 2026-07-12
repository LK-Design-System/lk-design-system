**ButtonGroup**은 LK Product Extension입니다. 단일 선택은 별도 외형을 다시
그리지 않고 outlined `SegmentedControl`을 조합합니다. `multiple`일 때만 여러
독립 `aria-pressed` 토글을 연결된 버튼 그룹으로 제공합니다.

```jsx
<ButtonGroup aria-label="기간" options={['일', '주', '월']} defaultValue="주" />
<ButtonGroup
  multiple
  aria-label="문서 상태"
  options={[
    { value: 'draft', label: '초안' },
    { value: 'review', label: '검토', disabled: true },
    { value: 'published', label: '게시' },
  ]}
/>
```

- **options**는 문자열 또는 `{ value, label, icon, disabled }`입니다.
- **value / defaultValue / onChange**는 단일 선택일 때 문자열, `multiple`일
  때 `string[]`입니다. 기존 `multiple` API는 호환 유지합니다.
- **size**는 Button family와 같은 `sm/md/lg` = 32/40/48px입니다.
- 그룹의 목적을 설명하는 `aria-label` 또는 `aria-labelledby`를 제공하세요.
  전체 `disabled`와 option별 `disabled`를 지원합니다.
- 단일 선택의 keyboard/DOM 계약은 `SegmentedControl`이 소유합니다.
  multiple 모드는 WAI-ARIA toggle button group이므로 각 버튼이 Tab stop이고
  Enter/Space로 독립 상태를 바꿉니다.

## 근거와 유지 차이

- WDS `.fig`에는 ButtonGroup component set이 없으므로 WDS Core로 주장하지
  않습니다.
- [Apple Segmented Controls](https://developer.apple.com/design/human-interface-guidelines/segmented-controls)는
  관련 단일·다중 선택의 일관된 segment 구조를, [Adobe Spectrum ToggleButtonGroup](https://react-spectrum.adobe.com/ToggleButtonGroup)은
  single/multiple·size·group disabled 계약을 제공합니다.
- 단일 선택은 기존 WDS 대응 `SegmentedControl`에 수렴하고, 여러 독립 상태를
  동시에 유지하는 multiple toggle만 ButtonGroup의 별도 역할로 남깁니다.
