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

- 피드 본문·긴 설명·댓글처럼 목록에서 길이를 고르게 유지해야 할 인라인 텍스트에 적합합니다. 제목이 있는 섹션을 통째로 접을 때는 이 컴포넌트 대신 섹션 접기(디스클로저)를 사용하세요.
- 리사이즈에 반응해 오버플로를 다시 측정합니다(ResizeObserver, 미지원 환경은 resize 이벤트).
- clamp 높이를 max-height가 아니라 -webkit-line-clamp로 잡아 줄 수 기준으로 정확히 자르고, 애니메이션 없이 즉시 전환해 모션 과민 사용자에게 안전합니다.
- - clamp는 시각적 컷 — 전체 텍스트는 항상 DOM에 있습니다. lines로 접힘 높이를 정하고 -webkit-line-clamp로 자를 뿐, 스크린리더는 펼침 여부와 무관하게 전문을 읽습니다. 정보를 감추지 않습니다. - toggle 접근성 — 펼치기/접기는 실제 button이며 aria-expanded와 aria-controls(텍스트 영역 id)를 소유합니다. 보조기기가 접힘/펼침 상태와 대상 영역을 낭독합니다. 포커스 링은 전역 :focus-visible 규칙을 따릅니다. - 넘칠 때만 컨트롤 — 오버플로는 scrollHeight를 line-height….

### 사용하지 않음

- Expandable Text가 소유하지 않는 라우팅, 권한, 데이터 요청, 제품 임계값을 컴포넌트 내부에 넣지 않습니다.
- 동일한 목적을 더 단순한 native 요소나 기존 LDS primitive로 해결할 수 있으면 새 조합을 만들지 않습니다.
- 표현이 비슷하다는 이유만으로 상태 의미가 다른 sibling 컴포넌트를 서로 대체하지 않습니다.

## Anatomy

| Part | Contract |
| --- | --- |
| Root | ExpandableText의 semantic role, layout containment와 전달받은 DOM 속성을 소유합니다. |
| Children | 표시할 텍스트/노드. 전체가 항상 DOM에 있고 클램프는 시각적 컷입니다. |
| More Label | 펼치기 컨트롤 라벨. @default "더 보기" |
| Less Label | 접기 컨트롤 라벨. @default "접기" |

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
| expanded | 제어형 펼침 상태. 주면 컴포넌트는 상태를 소유하지 않습니다. 타입 계약: boolean |
| defaultExpanded | 비제어형 초기 펼침 상태. @default false 타입 계약: boolean |
| onToggle | 펼침 상태가 바뀔 때 호출됩니다. 타입 계약: (expanded: boolean) = void |
| 변형·상태 · 짧은 글과 펼친 시작 | variants-states 공개 스토리에서 렌더링 및 상호작용 증거를 유지합니다. |
| 반응형 · 320px | responsive 공개 스토리에서 렌더링 및 상호작용 증거를 유지합니다. |

## Behavior and interaction

