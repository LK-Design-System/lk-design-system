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

- 제목, 설명, 미디어, 메타 정보와 제한된 행동이 함께 이동해야 하는 콘텐츠 단위에 적합합니다. 단순한 행 목록은 List Cell을, 화면 전체의 큰 구획은 Section이나 Container를 사용하고, 모든 영역을 습관적으로 카드 안에 중첩하지 마세요.
- Plain children-only Card usage is still supported for generic LDS surfaces.
- - WDS axes: platform="desktop|mobile", skeleton, save, toggleIcon (top-right toggle affordance beside save), structured slots (thumbnail, topContent, leadingContent, trailingContent, bottomContent, footer) and three text caption tiers (caption, title, description, subCaption, metaCaption). - Plain children-only Card u….
- Card가 소유하는 Content 의미와 상태를 여러 제품 화면에서 동일하게 재사용할 때 사용합니다.

### 사용하지 않음

- 1. 전체 카드가 하나의 행동일 때 → interactive + onClick. 카드 루트가 role="button" · tabIndex=0 이 되고 Enter/Space 로 활성화되며 :focus-visible 링이 붙습니다(WCAG 2.1.1). 이때 카드 안에는 버튼·링크·스위치 같은 포커스 가능한 요소를 넣지 마세요. 버튼 안의 버튼(nested interactive)은 유효하지 않은 마크업이고, 스크린리더가 카드 이름으로 내부 텍스트를 전부 읽어 이름이 문단처럼 길어집니다. 2. 카드 안에 행동이 여러 개거나 본문 일부만 링크일 때 → interactive….
- Card가 소유하지 않는 라우팅, 권한, 데이터 요청, 제품 임계값을 컴포넌트 내부에 넣지 않습니다.
- 동일한 목적을 더 단순한 native 요소나 기존 LDS primitive로 해결할 수 있으면 새 조합을 만들지 않습니다.
- 표현이 비슷하다는 이유만으로 상태 의미가 다른 sibling 컴포넌트를 서로 대체하지 않습니다.

## Anatomy

| Part | Contract |
| --- | --- |
| Root | Card의 semantic role, layout containment와 전달받은 DOM 속성을 소유합니다. |
| Toggle Icon | Toggle-icon affordance rendered in the top-right (WDS Card/List Card parity); shows alongside save. |
| Top Content | topContent 속성으로 제공되는 공개 슬롯 또는 표시 영역입니다. |
| Leading Content | leadingContent 속성으로 제공되는 공개 슬롯 또는 표시 영역입니다. |
| Trailing Content | trailingContent 속성으로 제공되는 공개 슬롯 또는 표시 영역입니다. |
| Title | title 속성으로 제공되는 공개 슬롯 또는 표시 영역입니다. |
| Description | description 속성으로 제공되는 공개 슬롯 또는 표시 영역입니다. |
| Caption | caption 속성으로 제공되는 공개 슬롯 또는 표시 영역입니다. |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `elevation` | `"none" \| "sm" \| "md" \| "lg"` | No | 기본 그림자 깊이. @default "md" |
| `interactive` | `boolean` | No | 카드 전체가 하나의 행동일 때. 호버 리프트 + 그림자 심화에 더해 role="button", tabIndex=0, Enter/Space 활성화, :focus-visible 링을 부여합니다. 내부에 별도의 버튼·링크를 넣지 마세요. |
| `dark` | `boolean` | No | 다크 섹션용 네이비 서피스. @default false |
| `headingLevel` | `1 \| 2 \| 3 \| 4 \| 5 \| 6 \| false` | No | 구조화 모드 title 의 heading 레벨. false 면 heading 의미 없이 div 로 렌더링합니다(제목이 이미 바깥에 있을 때). |
| `padding` | `number \| string` | No | 기본 32px 패딩을 재정의. |
| `platform` | `"desktop" \| "mobile"` | No | platform axis. @default "desktop" |
| `skeleton` | `boolean` | No | skeleton axis. @default false |
| `save` | `boolean` | No | save action axis. @default false |
| `saved` | `boolean` | No | 공개 타입 계약에 정의된 속성입니다. |
| `onSave` | `(e: React.MouseEvent) = void` | No | 공개 타입 계약에 정의된 속성입니다. |
| `toggleIcon` | `React.ReactNode` | No | Toggle-icon affordance rendered in the top-right (WDS Card/List Card parity); shows alongside save. |
| `thumbnail` | `React.ReactNode` | No | 공개 타입 계약에 정의된 속성입니다. |
| `topContent` | `React.ReactNode` | No | 공개 타입 계약에 정의된 속성입니다. |
| `leadingContent` | `React.ReactNode` | No | 공개 타입 계약에 정의된 속성입니다. |
| `trailingContent` | `React.ReactNode` | No | 공개 타입 계약에 정의된 속성입니다. |
| `title` | `React.ReactNode` | No | 공개 타입 계약에 정의된 속성입니다. |
| `description` | `React.ReactNode` | No | 공개 타입 계약에 정의된 속성입니다. |
| `caption` | `React.ReactNode` | No | 공개 타입 계약에 정의된 속성입니다. |
| `subCaption` | `React.ReactNode` | No | 공개 타입 계약에 정의된 속성입니다. |
| `metaCaption` | `React.ReactNode` | No | Third caption tier — smallest meta line under subCaption (WDS three-tier caption parity). |
| `bottomContent` | `React.ReactNode` | No | 공개 타입 계약에 정의된 속성입니다. |
| `footer` | `React.ReactNode` | No | 공개 타입 계약에 정의된 속성입니다. |
| `children` | `React.ReactNode` | No | 공개 타입 계약에 정의된 속성입니다. |

