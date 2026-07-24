# Button Group

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Product / Action |
| Owner | `ButtonGroup` |
| Storybook | `LDS Product/Action/Button Group` |
| Source | `../component-content.json#product-action-button-group` |

같은 맥락에서 하나 또는 여러 개의 짧은 토글 옵션을 맞닿은 버튼으로 제공할 때 적합합니다. 페이지 이동이나 긴 폼 선택에는 Button Group 대신 Tabs, Radio Group 또는 Select를 사용하세요.

## 사용 판단

### 사용

- 같은 맥락에서 하나 또는 여러 개의 짧은 토글 옵션을 맞닿은 버튼으로 제공할 때 적합합니다. 페이지 이동이나 긴 폼 선택에는 Button Group 대신 Tabs, Radio Group 또는 Select를 사용하세요.
- Apple Segmented Controls는 관련 단일·다중 선택의 일관된 segment 구조를, Adobe Spectrum ToggleButtonGroup은 single/multiple·size·group disabled 계약을 제공합니다.
- ButtonGroup은 LK Product Extension입니다. 단일 선택은 별도 외형을 다시 그리지 않고 outlined SegmentedControl을 조합합니다. multiple일 때만 여러 독립 aria-pressed 토글을 연결된 버튼 그룹으로 제공합니다.
- - options는 문자열 또는 { value, label, icon, disabled }입니다. - value / defaultValue / onChange는 단일 선택일 때 문자열, multiple일 때 string[]입니다. 기존 multiple API는 호환 유지합니다. - size는 Button family와 같은 sm/md/lg = 32/40/48px이며, 이 값은 자식 버튼이 아니라 그룹 전체 외곽 높이입니다. 단일 모드의 SegmentedControl border와 복수 모드의 연결 border가 높이에 더해지지 않습니다. - 그룹의 목적을 설명하는….

### 사용하지 않음

- 그룹의 목적을 설명하는 aria-label 또는 aria-labelledby를 반드시 제공하세요. 범용 기본 이름은 제공하지 않습니다 — 라벨이 없으면 개발 빌드에서 콘솔 경고가 나고(프로덕션 번들에서는 제거됨), 단일 모드는 SegmentedControl의 기본 이름으로 떨어집니다. 조용히 의미 없는 이름을 얻는 것보다 누락을 드러내는 쪽이 낫습니다. 전체 disabled와 option별 disabled를 지원합니다.
- WDS .fig에는 ButtonGroup component set이 없으므로 WDS Core로 주장하지 않습니다.
- 비활성인데 선택된 segment는 선택 정보를 숨기지 않되 primary 색을 사용하지 않습니다. Radio의 비활성 checked 문법과 같이 중립 채움·비활성 전경으로 선택 상태만 낮은 대비로 보존합니다.
- - options는 문자열 또는 { value, label, icon, disabled }입니다. - value / defaultValue / onChange는 단일 선택일 때 문자열, multiple일 때 string[]입니다. 기존 multiple API는 호환 유지합니다. - size는 Button family와 같은 sm/md/lg = 32/40/48px이며, 이 값은 자식 버튼이 아니라 그룹 전체 외곽 높이입니다. 단일 모드의 SegmentedControl border와 복수 모드의 연결 border가 높이에 더해지지 않습니다. - 그룹의 목적을 설명하는….

## Anatomy

| Part | Contract |
| --- | --- |
| Root | ButtonGroup의 semantic role, layout containment와 전달받은 DOM 속성을 소유합니다. |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `options` | `ButtonGroupOption[]` | Yes | 공개 타입 계약에 정의된 속성입니다. |
| `value` | `string \| string[]` | No | 제어 값(문자열, multiple일 때 string[]). |
| `defaultValue` | `string \| string[]` | No | 공개 타입 계약에 정의된 속성입니다. |
| `onChange` | `(value: string \| string[]) = void` | No | 공개 타입 계약에 정의된 속성입니다. |
| `size` | `'sm' \| 'md' \| 'lg' \| 'small' \| 'medium' \| 'large'` | No | Button family height scale: 32 / 40 / 48. @default "md" |
| `multiple` | `boolean` | No | 여러 개의 독립 aria-pressed 토글을 허용합니다. @default false |
| `disabled` | `boolean` | No | Disable every option. @default false |
| `disable` | `boolean` | No | Disabled alias retained for compatibility. |

