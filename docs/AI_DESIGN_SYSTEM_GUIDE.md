# AI 디자인 시스템 가이드

| Field | Value |
| --- | --- |
| Type | Implementation guide |
| Status | Current |
| Owner | Design system owner |
| Last reviewed | 2026-08-09 |

AI 도구에게 LK ROBOTICS UI 설계나 구현을 맡길 때 canonical adoption workflow와 함께 제공하는 구현 가이드입니다. 목적은 디자인 시스템을 CSS 값 모음이 아니라 디자이너, 엔지니어, AI가 함께 쓰는 공통 언어로 만드는 것입니다.

## Mandatory LDS UI adoption entry

컴포넌트 교체만으로 LDS 전환은 완료되지 않는다.

제품 UI 신규 구현, LDS 적용·전환·migration·conversion·restyle·parity 구현은 먼저 generated canonical [`LDS UI 적용·전환 워크플로`](LDS_UI_ADOPTION_WORKFLOW.md)를 따릅니다. 판정의 machine-readable 정본과 검증 가능한 report 형식은 각각 [`LDS_UI_ADOPTION_CONTRACT.json`](references/adoption/LDS_UI_ADOPTION_CONTRACT.json), [`LDS_UI_ADOPTION_REPORT.schema.json`](references/adoption/LDS_UI_ADOPTION_REPORT.schema.json)입니다.

워크플로가 6개 비컴포넌트 facet, `componentMapping`, typed evidence, 완료와 예외 계약을 소유합니다. 이 문서는 그 목록을 복제하지 않고 copy, data display, token, severity와 운영 composition의 구현 규칙만 보충합니다. AI용 단일 탐색 진입점은 root [`llms.txt`](../llms.txt)입니다.

## UI copy conventions

한국어 UI 문장의 canonical 작성 기준은 [`Writing`](foundations/writing.md), 상황별 표현 강도는
[`Voice and Tone`](foundations/voice-and-tone.md), locale 경계는
[`International Design`](foundations/international-design.md)을 따릅니다. AI를 이용한 구조화 검토와
승인 경계는 [`UI Copy Review Contract`](COPY_REVIEW_CONTRACT.md)가 소유합니다.

- 제품의 실제 동작·권한·보안·보존·상태 전이를 먼저 확인하고, 알 수 없으면 추측하지 않고 `BLOCKED`합니다.
- 고유명사·숫자·기간·단위·placeholder·부정·한정 표현을 보존합니다.
- 문자열 하나가 아니라 같은 사용자 흐름의 제목·설명·상태·action을 copy set으로 검토합니다.
- 자연스럽고 기준을 만족하는 문구는 `KEEP`하며 수정률을 높이기 위해 바꾸지 않습니다.
- 의미를 보존하며 국소 수정할 수 있을 때만 `REVISE`하고, 생성형 후보를 자동 반영하지 않습니다.
- 완전한 한국어 설명·요청 문장에는 마침표를 쓰고 제목·라벨·버튼·상태에는 생략합니다. 로딩에는 ASCII `...`가 아니라 `…`를 사용합니다.
- WDS Core field placeholder는 해당 WDS 문장 패턴(`입력해 주세요.`, `선택해 주세요.`)을 따르되 필수 지침은 label 또는 helper text에 둡니다.
- Product와 Robotics의 정식 명칭·상태 사전·복구 행동은 각 제품 계약이 소유하며 LDS나 AI가 전역 치환하지 않습니다.

## Data display conventions

- 표시용 절대 날짜는 `YYYY-MM-DD`, 시각을 포함하면 `YYYY-MM-DD HH:mm`을 사용합니다.
  날짜 입력·편집 control은 locale format을 표시할 수 있지만 저장값과 접근 가능한 설명에는
  ISO 형식을 유지합니다.