## States

| State | Contract |
| --- | --- |
| interactive | 카드 전체가 하나의 행동일 때. 호버 리프트 + 그림자 심화에 더해 role="button", tabIndex=0, Enter/Space 활성화, :focus-visible 링을 부여합니다. 내부에 별도의 버튼·링크를 넣지 마세요. 타입 계약: boolean |
| 변형·상태 · 상호작용과 어두운 표면 | variants-states 공개 스토리에서 렌더링 및 상호작용 증거를 유지합니다. |

## Behavior and interaction

- 1. 전체 카드가 하나의 행동일 때 → interactive + onClick. 카드 루트가 role="button" · tabIndex=0 이 되고 Enter/Space 로 활성화되며 :focus-visible 링이 붙습니다(WCAG 2.1.1). 이때 카드 안에는 버튼·링크·스위치 같은 포커스 가능한 요소를 넣지 마세요. 버튼 안의 버튼(nested interactive)은 유효하지 않은 마크업이고, 스크린리더가 카드 이름으로 내부 텍스트를 전부 읽어 이름이 문단처럼 길어집니다. 2. 카드 안에 행동이 여러 개거나 본문 일부만 링크일 때 → interactive….
- Card의 controlled/uncontrolled 경계와 callback 순서는 공개 타입 계약을 따릅니다.
- 상태 변화 중에도 accessible name, focus 위치와 레이아웃 기준점을 예고 없이 잃지 않습니다.
- 제품 데이터와 side effect는 callback으로 위임하고 Card는 표시·입력 상태만 소유합니다.

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 명시 규칙 1 | headingLevel — 구조화 모드의 title 은 기본적으로 로 렌더링됩니다(WCAG 1.3.1). 카드가 놓이는 문서의 제목 계층에 맞춰 1–6 을 주고, 제목이 이미 카드 바깥에 있으면 headingLevel={false} 로 heading 의미를 끄세요. 레벨은 건너뛰지 않습니다. |
| 명시 규칙 2 | SaveButton(save)과 toggleIcon 은 포커스 가능한 요소이므로 규칙 1과 함께 쓰지 마세요. |
| 명시 규칙 3 | Card — 모든 것이 올라가는 중립 서피스: 화이트(또는 dark 네이비), 헤어라인 보더, 부드러운 네이비 그림자, 16px 반경. interactive는 호버 시 떠오릅니다. |
| 명시 규칙 4 | 1. 전체 카드가 하나의 행동일 때 → interactive + onClick. 카드 루트가 role="button" · tabIndex=0 이 되고 Enter/Space 로 활성화되며 :focus-visible 링이 붙습니다(WCAG 2.1.1). 이때 카드 안에는 버튼·링크·스위치 같은 포커스 가능한 요소를 넣지 마세요. 버튼 안의 버튼(nested interactive)은 유효하지 않은 마크업이고, 스크린리더가 카드 이름으로 내부 텍스트를 전부 읽어 이름이 문단처럼 길어집니다. 2. 카드 안에 행동이 여러 개거나 본문 일부만 링크일 때 → interactive… |
| --body1-size | {"fontSize":"16px","lineHeight":"24px","letterSpacing":"0.0057em"} |

