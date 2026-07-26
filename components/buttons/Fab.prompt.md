**Fab** — 화면에서 가장 중요한 단일 액션을 위한 둥글고 떠 있는 플로팅 액션 버튼.

```jsx
<Fab label="문의 보내기"><Icon name="send" /></Fab>
<Fab variant="dark" size="lg" label="새 항목"><Icon name="plus" /></Fab>
```

- **variant** `signal · dark · primary · secondary · white`. **size** `sm 48 · md 56 · lg 64`. 항상 **label**을 전달하세요. 누락하면 development 빌드에서 console 경고가 출력됩니다(production 번들에서는 제거됨).
- 나머지 props(`{...rest}`)는 Button·IconButton과 동일하게 **가장 먼저** 펼쳐집니다. `type`, `aria-label`, `disabled`, 이벤트 핸들러 같은 컴포넌트 계약은 consumer prop이 덮어쓸 수 없습니다(`type`은 명시적으로 전달하면 존중됩니다).
- `md` 56px 원형과 disable 축은 WDS `Button/Floating Action Button` 기준입니다. 추가 크기와 palette는 LDS 확장입니다.
- Native `disabled`는 focus에서 제외되고, `aria-disabled="true"`는 focus를 유지하면서 같은 unavailable 스타일과 activation 차단을 적용합니다.
- hover/pressed는 색조만 잔잔하게 바뀌며 위치, scale, 그림자 깊이는 변하지 않습니다.
- [WAI-ARIA Button Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/button/)의 accessible name과 keyboard activation 계약을 따릅니다.
