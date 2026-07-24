# Divider

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Core / Layout |
| Owner | `Divider` |
| Storybook | `LDS Core/Components/Layout/Divider` |
| Source | `../component-content.json#core-components-layout-divider` |

같은 표면 안에서 의미가 다른 섹션이나 인라인 그룹의 경계를 보조할 때 적합합니다. 주제가 바뀌는 경계는 기본값(role="separator")으로, 이미 목록·제목으로 구조가 잡힌 곳의 리듬용 선은 decorative로 구분하세요. 공간만으로 위계가 충분하면 여백을 우선하고, 독립된 표면이 필요하면 Card나 Section을 사용하며 모든 행 사이에 습관적으로 선을 넣지 마세요.

## 사용 판단

### 사용

- 같은 표면 안에서 의미가 다른 섹션이나 인라인 그룹의 경계를 보조할 때 적합합니다. 주제가 바뀌는 경계는 기본값(role="separator")으로, 이미 목록·제목으로 구조가 잡힌 곳의 리듬용 선은 decorative로 구분하세요. 공간만으로 위계가 충분하면 여백을 우선하고, 독립된 표면이 필요하면 Card나 Section을 사용하며 모든 행 사이에 습관적으로 선을 넣지 마세요.
- Use variant="normal" for hairline separation and variant="thick" for stronger section breaks.
- Use vertical only inside horizontal groups where the parent controls height.
- Use label for "or" style separators between equivalent actions.

### 사용하지 않음

- 가로형 기본 Divider 는 네이티브 이므로 role="separator" 를 다시 선언하지 않습니다(중복 role). 세로형은 이라 role="separator" + aria-orientation="vertical" 을 명시합니다.
- - 목록의 행 구분선은 대부분 장식입니다. 리스트 시맨틱(ul/li)이 이미 경계를 알려주므로, 행마다 role="separator" 를 노출하면 스크린리더가 "구분자"를 항목 수만큼 반복해서 읽습니다. ListCell 의 divider prop 은 이 이유로 이미 aria-hidden 인 장식선입니다. - 가로형 기본 Divider 는 네이티브 이므로 role="separator" 를 다시 선언하지 않습니다(중복 role). 세로형은 이라 role="separator" + aria-orientation="vertical" 을 명시합니다. - label 이 있는 구….
- Divider가 소유하지 않는 라우팅, 권한, 데이터 요청, 제품 임계값을 컴포넌트 내부에 넣지 않습니다.
- 동일한 목적을 더 단순한 native 요소나 기존 LDS primitive로 해결할 수 있으면 새 조합을 만들지 않습니다.

## Anatomy

| Part | Contract |
| --- | --- |
| Root | Divider의 semantic role, layout containment와 전달받은 DOM 속성을 소유합니다. |
| Label | Optional centered label for an "or" style divider. |

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
| variant | divider visual weight. @default "normal" 타입 계약: "normal" \| "thick" |

## Behavior and interaction

- label 이 있는 구분선은 separator 의 자식이 presentational 이라 라벨 텍스트가 이름으로 읽히지 않습니다. 문자열 label 은 aria-label 로 함께 노출합니다.
- - 목록의 행 구분선은 대부분 장식입니다. 리스트 시맨틱(ul/li)이 이미 경계를 알려주므로, 행마다 role="separator" 를 노출하면 스크린리더가 "구분자"를 항목 수만큼 반복해서 읽습니다. ListCell 의 divider prop 은 이 이유로 이미 aria-hidden 인 장식선입니다. - 가로형 기본 Divider 는 네이티브 이므로 role="separator" 를 다시 선언하지 않습니다(중복 role). 세로형은 이라 role="separator" + aria-orientation="vertical" 을 명시합니다. - label 이 있는 구….
- Divider의 controlled/uncontrolled 경계와 callback 순서는 공개 타입 계약을 따릅니다.
- 상태 변화 중에도 accessible name, focus 위치와 레이아웃 기준점을 예고 없이 잃지 않습니다.
- 제품 데이터와 side effect는 callback으로 위임하고 Divider는 표시·입력 상태만 소유합니다.

## 정량 규칙

| Subject | Rule |
| --- | --- |
| --color-semantic-label-alternative | light: rgba(55, 56, 60, 0.74); dark: rgba(174, 176, 182, 0.74) |
| --fw-semibold | 600 |
| --label2-size | 13px |

## Responsive

- Use vertical only inside horizontal groups where the parent controls height.
- - Use variant="normal" for hairline separation and variant="thick" for stronger section breaks. - Use vertical only inside horizontal groups where the parent controls height. - Use label for "or" style separators between equivalent actions.
- 320px 좁은 폭과 200% 텍스트 확대에서 페이지 가로 overflow 없이 의미 순서를 유지합니다.
- 고정 폭보다 부모 containment와 wrapping을 우선하고, 제품이 필요할 때 명시적으로 compact 표현을 선택합니다.

## Content and writing

