# Category

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Core / Navigation |
| Owner | `Category` |
| Storybook | `LDS Core/Components/Navigation/Category` |
| Source | `../component-content.json#core-components-navigation-category` |

서로 배타적인 상위 분류를 한 줄에서 오가며 현재 선택을 계속 보여줘야 할 때 적합합니다. 단계 이동에는 Tabs를, 많은 옵션이나 폼 값 선택에는 Select를 사용하고, 단순 필터가 여러 개 동시에 적용되는 경우에는 Chip이나 별도 필터 패턴을 사용하세요.

## 사용 판단

### 사용

- Category - WDS navigation chip group for separating content by topic.

## Anatomy

| Part | Contract |
| --- | --- |
| ariaLabel | Accessible name of the radiogroup container. @default "카테고리" |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `items` | `CategoryItem[]` | Yes |  |
| `value` | `string` | No |  |
| `defaultValue` | `string` | No |  |
| `onChange` | `(value: string, item: Exclude) = void` | No |  |
| `variant` | `"normal" \| "alternative"` | No | variant axis. @default "normal" |
| `size` | `"small" \| "sm" \| "medium" \| "md" \| "large" \| "lg" \| "xlarge" \| "xl"` | No | size axis: small 24, medium 32, large 36, xlarge 40. @default "medium" |
| `padding` | `boolean` | No | horizontal padding axis. @default false |
| `verticalPadding` | `boolean` | No | verticalPadding axis. @default false |
| `scroll` | `"auto" \| boolean` | No | scroll axis. @default "auto" |
| `ariaLabel` | `string` | No | Accessible name of the radiogroup container. @default "카테고리" |
| `itemStyle` | `React.CSSProperties` | No |  |

## States

| State | Contract |
| --- | --- |
| variant | variant axis. @default "normal" |

## Behavior and interaction

- Use for horizontal topic/category navigation. Use Tabs for section switching with an underline.
- WDS axes: variant, size, padding, verticalPadding, and horizontal scroll.

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 명시 규칙 1 | 타입 스케일 정합: small/sm 칩 12.5px → --label2-size(13px)로 스냅했습니다. md(14)/lg(15)와 함께 13/14/15의 깔끔한 사이즈 프로그레션을 이룹니다. |
| --body2-size | 15px |
| --color-semantic-background-elevated-normal | light: #FFFFFF; dark: #212225 |
| --color-semantic-inverse-label | light: #FFFFFF; dark: #171719 |
| --color-semantic-label-neutral | light: rgba(46, 47, 51, 0.88); dark: rgba(194, 196, 200, 0.88) |

## Accessibility

- 단일 선택 라디오그룹 시맨틱: 컨테이너는 role="radiogroup"(ariaLabel, 기본값 카테고리), 칩은 role="radio" + aria-checked입니다. 선택된 칩(없으면 첫 활성 칩)만 Tab 스톱이 되고, Arrow Left/Right·Up/Down은 포커스 이동과 동시에 선택하며(APG 라디오 동작), Home/End는 첫·마지막 활성 칩으로 이동합니다. 비활성 칩은 건너뜁니다.
- item.active는 비제어 모드의 초기 선택 시드로만 사용됩니다. 렌더 시점에 선택을 강제하지 않으므로 두 칩이 동시에 aria-checked가 되는 일이 없습니다.

## Related components

| Component | Relationship |
| --- | --- |
| `PageIndicator` | 대표 시나리오에서 조합 |
| `Pagination` | 대표 시나리오에서 조합 |
| `Tabs` | 대표 시나리오에서 조합 |

## Examples

### 기본 조합

```jsx
<Category items={['All', 'Open', 'Done']} defaultValue="All" />
<Category variant="alternative" size="large" padding verticalPadding items={items} />
```

## Tokens and API

### Tokens

- `--body2-size`
- `--color-semantic-background-elevated-normal`
- `--color-semantic-inverse-label`
- `--color-semantic-label-neutral`
- `--color-semantic-label-normal`
- `--color-semantic-line-solid-normal`
- `--color-semantic-primary-normal`
- `--color-semantic-primary-surface-strong`
- `--dur-fast`
- `--ease-out`
- `--font-sans`
- `--fw-medium`
- `--label1-size`
- `--label2-size`
- `--space-1-5`
- `--space-2-5`

### Source contracts

- `components/navigation/Category.jsx`
- `components/navigation/Category.d.ts`
- `components/navigation/Category.prompt.md`
- `stories/NavigationCategory.stories.jsx`

## Sources

- Category prompt contract: `components/navigation/Category.prompt.md`
- Storybook implementation evidence: `stories/NavigationCategory.stories.jsx`
