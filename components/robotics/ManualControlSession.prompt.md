# ManualControlSession

**분류:** `LK Robotics Extension`. 수동 제어의 UI 경계와 상태 표현을 소유하지만, 안전 등급 장치·명령 전송·충돌 방지·watchdog를 구현하거나 보증하지 않습니다.

```jsx
<ManualControlSession
  title="AMR 수동 주행"
  linkState={linkState}
  authority={controlAuthority}
  armed={armed}
  deadmanRequired={false}
  stopRequestState={stopRequestState}
  sessionMeta="설정된 제어 한도 0.4 m/s"
  onArmedChange={setArmed}
  onSafetyReleaseRequest={sendZeroAndCancelCadence}
  onStopRequest={requestOperationalStop}
>
  {({ interactionEnabled }) => (
    <Joystick disabled={!interactionEnabled} label="이동" />
  )}
</ManualControlSession>
```

## 컴포넌트 계약

- 상태 축은 `linkState`, 서버가 부여한 `authority`, 사용자의 `armed`, 선택적인 외부 `deadmanActive`, focus/window 상태로 분리합니다. 하나의 `enabled` boolean으로 합치지 않습니다.
- 화면의 읽기·DOM·키보드 순서는 **세션 이름과 설정된 제어 한도 → 연결/권한 전제조건 → 독립된 운행 정지 요청 → 세션 전체 상태 Banner → 이동 입력 → arm/입력 방식**입니다.
- 제목은 실제 heading이며 `section`의 `aria-labelledby`가 됩니다. `headingLevel`은 주변 문서 구조에 맞춰 2–6으로 조정합니다.
- `sessionMeta`는 안전 인증 한계가 아니라 제품이 설정한 제어 한도/정책임을 명시하는 문구로 씁니다. `0.4 m/s`가 안전한지는 질량, 제동거리, 시야, 환경을 포함한 현장 위험성 평가 없이는 판단할 수 없습니다.
- 연결 준비와 권한 부여는 각각 파란 `ConnectionBadge ready`와 `StatusBadge signal`로 표시합니다. 초록은 모든 UI 조건이 충족된 `수동 제어 가능` 또는 확인된 긍정 결과에만 사용합니다. 색 외에도 아이콘/막대와 텍스트를 함께 유지합니다.
- 정상적인 disarmed 상태는 compact signal Banner 한 줄, 연결 지연·권한 확인·외부 활성화 대기처럼 조치가 필요한 상태는 cautionary 두 줄, 연결 소실·권한 회수·정지 실패는 negative 두 줄입니다. 이 영역은 패널 전체의 동적 상태이므로 `Callout`이 아니라 `Banner variant="embedded"`를 사용합니다.
- 비활성화는 `inert`, `aria-disabled`, capture guard로 포인터와 키보드를 함께 차단합니다. 부모 opacity를 추가하지 않아 자식 컨트롤의 disabled 표현과 중첩되지 않게 합니다.
- `onSafetyReleaseRequest(reason)`은 활성 상태에서 link/authority/focus/dead-man/stop-request가 해제되거나 unmount될 때 cadence 취소와 zero/STOP 명령을 **요청**하는 신호입니다. 실제 정지는 로봇/controller watchdog과 transport acknowledgement가 보장해야 합니다.
- 제품 화면의 포인터 조작은 `deadmanRequired={false}`와 Joystick 자체의 hold-to-run을 기본으로 합니다. 별도 `deadmanControl`은 물리 pendant나 외부 활성화 장치의 상태/입력을 UI에 반영할 때만 사용하며, 마우스 버튼 두 개를 동시에 요구하는 가상 안전장치로 사용하지 않습니다.
- 드래그가 어려운 사용자를 위해 같은 제어 영역에 `DirectionalPad` 같은 단일 포인터의 discrete jog 대안을 조합합니다. Joystick은 keyup·pointerup/cancel·blur·disabled·unmount에서 zero로 복귀해야 합니다.

## 운행 정지 요청

