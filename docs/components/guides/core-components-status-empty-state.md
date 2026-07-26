# Empty State

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Core / Status |
| Owner | `EmptyState` |
| Storybook | `LDS Core/Components/Status/Empty State` |
| Source | `../component-content.json#core-components-status-empty-state` |

첫 사용, 검색 결과 없음, 권한 제한처럼 정상적으로 표시할 콘텐츠가 없고 회복 또는 시작 방법을 안내해야 할 때 적합합니다. 데이터를 불러오는 중에는 Loading을, 실패 원인과 재시도가 필요한 경우에는 Error 상태를 사용하고 단순히 공간을 채우기 위한 장식으로 쓰지 마세요.

## Anatomy

| Part | Contract |
| --- | --- |
| icon | 아이콘 노드(부드러운 시안 타일에 렌더). |
| action | 액션 노드(예: Button). |
| tone | 아이콘 타일의 semantic status tone. @default "signal" |

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
| tone | 아이콘 타일의 semantic status tone. @default "signal" |

## Behavior and interaction

- tone — 기본 signal. 오류·주의 차단 상태는 negative/cautionary를 전달해 아이콘의 의미와 타일 surface/foreground를 맞춥니다.

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 명시 규칙 1 | headingLevel — 기본 2. 주변 문서 개요에 맞춰 2–6으로 지정하세요(범위를 벗어나면 클램프됩니다). 카드나 패널 안처럼 이미 h2가 있는 영역에서는 headingLevel={3}처럼 한 단계 낮춰 heading 순서가 건너뛰지 않게 합니다. |
| --color-semantic-label-alternative | light: rgba(55, 56, 60, 0.74); dark: rgba(174, 176, 182, 0.74) |
| --color-semantic-label-normal | light: #171718; dark: #F7F7F7 |
| --fw-bold | 700 |
| --headline1-line | 26px |

## Responsive

- 헤더·툴바와 높이가 할당된 본문을 가진 카드, 패널, 표에서는 빈 상태를 헤더를 제외한 가용 본문 영역의 가로·세로 중앙에 둡니다. 컨테이너 전체 중앙을 사용해 헤더 때문에 아래로 밀리거나, 고정 padding만으로 본문 위쪽에 붙이지 않습니다.
- 메뉴, 자동완성, disclosure, 자동 높이 목록처럼 콘텐츠 높이만큼 열리는 표면은 본문을 인위적으로 키우지 않고 흐름 배치를 유지합니다.
- 작은 bounded region에서는 텍스트 중심의 compact 상태를 사용하고, 충분한 크기와 다음 행동이 필요한 차단 상태에서만 icon·description·action을 포함한 EmptyState를 사용합니다.
- Carbon Empty states는 컨테이너 크기와 맥락에 따라 compact 상태와 큰 empty state를 구분합니다.

## Content and writing

- icon / title / description / action — 모두 선택적 노드. 아이콘은 부드러운 시안 타일에 놓입니다.
- loading·error가 같은 본문을 대체한다면 empty와 동일한 배치 축을 공유해 상태 전환 때 메시지 위치가 흔들리지 않게 합니다. 긴급도와 live-region 역할은 각 상태의 의미에 따라 별도로 결정합니다.
- SAP Fiori Empty States와 Illustrated Message는 메시지를 컨테이너 크기에 맞춰 조정하고 작은 영역에서는 text-only 표현을 사용하도록 안내합니다.

## Accessibility

- title은 실제 heading으로 렌더됩니다. 스타일된 div가 아니라 h2–h6이므로 스크린 리더 사용자가 heading 탐색으로 빈 상태에 바로 도달할 수 있습니다(Carbon · Polaris · Atlassian의 empty state와 같은 규약).

## Related components

| Component | Relationship |
| --- | --- |
| `Button` | 대표 시나리오에서 조합 |
| `Icon` | 대표 시나리오에서 조합 |
| `Banner` | 대표 시나리오에서 조합 |
| `Callout` | 대표 시나리오에서 조합 |
| `Skeleton` | 대표 시나리오에서 조합 |
| `Spinner` | 대표 시나리오에서 조합 |

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
- `--space-1-5`
- `--space-3-5`

### Source contracts

- `components/status/EmptyState.jsx`
- `components/status/EmptyState.d.ts`
- `components/status/EmptyState.prompt.md`
- `stories/StatusEmpty.stories.jsx`

## Sources

- EmptyState prompt contract: `components/status/EmptyState.prompt.md`
- Storybook implementation evidence: `stories/StatusEmpty.stories.jsx`
- [Carbon Empty states](https://carbondesignsystem.com/patterns/empty-states-pattern/)
- [SAP Fiori Empty States](https://experience.sap.com/fiori-design-web/designing-for-empty-states/)
- [Illustrated Message](https://experience.sap.com/fiori-design-web/illustrated-message-web-component/)
