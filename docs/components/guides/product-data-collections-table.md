# Table

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Product / Collections |
| Owner | `Table` |
| Storybook | `LDS Product/Data/Collections/Table` |
| Source | `../component-content.json#product-data-collections-table` |

정렬이나 선택 없이 구조화된 레코드를 같은 열 기준으로 읽을 때 적합합니다. 사용자가 정렬·선택·페이지 이동이나 행 작업을 해야 하면 Table 대신 Data Grid를 사용하세요.

## 사용 판단

### 사용

- 정렬이나 선택 없이 구조화된 레코드를 같은 열 기준으로 읽을 때 적합합니다. 사용자가 정렬·선택·페이지 이동이나 행 작업을 해야 하면 Table 대신 Data Grid를 사용하세요.
- 결측 값은 공백이나 0으로 위장하지 말고 render에서 보이는 —와 스크린리더용 값 없음을 함께 제공합니다. 로딩·오류는 셀 placeholder가 아니라 표의 resource state로 분리합니다.
- tableLabelledBy — 표 밖에 이미 보이는 제목(heading 등)의 id를 연결해 의 aria-labelledby로 사용합니다. 보이는 제목이 있는 페이지에서는 이름을 중복 작성하지 말고 이 연결을 쓰세요.
- Reference: SAP Fiori data table usage recommends content-dependent alignment and right alignment for comparable numeric values.

### 사용하지 않음

- rowHeaderKey — 행을 식별하는 컬럼의 key입니다. 지정하면 그 컬럼의 셀이 대신 가 되어, 스크린 리더가 나머지 셀을 읽을 때 행 이름을 함께 낭독합니다. 시각 표현은 데이터 셀과 동일하게 유지되고 시맨틱만 바뀝니다. 장비 ID·자산 코드처럼 행을 유일하게 지시하는 컬럼 하나에만 쓰세요.
- tableLabel — 보이는 캡션이 없을 때 에 직접 붙는 aria-label입니다. 래퍼 div가 아니라 표에 이름이 필요하므로, 밖에서 넘긴 aria-label(래퍼로 전달됨) 대신 이 prop을 쓰세요.
- getRowId — React key로 쓸 안정적인 행 식별자를 반환합니다. 생략하면 row.id, 그것도 없으면 배열 index를 씁니다. 행이 갱신·재정렬되는 표에서는 호버 같은 행 로컬 상태가 엉뚱한 행에 남지 않도록 반드시 지정하세요.
- Header and body cells use font-variant-numeric: tabular-nums so values do not jitter between rows. Set align: 'right' on comparable numeric columns; nominal identifiers such as postal codes or equipment IDs remain left aligned.

## Anatomy

| Part | Contract |
| --- | --- |
| Root | Table의 semantic role, layout containment와 전달받은 DOM 속성을 소유합니다. |
| Caption | 표 위에 보이는 . 표의 접근 가능한 이름이 됩니다. |
| Table Label | 보이는 캡션이 없을 때 에 붙는 aria-label. |
| Table Labelled By | 표 밖의 제목 요소 id. 보이는 캡션이 없을 때 의 aria-labelledby가 됩니다. |
| Row Header Key | 행을 식별하는 컬럼 key. 지정하면 해당 셀이 로 렌더링됩니다. |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `columns` | `TableColumn[]` | Yes | 공개 타입 계약에 정의된 속성입니다. |
| `rows` | `Row[]` | Yes | 공개 타입 계약에 정의된 속성입니다. |
| `size` | `'sm' \| 'md'` | No | 행 밀도. @default "md" |
| `hover` | `boolean` | No | 행 호버 워시. @default true |
| `caption` | `React.ReactNode` | No | 표 위에 보이는 . 표의 접근 가능한 이름이 됩니다. |
| `tableLabel` | `string` | No | 보이는 캡션이 없을 때 에 붙는 aria-label. |
| `tableLabelledBy` | `string` | No | 표 밖의 제목 요소 id. 보이는 캡션이 없을 때 의 aria-labelledby가 됩니다. |
| `rowHeaderKey` | `keyof Row & string` | No | 행을 식별하는 컬럼 key. 지정하면 해당 셀이 로 렌더링됩니다. |
| `getRowId` | `(row: Row, index: number) = React.Key` | No | React key로 쓸 안정적인 행 식별자. 생략하면 row.id, 그다음 배열 index를 씁니다. |

## States

| State | Contract |
| --- | --- |
| Default | 별도 상태 머신을 만들지 않으며 전달된 콘텐츠와 semantic token으로 기본 표현을 구성합니다. |

## Behavior and interaction