- toggle 접근성 — 펼치기/접기는 실제 button이며 aria-expanded와 aria-controls(텍스트 영역 id)를 소유합니다. 보조기기가 접힘/펼침 상태와 대상 영역을 낭독합니다. 포커스 링은 전역 :focus-visible 규칙을 따릅니다.
- 넘칠 때만 컨트롤 — 오버플로는 scrollHeight를 line-height × lines와 비교해 판정하며, 이는 접힘·펼침 두 상태에서 모두 성립합니다(그래서 defaultExpanded인 글도 접을 수 있음). 짧아서 안 넘치는 텍스트에는 토글이 렌더되지 않습니다.
- lines — 접힘 상태의 줄 수. @default 3.
- expanded / defaultExpanded / onToggle — 제어형(expanded)이면 상태를 부모가 소유하고, 비제어형이면 defaultExpanded로 시작해 내부 상태를 씁니다. 두 경우 모두 전환 시 onToggle(expanded)가 호출됩니다.
- - clamp는 시각적 컷 — 전체 텍스트는 항상 DOM에 있습니다. lines로 접힘 높이를 정하고 -webkit-line-clamp로 자를 뿐, 스크린리더는 펼침 여부와 무관하게 전문을 읽습니다. 정보를 감추지 않습니다. - toggle 접근성 — 펼치기/접기는 실제 button이며 aria-expanded와 aria-controls(텍스트 영역 id)를 소유합니다. 보조기기가 접힘/펼침 상태와 대상 영역을 낭독합니다. 포커스 링은 전역 :focus-visible 규칙을 따릅니다. - 넘칠 때만 컨트롤 — 오버플로는 scrollHeight를 line-height….

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 명시 규칙 1 | lines — 접힘 상태의 줄 수. @default 3. |
| 명시 규칙 2 | - clamp는 시각적 컷 — 전체 텍스트는 항상 DOM에 있습니다. lines로 접힘 높이를 정하고 -webkit-line-clamp로 자를 뿐, 스크린리더는 펼침 여부와 무관하게 전문을 읽습니다. 정보를 감추지 않습니다. - toggle 접근성 — 펼치기/접기는 실제 button이며 aria-expanded와 aria-controls(텍스트 영역 id)를 소유합니다. 보조기기가 접힘/펼침 상태와 대상 영역을 낭독합니다. 포커스 링은 전역 :focus-visible 규칙을 따릅니다. - 넘칠 때만 컨트롤 — 오버플로는 scrollHeight를 line-height… |
| 명시 규칙 3 | 인라인 truncation + reveal은 보편 UI이므로 외부 category reference에서 도출했습니다 — Material 텍스트 truncation, ARIA Disclosure 패턴(aria-expanded/aria-controls), 소셜/뉴스 피드의 "…더 보기" 관용. 사내 근거는 카드 계열의 2줄 clamp(NewsCard·ListingCard)를 토글 가능한 형태로 일반화한 것입니다. |
| --body1-line | {"fontSize":"16px","lineHeight":"24px","letterSpacing":"0.0057em"} |
| --body1-size | {"fontSize":"16px","lineHeight":"24px","letterSpacing":"0.0057em"} |

## Responsive

- clamp는 시각적 컷 — 전체 텍스트는 항상 DOM에 있습니다. lines로 접힘 높이를 정하고 -webkit-line-clamp로 자를 뿐, 스크린리더는 펼침 여부와 무관하게 전문을 읽습니다. 정보를 감추지 않습니다.
- 넘칠 때만 컨트롤 — 오버플로는 scrollHeight를 line-height × lines와 비교해 판정하며, 이는 접힘·펼침 두 상태에서 모두 성립합니다(그래서 defaultExpanded인 글도 접을 수 있음). 짧아서 안 넘치는 텍스트에는 토글이 렌더되지 않습니다.
- clamp 높이를 max-height가 아니라 -webkit-line-clamp로 잡아 줄 수 기준으로 정확히 자르고, 애니메이션 없이 즉시 전환해 모션 과민 사용자에게 안전합니다.
- - clamp는 시각적 컷 — 전체 텍스트는 항상 DOM에 있습니다. lines로 접힘 높이를 정하고 -webkit-line-clamp로 자를 뿐, 스크린리더는 펼침 여부와 무관하게 전문을 읽습니다. 정보를 감추지 않습니다. - toggle 접근성 — 펼치기/접기는 실제 button이며 aria-expanded와 aria-controls(텍스트 영역 id)를 소유합니다. 보조기기가 접힘/펼침 상태와 대상 영역을 낭독합니다. 포커스 링은 전역 :focus-visible 규칙을 따릅니다. - 넘칠 때만 컨트롤 — 오버플로는 scrollHeight를 line-height….

## Content and writing