## States

| State | Contract |
| --- | --- |
| disabled | Disable every option. @default false 타입 계약: boolean |
| 상호작용 · 단일·복수 선택 | interaction 공개 스토리에서 렌더링 및 상호작용 증거를 유지합니다. |

## Behavior and interaction

- options는 문자열 또는 { value, label, icon, disabled }입니다.
- value / defaultValue / onChange는 단일 선택일 때 문자열, multiple일 때 string[]입니다. 기존 multiple API는 호환 유지합니다.
- 단일 선택의 keyboard/DOM 계약은 SegmentedControl이 소유합니다. multiple 모드는 WAI-ARIA toggle button group이므로 각 버튼이 Tab stop이고 Enter/Space로 독립 상태를 바꿉니다.
- Apple Segmented Controls는 관련 단일·다중 선택의 일관된 segment 구조를, Adobe Spectrum ToggleButtonGroup은 single/multiple·size·group disabled 계약을 제공합니다.
- 단일 선택은 기존 WDS 대응 SegmentedControl에 수렴하고, 여러 독립 상태를 동시에 유지하는 multiple toggle만 ButtonGroup의 별도 역할로 남깁니다.

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 명시 규칙 1 | size는 Button family와 같은 sm/md/lg = 32/40/48px이며, 이 값은 자식 버튼이 아니라 그룹 전체 외곽 높이입니다. 단일 모드의 SegmentedControl border와 복수 모드의 연결 border가 높이에 더해지지 않습니다. |
| 명시 규칙 2 | - options는 문자열 또는 { value, label, icon, disabled }입니다. - value / defaultValue / onChange는 단일 선택일 때 문자열, multiple일 때 string[]입니다. 기존 multiple API는 호환 유지합니다. - size는 Button family와 같은 sm/md/lg = 32/40/48px이며, 이 값은 자식 버튼이 아니라 그룹 전체 외곽 높이입니다. 단일 모드의 SegmentedControl border와 복수 모드의 연결 border가 높이에 더해지지 않습니다. - 그룹의 목적을 설명하는… |
| --border-thin | 1px |
| --color-semantic-background-elevated-normal | light: #FFFFFF; dark: #212225 |
| --color-semantic-fill-alternative | light: rgba(112, 115, 124, 0.05); dark: rgba(112, 115, 124, 0.12) |

## Responsive

- size는 Button family와 같은 sm/md/lg = 32/40/48px이며, 이 값은 자식 버튼이 아니라 그룹 전체 외곽 높이입니다. 단일 모드의 SegmentedControl border와 복수 모드의 연결 border가 높이에 더해지지 않습니다.
- - options는 문자열 또는 { value, label, icon, disabled }입니다. - value / defaultValue / onChange는 단일 선택일 때 문자열, multiple일 때 string[]입니다. 기존 multiple API는 호환 유지합니다. - size는 Button family와 같은 sm/md/lg = 32/40/48px이며, 이 값은 자식 버튼이 아니라 그룹 전체 외곽 높이입니다. 단일 모드의 SegmentedControl border와 복수 모드의 연결 border가 높이에 더해지지 않습니다. - 그룹의 목적을 설명하는….
- 320px 좁은 폭과 200% 텍스트 확대에서 페이지 가로 overflow 없이 의미 순서를 유지합니다.
- 고정 폭보다 부모 containment와 wrapping을 우선하고, 제품이 필요할 때 명시적으로 compact 표현을 선택합니다.

