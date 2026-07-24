# Dimmer

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Core / Overlay |
| Owner | `Dimmer` |
| Storybook | `LDS Core/Components/Overlay/Dimmer` |
| Source | `../component-content.json#core-components-overlay-dimmer` |

패널이나 카드 단위의 비동기 작업이 끝날 때까지 해당 영역만 사용할 수 없음을 보여줄 때 적합합니다. 페이지 전체를 막지 않아도 되는 작업에 사용하고, 진행 정도를 알려야 하면 Progress를 함께 제공하며 단순 장식용 어두운 배경에는 사용하지 마세요.

## 사용 판단

### 사용

- 패널이나 카드 단위의 비동기 작업이 끝날 때까지 해당 영역만 사용할 수 없음을 보여줄 때 적합합니다. 페이지 전체를 막지 않아도 되는 작업에 사용하고, 진행 정도를 알려야 하면 Progress를 함께 제공하며 단순 장식용 어두운 배경에는 사용하지 마세요.
- Dimmer는 차단 범위를 컨테이너 하나로 한정합니다. 페이지 전체를 막아야 하면 Dimmer가 아니라 Modal·ConfirmDialog처럼 useDialogFocus를 쓰는 다이얼로그 표면을 사용하세요.
- Dimmer 자체에는 초점 가능한 요소가 없습니다. 스크림 안에 버튼(예: 취소)을 두어야 하면 그 버튼은 inert 대상이 아니므로 그대로 도달할 수 있지만, 스크린 리더 사용자에게 그 존재를 알리는 문구를 children에 함께 넣으세요.
- - Dimmer는 차단 범위를 컨테이너 하나로 한정합니다. 페이지 전체를 막아야 하면 Dimmer가 아니라 Modal·ConfirmDialog처럼 useDialogFocus를 쓰는 다이얼로그 표면을 사용하세요. - 열려 있는 동안 가려진 콘텐츠는 inert이므로 Tab / Shift+Tab으로 도달할 수 없고 포인터 입력도 받지 않습니다. "가려 보이지만 조작되는" 상태를 만들지 않는 것이 이 컴포넌트의 핵심 계약입니다. - Dimmer는 포커스를 옮기지도, 가두지도 않습니다. 스크림이 열리기 직전에 형제 요소에 있던 초점은 inert로 인해 브라우저가 컨테이너 바….

### 사용하지 않음

- Escape는 처리하지 않습니다(차단 상태를 사용자가 임의로 해제하면 안 되는 경우가 기본). 해제 가능한 차단이면 onClick과 스크림 안의 명시적 취소 버튼을 함께 제공하세요.
- - Dimmer는 차단 범위를 컨테이너 하나로 한정합니다. 페이지 전체를 막아야 하면 Dimmer가 아니라 Modal·ConfirmDialog처럼 useDialogFocus를 쓰는 다이얼로그 표면을 사용하세요. - 열려 있는 동안 가려진 콘텐츠는 inert이므로 Tab / Shift+Tab으로 도달할 수 없고 포인터 입력도 받지 않습니다. "가려 보이지만 조작되는" 상태를 만들지 않는 것이 이 컴포넌트의 핵심 계약입니다. - Dimmer는 포커스를 옮기지도, 가두지도 않습니다. 스크림이 열리기 직전에 형제 요소에 있던 초점은 inert로 인해 브라우저가 컨테이너 바….
- Dimmer가 소유하지 않는 라우팅, 권한, 데이터 요청, 제품 임계값을 컴포넌트 내부에 넣지 않습니다.
- 동일한 목적을 더 단순한 native 요소나 기존 LDS primitive로 해결할 수 있으면 새 조합을 만들지 않습니다.

## Anatomy

| Part | Contract |
| --- | --- |
| Root | Dimmer의 semantic role, layout containment와 전달받은 DOM 속성을 소유합니다. |
| Block Interaction | 열려 있는 동안 같은 컨테이너의 형제 요소를 inert 처리해 Tab·포인터·보조기기에서 모두 제외합니다. 순수 장식용 스크림에서만 끄세요. @default true |
| Children | children 속성으로 제공되는 공개 슬롯 또는 표시 영역입니다. |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `open` | `boolean` | No | 공개 타입 계약에 정의된 속성입니다. |
| `blur` | `boolean` | No | 스크림 뒤를 블러. @default false |
| `blockInteraction` | `boolean` | No | 열려 있는 동안 같은 컨테이너의 형제 요소를 inert 처리해 Tab·포인터·보조기기에서 모두 제외합니다. 순수 장식용 스크림에서만 끄세요. @default true |
| `busy` | `boolean` | No | 컨테이너에 aria-busy="true"를 걸고 children을 role="status" 라이브 영역으로 노출해 처리 중 상태를 알립니다. @default true |
| `onClick` | `(e: React.MouseEvent) = void` | No | 공개 타입 계약에 정의된 속성입니다. |
| `children` | `React.ReactNode` | No | 공개 타입 계약에 정의된 속성입니다. |

