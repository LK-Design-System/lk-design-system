# Lists

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Core / Content |
| Owner | `ListCell` |
| Storybook | `LDS Core/Components/Content/Lists` |
| Source | `../component-content.json#core-components-content-lists` |

같은 정보 구조를 가진 문서, 알림, 설정 항목을 세로 목록으로 비교하거나 탐색할 때 적합합니다. 독립된 풍부한 콘텐츠 단위는 Card를, 단순한 값의 행·열 비교는 Table을 사용하고 서로 다른 구조를 한 목록에 섞지 마세요.

## Anatomy

| Part | Contract |
| --- | --- |
| leadingContent | slot alias for leading. |
| trailingContent | slot alias for trailing. |
| interaction | Storybook/state rendering aid for interaction states. |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `items` | `AccordionItem[]` | Yes | 행 — 각각 { title, content }. |
| `multiple` | `boolean` | No | 한 번에 여러 행 열기 허용. @default false |
| `defaultOpen` | `number[]` | No | 마운트 시 열려 있는 인덱스. @default [] |
| `headingLevel` | `1 \| 2 \| 3 \| 4 \| 5 \| 6 \| false` | No | 각 헤더 트리거를 감싸는 heading 레벨(APG: "each accordion header is contained in an element with role heading"). false 면 heading 래퍼 없이 버튼만 렌더링합니다. |
| `style` | `React.CSSProperties` | No |  |
| `leading` | `React.ReactNode` | No | 리딩 노드(아이콘 / 아바타 / 썸네일). |
| `leadingContent` | `React.ReactNode` | No | slot alias for leading. |
| `title` | `React.ReactNode` | No | 기본 텍스트. |
| `description` | `React.ReactNode` | No | 보조 줄. |
| `trailing` | `React.ReactNode` | No | 트레일링 노드(값 / 스위치 / 액션). |
| `trailingContent` | `React.ReactNode` | No | slot alias for trailing. |
| `onClick` | `(e: React.MouseEvent \| React.KeyboardEvent) = void` | No | 행을 인터랙티브하게 만듦. |
| `divider` | `boolean` | No | 헤어라인 밑줄 추가. @default false |
| `chevron` | `boolean` | No | 오른쪽 chevron을 추가. @default false |
| `selected` | `boolean` | No | 선택 상태. @default false |
| `selectedPresentation` | `"accent-check" \| "tint"` | No | selected의 표시 방식. "accent-check"는 WDS 선택 패턴(액센트 제목 + 체크)으로 "여럿 중 하나 고름"을 말하고, "tint"는 체크·액센트 없이 중립 fill만 유지해 대화·내비게이션 목록의 "지금 열려 있는 항목"을 말한다. @default "accent-check" |
| `disabled` | `boolean` | No | 비활성 상태. @default false |
| `disable` | `boolean` | No | disabled alias. |
| `fillWidth` | `boolean` | No | 가능한 폭을 채움. @default true |
| `textEllipsis` | `boolean` | No | 제목/설명 말줄임. @default true |
| `verticalPadding` | `"none" \| "small" \| "sm" \| "medium" \| "md" \| "large" \| "lg" \| "custom"` | No | verticalPadding axis. @default "medium" |
| `paddingY` | `number` | No | verticalPadding="custom"일 때 직접 패딩 지정. |
| `paddingX` | `number \| string` | No | 좌우 패딩. @default 20 |
| `verticalAlign` | `"top" \| "center"` | No | 세로 정렬. @default "center" |

## States

| State | Contract |
| --- | --- |
| defaultOpen | 마운트 시 열려 있는 인덱스. @default [] |
| selected | 선택 상태. @default false |
| selectedPresentation | selected의 표시 방식. "accent-check"는 WDS 선택 패턴(액센트 제목 + 체크)으로 "여럿 중 하나 고름"을 말하고, "tint"는 체크·액센트 없이 중립 fill만 유지해 대화·내비게이션 목록의 "지금 열려 있는 항목"을 말한다. @default "accent-check" |
| disabled | 비활성 상태. @default false |
| interaction | Storybook/state rendering aid for interaction states. |

## Behavior and interaction

- ListCell — WDS List Cell. 선택 가능한 목록 행, 설정 행, 리소스 행의 기본 단위입니다.

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 명시 규칙 1 | verticalPadding="small \| medium \| large" 공개 문법은 유지하면서 각 값은 profile-aware component token을 읽습니다. default는 기존 8/12/16px이고 ops는 6/8/12px이다. 명시적 paddingY escape hatch가 token보다 우선하며 selection·keyboard·list semantics는 profile과 무관합니다. 정본은 docs/DENSITYANDEXPRESSIONPROFILECONTRACT.md입니다. |
| 명시 규칙 2 | 반복되는 행은 반드시 리스트로 감싸세요. 감싸지 않으면 스크린리더가 "3개 중 2번째"를 읽지 못해 항목 수와 현재 위치가 사라집니다(WCAG 1.3.1). |
| --body1-line | {"fontSize":"16px","lineHeight":"24px","letterSpacing":"0.0057em"} |
| --body1-size | {"fontSize":"16px","lineHeight":"24px","letterSpacing":"0.0057em"} |
| --body2-size | 15px |

