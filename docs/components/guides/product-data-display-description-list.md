# Description List

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Product / Display |
| Owner | `DescriptionList` |
| Storybook | `LDS Product/Data/Display/Description List` |
| Source | `../component-content.json#product-data-display-description-list` |

한 객체의 제원·담당자·점검일처럼 소수의 용어와 값을 설명할 때 적합합니다. 많은 행을 정렬·탐색하거나 여러 객체를 비교해야 하면 Description List 대신 Table 또는 Data Grid를 사용하세요.

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `items` | `DescriptionItem[]` | Yes |  |
| `columns` | `number` | No | 쌍의 그리드 컬럼 수. @default 1 |
| `variant` | `'default' \| 'stacked'` | No | stacked는 좁은 패널·카드용으로 용어를 값 위에 쌓고 값을 regular 굵기로 표시합니다. @default "default" |

## States

| State | Contract |
| --- | --- |
| variant | stacked는 좁은 패널·카드용으로 용어를 값 위에 쌓고 값을 regular 굵기로 표시합니다. @default "default" |

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 명시 규칙 1 | 타입 스케일 정합: 값(dd) 14.5px → --body2-size(15px)로 스냅했습니다. 14px 용어(dt)보다 한 단계 위를 유지해 term/description 위계가 살아 있습니다. |
| --body2-line | 22px |
| --body2-size | 15px |
| --caption1-line | {"fontSize":"12px","lineHeight":"16px","letterSpacing":"0.0252em"} |
| --caption1-size | {"fontSize":"12px","lineHeight":"16px","letterSpacing":"0.0252em"} |

## Responsive

- items — { term, description }. columns — 쌍의 반응형 그리드.
- variant="stacked" — 좁은 상세 패널·카드용. 용어를 값 위에 쌓아 고정 용어 열의 폭 낭비를 없애고, 값을 regular 굵기로 두어 일부 값(badge 등)만 강조가 살도록 합니다(Salesforce·Jira 상세 패널의 stacked field 관행). 넓은 사양·제원 표면에는 기본형을 유지합니다.

## Content and writing

- DescriptionList — 키/값 쌍(사양, 제원).

## Related components

| Component | Relationship |
| --- | --- |
| `TextButton` | 대표 시나리오에서 조합 |
| `AnnotatedImage` | 대표 시나리오에서 조합 |
| `BarChart` | 대표 시나리오에서 조합 |
| `Carousel` | 대표 시나리오에서 조합 |
| `ChartFrame` | 대표 시나리오에서 조합 |
| `DataCollectionPanel` | 대표 시나리오에서 조합 |
| `DataExportAction` | 대표 시나리오에서 조합 |
| `DataGrid` | 대표 시나리오에서 조합 |

## Examples

### 기본 조합

```jsx
<DescriptionList columns={2} items={[
  { term: '주행 속도', description: '최대 1.5 m/s' },
  { term: '운영 시간', description: '8시간 (연속)' },
  { term: '방수·방진', description: 'IP65' },
]} />
```

## Tokens and API

### Tokens

- `--body2-line`
- `--body2-size`
- `--caption1-line`
- `--caption1-size`
- `--color-semantic-label-alternative`
- `--color-semantic-label-normal`
- `--color-semantic-line-solid-normal`
- `--font-sans`
- `--fw-semibold`
- `--label1-size`
- `--space-1`
- `--space-4`

### Source contracts

- `components/data/DescriptionList.jsx`
- `components/data/DescriptionList.d.ts`
- `components/data/DescriptionList.prompt.md`
- `stories/DataDescriptionList.stories.jsx`

## Sources

- DescriptionList prompt contract: `components/data/DescriptionList.prompt.md`
- Storybook implementation evidence: `stories/DataDescriptionList.stories.jsx`
