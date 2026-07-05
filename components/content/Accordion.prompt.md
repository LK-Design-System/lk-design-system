**Accordion** — FAQ / 스펙 그룹용 디스클로저 리스트. 열린 헤더는 시그널 잉크를 띠고, 셰브론이 뒤집히며, 본문이 차분한 grid-rows 트랜지션으로 드러납니다.

```jsx
<Accordion items={[
  { title: '설치 기간은 얼마나 걸리나요?', content: '현장 실사 후 평균 2–4주 내 배치됩니다.' },
  { title: '관제 시스템과 연동되나요?', content: 'LKR-SSAI 관제 시스템에 표준 연동됩니다.' },
]} defaultOpen={[0]} />
```

- **items** — `{ title, content }[]`. **multiple** — 여러 개 동시 열기 허용. **defaultOpen** — 마운트 시 열려 있는 인덱스.
