# Feature Card

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Product / Content |
| Owner | `FeatureCard` |
| Storybook | `LDS Product/Content/Feature Card` |
| Source | `../component-content.json#product-content-feature-card` |

서로 다른 기능의 가치와 성격을 아이콘·제목·설명으로 소개할 때 적합합니다. 실시간 상태나 여러 행의 속성 비교에는 FeatureCard 대신 Status Card 또는 구조화된 표를 사용하세요.

## Anatomy

| Part | Contract |
| --- | --- |
| icon | 틴트 타일에 표시되는 인라인 SVG 글리프. |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `icon` | `React.ReactNode` | No | 틴트 타일에 표시되는 인라인 SVG 글리프. |
| `title` | `React.ReactNode` | No | 제목. |
| `children` | `React.ReactNode` | No | 보조 설명. |
| `tone` | `'signal' \| 'steel' \| 'amber' \| 'navy'` | No | 아이콘 타일 톤. @default "signal" |
| `boxed` | `boolean` | No | 화이트 Card 서피스로 감싸기. @default false |
| `density` | `'comfortable' \| 'compact'` | No | spacing과 icon 크기만 조정하는 opt-in 밀도. typography는 유지합니다. @default "comfortable" |
| `headingLevel` | `1 \| 2 \| 3 \| 4 \| 5 \| 6 \| false` | No | title의 heading 레벨. 카드가 놓인 문서의 제목 계층에 맞춰 1–6을 주고, 제목이 이미 카드 바깥에 있으면 false로 heading 의미를 끕니다. 레벨은 건너뛰지 않습니다. @default 4 |

## States

| State | Contract |
| --- | --- |
| tone | 아이콘 타일 톤. @default "signal" |

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 명시 규칙 1 | density — comfortable(기본) · compact. Compact는 boxed padding을 --space-4(16px), icon-to-content gap을 --space-3(12px), icon tile을 --space-10(40px), title-to-description gap을 --space-1(4px)로 조정합니다. 제목과 본문 typography는 바꾸지 않으며 루트에 data-density를 노출합니다. |
| 명시 규칙 2 | headingLevel — title은 실제 heading으로 렌더되며 기본 레벨은 h4입니다(Core Card의 구조화 title은 h3). 카드가 놓인 문서의 제목 계층에 맞춰 1–6을 주고, 제목이 이미 카드 바깥에 있으면 headingLevel={false}로 heading 의미를 끄세요. 레벨은 건너뛰지 않습니다(WCAG 1.3.1). |
| 명시 규칙 3 | 카드 전체 클릭 — onClick을 주면 카드 루트가 role="button" · tabIndex=0이 되고 Enter/Space로 활성화됩니다(WCAG 2.1.1). 포커스 링은 토큰 레이어(tokens/focus.css)의 전역 :focus-visible 규칙이 담당하므로 카드가 따로 그리지 않습니다. 이때 카드 안에 버튼·링크 같은 포커스 가능한 요소를 넣지 마세요 — 중첩 인터랙티브는 유효하지 않은 마크업이고 카드 이름이 본문 전체로 길어집니다. 행동이 여러 개면 onClick 없이 각 액션을 카드 안에 두세요. |
| 명시 규칙 4 | 타입 스케일 정합: 제목 19px → --headline1-size(18px, −1px 의도된 변경), 본문 15.5px → --body2-size(15px)로 스냅했습니다. NewsCard 제목(headline1)과 같은 카드 제목 단계로 정렬합니다. |
| --body2-size | 15px |

## Responsive

- MUI density guidance처럼 density는 필요한 컴포넌트에 prop으로 선택하며, 예제용 global dense theme를 제품 전체 규칙으로 강제하지 않습니다.
- Carbon spacing과 Fluent 2 layout의 원칙에 따라 한 단계 작은 LDS spacing token으로 요소 관계를 강화합니다. 좁은 레이아웃에서도 같은 ramp 안에서 조정하고 typography 축으로 밀도를 대신하지 않습니다.

## Content and writing

- FeatureCard — 틴트된 아이콘 타일 + 제목 + 설명(기능 셀). boxed는 Card 서피스로 감쌉니다.

## Related components

| Component | Relationship |
| --- | --- |
| `Icon` | 대표 시나리오에서 조합 |
| `ChecklistItem` | 대표 시나리오에서 조합 |
| `FeedCard` | 대표 시나리오에서 조합 |
| `ListingCard` | 대표 시나리오에서 조합 |
| `MetricCard` | 대표 시나리오에서 조합 |
| `NewsCard` | 대표 시나리오에서 조합 |
| `ProductCard` | 대표 시나리오에서 조합 |
| `SpecRow` | 대표 시나리오에서 조합 |

## Examples

### 기본 조합

```jsx
<FeatureCard tone="signal" icon={compassIcon} title="자율주행">사전 지정 경로와 실시간 장애물 회피로 이동합니다.</FeatureCard>

// 섹션 제목이 h2일 때 카드 제목을 h3로 내림
<FeatureCard headingLevel={3} tone="steel" icon={mapIcon} title="맵 편집">현장 지도를 직접 수정합니다.</FeatureCard>

<FeatureCard boxed density="compact" icon={robotIcon} title="장비 상태">한 화면에서 더 많은 기능을 훑습니다.</FeatureCard>
```

## Tokens and API

### Tokens

- `--body2-size`
- `--color-semantic-accent-foreground-blue`
- `--color-semantic-accent-foreground-orange`
- `--color-semantic-brand-on-surface`
- `--color-semantic-brand-surface`
- `--color-semantic-label-alternative`
- `--color-semantic-label-strong`
- `--color-semantic-primary-normal`
- `--color-semantic-primary-surface-normal`
- `--component-card-bg`
- `--component-card-border`
- `--component-card-padding`
- `--component-card-radius`
- `--component-card-shadow-md`
- `--fw-extra`
- `--headline1-size`
- `--radius-14`
- `--shadow-md`
- `--space-1`
- `--space-10`
- `--space-2`
- `--space-3`
- `--space-4`

### Source contracts

- `components/cards/FeatureCard.jsx`
- `components/cards/FeatureCard.d.ts`
- `components/cards/FeatureCard.prompt.md`
- `stories/CardInfo.stories.jsx`

## Migration

- 실제 .fig 검사에서 FeatureCard component set은 확인되지 않았습니다. 따라서 이 API는 WDS parity가 아니라 LDS Product의 opt-in compatibility extension입니다.

## Sources

- FeatureCard prompt contract: `components/cards/FeatureCard.prompt.md`
- Storybook implementation evidence: `stories/CardInfo.stories.jsx`
- [MUI density guidance](https://mui.com/material-ui/customization/density/)
- [Carbon spacing](https://carbondesignsystem.com/elements/spacing/overview/)
- [Fluent 2 layout](https://fluent2.microsoft.design/layout)
