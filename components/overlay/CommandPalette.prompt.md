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

### 접근성 근거와 적용 결론

- [WAI-ARIA Modal Dialog Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/) — CommandPalette는
  `aria-modal` 표면이므로 초기 초점, 내부 Tab 순환, Escape, focus 복원을 공용 계약으로 제공합니다.
- [React Aria Menu](https://react-aria.adobe.com/Menu) — 복합 명령 목록은 방향키 탐색과 활성 항목
  전달을 제공해야 합니다. 검색 입력을 combobox로 유지하고 `aria-activedescendant`로 listbox의
  활성 명령을 연결해 입력 흐름을 끊지 않습니다.
