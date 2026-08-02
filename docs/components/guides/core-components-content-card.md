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
| `elevation` | `"none" \| "sm" \| "md" \| "lg"` | No | 기본 그림자 깊이. @default "md" |
| `interactive` | `boolean` | No | 카드 전체가 하나의 행동일 때. 호버 리프트 + 그림자 심화에 더해 role="button", tabIndex=0, Enter/Space 활성화, :focus-visible 링을 부여합니다. 내부에 별도의 버튼·링크를 넣지 마세요. |
| `dark` | `boolean` | No | 다크 섹션용 네이비 서피스. @default false |
| `headingLevel` | `1 \| 2 \| 3 \| 4 \| 5 \| 6 \| false` | No | 구조화 모드 title 의 heading 레벨. false 면 heading 의미 없이 div 로 렌더링합니다(제목이 이미 바깥에 있을 때). |
| `padding` | `number \| string` | No | 기본 32px 패딩을 재정의. |
| `platform` | `"desktop" \| "mobile"` | No | platform axis. @default "desktop" |
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
| `bottomContent` | `React.ReactNode` | No |  |

## States

| State | Contract |
| --- | --- |
| interactive | 카드 전체가 하나의 행동일 때. 호버 리프트 + 그림자 심화에 더해 role="button", tabIndex=0, Enter/Space 활성화, :focus-visible 링을 부여합니다. 내부에 별도의 버튼·링크를 넣지 마세요. |

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 명시 규칙 1 | headingLevel — 구조화 모드의 title 은 기본적으로 로 렌더링됩니다(WCAG 1.3.1). 카드가 놓이는 문서의 제목 계층에 맞춰 1–6 을 주고, 제목이 이미 카드 바깥에 있으면 headingLevel={false} 로 heading 의미를 끄세요. 레벨은 건너뛰지 않습니다. |
| 명시 규칙 2 | SaveButton(save)과 toggleIcon 은 포커스 가능한 요소이므로 규칙 1과 함께 쓰지 마세요. |
| 명시 규칙 3 | Card — 모든 것이 올라가는 중립 서피스: 화이트(또는 dark 네이비), 헤어라인 보더, 부드러운 네이비 그림자, 16px 반경. interactive는 호버 시 떠오릅니다. |
| 명시 규칙 4 | 1. 전체 카드가 하나의 행동일 때 → interactive + onClick. 카드 루트가 role="button" · tabIndex=0 이 되고 Enter/Space 로 활성화되며 :focus-visible 링이 붙습니다(WCAG 2.1.1). 이때 카드 안에는 버튼·링크·스위치 같은 포커스 가능한 요소를 넣지 마세요. 버튼 안의 버튼(nested interactive)은 유효하지 않은 마크업이고, 스크린리더가 카드 이름으로 내부 텍스트를 전부 읽어 이름이 문단처럼 길어집니다. 2. |
| --body1-size | {"fontSize":"16px","lineHeight":"24px","letterSpacing":"0.0057em"} |

## Responsive

- WDS axes: platform="desktop|mobile", skeleton, save, toggleIcon (top-right toggle affordance beside save), structured slots (thumbnail, topContent, leadingContent, trailingContent, bottomContent, footer) and three text caption tiers (caption, title, description, subCaption, metaCaption).
- titleWrap="truncate|wrap" controls structured-title overflow. The default truncate keeps dense card grids to one line; use wrap when the full document, report, or publication title is necessary to distinguish the destination.
- Stable structured parts are root, content, header, actions, media, body, title, description, and footer. Optional parts do not render empty wrappers.
- vars accepts only --lds-card-padding, --lds-card-radius, --lds-card-gap, and --lds-card-max-width. These cannot turn a non-interactive card into a control or bypass heading/nesting rules.

## Content and writing

- className, style, and the default ref target the polymorphic root. The ref type follows the rendered as element.
- classNames and styles accept only those stable part keys; product selectors do not depend on Card's internal DOM order.

## Exceptions

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
<Card elevation="md" interactive onClick={openDetail}>…</Card>
<Card dark padding={22}>…</Card>
```

### 추가 조합 2

```jsx
<Card platform="mobile" save title="Title" description="Description" />
<Card platform="desktop" skeleton headingLevel={2} />
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

### Source contracts

- `components/cards/Card.jsx`
- `components/cards/Card.d.ts`
- `components/cards/Card.prompt.md`
- `stories/Card.stories.jsx`

## Migration

- dark remains the inverse-card compatibility axis and takes precedence over surface.

## Sources

- Card prompt contract: `components/cards/Card.prompt.md`
- Storybook implementation evidence: `stories/Card.stories.jsx`
