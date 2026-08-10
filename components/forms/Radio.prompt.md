**Radio** — 1.5px 헤어라인 원(20px, `sm` 16px). 선택되면 원이 시그널 잉크로 채워지고 화이트 중앙 점이 나타납니다. 그룹은 같은 `name`을 공유하세요.

## Group and visual contract

- Related radios share `name`; uncontrolled radios synchronize their custom indicator with the browser's native group state. The label gap is 8px and the default selected dot is 12px.
- Disabled and checked are independent states: a disabled checked radio keeps its neutral center dot so the current value remains visible, while primary fill/border is removed and label, ring, and dot use disabled-neutral roles. SegmentedControl, ButtonGroup, and ChoiceCard use this same “preserve selection, remove primary emphasis” rule.
- Arrow-key behavior and single-selection semantics come from the native radio input. Do not replace it with independent custom tab stops.
- Reference basis: [WAI-ARIA Radio Group pattern](https://www.w3.org/WAI/ARIA/apg/patterns/radio/) and [GOV.UK Radios](https://design-system.service.gov.uk/components/radios/).

```jsx
<Radio name="type" value="product" checked={t==='product'} onChange={()=>setT('product')} label="제품 문의" />
```

- `size`를 생략하면 일반 표면에서는 기존 `md`, bounded compact component scope에서는 `sm`을 사용합니다. 시각 원과 별개로 native radio target은 두 크기 모두 최소 24×24px이며 명시한 `size`가 우선합니다.
