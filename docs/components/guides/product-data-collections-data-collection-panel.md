# Data Collection Panel

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Product / Collections |
| Owner | `DataCollectionPanel` |
| Storybook | `LDS Product/Data/Collections/Data Collection Panel` |
| Source | `../component-content.json#product-data-collections-data-collection-panel` |

독립된 검색·상태·본문·페이지네이션 표면이 반복될 때 사용하기 적합합니다. 단순 표의 가로 넘침만 필요하거나 제품 전용 명령 피드에는 사용하지 않습니다. 검색 값, 네트워크 상태, 행 의미, 권한, 좁은 항목 마크업과 페이지 상태는 제품이 계속 소유합니다.

## 사용 판단

### 사용

- 외곽선, radius, 배경, shadow는 기존 card component token을 사용하며 중첩 Card를 만들지 않습니다.

### 사용하지 않음

- footer는 보통 Pagination이며 page, pageSize, query 동기화는 제품이 제어합니다. 이동할 페이지가 없으면 prop을 생략합니다. 전달된 adapter가 null을 렌더링해도 빈 footer 구분선은 표시되지 않습니다.
- DataCollectionPanel은 검색·필터 도구막대, 리소스 상태, 목록 본문, 선택적 좁은 화면 본문, 페이지네이션을 하나의 연속된 표면으로 묶는 LK Product Extension입니다. 제품 화면을 복제하지 않으며 query, fetch, 권한, 행 의미, 정렬과 페이지 상태는 제품이 소유합니다.
- 새 아이콘이나 제품 asset은 추가하지 않습니다.

## Anatomy

| Part | Contract |
| --- | --- |
| toolbar | DataToolbar props. The panel always applies variant="embedded". |
| children | Wide/default collection content, commonly Table or DataGrid. |
| compactContent | Product-authored semantic narrow representation. Omit to preserve the wide content and its own overflow behavior. |
| footer | Footer content, commonly Pagination. Omit it when navigation is unnecessary; an adapter that renders null leaves no visible footer strip. |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `as` | `React.ElementType` | No | Root element. Name a section with aria-label or aria-labelledby when it should be a landmark. @default "section" |
| `toolbar` | `Omit` | No | DataToolbar props. The panel always applies variant="embedded". |
| `resourceState` | `Omit` | No | ResourceState props. The panel owns its children and always applies messageVariant="embedded". |
| `children` | `React.ReactNode` | No | Wide/default collection content, commonly Table or DataGrid. |
| `compactContent` | `React.ReactNode` | No | Product-authored semantic narrow representation. Omit to preserve the wide content and its own overflow behavior. |
| `footer` | `React.ReactNode` | No | Footer content, commonly Pagination. Omit it when navigation is unnecessary; an adapter that renders null leaves no visible footer strip. |
| `layout` | `'auto' \| 'wide' \| 'narrow'` | No | Responsive content policy. auto switches at a 767px container width only when compactContent exists. @default "auto" |
| `classNames` | `LdsClassNames` | No |  |
| `styles` | `LdsStyles` | No |  |
| `vars` | `LdsVars` | No |  |

## States

| State | Contract |
| --- | --- |
| resourceState | ResourceState props. The panel owns its children and always applies messageVariant="embedded". |

## Behavior and interaction

- children은 기본·넓은 본문입니다. 정적 표 데이터에는 native Table, 선택·정렬·편집이 필요한 데이터에는 DataGrid를 사용합니다.
- classNames와 styles의 stable part는 root, toolbar, state, wideContent, compactContent, footer입니다.
- Carbon Data Table usage는 검색·필터·설정·action이 있는 toolbar를 table 상단에, pagination을 하단에 배치합니다.
- W3C WAI Tables와 table tips는 native header association과 작은 화면에서도 구조적 관계를 보존할 것을 요구합니다.

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 명시 규칙 1 | layout="auto"는 패널 컨테이너가 767px 이하이고 compactContent가 있을 때만 넓은 본문을 숨기고 좁은 본문을 표시합니다. |
| --color-semantic-line-normal-normal | light: rgba(112, 115, 124, 0.22); dark: rgba(112, 115, 124, 0.32) |
| --space-3 | 12px |
| --space-4 | 16px |

## Responsive

