# FAB

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Core / Action |
| Owner | `Fab` |
| Storybook | `LDS Core/Components/Action/FAB` |
| Source | `../component-content.json#core-components-action-fab` |

목록이나 캔버스 위에서 지속적으로 접근해야 하는 단일 최우선 생성 액션에 적합합니다. 같은 우선순위의 작업이 여러 개이거나 일반 도구 모음에는 FAB 대신 Button, Toolbar 또는 Speed Dial을 사용하세요.

## 사용 판단

### 사용하지 않음

- hover/pressed는 색조만 잔잔하게 바뀌며 위치, scale, 그림자 깊이는 변하지 않습니다.

## Anatomy

| Part | Contract |
| --- | --- |
| label | 접근성 이름(필수 — 아이콘 전용). 누락 시 development 빌드에서 console 경고. |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `variant` | `'signal' \| 'dark' \| 'primary' \| 'secondary' \| 'white'` | No |  |
| `size` | `'sm' \| 'md' \| 'lg'` | No | 지름: sm 48 · md 56 · lg 64. @default "md" |
| `label` | `string` | Yes | 접근성 이름(필수 — 아이콘 전용). 누락 시 development 빌드에서 console 경고. |
| `type` | `'button' \| 'submit' \| 'reset'` | No | 폼 안에서 의도치 않은 제출을 막기 위해 기본값은 button입니다. |
| `children` | `React.ReactNode` | No |  |

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 명시 규칙 1 | variant signal · dark · primary · secondary · white. size sm 48 · md 56 · lg 64. 항상 label을 전달하세요. 누락하면 development 빌드에서 console 경고가 출력됩니다(production 번들에서는 제거됨). |
| 명시 규칙 2 | md 56px 원형과 disable 축은 WDS Button/Floating Action Button 기준입니다. 추가 크기와 palette는 LDS 확장입니다. |
| --color-semantic-background-elevated-normal | light: #FFFFFF; dark: #212225 |
| --color-semantic-inverse-background | light: #1B1C1E; dark: #FFFFFF |
| --color-semantic-inverse-label | light: #FFFFFF; dark: #171719 |

## Accessibility

- 나머지 props({...rest})는 Button·IconButton과 동일하게 가장 먼저 펼쳐집니다. type, aria-label, disabled, 이벤트 핸들러 같은 컴포넌트 계약은 consumer prop이 덮어쓸 수 없습니다(type은 명시적으로 전달하면 존중됩니다).
- Native disabled는 focus에서 제외되고, aria-disabled="true"는 focus를 유지하면서 같은 unavailable 스타일과 activation 차단을 적용합니다.
- WAI-ARIA Button Pattern의 accessible name과 keyboard activation 계약을 따릅니다.

## Related components

| Component | Relationship |
| --- | --- |
| `Icon` | 대표 시나리오에서 조합 |
| `ActionArea` | 대표 시나리오에서 조합 |
| `Button` | 대표 시나리오에서 조합 |
| `IconButton` | 대표 시나리오에서 조합 |
| `TextButton` | 대표 시나리오에서 조합 |
| `ToggleIcon` | 대표 시나리오에서 조합 |

## Examples

### 기본 조합

```jsx
<Fab label="문의 보내기"><Icon name="send" /></Fab>
<Fab variant="dark" size="lg" label="새 항목"><Icon name="plus" /></Fab>
```

## Tokens and API

### Tokens

- `--color-semantic-background-elevated-normal`
- `--color-semantic-inverse-background`
- `--color-semantic-inverse-label`
- `--color-semantic-label-normal`
- `--color-semantic-line-solid-normal`
- `--color-semantic-primary-normal`
- `--color-semantic-secondary-normal`
- `--color-semantic-static-white`
- `--component-button-disabled-bg`
- `--component-button-disabled-fg-outlined`
- `--component-button-disabled-outlined-border`
- `--component-button-transition`
- `--shadow-accent`
- `--shadow-indigo`
- `--shadow-md`

### Source contracts

- `components/buttons/Fab.jsx`
- `components/buttons/Fab.d.ts`
- `components/buttons/Fab.prompt.md`
- `stories/ActionFab.stories.jsx`

## Sources

- Fab prompt contract: `components/buttons/Fab.prompt.md`
- Storybook implementation evidence: `stories/ActionFab.stories.jsx`
- [WAI-ARIA Button Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/button/)
