**useMenuKeyboard** — LDS 메뉴 표면(DropdownMenu, Menubar, SplitButton, UserMenu, `useSubmenuBranch`)이
공유하는 **headless roving focus·typeahead·dismiss 엔진**입니다. 내부 구현이 아니라 계약이 있는
정식 계층이며, 새 메뉴 표면은 이 훅을 사용하고 화살표 탐색·typeahead·Escape 처리를 손으로
재구현하지 않습니다(`npm run check:engine-reuse`가 감시).

```jsx
const { menuRef, requestItemFocus, closeMenu, handleMenuKeyDown } = useMenuKeyboard({
  open,
  onClose: () => setOpen(false),
  getTrigger: () => triggerRef.current,
});

<div role="menu" ref={menuRef} onKeyDown={handleMenuKeyDown}>
  <button role="menuitem">이름 바꾸기</button>
  <button role="menuitem" aria-disabled="true">삭제</button>
</div>
```

## 엔진이 소유하는 것

- **Roving focus**: 열림(또는 `menuKey` 교체) 후 한 프레임 뒤에 모든 항목의 `tabIndex`를 -1로
  내리고 entry focus를 첫 번째 *명령* 항목에 앉힙니다. `data-menu-back` 드릴-업 컨트롤은 화살표로
  도달 가능하지만 entry focus를 삼키지 않습니다. `requestItemFocus('last')`로 다음 entry 위치를
  예약할 수 있습니다.
- **Entry focus 취소**: 예약된 entry 프레임보다 키보드 탐색이 먼저 도착하면 프레임을 취소합니다.
  취소하지 않으면 사용자의 다음 keystroke 밑에서 초점이 가장자리 항목으로 끌려갑니다(이번 정비에서
  확정된 동작).
- **탐색 키**: ArrowDown/ArrowUp 순환, Home/End, 비활성 항목(`disabled`·`aria-disabled="true"`) 제외.
- **Typeahead**: 인쇄 가능한 문자는 500ms 안에서 하나의 검색 문자열로 누적됩니다. 한 글자는 현재
  항목 *다음*부터 탐색해 같은 머리글자를 순환하고, 두 글자 이상 버퍼는 현재 항목부터 다시
  정제합니다(APG typeahead). Space는 진행 중인 버퍼에만 참여하고 단독으로는 항목 활성화로
  남습니다. 닫힘·레벨 교체 시 버퍼를 비웁니다.
- **Dismiss 스택**: 문서 수준 Escape는 가장 나중에 열린 메뉴만 닫고 트리거로 초점을 복원합니다.
  메뉴 내부 Escape도 동일하며, Tab은 초점 복원 없이 닫습니다(`closeMenu()`).

## 소비자 규약

- 항목은 `role="menuitem" | "menuitemradio" | "menuitemcheckbox"`로 렌더하고, 같은 `role="menu"`
  컨테이너에 직접 속해야 합니다(중첩 메뉴는 각자 엔진 인스턴스를 가짐).
- `menuRef`와 `handleMenuKeyDown`을 같은 `role="menu"` 노드에 연결합니다. 항목 활성화(클릭/Enter)와
  시각 스타일은 소비자가 소유합니다.
- 드릴-업/뒤로 컨트롤에는 `data-menu-back` 속성을 붙입니다. 드릴 레벨처럼 같은 메뉴 노드에서 항목
  집합이 바뀌면 `menuKey`를 증가시켜 entry focus와 typeahead를 재시작합니다.
- 바깥 클릭 dismiss는 이 엔진 소관이 아닙니다 — `components/overlay/anchored-overlay.js`의
  `useLightDismiss`와 조합합니다.

## 근거

- [WAI-ARIA APG Menu and Menubar pattern](https://www.w3.org/WAI/ARIA/apg/patterns/menubar/)이
  화살표 순환, Home/End, 문자 typeahead, Escape 닫기 후 트리거 초점 복원을 정의합니다.
- [WAI-ARIA APG Keyboard interface practice](https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/)의
  roving tabindex 관리 기법을 따릅니다: 한 시점에 composite 위젯 내부의 tab stop은 하나입니다.
- 전용 계약 테스트는 `scripts/check-engine-contracts.mjs`(`npm run check:engine-contracts`)가
  소비자 없이 검증합니다.