## Content and writing

- options는 문자열 또는 { value, label, icon, disabled }입니다.
- 그룹의 목적을 설명하는 aria-label 또는 aria-labelledby를 반드시 제공하세요. 범용 기본 이름은 제공하지 않습니다 — 라벨이 없으면 개발 빌드에서 콘솔 경고가 나고(프로덕션 번들에서는 제거됨), 단일 모드는 SegmentedControl의 기본 이름으로 떨어집니다. 조용히 의미 없는 이름을 얻는 것보다 누락을 드러내는 쪽이 낫습니다. 전체 disabled와 option별 disabled를 지원합니다.
- - options는 문자열 또는 { value, label, icon, disabled }입니다. - value / defaultValue / onChange는 단일 선택일 때 문자열, multiple일 때 string[]입니다. 기존 multiple API는 호환 유지합니다. - size는 Button family와 같은 sm/md/lg = 32/40/48px이며, 이 값은 자식 버튼이 아니라 그룹 전체 외곽 높이입니다. 단일 모드의 SegmentedControl border와 복수 모드의 연결 border가 높이에 더해지지 않습니다. - 그룹의 목적을 설명하는….
- 사용자에게 보이는 Button Group 문자열은 제품 번역 계층에서 제공하고 행동 또는 상태를 구체적으로 설명합니다.

## Accessibility

- 그룹의 목적을 설명하는 aria-label 또는 aria-labelledby를 반드시 제공하세요. 범용 기본 이름은 제공하지 않습니다 — 라벨이 없으면 개발 빌드에서 콘솔 경고가 나고(프로덕션 번들에서는 제거됨), 단일 모드는 SegmentedControl의 기본 이름으로 떨어집니다. 조용히 의미 없는 이름을 얻는 것보다 누락을 드러내는 쪽이 낫습니다. 전체 disabled와 option별 disabled를 지원합니다.
- 단일 선택의 keyboard/DOM 계약은 SegmentedControl이 소유합니다. multiple 모드는 WAI-ARIA toggle button group이므로 각 버튼이 Tab stop이고 Enter/Space로 독립 상태를 바꿉니다.
- ButtonGroup은 LK Product Extension입니다. 단일 선택은 별도 외형을 다시 그리지 않고 outlined SegmentedControl을 조합합니다. multiple일 때만 여러 독립 aria-pressed 토글을 연결된 버튼 그룹으로 제공합니다.
- - options는 문자열 또는 { value, label, icon, disabled }입니다. - value / defaultValue / onChange는 단일 선택일 때 문자열, multiple일 때 string[]입니다. 기존 multiple API는 호환 유지합니다. - size는 Button family와 같은 sm/md/lg = 32/40/48px이며, 이 값은 자식 버튼이 아니라 그룹 전체 외곽 높이입니다. 단일 모드의 SegmentedControl border와 복수 모드의 연결 border가 높이에 더해지지 않습니다. - 그룹의 목적을 설명하는….
- native semantic을 우선하며 사용자에게 보이는 이름과 접근 가능한 이름이 같은 목적을 설명하게 합니다.

## Do / Don't

| Kind | Guidance |
| --- | --- |
| Do | Apple Segmented Controls는 관련 단일·다중 선택의 일관된 segment 구조를, Adobe Spectrum ToggleButtonGroup은 single/multiple·size·group disabled 계약을 제공합니다. |
| Don't | 그룹의 목적을 설명하는 aria-label 또는 aria-labelledby를 반드시 제공하세요. 범용 기본 이름은 제공하지 않습니다 — 라벨이 없으면 개발 빌드에서 콘솔 경고가 나고(프로덕션 번들에서는 제거됨), 단일 모드는 SegmentedControl의 기본 이름으로 떨어집니다. 조용히 의미 없는 이름을 얻는 것보다 누락을 드러내는 쪽이 낫습니다. 전체 disabled와 option별 disabled를 지원합니다. |
| Do | ButtonGroup은 LK Product Extension입니다. 단일 선택은 별도 외형을 다시 그리지 않고 outlined SegmentedControl을 조합합니다. multiple일 때만 여러 독립 aria-pressed 토글을 연결된 버튼 그룹으로 제공합니다. |
| Don't | WDS .fig에는 ButtonGroup component set이 없으므로 WDS Core로 주장하지 않습니다. |

