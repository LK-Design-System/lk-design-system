**EquipmentStatusCard** — 설비(문·엘리베이터·계단리프트) 상태 카드. LK 원장(ledger) 이디엄 — `RobotStatusCard`와 같은 가로 행: 좌측 아이콘 타일+타이틀, 그 아래 상태 조건을 **은은한 텍스트 서브라인**(`·`로 연결)으로, 헤드라인 상태(`ringLabel`)는 우측에 **작은 톤 점 + 읽히는 잉크 라벨**로(이동 중이면 점 대신 dim 방향 화살표, 통신성 상태면 `ConnectionBadge` 시그널 바). 대비 AA, 밀도 높은 목록에서도 조용하게. `icon`은 아무 노드나 받습니다. `lkrobotics-control-full` 감사에서 화면 3곳(AutoDoorStatus·ElevatorStatus·StairLiftStatus)이 각자 손으로 중복 구현하던 패턴을 흡수한 컴포넌트.

```jsx
<EquipmentStatusCard icon={<Icon name="lock" />} title="정문" ringLabel="LOCK" tone="negative"
  chips={[{ label: '센서 정상', tone: 'positive' }, { label: '통신 정상', tone: 'positive' }]} />
<EquipmentStatusCard title="화물 엘리베이터 2호기" ringLabel="3F" ringCaption="이동중" tone="signal" direction="up" />
<EquipmentStatusCard title="계단리프트 A" ringLabel="STOP" tone="cautionary" chips={[{ label: '점검중', tone: 'cautionary' }]} />
<EquipmentStatusCard icon={<Icon name="signal" />} title="옥상 게이트웨이" ringLabel="재연결" connection="reconnecting" chips={[{ label: '신호 약함', tone: 'cautionary' }]} />
```

- **tone**이 상태 점 · 화살표 · 기본 칩 색을 통일. **chips** 항목마다 독립 tone 지정 가능. **direction**("up"/"down")이 있으면 점 대신 dim 방향 화살표가 뜸(이동 중 신호). **connection**("online"/"reconnecting"/"weak"/"offline")이 있으면 점 대신 `ConnectionBadge` 시그널 바(재연결은 블링크) — 연결 끊김·재연결 같은 통신 상태 전용. 라이브 값 바인딩은 앱의 몫.
- 상태는 **점 + 잉크 라벨**(--color-semantic-label-neutral, 대비 AA)로 조용하게 — 기존 알약 처리를 대체함. `설비 모니터` 예시가 이 컴포넌트로 구성됨.