- freshness는 1시간 미만 `N분 전`, 같은 날 `오늘 HH:mm`, 그보다 오래되면
  `YYYY-MM-DD HH:mm`으로 단계화합니다. 제품이 계산해 문자열로 전달하며 LDS가 timestamp에서
  freshness를 추론하지 않습니다.
- `% · ‰ · °`는 값에 붙이고 문자·SI 단위는 한 칸 띄웁니다. 단위는 컴포넌트의 `unit`
  prop으로 분리하고 value 문자열에 포함하지 않습니다.
- 결측 표 셀은 `—`로 표시하고 보조기술에는 `값 없음`을 제공합니다. 결측, 빈 문자열, 숫자
  `0`, loading, error를 같은 상태로 취급하지 않습니다.
- 차트의 제품 사용처는 locale formatter와 domain/tick 정책을 명시합니다. 컴포넌트의 자동
  눈금은 Storybook과 단순 preview용 fallback입니다.

## 기준 소스

- LDS UI 적용·전환 절차: `docs/LDS_UI_ADOPTION_WORKFLOW.md`
- 런타임 CSS 진입점: `styles.css`
- 기계가 읽을 수 있는 토큰 소스: `tokens/source.json`
- 컴포넌트 토큰 런타임 레이어: `tokens/components.css`
- 컴포넌트 구현: `components/**`
- 인터랙티브 문서: `stories/**`

`styles.css`는 제품 앱이 import하는 런타임 계약입니다. `tokens/source.json`은 AI 도구, Figma 워크플로, 향후 토큰 변환 파이프라인이 읽을 구조화된 토큰 맵입니다.

## 토큰 계층

1. Primitive 토큰은 브랜드 색상, 간격 스케일, radius, 타이포그래피, 그림자, 모션 같은 원천 결정을 정의합니다.
2. Semantic 토큰은 표면, 텍스트, 액션, 상태, 테두리, 포커스, 컨트롤 크기 같은 제품 의미를 정의합니다.
3. Component 토큰은 Button, Input, Card 및 향후 컴포넌트 패밀리가 재사용할 계약을 정의합니다.

가능한 한 높은 계층의 토큰을 사용하세요.

- 제품 UI는 semantic 토큰을 우선 사용합니다.
- 컴포넌트 소스는 component 토큰을 우선 사용합니다.
- primitive 토큰은 semantic/component 토큰을 정의하거나 수정할 때만 사용합니다.

label 계열은 대비 기준으로 용도가 나뉩니다. `label-strong`·`label-normal`·`label-neutral`·`label-alternative`는 AA(4.5:1)를 충족하므로 텍스트에 사용할 수 있습니다 (`label-alternative`는 WDS의 0.61 알파가 AA에 미달해 LK retone에서 0.74로 올린 값입니다 — `tokens/source.json`의 note 참조). `label-assistive`와 `label-disable`은 AA 미달이므로 placeholder·disabled·장식적 보조 요소 전용이며, 화면 이해에 필요한 텍스트에는 쓰지 않습니다.

## AI 사용 규칙

UI 코드를 생성할 때:

- 앱 진입점에서 사용하는 layer의 owner-package CSS를 `@lk-design-system/lds-core/styles.css` → `@lk-design-system/lds-theme/styles.css` → `@lk-design-system/lds-product/styles.css` 순서로 한 번씩 import하고, Robotics surface가 있을 때만 `@lk-design-system/lds-robotics-ui/styles.css`를 이어서 import합니다.
- 공통 UI를 새로 만들기 전에 `@lk-design-system/lds-core`, `@lk-design-system/lds-theme`, `@lk-design-system/lds-product`, `@lk-design-system/lds-robotics-ui` 중 실제 owner package가 export하는 React 컴포넌트를 먼저 사용합니다.
- Button/Input/Card 내부 동작과 시각 값은 component 토큰을 사용합니다.
- 제품 레이아웃, 카피, 상태, surface는 semantic 토큰을 사용합니다.
- 디자인 시스템을 확장하는 작업이 아니라면 새 hex 색상, 임의 그림자, 일회성 spacing을 만들지 않습니다.
- 다른 AI 도구에게 토큰 계층을 설명할 때 `tokens/source.json`을 우회하지 않습니다.
- LK ROBOTICS 시각 톤을 유지합니다: 차가운 navy 기반, 절제된 azure signal, 차분한 상태 색상, 밀도 있지만 안정적인 운영 UI.

