**Breadcrumb** — 셰브론 구분자가 있는 경로 트레일. 상위는 뮤트 링크, 마지막 항목은 굵은 현재 페이지.

```jsx
<Breadcrumb items={[
  { label: '홈', href: '/' },
  { label: '제품', href: '/products' },
  { label: 'LKR-T1' },
]} />
```

- **items** — `{ label, href }[]`; 마지막 항목은 현재 페이지로 렌더됩니다(링크 없음).
