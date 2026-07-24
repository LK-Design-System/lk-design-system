# Modal

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Core / Overlay |
| Owner | `Modal` |
| Storybook | `LDS Core/Components/Overlay/Modal` |
| Source | `../component-content.json#core-components-overlay-modal` |

입력, 긴 설명, 여러 동작처럼 별도 집중 공간이 필요하지만 현재 페이지 맥락으로 돌아와야 하는 작업에 적합합니다. 짧은 확인만 필요하면 Alert나 Confirm Dialog를, 페이지 흐름을 막지 않는 정보에는 Drawer나 인라인 영역을 사용하세요.

## 사용 판단

### 사용

- 입력, 긴 설명, 여러 동작처럼 별도 집중 공간이 필요하지만 현재 페이지 맥락으로 돌아와야 하는 작업에 적합합니다. 짧은 확인만 필요하면 Alert나 Confirm Dialog를, 페이지 흐름을 막지 않는 정보에는 Drawer나 인라인 영역을 사용하세요.
- header/body는 space-5 space-6, footer는 space-4 space-6, action gap은 space-2를 사용합니다. 같은 footer 역할의 취소·보조 액션은 WDS 문법인 outlined + assistive, 확정 액션은 primary로 둡니다.
- Escape, scrim, 닫기 버튼은 controlled onClose를 호출합니다. 키보드 사용자를 위해 onClose와 보이는 닫기/취소 액션을 함께 제공합니다.
- 닫히면 기본적으로 실제 trigger로 복원합니다. 워크플로상 다음 요소가 더 적절하면 returnFocusRef, 복원이 의도적으로 불필요하면 restoreFocus={false}를 사용합니다.

### 사용하지 않음

- 시각 delta inventory: headline/body typography, header·body·footer spacing, --component-dialog-radius, divider, elevated fill/foreground, shadow, 20px 닫기 아이콘과 기존 Button 크기, hover/focus/disabled 처리는 모두 기존 값을 유지합니다. 선택/활성 marker와 방향 axis는 Modal이 소유하지 않습니다.
- title은 보이는 요소와 aria-labelledby로 연결합니다. 제목이 없으면 ariaLabel이 접근 가능한 이름을 제공합니다.
- 열리면 initialFocusRef가 가리키는 내부 요소를 먼저 포커스합니다. 유효하지 않으면 첫 tabbable 요소, 그것도 없으면 dialog 자체를 포커스합니다.
- 여러 modal surface를 의도적으로 중첩하지 않습니다. 불가피하게 Drawer 안에서 확인 Modal 등이 열리면 가장 나중에 열린 surface만 Escape와 focus trap을 소유하며, 닫힌 뒤 바로 아래 surface의 호출 지점으로 돌아갑니다.

## Anatomy

| Part | Contract |
| --- | --- |
| Root | Modal의 semantic role, layout containment와 전달받은 DOM 속성을 소유합니다. |
| Title | 보이는 제목. 제공하면 다이얼로그의 접근 가능한 이름으로 연결됩니다. |
| Children | children 속성으로 제공되는 공개 슬롯 또는 표시 영역입니다. |
| Footer | 푸터 노드(예: Button). |
| Aria Label | title이 없을 때 사용할 접근 가능한 이름. @default "모달" |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `open` | `boolean` | No | 열림 상태. @default false |
| `title` | `React.ReactNode` | No | 보이는 제목. 제공하면 다이얼로그의 접근 가능한 이름으로 연결됩니다. |
| `children` | `React.ReactNode` | No | 공개 타입 계약에 정의된 속성입니다. |
| `footer` | `React.ReactNode` | No | 푸터 노드(예: Button). |
| `onClose` | `() = void` | No | Escape, scrim, 닫기 액션이 호출하는 controlled dismiss callback. |
| `width` | `number` | No | 최대 너비(px). @default 520 |
| `closeOnScrim` | `boolean` | No | scrim 클릭으로 닫기. @default true |
| `initialFocusRef` | `React.RefObject` | No | 열릴 때 우선 초점을 받을 다이얼로그 내부 요소. |
| `returnFocusRef` | `React.RefObject` | No | 닫힌 뒤 자동으로 캡처한 trigger 대신 초점을 돌려보낼 요소. |
| `restoreFocus` | `boolean` | No | 닫힌 뒤 trigger 또는 returnFocusRef로 초점을 복원합니다. @default true |
| `ariaLabel` | `string` | No | title이 없을 때 사용할 접근 가능한 이름. @default "모달" |
| `style` | `React.CSSProperties` | No | 공개 타입 계약에 정의된 속성입니다. |

## States

