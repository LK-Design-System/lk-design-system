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

- 서로 배타적인 상위 분류를 한 줄에서 오가며 현재 선택을 계속 보여줘야 할 때 적합합니다. 단계 이동에는 Tabs를, 많은 옵션이나 폼 값 선택에는 Select를 사용하고, 단순 필터가 여러 개 동시에 적용되는 경우에는 Chip이나 별도 필터 패턴을 사용하세요.
- Use for horizontal topic/category navigation. Use Tabs for section switching with an underline.
- Category - WDS navigation chip group for separating content by topic.
- Category가 소유하는 Navigation 의미와 상태를 여러 제품 화면에서 동일하게 재사용할 때 사용합니다.

### 사용하지 않음

- 단일 선택 라디오그룹 시맨틱: 컨테이너는 role="radiogroup"(ariaLabel, 기본값 카테고리), 칩은 role="radio" + aria-checked입니다. 선택된 칩(없으면 첫 활성 칩)만 Tab 스톱이 되고, Arrow Left/Right·Up/Down은 포커스 이동과 동시에 선택하며(APG 라디오 동작), Home/End는 첫·마지막 활성 칩으로 이동합니다. 비활성 칩은 건너뜁니다.
- item.active는 비제어 모드의 초기 선택 시드로만 사용됩니다. 렌더 시점에 선택을 강제하지 않으므로 두 칩이 동시에 aria-checked가 되는 일이 없습니다.
- - Use for horizontal topic/category navigation. Use Tabs for section switching with an underline. - WDS axes: variant, size, padding, verticalPadding, and horizontal scroll. - 단일 선택 라디오그룹 시맨틱: 컨테이너는 role="radiogroup"(ariaLabel, 기본값 카테고리), 칩은 role="radio" + aria-checked입니다. 선택된 칩(없으면 첫 활성 칩)만 Tab 스톱이 되고, Arrow Left/Rig….
- Category가 소유하지 않는 라우팅, 권한, 데이터 요청, 제품 임계값을 컴포넌트 내부에 넣지 않습니다.

## Anatomy

| Part | Contract |
| --- | --- |
| Root | Category의 semantic role, layout containment와 전달받은 DOM 속성을 소유합니다. |
| Aria Label | Accessible name of the radiogroup container. @default "카테고리" |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `items` | `CategoryItem[]` | Yes | 공개 타입 계약에 정의된 속성입니다. |
| `value` | `string` | No | 공개 타입 계약에 정의된 속성입니다. |
| `defaultValue` | `string` | No | 공개 타입 계약에 정의된 속성입니다. |
| `onChange` | `(value: string, item: Exclude) = void` | No | 공개 타입 계약에 정의된 속성입니다. |
| `variant` | `"normal" \| "alternative"` | No | variant axis. @default "normal" |
| `size` | `"small" \| "sm" \| "medium" \| "md" \| "large" \| "lg" \| "xlarge" \| "xl"` | No | size axis: small 24, medium 32, large 36, xlarge 40. @default "medium" |
| `padding` | `boolean` | No | horizontal padding axis. @default false |
| `verticalPadding` | `boolean` | No | verticalPadding axis. @default false |
| `scroll` | `"auto" \| boolean` | No | scroll axis. @default "auto" |
| `ariaLabel` | `string` | No | Accessible name of the radiogroup container. @default "카테고리" |
| `itemStyle` | `React.CSSProperties` | No | 공개 타입 계약에 정의된 속성입니다. |

## States

| State | Contract |
| --- | --- |
| variant | variant axis. @default "normal" 타입 계약: "normal" \| "alternative" |

## Behavior and interaction

- Use for horizontal topic/category navigation. Use Tabs for section switching with an underline.
- WDS axes: variant, size, padding, verticalPadding, and horizontal scroll.
- 단일 선택 라디오그룹 시맨틱: 컨테이너는 role="radiogroup"(ariaLabel, 기본값 카테고리), 칩은 role="radio" + aria-checked입니다. 선택된 칩(없으면 첫 활성 칩)만 Tab 스톱이 되고, Arrow Left/Right·Up/Down은 포커스 이동과 동시에 선택하며(APG 라디오 동작), Home/End는 첫·마지막 활성 칩으로 이동합니다. 비활성 칩은 건너뜁니다.
- item.active는 비제어 모드의 초기 선택 시드로만 사용됩니다. 렌더 시점에 선택을 강제하지 않으므로 두 칩이 동시에 aria-checked가 되는 일이 없습니다.
- - Use for horizontal topic/category navigation. Use Tabs for section switching with an underline. - WDS axes: variant, size, padding, verticalPadding, and horizontal scroll. - 단일 선택 라디오그룹 시맨틱: 컨테이너는 role="radiogroup"(ariaLabel, 기본값 카테고리), 칩은 role="radio" + aria-checked입니다. 선택된 칩(없으면 첫 활성 칩)만 Tab 스톱이 되고, Arrow Left/Rig….

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 명시 규칙 1 | 타입 스케일 정합: small/sm 칩 12.5px → --label2-size(13px)로 스냅했습니다. md(14)/lg(15)와 함께 13/14/15의 깔끔한 사이즈 프로그레션을 이룹니다. |
| 명시 규칙 2 | - Use for horizontal topic/category navigation. Use Tabs for section switching with an underline. - WDS axes: variant, size, padding, verticalPadding, and horizontal scroll. - 단일 선택 라디오그룹 시맨틱: 컨테이너는 role="radiogroup"(ariaLabel, 기본값 카테고리), 칩은 role="radio" + aria-checked입니다. 선택된 칩(없으면 첫 활성 칩)만 Tab 스톱이 되고, Arrow Left/Rig… |
| --body2-size | 15px |
| --color-semantic-background-elevated-normal | light: #FFFFFF; dark: #212225 |
| --color-semantic-inverse-label | light: #FFFFFF; dark: #171719 |

