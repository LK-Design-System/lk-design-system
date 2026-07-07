**Timeline** — 세로형 이벤트 타임라인(변경 이력, 활동 로그).

```jsx
<Timeline items={[
  { time: '2026.06.30', title: '검토 완료', tone: 'positive' },
  { time: '2026.07.03', title: '게시 진행 중', description: '문서 3건 반영', tone: 'signal' },
]} />
```

- **items** — `{ time, title, description, tone }`. **tone**은 노드 색을 지정(`signal · positive · cautionary · negative · neutral`).
