# Source Disclosure

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Product / Content |
| Owner | `SourceDisclosure` |
| Storybook | `LDS Product/Content/Source Disclosure` |
| Source | `../component-content.json#product-content-source-disclosure` |

응답이나 문서의 근거가 된 출처·시점·가용성·원본 경로를 투명하게 제시할 때 적합합니다. 단순 관련 링크나 일반 속성 목록에는 SourceDisclosure 대신 Link 또는 Description List를 사용하세요.

## 사용 판단

### 사용

- GOV.UK Details는 일부 사용자만 필요한 부가 정보에 disclosure를 사용하고, 대부분에게 필요한 정보는 숨기지 않으며 summary text를 짧고 설명적으로 쓰도록 합니다. 따라서 action만 있는 source는 직접 link로 노출합니다.
- W3C Design System Quote는 인용 원본 URL을 blockquote의 cite 속성으로 제공하도록 안내합니다.
- SourceDisclosure는 제품이 제공한 source provenance, availability, freshness metadata와 원본으로 돌아가는 경로를 하나의 중립 목록으로 보여주는 LK Product Extension입니다.

### 사용하지 않음

- source 조회, permission, freshness 계산, excerpt 생성과 renderer 선택은 제품이 소유합니다. LDS는 URL이나 timestamp에서 availability를 추론하지 않습니다.
- USWDS Collection은 source/attribution metadata를 list item으로 묶고, 모호한 “read more” 대신 각 item의 고유한 heading을 원본에 연결하며 외부 이동을 표시하도록 합니다. SourceDisclosure도 action-only item의 label을 직접 이동 경로로 사용합니다.

## Anatomy

| Part | Contract |
| --- | --- |
| titleVisuallyHidden | Keeps the section name available to assistive technology when an embedding surface already supplies a visible label. |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `title` | `React.ReactNode` | No |  |
| `headingLevel` | `2 \| 3 \| 4 \| 5 \| 6` | No |  |
| `titleVisuallyHidden` | `boolean` | No | Keeps the section name available to assistive technology when an embedding surface already supplies a visible label. |
| `description` | `React.ReactNode` | No |  |
| `sources` | `SourceDisclosureItem[]` | No |  |
| `emptyMessage` | `React.ReactNode` | No |  |
| `onSourceActivate` | `(source: SourceDisclosureItem) = void` | No |  |
| `openLabel` | `React.ReactNode` | No |  |
| `compact` | `boolean` | No | Render each source as a single-line chip (opens the original on activation) instead of the bordered disclosure card. Use where a citation should read at the weight of an attachment chip — e.g. references under a chat answer. Drops inline detail disclosure, availability, and the card surface. @default false |
| `collapsible` | `boolean` | No | Collapse the compact source list behind a single "출처" icon+label toggle (no pill, matching the footer action controls) that opens it in an anchored Popover (dropdown), so the surrounding layout never shifts. The toggle is the disclosure's accessible name — no landmark heading is projected — and the floating panel (which lists each source as a borderless row) closes on outside-press or Escape. @default false |
| `defaultOpen` | `boolean` | No | Start with the collapsible source popover open. Only applies when collapsible is set. @default false |

## States

| State | Contract |
| --- | --- |
| titleVisuallyHidden | Keeps the section name available to assistive technology when an embedding surface already supplies a visible label. |
| defaultOpen | Start with the collapsible source popover open. Only applies when collapsible is set. @default false |

## Behavior and interaction

- 한 source를 본문 옆에서 짧게 귀속할 때는 SourceTag, 여러 source의 상태와 provenance를 비교할 때는 SourceDisclosure를 사용합니다. FAQ/문서 섹션처럼 일반 콘텐츠를 접을 때는 Accordion 또는 Collapsible가 소유합니다.

## 정량 규칙

| Subject | Rule |
| --- | --- |
| --body1-line | {"fontSize":"16px","lineHeight":"24px","letterSpacing":"0.0057em"} |
| --body1-size | {"fontSize":"16px","lineHeight":"24px","letterSpacing":"0.0057em"} |
| --body1-spacing | {"fontSize":"16px","lineHeight":"24px","letterSpacing":"0.0057em"} |
| --caption1-line | {"fontSize":"12px","lineHeight":"16px","letterSpacing":"0.0252em"} |

## Responsive

- compact는 각 source를 attachment chip 무게의 한 줄 link chip으로 렌더합니다(카드 surface·inline disclosure·availability badge 없이, 활성화 시 원본을 엽니다). 열거된 source가 모두 열람 가능하다고 전제되는 맥락 — 예: 챗 답변 아래 citation — 에서 availability가 steady-state 노이즈가 되지 않도록 사용합니다. 펼쳐야 할 provenance(description·excerpt·metadata)가 실제로 있을 때는 기본 card를 유지합니다.
- 좁은 폭에서는 availability가 identity 아래로 이동하고 chevron은 첫 행 끝에 남습니다. 내부 가로 스크롤이나 source별 중첩 card를 만들지 않습니다.
- SourceTag: 단일 출처용 compact pill과 외부 이동 표시를 재사용 기준으로 확인했습니다.
- Carbon Accordion은 header·end icon·panel anatomy, 간결한 title, 수평 overflow 금지와 좁은 공간의 정렬을 제시합니다. LDS chevron을 행 끝에 두고 panel을 identity와 정렬한 근거입니다.

