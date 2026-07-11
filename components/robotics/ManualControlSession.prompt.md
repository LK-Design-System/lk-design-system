**ManualControlSession**은 `LK Robotics Extension`으로 분류되는 수동 제어 UI session boundary입니다. 실제 안전 장치나 transport guard가 아닙니다.

```jsx
<ManualControlSession
  linkState={linkState}
  authority={controlAuthority}
  armed={armed}
  deadmanActive={holding}
  onArmedChange={setArmed}
  onSafetyReleaseRequest={sendStopAndCancelCadence}
  onEmergencyStopRequest={requestEmergencyStop}
>
  {({ interactionEnabled }) => <Joystick disabled={!interactionEnabled} />}
</ManualControlSession>
```

- `linkState`, 서버가 부여한 `authority`, 사용자의 `armed`를 같은 boolean으로 합치지 않습니다.
- 활성 제어 중 link/authority/focus/dead-man/arm이 해제되거나 unmount되면 `onSafetyReleaseRequest(reason)`을 호출합니다.
- link/authority/focus 상실은 `onArmedChange(false)`도 요청해 연결 복구 뒤 자동 재개되지 않게 합니다.
- 차단 영역은 함수형 children 여부와 관계없이 `inert`와 capture guard로 키보드·포인터 activation을 모두 차단합니다. 제품도 가능하면 context의 `interactionEnabled`를 실제 control의 `disabled`에 연결합니다.
- 앱은 release callback에서 cadence를 취소하고 STOP을 전송해야 하며, 로봇/게이트웨이 watchdog으로 실제 정지를 보장해야 합니다.
- `onEmergencyStopRequest`는 요청 callback일 뿐 성공을 표시하지 않습니다. ACK와 결과는 제품이 `Timeline`, `StatusBadge`, `DescriptionList`를 조합해 별도 표시합니다.
- emergency-stop request는 임의 `color-mix`가 아니라 LDS safety-extension `Button variant="danger"`를 사용합니다.
- 헤더에는 반드시 필요한 연결, authority, 속도/정책과 즉시 접근해야 하는 emergency-stop request만 둡니다.
- 현재 command eligibility는 상시 안내용 `Callout`이 아니라 시스템 상태용 `Banner`로 표시합니다. Banner는 헤더 바로 아래에 edge-to-edge로 고정해 카드 안쪽에 또 다른 카드처럼 떠 있지 않게 합니다.
- 중앙에는 실제 조작기만 두고, UI arm과 dead-man은 하단 command rail에 둡니다. dead-man control은 UI arm 이후에만 노출합니다.
- 입력 가능 상태도 같은 Banner 위치에서 갱신해 enable/dead-man 전환 중 조작기 위치가 이동하지 않게 합니다.
- 이 컴포넌트는 연결·권한·arm·dead-man·focus에 따른 재사용 가능한 차단 경계까지만 소유합니다. 로봇별 주행 화면, 명령 이력, ACK workflow, 장비 상태 dashboard는 제품 화면 또는 별도 Robotics 조합 패턴으로 남깁니다.

## LDS fit and external research basis

- 확인한 LDS 형제 계약은 `ConnectionBadge`, `Banner`, `Button variant="danger"`, `Joystick`, `DirectionalPad`, `Timeline`, `DescriptionList`입니다. 이 컴포넌트는 그 요소를 배치하는 session boundary이며 별도의 상태색, 카드, 조작기, 결과 timeline을 만들지 않습니다.
- [ROS 2 `teleop_twist_joy`](https://docs.ros.org/en/iron/p/teleop_twist_joy/index.html)는 이동을 위해 enable button을 요구하는 설정을 기본값으로 두지만 rate limiting과 autorepeat는 별도 입력 계층의 책임이라고 명시합니다. 따라서 LDS dead-man UI는 command eligibility를 표현할 뿐 cadence나 실제 정지를 보장한다고 주장하지 않습니다.
- [ROS 2 `diff_drive_controller`](https://control.ros.org/humble/doc/ros2_controllers/diff_drive_controller/doc/userdoc.html)는 stale command timeout 뒤 자동 정지를 controller 기능으로 둡니다. 이 근거에 따라 blur·unmount·link loss에서 release를 요청하되 실제 stop 보장은 제품 transport와 robot/controller watchdog에 남깁니다.
- [HTML Standard의 inert subtree](https://html.spec.whatwg.org/multipage/interaction.html#inert-subtrees)는 포인터 hit testing, focus, 편집, 접근성 트리 노출을 함께 차단합니다. 차단 이유와 re-arm action은 inert subtree 밖의 `Banner`와 command rail에 유지해 모든 사용자가 상태를 인지하고 복구할 수 있게 합니다.