## 컴포넌트 토큰 계약

### Button

구현 파일: `components/buttons/Button.jsx`

주요 컴포넌트 토큰:

- `--component-button-height-sm`
- `--component-button-height-md`
- `--component-button-height-lg`
- `--component-button-radius`
- `--component-button-primary-bg`
- `--component-button-primary-bg-hover`
- `--component-button-primary-fg`
- `--component-button-secondary-bg`
- `--component-button-signal-bg`
- `--component-button-danger-bg` (LDS safety extension; not WDS parity)
- `--component-button-disabled-opacity`

### Input

구현 파일: `components/forms/Input.jsx`

주요 컴포넌트 토큰:

- `--component-input-height`
- `--component-input-padding-x`
- `--component-input-bg`
- `--component-input-border-color`
- `--component-input-border-color-focus`
- `--component-input-border-color-invalid`
- `--component-input-focus-shadow`
- `--component-input-label-font-size`

### Card

구현 파일: `components/cards/Card.jsx`

주요 컴포넌트 토큰:

- `--component-card-bg`
- `--component-card-bg-dark`
- `--component-card-fg`
- `--component-card-border`
- `--component-card-radius`
- `--component-card-padding`
- `--component-card-shadow-md`
- `--component-card-shadow-lg`

### ActionArea

구현 파일: `components/buttons/ActionArea.jsx`

- `--component-action-area-padding-x`
- `--component-action-area-padding-y`
- `--component-action-area-gap`
- `--component-action-area-border`

일반 persistent CTA는 기본 `Button` medium 높이 40px을 사용하고, row-local action과 toolbar command만 명시적으로 small 32px을 사용합니다.

### ConfirmDialog

구현 파일: `components/overlay/ConfirmDialog.jsx`

- `--component-dialog-radius`
- `--component-dialog-scrim`
- `--component-dialog-scrim-blur`
- `--component-confirm-dialog-max-width`

warning/danger 의미는 색상만으로 표현하지 않고 visible `StatusBadge` text와 함께 제공합니다.

## Severity surface 문법

상태(severity)를 표현하는 표면은 아래 문법을 따릅니다. 새 status·요약·목록 컴포넌트를 추가할 때 이 표에서 역할을 먼저 고르고, 다른 조합을 발명하지 않습니다.

| 역할 | 예 | 표면 처리 |
| --- | --- | --- |
| 단일 메시지 표면 | `Callout`, `Banner variant="standalone"` | 외곽선 없는 전체 tinted surface + tone 아이콘·텍스트 |
| 부모 표면 결합 상태 | `Banner variant="embedded"` (LDS composition extension) | 부모 안의 edge-to-edge tinted band + 상·하단 tone hairline. 외곽 border·radius·shadow는 부모가 소유 |
| 제출/검증 결과 요약 | `ValidationSummary` | 중립 목록 본문 + severity 구역 heading band(tone surface/border) + 최고 심각도의 외곽 hairline |
| 진행형 작업 목록 | `FileUploadQueue` | 카드 외곽·헤더와 파일 정체성 아이콘은 항상 중립. 상태는 행 단위 `StatusBadge`·진행 바·텍스트로 표현 |

