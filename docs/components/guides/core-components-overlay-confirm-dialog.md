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

- 조건이 충족되기 전에는 confirmDisabled, 요청 중에는 confirmLoading을 사용해 중복 실행을 막습니다.
- 안전한 기본 경로인 취소는 WDS 보조 액션 문법 variant="outlined" color="assistive", 확인은 기본 primary(파괴적일 때 danger)로 표현합니다. Modal·Drawer footer도 같은 보조 액션 문법을 씁니다.
- 기본 withinPortal=true이며 LdsProvider.portalTarget 또는 명시적 portalTarget에 렌더링됩니다. 가까운 theme scope와 dir을 상속하고 clipping ancestor를 벗어납니다.

### 사용하지 않음

- 테스트·특수 embedding에서만 withinPortal=false를 사용하며 이 경우 background inert는 적용하지 않습니다.
- ConfirmDialog는 route 전환, 비동기 실패 정책, 파괴적 작업 권한을 소유하지 않습니다. 제품은 controlled open 상태와 실제 실행 정책을 연결합니다.

## Anatomy

| Part | Contract |
| --- | --- |
| title | 다이얼로그 제목. |
| confirmLabel | 확인 버튼 라벨. @default "확인" |
| cancelLabel | 취소 버튼 라벨. @default "취소" |
| confirmLoadingLabel | pending 상태의 접근 가능한 라벨. @default "처리 중" |
| ariaLabel | title이 없을 때 사용할 접근 가능한 이름. @default "확인 다이얼로그" |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `open` | `boolean` | No | 열림 상태. @default false |
| `title` | `React.ReactNode` | No | 다이얼로그 제목. |
| `children` | `React.ReactNode` | No | 본문. |
| `tone` | `'default' \| 'danger' \| 'warning'` | No | 확인 액션 톤. @default "default" |
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
| `withinPortal` | `boolean` | No | Render at the owner-document Portal boundary. @default true |
| `portalTarget` | `HTMLElement \| null` | No |  |
| `zIndex` | `number` | No |  |

## States

| State | Contract |
| --- | --- |
| open | 열림 상태. @default false |
| tone | 확인 액션 톤. @default "default" |
| confirmDisabled | 선행 조건이 충족되지 않았을 때 확인 액션을 비활성화합니다. @default false |
| confirmLoading | 확인 요청 중 pending 상태를 표시하고 중복 실행을 막습니다. @default false |
| confirmLoadingLabel | pending 상태의 접근 가능한 라벨. @default "처리 중" |

## Behavior and interaction

- ConfirmDialog — 삭제, reset, 배포, 원격 제어처럼 되돌리기 어렵거나 안전 영향이 있는 액션을 확인하는 전용 다이얼로그.

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 명시 규칙 1 | 하단 CTA는 ActionArea align="end"와 기본 Button medium 높이(40px)를 따르며, 버튼 사이는 spacing token 8px을 유지합니다. |
| 명시 규칙 2 | 활자는 Modal·Sheet·Drawer와 같은 단을 씁니다 — 제목 --headline1-(18px) --fw-extra, 본문 --body2-size(15px) line-height: 1.7 --color-semantic-label-neutral. 이 넷은 한 가족이라 묻는 창만 다른 위계를 가질 이유가 없습니다. 한때 제목이 --heading3-으로 적혀 있었는데 그 토큰은 램프에 없습니다(heading 22/20, headline 18/17, body 16/15, label 14/13). |
| 명시 규칙 3 | 가장 가까운 sibling은 Modal, Drawer, Sheet, Alert입니다. 중앙 배치, 최대 너비, 제목·설명, ActionArea 구조와 시각 token은 그대로 두고 focus/Escape 계층만 동일한 modal 계약으로 정렬했습니다. |
| 명시 규칙 4 | Fluent 2 Dialog: 확인 surface의 분명한 제목·본문·동작 구조를 유지하고, 불가피한 중첩에서는 최상위 surface만 상호작용하도록 했습니다. |
| --body2-size | 15px |

## Content and writing

- 파괴적 액션은 tone="danger"와 구체적인 confirmLabel을 사용합니다.
- tone="danger"는 확인 버튼에 파괴적 스타일을 적용합니다. 위험의 내용과 결과는 별도 상태 뱃지 대신 구체적인 제목·본문·동작 라벨로 설명합니다.

## Accessibility

- Modal, Drawer, Sheet와 같은 공통 overlay focus controller를 사용합니다. 열리면 기본적으로 취소 액션으로 초점을 이동하고, 필요하면 initialFocusRef로 다른 내부 요소를 지정할 수 있습니다.
- Tab/Shift+Tab, 외부 focus containment, Escape는 현재 stack의 최상위 overlay만 소유합니다. ConfirmDialog가 다른 modal surface 위에서 닫히면 그 surface 내부의 호출 지점으로 돌아가며, base surface까지 닫힐 때 페이지 trigger로 복원합니다.
- 닫힌 뒤 별도 위치로 이동해야 하면 returnFocusRef, 의도적으로 복원하지 않을 때만 restoreFocus={false}를 사용합니다.
- 열려 있는 동안 배경 페이지 스크롤이 잠깁니다. 공용 useDialogFocus 엔진이 중첩 깊이를 세어 마지막 overlay가 닫힐 때만 해제하며, 스크롤바 제거로 인한 layout shift는 body padding으로 보정합니다.
- 공통 overlay stack이 중첩 순서, topmost Escape, background inert, body scroll lock과 focus 복원을 소유합니다. zIndex는 예외적 override입니다.

## Related components

| Component | Relationship |
| --- | --- |
| `Button` | 대표 시나리오에서 조합 |
| `Modal` | 대표 시나리오에서 조합 |
| `Alert` | 대표 시나리오에서 조합 |
| `Dimmer` | 대표 시나리오에서 조합 |
| `DropdownMenu` | 대표 시나리오에서 조합 |
| `Snackbar` | 대표 시나리오에서 조합 |
| `Toast` | 대표 시나리오에서 조합 |
| `ToastStack` | 대표 시나리오에서 조합 |

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

- `--body2-size`
- `--color-semantic-background-elevated-normal`
- `--color-semantic-label-neutral`
- `--color-semantic-label-normal`
- `--component-confirm-dialog-max-width`
- `--component-dialog-radius`
- `--component-dialog-scrim`
- `--component-dialog-scrim-blur`
- `--font-sans`
- `--fw-extra`
- `--headline1-line`
- `--headline1-size`
- `--shadow-xl`
- `--space-2`
- `--space-4`
- `--space-6`

### Source contracts

- `components/overlay/ConfirmDialog.jsx`
- `components/overlay/ConfirmDialog.d.ts`
- `components/overlay/ConfirmDialog.prompt.md`
- `stories/OverlayConfirmDialog.stories.jsx`

## Sources

- ConfirmDialog prompt contract: `components/overlay/ConfirmDialog.prompt.md`
- Storybook implementation evidence: `stories/OverlayConfirmDialog.stories.jsx`
- [WAI-ARIA APG Modal Dialog Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)
- [Fluent 2 Dialog](https://fluent2.microsoft.design/components/web/react/core/dialog/usage)
