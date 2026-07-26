# Spec Row

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Product / Content |
| Owner | `SpecRow` |
| Storybook | `LDS Product/Content/Spec Row` |
| Source | `../component-content.json#product-content-spec-row` |

제품 제원이나 읽기 전용 설정처럼 짧은 label/value 쌍을 일정한 간격으로 보여 줄 때 적합합니다. 정렬·정렬 변경이 필요한 대규모 데이터나 편집 입력에는 SpecRow 대신 Table 또는 Form Field를 사용하세요.

## Anatomy

| Part | Contract |
| --- | --- |
| label | 스펙 이름(왼쪽, 뮤트 — label-alternative). dt로 렌더됩니다. |
| labelWidth | 라벨 컬럼 폭. DescriptionList와 동일 비율. @default "34%" |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `label` | `React.ReactNode` | No | 스펙 이름(왼쪽, 뮤트 — label-alternative). dt로 렌더됩니다. |
| `value` | `React.ReactNode` | No | 스펙 값(오른쪽 — label-normal, tabular-nums). dd로 렌더됩니다. |
| `labelWidth` | `string` | No | 라벨 컬럼 폭. DescriptionList와 동일 비율. @default "34%" |
| `divider` | `boolean` | No | 하단 헤어라인. 목록의 마지막 행에서 false로 끕니다. @default true |
| `grouped` | `boolean` | No | 여러 행이 하나의 사양표를 이룰 때 사용합니다. 호출부가 바깥에 dl을 두고 각 행에 grouped를 주면 행은 dl의 유효한 래퍼(div)로 렌더되어 사양표 전체가 하나의 정의 목록으로 읽힙니다. 기본값(false)에서는 행 자체가 단일 쌍 dl이 됩니다. |

## Behavior and interaction

- divider: 기본 true. 마지막 행에만 divider={false}를 주어 목록이 컨테이너 모서리에서 닫히게 하고 헤어라인이 홀로 남지 않게 합니다.
- 정렬·필터가 필요한 대규모 데이터는 Table, 편집 가능한 값은 Form Field를 쓰세요.

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 명시 규칙 1 | 키/값 시맨틱: label은 dt, value는 dd로 렌더되어 보조기술이 "이름 → 값" 쌍으로 읽습니다(WCAG 1.3.1). 시각 문법(34% 라벨 컬럼)만 DescriptionList와 공유하는 것이 아니라 시맨틱도 같습니다. |
| 명시 규칙 2 | labelWidth: 라벨 컬럼 폭(기본 "34%"). 라벨이 길어 두 줄로 접힐 때만 조정하고, 같은 표 안의 행들은 같은 값을 유지해 값 컬럼이 어긋나지 않게 합니다. |
| 명시 규칙 3 | SpecRow — 제품 스펙 표의 키/값 한 행. 하단 헤어라인, 라벨 34% 컬럼(DescriptionList와 같은 문법), 값은 tabular-nums. 시맨틱 토큰만 사용하므로 라이트 시트에 그대로, 네이비 무대에선 data-theme="dark" 래퍼 안에 쌓으세요. |
| --body2-line | 22px |
| --body2-size | 15px |

## Related components

| Component | Relationship |
| --- | --- |
| `Card` | 대표 시나리오에서 조합 |
| `ChecklistItem` | 대표 시나리오에서 조합 |
| `FeatureCard` | 대표 시나리오에서 조합 |
| `FeedCard` | 대표 시나리오에서 조합 |
| `ListingCard` | 대표 시나리오에서 조합 |
| `MetricCard` | 대표 시나리오에서 조합 |
| `NewsCard` | 대표 시나리오에서 조합 |
| `ProductCard` | 대표 시나리오에서 조합 |

## Examples

### 기본 조합

```jsx
// 한 행짜리 — 행 자체가 단일 쌍 dl
<SpecRow label="크기" value="520 × 420 × 490 mm" />

// 여러 행이 한 사양표 — 바깥 dl + grouped
<dl style={{ margin: 0 }}>
  <SpecRow grouped label="크기" value="520 × 420 × 490 mm" />
  <SpecRow grouped label="밀도" value="compact · regular" />
  <SpecRow grouped label="테마" value="light · dark" divider={false} />
</dl>

// 네이비 제품 무대 위:
<div data-theme="dark">
  <SpecRow label="상태" value="active · review · disabled" />
</div>
```

## Tokens and API

### Tokens

- `--body2-line`
- `--body2-size`
- `--body2-spacing`
- `--color-semantic-label-alternative`
- `--color-semantic-label-normal`
- `--color-semantic-line-normal-normal`
- `--fw-semibold`
- `--label1-size`
- `--ls-small`

### Source contracts

- `components/cards/SpecRow.jsx`
- `components/cards/SpecRow.d.ts`
- `components/cards/SpecRow.prompt.md`
- `stories/CardSpecs.stories.jsx`

## Sources

- SpecRow prompt contract: `components/cards/SpecRow.prompt.md`
- Storybook implementation evidence: `stories/CardSpecs.stories.jsx`
