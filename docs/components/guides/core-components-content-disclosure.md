# Disclosure

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Core / Content |
| Owner | `Accordion` |
| Storybook | `LDS Core/Components/Content/Disclosure` |
| Source | `../component-content.json#core-components-content-disclosure` |

FAQ, 선택적 설명, 상세 로그처럼 모든 사용자가 즉시 읽을 필요가 없는 보조 콘텐츠에 적합합니다. 과업 완료에 필수인 정보나 오류는 접지 말고 바로 노출하며, 화면 이동이 필요한 계층 탐색에는 Navigation을 사용하세요.

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `items` | `AccordionItem[]` | Yes | 행 — 각각 { title, content }. |
| `multiple` | `boolean` | No | 한 번에 여러 행 열기 허용. @default false |
| `defaultOpen` | `number[]` | No | 마운트 시 열려 있는 인덱스. @default [] |
| `headingLevel` | `1 \| 2 \| 3 \| 4 \| 5 \| 6 \| false` | No | 각 헤더 트리거를 감싸는 heading 레벨(APG: "each accordion header is contained in an element with role heading"). false 면 heading 래퍼 없이 버튼만 렌더링합니다. |
| `style` | `React.CSSProperties` | No |  |
| `title` | `React.ReactNode` | No |  |
| `defaultOpen` | `boolean` | No |  |
| `density` | `'default' \| 'compact'` | No |  |
| `align` | `'start' \| 'end' \| 'stretch'` | No |  |
| `children` | `React.ReactNode` | No |  |

## States

| State | Contract |
| --- | --- |
| defaultOpen | 마운트 시 열려 있는 인덱스. @default [] |

## Behavior and interaction

- Accordion — FAQ / 스펙 그룹용 디스클로저 리스트. 열린 헤더는 시그널 잉크를 띠고, 셰브론이 뒤집히며, 본문이 차분한 grid-rows 트랜지션으로 드러납니다.

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 명시 규칙 1 | items — { title, content, leading?, description? }[]. multiple — 여러 개 동시 열기 허용. defaultOpen — 마운트 시 열려 있는 인덱스. headingLevel — 헤더 래퍼 heading 레벨(기본 3). |
| 명시 규칙 2 | 접근성: 각 헤더 버튼은 실제 heading(기본 )으로 감싸집니다 — APG Accordion 은 "each accordion header is contained in an element with role heading"을 요구하며, 이 래퍼 덕분에 스크린리더 사용자가 heading 탐색(H 키)으로 섹션 사이를 건너뛸 수 있습니다. 래퍼는 margin: 0; font: inherit 이라 시각은 버튼이 그대로 소유합니다. |
| --body2-size | 15px |
| --caption1-line | {"fontSize":"12px","lineHeight":"16px","letterSpacing":"0.0252em"} |
| --caption1-size | {"fontSize":"12px","lineHeight":"16px","letterSpacing":"0.0252em"} |

## Content and writing

- 슬롯 이름은 같은 해부를 쓰는 ListCell(leading · title · description)과 맞췄습니다. 구분선은 항상 그려집니다(끄는 옵션은 실제 필요가 확인되면 엽니다).

## Accessibility

- leading / description — 트리거 안에 제목 앞 장식 노드와 제목 아래 보조 설명을 둡니다. 둘 다 트리거 안에 있어 행 전체가 계속 눌리지만, 버튼의 접근 이름은 aria-labelledby로 title에만 고정되어 있어 장식 아이콘이나 설명이 이름에 섞이지 않습니다. 설명은 대신 aria-describedby로 연결되어 이름은 짧게, 설명은 설명으로 낭독됩니다. title에 아이콘을 직접 넣으면 그 아이콘이 heading·버튼 이름 안으로 들어가므로 그렇게 하지 마세요.
- 접근성: 각 트리거는 aria-expanded + aria-controls로 자신의 패널을 가리키고, 패널은 role="region" + aria-labelledby로 트리거와 연결됩니다. 접힌 패널은 inert로 접근성 트리·탭 포커스 순서에서 제거되어 aria-expanded=false와 상태가 일치합니다(시각 리빌 전환은 유지). Collapsible도 같은 계약을 공유합니다.

## Related components

| Component | Relationship |
| --- | --- |
| `Collapsible` | 같은 페이지가 소유 |
| `Code` | 대표 시나리오에서 조합 |
| `Icon` | 대표 시나리오에서 조합 |
| `Blockquote` | 대표 시나리오에서 조합 |
| `ContentBadge` | 대표 시나리오에서 조합 |
| `Kbd` | 대표 시나리오에서 조합 |
| `ListCell` | 대표 시나리오에서 조합 |
| `Overline` | 대표 시나리오에서 조합 |

## Examples

### 기본 조합

```jsx
<Accordion items={[
  { title: '검토 기간은 얼마나 걸리나요?', content: '초안 등록 후 평균 2일 내 확인합니다.' },
  { title: '변경 이력은 어디에 남나요?', content: '게시 시점마다 요약과 담당자를 남깁니다.' },
]} defaultOpen={[0]} />
```

## Tokens and API

### Tokens

- `--body2-size`
- `--caption1-line`
- `--caption1-size`
- `--color-semantic-label-alternative`
- `--color-semantic-label-neutral`
- `--color-semantic-label-normal`
- `--color-semantic-line-solid-normal`
- `--color-semantic-primary-normal`
- `--dur-base`
- `--dur-fast`
- `--ease-out`
- `--font-sans`
- `--fw-bold`
- `--fw-regular`
- `--fw-semibold`
- `--headline2-size`
- `--label1-size`
- `--space-1`
- `--space-2`

### Source contracts

- `components/content/Accordion.jsx`
- `components/content/Accordion.d.ts`
- `components/content/Accordion.prompt.md`
- `components/content/Collapsible.jsx`
- `components/content/Collapsible.d.ts`
- `components/content/Collapsible.prompt.md`
- `stories/ContentDisclosure.stories.jsx`

## Sources

- Accordion prompt contract: `components/content/Accordion.prompt.md`
- Storybook implementation evidence: `stories/ContentDisclosure.stories.jsx`
