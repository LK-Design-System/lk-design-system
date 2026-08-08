# Expandable Text

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Product / Content |
| Owner | `ExpandableText` |
| Storybook | `LDS Product/Content/Expandable Text` |
| Source | `../component-content.json#product-content-expandable-text` |

피드 본문·긴 설명·댓글처럼 목록에서 길이를 고르게 유지해야 할 인라인 텍스트에 적합합니다. 제목이 있는 섹션을 통째로 접을 때는 이 컴포넌트 대신 섹션 접기(디스클로저)를 사용하세요.

## 사용 판단

### 사용

- 리사이즈에 반응해 오버플로를 다시 측정합니다(ResizeObserver, 미지원 환경은 resize 이벤트).

## Anatomy

| Part | Contract |
| --- | --- |
| children | 표시할 텍스트/노드. 전체가 항상 DOM에 있고 클램프는 시각적 컷입니다. |
| moreLabel | 펼치기 컨트롤 라벨. @default "더 보기" |
| lessLabel | 접기 컨트롤 라벨. @default "접기" |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `children` | `React.ReactNode` | No | 표시할 텍스트/노드. 전체가 항상 DOM에 있고 클램프는 시각적 컷입니다. |
| `lines` | `number` | No | 접힘 상태에서 보여줄 줄 수. @default 3 |
| `moreLabel` | `React.ReactNode` | No | 펼치기 컨트롤 라벨. @default "더 보기" |
| `lessLabel` | `React.ReactNode` | No | 접기 컨트롤 라벨. @default "접기" |
| `expanded` | `boolean` | No | 제어형 펼침 상태. 주면 컴포넌트는 상태를 소유하지 않습니다. |
| `defaultExpanded` | `boolean` | No | 비제어형 초기 펼침 상태. @default false |
| `onToggle` | `(expanded: boolean) = void` | No | 펼침 상태가 바뀔 때 호출됩니다. |
| `as` | `React.ElementType` | No | 텍스트를 렌더할 요소. @default "div" |
| `textStyle` | `React.CSSProperties` | No | 텍스트 요소에 병합할 스타일(색·크기 등 커스터마이즈). |

## States

| State | Contract |
| --- | --- |
| expanded | 제어형 펼침 상태. 주면 컴포넌트는 상태를 소유하지 않습니다. |
| defaultExpanded | 비제어형 초기 펼침 상태. @default false |
| onToggle | 펼침 상태가 바뀔 때 호출됩니다. |

## Behavior and interaction

- expanded / defaultExpanded / onToggle — 제어형(expanded)이면 상태를 부모가 소유하고, 비제어형이면 defaultExpanded로 시작해 내부 상태를 씁니다. 두 경우 모두 전환 시 onToggle(expanded)가 호출됩니다.

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 명시 규칙 1 | lines — 접힘 상태의 줄 수. @default 3. |
| 명시 규칙 2 | 인라인 truncation + reveal은 보편 UI이므로 외부 category reference에서 도출했습니다 — Material 텍스트 truncation, ARIA Disclosure 패턴(aria-expanded/aria-controls), 소셜/뉴스 피드의 "…더 보기" 관용. 사내 근거는 카드 계열의 2줄 clamp(NewsCard·ListingCard)를 토글 가능한 형태로 일반화한 것입니다. |
| --body1-line | {"fontSize":"16px","lineHeight":"24px","letterSpacing":"0.0057em"} |
| --body1-size | {"fontSize":"16px","lineHeight":"24px","letterSpacing":"0.0057em"} |
| --caption1-size | {"fontSize":"12px","lineHeight":"16px","letterSpacing":"0.0252em"} |

## Responsive

- clamp는 시각적 컷 — 전체 텍스트는 항상 DOM에 있습니다. lines로 접힘 높이를 정하고 -webkit-line-clamp로 자를 뿐, 스크린리더는 펼침 여부와 무관하게 전문을 읽습니다. 정보를 감추지 않습니다.
- 넘칠 때만 컨트롤 — 오버플로는 scrollHeight를 line-height × lines와 비교해 판정하며, 이는 접힘·펼침 두 상태에서 모두 성립합니다(그래서 defaultExpanded인 글도 접을 수 있음). 짧아서 안 넘치는 텍스트에는 토글이 렌더되지 않습니다.
- clamp 높이를 max-height가 아니라 -webkit-line-clamp로 잡아 줄 수 기준으로 정확히 자르고, 애니메이션 없이 즉시 전환해 모션 과민 사용자에게 안전합니다.

## Content and writing

- moreLabel / lessLabel — 펼치기/접기 라벨. @default "더 보기" / "접기".
- as — 텍스트를 렌더할 요소(p·div 등). @default "div". textStyle로 색·크기를 덮어씁니다.
- Collapsible과 다르다 — Collapsible은 제목이 있는 섹션을 접습니다. ExpandableText는 제목 없는 인라인 본문 텍스트를 줄 단위로 자르고 펼칩니다. 의미와 조판이 다른 별개 컴포넌트입니다.
- ExpandableText — 지정 줄 수로 클램프하고 "더 보기 / 접기"로 나머지를 펼치는 인라인 텍스트. 피드 본문·긴 설명·댓글에. 피드 전용이 아닌 일반 텍스트 유틸입니다.

## Accessibility

- toggle 접근성 — 펼치기/접기는 실제 button이며 aria-expanded와 aria-controls(텍스트 영역 id)를 소유합니다. 보조기기가 접힘/펼침 상태와 대상 영역을 낭독합니다. 포커스 링은 전역 :focus-visible 규칙을 따릅니다.

## Related components

| Component | Relationship |
| --- | --- |
| `ConnectionRow` | 대표 시나리오에서 조합 |
| `ContentEditor` | 대표 시나리오에서 조합 |
| `LogViewer` | 대표 시나리오에서 조합 |
| `ReactionBar` | 대표 시나리오에서 조합 |
| `RecordHeader` | 대표 시나리오에서 조합 |
| `ReorderList` | 대표 시나리오에서 조합 |
| `SourceDisclosure` | 대표 시나리오에서 조합 |
| `StatList` | 대표 시나리오에서 조합 |

## Examples

### 기본 조합

```jsx
<ExpandableText lines={3}>
  {longBodyText}
</ExpandableText>

<ExpandableText lines={2} moreLabel="펼치기" lessLabel="접기" onToggle={setOpen}>
  {description}
</ExpandableText>
```

## Tokens and API

### Tokens

- `--body1-line`
- `--body1-size`
- `--caption1-size`
- `--color-semantic-label-alternative`
- `--color-semantic-label-normal`
- `--fw-bold`
- `--radius-sm`
- `--space-1`
- `--space-2`

### Source contracts

- `components/content/ExpandableText.jsx`
- `components/content/ExpandableText.d.ts`
- `components/content/ExpandableText.prompt.md`
- `stories/ContentExpandableText.stories.jsx`

## Sources

- ExpandableText prompt contract: `components/content/ExpandableText.prompt.md`
- Storybook implementation evidence: `stories/ContentExpandableText.stories.jsx`
