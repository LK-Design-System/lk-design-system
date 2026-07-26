**FloorSelector** — 빌딩 층/레벨 선택기. 단일 선택 리스트로 활성 층은 시그널 잉크로 채워집니다(맵·플로어 뷰의 우측 컨트롤).

```jsx
<FloorSelector value={floor} onChange={setFloor}
  floors={[{ value: 'B1', label: 'B1' }, { value: '1F', label: '1F' }, { value: '2F', label: '2F' }]} />
```

- **floors** 문자열 또는 `{ value, label }`(위→아래 순서) · 제어(`value`)/비제어(`defaultValue`). ARIA radio group(단일 선택): 단일 tab stop(roving tabindex), 화살표로 이동+선택, Home/End. 각 층은 `role="radio"`·`aria-checked`.