- clamp는 시각적 컷 — 전체 텍스트는 항상 DOM에 있습니다. lines로 접힘 높이를 정하고 -webkit-line-clamp로 자를 뿐, 스크린리더는 펼침 여부와 무관하게 전문을 읽습니다. 정보를 감추지 않습니다.
- toggle 접근성 — 펼치기/접기는 실제 button이며 aria-expanded와 aria-controls(텍스트 영역 id)를 소유합니다. 보조기기가 접힘/펼침 상태와 대상 영역을 낭독합니다. 포커스 링은 전역 :focus-visible 규칙을 따릅니다.
- 넘칠 때만 컨트롤 — 오버플로는 scrollHeight를 line-height × lines와 비교해 판정하며, 이는 접힘·펼침 두 상태에서 모두 성립합니다(그래서 defaultExpanded인 글도 접을 수 있음). 짧아서 안 넘치는 텍스트에는 토글이 렌더되지 않습니다.
- moreLabel / lessLabel — 펼치기/접기 라벨. @default "더 보기" / "접기".

## Accessibility

- toggle 접근성 — 펼치기/접기는 실제 button이며 aria-expanded와 aria-controls(텍스트 영역 id)를 소유합니다. 보조기기가 접힘/펼침 상태와 대상 영역을 낭독합니다. 포커스 링은 전역 :focus-visible 규칙을 따릅니다.
- - clamp는 시각적 컷 — 전체 텍스트는 항상 DOM에 있습니다. lines로 접힘 높이를 정하고 -webkit-line-clamp로 자를 뿐, 스크린리더는 펼침 여부와 무관하게 전문을 읽습니다. 정보를 감추지 않습니다. - toggle 접근성 — 펼치기/접기는 실제 button이며 aria-expanded와 aria-controls(텍스트 영역 id)를 소유합니다. 보조기기가 접힘/펼침 상태와 대상 영역을 낭독합니다. 포커스 링은 전역 :focus-visible 규칙을 따릅니다. - 넘칠 때만 컨트롤 — 오버플로는 scrollHeight를 line-height….
- 인라인 truncation + reveal은 보편 UI이므로 외부 category reference에서 도출했습니다 — Material 텍스트 truncation, ARIA Disclosure 패턴(aria-expanded/aria-controls), 소셜/뉴스 피드의 "…더 보기" 관용. 사내 근거는 카드 계열의 2줄 clamp(NewsCard·ListingCard)를 토글 가능한 형태로 일반화한 것입니다.
- native semantic을 우선하며 사용자에게 보이는 이름과 접근 가능한 이름이 같은 목적을 설명하게 합니다.
- 키보드 focus 순서, focus-visible 표시와 상태 ARIA가 시각 상태와 동시에 갱신되는지 공개 스토리에서 검증합니다.

## Do / Don't

| Kind | Guidance |
| --- | --- |
| Do | 리사이즈에 반응해 오버플로를 다시 측정합니다(ResizeObserver, 미지원 환경은 resize 이벤트). |
| Don't | Expandable Text가 소유하지 않는 라우팅, 권한, 데이터 요청, 제품 임계값을 컴포넌트 내부에 넣지 않습니다. |
| Do | clamp 높이를 max-height가 아니라 -webkit-line-clamp로 잡아 줄 수 기준으로 정확히 자르고, 애니메이션 없이 즉시 전환해 모션 과민 사용자에게 안전합니다. |
| Don't | 동일한 목적을 더 단순한 native 요소나 기존 LDS primitive로 해결할 수 있으면 새 조합을 만들지 않습니다. |

## Exceptions

- 제품 정책을 포함해야 하는 예외는 wrapper 또는 제품 저장소에서 조합하고 ExpandableText의 범용 API에 넣지 않습니다.
- 접근성 또는 안전 계약을 약화하는 예외는 허용하지 않으며 필요한 차이는 prompt와 Storybook 증거에 기록합니다.

## Related components

| Component | Relationship |
| --- | --- |
| `ContentEditor` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `LogViewer` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `ReactionBar` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `ReorderList` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `SourceDisclosure` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `StatList` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |

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

## Migration

- 현재 prompt와 타입 계약에 기록되지 않은 legacy alias는 새 코드에서 도입하지 않습니다.
- 대체 컴포넌트가 생기면 기존 API의 제거 버전, 대응 prop과 자동·수동 전환 절차를 이 페이지에 기록합니다.

## Sources

- ExpandableText prompt contract: `components/content/ExpandableText.prompt.md`
- Storybook implementation evidence: `stories/ContentExpandableText.stories.jsx`
