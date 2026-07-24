# Feature Card

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Product / Content |
| Owner | `FeatureCard` |
| Storybook | `LDS Product/Content/Feature Card` |
| Source | `../component-content.json#product-content-feature-card` |

서로 다른 기능의 가치와 성격을 아이콘·제목·설명으로 소개할 때 적합합니다. 실시간 상태나 여러 행의 속성 비교에는 FeatureCard 대신 Status Card 또는 구조화된 표를 사용하세요.

## 사용 판단

### 사용

- 서로 다른 기능의 가치와 성격을 아이콘·제목·설명으로 소개할 때 적합합니다. 실시간 상태나 여러 행의 속성 비교에는 FeatureCard 대신 Status Card 또는 구조화된 표를 사용하세요.
- Feature Card가 소유하는 Content 의미와 상태를 여러 제품 화면에서 동일하게 재사용할 때 사용합니다.
- 제품별 구현 대신 공개 FeatureCard API와 semantic token으로 일관성을 유지해야 할 때 사용합니다.

### 사용하지 않음

- 카드 전체 클릭 — onClick을 주면 카드 루트가 role="button" · tabIndex=0이 되고 Enter/Space로 활성화됩니다(WCAG 2.1.1). 포커스 링은 토큰 레이어(tokens/focus.css)의 전역 :focus-visible 규칙이 담당하므로 카드가 따로 그리지 않습니다. 이때 카드 안에 버튼·링크 같은 포커스 가능한 요소를 넣지 마세요 — 중첩 인터랙티브는 유효하지 않은 마크업이고 카드 이름이 본문 전체로 길어집니다. 행동이 여러 개면 onClick 없이 각 액션을 카드 안에 두세요.
- - tone — signal(틸 타일, 기본) · steel · amber · navy. - headingLevel — title은 실제 heading으로 렌더되며 기본 레벨은 h4입니다(Core Card의 구조화 title은 h3). 카드가 놓인 문서의 제목 계층에 맞춰 1–6을 주고, 제목이 이미 카드 바깥에 있으면 headingLevel={false}로 heading 의미를 끄세요. 레벨은 건너뛰지 않습니다(WCAG 1.3.1). - 카드 전체 클릭 — onClick을 주면 카드 루트가 role="button" · tabIndex=0이 되고 Enter/Spac….
- Feature Card가 소유하지 않는 라우팅, 권한, 데이터 요청, 제품 임계값을 컴포넌트 내부에 넣지 않습니다.
- 동일한 목적을 더 단순한 native 요소나 기존 LDS primitive로 해결할 수 있으면 새 조합을 만들지 않습니다.

## Anatomy

| Part | Contract |
| --- | --- |
| Root | FeatureCard의 semantic role, layout containment와 전달받은 DOM 속성을 소유합니다. |
| Icon | 틴트 타일에 표시되는 인라인 SVG 글리프. |
| Title | title 속성으로 제공되는 공개 슬롯 또는 표시 영역입니다. |
| Children | children 속성으로 제공되는 공개 슬롯 또는 표시 영역입니다. |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `icon` | `React.ReactNode` | No | 틴트 타일에 표시되는 인라인 SVG 글리프. |
| `title` | `React.ReactNode` | No | 제목. |
| `children` | `React.ReactNode` | No | 보조 설명. |
| `tone` | `'signal' \| 'steel' \| 'amber' \| 'navy'` | No | 아이콘 타일 톤. @default "signal" |
| `boxed` | `boolean` | No | 화이트 Card 서피스로 감싸기. @default false |
| `headingLevel` | `1 \| 2 \| 3 \| 4 \| 5 \| 6 \| false` | No | title의 heading 레벨. 카드가 놓인 문서의 제목 계층에 맞춰 1–6을 주고, 제목이 이미 카드 바깥에 있으면 false로 heading 의미를 끕니다. 레벨은 건너뛰지 않습니다. @default 4 |

