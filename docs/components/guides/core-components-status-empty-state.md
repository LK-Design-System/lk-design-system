# Empty State

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Core / Status |
| Owner | `EmptyState` |
| Storybook | `LDS Core/Components/Status/Empty State` |
| Source | `../component-content.json#core-components-status-empty-state` |

첫 사용, 검색 결과 없음, 권한 제한처럼 정상적으로 표시할 콘텐츠가 없고 회복 또는 시작 방법을 안내해야 할 때 적합합니다. 데이터를 불러오는 중에는 Loading을, 실패 원인과 재시도가 필요한 경우에는 Error 상태를 사용하고 단순히 공간을 채우기 위한 장식으로 쓰지 마세요.

## 사용 판단

### 사용

- 첫 사용, 검색 결과 없음, 권한 제한처럼 정상적으로 표시할 콘텐츠가 없고 회복 또는 시작 방법을 안내해야 할 때 적합합니다. 데이터를 불러오는 중에는 Loading을, 실패 원인과 재시도가 필요한 경우에는 Error 상태를 사용하고 단순히 공간을 채우기 위한 장식으로 쓰지 마세요.
- title은 실제 heading으로 렌더됩니다. 스타일된 div가 아니라 h2–h6이므로 스크린 리더 사용자가 heading 탐색으로 빈 상태에 바로 도달할 수 있습니다(Carbon · Polaris · Atlassian의 empty state와 같은 규약).
- - icon / title / description / action — 모두 선택적 노드. 아이콘은 부드러운 시안 타일에 놓입니다. - tone — 기본 signal. 오류·주의 차단 상태는 negative/cautionary를 전달해 아이콘의 의미와 타일 surface/foreground를 맞춥니다. - title은 실제 heading으로 렌더됩니다. 스타일된 div가 아니라 h2–h6이므로 스크린 리더 사용자가 heading 탐색으로 빈 상태에 바로 도달할 수 있습니다(Carbon · Polaris · Atlassian의 empty state와 같은 규약). -….
- Empty State가 소유하는 Status 의미와 상태를 여러 제품 화면에서 동일하게 재사용할 때 사용합니다.

### 사용하지 않음

- Empty State가 소유하지 않는 라우팅, 권한, 데이터 요청, 제품 임계값을 컴포넌트 내부에 넣지 않습니다.
- 동일한 목적을 더 단순한 native 요소나 기존 LDS primitive로 해결할 수 있으면 새 조합을 만들지 않습니다.
- 표현이 비슷하다는 이유만으로 상태 의미가 다른 sibling 컴포넌트를 서로 대체하지 않습니다.

## Anatomy

| Part | Contract |
| --- | --- |
| Root | EmptyState의 semantic role, layout containment와 전달받은 DOM 속성을 소유합니다. |
| Icon | 아이콘 노드(부드러운 시안 타일에 렌더). |
| Title | title 속성으로 제공되는 공개 슬롯 또는 표시 영역입니다. |
| Description | description 속성으로 제공되는 공개 슬롯 또는 표시 영역입니다. |
| Action | 액션 노드(예: Button). |
| Tone | 아이콘 타일의 semantic status tone. @default "signal" |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `icon` | `React.ReactNode` | No | 아이콘 노드(부드러운 시안 타일에 렌더). |
| `title` | `React.ReactNode` | No | 굵은 제목. |
| `description` | `React.ReactNode` | No | 뮤트 설명. |
| `action` | `React.ReactNode` | No | 액션 노드(예: Button). |
| `tone` | `'signal' \| 'info' \| 'positive' \| 'success' \| 'cautionary' \| 'warning' \| 'negative' \| 'error' \| 'offline'` | No | 아이콘 타일의 semantic status tone. @default "signal" |
| `headingLevel` | `2 \| 3 \| 4 \| 5 \| 6` | No | title이 렌더되는 heading 레벨. 주변 문서 개요에 맞춰 h2–h6 중 선택합니다. |

## States

| State | Contract |
| --- | --- |
| tone | 아이콘 타일의 semantic status tone. @default "signal" 타입 계약: 'signal' \| 'info' \| 'positive' \| 'success' \| 'cautionary' \| 'warning' \| 'negative' \| 'error' \| 'offline' |

