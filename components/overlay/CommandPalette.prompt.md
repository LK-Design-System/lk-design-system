**CommandPalette** — 검색 필드와 필터링된 명령 목록이 있는 ⌘K 스타일 모달.

```jsx
<CommandPalette open={open} onClose={close} commands={[
  { label: '제품 보기', shortcut: 'P', onSelect: goProducts },
  { label: '도입 문의', shortcut: 'C', onSelect: goContact },
]} />
```

- **open / onClose** — 제어형(Esc·스크림으로 닫힘). **commands** — `{ label, icon, shortcut, onSelect }`.
  입력하면 라벨로 필터링됩니다. 입력 초점을 유지한 채 Arrow Up/Down, Home/End로 활성 명령을
  이동하고 Enter로 실행합니다. Tab은 modal 안에서 순환하고 닫힌 뒤 trigger로 돌아갑니다.
- **Escape는 2단계**입니다. 검색어가 남아 있으면 1차 Escape가 검색어만 비우고, 빈 필드에서
  누른 Escape만 dialog를 닫습니다. VS Code·Spotlight·Slack의 ⌘K 관습입니다.
- 활성 명령은 `aria-activedescendant`로만 이동하므로 목록이 스크롤될 때 컴포넌트가 활성 항목을
  다시 보이는 위치로 끌어옵니다. listbox의 자식은 option뿐이고, 결과 없음 문구와 결과 수 알림은
  listbox 바깥에 둡니다.
- 필터 결과 수는 상시 마운트된 `role="status"` live region이 polite로 전달합니다. 문구는
  `resultsLabel(count)`로 바꿉니다. 같은 formatter가 결과 없음 문구도 만듭니다.
- 초점 계약은 `initialFocusRef`·`returnFocusRef`·`restoreFocus`로 조정하고, 이름은 `ariaLabel`,
  검색 필드 안내는 `placeholder`로 지정합니다. 표준 `style`은 dialog 표면에 병합됩니다.
- **전역 ⌘K wiring은 제품이 소유합니다.** 컴포넌트는 전역 단축키를 등록하지 않습니다. 제품에서
  `keydown`을 듣고 `(event.metaKey || event.ctrlKey) && event.key === 'k'`일 때 `event.preventDefault()`
  후 `open`을 켜세요. 팔레트가 어떤 화면에서 열려야 하는지는 제품의 라우팅 맥락이 결정합니다.

### 접근성 근거와 적용 결론

- [WAI-ARIA Modal Dialog Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/) — CommandPalette는
  `aria-modal` 표면이므로 초기 초점, 내부 Tab 순환, Escape, focus 복원을 공용 계약으로 제공합니다.
- [WAI-ARIA Combobox Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/) — 결과 수가 바뀌면
  polite로 알리고, listbox는 option만 소유하며, 활성 option은 항상 보이는 상태를 유지해야 합니다.
- [React Aria Menu](https://react-aria.adobe.com/Menu) — 복합 명령 목록은 방향키 탐색과 활성 항목
  전달을 제공해야 합니다. 검색 입력을 combobox로 유지하고 `aria-activedescendant`로 listbox의
  활성 명령을 연결해 입력 흐름을 끊지 않습니다.
