# Floor Selector

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Product / Viewer |
| Owner | `FloorSelector` |
| Storybook | `LDS Product/Viewer/Floor Selector` |
| Source | `../component-content.json#product-viewer-floor-selector` |

운영자가 다층 건물 지도에서 한 층을 반복해서 전환해야 할 때 적합합니다. 선택지가 많거나 층 외의 복잡한 필터에는 Floor Selector 대신 Select 또는 Tree를 사용하세요.

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `floors` | `Floor[]` | Yes | 층 목록 — 문자열 또는 { value, label }(위→아래 순서대로). |
| `value` | `string` | No | 제어되는 현재 층. |
| `defaultValue` | `string` | No | 비제어 초기 층(기본 첫 항목). |
| `onChange` | `(value: string) = void` | No |  |
| `appearance` | `'light' \| 'dark'` | No | 놓이는 표면의 외형. Viewer 표면(다크 캔버스) 위에 얹을 때는 dark를 지정한다. 기본 light의 채움·라벨 잉크는 다크 캔버스 위에서 약 1.3:1까지 떨어진다. |
| `size` | `'md' \| 'sm'` | No | 밀도. 이 선택기의 제자리는 Viewer 컨트롤 레일이라 ViewerToolbar(28px 버튼)와 높이를 맞춘 sm이 기본이다. 패널 전체를 겨눌 수 있는 단독 배치에는 44px 타깃의 md를 쓴다. sm도 WCAG 2.5.8(AA, 24×24)은 충족하며, 2.5.5(AAA, 44×44)가 필요한 화면에서는 md를 지정한다. |

## Behavior and interaction

- 선택 층은 두 외형 모두 primary 채움 + static-white를 유지한다. 활성 표시는 표면과 무관하게 같아야 하기 때문이다.
- FloorSelector — 빌딩 층/레벨 선택기. 단일 선택 리스트로 활성 층은 시그널 잉크로 채워집니다(맵·플로어 뷰의 우측 컨트롤).

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 명시 규칙 1 | appearance light \| dark(기본 light). Viewer 표면 위에 얹을 때는 반드시 dark를 지정한다. 기본 light의 채움(fill-normal)과 라벨 잉크(label-neutral)는 다크 캔버스 위에서 비선택 층이 약 1.3:1까지 떨어져 읽히지 않는다. |
| 명시 규칙 2 | 이 컨트롤은 Viewer 표면 위에 얹혀 ViewerToolbar와 나란히 놓인다. 따라서 컨테이너 곡률은 Viewer 표면·툴바와 같은 --radius-md(12px)를 쓴다. 자기만의 곡률 체계를 만들지 않는다. |
| 명시 규칙 3 | 세그먼트 곡률은 동심 관계를 지킨다: 컨테이너 12px − 패딩 4px = 8px. 이 값이 의미 스케일에 없어 --radius-8을 쓰며, 임의 선택이 아니라 위 계산의 결과다. 패딩을 바꾸면 세그먼트 곡률도 함께 바꿔야 한다. |
| 명시 규칙 4 | 두 외형 모두 컨테이너에 헤어라인을 둔다. 라이트에서 채움만 쓰면 흰 배경 대비가 1.1:1이라 경계가 사라지고 라벨만 떠 보인다. 세그먼트 컨트롤이라는 그룹 어피던스는 채움이 아니라 경계선이 만든다. |
| --border-thin | 1px |

## Content and writing

- size sm | md(기본 sm). 이 컨트롤의 자리는 Viewer의 우측 컨트롤 열이고, 거기서 ViewerToolbar 버튼은 28px다. 44px로 두면 같은 레일에 얹힌 더 무거운 다른 컨트롤처럼 읽히므로 기본을 28px에 맞춘다. 라벨은 --caption1-size로 주변 뷰어 메타 텍스트와 같은 위계에 둔다.

## Accessibility

- floors 문자열 또는 { value, label }(위→아래 순서) · 제어(value)/비제어(defaultValue). ARIA radio group(단일 선택): 단일 tab stop(roving tabindex), 화살표로 이동+선택, Home/End. 각 층은 role="radio"·aria-checked.
- md(44×44, --label1-size)는 뷰어 밖 단독 배치용이다. 패널 전체를 겨냥할 수 있는 상황이라 WCAG 2.5.5(AAA) 44×44를 만족시킨다. 기본 sm은 2.5.8(AA, 24×24)을 넘지만 2.5.5는 만족하지 않으므로, 터치 우선 화면은 md를 지정한다.

## Related components

| Component | Relationship |
| --- | --- |
| `Icon` | 대표 시나리오에서 조합 |
| `Map2DCanvas` | 대표 시나리오에서 조합 |
| `ViewerToolbar` | 대표 시나리오에서 조합 |
| `ViewerToolbarButton` | 대표 시나리오에서 조합 |
| `ElevatorFleetOverview` | 대표 시나리오에서 조합 |
| `Scene3DFrame` | 대표 시나리오에서 조합 |
| `VideoStreamTile` | 대표 시나리오에서 조합 |
| `VIEWER_BLOCKING_STATES` | 대표 시나리오에서 조합 |

## Examples

### 기본 조합

```jsx
<FloorSelector value={floor} onChange={setFloor}
  floors={[{ value: 'B1', label: 'B1' }, { value: '1F', label: '1F' }, { value: '2F', label: '2F' }]} />
```

## Tokens and API

### Tokens

- `--border-thin`
- `--caption1-size`
- `--color-semantic-fill-normal`
- `--color-semantic-label-neutral`
- `--color-semantic-line-normal-normal`
- `--color-semantic-primary-normal`
- `--color-semantic-static-white`
- `--component-viewer-border`
- `--component-viewer-muted`
- `--component-viewer-surface-elevated`
- `--dur-fast`
- `--ease-out`
- `--font-sans`
- `--fw-medium`
- `--fw-semibold`
- `--label1-size`
- `--radius-8`
- `--radius-md`

### Source contracts

- `components/navigation/FloorSelector.jsx`
- `components/navigation/FloorSelector.d.ts`
- `components/navigation/FloorSelector.prompt.md`
- `stories/ViewerFloorSelector.stories.jsx`

## Sources

- FloorSelector prompt contract: `components/navigation/FloorSelector.prompt.md`
- Storybook implementation evidence: `stories/ViewerFloorSelector.stories.jsx`
