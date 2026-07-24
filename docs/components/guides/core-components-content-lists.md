# Lists

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Core / Content |
| Owner | `ListCell` |
| Storybook | `LDS Core/Components/Content/Lists` |
| Source | `../component-content.json#core-components-content-lists` |

같은 정보 구조를 가진 문서, 알림, 설정 항목을 세로 목록으로 비교하거나 탐색할 때 적합합니다. 독립된 풍부한 콘텐츠 단위는 Card를, 단순한 값의 행·열 비교는 Table을 사용하고 서로 다른 구조를 한 목록에 섞지 마세요.

## 사용 판단

### 사용

- 같은 정보 구조를 가진 문서, 알림, 설정 항목을 세로 목록으로 비교하거나 탐색할 때 적합합니다. 독립된 풍부한 콘텐츠 단위는 Card를, 단순한 값의 행·열 비교는 Table을 사용하고 서로 다른 구조를 한 목록에 섞지 마세요.
- WDS axes: verticalPadding none · small · medium · large · custom, verticalAlign top · center, fillWidth, textEllipsis, divider, chevron, selected, disabled, interaction normal · hovered · focused · pressed.
- Use onClick for keyboard-operable interactive rows. Use interaction only to render fixed visual states in Storybook or tests.
- 포커스 링은 :focus-visible 일 때만 나타납니다(Material/Fluent 관례). 마우스로 눌렀을 때 링이 남지 않고, 키보드 이동에서는 항상 보입니다. interaction="focused" 는 스토리·테스트용 고정 시각 상태이므로 이 규칙과 무관하게 링을 강제합니다.

### 사용하지 않음

- Lists가 소유하지 않는 라우팅, 권한, 데이터 요청, 제품 임계값을 컴포넌트 내부에 넣지 않습니다.
- 동일한 목적을 더 단순한 native 요소나 기존 LDS primitive로 해결할 수 있으면 새 조합을 만들지 않습니다.
- 표현이 비슷하다는 이유만으로 상태 의미가 다른 sibling 컴포넌트를 서로 대체하지 않습니다.

## Anatomy

| Part | Contract |
| --- | --- |
| Root | ListCell의 semantic role, layout containment와 전달받은 DOM 속성을 소유합니다. |
| Leading Content | slot alias for leading. |
| Title | title 속성으로 제공되는 공개 슬롯 또는 표시 영역입니다. |
| Description | description 속성으로 제공되는 공개 슬롯 또는 표시 영역입니다. |
| Trailing Content | slot alias for trailing. |
| Interaction | Storybook/state rendering aid for interaction states. |
| Content Style | contentStyle 속성으로 제공되는 공개 슬롯 또는 표시 영역입니다. |
| Title Style | titleStyle 속성으로 제공되는 공개 슬롯 또는 표시 영역입니다. |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `items` | `AccordionItem[]` | Yes | 행 — 각각 { title, content }. |
| `multiple` | `boolean` | No | 한 번에 여러 행 열기 허용. @default false |
| `defaultOpen` | `number[]` | No | 마운트 시 열려 있는 인덱스. @default [] |
| `headingLevel` | `1 \| 2 \| 3 \| 4 \| 5 \| 6 \| false` | No | 각 헤더 트리거를 감싸는 heading 레벨(APG: "each accordion header is contained in an element with role heading"). false 면 heading 래퍼 없이 버튼만 렌더링합니다. |
| `style` | `React.CSSProperties` | No | 공개 타입 계약에 정의된 속성입니다. |
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
| `disabled` | `boolean` | No | 비활성 상태. @default false |
| `disable` | `boolean` | No | disabled alias. |
| `fillWidth` | `boolean` | No | 가능한 폭을 채움. @default true |
| `textEllipsis` | `boolean` | No | 제목/설명 말줄임. @default true |
| `verticalPadding` | `"none" \| "small" \| "sm" \| "medium" \| "md" \| "large" \| "lg" \| "custom"` | No | verticalPadding axis. @default "medium" |
| `paddingY` | `number` | No | verticalPadding="custom"일 때 직접 패딩 지정. |
| `paddingX` | `number \| string` | No | 좌우 패딩. @default 20 |
| `verticalAlign` | `"top" \| "center"` | No | 세로 정렬. @default "center" |
| `interaction` | `boolean \| "normal" \| "hovered" \| "focused" \| "pressed" \| "active"` | No | Storybook/state rendering aid for interaction states. |

## States

| State | Contract |
| --- | --- |
| defaultOpen | 마운트 시 열려 있는 인덱스. @default [] 타입 계약: number[] |
| selected | 선택 상태. @default false 타입 계약: boolean |
| disabled | 비활성 상태. @default false 타입 계약: boolean |
| interaction | Storybook/state rendering aid for interaction states. 타입 계약: boolean \| "normal" \| "hovered" \| "focused" \| "pressed" \| "active" |
| 변형·상태 · 밀도와 선택 상태 | variants-states 공개 스토리에서 렌더링 및 상호작용 증거를 유지합니다. |

## Behavior and interaction

