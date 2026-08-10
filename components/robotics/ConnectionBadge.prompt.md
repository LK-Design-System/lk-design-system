# ConnectionBadge

## Classification and problem

**LK Robotics Extension.** MQTT, rosbridge, WebSocket 같은 transport 연결 사실을 신호 막대와 짧은 라벨로 표시한다. 연결 상태만 소유하며 데이터 freshness, 장비 health, operability, command eligibility, control authority를 추론하지 않는다.

```jsx
<ConnectionBadge connectionState="connected" />
<ConnectionBadge connectionState="connecting" size="sm" />
<ConnectionBadge connectionState="degraded" label="패킷 손실 감지" />
<ConnectionBadge connectionState="disconnected" />
```

기존 `status="online|ready|weak|stale|error|offline"` API는 호환을 위해 유지하지만 새 제품 코드는 `connectionState`를 사용한다. `connectionState`가 함께 전달되면 새 계약이 우선한다.

## Semantic contract

- `unknown`: transport 상태를 아직 판정할 수 없다.
- `connecting`: 초기 연결을 시도하는 전이 상태다.
- `connected`: transport 연결이 성립했다. 최신 데이터, 정상 장비, 명령 가능 상태를 뜻하지 않는다.
- `degraded`: 연결은 유지되지만 transport 품질이 저하됐다.
- `reconnecting`: 끊긴 연결을 복구하는 전이 상태다.
- `disconnected`: transport 연결이 없다.
- `failed`: 연결 시도가 실패했거나 transport 오류가 확정됐다.

마지막 관측 시각과 `live|delayed|stale` freshness는 `TelemetryValue` 또는 `DescriptionList`, health와 operability는 `StatusBadge`·`EquipmentStatusCard`, recovery action은 `ActionArea`와 `Button`을 제품에서 조합한다.

## Sibling and visual-delta inventory

확인한 sibling은 `StatusBadge`, `RobotStatusCard`, `TelemetryValue`, `Banner`다.

- control/glyph size: 기존 `sm` 11px·`md` 14px bar geometry를 유지한다.
- spacing/typography: 기존 7px gap, 12/13px label, semibold를 유지한다.
- radius/border/surface: 별도 card, border, shadow를 추가하지 않는다.
- fill/foreground: 기존 semantic primary/status/disabled token만 사용하며 token 값을 바꾸지 않는다.
- state marker: 일반 상태 점을 쓰는 `StatusBadge`와 달리 transport 품질을 구분하는 3단 signal bar를 유지한다.
- motion: `connecting`과 `reconnecting` 전이에만 blink를 허용하고 reduced-motion에서는 정지한다. `degraded`, `unknown`, `disconnected`, `failed`는 정적이다.
- focus/disabled: 비대화형 상태 표시이므로 자체 focus 또는 disabled 축을 추가하지 않는다.

유지한 차이는 transport 품질을 한눈에 구분하는 bar geometry뿐이며 새로운 시각 언어는 도입하지 않았다.

## Authoritative external references

- [ROS 2 Managed nodes](https://design.ros2.org/articles/node_lifecycle.html): 안정 상태와 transition state를 분리하고 외부 supervisor가 전이를 소유한다. LDS는 transport 상태를 표시하되 제품 state machine을 실행하지 않는다.
- [Open-RMF RobotState](https://docs.ros.org/en/humble/p/rmf_fleet_msgs/msg/RobotState.html): robot mode, battery, location과 message sequence를 독립 필드로 제공한다. 연결만으로 telemetry freshness나 robot health를 추론하지 않는다.
- [Kubernetes Pod Conditions](https://kubernetes.io/docs/concepts/workloads/pods/pod-condition/): `Unknown`, transition time, reason, message를 condition evidence로 분리한다. `connected`를 복합 `ready`로 승격하지 않고 freshness/reason을 별도 evidence로 둔다.
- [W3C ARIA19](https://www.w3.org/WAI/WCAG22/Techniques/aria/ARIA19): assertive alert는 즉시 개입이 필요한 변화에 제한한다. ConnectionBadge 자체는 live region을 만들지 않는다.

## LK product workflow coverage

기계 원장은 `docs/references/product-frontends/COVERAGE_AUDIT.json`의 기존 source pin과 WF-02/WF-09 row를 사용한다.

- **LK Control Full Daedeok** — `supported by composition`. revision `93802fc2aa5d29f930380ae58d51dcb68322b5e7`, `frontend/src/views/dashboard/RobotDashboard/pages/Dashboard.jsx`와 `frontend/src/views/manual-control/index.jsx`에서 live truth와 manual-control connection prerequisite를 확인했다. Control이 freshness, health, authority, recovery와 transport를 소유한다.
- **LK Web Viz** — `not applicable`. revision `a984def117c05acd213f494cbb8a42e990595505`, `frontend/src/screens/MapEditScreen.tsx`는 map/floor authoring 근거이며 live transport badge 소비 근거가 없다.
- **LK Portal** — `not applicable`. revision `e5ee99d5062170e26abe63d9105c2b8a024ce710`, `src/components/chat/FloatingChat.tsx`의 provider availability는 MQTT/rosbridge transport truth가 아니므로 ConnectionBadge로 표현하지 않는다.

## Accessibility and exclusions

- 보이는 라벨이 기본이며 bar 수나 색만으로 상태를 전달하지 않는다.
- `showLabel={false}`이면 기본 문자열 라벨이 `role="img"`의 accessible name으로 남는다. 비문자 custom label을 숨기면 `aria-label`을 제공한다.
- badge 자체는 반복 announcement를 만들지 않는다. 제품은 연결 전환이 action을 차단하거나 즉시 개입을 요구할 때 별도 `Banner` 또는 alert 정책을 사용한다.
- 연결 시각, 재시도 정책, polling, watchdog, command admission, resync 완료 판정은 제품 소유다.

## Representative verification

`LDS Robotics/Status/Connection Badge`의 `개요` story를 960px normal viewport와 360px viewport의 내부 320px pattern에서 확인한다. 7개 canonical state, wrapping, overflow, hidden-label accessible name을 검토하고 `StatusBadge` sibling과 typography·semantic token 위계를 비교한다. legacy parity story는 `status` 호환 표면을 계속 검증한다.