## Content and writing

- selectedPresentation은 LDS 확장 축이다. 기본 accent-check는 WDS 선택 패턴(액센트 제목 + trailing 체크)으로 "여럿 중 하나 고름"을 말한다. tint는 체크·액센트 없이 중립 fill(--color-semantic-fill-normal)만 지속시켜 대화 목록·내비게이션처럼 "지금 열려 있는 항목"을 말한다 — 매 행이 여전히 평범한 목적지인 목록에서 체크는 선택 과업으로 오독된다(ChatGPT·Claude 대화 목록 관례).

## Accessibility

- WDS axes: verticalPadding none · small · medium · large · custom, verticalAlign top · center, fillWidth, textEllipsis, divider, chevron, selected, disabled, interaction normal · hovered · focused · pressed.
- Use onClick for keyboard-operable interactive rows. Use interaction only to render fixed visual states in Storybook or tests.
- 래퍼는 li, 인터랙티브 요소는 ListCell 루트로 분리합니다. ListCell 자체를 li 로 만들면 onClick 이 있을 때 루트가 role="button" 이 되어 listitem 의미가 사라집니다.
- list-style: none 을 주면 일부 브라우저가 리스트 의미를 제거하므로 role="list" 를 함께 붙입니다.
- 포커스 링은 :focus-visible 일 때만 나타납니다(Material/Fluent 관례). 마우스로 눌렀을 때 링이 남지 않고, 키보드 이동에서는 항상 보입니다. interaction="focused" 는 스토리·테스트용 고정 시각 상태이므로 이 규칙과 무관하게 링을 강제합니다.

## Related components

| Component | Relationship |
| --- | --- |
| `Accordion` | 같은 페이지가 소유 |
| `ContentBadge` | 대표 시나리오에서 조합 |
| `Icon` | 대표 시나리오에서 조합 |
| `Kbd` | 대표 시나리오에서 조합 |
| `StatusBadge` | 대표 시나리오에서 조합 |
| `Blockquote` | 대표 시나리오에서 조합 |
| `Code` | 대표 시나리오에서 조합 |
| `Collapsible` | 대표 시나리오에서 조합 |

## Examples

### 기본 조합

```jsx
<ListCell leading={<Icon name="document" />} title="문서 제목" description="설명" trailing={<ContentBadge>검토</ContentBadge>} divider />
<ListCell title="선택 항목" selected chevron onClick={open} />
<ListCell title="긴 텍스트" textEllipsis={false} verticalAlign="top" />
```

### 추가 조합 2

```jsx
<ul role="list" style={{ listStyle: 'none', margin: 0, padding: 0 }}>
  <li><ListCell title="디자인 토큰" onClick={open} divider /></li>
  <li><ListCell title="컴포넌트 문서" onClick={open} /></li>
</ul>
```

## Tokens and API

### Tokens

- `--body1-line`
- `--body1-size`
- `--body2-size`
- `--caption1-line`
- `--caption1-size`
- `--color-semantic-fill-alternative`
- `--color-semantic-fill-normal`
- `--color-semantic-fill-strong`
- `--color-semantic-focus-ring`
- `--color-semantic-label-alternative`
- `--color-semantic-label-disable`
- `--color-semantic-label-neutral`
- `--color-semantic-label-normal`
- `--color-semantic-line-normal-normal`
- `--color-semantic-line-solid-normal`
- `--color-semantic-primary-normal`
- `--color-semantic-primary-surface-normal`
- `--component-list-cell-padding-y-lg`
- `--component-list-cell-padding-y-md`
- `--component-list-cell-padding-y-sm`
- `--dur-base`
- `--dur-fast`
- `--ease-out`
- `--font-sans`
- `--fw-bold`
- `--fw-medium`
- `--fw-regular`
- `--headline2-size`
- `--label2-line`
- `--label2-size`
- `--radius-lg`
- `--radius-md`
- `--space-1`

### Source contracts

- `components/content/Accordion.jsx`
- `components/content/Accordion.d.ts`
- `components/content/Accordion.prompt.md`
- `components/content/ListCell.jsx`
- `components/content/ListCell.d.ts`
- `components/content/ListCell.prompt.md`
- `stories/ContentListsMedia.stories.jsx`

## Migration

- Slot aliases are supported: leadingContent/trailingContent map to leading/trailing; disable maps to disabled.

## Sources

- ListCell prompt contract: `components/content/ListCell.prompt.md`
- Storybook implementation evidence: `stories/ContentListsMedia.stories.jsx`
