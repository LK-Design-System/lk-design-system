# Checklist Item

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Product / Content |
| Owner | `ChecklistItem` |
| Storybook | `LDS Product/Content/Checklist Item` |
| Source | `../component-content.json#product-content-checklist-item` |

작업 기준이나 준비 항목처럼 짧은 목록의 완료·제외 상태를 읽게 할 때 적합합니다. 순서가 있는 절차나 직접 체크해야 하는 입력에는 정적 ChecklistItem 대신 Steps 또는 Checkbox를 사용하세요.

## 사용 판단

### 사용

- 정적 표시 전용입니다. 사용자가 직접 켜고 끄는 항목은 Checkbox, 순서가 의미인 절차는 Steps를 쓰세요.

## Anatomy

| Part | Contract |
| --- | --- |
| stateLabel | 포함/제외 상태의 텍스트 대안(시각적으로 숨겨져 스크린리더에만 전달). 기본값은 cross에 따라 "포함" 또는 "제외"이며, 다른 어휘가 필요하면 직접 지정합니다(예: "지원" / "미지원"). 주변 문맥이 이미 상태를 전달할 때만 null로 끄세요. |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `cross` | `boolean` | No | 시그널 잉크 체크 대신 레드 크로스 + 취소선 표시(제외 항목). @default false |
| `muted` | `boolean` | No | 라벨을 흐리게(약한 톤) 표시. 취소선은 cross가 담당합니다. @default false |
| `dark` | `boolean` | No | 다크 서피스에 렌더. @default false |
| `as` | `'li' \| 'div'` | No | 행 엘리먼트. 기본은 li — 여러 행은 ul/ol 안에 넣어 목록으로 읽히게 합니다. 목록이 아닌 단독 행에만 "div"를 쓰세요. |
| `stateLabel` | `React.ReactNode` | No | 포함/제외 상태의 텍스트 대안(시각적으로 숨겨져 스크린리더에만 전달). 기본값은 cross에 따라 "포함" 또는 "제외"이며, 다른 어휘가 필요하면 직접 지정합니다(예: "지원" / "미지원"). 주변 문맥이 이미 상태를 전달할 때만 null로 끄세요. |
| `children` | `React.ReactNode` | No |  |

## States

| State | Contract |
| --- | --- |
| stateLabel | 포함/제외 상태의 텍스트 대안(시각적으로 숨겨져 스크린리더에만 전달). 기본값은 cross에 따라 "포함" 또는 "제외"이며, 다른 어휘가 필요하면 직접 지정합니다(예: "지원" / "미지원"). 주변 문맥이 이미 상태를 전달할 때만 null로 끄세요. |

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 명시 규칙 1 | 상태를 색·아이콘으로만 전달하지 않습니다. 체크/크로스 글리프와 취소선은 장식(aria-hidden)이고, 포함·제외 상태는 시각적으로 숨긴 stateLabel 텍스트로 보조기술에 전달됩니다(WCAG 1.4.1 / 1.3.1). 기본값은 cross에 따라 "포함" / "제외"이며, 목록의 의미가 다르면 stateLabel="미지원"처럼 바꾸고, 주변 문맥이 이미 상태를 말할 때만 stateLabel={null}로 끕니다. |
| 명시 규칙 2 | 행은 기본적으로 as="li"로 렌더합니다. 여러 항목은 반드시 ul/ol로 감싸 개수와 위치가 읽히게 하고(래퍼에 listStyle: none; margin: 0; padding: 0), 목록이 아닌 단독 행에만 as="div"를 씁니다. |
| 명시 규칙 3 | 타입 스케일 정합: 라벨 16.5px → --body1-size(16px)로 스냅했습니다. 본문 계열 한 단계로 정렬합니다. |
| --body1-size | {"fontSize":"16px","lineHeight":"24px","letterSpacing":"0.0057em"} |
| --color-semantic-label-alternative | light: rgba(55, 56, 60, 0.74); dark: rgba(174, 176, 182, 0.74) |

## Content and writing

- cross는 취소선 + 레드, muted는 흐린 라벨 톤입니다 — 두 축은 독립이며 함께 쓰면 "제외된 항목"이 됩니다.
- ChecklistItem — 시그널 잉크 체크(또는 레드 cross) + 라벨; 브랜드의 핵심 리스트 스타일. dark는 네이비 서피스용, muted는 흐리게 표시.

## Related components

| Component | Relationship |
| --- | --- |
| `FeatureCard` | 대표 시나리오에서 조합 |
| `FeedCard` | 대표 시나리오에서 조합 |
| `ListingCard` | 대표 시나리오에서 조합 |
| `MetricCard` | 대표 시나리오에서 조합 |
| `NewsCard` | 대표 시나리오에서 조합 |
| `ProductCard` | 대표 시나리오에서 조합 |
| `SpecRow` | 대표 시나리오에서 조합 |
| `Stat` | 대표 시나리오에서 조합 |

## Examples

### 기본 조합

```jsx
<ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 'var(--space-3)' }}>
  <ChecklistItem>상태 라벨 표시</ChecklistItem>
  <ChecklistItem cross muted>임의 색상 사용</ChecklistItem>
  <ChecklistItem stateLabel="미지원">사용자 정의 테마</ChecklistItem>
</ul>
```

## Tokens and API

### Tokens

- `--body1-size`
- `--color-semantic-label-alternative`
- `--color-semantic-label-neutral`
- `--color-semantic-primary-normal`
- `--color-semantic-static-white`
- `--color-semantic-status-negative`
- `--fw-semibold`
- `--space-0-5`

### Source contracts

- `components/cards/ChecklistItem.jsx`
- `components/cards/ChecklistItem.d.ts`
- `components/cards/ChecklistItem.prompt.md`
- `stories/CardChecklistItem.stories.jsx`

## Sources

- ChecklistItem prompt contract: `components/cards/ChecklistItem.prompt.md`
- Storybook implementation evidence: `stories/CardChecklistItem.stories.jsx`
