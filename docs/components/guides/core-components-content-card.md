# Card

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Core / Content |
| Owner | `Card` |
| Storybook | `LDS Core/Components/Content/Card` |
| Source | `../component-content.json#core-components-content-card` |

제목, 설명, 미디어, 메타 정보와 제한된 행동이 함께 이동해야 하는 콘텐츠 단위에 적합합니다. 단순한 행 목록은 List Cell을, 화면 전체의 큰 구획은 Section이나 Container를 사용하고, 모든 영역을 습관적으로 카드 안에 중첩하지 마세요.

## 사용 판단

### 사용

- Plain children-only Card usage is still supported for generic LDS surfaces.
- Use as="article", as="section", or as="li" for a non-interactive card when that native document structure is meaningful. The default remains div.

### 사용하지 않음

- Do not combine a document-structure as value with interactive: interactive cards intentionally expose a single button role. Keep a non-interactive semantic root when the card contains links or buttons.

## Anatomy

| Part | Contract |
| --- | --- |
| toggleIcon | Toggle-icon affordance rendered in the top-right (WDS Card/List Card parity); shows alongside save. |
| titleWrap | Structured title overflow policy. @default "truncate" |
| metaCaption | Third caption tier — smallest meta line under subCaption (WDS three-tier caption parity). |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `as` | `React.ElementType` | No | Root element used for non-interactive document semantics. @default "div" |
| `surface` | `"default" \| "subtle"` | No | Surface role. subtle is an inset grouping surface and defaults to no shadow. @default "default" |
| `elevation` | `"none" \| "xs" \| "sm" \| "md" \| "lg"` | No | 기본 그림자 깊이. @default "md" |
| `interactive` | `boolean` | No | 카드 전체가 하나의 행동일 때. 호버 리프트 + 그림자 심화에 더해 role="button", tabIndex=0, Enter/Space 활성화, :focus-visible 링을 부여합니다. 내부에 별도의 버튼·링크를 넣지 마세요. |
| `dark` | `boolean` | No | 다크 섹션용 네이비 서피스. @default false |
| `headingLevel` | `1 \| 2 \| 3 \| 4 \| 5 \| 6 \| false` | No | 구조화 모드 title 의 heading 레벨. false 면 heading 의미 없이 div 로 렌더링합니다(제목이 이미 바깥에 있을 때). |
| `padding` | `number \| string` | No | 기본 패딩을 재정의합니다. 지정하면 platform·density 기본값과 --lds-card-padding보다 우선합니다. |
| `platform` | `"desktop" \| "mobile"` | No | platform axis. @default "desktop" |
| `density` | `"comfortable" \| "compact"` | No | 데스크톱 Card의 opt-in 공간 밀도. typography 크기는 바꾸지 않습니다. @default "comfortable" |
| `skeleton` | `boolean` | No | skeleton axis. @default false |
| `save` | `boolean` | No | save action axis. @default false |
| `saved` | `boolean` | No |  |
| `onSave` | `(e: React.MouseEvent) = void` | No |  |
| `toggleIcon` | `React.ReactNode` | No | Toggle-icon affordance rendered in the top-right (WDS Card/List Card parity); shows alongside save. |
| `thumbnail` | `React.ReactNode` | No |  |
| `topContent` | `React.ReactNode` | No |  |
| `leadingContent` | `React.ReactNode` | No |  |
| `trailingContent` | `React.ReactNode` | No |  |
| `title` | `React.ReactNode` | No |  |
| `titleWrap` | `"truncate" \| "wrap"` | No | Structured title overflow policy. @default "truncate" |
| `description` | `React.ReactNode` | No |  |
| `caption` | `React.ReactNode` | No |  |
| `subCaption` | `React.ReactNode` | No |  |
| `metaCaption` | `React.ReactNode` | No | Third caption tier — smallest meta line under subCaption (WDS three-tier caption parity). |

## States

| State | Contract |
| --- | --- |
| interactive | 카드 전체가 하나의 행동일 때. 호버 리프트 + 그림자 심화에 더해 role="button", tabIndex=0, Enter/Space 활성화, :focus-visible 링을 부여합니다. 내부에 별도의 버튼·링크를 넣지 마세요. |

## Behavior and interaction

- In data-heavy consoles, pair Card density deliberately with neighboring controls and tables. Carbon Data Table usage pairs toolbar/header/row sizes rather than mixing independent density decisions inside one region.
- Elevation ramp — none · xs(기본, 쉬는 카드) · sm · md(들어올린 상태) · lg. interactive 카드는 hover에서 md로 올라갑니다. NewsCard·ListingCard가 쓰는 rest=xs / lift=md 규칙과 같습니다. md(0 16px 40px)는 Tooltip·Combobox 드롭다운·Fab처럼 페이지 위에 떠 있는 요소의 등급이므로 놓여 있는 카드의 평상시 값으로 쓰지 않습니다.

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 명시 규칙 1 | density="comfortable\|compact" is opt-in and defaults to comfortable. On desktop, comfortable keeps the component Card padding (currently 32px) and compact uses --space-4 (16px), then tightens related content/header/body/action gaps with the LDS spacing scale. It does not reduce Card typography. |
| 명시 규칙 2 | platform="mobile" keeps its existing 12px padding and 320px max-width contract even when density="compact" is present. Platform can retain its existing mobile title scale; density itself never changes type size. |
| 명시 규칙 3 | Carbon spacing uses a spacing scale to establish relationships and control density, while Fluent 2 layout uses smaller component spacers to strengthen relationships and allows responsive spacing adjustments. Keep compact values on the LDS spacing ramp rather than introducing one-off pixels. |
| 명시 규칙 4 | headingLevel — 구조화 모드의 title 은 기본적으로 로 렌더링됩니다(WCAG 1.3.1). 카드가 놓이는 문서의 제목 계층에 맞춰 1–6 을 주고, 제목이 이미 카드 바깥에 있으면 headingLevel={false} 로 heading 의미를 끄세요. 레벨은 건너뛰지 않습니다. |
| --body1-size | {"fontSize":"16px","lineHeight":"24px","letterSpacing":"0.0057em"} |