## Responsive

- 320px 좁은 폭과 200% 텍스트 확대에서 페이지 가로 overflow 없이 의미 순서를 유지합니다.
- 고정 폭보다 부모 containment와 wrapping을 우선하고, 제품이 필요할 때 명시적으로 compact 표현을 선택합니다.

## Content and writing

- 단일 선택 라디오그룹 시맨틱: 컨테이너는 role="radiogroup"(ariaLabel, 기본값 카테고리), 칩은 role="radio" + aria-checked입니다. 선택된 칩(없으면 첫 활성 칩)만 Tab 스톱이 되고, Arrow Left/Right·Up/Down은 포커스 이동과 동시에 선택하며(APG 라디오 동작), Home/End는 첫·마지막 활성 칩으로 이동합니다. 비활성 칩은 건너뜁니다.
- 타입 스케일 정합: small/sm 칩 12.5px → --label2-size(13px)로 스냅했습니다. md(14)/lg(15)와 함께 13/14/15의 깔끔한 사이즈 프로그레션을 이룹니다.
- - Use for horizontal topic/category navigation. Use Tabs for section switching with an underline. - WDS axes: variant, size, padding, verticalPadding, and horizontal scroll. - 단일 선택 라디오그룹 시맨틱: 컨테이너는 role="radiogroup"(ariaLabel, 기본값 카테고리), 칩은 role="radio" + aria-checked입니다. 선택된 칩(없으면 첫 활성 칩)만 Tab 스톱이 되고, Arrow Left/Rig….
- 사용자에게 보이는 Category 문자열은 제품 번역 계층에서 제공하고 행동 또는 상태를 구체적으로 설명합니다.

## Accessibility

- 단일 선택 라디오그룹 시맨틱: 컨테이너는 role="radiogroup"(ariaLabel, 기본값 카테고리), 칩은 role="radio" + aria-checked입니다. 선택된 칩(없으면 첫 활성 칩)만 Tab 스톱이 되고, Arrow Left/Right·Up/Down은 포커스 이동과 동시에 선택하며(APG 라디오 동작), Home/End는 첫·마지막 활성 칩으로 이동합니다. 비활성 칩은 건너뜁니다.
- item.active는 비제어 모드의 초기 선택 시드로만 사용됩니다. 렌더 시점에 선택을 강제하지 않으므로 두 칩이 동시에 aria-checked가 되는 일이 없습니다.
- - Use for horizontal topic/category navigation. Use Tabs for section switching with an underline. - WDS axes: variant, size, padding, verticalPadding, and horizontal scroll. - 단일 선택 라디오그룹 시맨틱: 컨테이너는 role="radiogroup"(ariaLabel, 기본값 카테고리), 칩은 role="radio" + aria-checked입니다. 선택된 칩(없으면 첫 활성 칩)만 Tab 스톱이 되고, Arrow Left/Rig….
- native semantic을 우선하며 사용자에게 보이는 이름과 접근 가능한 이름이 같은 목적을 설명하게 합니다.
- 키보드 focus 순서, focus-visible 표시와 상태 ARIA가 시각 상태와 동시에 갱신되는지 공개 스토리에서 검증합니다.

## Do / Don't

| Kind | Guidance |
| --- | --- |
| Do | Use for horizontal topic/category navigation. Use Tabs for section switching with an underline. |
| Don't | 단일 선택 라디오그룹 시맨틱: 컨테이너는 role="radiogroup"(ariaLabel, 기본값 카테고리), 칩은 role="radio" + aria-checked입니다. 선택된 칩(없으면 첫 활성 칩)만 Tab 스톱이 되고, Arrow Left/Right·Up/Down은 포커스 이동과 동시에 선택하며(APG 라디오 동작), Home/End는 첫·마지막 활성 칩으로 이동합니다. 비활성 칩은 건너뜁니다. |
| Do | Category - WDS navigation chip group for separating content by topic. |
| Don't | item.active는 비제어 모드의 초기 선택 시드로만 사용됩니다. 렌더 시점에 선택을 강제하지 않으므로 두 칩이 동시에 aria-checked가 되는 일이 없습니다. |

## Exceptions

- 제품 정책을 포함해야 하는 예외는 wrapper 또는 제품 저장소에서 조합하고 Category의 범용 API에 넣지 않습니다.
- 접근성 또는 안전 계약을 약화하는 예외는 허용하지 않으며 필요한 차이는 prompt와 Storybook 증거에 기록합니다.

## Related components

| Component | Relationship |
| --- | --- |
| `PageIndicator` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `Pagination` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `Tabs` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |

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

### Source contracts

- `components/navigation/Category.jsx`
- `components/navigation/Category.d.ts`
- `components/navigation/Category.prompt.md`
- `stories/NavigationCategory.stories.jsx`

## Migration

- 현재 prompt와 타입 계약에 기록되지 않은 legacy alias는 새 코드에서 도입하지 않습니다.
- 대체 컴포넌트가 생기면 기존 API의 제거 버전, 대응 prop과 자동·수동 전환 절차를 이 페이지에 기록합니다.

## Sources

- Category prompt contract: `components/navigation/Category.prompt.md`
- Storybook implementation evidence: `stories/NavigationCategory.stories.jsx`