- 색은 semantic `status-*` 토큰(또는 그 alias인 `component-banner/callout-*`)만 사용합니다. severity 색을 새로 정의하지 않습니다.
- severity 글리프는 `Icon` registry + `statusToneStyle` 매핑(`signal=circle-info-fill`, `positive=circle-check-fill`, `cautionary=triangle-exclamation-fill`, `negative=circle-close-fill`)으로 고정합니다. 인라인 SVG로 다시 그리지 않습니다.
- 카운트 문법: 심각도별로 그룹핑된 독립 요약은 구역 band heading에 카운트를 표시합니다. 상태가 섞인 목록이 바로 보이는 `FileUploadQueue`는 헤더에 같은 개수를 반복하지 않고, 보조 기술용 집계만 `VisuallyHidden` live region으로 제공합니다. 긴 목록이 접히거나 페이지로 나뉘어 별도 요약이 필요하면 제품 화면에서 조합합니다.
- 행 목록의 리딩 아이콘은 **36px 둥근 사각(`radius-md`) 타일**로 통일합니다 — `ListCell`·`FeatureCard`·`StepList`·`DataGrid`에 걸쳐 서명된 LK icon-tile 패턴이며(`docs/references/wds/COMPONENT_STYLE_PARITY.md` 참조), 아이콘 자체가 severity를 뜻하면 타일 wash를 tone surface/전경으로 칠합니다(`Notification`). `FileUploadQueue`의 문서 아이콘처럼 콘텐츠 정체성을 뜻하고 상태가 별도로 표시되는 경우에는 중립 타일을 사용합니다. 원형 등 새 chip 모양을 만들지 않습니다.
- 색만으로 의미를 전달하지 않습니다. tint에는 항상 아이콘 또는 명시적 상태 문구가 동반되어야 합니다.
- tone 어휘의 canonical 형태는 `positive · cautionary · negative · signal`(+중립)입니다. 새 컴포넌트는 이 어휘만 받고, 기존 호환용 별칭(`success/warning/error/info` 등)은 Toast처럼 내부에서 canonical로 정규화합니다. 새 별칭을 만들지 않습니다.
- severity 글리프는 손으로 그리지 않습니다. Toast·Snackbar·Banner처럼 공통 `Icon` registry + `statusToneStyle` 매핑을 사용합니다. 체브런·체크·닫기 같은 기능성 마이크로 글리프도 registry에 대응 아이콘이 있으면 반드시 사용하며, 대응 아이콘이 없고 컴포넌트 prompt에 예외를 기록한 경우에만 인라인 SVG를 허용합니다.
- keyboard focus는 `tokens/focus.css`의 전역 `:focus-visible` 링이 기본입니다. 컴포넌트가 focus 시각을 더할 때는 두 형태만 허용합니다 — 입력형 필드의 soft glow `0 0 0 4px var(--color-semantic-focus-ring)`, 클리핑되는 행·셀의 `inset 0 0 0 2px var(--color-semantic-focus-indicator)`. 다른 두께·색 조합을 만들지 않습니다.
- disabled 표현은 `label-disable` 계열 색 교체가 기본입니다. 아이콘·스와치처럼 색 교체가 어려운 요소에만 opacity를 쓰되 값은 **0.45** 하나로 통일합니다.

## 운영 대시보드 조합 계약

Operations Dashboard는 별도 디자인 시스템이나 화면형 컴포넌트가 아니라 LDS Product 안에서 아래의 작은 책임을 조합하는 패턴군입니다. 범위와 소유권의 기준은 루트 `DESIGN.md`입니다. Storybook에는 실제 컴포넌트·패턴의 상태만 두고, 특정 제품의 완성 대시보드·workflow·template을 추가하지 않습니다.

