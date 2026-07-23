**Card** — 모든 것이 올라가는 중립 서피스: 화이트(또는 `dark` 네이비), 헤어라인 보더, 부드러운 네이비 그림자, 16px 반경. `interactive`는 호버 시 떠오릅니다.

```jsx
<Card elevation="md" interactive onClick={openDetail}>…</Card>
<Card dark padding={22}>…</Card>
```

```jsx
<Card platform="mobile" save title="Title" description="Description" />
<Card platform="desktop" skeleton headingLevel={2} />
```

- WDS axes: `platform="desktop|mobile"`, `skeleton`, `save`, `toggleIcon` (top-right toggle affordance beside `save`), structured slots (`thumbnail`, `topContent`, `leadingContent`, `trailingContent`, `bottomContent`, `footer`) and three text caption tiers (`caption`, `title`, `description`, `subCaption`, `metaCaption`).
- Plain children-only Card usage is still supported for generic LDS surfaces.

## 카드 전체 클릭 vs 내부 인터랙티브 요소

카드를 클릭 대상으로 만드는 방법은 두 가지뿐이고, **둘을 섞으면 안 됩니다.**

1. **전체 카드가 하나의 행동일 때 → `interactive` + `onClick`.**
   카드 루트가 `role="button"` · `tabIndex=0` 이 되고 Enter/Space 로 활성화되며 `:focus-visible` 링이 붙습니다(WCAG 2.1.1). 이때 카드 **안에는 버튼·링크·스위치 같은 포커스 가능한 요소를 넣지 마세요.** 버튼 안의 버튼(nested interactive)은 유효하지 않은 마크업이고, 스크린리더가 카드 이름으로 내부 텍스트를 전부 읽어 이름이 문단처럼 길어집니다.
2. **카드 안에 행동이 여러 개거나 본문 일부만 링크일 때 → `interactive` 를 쓰지 말고** 제목에 링크/버튼을 두세요. 카드 전체를 누르는 느낌이 필요하면 *stretched link* 패턴을 쓰되, 확대 영역을 만드는 것은 링크의 `::after` 이고 카드 루트는 `position: relative` 인 비대화형 요소로 남습니다.

```jsx
// 1) 전체가 행동 — 내부에 포커스 가능한 요소 없음
<Card interactive onClick={openDetail} title="점검 리포트" description="2026-07-20" />

// 2) 내부에 행동이 여러 개 — interactive 금지
<Card title="점검 리포트" description="2026-07-20"
  footer={<><Button>열기</Button><Button variant="ghost">공유</Button></>} />

// 2') stretched link — 카드 루트는 비대화형, 링크만 영역을 넓힘
<Card style={{ position: 'relative' }}
  title={<a href="/report" style={{ position: 'static' }}>점검 리포트</a>} />
```

- `headingLevel` — 구조화 모드의 `title` 은 기본적으로 `<h3>` 로 렌더링됩니다(WCAG 1.3.1). 카드가 놓이는 문서의 제목 계층에 맞춰 `1`–`6` 을 주고, 제목이 이미 카드 바깥에 있으면 `headingLevel={false}` 로 heading 의미를 끄세요. 레벨은 건너뛰지 않습니다.
- `SaveButton`(`save`)과 `toggleIcon` 은 포커스 가능한 요소이므로 규칙 1과 함께 쓰지 마세요.
