# Sheet

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Product / Overlay |
| Owner | `Sheet` |
| Storybook | `LDS Product/Overlay/Sheet` |
| Source | `../component-content.json#product-overlay-sheet` |

모바일에서 짧은 선택 목록이나 보조 액션을 하단 패널로 제공할 때 적합합니다. 긴 편집 폼이나 데스크톱의 지속적인 보조 패널에는 Sheet 대신 전용 화면 또는 Drawer를 사용하세요.

## 사용 판단

### 사용

- 모바일에서 짧은 선택 목록이나 보조 액션을 하단 패널로 제공할 때 적합합니다. 긴 편집 폼이나 데스크톱의 지속적인 보조 패널에는 Sheet 대신 전용 화면 또는 Drawer를 사용하세요.
- Drawer와 달리 좌우 전체 폭의 bottom edge에 붙고, 최대 88vh, 상단 radius, grab handle을 사용합니다. 작은 화면에서 엄지 접근과 짧은 선택을 지원하는 기능 차이입니다.
- footer는 end 정렬과 space-2 action gap을 사용합니다. 작은 화면의 Sheet는 full-width CTA를 허용하며, 취소 액션의 시각 문법은 다른 dialog footer처럼 outlined + assistive를 사용합니다.
- Material Web Dialog: modal surface는 배경 상호작용을 차단하고 필요 시 명시적 initial focus target을 제공해야 한다는 구현 근거를 보조로 사용했습니다.

### 사용하지 않음

- 시각 delta inventory: headline/body typography, title·body·footer spacing, elevated fill/foreground, shadow, 40×4px grab handle, 기존 Button 크기와 hover/focus/disabled 처리를 유지합니다. 상단 radius와 bottom 방향은 기능상 유지하고 divider나 선택 marker를 새로 만들지 않습니다. grab handle은 장식이며 keyboard dismiss를 대신하지 않습니다.
- 제목은 aria-labelledby로 연결하고, 제목이 없으면 ariaLabel이 이름을 제공합니다.
- footer의 선택/취소 버튼처럼 보이는 dismiss 수단을 제공합니다. grab handle이나 scrim만으로 닫게 하지 않습니다.
- Sheet 위에 다른 modal surface를 상시 중첩하지 않습니다. 불가피한 확인 surface가 열리면 최상위만 상호작용하고 닫힌 뒤 Sheet 내부 호출 지점으로 복원됩니다.

## Anatomy

| Part | Contract |
| --- | --- |
| Root | Sheet의 semantic role, layout containment와 전달받은 DOM 속성을 소유합니다. |
| Title | title 속성으로 제공되는 공개 슬롯 또는 표시 영역입니다. |
| Children | children 속성으로 제공되는 공개 슬롯 또는 표시 영역입니다. |
| Footer | footer 속성으로 제공되는 공개 슬롯 또는 표시 영역입니다. |
| Aria Label | title이 없을 때 사용할 접근 가능한 이름. @default "하단 시트" |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `open` | `boolean` | No | 열림 상태. @default false |
| `title` | `React.ReactNode` | No | 공개 타입 계약에 정의된 속성입니다. |
| `children` | `React.ReactNode` | No | 공개 타입 계약에 정의된 속성입니다. |
| `footer` | `React.ReactNode` | No | 공개 타입 계약에 정의된 속성입니다. |
| `onClose` | `() = void` | No | Escape, scrim, 명시적 액션이 호출하는 controlled dismiss callback. |
| `closeOnScrim` | `boolean` | No | scrim 클릭으로 닫기. @default true |
| `height` | `number \| string` | No | 고정 높이(아니면 콘텐츠 크기, 88vh 상한). |
| `initialFocusRef` | `React.RefObject` | No | 열릴 때 우선 초점을 받을 Sheet 내부 요소. |
| `returnFocusRef` | `React.RefObject` | No | 닫힌 뒤 자동으로 캡처한 trigger 대신 초점을 돌려보낼 요소. |
| `restoreFocus` | `boolean` | No | 닫힌 뒤 trigger 또는 returnFocusRef로 초점을 복원합니다. @default true |
| `ariaLabel` | `string` | No | title이 없을 때 사용할 접근 가능한 이름. @default "하단 시트" |
| `style` | `React.CSSProperties` | No | 공개 타입 계약에 정의된 속성입니다. |

## States

| State | Contract |
| --- | --- |
| open | 열림 상태. @default false 타입 계약: boolean |
| 반응형 · 좁은 폭과 긴 콘텐츠 | responsive 공개 스토리에서 렌더링 및 상호작용 증거를 유지합니다. |

## Behavior and interaction

