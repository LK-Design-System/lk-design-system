**useSubmenuBranch** — 메뉴 표면(DropdownMenu, Menubar)이 공유하는 **headless 서브메뉴 브랜치
엔진**입니다. `components/internal/useMenuKeyboard.js` 위에서 동작하며, 서브메뉴 열림 상태·hover
인텐트·키보드·포탈 배치를 소유합니다. 새 메뉴 표면은 서브메뉴를 손으로 재구현하지 않고 이 훅을
사용합니다.

```jsx
const branch = useSubmenuBranch({ disabled });

<div {...branch.containerHandlers}>
  <button ref={branch.triggerRef} role="menuitem" {...branch.triggerAria} {...branch.triggerHandlers}>
    내보내기
  </button>
  {branch.renderPanel(
    <div role="menu" id={branch.menuId} ref={branch.menuRef} onKeyDown={branch.menuKeyDown}>
      <button role="menuitem">CSV</button>
    </div>,
  )}
</div>
```

## 엔진이 소유하는 것

- **열림 상태와 hover 인텐트**: 진입 120ms 후 열고 이탈 180ms 후 닫습니다. 트리거 클릭은 토글,
  ArrowRight/Enter/Space는 첫 항목 entry focus와 함께 엽니다.
- **키보드**: `menuKeyDown`은 ArrowLeft에서 서브메뉴를 닫고 트리거로 초점을 복원한 뒤, 나머지
  키는 공용 `useMenuKeyboard`(화살표·typeahead·Escape 스택)로 위임합니다.
- **포탈 배치**: 패널을 `document.body`로 포탈해 부모 패널의 overflow/scroll clip을 벗어나고,
  부모 메뉴 패널의 좌우 여백을 기준으로 겹치지 않게 배치합니다(공간 부족 시 왼쪽 오픈).
- **ARIA 배선**: `triggerAria`가 `aria-haspopup="menu"`, `aria-expanded`, 열림 시
  `aria-controls={menuId}`를 제공합니다.

## 소비자 규약

- `menuId`는 포탈 패널의 `role="menu"` 노드에 부여합니다. 패널 시각 chrome(배경·테두리·그림자)은
  소비자가 소유하며 `renderPanel`의 두 번째 인자로 병합합니다.
- 서브메뉴 항목의 role 규약과 `data-menu-back` 규약은 `components/internal/useMenuKeyboard.prompt.md`를
  따릅니다.

## 근거

- [WAI-ARIA APG Menu and Menubar pattern](https://www.w3.org/WAI/ARIA/apg/patterns/menubar/)의
  서브메뉴 키보드 계약: ArrowRight 열기(첫 항목 초점), ArrowLeft/Escape 닫기(부모 항목 초점 복원),
  `aria-haspopup`·`aria-expanded` 노출.
- 전용 계약 테스트는 `scripts/check-engine-contracts.mjs`가 `useMenuKeyboard` 계약을 통해
  검증하며, 서브메뉴 조합 동작은 DropdownMenu·Menubar 스토리 play가 커버합니다.
