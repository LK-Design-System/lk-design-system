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

- 사용자에게 명시적인 appearance 선택권을 제공하는 설정 표면에 적합합니다. 단순 장식 전환이나 일시적인 상태 표시에는 사용하지 않으며, 테마 변경 뒤에도 레이블·포커스·선택 상태가 분명해야 합니다.
- Theme Toggle가 소유하는 Controls 의미와 상태를 여러 제품 화면에서 동일하게 재사용할 때 사용합니다.
- 제품별 구현 대신 공개 ThemeToggle API와 semantic token으로 일관성을 유지해야 할 때 사용합니다.

### 사용하지 않음

- Theme Toggle가 소유하지 않는 라우팅, 권한, 데이터 요청, 제품 임계값을 컴포넌트 내부에 넣지 않습니다.
- 동일한 목적을 더 단순한 native 요소나 기존 LDS primitive로 해결할 수 있으면 새 조합을 만들지 않습니다.
- 표현이 비슷하다는 이유만으로 상태 의미가 다른 sibling 컴포넌트를 서로 대체하지 않습니다.

## Anatomy

| Part | Contract |
| --- | --- |
| Root | ThemeToggle의 semantic role, layout containment와 전달받은 DOM 속성을 소유합니다. |
| Show Labels | 각 아이콘 옆에 텍스트 라벨 표시. @default true |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `target` | `HTMLElement \| string \| null` | No | [data-theme]를 설정할 요소(또는 CSS 셀렉터). null = 변경만 보고하고 DOM은 건드리지 않음. @default document.documentElement |
| `storageKey` | `string` | No | 선택을 저장하는 데 쓰는 localStorage 키. @default "lk-theme" |
| `options` | `ThemeMode[]` | No | 제공할 모드(순서대로). @default ["light","dark","auto"] |
| `value` | `ThemeMode` | No | 제어되는 값. |
| `defaultValue` | `ThemeMode` | No | 비제어 시 초기 값(저장된 선택이 있으면 우선). @default "light" |
| `onChange` | `(theme: ThemeMode) = void` | No | 선택된 모드와 함께 호출. |
| `size` | `'sm' \| 'md'` | No | 공개 타입 계약에 정의된 속성입니다. |
| `showLabels` | `boolean` | No | 각 아이콘 옆에 텍스트 라벨 표시. @default true |
| `persist` | `boolean` | No | 선택을 localStorage에 저장(그리고 마운트 시 복원). @default true |

## States

| State | Contract |
| --- | --- |
| Default | 별도 상태 머신을 만들지 않으며 전달된 콘텐츠와 semantic token으로 기본 표현을 구성합니다. |

## Behavior and interaction

- 테마를 구동하는 세그먼트형 Light / Dark / Auto 스위치. 대상 요소(기본 )에 [data-theme]를 설정하고 선택을 localStorage에 저장해, 어떤 페이지든 그 자리에서 테마를 바꿀 수 있습니다; auto는 OS를 따릅니다.
- ThemeToggle의 controlled/uncontrolled 경계와 callback 순서는 공개 타입 계약을 따릅니다.
- 상태 변화 중에도 accessible name, focus 위치와 레이아웃 기준점을 예고 없이 잃지 않습니다.
- 제품 데이터와 side effect는 callback으로 위임하고 ThemeToggle는 표시·입력 상태만 소유합니다.

## 정량 규칙

| Subject | Rule |
| --- | --- |
| --color-semantic-background-elevated-normal | light: #FFFFFF; dark: #212225 |
| --color-semantic-fill-normal | light: rgba(112, 115, 124, 0.08); dark: rgba(112, 115, 124, 0.22) |
| --color-semantic-label-alternative | light: rgba(55, 56, 60, 0.74); dark: rgba(174, 176, 182, 0.74) |
| --color-semantic-line-normal-normal | light: rgba(112, 115, 124, 0.22); dark: rgba(112, 115, 124, 0.32) |

## Responsive

- 320px 좁은 폭과 200% 텍스트 확대에서 페이지 가로 overflow 없이 의미 순서를 유지합니다.
- 고정 폭보다 부모 containment와 wrapping을 우선하고, 제품이 필요할 때 명시적으로 compact 표현을 선택합니다.

## Content and writing

- 사용자에게 보이는 Theme Toggle 문자열은 제품 번역 계층에서 제공하고 행동 또는 상태를 구체적으로 설명합니다.
- 아이콘이나 색상만으로 의미를 대신하지 않고 필요한 label, title 또는 status text를 함께 제공합니다.

## Accessibility

- native semantic을 우선하며 사용자에게 보이는 이름과 접근 가능한 이름이 같은 목적을 설명하게 합니다.
- 키보드 focus 순서, focus-visible 표시와 상태 ARIA가 시각 상태와 동시에 갱신되는지 공개 스토리에서 검증합니다.
- 색상, 모양 또는 아이콘 하나만으로 상태를 구분하지 않고 이름·텍스트·semantic state를 함께 제공합니다.

## Do / Don't

| Kind | Guidance |
| --- | --- |
| Do | Theme Toggle가 소유하는 Controls 의미와 상태를 여러 제품 화면에서 동일하게 재사용할 때 사용합니다. |
| Don't | Theme Toggle가 소유하지 않는 라우팅, 권한, 데이터 요청, 제품 임계값을 컴포넌트 내부에 넣지 않습니다. |
| Do | 제품별 구현 대신 공개 ThemeToggle API와 semantic token으로 일관성을 유지해야 할 때 사용합니다. |
| Don't | 동일한 목적을 더 단순한 native 요소나 기존 LDS primitive로 해결할 수 있으면 새 조합을 만들지 않습니다. |

## Exceptions

- 제품 정책을 포함해야 하는 예외는 wrapper 또는 제품 저장소에서 조합하고 ThemeToggle의 범용 API에 넣지 않습니다.
- 접근성 또는 안전 계약을 약화하는 예외는 허용하지 않으며 필요한 차이는 prompt와 Storybook 증거에 기록합니다.

## Related components

| Component | Relationship |
| --- | --- |
| `ThemeToggle` | 독립적인 공개 컴포넌트이며 새로운 sibling을 만들기 전에 이 API 확장 가능성을 검토합니다. |

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

### Source contracts

- `components/selection/ThemeToggle.jsx`
- `components/selection/ThemeToggle.d.ts`
- `components/selection/ThemeToggle.prompt.md`
- `stories/SelectionThemeToggle.stories.jsx`

## Migration

- 현재 prompt와 타입 계약에 기록되지 않은 legacy alias는 새 코드에서 도입하지 않습니다.
- 대체 컴포넌트가 생기면 기존 API의 제거 버전, 대응 prop과 자동·수동 전환 절차를 이 페이지에 기록합니다.

## Sources

- ThemeToggle prompt contract: `components/selection/ThemeToggle.prompt.md`
- Storybook implementation evidence: `stories/SelectionThemeToggle.stories.jsx`