- columns — { key, label, align, width, render }. rows — 데이터 객체. size sm · md. hover — 행 워시. 상태 점·링크·액션에는 render를 쓰세요.
- 한 컬럼에는 가능한 하나의 데이터 속성만 담으세요. 값, 상태, 수집 시각, 액션은 각각 독립 컬럼으로 분리하고, 비교/정렬해야 하는 표 셀 안에 값+시간처럼 서로 다른 데이터를 묶지 마세요.
- 열 헤더는 항상 입니다. 별도 prop이 필요 없으며 끌 수 없습니다.
- caption — 표 위에 보이는 이며 동시에 표의 접근 가능한 이름입니다. 표 제목이 표 자체에 속할 때 첫 번째 선택지입니다.
- tableLabel — 보이는 캡션이 없을 때 에 직접 붙는 aria-label입니다. 래퍼 div가 아니라 표에 이름이 필요하므로, 밖에서 넘긴 aria-label(래퍼로 전달됨) 대신 이 prop을 쓰세요.

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 명시 규칙 1 | 결측 값은 공백이나 0으로 위장하지 말고 render에서 보이는 —와 스크린리더용 값 없음을 함께 제공합니다. 로딩·오류는 셀 placeholder가 아니라 표의 resource state로 분리합니다. |
| 명시 규칙 2 | caption이 있으면 tableLabel과 tableLabelledBy는 무시됩니다. 보이는 캡션을 ARIA 이름으로 덮어쓰면 이름과 보이는 텍스트가 어긋나기 때문입니다(WCAG 2.5.3). |
| 명시 규칙 3 | - columns — { key, label, align, width, render }. rows — 데이터 객체. size sm · md. hover — 행 워시. 상태 점·링크·액션에는 render를 쓰세요. - 한 컬럼에는 가능한 하나의 데이터 속성만 담으세요. 값, 상태, 수집 시각, 액션은 각각 독립 컬럼으로 분리하고, 비교/정렬해야 하는 표 셀 안에 값+시간처럼 서로 다른 데이터를 묶지 마세요. - 결측 값은 공백이나 0으로 위장하지 말고 render에서 보이는 —와 스크린리더용 값 없음을 함께 제공합니다. 로딩·오류는 셀 placeholder가 아니라… |
| 명시 규칙 4 | 표 시맨틱 계약 (WCAG 1.3.1) |
| --color-semantic-fill-alternative | light: rgba(112, 115, 124, 0.05); dark: rgba(112, 115, 124, 0.12) |

## Responsive

- columns — { key, label, align, width, render }. rows — 데이터 객체. size sm · md. hover — 행 워시. 상태 점·링크·액션에는 render를 쓰세요.
- - columns — { key, label, align, width, render }. rows — 데이터 객체. size sm · md. hover — 행 워시. 상태 점·링크·액션에는 render를 쓰세요. - 한 컬럼에는 가능한 하나의 데이터 속성만 담으세요. 값, 상태, 수집 시각, 액션은 각각 독립 컬럼으로 분리하고, 비교/정렬해야 하는 표 셀 안에 값+시간처럼 서로 다른 데이터를 묶지 마세요. - 결측 값은 공백이나 0으로 위장하지 말고 render에서 보이는 —와 스크린리더용 값 없음을 함께 제공합니다. 로딩·오류는 셀 placeholder가 아니라….
- 320px 좁은 폭과 200% 텍스트 확대에서 페이지 가로 overflow 없이 의미 순서를 유지합니다.
- 고정 폭보다 부모 containment와 wrapping을 우선하고, 제품이 필요할 때 명시적으로 compact 표현을 선택합니다.

## Content and writing

- columns — { key, label, align, width, render }. rows — 데이터 객체. size sm · md. hover — 행 워시. 상태 점·링크·액션에는 render를 쓰세요.
- 결측 값은 공백이나 0으로 위장하지 말고 render에서 보이는 —와 스크린리더용 값 없음을 함께 제공합니다. 로딩·오류는 셀 placeholder가 아니라 표의 resource state로 분리합니다.
- rowHeaderKey — 행을 식별하는 컬럼의 key입니다. 지정하면 그 컬럼의 셀이 대신 가 되어, 스크린 리더가 나머지 셀을 읽을 때 행 이름을 함께 낭독합니다. 시각 표현은 데이터 셀과 동일하게 유지되고 시맨틱만 바뀝니다. 장비 ID·자산 코드처럼 행을 유일하게 지시하는 컬럼 하나에만 쓰세요.
- caption — 표 위에 보이는 이며 동시에 표의 접근 가능한 이름입니다. 표 제목이 표 자체에 속할 때 첫 번째 선택지입니다.

## Accessibility

