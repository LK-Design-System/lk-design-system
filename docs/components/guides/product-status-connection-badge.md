# Connection Badge

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Product / Status |
| Owner | `ConnectionBadge` |
| Storybook | `LDS Product/Status/Connection Badge` |
| Source | `../component-content.json#product-status-connection-badge` |

MQTT·WebSocket처럼 제품이 의존하는 transport의 연결 사실과 품질을 표시할 때 적합합니다. 연결 상태가 데이터 freshness, 장비 health, 동작 가능 여부까지 대신하지 않도록 각각 별도 상태로 조합하세요.

## 사용 판단

### 사용

- fill/foreground: 기존 semantic primary/status/disabled token만 사용하며 token 값을 바꾸지 않는다.
- badge 자체는 반복 announcement를 만들지 않는다. 제품은 연결 전환이 action을 차단하거나 즉시 개입을 요구할 때 별도 Banner 또는 alert 정책을 사용한다.
- 기계 원장은 docs/references/product-frontends/COVERAGEAUDIT.json의 기존 source pin과 WF-02/WF-09 row를 사용한다.
- Representative verification.

### 사용하지 않음

- connected: transport 연결이 성립했다. 최신 데이터, 정상 장비, 명령 가능 상태를 뜻하지 않는다.
- radius/border/surface: 별도 card, border, shadow를 추가하지 않는다.
- 유지한 차이는 transport 품질을 한눈에 구분하는 bar geometry뿐이며 새로운 시각 언어는 도입하지 않았다.

## Anatomy

| Part | Contract |
| --- | --- |
| label | 라벨 재정의(기본은 상태별 한국어). |
| showLabel | 라벨 표시. @default true |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `connectionState` | `ConnectionState` | No | Transport 연결 상태. freshness, health, operability, authority를 추론하지 않습니다. |
| `status` | `LegacyConnectionStatus` | No | Legacy compatibility axis. 새 코드는 connectionState를 사용하세요. stale은 freshness가 아니라 기존 시각 호환으로만 유지됩니다. |
| `label` | `React.ReactNode` | No | 라벨 재정의(기본은 상태별 한국어). |
| `showLabel` | `boolean` | No | 라벨 표시. @default true |
| `size` | `'sm' \| 'md'` | No |  |

## States

| State | Contract |
| --- | --- |
| connectionState | Transport 연결 상태. freshness, health, operability, authority를 추론하지 않습니다. |
| status | Legacy compatibility axis. 새 코드는 connectionState를 사용하세요. stale은 freshness가 아니라 기존 시각 호환으로만 유지됩니다. |

## Behavior and interaction

- unknown: transport 상태를 아직 판정할 수 없다.
- connecting: 초기 연결을 시도하는 전이 상태다.
- reconnecting: 끊긴 연결을 복구하는 전이 상태다.

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 명시 규칙 1 | control/glyph size: 기존 sm 11px·md 14px bar geometry를 유지한다. |
| 명시 규칙 2 | spacing/typography: 기존 7px gap, 12/13px label, semibold를 유지한다. |
| 명시 규칙 3 | state marker: 일반 상태 점을 쓰는 StatusBadge와 달리 transport 품질을 구분하는 3단 signal bar를 유지한다. |
| 명시 규칙 4 | ROS 2 Managed nodes: 안정 상태와 transition state를 분리하고 외부 supervisor가 전이를 소유한다. LDS는 transport 상태를 표시하되 제품 state machine을 실행하지 않는다. |
| --color-semantic-fill-strong | light: rgba(112, 115, 124, 0.16); dark: rgba(112, 115, 124, 0.28) |

## Content and writing

- Open-RMF RobotState: robot mode, battery, location과 message sequence를 독립 필드로 제공한다. 연결만으로 telemetry freshness나 robot health를 추론하지 않는다.
- Kubernetes Pod Conditions: Unknown, transition time, reason, message를 condition evidence로 분리한다. connected를 복합 ready로 승격하지 않고 freshness/reason을 별도 evidence로 둔다.
- 보이는 라벨이 기본이며 bar 수나 색만으로 상태를 전달하지 않는다.
- Owner: LDS Product / Operations. WDS provenance는 product-extension이며, components/robotics 경로는 호환 표면일 뿐 현재 owner를 결정하지 않는다. MQTT, rosbridge, WebSocket 같은 transport 연결 사실을 신호 막대와 짧은 라벨로 표시한다. 연결 상태만 소유하며 데이터 freshness, 장비 health, operability, command eligibility, control authority를 추론하지 않는다.

## Accessibility

- focus/disabled: 비대화형 상태 표시이므로 자체 focus 또는 disabled 축을 추가하지 않는다.
- showLabel={false}이면 기본 문자열 라벨이 role="img"의 accessible name으로 남는다. 비문자 custom label을 숨기면 aria-label을 제공한다.
- Accessibility and exclusions.
- LDS Product/Status/Connection Badge의 개요 story를 960px normal viewport와 360px viewport의 내부 320px pattern에서 확인한다. 7개 canonical state, wrapping, overflow, hidden-label accessible name을 검토하고 StatusBadge sibling과 typography·semantic token 위계를 비교한다. legacy parity story는 status 호환 표면을 계속 검증한다.

## Related components

| Component | Relationship |
| --- | --- |
| `BatteryGauge` | 대표 시나리오에서 조합 |
| `EquipmentStatusCard` | 대표 시나리오에서 조합 |
| `TelemetryGauge` | 대표 시나리오에서 조합 |
| `TelemetryValue` | 대표 시나리오에서 조합 |

## Examples

### 기본 조합

```jsx
<ConnectionBadge connectionState="connected" />
<ConnectionBadge connectionState="connecting" size="sm" />
<ConnectionBadge connectionState="degraded" label="패킷 손실 감지" />
<ConnectionBadge connectionState="disconnected" />
```

## Tokens and API

### Tokens

- `--color-semantic-fill-strong`
- `--color-semantic-label-alternative`
- `--color-semantic-label-disable`
- `--color-semantic-label-neutral`
- `--color-semantic-primary-normal`
- `--color-semantic-status-cautionary`
- `--color-semantic-status-negative`
- `--color-semantic-status-positive`
- `--ease-in-out`
- `--font-sans`
- `--fw-semibold`
- `--viewer-foreground`

### Source contracts

- `components/robotics/ConnectionBadge.jsx`
- `components/robotics/ConnectionBadge.d.ts`
- `components/robotics/ConnectionBadge.prompt.md`
- `stories/RoboticsConnectionBadge.stories.jsx`

## Migration

- 기존 status="online|ready|weak|stale|error|offline" API는 호환을 위해 유지하지만 새 제품 코드는 connectionState를 사용한다. connectionState가 함께 전달되면 새 계약이 우선한다.

## Sources

- ConnectionBadge prompt contract: `components/robotics/ConnectionBadge.prompt.md`
- Storybook implementation evidence: `stories/RoboticsConnectionBadge.stories.jsx`
- [ROS 2 Managed nodes](https://design.ros2.org/articles/node_lifecycle.html)
- [Open-RMF RobotState](https://docs.ros.org/en/humble/p/rmf_fleet_msgs/msg/RobotState.html)
- [Kubernetes Pod Conditions](https://kubernetes.io/docs/concepts/workloads/pods/pod-condition/)
- [W3C ARIA19](https://www.w3.org/WAI/WCAG22/Techniques/aria/ARIA19)
