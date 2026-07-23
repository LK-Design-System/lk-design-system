**dialog-focus** — 모달 다이얼로그 표면(Modal, Alert, ConfirmDialog, CommandPalette, Lightbox,
Drawer, Sheet)이 공유하는 **headless 초점 트랩·복원·스택·스크롤 잠금 엔진**입니다. 새 모달
표면은 `useDialogFocus`를 사용하고 Tab 순환·초점 복원·body 스크롤 잠금을 손으로 재구현하지
않습니다(`npm run check:engine-reuse`가 감시).

```jsx
const { dialogRef, zIndex } = useDialogFocus({
  open,
  onDismiss: onClose,
  initialFocusRef,
  returnFocusRef,
});

<div role="dialog" aria-modal="true" ref={dialogRef} style={{ zIndex }}>…</div>
```

## 엔진이 소유하는 것

- **초점 트랩**: Tab/Shift+Tab이 다이얼로그의 focusable 요소(가시성·`inert`·`aria-hidden` 필터
  포함) 안에서 순환합니다. focusable이 없으면 다이얼로그 자신이 초점을 받습니다. 다이얼로그 밖으로
  새는 `focusin`은 즉시 안으로 되돌립니다.
- **entry focus**: 열리고 한 프레임 뒤 `initialFocusRef` → 첫 focusable → 다이얼로그 순으로
  초점을 앉힙니다.
- **오버레이 스택**: 가장 나중에 연 오버레이만 초점 봉쇄와 Escape를 소유합니다. `zIndex`는 스택
  위치에 따라 엔진이 배정합니다(base 100). 위 오버레이가 닫히면 아래 오버레이가 다시 활성화되고,
  invoker가 아래 오버레이 안이면 그 요소로 초점이 돌아갑니다.
- **초점 복원**: 닫힐 때 `returnFocusRef` → 열기 직전 activeElement로 복원합니다
  (`restoreFocus: false`로 opt-out).
- **body 스크롤 잠금**: 중첩 카운트를 공유해 첫 잠금만 이전 인라인 스타일을 캡처하고 마지막
  해제만 복원합니다. 스크롤바 폭만큼 body padding을 보태 레이아웃 reflow를 막습니다.
  페이지 스크롤을 의도적으로 남기는 표면은 `lockScroll: false`를 전달합니다.
- **Escape**: `onDismiss`가 있을 때만 preventDefault 후 호출합니다. 없으면 Escape로 닫히지 않는
  강제 확인 다이얼로그가 됩니다.

## 소비자 규약

- `dialogRef`는 `role="dialog"`(또는 `alertdialog`) + `aria-modal="true"` 노드에 연결하고,
  반환된 `zIndex`를 그 표면(또는 스크림 컨테이너)에 적용합니다.
- 스크림 클릭 닫기, 애니메이션, 시각 chrome은 소비자가 소유합니다.
- 초점을 가두지 않는 앵커드 표면은 이 엔진이 아니라 `components/overlay/anchored-overlay.js`의
  `useLightDismiss`를 사용합니다.

## 근거

- [WAI-ARIA APG Dialog (Modal) pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/):
  Tab 순환, 열릴 때 내부 초점 이동, 닫힐 때 invoker 초점 복원, Escape 닫기.
- [WCAG 2.2 SC 2.4.3 Focus Order](https://www.w3.org/WAI/WCAG22/Understanding/focus-order.html)와
  [SC 2.1.2 No Keyboard Trap](https://www.w3.org/WAI/WCAG22/Understanding/no-keyboard-trap.html):
  모달이 열려 있는 동안의 초점 봉쇄는 닫기 수단(Escape·닫기 버튼)과 함께 제공될 때만 허용됩니다.
- 전용 계약 테스트: `scripts/check-engine-contracts.mjs`(`npm run check:engine-contracts`).
