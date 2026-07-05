**Timeline** — 세로형 이벤트 타임라인(도입 이력, 관제 로그).

```jsx
<Timeline items={[
  { time: '2026.06.30', title: '현장 실사 완료', tone: 'positive' },
  { time: '2026.07.03', title: '설치 진행 중', description: 'LKR-T1 3대 배치', tone: 'signal' },
]} />
```

- **items** — `{ time, title, description, tone }`. **tone**은 노드 색을 지정(`signal · positive · cautionary · negative · neutral`).
