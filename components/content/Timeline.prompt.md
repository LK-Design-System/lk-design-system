**Timeline** — 세로형 이벤트 타임라인(변경 이력, 활동 로그).

```jsx
<Timeline items={[
  { time: '2026.06.30', title: '검토 완료', tone: 'positive' },
  { time: '2026.07.03', title: '게시 진행 중', description: '문서 3건 반영', tone: 'signal' },
]} />
```

- **items** — `{ time, title, description, tone }`. **tone**은 노드 색을 지정(`signal · positive · cautionary · negative · neutral`).
- 타입 스케일 정합: 제목 15.5px → `--body2-size`(15px, −0.5px), 설명 13.5px → `--label2-size`(13px, −0.5px)로 스냅했습니다. time(caption1)과 함께 전 사이트가 토큰 스케일 위에 있으며, 설명 lineHeight 1.6은 유지했습니다.
