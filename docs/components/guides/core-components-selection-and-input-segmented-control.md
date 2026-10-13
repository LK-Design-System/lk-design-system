# Segmented Control

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Core / Selection and Input |
| Owner | `SegmentedControl` |
| Storybook | `LDS Core/Components/Selection and Input/Segmented Control` |
| Source | `../component-content.json#core-components-selection-and-input-segmented-control` |

동시에 하나만 활성화되는 25개의 짧고 대등한 보기에 사용하세요. 서로 독립적인 기능을 실행하는 버튼 묶음에는 Toggle Button이 더 적합합니다.

## Anatomy

| Part | Contract |
| --- | --- |
| interaction | Group evidence state. inactive disables every option; prefer disabled in product code. |
| aria-label | Accessible name for the mutually exclusive option group. |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `options` | `SegmentOption[]` | Yes |  |
| `value` | `string` | No |  |
| `defaultValue` | `string` | No |  |
| `onChange` | `(value: string) = void` | No |  |
| `variant` | `'solid' \| 'outlined'` | No |  |
| `size` | `'sm' \| 'md' \| 'lg' \| 'small' \| 'medium' \| 'large'` | No |  |
| `interaction` | `'normal' \| 'inactive' \| 'hovered' \| 'focused' \| 'active' \| 'active-focused'` | No | Group evidence state. inactive disables every option; prefer disabled in product code. |
| `full` | `boolean` | No |  |
| `resize` | `'fill' \| 'hug'` | No |  |
| `disabled` | `boolean` | No |  |
| `disable` | `boolean` | No |  |
| `aria-label` | `string` | No | Accessible name for the mutually exclusive option group. |
| `classNames` | `LdsClassNames` | No |  |
| `styles` | `LdsStyles` | No |  |
| `vars` | `LdsVars` | No |  |

## States

| State | Contract |
| --- | --- |
| interaction | Group evidence state. inactive disables every option; prefer disabled in product code. |

## Behavior and interaction

- 실행 중 root·조상의 dir, class, style 속성이 바뀌면 같은 측정 함수를 다시 실행합니다. 따라서 LdsProvider나 DOM/CSS scope가 렌더 없이 방향을 바꾸고 각 segment의 크기가 그대로여도 선택면이 새 위치를 따릅니다. 관찰은 해당 조상 경로의 세 속성에 한정하며 cleanup에서 해제합니다.
- prefers-reduced-motion: reduce에서는 scoped guard가 transition 시간·지연만 0으로 만듭니다. 선택 surface의 최종 transform, disabled 선택 표시, 텍스트와 radio 의미를 지우지 않습니다.
- 내부 선례: Switch의 위치 상태 단서와 Disclosure의 base timing을 재사용하며, 새로운 spring·bounce·브랜드 색·모서리 token을 만들지 않습니다. Core interaction 저작이며 제품의 route·filter 실행·권한 정책은 소비자가 소유합니다.
- 외부 근거: WAI-ARIA Radio Group Pattern의 하나의 선택과 로빙 키보드 의미를 유지합니다. WCAG 2.2 Animation from Interactions은 비필수 움직임을 끌 수 있도록 요구하므로 reduced-motion에서 보간을 생략합니다. 이동 속도와 shared surface의 형태는 이 두 문서가 정한 값이 아니라 기존 LDS token을 사용한 LDS 결정입니다.
- 검증: 기존 SegmentedKeyboardContract가 controlled 값의 즉시 갱신, 빠른 연속 선택, 긴 label/count, resize, RTL, disabled 선택과 reduced-motion endpoint를 함께 확인합니다.

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 명시 규칙 1 | size sm\|md\|lg는 전체 track 외곽 높이 32/40/48px입니다. Solid의 내부 padding과 Outlined의 border가 이 높이에 더해지지 않습니다. full은 컨테이너 폭까지 늘림. |
| 명시 규칙 2 | 상호 배타적인 2–4개의 짧은 뷰에 쓰세요. 옵션이 많거나 길거나 실제 페이지 내비게이션에는 Tabs를 쓰세요. |
| 명시 규칙 3 | WDS 내부 Segmented Control/Segmented Control component-set(16215:35115)의 직접 축은 Variant(Solid/Outlined), Size(Small/Medium/Large), Icon(False/True)뿐입니다. interaction은 공용 API 축이 아니라 상태 증거 호환값입니다. |
| 명시 규칙 4 | aria-checked, 제어형 value, onChange와 로빙 초점은 즉시 갱신됩니다. surface의 위치·너비만 --dur-base와 --ease-out으로 연속성을 보여줍니다(default 200ms, ops 160ms). 연속 선택은 CSS transition의 현재 위치에서 최신 선택으로 향하며 callback을 기다리거나 다시 실행하지 않습니다. |
| --body1-size | {"fontSize":"16px","lineHeight":"24px","letterSpacing":"0.0057em"} |

## Responsive

