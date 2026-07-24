# Data Toolbar

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Product / Operations |
| Owner | `DataToolbar` |
| Storybook | `LDS Product/Data/Operations/Data Toolbar` |
| Source | `../component-content.json#product-data-operations-data-toolbar` |

표나 그리드 바로 위에서 검색·필터·결과 수·페이지 수준 action을 함께 제공할 때 적합합니다. 선택된 행에만 적용되는 bulk action이나 전역 앱 명령에는 Data Toolbar 대신 선택 band 또는 Command Bar를 사용하세요.

## 사용 판단

### 사용

- 표나 그리드 바로 위에서 검색·필터·결과 수·페이지 수준 action을 함께 제공할 때 적합합니다. 선택된 행에만 적용되는 bulk action이나 전역 앱 명령에는 Data Toolbar 대신 선택 band 또는 Command Bar를 사용하세요.
- Carbon Data table usage는 기본 table toolbar를 검색·필터·설정·export 같은 global action에, 선택 후 batch action bar를 선택 항목 작업에 사용합니다. LDS도 이 소유권 분리를 따릅니다.
- - 검색은 제어/비제어 모두 가능합니다. searchValue와 onSearchChange를 주면 제어됩니다. - filters는 query를 좁히는 chip/menu 슬롯, actions는 열 표시·순서 설정 trigger, 내보내기 같은 전체 표 action 슬롯입니다. 설정 UI와 저장 상태는 제품이 소유하고 visibleColumnKeys/columnOrder로 DataGrid에 전달합니다. - selectedCount와 bulkActions는 DataToolbar props가 아닙니다. 선택 수, 선택 해제, bulk action은 DataGrid의 같은….
- Data Toolbar가 소유하는 Operations 의미와 상태를 여러 제품 화면에서 동일하게 재사용할 때 사용합니다.

### 사용하지 않음

- WAI-ARIA APG Table pattern에 따라 DataToolbar가 표의 native semantics나 keyboard model을 대신하지 않습니다. 검색과 action은 각 native control의 정상 Tab 순서를 유지합니다.
- Classification: LK Product Extension. 선택 상태와 bulk action은 DataGrid가 소유하며 DataToolbar API에 중복하지 않습니다.
- - 검색은 제어/비제어 모두 가능합니다. searchValue와 onSearchChange를 주면 제어됩니다. - filters는 query를 좁히는 chip/menu 슬롯, actions는 열 표시·순서 설정 trigger, 내보내기 같은 전체 표 action 슬롯입니다. 설정 UI와 저장 상태는 제품이 소유하고 visibleColumnKeys/columnOrder로 DataGrid에 전달합니다. - selectedCount와 bulkActions는 DataToolbar props가 아닙니다. 선택 수, 선택 해제, bulk action은 DataGrid의 같은….
- Data Toolbar가 소유하지 않는 라우팅, 권한, 데이터 요청, 제품 임계값을 컴포넌트 내부에 넣지 않습니다.

## Anatomy

| Part | Contract |
| --- | --- |
| Root | DataToolbar의 semantic role, layout containment와 전달받은 DOM 속성을 소유합니다. |
| Title | 테이블/그리드 제목. |
| Description | 제목 아래 설명. |
| Actions | 우측 일반 액션 슬롯. |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `title` | `React.ReactNode` | No | 테이블/그리드 제목. |
| `description` | `React.ReactNode` | No | 제목 아래 설명. |
| `count` | `number` | No | 전체 결과 수. |
| `searchValue` | `string` | No | 제어 검색어. |
| `defaultSearchValue` | `string` | No | 비제어 검색어 초기값. @default "" |
| `onSearchChange` | `(value: string) = void` | No | 검색어 변경 콜백. |
| `searchPlaceholder` | `string` | No | 검색 input placeholder와 accessible name. @default "검색" |
| `filters` | `React.ReactNode` | No | 필터 chip/menu 슬롯. |
| `actions` | `React.ReactNode` | No | 우측 일반 액션 슬롯. |
| `size` | `'sm' \| 'md'` | No | 밀도. @default "md" |
| `variant` | `'standalone' \| 'embedded'` | No | 외곽선 소유. "embedded"는 툴바 자체 테두리·radius를 제거하고 하단 divider만 남겨, 부모 표면(section·Card) 안에서 헤더로 결합합니다. @default "standalone" |

