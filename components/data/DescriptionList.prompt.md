**DescriptionList** — 키/값 쌍(사양, 제원).

```jsx
<DescriptionList columns={2} items={[
  { term: '주행 속도', description: '최대 1.5 m/s' },
  { term: '운영 시간', description: '8시간 (연속)' },
  { term: '방수·방진', description: 'IP65' },
]} />
```

- **items** — `{ term, description }`. **columns** — 쌍의 반응형 그리드.
- 타입 스케일 정합: 값(dd) 14.5px → `--body2-size`(15px)로 스냅했습니다. 14px 용어(dt)보다 한 단계 위를 유지해 term/description 위계가 살아 있습니다.
