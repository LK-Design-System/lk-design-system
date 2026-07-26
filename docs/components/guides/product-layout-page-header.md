# Page Header

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Product / Layout |
| Owner | `PageHeader` |
| Storybook | `LDS Product/Layout/Page Header` |
| Source | `../component-content.json#product-layout-page-header` |

제품 화면의 breadcrumb, 제목, 설명, 상태, 메타데이터, 주요 액션을 일관된 상단 영역으로 묶을 때 적합합니다. 카드나 작은 섹션 제목에는 PageHeader 대신 해당 영역의 heading과 필요한 액션만 사용하세요.

## 사용 판단

### 사용

- 제목은 사용자가 수행하는 업무 또는 화면을 가리킵니다(예: “사용자 관리”). 사람·로봇·주문처럼 대상 자체를 식별하는 visual·이름·인증 배지·스탯·대상 액션 묶음은 RecordHeader를 사용합니다.

### 사용하지 않음

- WAI Landmarks Pattern의 고수준 구조 원칙에 따라 PageHeader는 main 안의 로컬 이며, TopBar의 전역 banner나 Storybook 설명 chrome을 대체하지 않습니다.

## Anatomy

| Part | Contract |
| --- | --- |
| description | 제목 아래 설명. |
| actions | 오른쪽 액션 영역. |
| align | 액션 영역과 본문 수직 정렬. @default "start" |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `eyebrow` | `React.ReactNode` | No | 제목 위 보조 라벨. |
| `breadcrumb` | `React.ReactNode` | No | Breadcrumb 또는 제목 위 경로 슬롯. |
| `title` | `React.ReactNode` | Yes | 페이지 제목. |
| `description` | `React.ReactNode` | No | 제목 아래 설명. |
| `status` | `React.ReactNode` | No | 제목 옆 상태 badge/chip 슬롯. |
| `meta` | `React.ReactNode` | No | 설명 아래 metadata 슬롯. |
| `actions` | `React.ReactNode` | No | 오른쪽 액션 영역. |
| `align` | `'start' \| 'center'` | No | 액션 영역과 본문 수직 정렬. @default "start" |
| `size` | `'sm' \| 'md'` | No | 제목 크기. @default "md" |
| `headingLevel` | `1 \| 2 \| 3 \| 4 \| 5 \| 6` | No | 제목의 문서 heading 단계. @default 1 |

## States

| State | Contract |
| --- | --- |
| status | 제목 옆 상태 badge/chip 슬롯. |

## Behavior and interaction

- PageHeader — 페이지 상단에서 breadcrumb, 화면 제목, 설명, 상태, 메타데이터와 주요 액션을 정렬하는 계약입니다.

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 명시 규칙 1 | 앱 화면마다 hero를 새로 만들지 말고 반복되는 앱 헤더에는 PageHeader를 쓰세요. 기본 headingLevel={1}로 한 화면에 하나만 배치합니다. 문서·비교 도구처럼 상위 제목이 이미 있는 합성 표면에서만 headingLevel={2..6}으로 주변 heading 구조에 연결합니다. |
| 명시 규칙 2 | WCAG 2.2 Reflow에 맞춰 320 CSS px 상당의 좁은 폭에서 페이지 chrome이 양방향 스크롤을 요구하지 않도록 본문과 actions를 재배치합니다. |
| --color-semantic-label-neutral | light: rgba(46, 47, 51, 0.88); dark: rgba(194, 196, 200, 0.88) |
| --color-semantic-label-normal | light: #171718; dark: #F7F7F7 |
| --color-semantic-label-strong | light: #000000; dark: #FFFFFF |

## Responsive

