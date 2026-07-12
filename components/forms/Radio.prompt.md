**Radio** — 1.5px 헤어라인 원(20px, `sm` 16px). 선택되면 원이 시그널 잉크로 채워지고 화이트 중앙 점이 나타납니다. 그룹은 같은 `name`을 공유하세요.

## Group and visual contract

- Related radios share `name`; uncontrolled radios synchronize their custom indicator with the browser's native group state. The label gap is 8px and the default selected dot is 12px.
- Arrow-key behavior and single-selection semantics come from the native radio input. Do not replace it with independent custom tab stops.
- Reference basis: [WAI-ARIA Radio Group pattern](https://www.w3.org/WAI/ARIA/apg/patterns/radio/) and [GOV.UK Radios](https://design-system.service.gov.uk/components/radios/).

```jsx
<Radio name="type" value="product" checked={t==='product'} onChange={()=>setT('product')} label="제품 문의" />
```
