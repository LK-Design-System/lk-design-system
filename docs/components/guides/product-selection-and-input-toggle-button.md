# Toggle Button

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Product / Selection and Input |
| Owner | `ToggleButton` |
| Storybook | `LDS Product/Selection and Input/Toggle Button` |
| Source | `../component-content.json#product-selection-and-input-toggle-button` |

레이어 표시·미리보기처럼 즉시 실행 후 pressed 상태가 계속 남는 독립 기능에 적합합니다. 여러 보기 중 하나를 고르는 전환에는 Toggle Button 대신 Segmented Control을 사용하세요.

## 사용 판단

### 사용

- 레이어 표시·미리보기처럼 즉시 실행 후 pressed 상태가 계속 남는 독립 기능에 적합합니다. 여러 보기 중 하나를 고르는 전환에는 Toggle Button 대신 Segmented Control을 사용하세요.
- 아이콘 전용 사용은 구체적인 aria-label을 반드시 제공합니다.
- 여러 보기 중 하나를 고르는 전환에는 SegmentedControl, 여러 독립 토글을 묶을 때는 ButtonGroup multiple, 슬라이드 on/off에는 Switch를 사용합니다.
- Fluent 2 Button은 toggle button을 toolbar 같은 독립 상태 액션에 사용하고 설정 패널에서는 Switch를 사용하도록 구분합니다.

### 사용하지 않음

- hover/pressed는 calm tone만 사용합니다. persistent pressed 상태와 순간 pointer pressed 상태를 동일하게 취급하지 않습니다.
- - pressed / defaultPressed / onChange(next)는 제어/비제어 상태입니다. - size는 Button family와 같은 sm/md/lg = 32/40/48px입니다. - native disabled와 focus 가능한 aria-disabled를 구분하며 두 경우 모두 activation을 막고 같은 unavailable 스타일을 적용합니다. - 아이콘 전용 사용은 구체적인 aria-label을 반드시 제공합니다. - hover/pressed는 calm tone만 사용합니다. persistent pressed 상태와 순간 pointer….
- Toggle Button가 소유하지 않는 라우팅, 권한, 데이터 요청, 제품 임계값을 컴포넌트 내부에 넣지 않습니다.
- 동일한 목적을 더 단순한 native 요소나 기존 LDS primitive로 해결할 수 있으면 새 조합을 만들지 않습니다.

## Anatomy

| Part | Contract |
| --- | --- |
| Root | ToggleButton의 semantic role, layout containment와 전달받은 DOM 속성을 소유합니다. |
| Icon | 선택적 리딩 아이콘 노드. |
| Children | 아이콘 전용 정사각 토글은 구체적인 aria-label을 제공해야 합니다. |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `pressed` | `boolean` | No | 제어되는 눌림 상태. |
| `defaultPressed` | `boolean` | No | 비제어 초기 상태. @default false |
| `onChange` | `(next: boolean) = void` | No | 공개 타입 계약에 정의된 속성입니다. |
| `icon` | `React.ReactNode` | No | 선택적 리딩 아이콘 노드. |
| `size` | `'sm' \| 'md' \| 'lg' \| 'small' \| 'medium' \| 'large'` | No | Button family height scale: 32 / 40 / 48. @default "md" |
| `disable` | `boolean` | No | Disabled alias retained for compatibility. |
| `children` | `React.ReactNode` | No | 아이콘 전용 정사각 토글은 구체적인 aria-label을 제공해야 합니다. |

## States

| State | Contract |
| --- | --- |
| pressed | 제어되는 눌림 상태. 타입 계약: boolean |
| defaultPressed | 비제어 초기 상태. @default false 타입 계약: boolean |
| 상호작용 · 크기와 지속 상태 | interaction 공개 스토리에서 렌더링 및 상호작용 증거를 유지합니다. |

## Behavior and interaction

- pressed / defaultPressed / onChange(next)는 제어/비제어 상태입니다.
- native disabled와 focus 가능한 aria-disabled를 구분하며 두 경우 모두 activation을 막고 같은 unavailable 스타일을 적용합니다.
- hover/pressed는 calm tone만 사용합니다. persistent pressed 상태와 순간 pointer pressed 상태를 동일하게 취급하지 않습니다.
- WAI-ARIA Button Pattern의 고정 label + aria-pressed 계약을 따릅니다.
- Fluent 2 Button은 toggle button을 toolbar 같은 독립 상태 액션에 사용하고 설정 패널에서는 Switch를 사용하도록 구분합니다.

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 명시 규칙 1 | size는 Button family와 같은 sm/md/lg = 32/40/48px입니다. |
| 명시 규칙 2 | Fluent 2 Button은 toggle button을 toolbar 같은 독립 상태 액션에 사용하고 설정 패널에서는 Switch를 사용하도록 구분합니다. |
| 명시 규칙 3 | - pressed / defaultPressed / onChange(next)는 제어/비제어 상태입니다. - size는 Button family와 같은 sm/md/lg = 32/40/48px입니다. - native disabled와 focus 가능한 aria-disabled를 구분하며 두 경우 모두 activation을 막고 같은 unavailable 스타일을 적용합니다. - 아이콘 전용 사용은 구체적인 aria-label을 반드시 제공합니다. - hover/pressed는 calm tone만 사용합니다. persistent pressed 상태와 순간 pointer… |
| 명시 규칙 4 | - WAI-ARIA Button Pattern의 고정 label + aria-pressed 계약을 따릅니다. - Fluent 2 Button은 toggle button을 toolbar 같은 독립 상태 액션에 사용하고 설정 패널에서는 Switch를 사용하도록 구분합니다. |
| --border-thin | 1px |