- ButtonGroup의 단일 선택 모드는 이 컴포넌트를 조합합니다. 따라서 높이·disabled·roving 규칙을 ButtonGroup에서 별도로 다시 만들지 않습니다.
- Solid의 실제 선택은 하나의 장식 surface가 segment의 위치와 너비로 이동해 표시합니다. 이전 색·모서리·그림자 값을 유지하며, 새 public prop이나 stable part를 추가하지 않습니다. Outlined와 강제 interaction matrix의 정적 표시는 기존 시각 문법을 유지합니다.
- ResizeObserver가 track과 segment 크기를 관찰하므로 좁은 폭, count, font/label 변경 뒤에도 실제 선택 위치에 맞습니다. 긴 label은 시각적으로 말줄임하되 전체 텍스트와 count는 접근 이름에 남습니다. RTL도 물리 좌표로 surface를 측정하며 Left/Right는 미러된 방향, Up/Down과 Home/End는 기존 논리 순서를 따릅니다.

## Content and writing

- ref, className, and style target the radiogroup root.
- Stable parts are root, segment, icon, label, and count; each segment exposes data-state="checked|unchecked" and data-disabled.
- options — 문자열 또는 { value, label, icon, count, disabled }. count는 단일 선택 필터를 고르기 전에 값별 결과 건수를 비교해야 할 때 사용하며 라디오의 접근 가능한 이름과 함께 읽힙니다. value / defaultValue / onChange — 제어/비제어.
- 선택된 segment의 paint를 styles.segment나 option.style로 바꾸거나 classNames.segment·선택 option의 className을 지정하면 기존 버튼 자체가 선택 paint를 소유합니다. background·border/radius·boxShadow·opacity·filter/mask/clip·visibility·segment-local custom property를 장식면에 복사하지 않아 inline 우선순위, class의 상태 selector와 초점 paint를 보존합니다.

## Accessibility

- Geometry overrides are limited to the documented --lds-segmented-control- variables. Selection state and keyboard semantics stay owned by the component.
- SegmentedControl is a named radiogroup, not a tablist: each segment is a radio with one roving tab stop. Arrow keys wrap across enabled segments; Home and End choose the first and last enabled segment.
- 옵션별 표준 비활성 API는 disabled입니다. disable과 interaction="inactive"는 기존 증거 matrix를 위한 호환 별칭이며, 모두 native disabled + aria-disabled로 수렴하고 로빙 탐색에서 제외됩니다. 그룹의 disabled도 모든 segment에 같은 계약을 적용합니다.
- Use it for a small set of mutually exclusive views or modes. Use Tabs only when each label owns a distinct tab panel.
- Reference basis: WAI-ARIA Radio Group pattern and Apple Segmented controls.

## Related components

| Component | Relationship |
| --- | --- |
| `Button` | 대표 시나리오에서 조합 |
| `Icon` | 대표 시나리오에서 조합 |
| `Checkbox` | 대표 시나리오에서 조합 |
| `CheckboxGroup` | 대표 시나리오에서 조합 |
| `FilterChip` | 대표 시나리오에서 조합 |
| `MultiSelectChip` | 대표 시나리오에서 조합 |
| `Radio` | 대표 시나리오에서 조합 |
| `RadioGroup` | 대표 시나리오에서 조합 |

## Examples

### 기본 조합

```jsx
<SegmentedControl options={['KR', 'EN']} defaultValue="KR" onChange={setLang} />
<SegmentedControl full options={[{value:'list',label:'리스트'},{value:'grid',label:'그리드'}]} />
<SegmentedControl aria-label="상태 필터" options={[{value:'all',label:'전체',count:12},{value:'active',label:'진행 중',count:8}]} defaultValue="all" />
```

## Tokens and API

### Tokens

- `--body1-size`
- `--color-semantic-background-elevated-normal`
- `--color-semantic-fill-normal`
- `--color-semantic-fill-strong`
- `--color-semantic-focus-ring`
- `--color-semantic-label-alternative`
- `--color-semantic-label-disable`
- `--color-semantic-label-neutral`
- `--color-semantic-label-normal`
- `--color-semantic-line-solid-normal`
- `--color-semantic-primary-surface-strong`
- `--dur-base`
- `--dur-fast`
- `--ease-out`
- `--font-sans`
- `--fw-bold`
- `--fw-medium`
- `--fw-semibold`
- `--headline2-size`
- `--label1-size`
- `--lds-segmented-control-gap`
- `--lds-segmented-control-height`
- `--lds-segmented-control-padding`
- `--lds-segmented-control-radius`
- `--lds-segmented-control-segment-radius`
- `--radius-10`
- `--radius-8`
- `--radius-md`
- `--radius-sm`
- `--shadow-xs`

### Source contracts

- `components/selection/SegmentedControl.jsx`
- `components/selection/SegmentedControl.d.ts`
- `components/selection/SegmentedControl.prompt.md`
- `stories/SelectionSegmentedControl.stories.jsx`

## Sources

- SegmentedControl prompt contract: `components/selection/SegmentedControl.prompt.md`
- Storybook implementation evidence: `stories/SelectionSegmentedControl.stories.jsx`
- [WAI-ARIA Radio Group pattern](https://www.w3.org/WAI/ARIA/apg/patterns/radio/)
- [Apple Segmented controls](https://developer.apple.com/design/human-interface-guidelines/segmented-controls)
- [WAI-ARIA Radio Group Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/radio/)
- [WCAG 2.2 Animation from Interactions](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html)