- WDS axes: verticalPadding none · small · medium · large · custom, verticalAlign top · center, fillWidth, textEllipsis, divider, chevron, selected, disabled, interaction normal · hovered · focused · pressed.
- Use onClick for keyboard-operable interactive rows. Use interaction only to render fixed visual states in Storybook or tests.
- 래퍼는 li, 인터랙티브 요소는 ListCell 루트로 분리합니다. ListCell 자체를 li 로 만들면 onClick 이 있을 때 루트가 role="button" 이 되어 listitem 의미가 사라집니다.
- 포커스 링은 :focus-visible 일 때만 나타납니다(Material/Fluent 관례). 마우스로 눌렀을 때 링이 남지 않고, 키보드 이동에서는 항상 보입니다. interaction="focused" 는 스토리·테스트용 고정 시각 상태이므로 이 규칙과 무관하게 링을 강제합니다.
- ListCell — WDS List Cell. 선택 가능한 목록 행, 설정 행, 리소스 행의 기본 단위입니다.

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 명시 규칙 1 | 반복되는 행은 반드시 리스트로 감싸세요. 감싸지 않으면 스크린리더가 "3개 중 2번째"를 읽지 못해 항목 수와 현재 위치가 사라집니다(WCAG 1.3.1). |
| --body1-line | {"fontSize":"16px","lineHeight":"24px","letterSpacing":"0.0057em"} |
| --body1-size | {"fontSize":"16px","lineHeight":"24px","letterSpacing":"0.0057em"} |
| --body2-size | 15px |
| --caption1-line | {"fontSize":"12px","lineHeight":"16px","letterSpacing":"0.0252em"} |

## Responsive

- WDS axes: verticalPadding none · small · medium · large · custom, verticalAlign top · center, fillWidth, textEllipsis, divider, chevron, selected, disabled, interaction normal · hovered · focused · pressed.
- - WDS axes: verticalPadding none · small · medium · large · custom, verticalAlign top · center, fillWidth, textEllipsis, divider, chevron, selected, disabled, interaction normal · hovered · focused · pressed. - Slot aliases are supported: leadingContent/trailingContent map to leading/trailing; disable maps to disabled….
- 320px 좁은 폭과 200% 텍스트 확대에서 페이지 가로 overflow 없이 의미 순서를 유지합니다.
- 고정 폭보다 부모 containment와 wrapping을 우선하고, 제품이 필요할 때 명시적으로 compact 표현을 선택합니다.

## Content and writing

- WDS axes: verticalPadding none · small · medium · large · custom, verticalAlign top · center, fillWidth, textEllipsis, divider, chevron, selected, disabled, interaction normal · hovered · focused · pressed.
- - WDS axes: verticalPadding none · small · medium · large · custom, verticalAlign top · center, fillWidth, textEllipsis, divider, chevron, selected, disabled, interaction normal · hovered · focused · pressed. - Slot aliases are supported: leadingContent/trailingContent map to leading/trailing; disable maps to disabled….
- 사용자에게 보이는 Lists 문자열은 제품 번역 계층에서 제공하고 행동 또는 상태를 구체적으로 설명합니다.
- 아이콘이나 색상만으로 의미를 대신하지 않고 필요한 label, title 또는 status text를 함께 제공합니다.

## Accessibility

- WDS axes: verticalPadding none · small · medium · large · custom, verticalAlign top · center, fillWidth, textEllipsis, divider, chevron, selected, disabled, interaction normal · hovered · focused · pressed.
- Use onClick for keyboard-operable interactive rows. Use interaction only to render fixed visual states in Storybook or tests.
- 래퍼는 li, 인터랙티브 요소는 ListCell 루트로 분리합니다. ListCell 자체를 li 로 만들면 onClick 이 있을 때 루트가 role="button" 이 되어 listitem 의미가 사라집니다.
- list-style: none 을 주면 일부 브라우저가 리스트 의미를 제거하므로 role="list" 를 함께 붙입니다.
- 포커스 링은 :focus-visible 일 때만 나타납니다(Material/Fluent 관례). 마우스로 눌렀을 때 링이 남지 않고, 키보드 이동에서는 항상 보입니다. interaction="focused" 는 스토리·테스트용 고정 시각 상태이므로 이 규칙과 무관하게 링을 강제합니다.

## Do / Don't

| Kind | Guidance |
| --- | --- |
| Do | WDS axes: verticalPadding none · small · medium · large · custom, verticalAlign top · center, fillWidth, textEllipsis, divider, chevron, selected, disabled, interaction normal · hovered · focused · pressed. |
| Don't | Lists가 소유하지 않는 라우팅, 권한, 데이터 요청, 제품 임계값을 컴포넌트 내부에 넣지 않습니다. |
| Do | Use onClick for keyboard-operable interactive rows. Use interaction only to render fixed visual states in Storybook or tests. |
| Don't | 동일한 목적을 더 단순한 native 요소나 기존 LDS primitive로 해결할 수 있으면 새 조합을 만들지 않습니다. |

## Exceptions

- 제품 정책을 포함해야 하는 예외는 wrapper 또는 제품 저장소에서 조합하고 ListCell의 범용 API에 넣지 않습니다.
- 접근성 또는 안전 계약을 약화하는 예외는 허용하지 않으며 필요한 차이는 prompt와 Storybook 증거에 기록합니다.

## Related components

| Component | Relationship |
| --- | --- |
| `Accordion` | 같은 페이지가 소유하는 공개 primitive 또는 조합 요소입니다. |
| `ContentBadge` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `Icon` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `Kbd` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `StatusBadge` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `Blockquote` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `Code` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `Collapsible` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |

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
- - WDS axes: verticalPadding none · small · medium · large · custom, verticalAlign top · center, fillWidth, textEllipsis, divider, chevron, selected, disabled, interaction normal · hovered · focused · pressed. - Slot aliases are supported: leadingContent/trailingContent map to leading/trailing; disable maps to disabled….
- 현재 prompt와 타입 계약에 기록되지 않은 legacy alias는 새 코드에서 도입하지 않습니다.
- 대체 컴포넌트가 생기면 기존 API의 제거 버전, 대응 prop과 자동·수동 전환 절차를 이 페이지에 기록합니다.

## Sources

- ListCell prompt contract: `components/content/ListCell.prompt.md`
- Storybook implementation evidence: `stories/ContentListsMedia.stories.jsx`
- [SEED Lists benchmark](https://seed-design.io/components/list)