- actions 슬롯에는 버튼·가로형 SegmentedControl처럼 헤더 한 줄 높이에 맞는 컨트롤만 배치합니다. 세로형 FloorSelector 같은 tall 컨트롤은 헤더가 아니라 맵·뷰어 옆 오버레이에 둡니다.
- breadcrumb·eyebrow는 제목 위의 전용 풀폭 컨텍스트 행입니다. 넓은 컨테이너에서 actions는 컨텍스트 행이 아니라 제목 행에 정렬되어 좌측 스택 옆에 뜬 공백을 만들지 않습니다. 좁은 컨테이너에서는 DOM과 읽기 순서를 바꾸지 않은 채 actions가 다음 행으로 내려가고 내부 버튼도 wrap합니다. 긴 제목·설명은 단어를 자르지 않는 것을 우선하되 끊을 수 없는 문자열은 컨테이너 밖으로 넘치지 않게 줄바꿈합니다.

## Content and writing

- title은 필수입니다. breadcrumb, eyebrow, description, status, meta, actions는 슬롯입니다.
- 대상의 큰 visual, 프로필 통계, 인증 표식과 대상별 액션을 이 헤더에 넣지 않습니다. 페이지 맥락과 레코드 정체성이 모두 필요하면 PageHeader를 먼저 두고 본문에 RecordHeader를 배치하되 제목과 액션을 반복하지 않습니다.
- eyebrow·meta는 화면 이해에 필요한 텍스트이므로 label-neutral 색과 label2 타이포 토큰을 사용합니다. AA 미달인 label-assistive·label-disable을 필수 텍스트에 쓰지 않습니다.
- Primer PageHeader는 page title·description·status·navigation·actions를 중심으로 하고 leading visual은 작은 보조 요소로 제한합니다.

## Related components

| Component | Relationship |
| --- | --- |
| `Breadcrumb` | 대표 시나리오에서 조합 |
| `Button` | 대표 시나리오에서 조합 |
| `SegmentedControl` | 대표 시나리오에서 조합 |
| `StatusBadge` | 대표 시나리오에서 조합 |
| `DashboardGrid` | 대표 시나리오에서 조합 |
| `DashboardShell` | 대표 시나리오에서 조합 |
| `DockPanel` | 대표 시나리오에서 조합 |
| `PrimaryDetail` | 대표 시나리오에서 조합 |

## Examples

### 기본 조합

```jsx
<PageHeader
  breadcrumb={<Breadcrumb items={[{ label: '관리' }, { label: '사용자' }]} />}
  title="사용자 관리"
  status={<StatusBadge tone="signal">검토 중</StatusBadge>}
  description="계정 상태와 최근 변경 이력을 확인합니다."
  actions={<Button>사용자 추가</Button>}
/>
```

## Tokens and API

### Tokens

- `--color-semantic-label-neutral`
- `--color-semantic-label-normal`
- `--color-semantic-label-strong`
- `--font-sans`
- `--fw-bold`
- `--fw-extra`
- `--heading1-line`
- `--heading1-size`
- `--heading1-spacing`
- `--heading2-line`
- `--heading2-size`
- `--heading2-spacing`
- `--label1-reading-line`
- `--label1-size`
- `--label1-spacing`
- `--label2-line`
- `--label2-size`
- `--label2-spacing`
- `--space-2`
- `--space-3`
- `--space-4`

### Source contracts

- `components/layout/PageHeader.jsx`
- `components/layout/PageHeader.d.ts`
- `components/layout/PageHeader.prompt.md`
- `stories/LayoutPageHeader.stories.jsx`

## Sources

- PageHeader prompt contract: `components/layout/PageHeader.prompt.md`
- Storybook implementation evidence: `stories/LayoutPageHeader.stories.jsx`
- [Primer PageHeader](https://primer.style/product/components/page-header/guidelines/)
- [Shopify Page](https://shopify.dev/docs/api/app-home/web-components/layout-and-structure/page)
- [Atlassian Page Header](https://atlassian.design/components/page-header/)
- [PatternFly Page Header](https://www.patternfly.org/component-groups/content-containers/page-header/)
- [PatternFly Masthead](https://www.patternfly.org/components/masthead/design-guidelines/)
- [WCAG 2.2 Reflow](https://www.w3.org/TR/WCAG22/#reflow)
- [WAI Landmarks Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/landmarks/)
