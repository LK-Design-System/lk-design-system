# Timeline

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Core / Content |
| Owner | `Timeline` |
| Storybook | `LDS Core/Components/Content/Timeline` |
| Source | `../component-content.json#core-components-content-timeline` |

검토 이력, 배포 기록, 장비 이벤트처럼 발생 시각과 순서가 중요한 읽기 전용 기록에 적합합니다. 사용자가 완료해야 할 절차는 Step List나 Stepper를, 단순 알림 목록은 List를 사용하고 상태 색만으로 사건의 의미를 구분하지 마세요.

## 사용 판단

### 사용

- 표현 축일 뿐입니다: ol/li 순서, , 톤 어휘는 세로와 동일합니다.

## Anatomy

| Part | Contract |
| --- | --- |
| label | 내부 ol 의 접근 가능한 이름(한 화면에 기록이 여럿일 때 구분용). |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `items` | `TimelineItem[]` | Yes |  |
| `label` | `string` | No | 내부 ol 의 접근 가능한 이름(한 화면에 기록이 여럿일 때 구분용). |
| `orientation` | `'vertical' \| 'horizontal'` | No | 'vertical'(기본)은 로그를 위→아래로, 'horizontal'은 연대기를 좌→우로 읽습니다. 가로에서 각 사건은 등분 컬럼(minmax(0, 1fr))이라 사건이 적을수록 한 칸이 넓어지고, 레일은 마지막 노드 앞에서 멈춥니다. 표현 축일 뿐 ol/time 시맨틱은 동일합니다. |

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 명시 규칙 1 | 타입 스케일 정합: 제목 15.5px → --body2-size(15px, −0.5px), 설명 13.5px → --label2-size(13px, −0.5px)로 스냅했습니다. time(caption1)과 함께 전 사이트가 토큰 스케일 위에 있으며, 설명 lineHeight 1.6은 유지했습니다. |
| 명시 규칙 2 | 시간순 기록은 ol li 로 렌더링합니다. div 나열은 순서·개수·현재 위치를 보조 기술에 전혀 전달하지 못합니다(WCAG 1.3.1). |
| 명시 규칙 3 | 시각 표기는 로 감쌉니다. dateTime 을 주면 그 값이, 없으면 문자열 time 이 기계 판독 값이 됩니다 — "09:12", "2026-07-03" 처럼 유효한 형식을 쓰고, "2026.07.03" 같은 표기를 쓸 때는 dateTime 을 따로 주세요. |
| 명시 규칙 4 | orientation vertical(기본) · horizontal — 세로는 로그(변경 이력, 활동 기록)의 문법이고, 가로는 단계가 적은 연대기(로드맵, 마일스톤)의 문법입니다. 가로에서 각 사건은 등분 컬럼(minmax(0, 1fr))이라 사건이 적을수록 한 칸이 넓어집니다. |
| --body2-size | 15px |

## Content and writing

- items — { id, time, dateTime, title, description, tone }. tone은 노드 색을 지정(signal · positive · cautionary · negative · neutral). label — ol 의 접근 가능한 이름.
- 시각·제목·설명의 타입은 --lk-timeline-time-size/line/spacing, --lk-timeline-title-, --lk-timeline-desc- 훅을 경유하며 폴백이 곧 기존 제품 램프 값이라 제품 화면은 바이트 동일하게 렌더됩니다. Table 셀과 같은 계약이며, 훅이 기본 미정의인 이유도 같습니다(TOKENGOVERNANCE 예외).
- 재지정하는 것은 크기가 아니라 단(rank) 입니다 — 어느 매체에서든 시각 표기는 제목보다 조용해야 하므로, 매체는 세 훅을 자기 램프의 연속한 단으로 함께 옮기지 하나만 끌어올리지 않습니다.

## Accessibility

- 점·레일은 장식이므로 aria-hidden 입니다. tone 색만으로 사건의 의미를 구분하지 말고 title·description 텍스트에도 담으세요.

## Related components

| Component | Relationship |
| --- | --- |
| `Accordion` | 대표 시나리오에서 조합 |
| `Blockquote` | 대표 시나리오에서 조합 |
| `Code` | 대표 시나리오에서 조합 |
| `Collapsible` | 대표 시나리오에서 조합 |
| `ContentBadge` | 대표 시나리오에서 조합 |
| `Kbd` | 대표 시나리오에서 조합 |
| `ListCell` | 대표 시나리오에서 조합 |
| `Overline` | 대표 시나리오에서 조합 |

## Examples

### 기본 조합

```jsx
<Timeline label="배포 기록" items={[
  { time: '2026.06.30', dateTime: '2026-06-30', title: '검토 완료', tone: 'positive' },
  { time: '2026.07.03', dateTime: '2026-07-03', title: '게시 진행 중', description: '문서 3건 반영', tone: 'signal' },
]} />
```

## Tokens and API

### Tokens

- `--body2-size`
- `--caption1-size`
- `--color-semantic-background-elevated-normal`
- `--color-semantic-interaction-inactive`
- `--color-semantic-label-alternative`
- `--color-semantic-label-normal`
- `--color-semantic-line-solid-normal`
- `--color-semantic-primary-normal`
- `--color-semantic-status-cautionary`
- `--color-semantic-status-negative`
- `--color-semantic-status-positive`
- `--font-sans`
- `--fw-bold`
- `--label2-size`
- `--lk-timeline-desc-line`
- `--lk-timeline-desc-size`
- `--lk-timeline-desc-spacing`
- `--lk-timeline-time-line`
- `--lk-timeline-time-size`
- `--lk-timeline-time-spacing`
- `--lk-timeline-title-line`
- `--lk-timeline-title-size`
- `--lk-timeline-title-spacing`
- `--space-1`
- `--space-2`
- `--space-3-5`
- `--space-6`

### Source contracts

- `components/content/Timeline.jsx`
- `components/content/Timeline.d.ts`
- `components/content/Timeline.prompt.md`
- `stories/ContentTimeline.stories.jsx`

## Sources

- Timeline prompt contract: `components/content/Timeline.prompt.md`
- Storybook implementation evidence: `stories/ContentTimeline.stories.jsx`
