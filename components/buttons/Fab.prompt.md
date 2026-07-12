**Fab** — 화면에서 가장 중요한 단일 액션을 위한 둥글고 떠 있는 플로팅 액션 버튼.

```jsx
<Fab label="문의 보내기"><Icon name="send" /></Fab>
<Fab variant="dark" size="lg" label="새 항목"><Icon name="plus" /></Fab>
```

- **variant** `signal · dark · primary · secondary · white`. **size** `sm 48 · md 56 · lg 64`. 항상 **label**을 전달하세요.
- `md` 56px 원형과 disable 축은 WDS `Button/Floating Action Button` 기준입니다. 추가 크기와 palette는 LDS 확장입니다.
- Native `disabled`는 focus에서 제외되고, `aria-disabled="true"`는 focus를 유지하면서 같은 unavailable 스타일과 activation 차단을 적용합니다.
- hover/pressed는 색조만 잔잔하게 바뀌며 위치, scale, 그림자 깊이는 변하지 않습니다.
- [WAI-ARIA Button Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/button/)의 accessible name과 keyboard activation 계약을 따릅니다.
