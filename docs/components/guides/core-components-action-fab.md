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

### 사용

- 목록이나 캔버스 위에서 지속적으로 접근해야 하는 단일 최우선 생성 액션에 적합합니다. 같은 우선순위의 작업이 여러 개이거나 일반 도구 모음에는 FAB 대신 Button, Toolbar 또는 Speed Dial을 사용하세요.
- FAB가 소유하는 Action 의미와 상태를 여러 제품 화면에서 동일하게 재사용할 때 사용합니다.
- 제품별 구현 대신 공개 Fab API와 semantic token으로 일관성을 유지해야 할 때 사용합니다.

### 사용하지 않음

- hover/pressed는 색조만 잔잔하게 바뀌며 위치, scale, 그림자 깊이는 변하지 않습니다.
- - variant signal · dark · primary · secondary · white. size sm 48 · md 56 · lg 64. 항상 label을 전달하세요. 누락하면 development 빌드에서 console 경고가 출력됩니다(production 번들에서는 제거됨). - 나머지 props({...rest})는 Button·IconButton과 동일하게 가장 먼저 펼쳐집니다. type, aria-label, disabled, 이벤트 핸들러 같은 컴포넌트 계약은 consumer prop이 덮어쓸 수 없습니다(type은 명시적으로 전달하면 존중됩니….
- FAB가 소유하지 않는 라우팅, 권한, 데이터 요청, 제품 임계값을 컴포넌트 내부에 넣지 않습니다.
- 동일한 목적을 더 단순한 native 요소나 기존 LDS primitive로 해결할 수 있으면 새 조합을 만들지 않습니다.

## Anatomy

| Part | Contract |
| --- | --- |
| Root | Fab의 semantic role, layout containment와 전달받은 DOM 속성을 소유합니다. |
| Label | 접근성 이름(필수 — 아이콘 전용). 누락 시 development 빌드에서 console 경고. |
| Children | children 속성으로 제공되는 공개 슬롯 또는 표시 영역입니다. |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `variant` | `'signal' \| 'dark' \| 'primary' \| 'secondary' \| 'white'` | No | 공개 타입 계약에 정의된 속성입니다. |
| `size` | `'sm' \| 'md' \| 'lg'` | No | 지름: sm 48 · md 56 · lg 64. @default "md" |
| `label` | `string` | Yes | 접근성 이름(필수 — 아이콘 전용). 누락 시 development 빌드에서 console 경고. |
| `type` | `'button' \| 'submit' \| 'reset'` | No | 폼 안에서 의도치 않은 제출을 막기 위해 기본값은 button입니다. |
| `children` | `React.ReactNode` | No | 공개 타입 계약에 정의된 속성입니다. |

## States

| State | Contract |
| --- | --- |
| variant | 공개 타입 계약에 정의된 속성입니다. 타입 계약: 'signal' \| 'dark' \| 'primary' \| 'secondary' \| 'white' |
| 상호작용 · 크기와 비활성 | interaction 공개 스토리에서 렌더링 및 상호작용 증거를 유지합니다. |

## Behavior and interaction

- Native disabled는 focus에서 제외되고, aria-disabled="true"는 focus를 유지하면서 같은 unavailable 스타일과 activation 차단을 적용합니다.
- hover/pressed는 색조만 잔잔하게 바뀌며 위치, scale, 그림자 깊이는 변하지 않습니다.
- WAI-ARIA Button Pattern의 accessible name과 keyboard activation 계약을 따릅니다.
- - variant signal · dark · primary · secondary · white. size sm 48 · md 56 · lg 64. 항상 label을 전달하세요. 누락하면 development 빌드에서 console 경고가 출력됩니다(production 번들에서는 제거됨). - 나머지 props({...rest})는 Button·IconButton과 동일하게 가장 먼저 펼쳐집니다. type, aria-label, disabled, 이벤트 핸들러 같은 컴포넌트 계약은 consumer prop이 덮어쓸 수 없습니다(type은 명시적으로 전달하면 존중됩니….
- Fab의 controlled/uncontrolled 경계와 callback 순서는 공개 타입 계약을 따릅니다.

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 명시 규칙 1 | variant signal · dark · primary · secondary · white. size sm 48 · md 56 · lg 64. 항상 label을 전달하세요. 누락하면 development 빌드에서 console 경고가 출력됩니다(production 번들에서는 제거됨). |
| 명시 규칙 2 | md 56px 원형과 disable 축은 WDS Button/Floating Action Button 기준입니다. 추가 크기와 palette는 LDS 확장입니다. |
| 명시 규칙 3 | - variant signal · dark · primary · secondary · white. size sm 48 · md 56 · lg 64. 항상 label을 전달하세요. 누락하면 development 빌드에서 console 경고가 출력됩니다(production 번들에서는 제거됨). - 나머지 props({...rest})는 Button·IconButton과 동일하게 가장 먼저 펼쳐집니다. type, aria-label, disabled, 이벤트 핸들러 같은 컴포넌트 계약은 consumer prop이 덮어쓸 수 없습니다(type은 명시적으로 전달하면 존중됩니… |
| --color-semantic-background-elevated-normal | light: #FFFFFF; dark: #212225 |
| --color-semantic-inverse-background | light: #1B1C1E; dark: #FFFFFF |

## Responsive

- 320px 좁은 폭과 200% 텍스트 확대에서 페이지 가로 overflow 없이 의미 순서를 유지합니다.
- 고정 폭보다 부모 containment와 wrapping을 우선하고, 제품이 필요할 때 명시적으로 compact 표현을 선택합니다.

## Content and writing

- variant signal · dark · primary · secondary · white. size sm 48 · md 56 · lg 64. 항상 label을 전달하세요. 누락하면 development 빌드에서 console 경고가 출력됩니다(production 번들에서는 제거됨).
- 나머지 props({...rest})는 Button·IconButton과 동일하게 가장 먼저 펼쳐집니다. type, aria-label, disabled, 이벤트 핸들러 같은 컴포넌트 계약은 consumer prop이 덮어쓸 수 없습니다(type은 명시적으로 전달하면 존중됩니다).
- WAI-ARIA Button Pattern의 accessible name과 keyboard activation 계약을 따릅니다.
- - variant signal · dark · primary · secondary · white. size sm 48 · md 56 · lg 64. 항상 label을 전달하세요. 누락하면 development 빌드에서 console 경고가 출력됩니다(production 번들에서는 제거됨). - 나머지 props({...rest})는 Button·IconButton과 동일하게 가장 먼저 펼쳐집니다. type, aria-label, disabled, 이벤트 핸들러 같은 컴포넌트 계약은 consumer prop이 덮어쓸 수 없습니다(type은 명시적으로 전달하면 존중됩니….

## Accessibility

- 나머지 props({...rest})는 Button·IconButton과 동일하게 가장 먼저 펼쳐집니다. type, aria-label, disabled, 이벤트 핸들러 같은 컴포넌트 계약은 consumer prop이 덮어쓸 수 없습니다(type은 명시적으로 전달하면 존중됩니다).
- Native disabled는 focus에서 제외되고, aria-disabled="true"는 focus를 유지하면서 같은 unavailable 스타일과 activation 차단을 적용합니다.
- WAI-ARIA Button Pattern의 accessible name과 keyboard activation 계약을 따릅니다.
- - variant signal · dark · primary · secondary · white. size sm 48 · md 56 · lg 64. 항상 label을 전달하세요. 누락하면 development 빌드에서 console 경고가 출력됩니다(production 번들에서는 제거됨). - 나머지 props({...rest})는 Button·IconButton과 동일하게 가장 먼저 펼쳐집니다. type, aria-label, disabled, 이벤트 핸들러 같은 컴포넌트 계약은 consumer prop이 덮어쓸 수 없습니다(type은 명시적으로 전달하면 존중됩니….
- native semantic을 우선하며 사용자에게 보이는 이름과 접근 가능한 이름이 같은 목적을 설명하게 합니다.

## Do / Don't

| Kind | Guidance |
| --- | --- |
| Do | FAB가 소유하는 Action 의미와 상태를 여러 제품 화면에서 동일하게 재사용할 때 사용합니다. |
| Don't | hover/pressed는 색조만 잔잔하게 바뀌며 위치, scale, 그림자 깊이는 변하지 않습니다. |
| Do | 제품별 구현 대신 공개 Fab API와 semantic token으로 일관성을 유지해야 할 때 사용합니다. |
| Don't | - variant signal · dark · primary · secondary · white. size sm 48 · md 56 · lg 64. 항상 label을 전달하세요. 누락하면 development 빌드에서 console 경고가 출력됩니다(production 번들에서는 제거됨). - 나머지 props({...rest})는 Button·IconButton과 동일하게 가장 먼저 펼쳐집니다. type, aria-label, disabled, 이벤트 핸들러 같은 컴포넌트 계약은 consumer prop이 덮어쓸 수 없습니다(type은 명시적으로 전달하면 존중됩니…. |

## Exceptions

- 제품 정책을 포함해야 하는 예외는 wrapper 또는 제품 저장소에서 조합하고 Fab의 범용 API에 넣지 않습니다.
- 접근성 또는 안전 계약을 약화하는 예외는 허용하지 않으며 필요한 차이는 prompt와 Storybook 증거에 기록합니다.

## Related components

| Component | Relationship |
| --- | --- |
| `Icon` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `ActionArea` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `Button` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `IconButton` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `TextButton` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `ToggleIcon` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |

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

## Migration

- 현재 prompt와 타입 계약에 기록되지 않은 legacy alias는 새 코드에서 도입하지 않습니다.
- 대체 컴포넌트가 생기면 기존 API의 제거 버전, 대응 prop과 자동·수동 전환 절차를 이 페이지에 기록합니다.

## Sources

- Fab prompt contract: `components/buttons/Fab.prompt.md`
- Storybook implementation evidence: `stories/ActionFab.stories.jsx`
- [WAI-ARIA Button Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/button/)
- [SEED FAB benchmark](https://seed-design.io/components/floating-action-button)