## Content and writing

- 읽기 순서는 source label → kind/location → availability → disclosure cue이며, 펼친 뒤 description/excerpt → 관측·갱신 metadata → 원본 action으로 이어집니다.
- description, excerpt, timestamp 또는 metadata처럼 선택적인 상세 정보가 있을 때만 native details/summary를 사용합니다. action만 있는 source는 불필요한 disclosure를 만들지 않고 source label 자체를 link/button으로 제공합니다.
- availability는 StatusBadge의 soft semantic surface + 명시적 텍스트 한 번으로만 표현합니다. disclosure chevron과 external-link icon은 각각 펼침 상태와 새 창 이동만 설명합니다.
- href action은 새 탭으로 열리고 external-link icon을 표시합니다. 복합 label/action에는 actionAriaLabel을 제공합니다.

## Accessibility

- disclosure chevron은 상태를 보조하는 장식 icon이고 summary 전체가 trigger입니다. native keyboard/expanded semantics를 유지하며 별도 aria-expanded를 중복 구현하지 않습니다.
- collapsible은 source 목록을 출처 아이콘+라벨 토글 하나 뒤로 접어 resting footprint를 한 줄로 줄이고, 활성화하면 앵커드 Popover(드롭다운)로 목록(source당 테두리 없는 한 줄 행)을 띄웁니다. 토글은 pill·개수·chevron 없이 아이콘과 출처 문구만 두어 footer의 다른 action 컨트롤과 같은 무게·높이로 읽힙니다. 토글은 메시지 action bar 옆 제자리에 고정되고 패널은 떠서 열리므로 주변 레이아웃을 밀지 않으며, 바깥 pointer press나 Escape로 닫힙니다(비모달).
- 기본 visible title은 독립 provenance 목록의 시작점을 제공합니다. 이미 근거 N개처럼 동등한 visible label을 제공하는 embedding surface만 titleVisuallyHidden을 사용해 중복 heading을 제거할 수 있으며, section의 aria-labelledby 이름은 그대로 유지됩니다.
- Accordion / Collapsible: 행 끝 chevron, 전체 header trigger, focus·expanded cue를 시각 기준으로 삼되 SourceDisclosure는 native details/summary를 유지합니다.
- WAI-ARIA APG Accordion은 header 전체의 Enter/Space 조작, expanded state, header와 panel의 명확한 연결을 요구합니다. 이 컴포넌트는 동일한 interaction 기대를 native details/summary semantics로 충족합니다.

## Related components

| Component | Relationship |
| --- | --- |
| `ContentEditor` | 대표 시나리오에서 조합 |
| `ExpandableText` | 대표 시나리오에서 조합 |
| `LogViewer` | 대표 시나리오에서 조합 |
| `ReactionBar` | 대표 시나리오에서 조합 |
| `RecordHeader` | 대표 시나리오에서 조합 |
| `ReorderList` | 대표 시나리오에서 조합 |
| `StatList` | 대표 시나리오에서 조합 |

## Examples

### 기본 조합

```jsx
<SourceDisclosure
  sources={[
    {
      id: 'ops-log',
      label: 'OPS / robot-07 inspection log',
      kind: 'log',
      availability: 'available',
      observedAt: '2026-07-10 09:14',
      excerpt: 'thermal sensor response timeout',
      href: 'https://example.com/ops-log',
    },
  ]}
/>
```

## Tokens and API

### Tokens

- `--body1-line`
- `--body1-size`
- `--body1-spacing`
- `--caption1-line`
- `--caption1-size`
- `--color-semantic-background-elevated-normal`
- `--color-semantic-fill-alternative`
- `--color-semantic-focus-ring`
- `--color-semantic-label-alternative`
- `--color-semantic-label-neutral`
- `--color-semantic-label-normal`
- `--color-semantic-label-strong`
- `--color-semantic-line-normal-alternative`
- `--color-semantic-line-normal-normal`
- `--color-semantic-primary-normal`
- `--dur-base`
- `--dur-fast`
- `--ease-out`
- `--font-sans`
- `--fw-bold`
- `--fw-medium`
- `--fw-semibold`
- `--label1-line`
- `--label1-size`
- `--radius-md`
- `--radius-sm`
- `--space-1`
- `--space-2`
- `--space-3`
- `--space-4`
- `--space-8`

### Source contracts

- `components/content/SourceDisclosure.jsx`
- `components/content/SourceDisclosure.d.ts`
- `components/content/SourceDisclosure.prompt.md`
- `stories/ContentSourceDisclosure.stories.jsx`

## Sources

- SourceDisclosure prompt contract: `components/content/SourceDisclosure.prompt.md`
- Storybook implementation evidence: `stories/ContentSourceDisclosure.stories.jsx`
- [GOV.UK Details](https://design-system.service.gov.uk/components/details/)
- [WAI-ARIA APG Accordion](https://www.w3.org/WAI/ARIA/apg/patterns/accordion/)
- [Carbon Accordion](https://carbondesignsystem.com/components/accordion/usage/)
- [USWDS Collection](https://designsystem.digital.gov/components/collection/)
- [W3C Design System Quote](https://design-system.w3.org/components/quote.html)