| 책임 | 기본 조합 | 지켜야 할 경계 |
| --- | --- | --- |
| 앱 구조 | `DashboardShell` + `TopBar` + `SideNav`/`NavRail` + `BottomNav` + `Container` + `PageHeader` | shell은 skip link와 `header/nav/main` landmark, 넓은/좁은 탐색 전환만 소유합니다. router·인증·권한은 제품 소유입니다. |
| 반복 카드 배치 | `DashboardGrid` + `MetricCard`/`ChartFrame`/제품 카드 | grid는 최소 카드 폭과 gap만 소유합니다. 카드 surface를 다시 만들거나 카드 안에 카드를 넣지 않습니다. |
| KPI | `MetricCard` | 변화 방향(`up/down/flat`)과 의미(`positive/negative/cautionary/neutral`)를 분리하고 0 변화는 기본적으로 `flat/neutral`로 둡니다. 단위·기간·기준·freshness·resource state를 생략하지 않습니다. |
| 차트 | `ChartFrame` + 개별 chart + `Legend` | frame은 title/context/action/state 순서, chart는 accessible name·description·결정적 텍스트 요약을 소유합니다. 0합계를 임의의 1로 치환하지 않습니다. |
| 리소스 상태 | `ResourceState` | initial loading은 콘텐츠를 대체하고, refreshing/stale/offline/error는 마지막 정상 데이터를 유지합니다. 읽기 순서는 상태 메시지 → 콘텐츠 → freshness입니다. fetch·retry·stale 계산은 제품 소유입니다. |
| 검색·필터 | `DataToolbar` + `FilterBar` + `DateRangeField` | page-level 검색/action, 적용 필터 제거·초기화, 기간 입력을 분리합니다. query·URL·facet fetch·preset 날짜 계산은 제품 소유입니다. |
| 데이터 컬렉션 표면 | `DataCollectionPanel` + `Table`/`DataGrid` + `Pagination` | 패널은 toolbar·resource state·content·footer의 연속 perimeter와 읽기 순서만 소유합니다. 좁은 표현이 필요하면 제품이 semantic `compactContent`를 제공하고, 없으면 Table의 native 구조와 가로 overflow를 유지합니다. query·fetch·권한·행 의미·페이지 상태는 제품 소유입니다. |
| 표 | `DataGrid` + `Pagination` + `VisibilityManager` | page와 all-matching 선택 범위 및 행별 선택 가능성을 명시하고 열 표시·순서·고정·다중 정렬·확장·편집을 controlled로 전달합니다. pagination 입력은 외부 page와 동기화합니다. virtualization과 편집 lifecycle은 전문 제품 계층에 둡니다. |
| 목록 상세 | `PrimaryDetail` | 넓은 화면은 이름 있는 병렬 region, 좁은 화면은 focus-managed 서랍 패널을 사용합니다. 선택·route·breakpoint source of truth는 제품 소유입니다. |
| 운영 action | `RefreshControl` + `DataExportAction` | polling·파일 생성·download·RBAC 판정을 실행하지 않습니다. freshness, 항상 유효한 형식/범위, 진행 상태, 사용할 수 없는 이유만 일관되게 표시합니다. |
| 개인화 | `SavedViewControl` + `VisibilityManager` | 저장 보기와 열/위젯 표시는 controlled state로 노출합니다. callback이 없는 축은 no-op control이 아니라 읽기 전용/비활성 상태로 둡니다. persistence, URL 동기화, 서버 저장은 제품 소유입니다. drag만 제공하지 말고 키보드·명명된 이동 control을 함께 둡니다. |

구현 순서는 다음을 기본으로 합니다.

1. `DashboardShell`의 skip link와 하나의 `main`을 먼저 확정합니다.
2. `PageHeader`와 filter/query control을 배치합니다.
3. `DashboardGrid`, `DataGrid`, `PrimaryDetail` 중 정보 구조에 맞는 패턴을 선택합니다.
4. 모든 비동기 표면에 loading/empty/error/refreshing/stale/freshness 계약을 연결합니다.
5. normal 폭과 320px에서 실제 긴 텍스트, action wrapping, 내부 scroll 경계를 확인합니다.
6. 내비게이션 destination은 `href` 또는 router renderer를 사용하고, 단순 `button + onChange`는 route가 아닌 local view 전환에만 사용합니다.

