# Confirm Dialog

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Core / Overlay |
| Owner | `ConfirmDialog` |
| Storybook | `LDS Core/Components/Overlay/Confirm Dialog` |
| Source | `../component-content.json#core-components-overlay-confirm-dialog` |

삭제·초기화·권한 해제처럼 결과가 크고 사용자의 명시적 동의가 필요한 단일 결정에 적합합니다. 설명·입력·여러 단계가 필요한 작업에는 Modal을, 위험도가 낮고 되돌릴 수 있는 동작에는 즉시 실행 후 Toast로 결과를 알리는 방식을 고려하세요.

## 사용 판단

### 사용

- 삭제·초기화·권한 해제처럼 결과가 크고 사용자의 명시적 동의가 필요한 단일 결정에 적합합니다. 설명·입력·여러 단계가 필요한 작업에는 Modal을, 위험도가 낮고 되돌릴 수 있는 동작에는 즉시 실행 후 Toast로 결과를 알리는 방식을 고려하세요.
- 파괴적 액션은 tone="danger"와 구체적인 confirmLabel을 사용합니다.
- 조건이 충족되기 전에는 confirmDisabled, 요청 중에는 confirmLoading을 사용해 중복 실행을 막습니다.
- 안전한 기본 경로인 취소는 WDS 보조 액션 문법 variant="outlined" color="assistive", 확인은 기본 primary(파괴적일 때 danger)로 표현합니다. Modal·Drawer footer도 같은 보조 액션 문법을 씁니다.

### 사용하지 않음

- 닫힌 뒤 별도 위치로 이동해야 하면 returnFocusRef, 의도적으로 복원하지 않을 때만 restoreFocus={false}를 사용합니다.
- - generic content modal에는 Modal, 단순 알림에는 Alert, 명시적 확인에는 ConfirmDialog를 쓰세요. - 파괴적 액션은 tone="danger"와 구체적인 confirmLabel을 사용합니다. - tone="warning"/"danger"는 색상만 바꾸지 않고 StatusBadge의 주의/위험 텍스트를 함께 노출합니다. 제품 용어가 필요하면 toneLabel을 전달합니다. - 조건이 충족되기 전에는 confirmDisabled, 요청 중에는 confirmLoading을 사용해 중복 실행을 막습니다. - 하단 CTA는 ActionA….
- ConfirmDialog는 route 전환, 비동기 실패 정책, 파괴적 작업 권한을 소유하지 않습니다. 제품은 controlled open 상태와 실제 실행 정책을 연결합니다.
- Confirm Dialog가 소유하지 않는 라우팅, 권한, 데이터 요청, 제품 임계값을 컴포넌트 내부에 넣지 않습니다.

## Anatomy

| Part | Contract |
| --- | --- |
| Root | ConfirmDialog의 semantic role, layout containment와 전달받은 DOM 속성을 소유합니다. |
| Title | 다이얼로그 제목. |
| Children | children 속성으로 제공되는 공개 슬롯 또는 표시 영역입니다. |
| Tone Label | warning/danger 상태의 표시 라벨. |
| Confirm Label | 확인 버튼 라벨. @default "확인" |
| Cancel Label | 취소 버튼 라벨. @default "취소" |
| Confirm Loading Label | pending 상태의 접근 가능한 라벨. @default "처리 중" |
| Aria Label | title이 없을 때 사용할 접근 가능한 이름. @default "확인 다이얼로그" |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `open` | `boolean` | No | 열림 상태. @default false |
| `title` | `React.ReactNode` | No | 다이얼로그 제목. |
| `children` | `React.ReactNode` | No | 본문. |
| `tone` | `'default' \| 'danger' \| 'warning'` | No | 확인 액션 톤. @default "default" |
| `toneLabel` | `React.ReactNode` | No | warning/danger 상태의 표시 라벨. |
| `headingLevel` | `2 \| 3 \| 4 \| 5 \| 6` | No | 제목 heading level. @default 2 |
| `confirmLabel` | `React.ReactNode` | No | 확인 버튼 라벨. @default "확인" |
| `cancelLabel` | `React.ReactNode` | No | 취소 버튼 라벨. @default "취소" |
| `confirmDisabled` | `boolean` | No | 선행 조건이 충족되지 않았을 때 확인 액션을 비활성화합니다. @default false |
| `confirmLoading` | `boolean` | No | 확인 요청 중 pending 상태를 표시하고 중복 실행을 막습니다. @default false |
| `confirmLoadingLabel` | `string` | No | pending 상태의 접근 가능한 라벨. @default "처리 중" |
| `onConfirm` | `React.MouseEventHandler` | No | 확인 클릭 콜백. |
| `onCancel` | `() = void` | No | 취소 클릭 또는 scrim/Escape dismiss 콜백. |
| `onClose` | `() = void` | No | onCancel이 없을 때 쓰는 닫기 콜백. |
| `closeOnScrim` | `boolean` | No | scrim 클릭으로 닫기. @default true |
| `initialFocusRef` | `React.RefObject` | No | 열릴 때 우선 초점을 받을 ConfirmDialog 내부 요소. 기본값은 취소 액션입니다. |
| `returnFocusRef` | `React.RefObject` | No | 닫힌 뒤 자동으로 캡처한 trigger 대신 초점을 돌려보낼 요소. |
| `restoreFocus` | `boolean` | No | 닫힌 뒤 trigger 또는 returnFocusRef로 초점을 복원합니다. @default true |
| `ariaLabel` | `string` | No | title이 없을 때 사용할 접근 가능한 이름. @default "확인 다이얼로그" |

