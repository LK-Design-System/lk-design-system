**ChoiceCard** — 선택형 프레임 옵션 타일. 선택 시 애저 링 + 틴트로 강조되는 라디오(단일) 또는 체크박스(`multiple`, 다중) 선택 카드. 클릭/Enter/Space로 토글.

## Selection semantics and reference basis

- Interactive single-select cards contain native radios and share `name`; clicking an already selected card does not clear the group. `multiple` cards contain native checkboxes and toggle independently. Static cards without a handler do not enter the tab order or claim selection roles.
- The single-select indicator is a radio dot; the multi-select indicator is a check mark. Titles, descriptions, and indicators must remain readable at narrow widths.
- Reference basis: [WAI-ARIA Radio Group pattern](https://www.w3.org/WAI/ARIA/apg/patterns/radio/), [GOV.UK Checkboxes](https://design-system.service.gov.uk/components/checkboxes/), and [Carbon Tile accessibility](https://carbondesignsystem.com/components/tile/accessibility/).

```jsx
<ChoiceCard title="기본 플랜" description="표준 설정으로 시작" icon={<Icon name="document" />}
  selected={plan === 'basic'} onSelect={() => setPlan('basic')} />
<ChoiceCard multiple title="검토 포함" selected={opts.review} onSelect={(v) => setOpt('review', v)} />
```

- **title**/**description**/**icon**은 표준 레이아웃; 완전히 커스텀하려면 그 대신 **children**을 전달. **multiple**이면 인디케이터가 체크박스 사각형으로 바뀜(기본은 원형 라디오). 옵션 그리드/설정 선택에.

- **inputValue** — 내부 input의 `value`. **inputProps** — 내부 input에 전달할 표준 속성(type·checked·name·value 등 예약 속성 제외).
