**Sheet**는 작은 화면에서 선택지나 짧은 보조 액션을 bottom edge에 제공하는 modal surface입니다. 분류는 **LDS Product Extension**이며 WDS parity axis가 아닌 LDS 반응형 패턴입니다.

```jsx
const firstOptionRef = useRef(null);

<Sheet
  open={open}
  title="정렬"
  initialFocusRef={firstOptionRef}
  onClose={close}
  footer={<Button full onClick={close}>적용</Button>}
>
  <button ref={firstOptionRef} type="button">최신순</button>
</Sheet>
```

## 내부 비교와 시각 차이

- `Drawer`, `Modal`, `ConfirmDialog`를 sibling으로 확인했습니다. focus controller는 공유하지만 기존 bottom placement와 이동 방향을 유지합니다.
- Drawer와 달리 좌우 전체 폭의 bottom edge에 붙고, 최대 88vh, 상단 radius, grab handle을 사용합니다. 작은 화면에서 엄지 접근과 짧은 선택을 지원하는 기능 차이입니다.
- 시각 delta inventory: headline/body typography, title·body·footer spacing, elevated fill/foreground, shadow, 40×4px grab handle, 기존 Button 크기와 hover/focus/disabled 처리를 유지합니다. 상단 radius와 bottom 방향은 기능상 유지하고 divider나 선택 marker를 새로 만들지 않습니다. grab handle은 장식이며 keyboard dismiss를 대신하지 않습니다.
- 제목은 `aria-labelledby`로 연결하고, 제목이 없으면 `ariaLabel`이 이름을 제공합니다.

## 공통 Portal·stack 계약

- 기본 `withinPortal=true`이며 `LdsProvider.portalTarget` 또는 명시적 `portalTarget`에 렌더링됩니다. 가까운 theme scope와 `dir`을 상속하고 clipping ancestor를 벗어납니다.
- `zIndex`는 예외적 명시 override입니다. 평상시에는 공통 overlay stack이 중첩 순서, topmost Escape, background inert, body scroll lock과 focus 복원을 소유합니다.
- 테스트·특수 embedding에서만 `withinPortal=false`를 사용하며 이 경우 background inert는 적용하지 않습니다.

## 상호작용 계약

- `initialFocusRef` → 첫 tabbable 요소 → dialog 표면 순으로 초기 초점을 선택합니다.
- `Tab`/`Shift+Tab`, 외부 focus containment, `Escape`는 현재 stack의 최상위 Sheet에만 적용됩니다.
- 닫히면 trigger 또는 `returnFocusRef`로 복원합니다. `restoreFocus`는 기본 `true`입니다.
- footer의 선택/취소 버튼처럼 보이는 dismiss 수단을 제공합니다. grab handle이나 scrim만으로 닫게 하지 않습니다.
- footer는 end 정렬과 `space-2` action gap을 사용합니다. 작은 화면의 Sheet는 full-width CTA를 허용하며,
  취소 액션의 시각 문법은 다른 dialog footer처럼 `outlined` + `assistive`를 사용합니다.
- Sheet 위에 다른 modal surface를 상시 중첩하지 않습니다. 불가피한 확인 surface가 열리면 최상위만 상호작용하고 닫힌 뒤 Sheet 내부 호출 지점으로 복원됩니다.

## 공식 근거

- [WAI-ARIA APG Modal Dialog Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/): bottom placement와 무관하게 modal surface의 focus trap, Escape, trigger 복원, ARIA 이름 계약을 적용했습니다.
- [Fluent 2 Drawer](https://fluent2.microsoft.design/components/web/react/core/drawer/usage): edge에서 들어오는 overlay surface는 짧고 맥락적인 작업에 제한하고, header/body/footer와 scroll body를 분리하며 여러 overlay 동시 노출을 피합니다. LDS는 이를 작은 화면의 bottom edge로 적응했습니다.
- [Material Web Dialog](https://m2.material.io/develop/web/components/dialogs): modal surface는 배경 상호작용을 차단하고 필요 시 명시적 initial focus target을 제공해야 한다는 구현 근거를 보조로 사용했습니다.

모바일 breakpoint 선택, drag gesture/속도, snap point, URL·query 상태는 제품 레이어 책임입니다. LDS Sheet는 controlled open/dismiss, 기존 표면 구조와 keyboard/ARIA 계약만 제공합니다.

## 열림·닫힘 모션 (2026-10-13)

- Drawer와 같은 visual presence 계약을 bottom 방향에 적용합니다. scrim은 `--dur-base`, 패널은 `--dur-slow`와 `--ease-out`으로 등장·퇴장하고 기존 크기·radius·그림자·handle은 유지합니다. Product의 presence는 이 파일 내부에 두며 Core의 private 구현을 가져오지 않습니다.
- `open=false`가 되는 즉시 공통 focus controller의 trap·background inert·scroll lock을 해제하고 호출 지점으로 초점을 복원합니다. 퇴장 중 픽셀만 남는 패널은 `aria-hidden`·`inert`이며 scrim은 pointer를 받지 않습니다. shell이 자체 inert를 함께 해제하는 경우에는 Drawer처럼 DOM mutation 뒤 초점 handoff를 마칩니다.
- 패널 transform의 `transitionend` 또는 계산된 transition 시간 + 50ms 뒤 제거합니다. 재오픈·unmount는 이전 frame·timer를 취소하므로 닫힘 timer가 새 Sheet를 제거하지 않습니다.
- 퇴장 중 다른 호출 요소로 재오픈하면 새 open edge에서 호출 지점을 다시 캡처해 다음 닫힘이 최신 trigger로 복원되도록 합니다.
- `prefers-reduced-motion: reduce`에서는 전환을 0으로 두고 열린 endpoint를 바로 표시합니다. 퇴장 도중 환경설정이 바뀌어도 즉시 제거하며 상태·초점 계약은 유지합니다.
- [WAI-ARIA Modal Dialog](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)의 닫힘 후 호출 지점 복귀는 시각 퇴장을 기다리는 이유가 될 수 없다는 기준으로 적용했습니다. [W3C Animation from Interactions](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html)의 비필수 이동 비활성화 원칙을 적용했으며, 이는 AAA SC 2.3.3을 참고한 LDS 모션 계약입니다.

## 상위 overlay의 실제 닫힘

Product는 기존 공개 OverlayPortal의 interactionOpen에 실제 open을 전달합니다. Core-private hook을 import하지 않습니다. 자식 portal과 기존 엔진의 상호작용은 부모 닫힘과 함께 끝나며, 퇴장 중 재오픈은 uncontrolled 자식 subtree를 이전 immediate-unmount처럼 초기화합니다. controlled 상태와 callback은 소비자가 소유합니다.