- 빨간 액션은 안전 회로의 E-stop이 아니라 **소프트웨어 운행 정지 요청**입니다. 기본 라벨은 `운행 정지 요청`이며 상태 badge들과 divider/간격으로 분리하고 40px `md` 버튼을 사용합니다. 실제 안전 E-stop 상태와 reset/restart 절차는 제품이 별도로 표시해야 합니다.
- `stopRequestState`는 `idle → requesting → acknowledged → stopped`를 구분하고 `failed`/timeout을 별도로 표현합니다. ACK는 실제 정지가 아닙니다. `stopped`가 되기 전에는 완료 문구를 쓰지 않습니다.
- lifecycle을 화면에 유지하려면 `stopRequestState`를 제어하세요. prop을 생략한 기존 소비자는 요청 즉시 로컬 입력을 차단하고 disarm이 반영되면 compact 잠금 상태로 돌아가지만, ACK·실제 정지·실패는 추정하지 않습니다.
- `stopRequestLabel`은 idle 버튼 문구만 바꾸며, `stopRequestMessage`는 현재 lifecycle Banner의 기본 보충 설명을 교체합니다. 상태 제목과 완료 여부는 `stopRequestState` 계약을 따릅니다.
- 요청 즉시 로컬 제어를 latch 차단하고 `stop-requested` release와 `onArmedChange(false)`를 요청합니다. stop lifecycle이 `idle`로 돌아와도 실제 `armed=false`가 관찰되기 전에는 `수동 제어 재활성화 필요` 상태로 계속 차단합니다. 이후 사용자가 다시 arm해야 하며 이전 joystick/keyboard 명령을 재사용하지 않습니다.
- 새 구현은 `onStopRequest`를 사용합니다. `onEmergencyStopRequest`는 기존 소비자용 deprecated 별칭입니다.
- 진행/ACK/확인은 polite status, 실패는 assertive alert로 Banner가 전달합니다. 확인 모달은 긴급 정지를 지연시키므로 추가하지 않습니다.

## LDS 형제 비교와 의도적 범위

- 확인한 형제: `ConnectionBadge`, `StatusBadge`, `Banner embedded`, `Callout`, `Button danger`, `Joystick`, `DirectionalPad`, `EquipmentStatusCard`.
- retained delta: 헤더의 stop action zone과 상태 lifecycle은 로봇 수동 제어의 즉시 중단 요구 때문에 유지합니다. 색·radius·divider·타입·focus/disabled 표현은 기존 LDS 토큰과 형제를 그대로 사용합니다.
- 제품 전용 route/map, 장비 telemetry, 실제 명령 속도, robot-specific ACK timeline, 안전 E-stop reset, 접근 구역/충돌 감시는 이 디자인 시스템 컴포넌트에서 의도적으로 제외합니다.
- 320px에서는 그룹이 DOM 순서대로 wrap하며, action과 상태가 겹치거나 조작기 안에 포함되지 않아야 합니다.

## 외부 근거와 적용 결론

- [ISO 3691-4:2023](https://www.iso.org/standard/83545.html): AMR/AGV의 수동·유지보수 운전도 시스템 위험성 평가와 검증 범위입니다. UI의 속도 문구를 안전 보증으로 표현하지 않습니다.
- [ISO 13850:2015](https://www.iso.org/standard/59970.html)와 [OSHA Robotics Safety](https://www.osha.gov/enforcement/directives/std-01-12-002): 비상정지는 쉽게 접근되고 다른 제어보다 우선해야 합니다. 브라우저 callback은 검증된 안전 회로와 분리해 `운행 정지 요청`으로 명명합니다.
- [OSHA Robotics Technical Manual](https://www.osha.gov/otm/section-4-safety-hazards/chapter-4): 수동 운전의 감속과 continuously held enabling device 원칙을 참고했습니다. 산업용 매니퓰레이터의 250 mm/s 수치를 AMR의 보편적 제한으로 전용하지 않습니다.
- [ROS 2 teleop_twist_joy](https://docs.ros.org/en/rolling/p/teleop_twist_joy/index.html): 이동 enable을 별도 전제로 두지만 rate limiting/안전 정지를 보증하지 않습니다. UI arm과 실제 hold-to-run을 분리합니다.
- [ROS 2 diff_drive_controller](https://control.ros.org/jazzy/doc/ros2_controllers/diff_drive_controller/doc/userdoc.html): stale command timeout은 controller 계약입니다. UI release callback만으로 실제 정지를 주장하지 않습니다.
- [Clearpath Husky A300](https://docs.clearpathrobotics.com/docs_robots/outdoor_robots/husky/a300/user_manual_husky/): enable+thumbstick과 E-stop/safety restart 상태가 분리되며, 지속 명령이 reset 후 재적용될 수 있습니다. 요청 즉시 disarm하고 stale input을 폐기합니다.
- [WCAG 2.2 Keyboard](https://www.w3.org/WAI/WCAG22/Understanding/keyboard.html), [Dragging Movements](https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements.html), [Use of Color](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html), [Target Size](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html): 키보드 release, 비드래그 대안, 비색상 상태 표지, 충분한 stop target을 계약에 반영합니다.
- [WAI-ARIA application role](https://www.w3.org/TR/wai-aria/#application): Joystick 같은 custom interaction은 visible instructions와 현재 값을 제공하고 모든 키 동작을 직접 책임집니다.
- [Primer Banner](https://primer.style/product/components/banner/)와 [Fluent MessageBar](https://fluent2.microsoft.design/components/web/react/core/messagebar/usage): 패널/카드 전체 상태는 header 바로 아래의 edge-to-edge embedded Banner로 배치합니다.
