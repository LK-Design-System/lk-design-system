## Shared scrim decision

All modal overlays map their scrim through `--component-dialog-scrim` to the WDS `--color-semantic-material-dimmer` value and share `--component-dialog-scrim-blur`. Individual overlays must not use `--scrim-dark`, `--material-dimmer`, or a local blur.

[Material Dialog guidance](https://m2.material.io/develop/web/components/dialogs) treats the scrim as the shared layer that de-emphasizes inaccessible background content. The confirming action is last in a horizontal action row.

**Modal**은 현재 화면을 일시적으로 차단하고 비교적 긴 단일 작업이나 상세 내용을 처리하는 범용 다이얼로그입니다. 분류는 **LDS Core overlay**이며, 이번 변경은 WDS variant axis가 아닌 접근성 호환 계약입니다.

```jsx
const firstFieldRef = useRef(null);

<Modal
  open={open}
  title="개입 문의"
  initialFocusRef={firstFieldRef}
  onClose={close}
  footer={(
    <>
      <Button variant="outlined" color="assistive" onClick={close}>취소</Button>
      <Button variant="signal">보내기</Button>
    </>
  )}
>
  <input ref={firstFieldRef} aria-label="회사명" />
</Modal>
```

## 내부 비교와 시각 차이

- 가장 가까운 sibling은 `ConfirmDialog`, `Alert`, `Drawer`, `Sheet`입니다. `ConfirmDialog`의 초기 초점·Tab 순환·Escape·복원 동작을 공통 controller로 승격했습니다.
- Modal은 중앙 정렬, 최대 520px, 제목/닫기 header, 스크롤 body, 선택적 footer를 유지합니다. `ConfirmDialog`보다 넓고 콘텐츠 작업용이라는 기능 차이가 이 구조를 정당화합니다.
- 시각 delta inventory: headline/body typography, header·body·footer spacing, `--component-dialog-radius`, divider, elevated fill/foreground, shadow, 20px 닫기 아이콘과 기존 Button 크기, hover/focus/disabled 처리는 모두 기존 값을 유지합니다. 선택/활성 marker와 방향 axis는 Modal이 소유하지 않습니다.
- header/body는 `space-5 space-6`, footer는 `space-4 space-6`, action gap은 `space-2`를 사용합니다.
  같은 footer 역할의 취소·보조 액션은 WDS 문법인 `outlined` + `assistive`, 확정 액션은 primary로 둡니다.
- `title`은 보이는 요소와 `aria-labelledby`로 연결합니다. 제목이 없으면 `ariaLabel`이 접근 가능한 이름을 제공합니다.

## 상호작용 계약

- 열리면 `initialFocusRef`가 가리키는 내부 요소를 먼저 포커스합니다. 유효하지 않으면 첫 tabbable 요소, 그것도 없으면 dialog 자체를 포커스합니다.
- `Tab`/`Shift+Tab`은 최상위 dialog 안에서 순환하고, 외부로 이동한 포커스도 최상위 dialog로 되돌립니다.
- `Escape`, scrim, 닫기 버튼은 controlled `onClose`를 호출합니다. 키보드 사용자를 위해 `onClose`와 보이는 닫기/취소 액션을 함께 제공합니다.
- 닫히면 기본적으로 실제 trigger로 복원합니다. 워크플로상 다음 요소가 더 적절하면 `returnFocusRef`, 복원이 의도적으로 불필요하면 `restoreFocus={false}`를 사용합니다.
- 여러 modal surface를 의도적으로 중첩하지 않습니다. 불가피하게 Drawer 안에서 확인 Modal 등이 열리면 가장 나중에 열린 surface만 Escape와 focus trap을 소유하며, 닫힌 뒤 바로 아래 surface의 호출 지점으로 돌아갑니다.

## 공식 근거

- [WAI-ARIA APG Modal Dialog Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/): 내부 초기 초점, Tab/Shift+Tab 순환, Escape dismiss, 호출 지점 복귀, `role="dialog"`/`aria-modal`/접근 가능한 이름을 계약으로 채택했습니다.
- [Fluent 2 Dialog](https://fluent2.microsoft.design/components/web/react/core/dialog/usage): header/body/footer anatomy를 유지하고, 인지·확대 사용자의 맥락을 해치는 dialog 중첩은 권장 패턴에서 제외했습니다.
- [Fluent 2 Drawer](https://fluent2.microsoft.design/components/web/react/core/drawer/usage): edge surface와 중앙 dialog의 용도를 분리하고, 확인이 필요할 때 Drawer 자체를 다른 dialog처럼 스타일링하지 않도록 했습니다.

Portal 선택, route 전환, 제출 상태와 데이터 보존은 제품 레이어가 소유합니다. Modal은 controlled open/dismiss, 표면 구조, focus/ARIA 계약만 소유합니다.
