# Card Selection

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Core / Selection and Input |
| Owner | `ChoiceCard` |
| Storybook | `LDS Core/Components/Selection and Input/Card Selection` |
| Source | `../component-content.json#core-components-selection-and-input-card-selection` |

제목, 설명, 아이콘을 함께 읽어야 올바른 결정을 할 수 있는 플랜·구성 선택에 적합합니다. 짧은 라벨만으로 비교할 수 있다면 이 카드 대신 Radio나 Checkbox가 더 간결합니다.

## Anatomy

| Part | Contract |
| --- | --- |
| inputValue | Native form value associated with this option. |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `selected` | `boolean` | No |  |
| `disabled` | `boolean` | No |  |
| `multiple` | `boolean` | No | Uses native checkbox semantics instead of radio semantics. |
| `onSelect` | `(next: boolean) = void` | No | Called with true for a radio choice, or the next checked state for a checkbox choice. |
| `name` | `string` | No | Shared native radio-group name. Required for related single-select cards. |
| `inputValue` | `string` | No | Native form value associated with this option. |
| `inputProps` | `Omit, 'type' \| 'checked' \| 'disabled' \| 'name' \| 'value'` | No |  |
| `title` | `React.ReactNode` | No |  |
| `description` | `React.ReactNode` | No |  |
| `icon` | `React.ReactNode` | No |  |
| `presentation` | `'choice' \| 'frame'` | No |  |
| `status` | `'normal' \| 'negative'` | No |  |
| `interaction` | `'normal' \| 'hovered' \| 'focused'` | No |  |
| `radius` | `'sm' \| 'md' \| 'lg' \| 'xl'` | No |  |
| `padding` | `'sm' \| 'md' \| 'lg' \| 'xl'` | No | Tokenized inner padding for both presentations. compact component scope에서는 기본 sm(12px), 그 밖에서는 md(16px)이며 명시값이 우선합니다. |
| `shadow` | `'none' \| 'xs' \| 'sm' \| 'md' \| 'lg'` | No |  |
| `showIndicator` | `boolean` | No |  |
| `children` | `React.ReactNode` | No |  |

## Behavior and interaction

- Selection semantics and reference basis.

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 명시 규칙 1 | 밀도 계약 — padding은 choice와 frame 표현에 동일하게 적용됩니다. 일반 표면의 기본 md는 --space-4(16px), bounded compact component scope의 기본 sm은 --space-3(12px)이며 명시값이 우선합니다. 표준 제목과 설명은 각각 --body2-line과 --label2-line을 명시해 Drawer 같은 상위 컨테이너의 큰 line-height를 상속하지 않습니다. |
| 명시 규칙 2 | 이름과 설명 분리 — 내부 input은 더 이상 aria-label={title}로 감싼 을 덮어쓰지 않습니다. title 요소가 aria-labelledby로 이름을 제공하고, description은 aria-describedby 힌트로 연결됩니다(GOV.UK hint 관례). 이전에는 aria-label={title}이 전체 텍스트를 덮어써 description이 이름에도 설명에도 도달하지 못했고, title이 문자열이 아니면 이름 자체가 사라졌습니다. 지금은 요소 id를 참조하므로 title이 ReactNode여도 동작합니다. |
| 명시 규칙 3 | WDS 내부 Framed Style/Framed Style component-set(16736:173366)은 Selected, Disabled, Status를 직접 교차합니다. presentation="frame"은 이 축을 소유하고, 일반 choice presentation은 같은 disabled+selected 문법을 native Radio/Checkbox indicator에 적용합니다. |
| --body2-line | 22px |
| --body2-size | 15px |

## Responsive

- The single-select indicator is a radio dot; the multi-select indicator is a check mark. Titles, descriptions, and indicators must remain readable at narrow widths.

## Content and writing

