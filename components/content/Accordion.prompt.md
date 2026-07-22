**Accordion** — FAQ / 스펙 그룹용 디스클로저 리스트. 열린 헤더는 시그널 잉크를 띠고, 셰브론이 뒤집히며, 본문이 차분한 grid-rows 트랜지션으로 드러납니다.

```jsx
<Accordion items={[
  { title: '검토 기간은 얼마나 걸리나요?', content: '초안 등록 후 평균 2일 내 확인합니다.' },
  { title: '변경 이력은 어디에 남나요?', content: '게시 시점마다 요약과 담당자를 남깁니다.' },
]} defaultOpen={[0]} />
```

- **items** — `{ title, content }[]`. **multiple** — 여러 개 동시 열기 허용. **defaultOpen** — 마운트 시 열려 있는 인덱스.
- 접근성: 각 트리거는 `aria-expanded` + `aria-controls`로 자신의 패널을 가리키고, 패널은 `role="region"` + `aria-labelledby`로 트리거와 연결됩니다. 접힌 패널은 `inert`로 접근성 트리·탭 포커스 순서에서 제거되어 `aria-expanded=false`와 상태가 일치합니다(시각 리빌 전환은 유지). `Collapsible`도 같은 계약을 공유합니다.
