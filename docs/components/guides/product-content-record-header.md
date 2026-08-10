# Record Header

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Product / Content |
| Owner | `RecordHeader` |
| Storybook | `LDS Product/Content/Record Header` |
| Source | `../component-content.json#product-content-record-header` |

사람·로봇·주문처럼 대상 자체가 화면의 주인공일 때 사용합니다. 시각 식별자, 이름, 배지, 설명, 세부 정보와 대상 액션을 안정된 읽기 순서로 묶으며, 화면의 위치·업무만 설명할 때는 사용하지 않습니다.

## 사용 판단

### 사용

- visual은 Avatar·Thumbnail 같은 대상 식별자입니다. 장식 이미지면 대체 텍스트를 비우고, 식별에 필요한 이미지면 슬롯 컴포넌트가 대상 이름을 제공합니다.
- size="md|sm"은 기본 md인 opt-in 크기 축입니다. sm은 PageHeader와 같은 --heading2- 제목 scale을 사용하고 내부/행 gap을 한 단계 조밀화합니다. description의 --label1-와 details의 --label2- typography는 그대로 유지하며 루트에 data-size를 노출합니다.

### 사용하지 않음

- LK Control Full Daedeok — not applicable. 고정된 MainLayout과 Robot Dashboard는 셸·탐색·감시 화면을 조합하며 일반화 가능한 레코드 정체성 헤더를 제공하지 않습니다.
- 대상 데이터 fetch, 실제 팔로우·설정·공유 결과, 권한, route, 통계 계산과 포맷은 제품이 소유합니다. 새 icon이나 이미지 자산을 추가하지 않고 기존 Avatar, Thumbnail, Icon, StatusBadge를 슬롯으로 조합합니다.

## Anatomy

| Part | Contract |
| --- | --- |
| title | 사람·로봇·주문 등 대상의 이름. |
| description | 대상의 역할·종류·짧은 설명. |
| actions | 대상에 적용되는 설정·공유 등의 액션 영역. |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `visual` | `React.ReactNode` | No | 대상의 시각 식별자 슬롯. Avatar 또는 Thumbnail 등을 넣습니다. |
| `title` | `React.ReactNode` | Yes | 사람·로봇·주문 등 대상의 이름. |
| `badge` | `React.ReactNode` | No | 제목에 붙는 인증·상태 배지 슬롯. |
| `description` | `React.ReactNode` | No | 대상의 역할·종류·짧은 설명. |
| `details` | `React.ReactNode` | No | StatList 또는 간결한 속성처럼 대상을 보충하는 세부 정보. |
| `actions` | `React.ReactNode` | No | 대상에 적용되는 설정·공유 등의 액션 영역. |
| `headingLevel` | `1 \| 2 \| 3 \| 4 \| 5 \| 6` | No | 제목의 문서 heading 단계. @default 1 |
| `size` | `'sm' \| 'md'` | No | 제목 scale과 내부/행 gap을 조정하는 헤더 크기. description·details typography는 유지합니다. @default "md" |

## Behavior and interaction

- Product Extension입니다. WDS Core의 직접 대응 컴포넌트가 아니라 반복되는 제품 레코드 정체성 구조를 LDS 조합 규칙으로 닫습니다.
- actions는 대상에 직접 적용되는 설정·공유·팔로우 같은 짧은 액션만 둡니다. route, 권한, mutation, 확인 절차와 완료/실패 상태는 제품이 소유합니다.
- cover image, 탭, breadcrumb, 전역 navigation, fetch/loading 상태 머신은 이 컴포넌트에 넣지 않습니다.
- Primer PageHeader는 페이지 제목·설명·상태·탐색·액션을 중심으로 하고 leading visual은 작은 보조 요소로 제한합니다. LDS는 통계와 대상 액션까지 갖는 풍부한 정체성 구조를 별도 계약으로 둡니다.
- LK Web Viz — not applicable. 고정된 Dashboard 화면에는 선택 로봇과 연결 상태가 있지만, 이름·식별 이미지·세부 통계·대상 액션을 함께 가진 재사용 레코드 헤더가 없습니다.

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 명시 규칙 1 | 기본 headingLevel={1}입니다. 상위 PageHeader나 문서 제목이 이미 있으면 실제 heading 계층에 맞춰 2–6을 명시합니다. |
| 명시 규칙 2 | 좁은 폭에서는 visual과 내용이 먼저 읽히고 actions가 다음 flex line으로 내려갑니다. 긴 이름과 설명은 320 CSS px에서도 가로 스크롤을 만들지 않습니다. |
| 명시 규칙 3 | WCAG 2.2 Reflow에 맞춰 320 CSS px 상당의 폭에서 양방향 스크롤 없이 재배치합니다. |
| 명시 규칙 4 | Carbon Data Table usage가 toolbar·header·row size를 함께 pairing하듯, scan-heavy 화면에서는 RecordHeader size="sm"을 인접한 compact Card/Table/toolbar와 일관되게 조합합니다. Carbon spacing과 Fluent 2 layout에 따라 작은 spacing token은 관련성을 강화하되, 좁은 폭에서는 reflow와 touch target을 함께 보존합니다. |
| --color-semantic-label-neutral | light: rgba(46, 47, 51, 0.88); dark: rgba(194, 196, 200, 0.88) |

