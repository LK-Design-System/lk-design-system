# Divider

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Core / Layout |
| Owner | `Divider` |
| Storybook | `LDS Core/Components/Layout/Divider` |
| Source | `../component-content.json#core-components-layout-divider` |

같은 표면에서 의미가 다른 섹션이나 인라인 그룹을 보조할 때 사용합니다. 주제가 바뀌면 separator를, 이미 구조가 잡힌 곳의 리듬에는 decorative를 사용합니다. 여백으로 충분하면 선을 사용하지 말고, 독립 표면이 필요하면 Card나 Section을 사용하세요.

## 사용 판단

### 사용

- Use variant="normal" for hairline separation and variant="thick" for stronger section breaks.

## Anatomy

| Part | Contract |
| --- | --- |
| label | Optional centered label for an "or" style divider. |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `vertical` | `boolean` | No | Render as a vertical separator. @default false |
| `label` | `React.ReactNode` | No | Optional centered label for an "or" style divider. |
| `inset` | `number` | No | Horizontal inset in pixels. @default 0 |
| `variant` | `"normal" \| "thick"` | No | divider visual weight. @default "normal" |
| `decorative` | `boolean` | No | 순전히 시각적인 선일 때 true. role="none" + aria-hidden 이 붙어 접근성 트리에서 빠집니다. 기본값 false 는 의미 있는 구분선으로 role="separator"(가로형은 네이티브 )로 노출됩니다. |

## States

| State | Contract |
| --- | --- |
| variant | divider visual weight. @default "normal" |

## 정량 규칙

| Subject | Rule |
| --- | --- |
| --color-semantic-label-alternative | light: rgba(55, 56, 60, 0.74); dark: rgba(174, 176, 182, 0.74) |
| --fw-semibold | 600 |
| --label2-size | 13px |
| --space-3-5 | 14px |

## Responsive

- Use vertical only inside horizontal groups where the parent controls height.

## Content and writing

- Use label for "or" style separators between equivalent actions.

## Accessibility

- 목록의 행 구분선은 대부분 장식입니다. 리스트 시맨틱(ul/li)이 이미 경계를 알려주므로, 행마다 role="separator" 를 노출하면 스크린리더가 "구분자"를 항목 수만큼 반복해서 읽습니다. ListCell 의 divider prop 은 이 이유로 이미 aria-hidden 인 장식선입니다.
- 가로형 기본 Divider 는 네이티브 이므로 role="separator" 를 다시 선언하지 않습니다(중복 role). 세로형은 이라 role="separator" + aria-orientation="vertical" 을 명시합니다.
- label 이 있는 구분선은 separator 의 자식이 presentational 이라 라벨 텍스트가 이름으로 읽히지 않습니다. 문자열 label 은 aria-label 로 함께 노출합니다.
- | | 기본 (decorative 없음) | decorative | | --- | --- | --- | | 노출 | role="separator" (가로형은 네이티브 의 암시적 role) | role="none" + aria-hidden | | 의미 | "여기서 콘텐츠 주제가 바뀝니다" | 없음 — 순수 시각 리듬 | | 쓰는 곳 | 문서 섹션 경계, 메뉴의 그룹 경계, 서로 다른 성격의 액션 묶음 사이 | 카드 내부 장식선, 이미 ul/li·heading 으로 구조가 잡힌 목록의 행 사이, 반복 리듬용 얇은 선 |.

## Related components

| Component | Relationship |
| --- | --- |
| `AspectRatio` | 대표 시나리오에서 조합 |
| `Center` | 대표 시나리오에서 조합 |
| `Cluster` | 대표 시나리오에서 조합 |
| `Col` | 대표 시나리오에서 조합 |
| `Columns` | 대표 시나리오에서 조합 |
| `Container` | 대표 시나리오에서 조합 |
| `Grid` | 대표 시나리오에서 조합 |
| `MobileSystemBars` | 대표 시나리오에서 조합 |

## Examples

### 기본 조합

```jsx
<Divider />
<Divider variant="thick" />
<Divider decorative />
<span>A</span><Divider vertical /><span>B</span>
```

## Tokens and API

### Tokens

- `--color-semantic-label-alternative`
- `--component-divider-color-normal`
- `--component-divider-color-thick`
- `--component-divider-thickness-normal`
- `--component-divider-thickness-thick`
- `--font-sans`
- `--fw-semibold`
- `--label2-size`
- `--space-3-5`

### Source contracts

- `components/content/Divider.jsx`
- `components/content/Divider.d.ts`
- `components/content/Divider.prompt.md`
- `stories/LayoutDivider.stories.jsx`

## Sources

- Divider prompt contract: `components/content/Divider.prompt.md`
- Storybook implementation evidence: `stories/LayoutDivider.stories.jsx`
