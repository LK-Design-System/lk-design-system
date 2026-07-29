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

## Behavior and interaction

- FloorSelector — 빌딩 층/레벨 선택기. 단일 선택 리스트로 활성 층은 시그널 잉크로 채워집니다(맵·플로어 뷰의 우측 컨트롤).

## 정량 규칙

| Subject | Rule |
| --- | --- |
| --color-semantic-fill-normal | light: rgba(112, 115, 124, 0.08); dark: rgba(112, 115, 124, 0.22) |
| --color-semantic-label-neutral | light: rgba(46, 47, 51, 0.88); dark: rgba(194, 196, 200, 0.88) |
| --color-semantic-primary-normal | light: #3878B3; dark: #5390C9 |
| --fw-medium | 500 |

## Accessibility

- floors 문자열 또는 { value, label }(위→아래 순서) · 제어(value)/비제어(defaultValue). ARIA radio group(단일 선택): 단일 tab stop(roving tabindex), 화살표로 이동+선택, Home/End. 각 층은 role="radio"·aria-checked.

## Related components

| Component | Relationship |
| --- | --- |
| `ElevatorFleetOverview` | 대표 시나리오에서 조합 |
| `Map2DCanvas` | 대표 시나리오에서 조합 |
| `Scene3DFrame` | 대표 시나리오에서 조합 |
| `VideoStreamTile` | 대표 시나리오에서 조합 |
| `VIEWER_BLOCKING_STATES` | 대표 시나리오에서 조합 |
| `VIEWER_STATES` | 대표 시나리오에서 조합 |
| `ViewerFrame` | 대표 시나리오에서 조합 |
| `ViewerToolbar` | 대표 시나리오에서 조합 |

## Examples

### 기본 조합

```jsx
<FloorSelector value={floor} onChange={setFloor}
  floors={[{ value: 'B1', label: 'B1' }, { value: '1F', label: '1F' }, { value: '2F', label: '2F' }]} />
```

## Tokens and API

### Tokens

- `--color-semantic-fill-normal`
- `--color-semantic-label-neutral`
- `--color-semantic-primary-normal`
- `--color-semantic-static-white`
- `--dur-fast`
- `--ease-out`
- `--font-sans`
- `--fw-medium`
- `--fw-semibold`
- `--label1-size`
- `--radius-10`
- `--radius-8`

### Source contracts

- `components/navigation/FloorSelector.jsx`
- `components/navigation/FloorSelector.d.ts`
- `components/navigation/FloorSelector.prompt.md`
- `stories/ViewerFloorSelector.stories.jsx`

## Sources

- FloorSelector prompt contract: `components/navigation/FloorSelector.prompt.md`
- Storybook implementation evidence: `stories/ViewerFloorSelector.stories.jsx`