## States

| State | Contract |
| --- | --- |
| open | 열림 상태. @default false 타입 계약: boolean |
| tone | 확인 액션 톤. @default "default" 타입 계약: 'default' \| 'danger' \| 'warning' |
| toneLabel | warning/danger 상태의 표시 라벨. 타입 계약: React.ReactNode |
| confirmDisabled | 선행 조건이 충족되지 않았을 때 확인 액션을 비활성화합니다. @default false 타입 계약: boolean |
| confirmLoading | 확인 요청 중 pending 상태를 표시하고 중복 실행을 막습니다. @default false 타입 계약: boolean |
| confirmLoadingLabel | pending 상태의 접근 가능한 라벨. @default "처리 중" 타입 계약: string |

## Behavior and interaction

- Modal, Drawer, Sheet와 같은 공통 overlay focus controller를 사용합니다. 열리면 기본적으로 취소 액션으로 초점을 이동하고, 필요하면 initialFocusRef로 다른 내부 요소를 지정할 수 있습니다.
- Tab/Shift+Tab, 외부 focus containment, Escape는 현재 stack의 최상위 overlay만 소유합니다. ConfirmDialog가 다른 modal surface 위에서 닫히면 그 surface 내부의 호출 지점으로 돌아가며, base surface까지 닫힐 때 페이지 trigger로 복원합니다.
- 닫힌 뒤 별도 위치로 이동해야 하면 returnFocusRef, 의도적으로 복원하지 않을 때만 restoreFocus={false}를 사용합니다.
- 열려 있는 동안 배경 페이지 스크롤이 잠깁니다. 공용 useDialogFocus 엔진이 중첩 깊이를 세어 마지막 overlay가 닫힐 때만 해제하며, 스크롤바 제거로 인한 layout shift는 body padding으로 보정합니다.
- 가장 가까운 sibling은 Modal, Drawer, Sheet, Alert입니다. 중앙 배치, 최대 너비, badge, 제목·설명, ActionArea 구조와 시각 token은 그대로 두고 focus/Escape 계층만 동일한 modal 계약으로 정렬했습니다.

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 명시 규칙 1 | 하단 CTA는 ActionArea align="end"와 기본 Button medium 높이(40px)를 따르며, 버튼 사이는 spacing token 8px을 유지합니다. |
| 명시 규칙 2 | 가장 가까운 sibling은 Modal, Drawer, Sheet, Alert입니다. 중앙 배치, 최대 너비, badge, 제목·설명, ActionArea 구조와 시각 token은 그대로 두고 focus/Escape 계층만 동일한 modal 계약으로 정렬했습니다. |
| 명시 규칙 3 | Fluent 2 Dialog: 확인 surface의 분명한 제목·본문·동작 구조를 유지하고, 불가피한 중첩에서는 최상위 surface만 상호작용하도록 했습니다. |
| 명시 규칙 4 | - generic content modal에는 Modal, 단순 알림에는 Alert, 명시적 확인에는 ConfirmDialog를 쓰세요. - 파괴적 액션은 tone="danger"와 구체적인 confirmLabel을 사용합니다. - tone="warning"/"danger"는 색상만 바꾸지 않고 StatusBadge의 주의/위험 텍스트를 함께 노출합니다. 제품 용어가 필요하면 toneLabel을 전달합니다. - 조건이 충족되기 전에는 confirmDisabled, 요청 중에는 confirmLoading을 사용해 중복 실행을 막습니다. - 하단 CTA는 ActionA… |
| --color-semantic-background-elevated-normal | light: #FFFFFF; dark: #212225 |

