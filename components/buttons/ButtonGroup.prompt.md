**ButtonGroup** — 연결된 보더형 토글 그룹(뷰/모드 전환).

```jsx
<ButtonGroup options={['일', '주', '월']} defaultValue="주" onChange={setRange} />
<ButtonGroup multiple options={['초안','검토','게시']} onChange={setModes} />
```

- **options** — 문자열 또는 `{ value, label }`. **value / defaultValue / onChange** — 문자열(단일) 또는 string[](`multiple`). `SegmentedControl`의 채워진 트랙 룩과는 다릅니다.