## Behavior and interaction

- icon / title / description / action — 모두 선택적 노드. 아이콘은 부드러운 시안 타일에 놓입니다.
- tone — 기본 signal. 오류·주의 차단 상태는 negative/cautionary를 전달해 아이콘의 의미와 타일 surface/foreground를 맞춥니다.
- title은 실제 heading으로 렌더됩니다. 스타일된 div가 아니라 h2–h6이므로 스크린 리더 사용자가 heading 탐색으로 빈 상태에 바로 도달할 수 있습니다(Carbon · Polaris · Atlassian의 empty state와 같은 규약).
- - icon / title / description / action — 모두 선택적 노드. 아이콘은 부드러운 시안 타일에 놓입니다. - tone — 기본 signal. 오류·주의 차단 상태는 negative/cautionary를 전달해 아이콘의 의미와 타일 surface/foreground를 맞춥니다. - title은 실제 heading으로 렌더됩니다. 스타일된 div가 아니라 h2–h6이므로 스크린 리더 사용자가 heading 탐색으로 빈 상태에 바로 도달할 수 있습니다(Carbon · Polaris · Atlassian의 empty state와 같은 규약). -….
- EmptyState의 controlled/uncontrolled 경계와 callback 순서는 공개 타입 계약을 따릅니다.

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 명시 규칙 1 | headingLevel — 기본 2. 주변 문서 개요에 맞춰 2–6으로 지정하세요(범위를 벗어나면 클램프됩니다). 카드나 패널 안처럼 이미 h2가 있는 영역에서는 headingLevel={3}처럼 한 단계 낮춰 heading 순서가 건너뛰지 않게 합니다. |
| 명시 규칙 2 | - icon / title / description / action — 모두 선택적 노드. 아이콘은 부드러운 시안 타일에 놓입니다. - tone — 기본 signal. 오류·주의 차단 상태는 negative/cautionary를 전달해 아이콘의 의미와 타일 surface/foreground를 맞춥니다. - title은 실제 heading으로 렌더됩니다. 스타일된 div가 아니라 h2–h6이므로 스크린 리더 사용자가 heading 탐색으로 빈 상태에 바로 도달할 수 있습니다(Carbon · Polaris · Atlassian의 empty state와 같은 규약). -… |
| --color-semantic-label-alternative | light: rgba(55, 56, 60, 0.74); dark: rgba(174, 176, 182, 0.74) |
| --color-semantic-label-normal | light: #171718; dark: #F7F7F7 |
| --fw-bold | 700 |

## Responsive

- 320px 좁은 폭과 200% 텍스트 확대에서 페이지 가로 overflow 없이 의미 순서를 유지합니다.
- 고정 폭보다 부모 containment와 wrapping을 우선하고, 제품이 필요할 때 명시적으로 compact 표현을 선택합니다.

## Content and writing

- icon / title / description / action — 모두 선택적 노드. 아이콘은 부드러운 시안 타일에 놓입니다.
- title은 실제 heading으로 렌더됩니다. 스타일된 div가 아니라 h2–h6이므로 스크린 리더 사용자가 heading 탐색으로 빈 상태에 바로 도달할 수 있습니다(Carbon · Polaris · Atlassian의 empty state와 같은 규약).
- - icon / title / description / action — 모두 선택적 노드. 아이콘은 부드러운 시안 타일에 놓입니다. - tone — 기본 signal. 오류·주의 차단 상태는 negative/cautionary를 전달해 아이콘의 의미와 타일 surface/foreground를 맞춥니다. - title은 실제 heading으로 렌더됩니다. 스타일된 div가 아니라 h2–h6이므로 스크린 리더 사용자가 heading 탐색으로 빈 상태에 바로 도달할 수 있습니다(Carbon · Polaris · Atlassian의 empty state와 같은 규약). -….
- 사용자에게 보이는 Empty State 문자열은 제품 번역 계층에서 제공하고 행동 또는 상태를 구체적으로 설명합니다.

## Accessibility

