# Theme Toggle

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Theme / Controls |
| Owner | `ThemeToggle` |
| Storybook | `LDS Theme/Controls/Theme Toggle` |
| Source | `../component-content.json#theme-controls-theme-toggle` |

사용자에게 명시적인 appearance 선택권을 제공하는 설정 표면에 적합합니다. 단순 장식 전환이나 일시적인 상태 표시에는 사용하지 않으며, 테마 변경 뒤에도 레이블·포커스·선택 상태가 분명해야 합니다.

## 사용 판단

### 사용

- 애플리케이션에서 theme·direction·Portal 정책을 함께 구동할 때는 LdsProvider를 runtime의 단일 소유자로 두고 useLdsRuntime()의 colorScheme/setColorScheme를 이 control에 연결합니다. 이 경우 ThemeToggle target={null} persist={false}로 중복 DOM mutation과 storage write를 막습니다. CSS-only 소비자는 기존처럼 Provider 없이 사용할 수 있습니다.

## Anatomy

| Part | Contract |
| --- | --- |
| showLabels | 각 아이콘 옆에 텍스트 라벨 표시. @default true |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `target` | `HTMLElement \| string \| null` | No | [data-theme]를 설정할 요소(또는 CSS 셀렉터). null = 변경만 보고하고 DOM은 건드리지 않음. @default document.documentElement |
| `storageKey` | `string` | No | 선택을 저장하는 데 쓰는 localStorage 키. @default "lk-theme" |
| `options` | `ThemeMode[]` | No | 제공할 모드(순서대로). @default ["light","dark","auto"] |
| `value` | `ThemeMode` | No | 제어되는 값. |
| `defaultValue` | `ThemeMode` | No | 비제어 시 초기 값(저장된 선택이 있으면 우선). @default "light" |
| `onChange` | `(theme: ThemeMode) = void` | No | 선택된 모드와 함께 호출. |
| `size` | `'sm' \| 'md'` | No |  |
| `showLabels` | `boolean` | No | 각 아이콘 옆에 텍스트 라벨 표시. @default true |
| `persist` | `boolean` | No | 선택을 localStorage에 저장(그리고 마운트 시 복원). @default true |

## Behavior and interaction

- 테마를 구동하는 세그먼트형 Light / Dark / Auto 스위치. 대상 요소(기본 )에 [data-theme]를 설정하고 선택을 localStorage에 저장해, 어떤 페이지든 그 자리에서 테마를 바꿀 수 있습니다; auto는 OS를 따릅니다.

## 정량 규칙

| Subject | Rule |
| --- | --- |
| --color-semantic-background-elevated-normal | light: #FFFFFF; dark: #212225 |
| --color-semantic-fill-normal | light: rgba(112, 115, 124, 0.08); dark: rgba(112, 115, 124, 0.22) |
| --color-semantic-label-alternative | light: rgba(55, 56, 60, 0.74); dark: rgba(174, 176, 182, 0.74) |
| --color-semantic-line-normal-normal | light: rgba(112, 115, 124, 0.22); dark: rgba(112, 115, 124, 0.32) |

## Related components

| Component | Relationship |
| --- | --- |
| `Button` | 대표 시나리오에서 조합 |
| `LdsProvider` | 대표 시나리오에서 조합 |
| `Popover` | 대표 시나리오에서 조합 |
| `LdsColorSchemeScript` | 대표 시나리오에서 조합 |
| `LdsRuntimeContext` | 대표 시나리오에서 조합 |
| `createLocalStorageManager` | 대표 시나리오에서 조합 |
| `useLdsRuntime` | 대표 시나리오에서 조합 |

## Examples

### 기본 조합

```jsx
// 페이지 전체를 구동하고 선택을 기억:
<ThemeToggle defaultValue="light" />

// 한 영역만 테마링, 제어형:
<ThemeToggle target="#preview" value={mode} onChange={setMode} showLabels={false} size="sm" />
```

## Tokens and API

### Tokens

- `--color-semantic-background-elevated-normal`
- `--color-semantic-fill-normal`
- `--color-semantic-label-alternative`
- `--color-semantic-line-normal-normal`
- `--color-semantic-primary-normal`
- `--component-button-transition`
- `--font-sans`
- `--fw-bold`
- `--radius-pill`
- `--shadow-xs`
- `--space-1`

### Source contracts

- `components/selection/ThemeToggle.jsx`
- `components/selection/ThemeToggle.d.ts`
- `components/selection/ThemeToggle.prompt.md`
- `stories/SelectionThemeToggle.stories.jsx`

## Sources

- ThemeToggle prompt contract: `components/selection/ThemeToggle.prompt.md`
- Storybook implementation evidence: `stories/SelectionThemeToggle.stories.jsx`