- Drawer, Modal, ConfirmDialog를 sibling으로 확인했습니다. focus controller는 공유하지만 기존 bottom placement와 이동 방향을 유지합니다.
- Drawer와 달리 좌우 전체 폭의 bottom edge에 붙고, 최대 88vh, 상단 radius, grab handle을 사용합니다. 작은 화면에서 엄지 접근과 짧은 선택을 지원하는 기능 차이입니다.
- 시각 delta inventory: headline/body typography, title·body·footer spacing, elevated fill/foreground, shadow, 40×4px grab handle, 기존 Button 크기와 hover/focus/disabled 처리를 유지합니다. 상단 radius와 bottom 방향은 기능상 유지하고 divider나 선택 marker를 새로 만들지 않습니다. grab handle은 장식이며 keyboard dismiss를 대신하지 않습니다.
- initialFocusRef → 첫 tabbable 요소 → dialog 표면 순으로 초기 초점을 선택합니다.
- Tab/Shift+Tab, 외부 focus containment, Escape는 현재 stack의 최상위 Sheet에만 적용됩니다.

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 명시 규칙 1 | Drawer와 달리 좌우 전체 폭의 bottom edge에 붙고, 최대 88vh, 상단 radius, grab handle을 사용합니다. 작은 화면에서 엄지 접근과 짧은 선택을 지원하는 기능 차이입니다. |
| 명시 규칙 2 | 시각 delta inventory: headline/body typography, title·body·footer spacing, elevated fill/foreground, shadow, 40×4px grab handle, 기존 Button 크기와 hover/focus/disabled 처리를 유지합니다. 상단 radius와 bottom 방향은 기능상 유지하고 divider나 선택 marker를 새로 만들지 않습니다. grab handle은 장식이며 keyboard dismiss를 대신하지 않습니다. |
| 명시 규칙 3 | footer는 end 정렬과 space-2 action gap을 사용합니다. 작은 화면의 Sheet는 full-width CTA를 허용하며, 취소 액션의 시각 문법은 다른 dialog footer처럼 outlined + assistive를 사용합니다. |
| 명시 규칙 4 | Fluent 2 Drawer: edge에서 들어오는 overlay surface는 짧고 맥락적인 작업에 제한하고, header/body/footer와 scroll body를 분리하며 여러 overlay 동시 노출을 피합니다. LDS는 이를 작은 화면의 bottom edge로 적응했습니다. |
| --body2-size | 15px |

## Responsive

- footer는 end 정렬과 space-2 action gap을 사용합니다. 작은 화면의 Sheet는 full-width CTA를 허용하며, 취소 액션의 시각 문법은 다른 dialog footer처럼 outlined + assistive를 사용합니다.
- Sheet는 작은 화면에서 선택지나 짧은 보조 액션을 bottom edge에 제공하는 modal surface입니다. 분류는 LDS Product Extension이며 WDS parity axis가 아닌 LDS 반응형 패턴입니다.
- - initialFocusRef → 첫 tabbable 요소 → dialog 표면 순으로 초기 초점을 선택합니다. - Tab/Shift+Tab, 외부 focus containment, Escape는 현재 stack의 최상위 Sheet에만 적용됩니다. - 닫히면 trigger 또는 returnFocusRef로 복원합니다. restoreFocus는 기본 true입니다. - footer의 선택/취소 버튼처럼 보이는 dismiss 수단을 제공합니다. grab handle이나 scrim만으로 닫게 하지 않습니다. - footer는 end 정렬과 space-2 action g….
- 모바일 breakpoint 선택, drag gesture/속도, snap point, URL·query 상태는 제품 레이어 책임입니다. LDS Sheet는 controlled open/dismiss, 기존 표면 구조와 keyboard/ARIA 계약만 제공합니다.

## Content and writing

- 시각 delta inventory: headline/body typography, title·body·footer spacing, elevated fill/foreground, shadow, 40×4px grab handle, 기존 Button 크기와 hover/focus/disabled 처리를 유지합니다. 상단 radius와 bottom 방향은 기능상 유지하고 divider나 선택 marker를 새로 만들지 않습니다. grab handle은 장식이며 keyboard dismiss를 대신하지 않습니다.
- 제목은 aria-labelledby로 연결하고, 제목이 없으면 ariaLabel이 이름을 제공합니다.
- WAI-ARIA APG Modal Dialog Pattern: bottom placement와 무관하게 modal surface의 focus trap, Escape, trigger 복원, ARIA 이름 계약을 적용했습니다.
- - Drawer, Modal, ConfirmDialog를 sibling으로 확인했습니다. focus controller는 공유하지만 기존 bottom placement와 이동 방향을 유지합니다. - Drawer와 달리 좌우 전체 폭의 bottom edge에 붙고, 최대 88vh, 상단 radius, grab handle을 사용합니다. 작은 화면에서 엄지 접근과 짧은 선택을 지원하는 기능 차이입니다. - 시각 delta inventory: headline/body typography, title·body·footer spacing, elevated fill/foreg….

