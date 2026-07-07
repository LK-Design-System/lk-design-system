**Tabs** — 시그널 잉크 인디케이터가 있는 언더라인 탭 바. `SegmentedControl`보다 더 강조되는 페이지 섹션 내비게이션용.

```jsx
<Tabs items={[
  { value: 'all', label: '전체', count: 24 },
  { value: 'review', label: '검토' },
  { value: 'approved', label: '승인' },
]} defaultValue="all" onChange={setTab} />
```

- **items** — 문자열 또는 `{ value, label, count }`. **value / defaultValue / onChange** — 제어/비제어. **full**은 폭까지 늘림.
- 페이지 마스트헤드 아래에 놓습니다(스티키 네이비 서브탭 바 변형은 `SubTabs` 참고).