## States

| State | Contract |
| --- | --- |
| open | 공개 타입 계약에 정의된 속성입니다. 타입 계약: boolean |
| busy | 컨테이너에 aria-busy="true"를 걸고 children을 role="status" 라이브 영역으로 노출해 처리 중 상태를 알립니다. @default true 타입 계약: boolean |
| 상호작용 · 차단 범위와 키보드 | interaction 공개 스토리에서 렌더링 및 상호작용 증거를 유지합니다. |

## Behavior and interaction

- open — 표시 여부. blur — 뒤 블러. onClick — 예: 닫기. 전체 화면 모달 스크림에는 Modal / Alert를 쓰세요.
- blockInteraction(기본 true) — 열려 있는 동안 같은 컨테이너의 형제 요소에 inert를 걸어 가려진 버튼·입력을 Tab 순서와 접근성 트리에서 함께 제거합니다. busy(기본 true) — 컨테이너에 aria-busy="true"를 걸고 children을 role="status"로 노출합니다.
- Dimmer는 차단 범위를 컨테이너 하나로 한정합니다. 페이지 전체를 막아야 하면 Dimmer가 아니라 Modal·ConfirmDialog처럼 useDialogFocus를 쓰는 다이얼로그 표면을 사용하세요.
- 열려 있는 동안 가려진 콘텐츠는 inert이므로 Tab / Shift+Tab으로 도달할 수 없고 포인터 입력도 받지 않습니다. "가려 보이지만 조작되는" 상태를 만들지 않는 것이 이 컴포넌트의 핵심 계약입니다.
- Dimmer는 포커스를 옮기지도, 가두지도 않습니다. 스크림이 열리기 직전에 형제 요소에 있던 초점은 inert로 인해 브라우저가 컨테이너 바깥으로 이동시킵니다. 처리 후 특정 요소로 초점을 되돌려야 하는 흐름은 제품이 소유합니다.

## 정량 규칙

| Subject | Rule |
| --- | --- |
| --color-semantic-inverse-background | light: #1B1C1E; dark: #FFFFFF |
| --color-semantic-inverse-label | light: #FFFFFF; dark: #171719 |
| --component-dialog-scrim-blur | 2px |
| --radius-md | 12px |

## Responsive

- 320px 좁은 폭과 200% 텍스트 확대에서 페이지 가로 overflow 없이 의미 순서를 유지합니다.
- 고정 폭보다 부모 containment와 wrapping을 우선하고, 제품이 필요할 때 명시적으로 compact 표현을 선택합니다.

## Content and writing

- Dimmer 자체에는 초점 가능한 요소가 없습니다. 스크림 안에 버튼(예: 취소)을 두어야 하면 그 버튼은 inert 대상이 아니므로 그대로 도달할 수 있지만, 스크린 리더 사용자에게 그 존재를 알리는 문구를 children에 함께 넣으세요.
- 상태 안내: children에 "처리 중", "동기화 중" 같은 텍스트 레이블을 포함하세요. role="status"로 정중하게 announce되며, 컨테이너의 aria-busy="true"가 진행 중임을 함께 노출합니다. 아이콘·스피너만 두면 보조기기에는 아무것도 전달되지 않습니다.
- - Dimmer는 차단 범위를 컨테이너 하나로 한정합니다. 페이지 전체를 막아야 하면 Dimmer가 아니라 Modal·ConfirmDialog처럼 useDialogFocus를 쓰는 다이얼로그 표면을 사용하세요. - 열려 있는 동안 가려진 콘텐츠는 inert이므로 Tab / Shift+Tab으로 도달할 수 없고 포인터 입력도 받지 않습니다. "가려 보이지만 조작되는" 상태를 만들지 않는 것이 이 컴포넌트의 핵심 계약입니다. - Dimmer는 포커스를 옮기지도, 가두지도 않습니다. 스크림이 열리기 직전에 형제 요소에 있던 초점은 inert로 인해 브라우저가 컨테이너 바….
- 사용자에게 보이는 Dimmer 문자열은 제품 번역 계층에서 제공하고 행동 또는 상태를 구체적으로 설명합니다.

## Accessibility

