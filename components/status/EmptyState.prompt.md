**EmptyState** — 빈 목록 / 결과 없음을 위한 중앙 플레이스홀더.

```jsx
<EmptyState icon={<Icon name="search" size={26} />} title="검색 결과가 없습니다"
  description="다른 산업이나 제품군으로 다시 검색해 보세요."
  action={<Button variant="flat">필터 초기화</Button>} />

<EmptyState headingLevel={3} title="아직 로그가 없습니다" />
```

- **icon / title / description / action** — 모두 선택적 노드. 아이콘은 부드러운 시안 타일에 놓입니다.
- **title은 실제 heading으로 렌더됩니다.** 스타일된 `div`가 아니라 `h2`–`h6`이므로 스크린 리더 사용자가 heading 탐색으로 빈 상태에 바로 도달할 수 있습니다(Carbon · Polaris · Atlassian의 empty state와 같은 규약).
- **headingLevel** — 기본 `2`. 주변 문서 개요에 맞춰 `2`–`6`으로 지정하세요(범위를 벗어나면 클램프됩니다). 카드나 패널 안처럼 이미 `h2`가 있는 영역에서는 `headingLevel={3}`처럼 한 단계 낮춰 heading 순서가 건너뛰지 않게 합니다.
