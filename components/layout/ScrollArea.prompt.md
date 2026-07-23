**ScrollArea** — 얇은 쿨 그레이 커스텀 스크롤바가 있는 스크롤 컨테이너.

```jsx
<ScrollArea maxHeight={320} label="운영 로그">{longList}</ScrollArea>
<ScrollArea maxHeight={320} labelledBy="log-heading">{longList}</ScrollArea>
<ScrollArea maxHeight={320} focusable={false}>{shortList}</ScrollArea>
```

- **maxHeight** — 상한(px/CSS). 알림 목록, 긴 메뉴, 스펙 표를 감싸세요.
- **label / labelledBy** — 스크롤 영역의 접근 가능한 이름. 내용이 넘칠 수 있는 영역에는 반드시 하나를 주세요.
- **focusable** — `"auto"`(기본) · `true` · `false`.

## 키보드 접근 규칙 (WCAG 2.1.1)

- 스크롤 가능한 영역은 마우스 휠·드래그 외에 **키보드로도 스크롤할 수 있어야** 합니다. ScrollArea는 내용이 실제로 넘칠 때 `tabIndex=0` + `role="region"` + 접근 가능한 이름을 스스로 부여해 `↑ ↓ PageUp PageDown Home End`로 조작할 수 있게 합니다.
- **조건부(conditional) 방식을 택했습니다.** 넘치지 않는 컨테이너까지 탭 순서에 넣으면 아무 동작도 하지 않는 정지점이 늘어 오히려 탐색을 방해하므로, 오버플로를 `ResizeObserver`로 측정해 넘칠 때만 포커스 대상이 됩니다. 측정 없이 항상 고정하고 싶으면 `focusable` 를 명시하세요.
- 이름이 없으면 `role="region"` 을 붙이지 않고(이름 없는 landmark 금지) 개발 모드에서 경고합니다. `label` 또는 `labelledBy` 를 주세요.
- 내부에 이미 포커스 가능한 요소만 들어 있고 그 요소들로 스크롤이 전부 도달 가능하다면 `focusable={false}` 로 중복 정지점을 끌 수 있습니다.

## 공식 근거

- [W3C / Deque `scrollable-region-focusable`](https://dequeuniversity.com/rules/axe/html/4.8/scrollable-region-focusable) — 스크롤 컨테이너는 키보드로 접근 가능해야 합니다.
- [WCAG 2.2 SC 2.1.1 Keyboard](https://www.w3.org/WAI/WCAG22/Understanding/keyboard.html)
