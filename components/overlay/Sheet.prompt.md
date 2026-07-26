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