## Exceptions

- 제품 정책을 포함해야 하는 예외는 wrapper 또는 제품 저장소에서 조합하고 ButtonGroup의 범용 API에 넣지 않습니다.
- 접근성 또는 안전 계약을 약화하는 예외는 허용하지 않으며 필요한 차이는 prompt와 Storybook 증거에 기록합니다.

## Related components

| Component | Relationship |
| --- | --- |
| `CopyButton` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `Link` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `SpeedDial` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `SplitButton` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `SocialButton` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |

## Examples

### 기본 조합

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

## Tokens and API

### Tokens

- `--border-thin`
- `--color-semantic-background-elevated-normal`
- `--color-semantic-fill-alternative`
- `--color-semantic-fill-strong`
- `--color-semantic-label-disable`
- `--color-semantic-label-neutral`
- `--color-semantic-label-normal`
- `--color-semantic-line-normal-neutral`
- `--color-semantic-line-solid-normal`
- `--color-semantic-primary-normal`
- `--color-semantic-primary-surface-strong`
- `--component-button-disabled-bg`
- `--component-button-font-size-lg`
- `--component-button-font-size-md`
- `--component-button-font-size-sm`
- `--component-button-gap-sm`
- `--component-button-height-lg`
- `--component-button-height-md`
- `--component-button-height-sm`
- `--component-button-letter-spacing-lg`
- `--component-button-letter-spacing-md`
- `--component-button-letter-spacing-sm`
- `--component-button-line-height-lg`
- `--component-button-line-height-md`
- `--component-button-line-height-sm`
- `--component-button-padding-lg`
- `--component-button-padding-md`
- `--component-button-padding-sm`
- `--component-button-radius-lg`
- `--component-button-radius-md`
- `--component-button-radius-sm`
- `--component-button-transition`
- `--font-sans`
- `--fw-medium`
- `--fw-semibold`

### Source contracts

- `components/buttons/ButtonGroup.jsx`
- `components/buttons/ButtonGroup.d.ts`
- `components/buttons/ButtonGroup.prompt.md`
- `stories/ActionButtonGroup.stories.jsx`

## Migration

- value / defaultValue / onChange는 단일 선택일 때 문자열, multiple일 때 string[]입니다. 기존 multiple API는 호환 유지합니다.
- disable — 모든 옵션을 끄는 disabled의 호환 별칭입니다.
- - options는 문자열 또는 { value, label, icon, disabled }입니다. - value / defaultValue / onChange는 단일 선택일 때 문자열, multiple일 때 string[]입니다. 기존 multiple API는 호환 유지합니다. - size는 Button family와 같은 sm/md/lg = 32/40/48px이며, 이 값은 자식 버튼이 아니라 그룹 전체 외곽 높이입니다. 단일 모드의 SegmentedControl border와 복수 모드의 연결 border가 높이에 더해지지 않습니다. - 그룹의 목적을 설명하는….
- - disable — 모든 옵션을 끄는 disabled의 호환 별칭입니다.

## Sources

- ButtonGroup prompt contract: `components/buttons/ButtonGroup.prompt.md`
- Storybook implementation evidence: `stories/ActionButtonGroup.stories.jsx`
- [Apple Segmented Controls](https://developer.apple.com/design/human-interface-guidelines/segmented-controls)
- [Adobe Spectrum ToggleButtonGroup](https://react-spectrum.adobe.com/ToggleButtonGroup)
