**EmptyState** — 빈 목록 / 결과 없음을 위한 중앙 플레이스홀더.

```jsx
<EmptyState icon={<Icon name="search" size={26} />} title="검색 결과가 없습니다"
  description="다른 산업이나 제품군으로 다시 검색해 보세요."
  action={<Button variant="flat">필터 초기화</Button>} />
```

- **icon / title / description / action** — 모두 선택적 노드. 아이콘은 부드러운 시안 타일에 놓입니다.
