# Elevator Fleet Overview

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Product / Viewer |
| Owner | `ElevatorFleetOverview` |
| Storybook | `LDS Product/Viewer/Elevator Fleet Overview` |
| Source | `../component-content.json#product-viewer-elevator-fleet-overview` |

같은 건물의 엘리베이터는 하나의 층 눈금을 공유하고, 건물 그룹은 좌우로 이어 붙습니다. 건물마다 층 구성이 다르므로 건물 사이의 같은 층 이름을 같은 높이에 맞추지 않습니다.

## 사용 판단

### 사용

- Vantage GALileo Lobby Monitoring: 엘리베이터 group에서 car position, direction, door state, service mode와 call을 함께 보여 줍니다. 이 컴포넌트는 개요에 필요한 position/direction/status만 남기고 call 입력과 service control은 제품 영역으로 제외합니다.
- Vantage NEXUS Position Indicator: floor position, direction, door zone과 층 중심으로부터의 상대 위치를 구분합니다. 첫 계약은 discrete floor만 지원하며 between-floor distance와 door-zone calibration은 telemetry 제품 계약이 확인되기 전까지 의도적으로 제외합니다.
- 기준 revision은 docs/references/product-frontends/COVERAGEAUDIT.json의 기존 pin을 사용합니다.

### 사용하지 않음

- 기존 FloorSelector는 사용자가 보고 싶은 층을 선택하는 단일 선택 control입니다. ElevatorFleetOverview는 실제 설비 위치를 읽기 전용으로 투영하므로 확장하지 않습니다.
- elevator의 currentFloor가 건물 floors에 없으면 marker를 억지로 배치하지 않고 해당 열의 현재 층 text만 유지합니다.
- direction: up | down | idle; 현재 층 옆의 단일 glyph는 보조 시각 신호이며 directionLabel이 접근 가능한 텍스트를 제공합니다. label을 생략하면 direction에서 상승 중 | 하강 중 | 정지를 도출합니다. offline에서는 stale 방향을 요약하지 않고 마지막 확인 층만 전달합니다.
- ElevatorFleetOverview는 여러 건물에 속한 엘리베이터의 현재 층과 운행 상태를 건물별 세로 열로 묶어 좌우로 비교하는 LK Product Extension입니다. system summary와 모든 elevator position column을 하나의 재사용 가능한 읽기 전용 surface로 제공하며, 애플리케이션 화면·지도·필터·상세 drawer를 소유하지 않습니다.

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `buildings` | `ElevatorFleetBuilding[]` | No |  |
| `label` | `string` | No |  |
| `headingLevel` | `2 \| 3 \| 4 \| 5 \| 6` | No |  |
| `emptyMessage` | `React.ReactNode` | No |  |

## Behavior and interaction

- headingLevel: 건물 heading을 2 | 3 | 4 | 5 | 6 중 페이지 구조에 맞게 선택하며, 기본값은 3입니다.
- emptyMessage: 건물이 하나도 없을 때 fleet 단위로 표시할 메시지입니다. 건물별 빈 상태는 각 building의 emptyMessage를 사용합니다.
- status: normal | maintenance | fault | offline | unknown. statusLabel을 주 상태 cue로 사용합니다.
- updatedLabel은 점검·고장·연결 끊김 등 비정상 상태에서만 이름 줄 우측의 보조 정보로 표시합니다.
- elevator column은 선택·활성화되지 않습니다. detail drawer, route, command가 필요한 제품은 컴포넌트 외부의 명시적인 탐색 또는 action을 구성해야 합니다.

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 명시 규칙 1 | 각 elevator column은 144px 고정 폭을 사용해 한 화면의 비교 밀도를 높이고, ScrollArea의 native horizontal overflow와 keyboard-focus contract를 재사용합니다. |
| 명시 규칙 2 | 층마다 동일한 landing-door symbol을 반복하고 현재 층 row는 좌우 외곽선 없이 상태별 soft background와 text로 강조합니다. 현재 층의 landing-door 아이콘만 solid fill을 사용하며 normal은 primary, maintenance와 fault는 각각 cautionary·negative 상태색을 적용합니다. 나머지 층의 door는 outlined로 유지합니다. |
| 명시 규칙 3 | Elevator Systems EMIS-100: system summary와 shaft view, detailed car information을 분리합니다. 본 컴포넌트는 summary/shaft view만 소유하고 상세 정보와 원격 명령은 외부 composition으로 남깁니다. |
| 명시 규칙 4 | WCAG 2.2 Use of Color: 상태를 색상만으로 전달하지 않도록 marker의 shape/border와 status text를 함께 제공합니다. |
| --body1-line | {"fontSize":"16px","lineHeight":"24px","letterSpacing":"0.0057em"} |

## Responsive

- 층 눈금의 범위는 건물 단위입니다. 같은 건물의 elevator column은 동일한 층 좌표를 공유하지만, 건물 사이에서 같은 이름의 층을 같은 높이에 맞추지 않습니다. 건물마다 층 구성과 개수가 다르고 서로 다른 건물의 동명 층은 물리적으로 대응하지 않으므로, 강제로 정렬하면 없는 관계를 시사하게 됩니다. 모든 column은 위쪽 기준으로 정렬하고 건물별 층 수에 따라 아래 끝이 달라집니다.
- 지면선은 건물마다 층 구성이 달라 서로 다른 높이에 그어집니다. 이는 건물 간 층을 정렬하지 않는다는 위 결정의 결과이며, 각 건물의 지면을 그 건물 좌표 안에서 표기한 것입니다.
- 실제 미터 단위 높이, 층간 interpolation, speed, door-zone calibration.

