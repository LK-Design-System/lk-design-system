**anchored-overlay** — 초점을 가두지 않는 앵커드 오버레이(Tooltip, HoverCard, Popover,
DropdownMenu, Menubar, SplitButton, UserMenu)가 공유하는 **headless 상태·dismiss·배치 엔진**입니다.
`useControllableOpen`(열림 상태 triad), `useLightDismiss`(light dismiss + Escape 래치),
`useFloatingPosition`(측정·flip·클램프)을 내보냅니다. 새 앵커드 표면은 이 엔진을 사용하고 바깥
클릭·Escape·뷰포트 배치를 손으로 재구현하지 않습니다(`npm run check:engine-reuse`가 감시).

```jsx
const [open, setOpen] = useControllableOpen({ open: openProp, defaultOpen, onOpenChange });
useLightDismiss({
  open,
  rootRef,
  getTrigger: () => triggerRef.current,
  onDismiss: () => setOpen(false),
});
const position = useFloatingPosition({ open, anchorRef: rootRef, panelRef, placement: 'bottom' });
```

## useLightDismiss가 소유하는 것

- **바깥 pointerdown dismiss**: 앵커 루트 밖의 pointerdown은 `onDismiss('outside-press')`를
  호출합니다. 초점은 옮기지 않습니다 — 포인터가 누른 대상이 다음 초점 목적지를 소유합니다.
- **최상단 Escape**: 문서 수준 Escape는 가장 나중에 열린 오버레이만 닫습니다(공유 스택).
  이 앵커가 실제로 초점을 소유할 때만 트리거로 초점을 복원하고, 포인터 전용 세션에서는 캐럿을
  건드리지 않습니다.
- **Escape 재오픈 래치**(이번 정비에서 확정): 이 엔진 위의 표면은 focus로 열리므로(HoverCard,
  Tooltip) Escape가 트리거로 초점을 되돌리면 open-on-focus 규칙이 재발화해 방금 닫은 것이 즉시
  되살아납니다. 래치는 초점이 진짜로 앵커를 떠나거나 표면이 의도적으로 다시 열릴 때까지 앵커
  내부 focus 이벤트를 캡처 단계에서 삼켜 콘텐츠가 닫힌 채 유지되게 합니다. 포인터 재진입과 이후
  Tab 복귀는 평소대로 다시 엽니다.
- **`shouldDismiss` 거부권**(선택): `(reason, event) => boolean`. `false`를 돌려주면 그 dismiss는
  실행되지 않고 Escape의 `preventDefault`도 건너뜁니다. 공유 스택은 이 엔진을 쓰는 중첩 표면만
  알기 때문에, 소비자가 루트 안에 직접 끼워 넣은 표면(SideNav 레일 안의 `[role="menu"]`)이
  그 입력을 소유해야 할 때 씁니다. `false`가 아닌 값은 모두 통과입니다.

## useFloatingPosition이 소유하는 것

- 앵커·패널 측정(rAF 스케줄, resize/scroll/ResizeObserver 추적), 공간이 부족하면 여유가 더 큰
  반대편으로 flip, 뷰포트 안으로 `shiftX/shiftY` 되밀기, 배치 방향의 `maxHeight` 계산.
- 시각 chrome, 정렬(align), 애니메이션은 소비자가 소유합니다.

## 소비자 규약

- `rootRef`는 트리거와 떠 있는 콘텐츠를 **모두** 포함해야 합니다. 포탈된 패널은 이 엔진의 바깥
  판정과 래치 범위를 벗어나므로 사용하지 않습니다(포탈이 필요한 메뉴는
  `components/internal/useSubmenuBranch.jsx` 참조).
- 열림 상태는 `useControllableOpen`의 `open · defaultOpen · onOpenChange` triad로 소유하고,
  `onDismiss`에서 같은 setter를 호출합니다.
- 초점을 가두는 모달 표면은 이 엔진이 아니라 `components/overlay/dialog-focus.js`를 사용합니다.
- ARIA 참조 병합은 `appendAriaReference`, 트리거 추정은 `findOverlayTrigger`
  (`data-anchored-overlay-trigger` 우선)를 재사용합니다.

## 근거

- [WCAG 2.2 SC 1.4.13 Content on Hover or Focus](https://www.w3.org/WAI/WCAG22/Understanding/content-on-hover-or-focus.html):
  hover/focus 추가 콘텐츠는 dismissible해야 하며 닫은 콘텐츠는 닫힌 채 유지되어야 합니다 —
  Escape 래치의 직접 근거.
- [WAI-ARIA APG Tooltip pattern](https://www.w3.org/WAI/ARIA/apg/patterns/tooltip/): Escape 닫기,
  트리거 초점 유지, 비초점 콘텐츠.
- [WAI-ARIA APG Dialog (Modal) pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)과의
  경계: 이 엔진은 초점을 가두지 않는 표면 전용입니다.
- 전용 계약 테스트: `scripts/check-engine-contracts.mjs`(`npm run check:engine-contracts`).
