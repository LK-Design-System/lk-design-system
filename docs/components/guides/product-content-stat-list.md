# Stat List

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Product / Content |
| Owner | `StatList` |
| Storybook | `LDS Product/Content/Stat List` |
| Source | `../component-content.json#product-content-stat-list` |

프로필·계정 마스트헤드의 메타 행이나 조직·리소스 요약처럼 라벨과 수가 짝지어 이어질 때 적합합니다. 값이 크게 서는 대시보드 지표 타일이나 헤어라인이 있는 블록형 사양 표에는 이 컴포넌트를 사용하지 마세요.

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `items` | `StatListItem[]` | No | 라벨-값 쌍 목록. 비어 있으면 아무것도 렌더하지 않습니다. |
| `size` | `'sm' \| 'md'` | No | 텍스트 크기. @default "md" |

## Behavior and interaction

- 수의 계산·포맷(축약 등)과 route는 제품이 소유합니다. 큰 수를 줄이려면 값에 이미 축약된 문자열을 넣으세요.

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 명시 규칙 1 | 시맨틱 목록 — ul role="list" + li로 렌더되어 보조기기가 "3개 중 2번째"처럼 개수와 위치를 낭독합니다. 맨 텍스트를 가운뎃점으로 잇지 않는 이유이기도 합니다(구분 기호는 낭독 소음이 됩니다). |
| 명시 규칙 2 | href가 있으면 항목이 링크 — 접근 이름은 라벨+값(팔로워 128)으로 합성됩니다. 숫자만 링크로 두면 스크린리더 사용자가 무엇의 개수인지 모른 채 도달하므로, 값만 링크로 만들지 않습니다. |
| 명시 규칙 3 | StatList — 라벨 붙은 스탯을 한 줄에 나열하는 인라인 목록: 팔로워 128 · 팔로잉 64 · 포인트 3,000P. 프로필·계정 마스트헤드의 메타 행, 조직 요약, 리소스 헤더에. |
| --body2-size | 15px |
| --caption1-size | {"fontSize":"12px","lineHeight":"16px","letterSpacing":"0.0252em"} |

## Responsive

- size sm · md. 좁은 폭에서는 항목이 다음 줄로 wrap됩니다.

## Content and writing

- items — { label, value, href } 배열. 비어 있으면 아무것도 렌더하지 않습니다. 라벨이 앞, 값이 뒤에 오고 값은 굵게·tabular-nums로 정렬되어 자릿수가 흔들리지 않습니다.
- Stat과 다르다 — Stat은 값이 크게 서고 캡션이 아래 붙는 대시보드 메트릭 타일입니다. 여기 스탯은 한 줄에 라벨-값이 인라인으로 이어지는 헤더 메타 행이라 조판 목적이 다릅니다.
- DescriptionList와 다르다 — DescriptionList는 헤어라인 행을 가진 블록형 키/값 표(사양) 이고 href가 없습니다. StatList는 인라인·컴팩트하며 항목이 링크가 됩니다.
- 레코드 헤더와 조합합니다 — 프로필·로봇·주문처럼 대상 자체를 식별할 때는 레코드 헤더의 details 슬롯에 StatList를 넣습니다. StatList 자체는 제목·visual·설명·액션을 소유하지 않습니다.

## Accessibility

- 레코드/프로필 헤더의 "라벨 붙은 detail row"에서 도출했습니다. 접근성 근거는 스탯을 시맨틱 목록으로 묶고 이동하는 스탯은 링크로 둔다는 관례입니다.

## Related components

| Component | Relationship |
| --- | --- |
| `ContentEditor` | 대표 시나리오에서 조합 |
| `ExpandableText` | 대표 시나리오에서 조합 |
| `LogViewer` | 대표 시나리오에서 조합 |
| `ReactionBar` | 대표 시나리오에서 조합 |
| `RecordHeader` | 대표 시나리오에서 조합 |
| `ReorderList` | 대표 시나리오에서 조합 |
| `SourceDisclosure` | 대표 시나리오에서 조합 |

## Examples

### 기본 조합

```jsx
<StatList
  items={[
    { label: '팔로워', value: 128, href: '/followers' },
    { label: '팔로잉', value: 64, href: '/following' },
    { label: '포인트', value: '3,000P' },
  ]}
/>
```

## Tokens and API

### Tokens

- `--body2-size`
- `--caption1-size`
- `--color-semantic-label-alternative`
- `--color-semantic-label-strong`
- `--fw-bold`
- `--space-1`
- `--space-3`

### Source contracts

- `components/content/StatList.jsx`
- `components/content/StatList.d.ts`
- `components/content/StatList.prompt.md`
- `stories/ContentStatList.stories.jsx`

## Sources

- StatList prompt contract: `components/content/StatList.prompt.md`
- Storybook implementation evidence: `stories/ContentStatList.stories.jsx`