## Accessibility

- Drawer, Modal, ConfirmDialog를 sibling으로 확인했습니다. focus controller는 공유하지만 기존 bottom placement와 이동 방향을 유지합니다.
- 시각 delta inventory: headline/body typography, title·body·footer spacing, elevated fill/foreground, shadow, 40×4px grab handle, 기존 Button 크기와 hover/focus/disabled 처리를 유지합니다. 상단 radius와 bottom 방향은 기능상 유지하고 divider나 선택 marker를 새로 만들지 않습니다. grab handle은 장식이며 keyboard dismiss를 대신하지 않습니다.
- 제목은 aria-labelledby로 연결하고, 제목이 없으면 ariaLabel이 이름을 제공합니다.
- initialFocusRef → 첫 tabbable 요소 → dialog 표면 순으로 초기 초점을 선택합니다.
- Tab/Shift+Tab, 외부 focus containment, Escape는 현재 stack의 최상위 Sheet에만 적용됩니다.

## Do / Don't

| Kind | Guidance |
| --- | --- |
| Do | Drawer와 달리 좌우 전체 폭의 bottom edge에 붙고, 최대 88vh, 상단 radius, grab handle을 사용합니다. 작은 화면에서 엄지 접근과 짧은 선택을 지원하는 기능 차이입니다. |
| Don't | 시각 delta inventory: headline/body typography, title·body·footer spacing, elevated fill/foreground, shadow, 40×4px grab handle, 기존 Button 크기와 hover/focus/disabled 처리를 유지합니다. 상단 radius와 bottom 방향은 기능상 유지하고 divider나 선택 marker를 새로 만들지 않습니다. grab handle은 장식이며 keyboard dismiss를 대신하지 않습니다. |
| Do | footer는 end 정렬과 space-2 action gap을 사용합니다. 작은 화면의 Sheet는 full-width CTA를 허용하며, 취소 액션의 시각 문법은 다른 dialog footer처럼 outlined + assistive를 사용합니다. |
| Don't | 제목은 aria-labelledby로 연결하고, 제목이 없으면 ariaLabel이 이름을 제공합니다. |

## Exceptions

- 제품 정책을 포함해야 하는 예외는 wrapper 또는 제품 저장소에서 조합하고 Sheet의 범용 API에 넣지 않습니다.
- 접근성 또는 안전 계약을 약화하는 예외는 허용하지 않으며 필요한 차이는 prompt와 Storybook 증거에 기록합니다.

## Related components

| Component | Relationship |
| --- | --- |
| `Button` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `CommandPalette` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `Drawer` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `Lightbox` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |

## Examples

### 기본 조합

```jsx
const firstOptionRef = useRef(null);

<Sheet
  open={open}
  title="정렬"
  initialFocusRef={firstOptionRef}
  onClose={close}
  footer={<Button full onClick={close}>적용</Button>}
>
  <button ref={firstOptionRef} type="button">최신순</button>
</Sheet>
```

## Tokens and API

### Tokens

- `--body2-size`
- `--color-semantic-background-elevated-normal`
- `--color-semantic-interaction-inactive`
- `--color-semantic-label-neutral`
- `--color-semantic-label-normal`
- `--component-dialog-scrim`
- `--component-dialog-scrim-blur`
- `--dur-base`
- `--dur-slow`
- `--ease-out`
- `--font-sans`
- `--fw-extra`
- `--headline1-size`
- `--radius-3xl`
- `--radius-pill`
- `--shadow-xl`
- `--space-2`

### Source contracts

- `components/overlay/Sheet.jsx`
- `components/overlay/Sheet.d.ts`
- `components/overlay/Sheet.prompt.md`
- `stories/OverlaySheet.stories.jsx`

## Migration

- 현재 prompt와 타입 계약에 기록되지 않은 legacy alias는 새 코드에서 도입하지 않습니다.
- 대체 컴포넌트가 생기면 기존 API의 제거 버전, 대응 prop과 자동·수동 전환 절차를 이 페이지에 기록합니다.

## Sources

- Sheet prompt contract: `components/overlay/Sheet.prompt.md`
- Storybook implementation evidence: `stories/OverlaySheet.stories.jsx`
- [WAI-ARIA APG Modal Dialog Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)
- [Fluent 2 Drawer](https://fluent2.microsoft.design/components/web/react/core/drawer/usage)
- [Material Web Dialog](https://m2.material.io/develop/web/components/dialogs)
- [SEED Sheet benchmark](https://seed-design.io/components/bottom-sheet)