| State | Contract |
| --- | --- |
| open | 열림 상태. @default false 타입 계약: boolean |
| 상호작용 · 초점 순환과 복원 | interaction 공개 스토리에서 렌더링 및 상호작용 증거를 유지합니다. |
| 반응형 · 좁은 폭과 긴 콘텐츠 | responsive 공개 스토리에서 렌더링 및 상호작용 증거를 유지합니다. |

## Behavior and interaction

- 가장 가까운 sibling은 ConfirmDialog, Alert, Drawer, Sheet입니다. ConfirmDialog의 초기 초점·Tab 순환·Escape·복원 동작을 공통 controller로 승격했습니다.
- Modal은 중앙 정렬, 최대 520px, 제목/닫기 header, 스크롤 body, 선택적 footer를 유지합니다. ConfirmDialog보다 넓고 콘텐츠 작업용이라는 기능 차이가 이 구조를 정당화합니다.
- 시각 delta inventory: headline/body typography, header·body·footer spacing, --component-dialog-radius, divider, elevated fill/foreground, shadow, 20px 닫기 아이콘과 기존 Button 크기, hover/focus/disabled 처리는 모두 기존 값을 유지합니다. 선택/활성 marker와 방향 axis는 Modal이 소유하지 않습니다.
- header/body는 space-5 space-6, footer는 space-4 space-6, action gap은 space-2를 사용합니다. 같은 footer 역할의 취소·보조 액션은 WDS 문법인 outlined + assistive, 확정 액션은 primary로 둡니다.
- body(children)는 aria-describedby로 다이얼로그에 연결합니다. ConfirmDialog·Alert와 동일한 규칙이며, 이름(제목)만 읽히고 본문이 누락되는 상태를 막습니다.

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 명시 규칙 1 | Modal은 중앙 정렬, 최대 520px, 제목/닫기 header, 스크롤 body, 선택적 footer를 유지합니다. ConfirmDialog보다 넓고 콘텐츠 작업용이라는 기능 차이가 이 구조를 정당화합니다. |
| 명시 규칙 2 | 시각 delta inventory: headline/body typography, header·body·footer spacing, --component-dialog-radius, divider, elevated fill/foreground, shadow, 20px 닫기 아이콘과 기존 Button 크기, hover/focus/disabled 처리는 모두 기존 값을 유지합니다. 선택/활성 marker와 방향 axis는 Modal이 소유하지 않습니다. |
| 명시 규칙 3 | header/body는 space-5 space-6, footer는 space-4 space-6, action gap은 space-2를 사용합니다. 같은 footer 역할의 취소·보조 액션은 WDS 문법인 outlined + assistive, 확정 액션은 primary로 둡니다. |
| 명시 규칙 4 | Fluent 2 Dialog: header/body/footer anatomy를 유지하고, 인지·확대 사용자의 맥락을 해치는 dialog 중첩은 권장 패턴에서 제외했습니다. |
| --body2-size | 15px |

## Responsive

- 320px 좁은 폭과 200% 텍스트 확대에서 페이지 가로 overflow 없이 의미 순서를 유지합니다.
- 고정 폭보다 부모 containment와 wrapping을 우선하고, 제품이 필요할 때 명시적으로 compact 표현을 선택합니다.

## Content and writing

- Modal은 중앙 정렬, 최대 520px, 제목/닫기 header, 스크롤 body, 선택적 footer를 유지합니다. ConfirmDialog보다 넓고 콘텐츠 작업용이라는 기능 차이가 이 구조를 정당화합니다.
- title은 보이는 요소와 aria-labelledby로 연결합니다. 제목이 없으면 ariaLabel이 접근 가능한 이름을 제공합니다.
- body(children)는 aria-describedby로 다이얼로그에 연결합니다. ConfirmDialog·Alert와 동일한 규칙이며, 이름(제목)만 읽히고 본문이 누락되는 상태를 막습니다.
- WAI-ARIA APG Modal Dialog Pattern: 내부 초기 초점, Tab/Shift+Tab 순환, Escape dismiss, 호출 지점 복귀, role="dialog"/aria-modal/접근 가능한 이름을 계약으로 채택했습니다.

## Accessibility

