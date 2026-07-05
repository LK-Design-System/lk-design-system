**Dimmer** — 가장 가까운 포지션드 조상을 채우는 스크림 오버레이(부모에 `position: relative` 설정).

```jsx
<div style={{ position: 'relative' }}>
  <Card>…</Card>
  <Dimmer open={loading}><Spinner color="#fff" /></Dimmer>
</div>
```

- **open** — 표시 여부. **blur** — 뒤 블러. **onClick** — 예: 닫기. 전체 화면 모달 스크림에는 `Modal` / `Alert`를 쓰세요.