- Use label for "or" style separators between equivalent actions.
- label 이 있는 구분선은 separator 의 자식이 presentational 이라 라벨 텍스트가 이름으로 읽히지 않습니다. 문자열 label 은 aria-label 로 함께 노출합니다.
- - Use variant="normal" for hairline separation and variant="thick" for stronger section breaks. - Use vertical only inside horizontal groups where the parent controls height. - Use label for "or" style separators between equivalent actions.
- - 목록의 행 구분선은 대부분 장식입니다. 리스트 시맨틱(ul/li)이 이미 경계를 알려주므로, 행마다 role="separator" 를 노출하면 스크린리더가 "구분자"를 항목 수만큼 반복해서 읽습니다. ListCell 의 divider prop 은 이 이유로 이미 aria-hidden 인 장식선입니다. - 가로형 기본 Divider 는 네이티브 이므로 role="separator" 를 다시 선언하지 않습니다(중복 role). 세로형은 이라 role="separator" + aria-orientation="vertical" 을 명시합니다. - label 이 있는 구….

## Accessibility

- 목록의 행 구분선은 대부분 장식입니다. 리스트 시맨틱(ul/li)이 이미 경계를 알려주므로, 행마다 role="separator" 를 노출하면 스크린리더가 "구분자"를 항목 수만큼 반복해서 읽습니다. ListCell 의 divider prop 은 이 이유로 이미 aria-hidden 인 장식선입니다.
- 가로형 기본 Divider 는 네이티브 이므로 role="separator" 를 다시 선언하지 않습니다(중복 role). 세로형은 이라 role="separator" + aria-orientation="vertical" 을 명시합니다.
- label 이 있는 구분선은 separator 의 자식이 presentational 이라 라벨 텍스트가 이름으로 읽히지 않습니다. 문자열 label 은 aria-label 로 함께 노출합니다.
- | | 기본 (decorative 없음) | decorative | | --- | --- | --- | | 노출 | role="separator" (가로형은 네이티브 의 암시적 role) | role="none" + aria-hidden | | 의미 | "여기서 콘텐츠 주제가 바뀝니다" | 없음 — 순수 시각 리듬 | | 쓰는 곳 | 문서 섹션 경계, 메뉴의 그룹 경계, 서로 다른 성격의 액션 묶음 사이 | 카드 내부 장식선, 이미 ul/li·heading 으로 구조가 잡힌 목록의 행 사이, 반복 리듬용 얇은 선 |.
- - 목록의 행 구분선은 대부분 장식입니다. 리스트 시맨틱(ul/li)이 이미 경계를 알려주므로, 행마다 role="separator" 를 노출하면 스크린리더가 "구분자"를 항목 수만큼 반복해서 읽습니다. ListCell 의 divider prop 은 이 이유로 이미 aria-hidden 인 장식선입니다. - 가로형 기본 Divider 는 네이티브 이므로 role="separator" 를 다시 선언하지 않습니다(중복 role). 세로형은 이라 role="separator" + aria-orientation="vertical" 을 명시합니다. - label 이 있는 구….

## Do / Don't

| Kind | Guidance |
| --- | --- |
| Do | Use variant="normal" for hairline separation and variant="thick" for stronger section breaks. |
| Don't | 가로형 기본 Divider 는 네이티브 이므로 role="separator" 를 다시 선언하지 않습니다(중복 role). 세로형은 이라 role="separator" + aria-orientation="vertical" 을 명시합니다. |
| Do | Use vertical only inside horizontal groups where the parent controls height. |
| Don't | - 목록의 행 구분선은 대부분 장식입니다. 리스트 시맨틱(ul/li)이 이미 경계를 알려주므로, 행마다 role="separator" 를 노출하면 스크린리더가 "구분자"를 항목 수만큼 반복해서 읽습니다. ListCell 의 divider prop 은 이 이유로 이미 aria-hidden 인 장식선입니다. - 가로형 기본 Divider 는 네이티브 이므로 role="separator" 를 다시 선언하지 않습니다(중복 role). 세로형은 이라 role="separator" + aria-orientation="vertical" 을 명시합니다. - label 이 있는 구…. |

## Exceptions

- 제품 정책을 포함해야 하는 예외는 wrapper 또는 제품 저장소에서 조합하고 Divider의 범용 API에 넣지 않습니다.
- 접근성 또는 안전 계약을 약화하는 예외는 허용하지 않으며 필요한 차이는 prompt와 Storybook 증거에 기록합니다.

## Related components

| Component | Relationship |
| --- | --- |
| `AspectRatio` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `Center` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `Cluster` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `Col` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `Columns` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `Container` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `Grid` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `MobileSystemBars` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |

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

### Source contracts

- `components/content/Divider.jsx`
- `components/content/Divider.d.ts`
- `components/content/Divider.prompt.md`
- `stories/LayoutDivider.stories.jsx`

## Migration

- 현재 prompt와 타입 계약에 기록되지 않은 legacy alias는 새 코드에서 도입하지 않습니다.
- 대체 컴포넌트가 생기면 기존 API의 제거 버전, 대응 prop과 자동·수동 전환 절차를 이 페이지에 기록합니다.

## Sources

- Divider prompt contract: `components/content/Divider.prompt.md`
- Storybook implementation evidence: `stories/LayoutDivider.stories.jsx`
- [SEED Divider benchmark](https://seed-design.io/components/divider)
