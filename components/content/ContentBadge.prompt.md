**ContentBadge** — 콘텐츠에 붙는 작은 사각 라벨(NEW, 신규, 즉시지원). 뮤트 상태 톤에 걸쳐 세 가지 웨이트.

```jsx
<ContentBadge tone="signal" variant="solid">NEW</ContentBadge>
<ContentBadge tone="positive" variant="soft">가동중</ContentBadge>
<ContentBadge tone="cautionary" variant="outline">점검 예정</ContentBadge>
```

- **tone** — `signal · navy · neutral · positive · cautionary · negative`. **variant** — `solid · soft · outline`. **size** — `sm · md · lg`.
- 카운트/점에는 `Badge`, 점 + 상태 텍스트에는 `StatusBadge`를 쓰세요.
