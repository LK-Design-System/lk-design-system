**Breadcrumb** — 셰브론 구분자가 있는 경로 트레일. 상위는 뮤트 링크, 마지막 항목은 굵은 현재 페이지.

Classification: **LK Product Extension**. 현재 페이지의 상위 경로를 보여주는 로컬 웨이파인딩이며, TopBar·SideNav·NavRail·BottomNav 같은 주 탐색을 대신하지 않습니다.

```jsx
<Breadcrumb items={[
  { label: '홈', href: '/' },
  { label: '제품', href: '/products' },
  { label: 'LKR-T1' },
]} />
```

- **items** — `{ label, href }[]`; 마지막 항목은 현재 페이지로 렌더됩니다(링크 없음, `aria-current="page"`).
- **접근성** — APG 패턴대로 `nav > ol > li` 구조로 렌더되고, 셰브론 구분자는 장식(`aria-hidden`)입니다. `nav`의 기본 `aria-label`은 `'현재 위치'`이며 `aria-label`을 넘기면 덮어씁니다.
- 타입 스케일 정합: 내비 텍스트 13.5px → `--label2-size`(13px)로 스냅했습니다. 경로 트레일은 웨이파인딩 메타라 한 단계 아래로 정렬합니다.