좁은 폭에서 전체 page의 가로 스크롤을 만들지 않습니다. 카드·filter·action은 줄바꿈하고, 열 맥락을 유지해야 하는 `DataGrid`만 자체 scroll container 안에서 가로 스크롤을 허용합니다. `DashboardShell`은 전용 narrow navigation이 없어도 기존 탐색을 숨기지 않습니다. disabled action은 색만 흐리게 두지 말고 사용할 수 없는 이유와 접근 방법을 보이게 제공하며, callback이 없는 control을 조작 가능하게 보이지 않도록 합니다.

외부 비교 기준은 [PatternFly dashboard](https://www.patternfly.org/patterns/dashboard/design-guidelines/), [Carbon UI shell](https://carbondesignsystem.com/components/UI-shell-header/usage/), [Carbon data table](https://carbondesignsystem.com/components/data-table/usage/), [Fluent Nav](https://fluent2.microsoft.design/components/web/react/core/nav/usage)입니다. 세부 결론과 의도적 차이는 각 컴포넌트의 `.prompt.md`에 기록합니다.

## 가이드형 생성 조합 계약

다단계 생성 플로우(유형 선택 → 대량 선택 → 확인 → 생성 요청)도 화면형 컴포넌트가 아니라 조합 패턴군입니다. 단계 이동 guard·pending·focus·이탈 확인은 [`GUIDED_CREATION_PATTERN.md`](GUIDED_CREATION_PATTERN.md), 수십~100건 다중 선택 field는 [`SELECTABLE_COLLECTION_PATTERN.md`](SELECTABLE_COLLECTION_PATTERN.md), 제출 전 확인은 [`CHECK_ANSWERS_PATTERN.md`](CHECK_ANSWERS_PATTERN.md)를 따릅니다. `CreationFlow`·`CollectionPicker`·`ReviewSummary`·`JobTracker` 같은 화면형 컴포넌트를 새로 만들지 않고, 검증 문구·business validation·route·persistence·polling은 제품이 소유합니다.

## 프롬프트 템플릿

AI 도구에 요청할 때 아래 구조를 사용하세요.

```text
You are designing with the LK ROBOTICS design system.
Read docs/LDS_UI_ADOPTION_WORKFLOW.md before editing.
Review all six non-component facets and componentMapping for every target surface.
Use reviewed, not-applicable with a concrete reason, or blocked with typed evidence exactly as the workflow requires.
Component replacement alone is not completion.
Use owner-package imports and the CSS order defined in docs/PACKAGE_MIGRATION_GUIDE.md.
Read the relevant Foundation guide and search tokens/source.json before choosing visual values.
Prefer exported components from their LDS owner package.
Use semantic tokens for product UI and component tokens for Button/Input/Card behavior.
Do not invent colors, spacing, shadows, or control dimensions unless adding a reviewed token.
Report the facet verdicts, component mapping, verification evidence, exceptions, and product-owned seams.
Output production React code.
```

프롬프트 자체는 영어로 유지해도 됩니다. 많은 AI 도구가 코드 생성 지시를 영어로 더 안정적으로 처리하기 때문입니다.

## 확장 규칙

토큰을 추가할 때:

1. `tokens/*.css`에 런타임 CSS 토큰을 추가하거나 수정합니다.
2. `tokens/source.json`에 구조화된 토큰 항목을 추가합니다.
3. 컴포넌트 전용 토큰이면 `tokens/components.css`에 둡니다.
4. 관련 컴포넌트 구현에서 해당 토큰을 사용합니다.
5. 토큰 동작을 보여주는 Storybook 스토리를 추가하거나 수정합니다.
6. push 전에 `npm run check`를 실행합니다.

## 현재 범위

구조화된 component-token 적용 범위는 Button, ActionArea, ConfirmDialog, Input, Card와 일부 선택/피드백 primitives까지 확장되어 있습니다. 나머지 컴포넌트 라이브러리는 semantic 토큰과 필요한 layout contract를 함께 사용하며, 새 component-specific 시각 값은 같은 primitive -> semantic -> component 구조로 추가합니다.