## Responsive

- WDS axes: platform="desktop|mobile", skeleton, save, toggleIcon (top-right toggle affordance beside save), structured slots (thumbnail, topContent, leadingContent, trailingContent, bottomContent, footer) and three text caption tiers (caption, title, description, subCaption, metaCaption).
- - WDS axes: platform="desktop|mobile", skeleton, save, toggleIcon (top-right toggle affordance beside save), structured slots (thumbnail, topContent, leadingContent, trailingContent, bottomContent, footer) and three text caption tiers (caption, title, description, subCaption, metaCaption). - Plain children-only Card u….
- 320px 좁은 폭과 200% 텍스트 확대에서 페이지 가로 overflow 없이 의미 순서를 유지합니다.
- 고정 폭보다 부모 containment와 wrapping을 우선하고, 제품이 필요할 때 명시적으로 compact 표현을 선택합니다.

## Content and writing

- WDS axes: platform="desktop|mobile", skeleton, save, toggleIcon (top-right toggle affordance beside save), structured slots (thumbnail, topContent, leadingContent, trailingContent, bottomContent, footer) and three text caption tiers (caption, title, description, subCaption, metaCaption).
- headingLevel — 구조화 모드의 title 은 기본적으로 로 렌더링됩니다(WCAG 1.3.1). 카드가 놓이는 문서의 제목 계층에 맞춰 1–6 을 주고, 제목이 이미 카드 바깥에 있으면 headingLevel={false} 로 heading 의미를 끄세요. 레벨은 건너뛰지 않습니다.
- - WDS axes: platform="desktop|mobile", skeleton, save, toggleIcon (top-right toggle affordance beside save), structured slots (thumbnail, topContent, leadingContent, trailingContent, bottomContent, footer) and three text caption tiers (caption, title, description, subCaption, metaCaption). - Plain children-only Card u….
- 1. 전체 카드가 하나의 행동일 때 → interactive + onClick. 카드 루트가 role="button" · tabIndex=0 이 되고 Enter/Space 로 활성화되며 :focus-visible 링이 붙습니다(WCAG 2.1.1). 이때 카드 안에는 버튼·링크·스위치 같은 포커스 가능한 요소를 넣지 마세요. 버튼 안의 버튼(nested interactive)은 유효하지 않은 마크업이고, 스크린리더가 카드 이름으로 내부 텍스트를 전부 읽어 이름이 문단처럼 길어집니다. 2. 카드 안에 행동이 여러 개거나 본문 일부만 링크일 때 → interactive….

## Accessibility