## Responsive

- 실제 .fig의 Card/Card component set을 검사한 결과, 확인되는 축은 Platform=Desktop|Mobile과 Skeleton=False|True뿐입니다. density는 WDS parity 축이 아니라 명시적인 LDS Core compatibility extension입니다.
- MUI density guidance treats density as an opt-in adjustment through component props, spacing, and size; its dense demo theme is not a recommendation to force compactness across an entire application. Adopt compact Card only where scan-heavy console context needs it.
- titleWrap="truncate|wrap" controls structured-title overflow. The default truncate keeps dense card grids to one line; use wrap when the full document, report, or publication title is necessary to distinguish the destination.
- Stable structured parts are root, content, header, actions, media, body, title, description, and footer. Optional parts do not render empty wrappers.

## Content and writing

- save, toggleIcon(top-right toggle affordance beside save), structured slots (thumbnail, topContent, leadingContent, trailingContent, bottomContent, footer) and three text caption tiers (caption, title, description, subCaption, metaCaption) are LDS's structured Card API; do not describe them as extra axes discovered in…
- className, style, and the default ref target the polymorphic root. The ref type follows the rendered as element.
- classNames and styles accept only those stable part keys; product selectors do not depend on Card's internal DOM order.

## Accessibility

- 1. 전체 카드가 하나의 행동일 때 → interactive + onClick. 카드 루트가 role="button" · tabIndex=0 이 되고 Enter/Space 로 활성화되며 :focus-visible 링이 붙습니다(WCAG 2.1.1). 이때 카드 안에는 버튼·링크·스위치 같은 포커스 가능한 요소를 넣지 마세요. 버튼 안의 버튼(nested interactive)은 유효하지 않은 마크업이고, 스크린리더가 카드 이름으로 내부 텍스트를 전부 읽어 이름이 문단처럼 길어집니다. 2.

## Exceptions

- An explicit padding prop wins over platform/density defaults and --lds-card-padding. Use vars for the default padding only when the prop is absent. The root mirrors the resolved API choice as data-density.
- Use surface="subtle" for the inset surface that groups peer cards. It defaults to elevation="none"; nested default-surface cards own their own border, radius, and elevation. An explicit elevation is still available for exceptional compositions.

## Related components

| Component | Relationship |
| --- | --- |
| `Button` | 대표 시나리오에서 조합 |
| `ContentBadge` | 대표 시나리오에서 조합 |
| `Icon` | 대표 시나리오에서 조합 |
| `ListCell` | 대표 시나리오에서 조합 |
| `Thumbnail` | 대표 시나리오에서 조합 |
| `ToggleIcon` | 대표 시나리오에서 조합 |
| `ChoiceCard` | 대표 시나리오에서 조합 |

## Examples

### 기본 조합

```jsx
<Card interactive onClick={openDetail}>…</Card>
<Card dark padding={22}>…</Card>
```

### 추가 조합 2

```jsx
<Card platform="mobile" save title="Title" description="Description" />
<Card platform="desktop" skeleton headingLevel={2} />
<Card density="compact" title="Dense console card" description="Typography stays unchanged." />
```

## Tokens and API

### Tokens

- `--body1-size`
- `--body2-size`
- `--caption1-size`
- `--caption2-size`
- `--color-semantic-background-elevated-normal`
- `--color-semantic-focus-indicator`
- `--color-semantic-inverse-label-neutral-soft`
- `--color-semantic-label-alternative`
- `--color-semantic-label-strong`
- `--color-semantic-line-solid-normal`
- `--color-semantic-primary-normal`
- `--color-semantic-primary-surface-strong`
- `--component-card-bg`
- `--component-card-bg-dark`
- `--component-card-bg-subtle`
- `--component-card-border`
- `--component-card-border-dark`
- `--component-card-fg`
- `--component-card-fg-dark`
- `--component-card-hover-transform`
- `--component-card-padding`
- `--component-card-radius`
- `--component-card-shadow-lg`
- `--component-card-shadow-md`
- `--component-card-shadow-none`
- `--component-card-shadow-sm`
- `--component-card-shadow-xs`
- `--component-card-transition`
- `--fw-medium`
- `--fw-semibold`
- `--label2-line`
- `--label2-size`
- `--lds-card-gap`
- `--lds-card-max-width`
- `--lds-card-padding`
- `--lds-card-radius`
- `--radius-md`
- `--space-1`
- `--space-1-5`
- `--space-2`
- `--space-2-5`
- `--space-3`
- `--space-4`

### Source contracts

- `components/cards/Card.jsx`
- `components/cards/Card.d.ts`
- `components/cards/Card.prompt.md`
- `stories/Card.stories.jsx`

## Migration

- dark remains the inverse-card compatibility axis and takes precedence over surface.
- Density compatibility extension.

## Sources

- Card prompt contract: `components/cards/Card.prompt.md`
- Storybook implementation evidence: `stories/Card.stories.jsx`
- [MUI density guidance](https://mui.com/material-ui/customization/density/)
- [Carbon spacing](https://carbondesignsystem.com/elements/spacing/overview/)
- [Fluent 2 layout](https://fluent2.microsoft.design/layout)
- [Carbon Data Table usage](https://carbondesignsystem.com/components/data-table/usage/)
