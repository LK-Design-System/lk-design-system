**SegmentedControl** — 단일 선택 뷰 토글. 옵션이 쿨 그레이 트랙에 놓이고, 활성 옵션은 부드러운 그림자와 함께 화이트 필로 올라갑니다.

```jsx
<SegmentedControl options={['KR', 'EN']} defaultValue="KR" onChange={setLang} />
<SegmentedControl full options={[{value:'list',label:'리스트'},{value:'grid',label:'그리드'}]} />
```

- **options** — 문자열 또는 `{ value, label }`. **value / defaultValue / onChange** — 제어/비제어.
- **size** `sm|md`, **full**은 컨테이너 폭까지 늘림.
- 상호 배타적인 2–4개의 짧은 뷰에 쓰세요. 옵션이 많거나 길거나 실제 페이지 내비게이션에는 `Tabs`를 쓰세요.