- 선택된 카드가 비활성화되어도 checked 상태는 사라지지 않습니다. native Radio와 같은 규칙으로 primary border/fill/icon/text를 제거하고, 중립 frame과 비활성 전경·중심 점 또는 check만 남겨 현재 값과 사용 불가 상태를 동시에 전달합니다.
- title/description/icon은 표준 레이아웃; 완전히 커스텀하려면 그 대신 children을 전달. multiple이면 인디케이터가 체크박스 사각형으로 바뀜(기본은 원형 라디오). 옵션 그리드/설정 선택에.
- inputValue — 내부 input의 value. inputProps — 내부 input에 전달할 표준 속성(type·checked·name·value 등 예약 속성 제외).
- 형제 비교: Radio는 disabled+checked에서 중립 표면과 비활성 중심 점을 유지하고, Checkbox도 primary 대신 중립 checked 채움을 사용합니다. ChoiceCard는 이 규칙을 카드 border, 아이콘, 제목/설명, trailing indicator 전체에 일관되게 확장합니다.

## Accessibility

- Interactive single-select cards contain native radios and share name; clicking an already selected card does not clear the group. multiple cards contain native checkboxes and toggle independently. Static cards without a handler do not enter the tab order or claim selection roles.
- Native choice cards do not invent an Enter shortcut: Space changes the focused radio/checkbox and radio groups use the browser's native arrow-key behavior. A consumer that intentionally supplies a non-native custom selection role owns its separate Enter/Space contract.
- Reference basis: WAI-ARIA Radio Group pattern, GOV.UK Checkboxes, and Carbon Tile accessibility.
- ChoiceCard — 선택형 프레임 옵션 타일. 선택 시 애저 링 + 틴트로 강조되는 라디오(단일) 또는 체크박스(multiple, 다중) 선택 카드. 포인터 클릭과 native radio/checkbox의 Space 입력으로 선택합니다.

## Related components

| Component | Relationship |
| --- | --- |
| `Icon` | 대표 시나리오에서 조합 |
| `Card` | 대표 시나리오에서 조합 |

## Examples

### 기본 조합

```jsx
<ChoiceCard title="기본 플랜" description="표준 설정으로 시작" icon={<Icon name="document" />}
  selected={plan === 'basic'} onSelect={() => setPlan('basic')} />
<ChoiceCard multiple title="검토 포함" selected={opts.review} onSelect={(v) => setOpt('review', v)} />
```

## Tokens and API

### Tokens

- `--body2-line`
- `--body2-size`
- `--color-semantic-background-elevated-normal`
- `--color-semantic-fill-normal`
- `--color-semantic-focus-ring`
- `--color-semantic-label-disable`
- `--color-semantic-label-neutral`
- `--color-semantic-label-normal`
- `--color-semantic-label-strong`
- `--color-semantic-line-normal-neutral`
- `--color-semantic-line-normal-normal`
- `--color-semantic-line-solid-normal`
- `--color-semantic-primary-normal`
- `--color-semantic-primary-surface-normal`
- `--color-semantic-primary-surface-strong`
- `--color-semantic-static-white`
- `--color-semantic-status-negative`
- `--dur-fast`
- `--ease-out`
- `--fw-bold`
- `--label2-line`
- `--label2-size`
- `--radius-frame-lg`
- `--radius-frame-md`
- `--radius-frame-sm`
- `--radius-frame-xl`
- `--radius-sm`
- `--radius-xl`
- `--shadow-lg`
- `--shadow-md`
- `--shadow-sm`
- `--shadow-xs`
- `--space-1`
- `--space-3`
- `--space-4`
- `--space-5`
- `--space-6`

### Source contracts

- `components/selection/ChoiceCard.jsx`
- `components/selection/ChoiceCard.d.ts`
- `components/selection/ChoiceCard.prompt.md`
- `stories/SelectionStatus.stories.jsx`

## Sources

- ChoiceCard prompt contract: `components/selection/ChoiceCard.prompt.md`
- Storybook implementation evidence: `stories/SelectionStatus.stories.jsx`
- [WAI-ARIA Radio Group pattern](https://www.w3.org/WAI/ARIA/apg/patterns/radio/)
- [GOV.UK Checkboxes](https://design-system.service.gov.uk/components/checkboxes/)
- [Carbon Tile accessibility](https://carbondesignsystem.com/components/tile/accessibility/)
