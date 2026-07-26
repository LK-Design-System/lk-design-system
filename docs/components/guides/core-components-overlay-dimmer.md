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

### 사용하지 않음

- Escape는 처리하지 않습니다(차단 상태를 사용자가 임의로 해제하면 안 되는 경우가 기본). 해제 가능한 차단이면 onClick과 스크림 안의 명시적 취소 버튼을 함께 제공하세요.

## Anatomy

| Part | Contract |
| --- | --- |
| blockInteraction | 열려 있는 동안 같은 컨테이너의 형제 요소를 inert 처리해 Tab·포인터·보조기기에서 모두 제외합니다. 순수 장식용 스크림에서만 끄세요. @default true |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `open` | `boolean` | No |  |
| `blur` | `boolean` | No | 스크림 뒤를 블러. @default false |
| `blockInteraction` | `boolean` | No | 열려 있는 동안 같은 컨테이너의 형제 요소를 inert 처리해 Tab·포인터·보조기기에서 모두 제외합니다. 순수 장식용 스크림에서만 끄세요. @default true |
| `busy` | `boolean` | No | 컨테이너에 aria-busy="true"를 걸고 children을 role="status" 라이브 영역으로 노출해 처리 중 상태를 알립니다. @default true |
| `onClick` | `(e: React.MouseEvent) = void` | No |  |
| `children` | `React.ReactNode` | No |  |

## States

| State | Contract |
| --- | --- |
| busy | 컨테이너에 aria-busy="true"를 걸고 children을 role="status" 라이브 영역으로 노출해 처리 중 상태를 알립니다. @default true |

## Behavior and interaction

- open — 표시 여부. blur — 뒤 블러. onClick — 예: 닫기. 전체 화면 모달 스크림에는 Modal / Alert를 쓰세요.
- 키보드 · 보조기기 계약.

## 정량 규칙

| Subject | Rule |
| --- | --- |
| --color-semantic-inverse-background | light: #1B1C1E; dark: #FFFFFF |
| --color-semantic-inverse-label | light: #FFFFFF; dark: #171719 |
| --component-dialog-scrim-blur | 2px |
| --radius-md | 12px |

## Accessibility

- blockInteraction(기본 true) — 열려 있는 동안 같은 컨테이너의 형제 요소에 inert를 걸어 가려진 버튼·입력을 Tab 순서와 접근성 트리에서 함께 제거합니다. busy(기본 true) — 컨테이너에 aria-busy="true"를 걸고 children을 role="status"로 노출합니다.
- Dimmer는 차단 범위를 컨테이너 하나로 한정합니다. 페이지 전체를 막아야 하면 Dimmer가 아니라 Modal·ConfirmDialog처럼 useDialogFocus를 쓰는 다이얼로그 표면을 사용하세요.
- 열려 있는 동안 가려진 콘텐츠는 inert이므로 Tab / Shift+Tab으로 도달할 수 없고 포인터 입력도 받지 않습니다. "가려 보이지만 조작되는" 상태를 만들지 않는 것이 이 컴포넌트의 핵심 계약입니다.
- Dimmer는 포커스를 옮기지도, 가두지도 않습니다. 스크림이 열리기 직전에 형제 요소에 있던 초점은 inert로 인해 브라우저가 컨테이너 바깥으로 이동시킵니다. 처리 후 특정 요소로 초점을 되돌려야 하는 흐름은 제품이 소유합니다.
- Dimmer 자체에는 초점 가능한 요소가 없습니다. 스크림 안에 버튼(예: 취소)을 두어야 하면 그 버튼은 inert 대상이 아니므로 그대로 도달할 수 있지만, 스크린 리더 사용자에게 그 존재를 알리는 문구를 children에 함께 넣으세요.

## Related components

| Component | Relationship |
| --- | --- |
| `Button` | 대표 시나리오에서 조합 |
| `Spinner` | 대표 시나리오에서 조합 |
| `Alert` | 대표 시나리오에서 조합 |
| `ConfirmDialog` | 대표 시나리오에서 조합 |
| `DropdownMenu` | 대표 시나리오에서 조합 |
| `Modal` | 대표 시나리오에서 조합 |
| `Snackbar` | 대표 시나리오에서 조합 |
| `Toast` | 대표 시나리오에서 조합 |

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

## Sources

- Dimmer prompt contract: `components/overlay/Dimmer.prompt.md`
- Storybook implementation evidence: `stories/OverlayDimmer.stories.jsx`