- headingLevel — 구조화 모드의 title 은 기본적으로 로 렌더링됩니다(WCAG 1.3.1). 카드가 놓이는 문서의 제목 계층에 맞춰 1–6 을 주고, 제목이 이미 카드 바깥에 있으면 headingLevel={false} 로 heading 의미를 끄세요. 레벨은 건너뛰지 않습니다.
- 1. 전체 카드가 하나의 행동일 때 → interactive + onClick. 카드 루트가 role="button" · tabIndex=0 이 되고 Enter/Space 로 활성화되며 :focus-visible 링이 붙습니다(WCAG 2.1.1). 이때 카드 안에는 버튼·링크·스위치 같은 포커스 가능한 요소를 넣지 마세요. 버튼 안의 버튼(nested interactive)은 유효하지 않은 마크업이고, 스크린리더가 카드 이름으로 내부 텍스트를 전부 읽어 이름이 문단처럼 길어집니다. 2. 카드 안에 행동이 여러 개거나 본문 일부만 링크일 때 → interactive….
- - headingLevel — 구조화 모드의 title 은 기본적으로 로 렌더링됩니다(WCAG 1.3.1). 카드가 놓이는 문서의 제목 계층에 맞춰 1–6 을 주고, 제목이 이미 카드 바깥에 있으면 headingLevel={false} 로 heading 의미를 끄세요. 레벨은 건너뛰지 않습니다. - SaveButton(save)과 toggleIcon 은 포커스 가능한 요소이므로 규칙 1과 함께 쓰지 마세요.
- native semantic을 우선하며 사용자에게 보이는 이름과 접근 가능한 이름이 같은 목적을 설명하게 합니다.
- 키보드 focus 순서, focus-visible 표시와 상태 ARIA가 시각 상태와 동시에 갱신되는지 공개 스토리에서 검증합니다.

## Do / Don't

| Kind | Guidance |
| --- | --- |
| Do | Plain children-only Card usage is still supported for generic LDS surfaces. |
| Don't | 1. 전체 카드가 하나의 행동일 때 → interactive + onClick. 카드 루트가 role="button" · tabIndex=0 이 되고 Enter/Space 로 활성화되며 :focus-visible 링이 붙습니다(WCAG 2.1.1). 이때 카드 안에는 버튼·링크·스위치 같은 포커스 가능한 요소를 넣지 마세요. 버튼 안의 버튼(nested interactive)은 유효하지 않은 마크업이고, 스크린리더가 카드 이름으로 내부 텍스트를 전부 읽어 이름이 문단처럼 길어집니다. 2. 카드 안에 행동이 여러 개거나 본문 일부만 링크일 때 → interactive…. |
| Do | - WDS axes: platform="desktop\|mobile", skeleton, save, toggleIcon (top-right toggle affordance beside save), structured slots (thumbnail, topContent, leadingContent, trailingContent, bottomContent, footer) and three text caption tiers (caption, title, description, subCaption, metaCaption). - Plain children-only Card u…. |
| Don't | Card가 소유하지 않는 라우팅, 권한, 데이터 요청, 제품 임계값을 컴포넌트 내부에 넣지 않습니다. |

## Exceptions

- 제품 정책을 포함해야 하는 예외는 wrapper 또는 제품 저장소에서 조합하고 Card의 범용 API에 넣지 않습니다.
- 접근성 또는 안전 계약을 약화하는 예외는 허용하지 않으며 필요한 차이는 prompt와 Storybook 증거에 기록합니다.

## Related components

| Component | Relationship |
| --- | --- |
| `Button` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `ContentBadge` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `Icon` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `ListCell` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `Thumbnail` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `ToggleIcon` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `ChoiceCard` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |

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
- `--radius-md`

### Source contracts

- `components/cards/Card.jsx`
- `components/cards/Card.d.ts`
- `components/cards/Card.prompt.md`
- `stories/Card.stories.jsx`

## Migration

- 현재 prompt와 타입 계약에 기록되지 않은 legacy alias는 새 코드에서 도입하지 않습니다.
- 대체 컴포넌트가 생기면 기존 API의 제거 버전, 대응 prop과 자동·수동 전환 절차를 이 페이지에 기록합니다.

## Sources

- Card prompt contract: `components/cards/Card.prompt.md`
- Storybook implementation evidence: `stories/Card.stories.jsx`