- blockInteraction(기본 true) — 열려 있는 동안 같은 컨테이너의 형제 요소에 inert를 걸어 가려진 버튼·입력을 Tab 순서와 접근성 트리에서 함께 제거합니다. busy(기본 true) — 컨테이너에 aria-busy="true"를 걸고 children을 role="status"로 노출합니다.
- Dimmer는 차단 범위를 컨테이너 하나로 한정합니다. 페이지 전체를 막아야 하면 Dimmer가 아니라 Modal·ConfirmDialog처럼 useDialogFocus를 쓰는 다이얼로그 표면을 사용하세요.
- 열려 있는 동안 가려진 콘텐츠는 inert이므로 Tab / Shift+Tab으로 도달할 수 없고 포인터 입력도 받지 않습니다. "가려 보이지만 조작되는" 상태를 만들지 않는 것이 이 컴포넌트의 핵심 계약입니다.
- Dimmer는 포커스를 옮기지도, 가두지도 않습니다. 스크림이 열리기 직전에 형제 요소에 있던 초점은 inert로 인해 브라우저가 컨테이너 바깥으로 이동시킵니다. 처리 후 특정 요소로 초점을 되돌려야 하는 흐름은 제품이 소유합니다.
- Dimmer 자체에는 초점 가능한 요소가 없습니다. 스크림 안에 버튼(예: 취소)을 두어야 하면 그 버튼은 inert 대상이 아니므로 그대로 도달할 수 있지만, 스크린 리더 사용자에게 그 존재를 알리는 문구를 children에 함께 넣으세요.

## Do / Don't

| Kind | Guidance |
| --- | --- |
| Do | Dimmer는 차단 범위를 컨테이너 하나로 한정합니다. 페이지 전체를 막아야 하면 Dimmer가 아니라 Modal·ConfirmDialog처럼 useDialogFocus를 쓰는 다이얼로그 표면을 사용하세요. |
| Don't | Escape는 처리하지 않습니다(차단 상태를 사용자가 임의로 해제하면 안 되는 경우가 기본). 해제 가능한 차단이면 onClick과 스크림 안의 명시적 취소 버튼을 함께 제공하세요. |
| Do | Dimmer 자체에는 초점 가능한 요소가 없습니다. 스크림 안에 버튼(예: 취소)을 두어야 하면 그 버튼은 inert 대상이 아니므로 그대로 도달할 수 있지만, 스크린 리더 사용자에게 그 존재를 알리는 문구를 children에 함께 넣으세요. |
| Don't | - Dimmer는 차단 범위를 컨테이너 하나로 한정합니다. 페이지 전체를 막아야 하면 Dimmer가 아니라 Modal·ConfirmDialog처럼 useDialogFocus를 쓰는 다이얼로그 표면을 사용하세요. - 열려 있는 동안 가려진 콘텐츠는 inert이므로 Tab / Shift+Tab으로 도달할 수 없고 포인터 입력도 받지 않습니다. "가려 보이지만 조작되는" 상태를 만들지 않는 것이 이 컴포넌트의 핵심 계약입니다. - Dimmer는 포커스를 옮기지도, 가두지도 않습니다. 스크림이 열리기 직전에 형제 요소에 있던 초점은 inert로 인해 브라우저가 컨테이너 바…. |

## Exceptions

- 제품 정책을 포함해야 하는 예외는 wrapper 또는 제품 저장소에서 조합하고 Dimmer의 범용 API에 넣지 않습니다.
- 접근성 또는 안전 계약을 약화하는 예외는 허용하지 않으며 필요한 차이는 prompt와 Storybook 증거에 기록합니다.

## Related components

| Component | Relationship |
| --- | --- |
| `Button` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `Spinner` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `Alert` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `ConfirmDialog` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `DropdownMenu` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `Modal` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `Snackbar` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `Toast` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |

## Examples

### 기본 조합

```jsx
<div style={{ position: 'relative' }}>
  <Card>…</Card>
  <Dimmer open={loading}><Spinner color="#fff" /></Dimmer>
</div>
```

## Tokens and API

### Tokens

- `--color-semantic-inverse-background`
- `--color-semantic-inverse-label`
- `--component-dialog-scrim`
- `--component-dialog-scrim-blur`
- `--radius-md`
- `--shadow-sm`
- `--space-2`
- `--space-3`

### Source contracts

- `components/overlay/Dimmer.jsx`
- `components/overlay/Dimmer.d.ts`
- `components/overlay/Dimmer.prompt.md`
- `stories/OverlayDimmer.stories.jsx`

## Migration

- 현재 prompt와 타입 계약에 기록되지 않은 legacy alias는 새 코드에서 도입하지 않습니다.
- 대체 컴포넌트가 생기면 기존 API의 제거 버전, 대응 prop과 자동·수동 전환 절차를 이 페이지에 기록합니다.

## Sources

- Dimmer prompt contract: `components/overlay/Dimmer.prompt.md`
- Storybook implementation evidence: `stories/OverlayDimmer.stories.jsx`