- 가장 가까운 sibling은 ConfirmDialog, Alert, Drawer, Sheet입니다. ConfirmDialog의 초기 초점·Tab 순환·Escape·복원 동작을 공통 controller로 승격했습니다.
- 시각 delta inventory: headline/body typography, header·body·footer spacing, --component-dialog-radius, divider, elevated fill/foreground, shadow, 20px 닫기 아이콘과 기존 Button 크기, hover/focus/disabled 처리는 모두 기존 값을 유지합니다. 선택/활성 marker와 방향 axis는 Modal이 소유하지 않습니다.
- header/body는 space-5 space-6, footer는 space-4 space-6, action gap은 space-2를 사용합니다. 같은 footer 역할의 취소·보조 액션은 WDS 문법인 outlined + assistive, 확정 액션은 primary로 둡니다.
- title은 보이는 요소와 aria-labelledby로 연결합니다. 제목이 없으면 ariaLabel이 접근 가능한 이름을 제공합니다.
- body(children)는 aria-describedby로 다이얼로그에 연결합니다. ConfirmDialog·Alert와 동일한 규칙이며, 이름(제목)만 읽히고 본문이 누락되는 상태를 막습니다.

## Do / Don't

| Kind | Guidance |
| --- | --- |
| Do | header/body는 space-5 space-6, footer는 space-4 space-6, action gap은 space-2를 사용합니다. 같은 footer 역할의 취소·보조 액션은 WDS 문법인 outlined + assistive, 확정 액션은 primary로 둡니다. |
| Don't | 시각 delta inventory: headline/body typography, header·body·footer spacing, --component-dialog-radius, divider, elevated fill/foreground, shadow, 20px 닫기 아이콘과 기존 Button 크기, hover/focus/disabled 처리는 모두 기존 값을 유지합니다. 선택/활성 marker와 방향 axis는 Modal이 소유하지 않습니다. |
| Do | Escape, scrim, 닫기 버튼은 controlled onClose를 호출합니다. 키보드 사용자를 위해 onClose와 보이는 닫기/취소 액션을 함께 제공합니다. |
| Don't | title은 보이는 요소와 aria-labelledby로 연결합니다. 제목이 없으면 ariaLabel이 접근 가능한 이름을 제공합니다. |

## Exceptions

- 제품 정책을 포함해야 하는 예외는 wrapper 또는 제품 저장소에서 조합하고 Modal의 범용 API에 넣지 않습니다.
- 접근성 또는 안전 계약을 약화하는 예외는 허용하지 않으며 필요한 차이는 prompt와 Storybook 증거에 기록합니다.

## Related components

| Component | Relationship |
| --- | --- |
| `Button` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `Alert` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `ConfirmDialog` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `Dimmer` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `DropdownMenu` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `Snackbar` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `Toast` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `ToastStack` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |

## Examples

### 기본 조합

```jsx
const firstFieldRef = useRef(null);

<Modal
  open={open}
  title="개입 문의"
  initialFocusRef={firstFieldRef}
  onClose={close}
  footer={(
    <>
      <Button variant="outlined" color="assistive" onClick={close}>취소</Button>
      <Button variant="signal">보내기</Button>
    </>
  )}
>
  <input ref={firstFieldRef} aria-label="회사명" />
</Modal>
```

## Tokens and API

### Tokens

- `--body2-size`
- `--color-semantic-background-elevated-normal`
- `--color-semantic-label-assistive`
- `--color-semantic-label-neutral`
- `--color-semantic-label-normal`
- `--color-semantic-line-solid-normal`
- `--component-dialog-radius`
- `--component-dialog-scrim`
- `--component-dialog-scrim-blur`
- `--font-sans`
- `--fw-extra`
- `--headline1-size`
- `--shadow-xl`
- `--space-2`
- `--space-4`
- `--space-5`
- `--space-6`

### Source contracts

- `components/overlay/Modal.jsx`
- `components/overlay/Modal.d.ts`
- `components/overlay/Modal.prompt.md`
- `stories/OverlayModal.stories.jsx`

## Migration

- Modal은 현재 화면을 일시적으로 차단하고 비교적 긴 단일 작업이나 상세 내용을 처리하는 범용 다이얼로그입니다. 분류는 LDS Core overlay이며, 이번 변경은 WDS variant axis가 아닌 접근성 호환 계약입니다.
- 현재 prompt와 타입 계약에 기록되지 않은 legacy alias는 새 코드에서 도입하지 않습니다.
- 대체 컴포넌트가 생기면 기존 API의 제거 버전, 대응 prop과 자동·수동 전환 절차를 이 페이지에 기록합니다.

## Sources

- Modal prompt contract: `components/overlay/Modal.prompt.md`
- Storybook implementation evidence: `stories/OverlayModal.stories.jsx`
- [Material Dialog guidance](https://m2.material.io/develop/web/components/dialogs)
- [WAI-ARIA APG Modal Dialog Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)
- [Fluent 2 Dialog](https://fluent2.microsoft.design/components/web/react/core/dialog/usage)
- [Fluent 2 Drawer](https://fluent2.microsoft.design/components/web/react/core/drawer/usage)
