**ScrollArea** — 브라우저의 네이티브 스크롤 동작에 LDS의 공간·포커스 정책을 더하는 컨테이너.

```jsx
<ScrollArea maxHeight={320} label="운영 로그">{longList}</ScrollArea>
<ScrollArea maxHeight={240} label="장비 메뉴" scrollbar="compact">{menu}</ScrollArea>
<ScrollArea maxHeight={320} labelledBy="log-heading" gutter="auto">{longList}</ScrollArea>
```

- **maxHeight** — 상한(px/CSS). 알림 목록, 긴 메뉴, 스펙 표를 감싸세요.
- **label / labelledBy** — 스크롤 영역의 접근 가능한 이름. 내용이 넘칠 수 있는 영역에는 반드시 하나를 주세요.
- **focusable** — `"auto"`(기본) · `true` · `false`.
- **scrollbar** — `"auto"`(기본) · `"compact"`. 기본값은 OS·브라우저·사용자 설정을 바꾸지 않습니다. `compact`는 메뉴처럼 공간이 제한된 표면에서만 표준 `scrollbar-width: thin`을 선택합니다.
- **gutter** — `"stable"`(기본) · `"auto"`. 기본값은 스크롤바 출현에 따른 내용 폭 변화를 줄입니다.

## 정책

- 스크롤바를 DOM 요소로 다시 만들지 않습니다. 휠, 트랙패드, 터치, 키보드, 고대비 모드 등 브라우저의 네이티브 동작을 유지합니다.
- 스크롤바를 숨기는 옵션은 공용 API로 제공하지 않습니다. 숨김은 대체 위치 단서와 이동 수단이 있는 특수 패턴에서만 코드 예외로 관리합니다.
- 강제 색상 모드에서는 사용자 에이전트의 스크롤바 색상과 폭으로 돌아갑니다.
- 로컬 WDS에는 `ScrollArea` component-set이 없고 `Scroll Bar` 장식 인스턴스만 확인됩니다. 따라서 이 컴포넌트는 **LDS Core / WDS-adjacent** 접근성 계약이며 WDS 직접 패리티로 주장하지 않습니다.

## 키보드 접근 규칙 (WCAG 2.1.1)

- 실제로 넘치는 영역은 `tabIndex=0`과 접근 가능한 이름을 가진 `region`으로 노출되어 `↑ ↓ PageUp PageDown Home End`로 조작할 수 있습니다.
- 넘치지 않는 컨테이너까지 탭 순서에 넣지 않도록 `ResizeObserver`로 오버플로를 측정합니다. 측정 없이 고정하려면 `focusable`을 명시하세요.
- 이름이 없으면 `role="region"`을 붙이지 않고 개발 모드에서 경고합니다.
- 내부 포커스 요소만으로 전체 스크롤 범위에 도달할 수 있다면 `focusable={false}`로 중복 정지점을 끌 수 있습니다.

## 공식 근거

- [CSS Scrollbars Styling Module Level 1](https://www.w3.org/TR/css-scrollbars-1/) — 네이티브 스크롤바의 표준화된 색상·폭 속성과 사용자 설정 존중.
- [CSS Color Adjustment Level 1](https://www.w3.org/TR/css-color-adjust-1/#forced-colors-properties) — 강제 색상 모드의 사용자 색상 우선.
- [WCAG 2.2 SC 2.1.1 Keyboard](https://www.w3.org/WAI/WCAG22/Understanding/keyboard.html) — 포인터 없이도 기능을 사용할 수 있어야 함.
- [Deque `scrollable-region-focusable`](https://dequeuniversity.com/rules/axe/html/4.8/scrollable-region-focusable) — 스크롤 컨테이너의 키보드 도달성 검사.
