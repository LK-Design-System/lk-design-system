**Icon** — **93개 글리프 라인 세트**(로보틱스 글리프 포함)로, LK의 아이콘 컴포넌트로 통째로 채택했습니다. 모든 글리프는 24px `currentColor` SVG여서 맥락의 잉크 / 시그널 잉크 / 뮤트 톤을 그대로 취합니다. (LK의 *컴포넌트 내부* 아이코노그래피를 원본 킷에 맞춘 것이며, `guidelines/iconography`의 Lucide 안내는 마케팅 사이트용 대체 아이콘을 문서화합니다.)

```jsx
<Icon name="search" />
<Icon name="bookmark" size={20} color="var(--lk-accent-ink)" />
<Icon name="circle-check-fill" color="var(--color-positive)" />
```

- **name** — `ICON_NAMES` 중 하나: `search · bookmark(-fill) · check · circle-check(-fill) · circle-info · circle-exclamation · chevron-{up,down,left,right} · arrow-{up,down,left,right,up-right} · close · plus · minus · filter · location · mail · bell · star(-fill) · heart · eye(-slash) · lock · clock · calendar · document · download · upload · share · send · trash · setting · more-{horizontal,vertical} · verified-check · nav-{recruit,career,social,mypage,menu} · …` 알 수 없는 이름은 빈 24px 박스로 렌더됩니다.
- **size** — px(기본 24). **color** — 임의의 CSS 색; 생략하면 `currentColor`로 상속.
- 설계상 단색 — 멀티컬러 제품 아이콘은 없습니다. 기능 타일에서는 10% 시안 워시(`--lk-accent-tint`) 위에 시그널 잉크 글리프를 놓습니다.