## Responsive

- 하단 CTA는 ActionArea align="end"와 기본 Button medium 높이(40px)를 따르며, 버튼 사이는 spacing token 8px을 유지합니다.
- 가장 가까운 sibling은 Modal, Drawer, Sheet, Alert입니다. 중앙 배치, 최대 너비, badge, 제목·설명, ActionArea 구조와 시각 token은 그대로 두고 focus/Escape 계층만 동일한 modal 계약으로 정렬했습니다.
- - generic content modal에는 Modal, 단순 알림에는 Alert, 명시적 확인에는 ConfirmDialog를 쓰세요. - 파괴적 액션은 tone="danger"와 구체적인 confirmLabel을 사용합니다. - tone="warning"/"danger"는 색상만 바꾸지 않고 StatusBadge의 주의/위험 텍스트를 함께 노출합니다. 제품 용어가 필요하면 toneLabel을 전달합니다. - 조건이 충족되기 전에는 confirmDisabled, 요청 중에는 confirmLoading을 사용해 중복 실행을 막습니다. - 하단 CTA는 ActionA….
- - 가장 가까운 sibling은 Modal, Drawer, Sheet, Alert입니다. 중앙 배치, 최대 너비, badge, 제목·설명, ActionArea 구조와 시각 token은 그대로 두고 focus/Escape 계층만 동일한 modal 계약으로 정렬했습니다. - WAI-ARIA APG Modal Dialog Pattern: 내부 초기 초점, Tab/Shift+Tab 순환, Escape dismiss, 호출 지점 복귀, role="dialog"/aria-modal/접근 가능한 이름을 계약으로 채택했습니다. - Fluent 2 Dialog: 확인 surface….

## Content and writing

- 파괴적 액션은 tone="danger"와 구체적인 confirmLabel을 사용합니다.
- tone="warning"/"danger"는 색상만 바꾸지 않고 StatusBadge의 주의/위험 텍스트를 함께 노출합니다. 제품 용어가 필요하면 toneLabel을 전달합니다.
- 가장 가까운 sibling은 Modal, Drawer, Sheet, Alert입니다. 중앙 배치, 최대 너비, badge, 제목·설명, ActionArea 구조와 시각 token은 그대로 두고 focus/Escape 계층만 동일한 modal 계약으로 정렬했습니다.
- WAI-ARIA APG Modal Dialog Pattern: 내부 초기 초점, Tab/Shift+Tab 순환, Escape dismiss, 호출 지점 복귀, role="dialog"/aria-modal/접근 가능한 이름을 계약으로 채택했습니다.

## Accessibility

- Modal, Drawer, Sheet와 같은 공통 overlay focus controller를 사용합니다. 열리면 기본적으로 취소 액션으로 초점을 이동하고, 필요하면 initialFocusRef로 다른 내부 요소를 지정할 수 있습니다.
- Tab/Shift+Tab, 외부 focus containment, Escape는 현재 stack의 최상위 overlay만 소유합니다. ConfirmDialog가 다른 modal surface 위에서 닫히면 그 surface 내부의 호출 지점으로 돌아가며, base surface까지 닫힐 때 페이지 trigger로 복원합니다.
- 닫힌 뒤 별도 위치로 이동해야 하면 returnFocusRef, 의도적으로 복원하지 않을 때만 restoreFocus={false}를 사용합니다.
- 열려 있는 동안 배경 페이지 스크롤이 잠깁니다. 공용 useDialogFocus 엔진이 중첩 깊이를 세어 마지막 overlay가 닫힐 때만 해제하며, 스크롤바 제거로 인한 layout shift는 body padding으로 보정합니다.
- 가장 가까운 sibling은 Modal, Drawer, Sheet, Alert입니다. 중앙 배치, 최대 너비, badge, 제목·설명, ActionArea 구조와 시각 token은 그대로 두고 focus/Escape 계층만 동일한 modal 계약으로 정렬했습니다.

