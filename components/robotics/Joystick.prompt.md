**Joystick** — LK Robotics Extension인 홀드-투-런 가상 조이스틱. 포인터를 누르는 즉시(드래그 없이도) 정규화 `{x, y}`(−1~1, y는 위가 양수)를 `onChange`로 보내며, 포인터·키보드·포커스·비활성·언마운트의 모든 종료 경로에서 먼저 `{x: 0, y: 0}`을 보낸 뒤 `onEnd(reason)`을 호출한다.

```jsx
<Joystick
  size={180}
  label="수동 주행"
  onChange={(vector) => drive(vector.x, vector.y)}
  onEnd={() => stop()}
/>
```

## 사용 계약

- 포인터는 누르는 동안만 명령이 유효하다. 누른 지점이 즉시 벡터가 되므로 이동을 시작하기 위해 반드시 드래그할 필요는 없다.
- 키보드는 화살표 키를 누르는 동안 명령을 내보냅니다. 여러 방향 키를 함께 누른 경우 남아 있는 키 집합으로 벡터를 다시 계산하고, 마지막 키를 놓을 때만 정지해 OS key repeat가 해제된 명령을 되살리지 않게 합니다. `Space`와 `Escape`도 진행 중인 입력을 취소합니다.
- `label`, 현재 명령, 짧은 조작 안내를 화면에 함께 표시한다. `instructions`로 안내 문구를 바꾸거나 `null`로 숨기고, `showValue={false}`로 현재 명령 표시를 숨길 수 있다. 조작 영역은 표시된 텍스트를 각각 `aria-labelledby`와 `aria-describedby`로 참조한다. 현재 명령은 시각 피드백이지만 라이브 영역은 아니므로 연속 입력마다 과도하게 공지하지 않는다.
- `disabled`는 조작 영역을 tab 순서와 입력에서 제외한다. 활성 입력 중 `disabled`로 전환되면 먼저 정지 벡터를 내보내고 `onEnd('disabled')`를 호출한다.
- `sticky`는 기존 API 호환을 위한 시각 옵션입니다. 일반 pointer/keyboard release 뒤 노브의 마지막 위치만 유지하고, 내부 명령 원점과 실제 `onChange` 출력은 즉시 0으로 초기화합니다. `Space`/`Escape`, blur, cancel, disabled는 남은 시각 위치도 중앙으로 되돌립니다.
- Joystick만으로 정밀한 비드래그 대안을 충족했다고 간주하지 않는다. 같은 작업에 단계 이동이 허용된다면 로컬 [`DirectionalPad`](./DirectionalPad.prompt.md)를 함께 제공한다. 연속 아날로그 벡터가 필수라면 제품에서 동등한 단일 포인터 대안을 별도로 설계한다.
- 통신 watchdog, 속도 제한, 권한 확인, 충돌 회피, 실제 안전 정지는 제품·로봇 제어 계층이 소유한다. UI의 `onEnd`만 안전 기능으로 간주하지 않는다.

## 외부 근거와 적용

- [WCAG 2.2 — Keyboard](https://www.w3.org/WAI/WCAG22/Understanding/keyboard.html): 포인터와 같은 기능을 키보드에서도 수행할 수 있게 하고, 키를 놓는 종료 경로까지 명시적으로 구현했다.
- [WCAG 2.2 — Dragging Movements](https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements.html): 누르기만 해도 벡터가 생성되게 했고, 이산 이동이 가능한 문맥에서는 DirectionalPad를 동등한 단일 포인터 대안으로 조합한다.
- [WAI-ARIA — `application` role](https://www.w3.org/TR/wai-aria/#application): 조이스틱처럼 보조기술의 일반 탐색 키를 직접 처리해야 하는 특수 복합 조작에만 이 역할을 제한한다. 역할 사용 시 보이는 이름·키 안내·현재 명령을 함께 제공한다.

의도적으로 포함하지 않은 범위는 앱 전용 경로 계획, 카메라·지도, 장비별 축 매핑, 자동 반복 속도 곡선이다. 이 컴포넌트는 입력과 정지 이벤트의 UI 계약만 제공한다.