- title은 실제 heading으로 렌더됩니다. 스타일된 div가 아니라 h2–h6이므로 스크린 리더 사용자가 heading 탐색으로 빈 상태에 바로 도달할 수 있습니다(Carbon · Polaris · Atlassian의 empty state와 같은 규약).
- - icon / title / description / action — 모두 선택적 노드. 아이콘은 부드러운 시안 타일에 놓입니다. - tone — 기본 signal. 오류·주의 차단 상태는 negative/cautionary를 전달해 아이콘의 의미와 타일 surface/foreground를 맞춥니다. - title은 실제 heading으로 렌더됩니다. 스타일된 div가 아니라 h2–h6이므로 스크린 리더 사용자가 heading 탐색으로 빈 상태에 바로 도달할 수 있습니다(Carbon · Polaris · Atlassian의 empty state와 같은 규약). -….
- native semantic을 우선하며 사용자에게 보이는 이름과 접근 가능한 이름이 같은 목적을 설명하게 합니다.
- 키보드 focus 순서, focus-visible 표시와 상태 ARIA가 시각 상태와 동시에 갱신되는지 공개 스토리에서 검증합니다.
- 색상, 모양 또는 아이콘 하나만으로 상태를 구분하지 않고 이름·텍스트·semantic state를 함께 제공합니다.

## Do / Don't

| Kind | Guidance |
| --- | --- |
| Do | title은 실제 heading으로 렌더됩니다. 스타일된 div가 아니라 h2–h6이므로 스크린 리더 사용자가 heading 탐색으로 빈 상태에 바로 도달할 수 있습니다(Carbon · Polaris · Atlassian의 empty state와 같은 규약). |
| Don't | Empty State가 소유하지 않는 라우팅, 권한, 데이터 요청, 제품 임계값을 컴포넌트 내부에 넣지 않습니다. |
| Do | - icon / title / description / action — 모두 선택적 노드. 아이콘은 부드러운 시안 타일에 놓입니다. - tone — 기본 signal. 오류·주의 차단 상태는 negative/cautionary를 전달해 아이콘의 의미와 타일 surface/foreground를 맞춥니다. - title은 실제 heading으로 렌더됩니다. 스타일된 div가 아니라 h2–h6이므로 스크린 리더 사용자가 heading 탐색으로 빈 상태에 바로 도달할 수 있습니다(Carbon · Polaris · Atlassian의 empty state와 같은 규약). -…. |
| Don't | 동일한 목적을 더 단순한 native 요소나 기존 LDS primitive로 해결할 수 있으면 새 조합을 만들지 않습니다. |

## Exceptions

- 제품 정책을 포함해야 하는 예외는 wrapper 또는 제품 저장소에서 조합하고 EmptyState의 범용 API에 넣지 않습니다.
- 접근성 또는 안전 계약을 약화하는 예외는 허용하지 않으며 필요한 차이는 prompt와 Storybook 증거에 기록합니다.

## Related components

| Component | Relationship |
| --- | --- |
| `Button` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `Icon` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `Banner` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `Callout` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `Skeleton` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `Spinner` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |

## Examples

### 기본 조합

```jsx
<EmptyState icon={<Icon name="search" size={26} />} title="검색 결과가 없습니다"
  description="다른 산업이나 제품군으로 다시 검색해 보세요."
  action={<Button variant="flat">필터 초기화</Button>} />

<EmptyState headingLevel={3} title="아직 로그가 없습니다" />
```

## Tokens and API

### Tokens

- `--color-semantic-label-alternative`
- `--color-semantic-label-normal`
- `--font-sans`
- `--fw-bold`
- `--headline1-line`
- `--headline1-size`
- `--label1-size`
- `--radius-xl`

### Source contracts

- `components/status/EmptyState.jsx`
- `components/status/EmptyState.d.ts`
- `components/status/EmptyState.prompt.md`
- `stories/StatusEmpty.stories.jsx`

## Migration

- 현재 prompt와 타입 계약에 기록되지 않은 legacy alias는 새 코드에서 도입하지 않습니다.
- 대체 컴포넌트가 생기면 기존 API의 제거 버전, 대응 prop과 자동·수동 전환 절차를 이 페이지에 기록합니다.

## Sources

- EmptyState prompt contract: `components/status/EmptyState.prompt.md`
- Storybook implementation evidence: `stories/StatusEmpty.stories.jsx`