## States

| State | Contract |
| --- | --- |
| tone | 아이콘 타일 톤. @default "signal" 타입 계약: 'signal' \| 'steel' \| 'amber' \| 'navy' |

## Behavior and interaction

- 카드 전체 클릭 — onClick을 주면 카드 루트가 role="button" · tabIndex=0이 되고 Enter/Space로 활성화됩니다(WCAG 2.1.1). 포커스 링은 토큰 레이어(tokens/focus.css)의 전역 :focus-visible 규칙이 담당하므로 카드가 따로 그리지 않습니다. 이때 카드 안에 버튼·링크 같은 포커스 가능한 요소를 넣지 마세요 — 중첩 인터랙티브는 유효하지 않은 마크업이고 카드 이름이 본문 전체로 길어집니다. 행동이 여러 개면 onClick 없이 각 액션을 카드 안에 두세요.
- - tone — signal(틸 타일, 기본) · steel · amber · navy. - headingLevel — title은 실제 heading으로 렌더되며 기본 레벨은 h4입니다(Core Card의 구조화 title은 h3). 카드가 놓인 문서의 제목 계층에 맞춰 1–6을 주고, 제목이 이미 카드 바깥에 있으면 headingLevel={false}로 heading 의미를 끄세요. 레벨은 건너뛰지 않습니다(WCAG 1.3.1). - 카드 전체 클릭 — onClick을 주면 카드 루트가 role="button" · tabIndex=0이 되고 Enter/Spac….
- FeatureCard의 controlled/uncontrolled 경계와 callback 순서는 공개 타입 계약을 따릅니다.
- 상태 변화 중에도 accessible name, focus 위치와 레이아웃 기준점을 예고 없이 잃지 않습니다.
- 제품 데이터와 side effect는 callback으로 위임하고 FeatureCard는 표시·입력 상태만 소유합니다.

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 명시 규칙 1 | headingLevel — title은 실제 heading으로 렌더되며 기본 레벨은 h4입니다(Core Card의 구조화 title은 h3). 카드가 놓인 문서의 제목 계층에 맞춰 1–6을 주고, 제목이 이미 카드 바깥에 있으면 headingLevel={false}로 heading 의미를 끄세요. 레벨은 건너뛰지 않습니다(WCAG 1.3.1). |
| 명시 규칙 2 | 카드 전체 클릭 — onClick을 주면 카드 루트가 role="button" · tabIndex=0이 되고 Enter/Space로 활성화됩니다(WCAG 2.1.1). 포커스 링은 토큰 레이어(tokens/focus.css)의 전역 :focus-visible 규칙이 담당하므로 카드가 따로 그리지 않습니다. 이때 카드 안에 버튼·링크 같은 포커스 가능한 요소를 넣지 마세요 — 중첩 인터랙티브는 유효하지 않은 마크업이고 카드 이름이 본문 전체로 길어집니다. 행동이 여러 개면 onClick 없이 각 액션을 카드 안에 두세요. |
| 명시 규칙 3 | 타입 스케일 정합: 제목 19px → --headline1-size(18px, −1px 의도된 변경), 본문 15.5px → --body2-size(15px)로 스냅했습니다. NewsCard 제목(headline1)과 같은 카드 제목 단계로 정렬합니다. |
| 명시 규칙 4 | - tone — signal(틸 타일, 기본) · steel · amber · navy. - headingLevel — title은 실제 heading으로 렌더되며 기본 레벨은 h4입니다(Core Card의 구조화 title은 h3). 카드가 놓인 문서의 제목 계층에 맞춰 1–6을 주고, 제목이 이미 카드 바깥에 있으면 headingLevel={false}로 heading 의미를 끄세요. 레벨은 건너뛰지 않습니다(WCAG 1.3.1). - 카드 전체 클릭 — onClick을 주면 카드 루트가 role="button" · tabIndex=0이 되고 Enter/Spac… |
| --body2-size | 15px |

