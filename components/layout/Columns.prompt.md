**Columns** — 레이아웃을 나누는 반응형 12컬럼 그리드. `Col span/sm/md/lg` 자식으로 비대칭 레이아웃을 만들거나, `columns`로 균등 분할.

```jsx
<Columns>
  <Col md={8}>main</Col>
  <Col md={4}>aside</Col>
</Columns>
<Columns columns={3} gap={16}>
  <div>1</div><div>2</div><div>3</div>
</Columns>
```

- 거터는 `--grid-gutter`(20px)가 기본값 — **gap**(또는 **columnGap**/**rowGap**)으로 재정의. `Col` 없이 바로 자식을 넣으면 `columns` 트랙에 균등 배치됨.