## Responsive

- 실제 .fig 검사에서 RecordHeader component set은 확인되지 않았으므로 size는 WDS parity가 아니라 LDS Product compatibility extension입니다. MUI density guidance처럼 필요한 헤더에서만 명시적으로 선택하고 global dense theme로 강제하지 않습니다.

## Content and writing

- PageHeader는 breadcrumb·eyebrow·페이지 제목·페이지 상태·메타·주요 액션으로 현재 화면의 맥락과 업무를 설명합니다. RecordHeader는 visual·대상 이름·인증/상태 배지·세부 정보·대상 액션으로 현재 보고 있는 대상을 식별합니다.
- StatList는 라벨-값 목록만 소유합니다. 레코드 제목, 시각 식별자, 설명, 액션을 소유하지 않으며 필요할 때 details에 조합합니다.
- 한 화면에 두 헤더가 모두 필요하면 PageHeader가 먼저 페이지 맥락을 설명하고, 본문 레코드 영역의 RecordHeader는 주변 문서 구조에 맞춘 headingLevel을 사용합니다. 같은 이름과 액션을 두 헤더에 반복하지 않습니다.
- title은 필수입니다. visual, badge, description, details, actions는 선택 슬롯입니다.

## Accessibility

- badge는 제목에 붙는 인증 또는 현재 상태입니다. 색이나 아이콘만 두지 말고 visible text, aria-label, 또는 동등한 비색상 이름을 제공합니다.

## Related components

| Component | Relationship |
| --- | --- |
| `Avatar` | 대표 시나리오에서 조합 |
| `Button` | 대표 시나리오에서 조합 |
| `Icon` | 대표 시나리오에서 조합 |
| `IconButton` | 대표 시나리오에서 조합 |
| `StatList` | 대표 시나리오에서 조합 |
| `StatusBadge` | 대표 시나리오에서 조합 |
| `ConnectionRow` | 대표 시나리오에서 조합 |
| `ContentEditor` | 대표 시나리오에서 조합 |

## Examples

### 기본 조합

```jsx
<RecordHeader
  size="sm"
  visual={<Avatar name="장진혁" size="xlarge" />}
  title="장진혁"
  badge={<StatusBadge tone="positive">인증됨</StatusBadge>}
  description="Physical AI Engineer · 신입 · 개발"
  details={<StatList items={profileStats} />}
  actions={<Button variant="outlined">설정</Button>}
/>
```

## Tokens and API

### Tokens

- `--color-semantic-label-neutral`
- `--color-semantic-label-normal`
- `--color-semantic-label-strong`
- `--font-sans`
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
- `--space-1`
- `--space-2`
- `--space-3`
- `--space-4`

### Source contracts

- `components/content/RecordHeader.jsx`
- `components/content/RecordHeader.d.ts`
- `components/content/RecordHeader.prompt.md`
- `stories/ContentRecordHeader.stories.jsx`

## Sources

- RecordHeader prompt contract: `components/content/RecordHeader.prompt.md`
- Storybook implementation evidence: `stories/ContentRecordHeader.stories.jsx`
- [Primer PageHeader](https://primer.style/product/components/page-header/guidelines/)
- [Shopify Page](https://shopify.dev/docs/api/app-home/web-components/layout-and-structure/page)
- [Atlassian Page Header](https://atlassian.design/components/page-header/)
- [PatternFly Page Header](https://www.patternfly.org/component-groups/content-containers/page-header/)
- [PatternFly Masthead](https://www.patternfly.org/components/masthead/design-guidelines/)
- [WCAG 2.2 Reflow](https://www.w3.org/TR/WCAG22/#reflow)
- [MUI density guidance](https://mui.com/material-ui/customization/density/)
- [Carbon Data Table usage](https://carbondesignsystem.com/components/data-table/usage/)
