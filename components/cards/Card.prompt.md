**Card** — 모든 것이 올라가는 중립 서피스: 화이트(또는 `dark` 네이비), 헤어라인 보더, 부드러운 네이비 그림자, 16px 반경. `interactive`는 호버 시 떠오릅니다.

```jsx
<Card elevation="md" interactive>…</Card>
<Card dark padding={22}>…</Card>
```

```jsx
<Card platform="mobile" save title="Title" description="Description" />
<Card platform="desktop" skeleton />
```

- WDS axes: `platform="desktop|mobile"`, `skeleton`, `save`, `toggleIcon` (top-right toggle affordance beside `save`), structured slots (`thumbnail`, `topContent`, `leadingContent`, `trailingContent`, `bottomContent`, `footer`) and three text caption tiers (`caption`, `title`, `description`, `subCaption`, `metaCaption`).
- Plain children-only Card usage is still supported for generic LDS surfaces.