## States

| State | Contract |
| --- | --- |
| variant | 외곽선 소유. "embedded"는 툴바 자체 테두리·radius를 제거하고 하단 divider만 남겨, 부모 표면(section·Card) 안에서 헤더로 결합합니다. @default "standalone" 타입 계약: 'standalone' \| 'embedded' |

## Behavior and interaction

- 검색은 제어/비제어 모두 가능합니다. searchValue와 onSearchChange를 주면 제어됩니다.
- filters는 query를 좁히는 chip/menu 슬롯, actions는 열 표시·순서 설정 trigger, 내보내기 같은 전체 표 action 슬롯입니다. 설정 UI와 저장 상태는 제품이 소유하고 visibleColumnKeys/columnOrder로 DataGrid에 전달합니다.
- selectedCount와 bulkActions는 DataToolbar props가 아닙니다. 선택 수, 선택 해제, bulk action은 DataGrid의 같은 높이 selection band에 둡니다.
- Pagination은 DataToolbar 안에 넣지 않습니다. DataGrid 바로 아래에 별도 Pagination을 붙이고 page/pageSize/query를 제품이 제어합니다.
- Carbon Data table usage는 기본 table toolbar를 검색·필터·설정·export 같은 global action에, 선택 후 batch action bar를 선택 항목 작업에 사용합니다. LDS도 이 소유권 분리를 따릅니다.

## 정량 규칙

| Subject | Rule |
| --- | --- |
| --body1-line | {"fontSize":"16px","lineHeight":"24px","letterSpacing":"0.0057em"} |
| --body1-size | {"fontSize":"16px","lineHeight":"24px","letterSpacing":"0.0057em"} |
| --body2-line | 22px |
| --body2-size | 15px |

## Responsive

- filters는 query를 좁히는 chip/menu 슬롯, actions는 열 표시·순서 설정 trigger, 내보내기 같은 전체 표 action 슬롯입니다. 설정 UI와 저장 상태는 제품이 소유하고 visibleColumnKeys/columnOrder로 DataGrid에 전달합니다.
- selectedCount와 bulkActions는 DataToolbar props가 아닙니다. 선택 수, 선택 해제, bulk action은 DataGrid의 같은 높이 selection band에 둡니다.
- - 검색은 제어/비제어 모두 가능합니다. searchValue와 onSearchChange를 주면 제어됩니다. - filters는 query를 좁히는 chip/menu 슬롯, actions는 열 표시·순서 설정 trigger, 내보내기 같은 전체 표 action 슬롯입니다. 설정 UI와 저장 상태는 제품이 소유하고 visibleColumnKeys/columnOrder로 DataGrid에 전달합니다. - selectedCount와 bulkActions는 DataToolbar props가 아닙니다. 선택 수, 선택 해제, bulk action은 DataGrid의 같은….
- 320px 좁은 폭과 200% 텍스트 확대에서 페이지 가로 overflow 없이 의미 순서를 유지합니다.

## Content and writing

- DataToolbar — DataGrid/Table 위에서 제목, 결과 수, 검색, 필터, page-level action을 정렬하는 표면.
- 사용자에게 보이는 Data Toolbar 문자열은 제품 번역 계층에서 제공하고 행동 또는 상태를 구체적으로 설명합니다.
- 아이콘이나 색상만으로 의미를 대신하지 않고 필요한 label, title 또는 status text를 함께 제공합니다.

## Accessibility

- WAI-ARIA APG Table pattern에 따라 DataToolbar가 표의 native semantics나 keyboard model을 대신하지 않습니다. 검색과 action은 각 native control의 정상 Tab 순서를 유지합니다.
- - 검색은 제어/비제어 모두 가능합니다. searchValue와 onSearchChange를 주면 제어됩니다. - filters는 query를 좁히는 chip/menu 슬롯, actions는 열 표시·순서 설정 trigger, 내보내기 같은 전체 표 action 슬롯입니다. 설정 UI와 저장 상태는 제품이 소유하고 visibleColumnKeys/columnOrder로 DataGrid에 전달합니다. - selectedCount와 bulkActions는 DataToolbar props가 아닙니다. 선택 수, 선택 해제, bulk action은 DataGrid의 같은….
- native semantic을 우선하며 사용자에게 보이는 이름과 접근 가능한 이름이 같은 목적을 설명하게 합니다.
- 키보드 focus 순서, focus-visible 표시와 상태 ARIA가 시각 상태와 동시에 갱신되는지 공개 스토리에서 검증합니다.
- 색상, 모양 또는 아이콘 하나만으로 상태를 구분하지 않고 이름·텍스트·semantic state를 함께 제공합니다.

