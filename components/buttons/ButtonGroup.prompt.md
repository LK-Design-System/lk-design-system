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
- **size**는 Button family와 같은 `sm/md/lg` = 32/40/48px이며, 이 값은 자식 버튼이 아니라 그룹 전체 외곽 높이입니다. 단일 모드의 SegmentedControl border와 복수 모드의 연결 border가 높이에 더해지지 않습니다.
- 그룹의 목적을 설명하는 `aria-label` 또는 `aria-labelledby`를 **반드시** 제공하세요.
  범용 기본 이름은 제공하지 않습니다 — 라벨이 없으면 개발 빌드에서 콘솔 경고가
  나고(프로덕션 번들에서는 제거됨), 단일 모드는 `SegmentedControl`의 기본 이름으로
  떨어집니다. 조용히 의미 없는 이름을 얻는 것보다 누락을 드러내는 쪽이 낫습니다.
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
- 비활성인데 선택된 segment는 선택 정보를 숨기지 않되 primary 색을 사용하지 않습니다. Radio의 비활성 checked 문법과 같이 중립 채움·비활성 전경으로 선택 상태만 낮은 대비로 보존합니다.

- **disable** — 모든 옵션을 끄는 `disabled`의 호환 별칭입니다.
