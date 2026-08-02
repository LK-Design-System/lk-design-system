**SegmentedControl** — 단일 선택 뷰 토글. 옵션이 쿨 그레이 트랙에 놓이고, 활성 옵션은 부드러운 그림자와 함께 화이트 필로 올라갑니다.

## Semantics and keyboard contract

- SegmentedControl is a named `radiogroup`, not a tablist: each segment is a radio with one roving tab stop. Arrow keys wrap across enabled segments; Home and End choose the first and last enabled segment.
- 옵션별 표준 비활성 API는 `disabled`입니다. `disable`과 `interaction="inactive"`는 기존 증거 matrix를 위한 호환 별칭이며, 모두 native `disabled` + `aria-disabled`로 수렴하고 로빙 탐색에서 제외됩니다. 그룹의 `disabled`도 모든 segment에 같은 계약을 적용합니다.
- Use it for a small set of mutually exclusive views or modes. Use Tabs only when each label owns a distinct tab panel.
- Reference basis: [WAI-ARIA Radio Group pattern](https://www.w3.org/WAI/ARIA/apg/patterns/radio/) and [Apple Segmented controls](https://developer.apple.com/design/human-interface-guidelines/segmented-controls).

```jsx
<SegmentedControl options={['KR', 'EN']} defaultValue="KR" onChange={setLang} />
<SegmentedControl full options={[{value:'list',label:'리스트'},{value:'grid',label:'그리드'}]} />
<SegmentedControl aria-label="상태 필터" options={[{value:'all',label:'전체',count:12},{value:'active',label:'진행 중',count:8}]} defaultValue="all" />
```

- **options** — 문자열 또는 `{ value, label, icon, count, disabled }`. `count`는 단일 선택 필터를 고르기 전에 값별 결과 건수를 비교해야 할 때 사용하며 라디오의 접근 가능한 이름과 함께 읽힙니다. **value / defaultValue / onChange** — 제어/비제어.
- **size** `sm|md|lg`는 전체 track 외곽 높이 32/40/48px입니다. Solid의 내부 padding과 Outlined의 border가 이 높이에 더해지지 않습니다. **full**은 컨테이너 폭까지 늘림.
- 상호 배타적인 2–4개의 짧은 뷰에 쓰세요. 옵션이 많거나 길거나 실제 페이지 내비게이션에는 `Tabs`를 쓰세요.

## WDS·형제 비교와 시각 델타

- WDS 내부 `Segmented Control/Segmented Control` component-set(16215:35115)의 직접 축은 `Variant(Solid/Outlined)`, `Size(Small/Medium/Large)`, `Icon(False/True)`뿐입니다. `interaction`은 공용 API 축이 아니라 상태 증거 호환값입니다.
- 단일 선택 의미와 키보드는 native `Radio` 계열과 같습니다. 비활성인데 선택된 값은 선택 정보를 지우지 않되, Radio의 회색 중심 점처럼 primary 색을 제거하고 중립 채움·비활성 전경·semibold만 남깁니다.
- ButtonGroup의 단일 선택 모드는 이 컴포넌트를 조합합니다. 따라서 높이·disabled·roving 규칙을 ButtonGroup에서 별도로 다시 만들지 않습니다.