## Content and writing

- 계속 관찰되는 엘리베이터 가용성은 StatusIndicator의 semantic dot + visible label로 각 설비 헤더 우상단에 고정합니다. 건물·fleet 단위의 조치 필요 집계만 StatusBadge로 표시하며 색상만으로 상태를 전달하지 않습니다.
- offline column은 전체 surface를 흐리게 처리하되 마지막으로 알려진 층을 마지막으로 명시하고 연결 끊김 label을 유지합니다.
- 건물이 groundFloor를 알려주면 그 바로 아래 층 row에 지면선을 긋고 그 아래 층 전체에 낮은 톤을 적용합니다. 지면선은 일반 층 구분선(line-normal-normal)보다 한 단계만 강한 label-assistive를 쓰며, 층 눈금의 리듬을 깨지 않는 선에서 지상·지하 경계만 알립니다. 지하 톤은 background-normal-alternative입니다.
- 지하 여부는 층 이름에서 추측하지 않습니다. B 접두사 같은 표기 규칙은 제품과 로케일마다 다르므로, groundFloor가 없거나 floors에 없는 값이면 지면 표시를 하지 않습니다. 없는 기준을 지어내지 않습니다.

## Accessibility

- label: fleet section의 accessible name입니다.
- accessibility: marker는 decorative summary이고 visible semantic row가 동일 정보를 제공합니다. current-floor text는 테마별 AA text 토큰으로 대비를 유지하며, solid door icon은 보조 cue입니다. fault/offline은 색상 외에도 visible label과 shaft의 solid/dashed border로 구분합니다.
- 1. fleet surface의 accessible name과 확인 필요 수 2. 건물 identity와 필요한 경우에만 표시되는 attention status 3. 엘리베이터 identity, visible status label과 현재 층 요약 4. 위에서 아래 순서의 전체 층 목록과 현재 위치 row 5. 방향과 비정상 설비의 freshness.
- DOM과 화면의 읽기 순서는 위 순서를 유지합니다. 각 위치 열의 층 목록은 role="img"로 현재 층·방향·상태를 요약하고, 같은 정보는 열 안의 visible text로 다시 제공합니다. 각 열의 header와 층 row, landing-door symbol은 모두 읽기 전용이며 별도 tab stop을 만들지 않습니다.

## Related components

| Component | Relationship |
| --- | --- |
| `FloorSelector` | 대표 시나리오에서 조합 |
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
<ElevatorFleetOverview
  buildings={[
    {
      id: 'research',
      name: '연구동',
      floors: ['3F', '2F', '1F', 'B1'],
      elevators: [
        {
          id: 'research-1',
          name: 'E/V 1',
          currentFloor: '2F',
          direction: 'up',
          directionLabel: '상승 중',
          status: 'normal',
          statusLabel: '정상',
        },
      ],
    },
  ]}
/>
```

## Tokens and API

### Tokens

- `--body1-line`
- `--body1-size`
- `--caption1-size`
- `--caption2-size`
- `--color-semantic-background-elevated-normal`
- `--color-semantic-background-normal-alternative`
- `--color-semantic-background-normal-normal`
- `--color-semantic-label-alternative`
- `--color-semantic-label-assistive`
- `--color-semantic-label-normal`
- `--color-semantic-label-strong`
- `--color-semantic-line-normal-normal`
- `--color-semantic-line-solid-_strong`
- `--color-semantic-primary-normal`
- `--color-semantic-primary-surface-normal`
- `--color-semantic-static-white`
- `--color-semantic-status-cautionary`
- `--color-semantic-status-cautionary-surface`
- `--color-semantic-status-cautionary-text`
- `--color-semantic-status-negative`
- `--color-semantic-status-negative-surface`
- `--color-semantic-status-negative-text`
- `--component-card-radius`
- `--dur-slow`
- `--ease-in-out`
- `--font-sans`
- `--fw-bold`
- `--fw-regular`
- `--heading2-line`
- `--heading2-size`
- `--label1-size`
- `--space-1`
- `--space-2`
- `--space-3`
- `--space-4`
- `--space-5`
- `--space-6`

### Source contracts

- `components/viz/ElevatorFleetOverview.jsx`
- `components/viz/ElevatorFleetOverview.d.ts`
- `components/viz/ElevatorFleetOverview.prompt.md`
- `stories/ViewerElevatorFleet.stories.jsx`

## Sources

- ElevatorFleetOverview prompt contract: `components/viz/ElevatorFleetOverview.prompt.md`
- Storybook implementation evidence: `stories/ViewerElevatorFleet.stories.jsx`
- [Vantage GALileo Lobby Monitoring](https://www.vantageelevation.com/galileo/)
- [Nidec MCE Multiple System Display](https://moen.nidec.com/elevators/Motion-Control-Engineering/Products/Monitoring-Solutions/MSD-Multiple-System-Display)
- [Elevator Systems EMIS-100](https://www.elevatorsystems.com/emis-100-elevator-monitor-and-information-system)
- [Vantage NEXUS Position Indicator](https://www.vantageelevation.com/wp-content/uploads/2026/01/NEXUS-Rev.-1.2-1-1.pdf)
- [WCAG 2.2 Use of Color](https://www.w3.org/TR/WCAG22/#use-of-color)