## Responsive

- 320px 좁은 폭과 200% 텍스트 확대에서 페이지 가로 overflow 없이 의미 순서를 유지합니다.
- 고정 폭보다 부모 containment와 wrapping을 우선하고, 제품이 필요할 때 명시적으로 compact 표현을 선택합니다.

## Content and writing

- headingLevel — title은 실제 heading으로 렌더되며 기본 레벨은 h4입니다(Core Card의 구조화 title은 h3). 카드가 놓인 문서의 제목 계층에 맞춰 1–6을 주고, 제목이 이미 카드 바깥에 있으면 headingLevel={false}로 heading 의미를 끄세요. 레벨은 건너뛰지 않습니다(WCAG 1.3.1).
- 카드 전체 클릭 — onClick을 주면 카드 루트가 role="button" · tabIndex=0이 되고 Enter/Space로 활성화됩니다(WCAG 2.1.1). 포커스 링은 토큰 레이어(tokens/focus.css)의 전역 :focus-visible 규칙이 담당하므로 카드가 따로 그리지 않습니다. 이때 카드 안에 버튼·링크 같은 포커스 가능한 요소를 넣지 마세요 — 중첩 인터랙티브는 유효하지 않은 마크업이고 카드 이름이 본문 전체로 길어집니다. 행동이 여러 개면 onClick 없이 각 액션을 카드 안에 두세요.
- 타입 스케일 정합: 제목 19px → --headline1-size(18px, −1px 의도된 변경), 본문 15.5px → --body2-size(15px)로 스냅했습니다. NewsCard 제목(headline1)과 같은 카드 제목 단계로 정렬합니다.
- FeatureCard — 틴트된 아이콘 타일 + 제목 + 설명(기능 셀). boxed는 Card 서피스로 감쌉니다.

## Accessibility

- headingLevel — title은 실제 heading으로 렌더되며 기본 레벨은 h4입니다(Core Card의 구조화 title은 h3). 카드가 놓인 문서의 제목 계층에 맞춰 1–6을 주고, 제목이 이미 카드 바깥에 있으면 headingLevel={false}로 heading 의미를 끄세요. 레벨은 건너뛰지 않습니다(WCAG 1.3.1).
- 카드 전체 클릭 — onClick을 주면 카드 루트가 role="button" · tabIndex=0이 되고 Enter/Space로 활성화됩니다(WCAG 2.1.1). 포커스 링은 토큰 레이어(tokens/focus.css)의 전역 :focus-visible 규칙이 담당하므로 카드가 따로 그리지 않습니다. 이때 카드 안에 버튼·링크 같은 포커스 가능한 요소를 넣지 마세요 — 중첩 인터랙티브는 유효하지 않은 마크업이고 카드 이름이 본문 전체로 길어집니다. 행동이 여러 개면 onClick 없이 각 액션을 카드 안에 두세요.
- - tone — signal(틸 타일, 기본) · steel · amber · navy. - headingLevel — title은 실제 heading으로 렌더되며 기본 레벨은 h4입니다(Core Card의 구조화 title은 h3). 카드가 놓인 문서의 제목 계층에 맞춰 1–6을 주고, 제목이 이미 카드 바깥에 있으면 headingLevel={false}로 heading 의미를 끄세요. 레벨은 건너뛰지 않습니다(WCAG 1.3.1). - 카드 전체 클릭 — onClick을 주면 카드 루트가 role="button" · tabIndex=0이 되고 Enter/Spac….
- native semantic을 우선하며 사용자에게 보이는 이름과 접근 가능한 이름이 같은 목적을 설명하게 합니다.
- 키보드 focus 순서, focus-visible 표시와 상태 ARIA가 시각 상태와 동시에 갱신되는지 공개 스토리에서 검증합니다.

## Do / Don't

