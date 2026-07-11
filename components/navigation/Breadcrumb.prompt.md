**Breadcrumb** — 셰브론 구분자가 있는 경로 트레일. 상위는 뮤트 링크, 마지막 항목은 굵은 현재 페이지.

```jsx
<Breadcrumb items={[
  { label: '홈', href: '/' },
  { label: '제품', href: '/products' },
  { label: 'LKR-T1' },
]} />
```

- **items** — `{ label, href }[]`; 마지막 항목은 현재 페이지로 렌더됩니다(링크 없음).
- 타입 스케일 정합: 내비 텍스트 13.5px → `--label2-size`(13px)로 스냅했습니다. 경로 트레일은 웨이파인딩 메타라 한 단계 아래로 정렬합니다.
