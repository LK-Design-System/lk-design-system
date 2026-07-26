# News Card

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Product / Content |
| Owner | `NewsCard` |
| Storybook | `LDS Product/Content/News Card` |
| Source | `../component-content.json#product-content-news-card` |

기사·릴리스·공지처럼 발행 정보가 있는 콘텐츠를 요약해 다음 읽기로 연결할 때 적합합니다. 제품 기능이나 즉시 수행할 작업을 소개할 때는 NewsCard 대신 FeatureCard 또는 명시적인 액션 영역을 사용하세요.

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `image` | `string` | No | 커버 이미지 URL(선택). |
| `imageAlt` | `string` | No | 커버 이미지 대체 텍스트. 기본값은 빈 문자열 — 헤드라인이 이미 의미를 전달하므로 커버는 장식으로 둡니다. 사진 자체가 정보를 담을 때만 지정하며, 이때 링크의 접근 이름은 헤드라인. imageAlt로 합성됩니다(카드 = 링크라 이미지 alt만으로는 낭독되지 않기 때문). 커버는 loading="lazy"로 지연 로드되고 16:9 박스가 로드 전 레이아웃을 예약합니다. |
| `category` | `React.ReactNode` | No | 대문자 카테고리 키커. |
| `title` | `React.ReactNode` | No | 헤드라인. |
| `excerpt` | `React.ReactNode` | No | 짧은 발췌 / 데크. |
| `source` | `React.ReactNode` | No | 푸터의 출처 / 바이라인. |
| `date` | `React.ReactNode` | No | 날짜(tabular 숫자). |
| `dateTime` | `string` | No | date의 기계 판독 값(ISO 8601). 주면 날짜가 time 엘리먼트로 렌더됩니다. |
| `cta` | `React.ReactNode` | No | 선택적 콜투액션 라벨(끝 화살표와 함께 렌더). |
| `href` | `string` | No | 기사 링크. @default "" |
| `headingLevel` | `1 \| 2 \| 3 \| 4 \| 5 \| 6 \| false` | No | 헤드라인의 heading 레벨. 목록이 놓인 문서 계층에 맞춰 1–6을 주고, 제목이 이미 카드 바깥에 있으면 false로 끕니다. @default 3 |

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 명시 규칙 1 | image / imageAlt — 커버는 기본적으로 장식(alt="")입니다. 헤드라인이 같은 내용을 이미 말하기 때문입니다. 사진 자체가 정보를 담을 때만 imageAlt를 넣으며, 카드 전체가 링크(아래)라 이미지 alt만으로는 낭독되지 않으므로 링크의 접근 이름이 헤드라인. imageAlt로 합성됩니다. 커버는 loading="lazy"·decoding="async"로 지연 로드되고, 16:9 래퍼가 로드 전 레이아웃을 예약해 CLS를 막습니다. 이미지 로드 실패 시 래퍼 배경이 비쳐 깨진 이미지 글리프 대신 중립 패널로 degrade됩니다. |
| 명시 규칙 2 | headingLevel — 헤드라인(title)은 실제 heading으로 렌더되고 기본은 h3입니다. 카드 목록이 놓인 문서 계층에 맞춰 1–6을 주고, 제목이 이미 바깥에 있으면 false로 heading 의미를 끕니다. 레벨은 건너뛰지 않습니다(WCAG 1.3.1). |
| 명시 규칙 3 | date / dateTime — 화면에는 date(예: "2026.06.02")를 그대로 쓰고, dateTime에 ISO 8601 값을 주면 time 엘리먼트로 렌더되어 기계가 읽을 수 있습니다. source는 바이라인/출처 라벨입니다. |
| 명시 규칙 4 | 타입 스케일 정합: 메타 행 12.5px → --caption1-size(12px)로 스냅했습니다(−0.5px, 아래 스냅 — 보조 정보 위계 유지). 헤드라인(headline1)·발췌(label1)와 함께 전 사이트가 토큰 스케일 위에 있습니다. |
| --caption1-line | {"fontSize":"12px","lineHeight":"16px","letterSpacing":"0.0252em"} |

## Content and writing

- image 없으면 이미지 영역을 생략(텍스트만 렌더). cta가 있으면 끝에 화살표가 붙고 호버 시 우측으로 살짝 이동. 뉴스/보도자료/블로그 목록에 적합.

## Accessibility

- 카드 = 링크 — 카드 전체가 하나의 a이므로 안에 버튼·링크 같은 포커스 가능한 요소를 넣지 마세요(중첩 인터랙티브 금지). 링크의 접근 가능한 이름은 title이며, 발췌·출처·날짜가 이름에 섞여 문단처럼 길어지지 않습니다. 다른 이름이 필요하면 aria-label로 덮어쓰세요.
- 포커스 — 키보드 포커스에서도 호버와 같은 리프트/줌 어포던스를 재현합니다. 포커스 링 자체는 토큰 레이어(tokens/focus.css)의 전역 :focus-visible 규칙이 그립니다.

## Related components

| Component | Relationship |
| --- | --- |
| `ChecklistItem` | 대표 시나리오에서 조합 |
| `FeatureCard` | 대표 시나리오에서 조합 |
| `FeedCard` | 대표 시나리오에서 조합 |
| `ListingCard` | 대표 시나리오에서 조합 |
| `MetricCard` | 대표 시나리오에서 조합 |
| `ProductCard` | 대표 시나리오에서 조합 |
| `SpecRow` | 대표 시나리오에서 조합 |
| `Stat` | 대표 시나리오에서 조합 |

## Examples

### 기본 조합

```jsx
<NewsCard category="릴리스"
  title="컴포넌트 문서 업데이트" excerpt="선택, 상태, 오버레이 컴포넌트 예제를 정리했습니다."
  source="Design System" date="2026.06.02" dateTime="2026-06-02" cta="자세히 보기" href="/news/1" />

<NewsCard image="/covers/lab.webp" imageAlt="검사 로봇이 라인을 점검하는 모습"
  headingLevel={2} title="현장 검증 리포트" href="/news/2" />
```

## Tokens and API

### Tokens

- `--caption1-line`
- `--caption1-size`
- `--color-semantic-background-normal-alternative`
- `--color-semantic-label-alternative`
- `--color-semantic-label-neutral`
- `--color-semantic-label-strong`
- `--color-semantic-primary-normal`
- `--component-card-bg`
- `--component-card-border`
- `--component-card-radius`
- `--dur-base`
- `--ease-out`
- `--fw-bold`
- `--fw-extra`
- `--headline1-size`
- `--label1-size`
- `--ls-overline`
- `--shadow-md`
- `--shadow-xs`
- `--space-1-5`

### Source contracts

- `components/cards/NewsCard.jsx`
- `components/cards/NewsCard.d.ts`
- `components/cards/NewsCard.prompt.md`
- `stories/CardNews.stories.jsx`

## Sources

- NewsCard prompt contract: `components/cards/NewsCard.prompt.md`
- Storybook implementation evidence: `stories/CardNews.stories.jsx`