## Responsive

- 320px 좁은 폭과 200% 텍스트 확대에서 페이지 가로 overflow 없이 의미 순서를 유지합니다.
- 고정 폭보다 부모 containment와 wrapping을 우선하고, 제품이 필요할 때 명시적으로 compact 표현을 선택합니다.

## Content and writing

- 아이콘 전용 사용은 구체적인 aria-label을 반드시 제공합니다.
- WAI-ARIA Button Pattern의 고정 label + aria-pressed 계약을 따릅니다.
- - pressed / defaultPressed / onChange(next)는 제어/비제어 상태입니다. - size는 Button family와 같은 sm/md/lg = 32/40/48px입니다. - native disabled와 focus 가능한 aria-disabled를 구분하며 두 경우 모두 activation을 막고 같은 unavailable 스타일을 적용합니다. - 아이콘 전용 사용은 구체적인 aria-label을 반드시 제공합니다. - hover/pressed는 calm tone만 사용합니다. persistent pressed 상태와 순간 pointer….
- - WAI-ARIA Button Pattern의 고정 label + aria-pressed 계약을 따릅니다. - Fluent 2 Button은 toggle button을 toolbar 같은 독립 상태 액션에 사용하고 설정 패널에서는 Switch를 사용하도록 구분합니다.

## Accessibility

- native disabled와 focus 가능한 aria-disabled를 구분하며 두 경우 모두 activation을 막고 같은 unavailable 스타일을 적용합니다.
- 아이콘 전용 사용은 구체적인 aria-label을 반드시 제공합니다.
- WAI-ARIA Button Pattern의 고정 label + aria-pressed 계약을 따릅니다.
- ToggleButton은 독립 기능의 켬·끔 상태를 버튼 자체에 유지하는 LK Product Extension입니다. 선택 상태는 surface와 aria-pressed로 함께 전달합니다.
- - pressed / defaultPressed / onChange(next)는 제어/비제어 상태입니다. - size는 Button family와 같은 sm/md/lg = 32/40/48px입니다. - native disabled와 focus 가능한 aria-disabled를 구분하며 두 경우 모두 activation을 막고 같은 unavailable 스타일을 적용합니다. - 아이콘 전용 사용은 구체적인 aria-label을 반드시 제공합니다. - hover/pressed는 calm tone만 사용합니다. persistent pressed 상태와 순간 pointer….

## Do / Don't

| Kind | Guidance |
| --- | --- |
| Do | 아이콘 전용 사용은 구체적인 aria-label을 반드시 제공합니다. |
| Don't | hover/pressed는 calm tone만 사용합니다. persistent pressed 상태와 순간 pointer pressed 상태를 동일하게 취급하지 않습니다. |
| Do | 여러 보기 중 하나를 고르는 전환에는 SegmentedControl, 여러 독립 토글을 묶을 때는 ButtonGroup multiple, 슬라이드 on/off에는 Switch를 사용합니다. |
| Don't | - pressed / defaultPressed / onChange(next)는 제어/비제어 상태입니다. - size는 Button family와 같은 sm/md/lg = 32/40/48px입니다. - native disabled와 focus 가능한 aria-disabled를 구분하며 두 경우 모두 activation을 막고 같은 unavailable 스타일을 적용합니다. - 아이콘 전용 사용은 구체적인 aria-label을 반드시 제공합니다. - hover/pressed는 calm tone만 사용합니다. persistent pressed 상태와 순간 pointer…. |

## Exceptions

- 제품 정책을 포함해야 하는 예외는 wrapper 또는 제품 저장소에서 조합하고 ToggleButton의 범용 API에 넣지 않습니다.
- 접근성 또는 안전 계약을 약화하는 예외는 허용하지 않으며 필요한 차이는 prompt와 Storybook 증거에 기록합니다.

## Related components

| Component | Relationship |
| --- | --- |
| `Icon` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `ColorSwatch` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `DatePicker` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `DateRangeField` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `FileUpload` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `FileUploadQueue` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `IconPicker` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `NumberField` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |

## Examples

### 기본 조합

```jsx
<ToggleButton icon={<Icon name="eye" size={18} />} onChange={setPreview}>
  미리보기
</ToggleButton>
<ToggleButton defaultPressed icon={<Icon name="star" size={18} />} aria-label="즐겨찾기" />
```

## Tokens and API

### Tokens

- `--border-thin`
- `--color-semantic-background-elevated-normal`
- `--color-semantic-fill-alternative`
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
- `--component-button-font-weight`
- `--component-button-gap-lg`
- `--component-button-gap-md`
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

### Source contracts

- `components/selection/ToggleButton.jsx`
- `components/selection/ToggleButton.d.ts`
- `components/selection/ToggleButton.prompt.md`
- `stories/SelectionToggleButton.stories.jsx`

## Migration

- disable — disabled의 호환 별칭입니다.
- - disable — disabled의 호환 별칭입니다.
- 현재 prompt와 타입 계약에 기록되지 않은 legacy alias는 새 코드에서 도입하지 않습니다.
- 대체 컴포넌트가 생기면 기존 API의 제거 버전, 대응 prop과 자동·수동 전환 절차를 이 페이지에 기록합니다.

## Sources

- ToggleButton prompt contract: `components/selection/ToggleButton.prompt.md`
- Storybook implementation evidence: `stories/SelectionToggleButton.stories.jsx`
- [WAI-ARIA Button Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/button/)
- [Fluent 2 Button](https://fluent2.microsoft.design/components/web/react/core/button/usage)