- compactContent는 제품이 직접 작성한 의미 있는 좁은 화면 표현입니다. 패널은 table row를 임의로 card로 변환하지 않습니다.
- 초기 loading/error처럼 아직 표시할 데이터가 없을 때는 children과 compactContent를 넘기지 않습니다. 마지막 정상 데이터를 유지하는 refreshing/error/stale/offline 상태에서만 두 본문을 함께 넘겨 상태 메시지와 데이터를 보존합니다.
- compactContent가 없으면 좁은 화면에서도 children을 유지합니다. Table의 native 구조와 가로 overflow가 보존됩니다.
- layout="wide" | "narrow"는 테스트, 임베디드 레이아웃, 명시적 제품 topology를 위한 결정적 override입니다.

## Content and writing

- 읽기 순서는 toolbar → resource message → active content → freshness → footer입니다.
- 화면 제목이나 상위 facet이 이미 collection의 이름과 개수를 설명한다면 toolbar.title과 toolbar.count를 생략해 같은 정보를 반복하지 않습니다.
- resourceState는 ResourceState props를 받고 패널이 children과 messageVariant="embedded"를 소유합니다.
- 정적 표는 caption, tableLabel, tableLabelledBy, 를 사용해 행·열 관계를 유지합니다.

## Accessibility

- 두 본문은 DOM에 같은 순서로 존재하지만 한 번에 하나만 CSS display에 참여하므로 숨겨진 중복 콘텐츠와 focus target은 접근성 트리와 Tab 순서에서 제외됩니다.
- 기본 root는 section입니다. landmark로 노출할 때 aria-label 또는 aria-labelledby로 이름을 제공합니다.
- 패널은 자체 keyboard model을 만들지 않습니다. 검색, 필터, 행 action, Pagination은 각 native/LDS control의 DOM 순서대로 이동합니다.

## Related components

| Component | Relationship |
| --- | --- |
| `Button` | 대표 시나리오에서 조합 |
| `Checkbox` | 대표 시나리오에서 조합 |
| `DataGrid` | 대표 시나리오에서 조합 |
| `Pagination` | 대표 시나리오에서 조합 |
| `Select` | 대표 시나리오에서 조합 |
| `StatusBadge` | 대표 시나리오에서 조합 |
| `Table` | 대표 시나리오에서 조합 |
| `AnnotatedImage` | 대표 시나리오에서 조합 |

## Examples

### 기본 조합

```jsx
<DataCollectionPanel
  aria-label="프로젝트 목록"
  toolbar={{
    size: 'sm',
    searchValue: query,
    onSearchChange: setQuery,
    filters: <SortControl />,
  }}
  resourceState={{ state: requestState, title: stateTitle }}
  compactContent={hasRows ? <ProjectList projects={projects} /> : undefined}
  footer={pageCount > 1 ? <Pagination page={page} count={pageCount} onChange={setPage} /> : undefined}
>
  {hasRows ? <Table tableLabel="프로젝트" columns={columns} rows={projects} rowHeaderKey="name" /> : null}
</DataCollectionPanel>
```

## Tokens and API

### Tokens

- `--color-semantic-line-normal-normal`
- `--component-card-bg`
- `--component-card-border`
- `--component-card-fg`
- `--component-card-radius`
- `--component-card-shadow-sm`
- `--font-sans`
- `--lds-data-collection-panel-footer-padding`
- `--lds-data-collection-panel-min-height`
- `--space-3`
- `--space-4`

### Source contracts

- `components/data/DataCollectionPanel.jsx`
- `components/data/DataCollectionPanel.d.ts`
- `components/data/DataCollectionPanel.prompt.md`
- `stories/DataCollectionPanel.stories.jsx`

## Sources

- DataCollectionPanel prompt contract: `components/data/DataCollectionPanel.prompt.md`
- Storybook implementation evidence: `stories/DataCollectionPanel.stories.jsx`
- [Carbon Data Table usage](https://v10.carbondesignsystem.com/components/data-table/usage/)
- [PatternFly Toolbar guidelines](https://www.patternfly.org/components/toolbar/design-guidelines/)
- [Pagination guidelines](https://www.patternfly.org/components/pagination/design-guidelines/)
- [W3C WAI Tables](https://www.w3.org/WAI/tutorials/tables/)
- [table tips](https://www.w3.org/WAI/tutorials/tables/tips/)
