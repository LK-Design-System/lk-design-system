**Card** — 모든 것이 올라가는 중립 서피스: 화이트(또는 `dark` 네이비), 헤어라인 보더, 부드러운 네이비 그림자, 16px 반경. `interactive`는 호버 시 떠오릅니다.

```jsx
<Card elevation="md" interactive onClick={openDetail}>…</Card>
<Card dark padding={22}>…</Card>
```

```jsx
<Card platform="mobile" save title="Title" description="Description" />
<Card platform="desktop" skeleton headingLevel={2} />
<Card density="compact" title="Dense console card" description="Typography stays unchanged." />
```

- 실제 `.fig`의 `Card/Card` component set을 검사한 결과, 확인되는 축은 `Platform=Desktop|Mobile`과 `Skeleton=False|True`뿐입니다. `density`는 WDS parity 축이 아니라 **명시적인 LDS Core compatibility extension**입니다.
- `save`, `toggleIcon`(top-right toggle affordance beside `save`), structured slots (`thumbnail`, `topContent`, `leadingContent`, `trailingContent`, `bottomContent`, `footer`) and three text caption tiers (`caption`, `title`, `description`, `subCaption`, `metaCaption`) are LDS's structured Card API; do not describe them as extra axes discovered in the inspected component set.
- Plain children-only Card usage is still supported for generic LDS surfaces.

## Density compatibility extension

- `density="comfortable|compact"` is opt-in and defaults to `comfortable`. On desktop, `comfortable` keeps the component Card padding (currently 32px) and `compact` uses `--space-4` (16px), then tightens related content/header/body/action gaps with the LDS spacing scale. It does **not** reduce Card typography.
- `platform="mobile"` keeps its existing 12px padding and 320px max-width contract even when `density="compact"` is present. Platform can retain its existing mobile title scale; density itself never changes type size.
- An explicit `padding` prop wins over platform/density defaults and `--lds-card-padding`. Use `vars` for the default padding only when the prop is absent. The root mirrors the resolved API choice as `data-density`.
- [MUI density guidance](https://mui.com/material-ui/customization/density/) treats density as an opt-in adjustment through component props, spacing, and size; its dense demo theme is not a recommendation to force compactness across an entire application. Adopt compact Card only where scan-heavy console context needs it.
- [Carbon spacing](https://carbondesignsystem.com/elements/spacing/overview/) uses a spacing scale to establish relationships and control density, while [Fluent 2 layout](https://fluent2.microsoft.design/layout) uses smaller component spacers to strengthen relationships and allows responsive spacing adjustments. Keep compact values on the LDS spacing ramp rather than introducing one-off pixels.
- In data-heavy consoles, pair Card density deliberately with neighboring controls and tables. [Carbon Data Table usage](https://carbondesignsystem.com/components/data-table/usage/) pairs toolbar/header/row sizes rather than mixing independent density decisions inside one region.

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

- `titleWrap="truncate|wrap"` controls structured-title overflow. The default `truncate` keeps dense card grids to one line; use `wrap` when the full document, report, or publication title is necessary to distinguish the destination. Wrapping changes only the title text flow and does not introduce a separate header/body padding axis.

## Semantic roots and inset groups

- Use `as="article"`, `as="section"`, or `as="li"` for a non-interactive card when that native document structure is meaningful. The default remains `div`.
- Do not combine a document-structure `as` value with `interactive`: interactive cards intentionally expose a single button role. Keep a non-interactive semantic root when the card contains links or buttons.
- Use `surface="subtle"` for the inset surface that groups peer cards. It defaults to `elevation="none"`; nested default-surface cards own their own border, radius, and elevation. An explicit elevation is still available for exceptional compositions.
- `dark` remains the inverse-card compatibility axis and takes precedence over `surface`.

```jsx
<Card as="section" surface="subtle" aria-labelledby="related-title">
  <h2 id="related-title">Related projects</h2>
  <Card as="article" elevation="sm">Project A</Card>
</Card>
```

## Public surface and ref

- `className`, `style`, and the default ref target the polymorphic root. The ref type follows the rendered `as` element.
- Stable structured parts are `root`, `content`, `header`, `actions`, `media`, `body`, `title`, `description`, and `footer`. Optional parts do not render empty wrappers.
- `classNames` and `styles` accept only those stable part keys; product selectors do not depend on Card's internal DOM order.
- Root state is mirrored through `data-interactive`, `data-surface`, `data-dark`, `data-density`, and skeleton `data-loading`.
- `vars` accepts only `--lds-card-padding`, `--lds-card-radius`, `--lds-card-gap`, and `--lds-card-max-width`. These cannot turn a non-interactive card into a control or bypass heading/nesting rules.