## Do / Don't

| Kind | Guidance |
| --- | --- |
| Do | 파괴적 액션은 tone="danger"와 구체적인 confirmLabel을 사용합니다. |
| Don't | 닫힌 뒤 별도 위치로 이동해야 하면 returnFocusRef, 의도적으로 복원하지 않을 때만 restoreFocus={false}를 사용합니다. |
| Do | 조건이 충족되기 전에는 confirmDisabled, 요청 중에는 confirmLoading을 사용해 중복 실행을 막습니다. |
| Don't | - generic content modal에는 Modal, 단순 알림에는 Alert, 명시적 확인에는 ConfirmDialog를 쓰세요. - 파괴적 액션은 tone="danger"와 구체적인 confirmLabel을 사용합니다. - tone="warning"/"danger"는 색상만 바꾸지 않고 StatusBadge의 주의/위험 텍스트를 함께 노출합니다. 제품 용어가 필요하면 toneLabel을 전달합니다. - 조건이 충족되기 전에는 confirmDisabled, 요청 중에는 confirmLoading을 사용해 중복 실행을 막습니다. - 하단 CTA는 ActionA…. |

## Exceptions

- 제품 정책을 포함해야 하는 예외는 wrapper 또는 제품 저장소에서 조합하고 ConfirmDialog의 범용 API에 넣지 않습니다.
- 접근성 또는 안전 계약을 약화하는 예외는 허용하지 않으며 필요한 차이는 prompt와 Storybook 증거에 기록합니다.

## Related components

| Component | Relationship |
| --- | --- |
| `Button` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `Modal` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `Alert` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `Dimmer` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `DropdownMenu` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `Snackbar` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `Toast` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `ToastStack` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |

## Examples

### 기본 조합

```jsx
<ConfirmDialog
  open={open}
  tone="danger"
  title="경로를 초기화할까요?"
  confirmLabel="초기화"
  cancelLabel="취소"
  confirmDisabled={!ready}
  confirmLoading={submitting}
  onConfirm={resetRoute}
  onCancel={() => setOpen(false)}
>
  저장되지 않은 waypoint 변경 사항이 사라집니다.
</ConfirmDialog>
```

## Tokens and API

### Tokens

- `--color-semantic-background-elevated-normal`
- `--color-semantic-label-neutral`
- `--color-semantic-label-normal`
- `--component-confirm-dialog-max-width`
- `--component-dialog-radius`
- `--component-dialog-scrim`
- `--component-dialog-scrim-blur`
- `--font-sans`
- `--fw-extra`
- `--heading3-line`
- `--heading3-size`
- `--label1-line`
- `--label1-size`
- `--shadow-xl`
- `--space-2`
- `--space-4`
- `--space-6`

### Source contracts

- `components/overlay/ConfirmDialog.jsx`
- `components/overlay/ConfirmDialog.d.ts`
- `components/overlay/ConfirmDialog.prompt.md`
- `stories/OverlayConfirmDialog.stories.jsx`

## Migration

- 현재 prompt와 타입 계약에 기록되지 않은 legacy alias는 새 코드에서 도입하지 않습니다.
- 대체 컴포넌트가 생기면 기존 API의 제거 버전, 대응 prop과 자동·수동 전환 절차를 이 페이지에 기록합니다.

## Sources

- ConfirmDialog prompt contract: `components/overlay/ConfirmDialog.prompt.md`
- Storybook implementation evidence: `stories/OverlayConfirmDialog.stories.jsx`
- [WAI-ARIA APG Modal Dialog Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)
- [Fluent 2 Dialog](https://fluent2.microsoft.design/components/web/react/core/dialog/usage)
- [SEED Confirm Dialog benchmark](https://seed-design.io/components/alert-dialog)