- rowHeaderKey — 행을 식별하는 컬럼의 key입니다. 지정하면 그 컬럼의 셀이 대신 가 되어, 스크린 리더가 나머지 셀을 읽을 때 행 이름을 함께 낭독합니다. 시각 표현은 데이터 셀과 동일하게 유지되고 시맨틱만 바뀝니다. 장비 ID·자산 코드처럼 행을 유일하게 지시하는 컬럼 하나에만 쓰세요.
- tableLabel — 보이는 캡션이 없을 때 에 직접 붙는 aria-label입니다. 래퍼 div가 아니라 표에 이름이 필요하므로, 밖에서 넘긴 aria-label(래퍼로 전달됨) 대신 이 prop을 쓰세요.
- tableLabelledBy — 표 밖에 이미 보이는 제목(heading 등)의 id를 연결해 의 aria-labelledby로 사용합니다. 보이는 제목이 있는 페이지에서는 이름을 중복 작성하지 말고 이 연결을 쓰세요.
- caption이 있으면 tableLabel과 tableLabelledBy는 무시됩니다. 보이는 캡션을 ARIA 이름으로 덮어쓰면 이름과 보이는 텍스트가 어긋나기 때문입니다(WCAG 2.5.3).
- 표 시맨틱 계약 (WCAG 1.3.1).

## Do / Don't

| Kind | Guidance |
| --- | --- |
| Do | 결측 값은 공백이나 0으로 위장하지 말고 render에서 보이는 —와 스크린리더용 값 없음을 함께 제공합니다. 로딩·오류는 셀 placeholder가 아니라 표의 resource state로 분리합니다. |
| Don't | rowHeaderKey — 행을 식별하는 컬럼의 key입니다. 지정하면 그 컬럼의 셀이 대신 가 되어, 스크린 리더가 나머지 셀을 읽을 때 행 이름을 함께 낭독합니다. 시각 표현은 데이터 셀과 동일하게 유지되고 시맨틱만 바뀝니다. 장비 ID·자산 코드처럼 행을 유일하게 지시하는 컬럼 하나에만 쓰세요. |
| Do | tableLabelledBy — 표 밖에 이미 보이는 제목(heading 등)의 id를 연결해 의 aria-labelledby로 사용합니다. 보이는 제목이 있는 페이지에서는 이름을 중복 작성하지 말고 이 연결을 쓰세요. |
| Don't | tableLabel — 보이는 캡션이 없을 때 에 직접 붙는 aria-label입니다. 래퍼 div가 아니라 표에 이름이 필요하므로, 밖에서 넘긴 aria-label(래퍼로 전달됨) 대신 이 prop을 쓰세요. |

## Exceptions

- 제품 정책을 포함해야 하는 예외는 wrapper 또는 제품 저장소에서 조합하고 Table의 범용 API에 넣지 않습니다.
- 접근성 또는 안전 계약을 약화하는 예외는 허용하지 않으며 필요한 차이는 prompt와 Storybook 증거에 기록합니다.

## Related components

| Component | Relationship |
| --- | --- |
| `AnnotatedImage` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `BarChart` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `Calendar` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `ChartFrame` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `Carousel` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `DataGrid` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `DataToolbar` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `DataExportAction` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |

## Examples

### 기본 조합

```jsx
<Table
  caption="모델별 현장 상태"
  rowHeaderKey="code"
  getRowId={(row) => row.code}
  columns={[
    { key: 'code', label: '모델' },
    { key: 'site', label: '현장' },
    { key: 'status', label: '상태', render: (r) => <StatusBadge tone={r.tone}>{r.status}</StatusBadge> },
  ]}
  rows={[{ code: 'LKR-T1', site: '판교 물류센터', status: '가동중', tone: 'positive' }]}
/>
```

## Tokens and API

### Tokens

- `--color-semantic-fill-alternative`
- `--color-semantic-label-strong`
- `--dur-fast`
- `--ease-out`
- `--font-sans`
- `--fw-semibold`
- `--label1-line`
- `--label1-size`
- `--space-2`

### Source contracts

- `components/data/Table.jsx`
- `components/data/Table.d.ts`
- `components/data/Table.prompt.md`
- `stories/DataTable.stories.jsx`

## Migration

- 현재 prompt와 타입 계약에 기록되지 않은 legacy alias는 새 코드에서 도입하지 않습니다.
- 대체 컴포넌트가 생기면 기존 API의 제거 버전, 대응 prop과 자동·수동 전환 절차를 이 페이지에 기록합니다.

## Sources

- Table prompt contract: `components/data/Table.prompt.md`
- Storybook implementation evidence: `stories/DataTable.stories.jsx`
- [SAP Fiori data table usage](https://www.sap.com/design-system/fiori-design-android/v25-4/components/data-table/usage)
- [WAI-ARIA APG Table pattern](https://www.w3.org/WAI/ARIA/apg/patterns/table/)