## Do / Don't

| Kind | Guidance |
| --- | --- |
| Do | Carbon Data table usage는 기본 table toolbar를 검색·필터·설정·export 같은 global action에, 선택 후 batch action bar를 선택 항목 작업에 사용합니다. LDS도 이 소유권 분리를 따릅니다. |
| Don't | WAI-ARIA APG Table pattern에 따라 DataToolbar가 표의 native semantics나 keyboard model을 대신하지 않습니다. 검색과 action은 각 native control의 정상 Tab 순서를 유지합니다. |
| Do | - 검색은 제어/비제어 모두 가능합니다. searchValue와 onSearchChange를 주면 제어됩니다. - filters는 query를 좁히는 chip/menu 슬롯, actions는 열 표시·순서 설정 trigger, 내보내기 같은 전체 표 action 슬롯입니다. 설정 UI와 저장 상태는 제품이 소유하고 visibleColumnKeys/columnOrder로 DataGrid에 전달합니다. - selectedCount와 bulkActions는 DataToolbar props가 아닙니다. 선택 수, 선택 해제, bulk action은 DataGrid의 같은…. |
| Don't | Classification: LK Product Extension. 선택 상태와 bulk action은 DataGrid가 소유하며 DataToolbar API에 중복하지 않습니다. |

## Exceptions

- 제품 정책을 포함해야 하는 예외는 wrapper 또는 제품 저장소에서 조합하고 DataToolbar의 범용 API에 넣지 않습니다.
- 접근성 또는 안전 계약을 약화하는 예외는 허용하지 않으며 필요한 차이는 prompt와 Storybook 증거에 기록합니다.

## Related components

| Component | Relationship |
| --- | --- |
| `Button` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `DataGrid` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `FilterChip` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `Icon` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `TextButton` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `AnnotatedImage` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `BarChart` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `Calendar` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |

## Examples

### 기본 조합

```jsx
<DataToolbar
  title="사용자 목록"
  description="조직에 등록된 계정"
  count={24}
  searchValue={query}
  onSearchChange={setQuery}
  searchPlaceholder="사용자 검색"
  filters={<FilterChip active>온라인</FilterChip>}
  actions={<Button size="sm">내보내기</Button>}
/>
```

## Tokens and API

### Tokens

- `--body1-line`
- `--body1-size`
- `--body2-line`
- `--body2-size`
- `--color-semantic-background-elevated-normal`
- `--color-semantic-label-alternative`
- `--color-semantic-label-strong`
- `--color-semantic-line-solid-normal`
- `--component-button-height-md`
- `--component-button-height-sm`
- `--font-sans`
- `--fw-medium`
- `--fw-semibold`
- `--label2-line`
- `--label2-size`
- `--radius-md`
- `--space-2`
- `--space-3`

### Source contracts

- `components/data/DataToolbar.jsx`
- `components/data/DataToolbar.d.ts`
- `components/data/DataToolbar.prompt.md`
- `stories/DataToolbar.stories.jsx`

## Migration

- 현재 prompt와 타입 계약에 기록되지 않은 legacy alias는 새 코드에서 도입하지 않습니다.
- 대체 컴포넌트가 생기면 기존 API의 제거 버전, 대응 prop과 자동·수동 전환 절차를 이 페이지에 기록합니다.

## Sources

- DataToolbar prompt contract: `components/data/DataToolbar.prompt.md`
- Storybook implementation evidence: `stories/DataToolbar.stories.jsx`
- [Carbon Data table usage](https://carbondesignsystem.com/components/data-table/usage/)
- [Carbon Pagination usage](https://carbondesignsystem.com/components/pagination/usage/)
- [WAI-ARIA APG Table pattern](https://www.w3.org/WAI/ARIA/apg/patterns/table/)