| Kind | Guidance |
| --- | --- |
| Do | Feature Card가 소유하는 Content 의미와 상태를 여러 제품 화면에서 동일하게 재사용할 때 사용합니다. |
| Don't | 카드 전체 클릭 — onClick을 주면 카드 루트가 role="button" · tabIndex=0이 되고 Enter/Space로 활성화됩니다(WCAG 2.1.1). 포커스 링은 토큰 레이어(tokens/focus.css)의 전역 :focus-visible 규칙이 담당하므로 카드가 따로 그리지 않습니다. 이때 카드 안에 버튼·링크 같은 포커스 가능한 요소를 넣지 마세요 — 중첩 인터랙티브는 유효하지 않은 마크업이고 카드 이름이 본문 전체로 길어집니다. 행동이 여러 개면 onClick 없이 각 액션을 카드 안에 두세요. |
| Do | 제품별 구현 대신 공개 FeatureCard API와 semantic token으로 일관성을 유지해야 할 때 사용합니다. |
| Don't | - tone — signal(틸 타일, 기본) · steel · amber · navy. - headingLevel — title은 실제 heading으로 렌더되며 기본 레벨은 h4입니다(Core Card의 구조화 title은 h3). 카드가 놓인 문서의 제목 계층에 맞춰 1–6을 주고, 제목이 이미 카드 바깥에 있으면 headingLevel={false}로 heading 의미를 끄세요. 레벨은 건너뛰지 않습니다(WCAG 1.3.1). - 카드 전체 클릭 — onClick을 주면 카드 루트가 role="button" · tabIndex=0이 되고 Enter/Spac…. |

## Exceptions

- 제품 정책을 포함해야 하는 예외는 wrapper 또는 제품 저장소에서 조합하고 FeatureCard의 범용 API에 넣지 않습니다.
- 접근성 또는 안전 계약을 약화하는 예외는 허용하지 않으며 필요한 차이는 prompt와 Storybook 증거에 기록합니다.

## Related components

| Component | Relationship |
| --- | --- |
| `Icon` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `ChecklistItem` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `FeedCard` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `ListingCard` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `MetricCard` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `NewsCard` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `ProductCard` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `SpecRow` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |

## Examples

### 기본 조합

```jsx
<FeatureCard tone="signal" icon={compassIcon} title="자율주행">사전 지정 경로와 실시간 장애물 회피로 이동합니다.</FeatureCard>

// 섹션 제목이 h2일 때 카드 제목을 h3로 내림
<FeatureCard headingLevel={3} tone="steel" icon={mapIcon} title="맵 편집">현장 지도를 직접 수정합니다.</FeatureCard>
```

## Tokens and API

### Tokens

- `--body2-size`
- `--color-semantic-accent-foreground-blue`
- `--color-semantic-accent-foreground-orange`
- `--color-semantic-brand-ink`
- `--color-semantic-fill-strong`
- `--color-semantic-label-alternative`
- `--color-semantic-label-strong`
- `--color-semantic-primary-normal`
- `--color-semantic-primary-surface-normal`
- `--component-card-bg`
- `--component-card-border`
- `--component-card-padding`
- `--component-card-radius`
- `--component-card-shadow-md`
- `--fw-extra`
- `--headline1-size`
- `--radius-14`
- `--shadow-md`

### Source contracts

- `components/cards/FeatureCard.jsx`
- `components/cards/FeatureCard.d.ts`
- `components/cards/FeatureCard.prompt.md`
- `stories/CardInfo.stories.jsx`

## Migration

- 현재 prompt와 타입 계약에 기록되지 않은 legacy alias는 새 코드에서 도입하지 않습니다.
- 대체 컴포넌트가 생기면 기존 API의 제거 버전, 대응 prop과 자동·수동 전환 절차를 이 페이지에 기록합니다.

## Sources

- FeatureCard prompt contract: `components/cards/FeatureCard.prompt.md`
- Storybook implementation evidence: `stories/CardInfo.stories.jsx`
