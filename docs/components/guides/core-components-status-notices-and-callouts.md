# Notices and Callouts

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Core / Status |
| Owner | `Banner` |
| Storybook | `LDS Core/Components/Status/Notices and Callouts` |
| Source | `../component-content.json#core-components-status-notices-and-callouts` |

시스템 변화와 선택적 행동을 알려야 할 때는 Banner가, 본문 맥락에 남는 절차·주의에는 Callout이 적합합니다. 짧게 사라지는 완료 피드백에는 이 패턴을 사용하지 말고 Toast 또는 Snackbar를 사용하세요.

## 사용 판단

### 사용

- 시스템 변화와 선택적 행동을 알려야 할 때는 Banner가, 본문 맥락에 남는 절차·주의에는 Callout이 적합합니다. 짧게 사라지는 완료 피드백에는 이 패턴을 사용하지 말고 Toast 또는 Snackbar를 사용하세요.
- 패널 전체의 현재 gate/state를 짧게 알릴 때는 header 바로 아래에 variant="embedded"를 사용합니다. 정상·잠금처럼 설명이 없어도 이해되는 상태는 제목 한 줄로 유지하고, 오류 원인이나 복구 방법이 필요한 경우에만 본문을 추가합니다. 부모 표면 안에서 style로 border와 radius를 임의 덮어쓰지 않습니다.
- 독립된 동적 알림에는 standalone, 떠 있는 일시 메시지에는 Toast, 본문에 계속 남는 절차·주의·맥락 설명에는 Callout을 사용합니다. 액션이나 닫기가 필요하다는 이유만으로 정적 설명을 Banner로 바꾸지 말고, 실제로 상태가 변하는지 먼저 판단합니다.
- tone 아이콘은 공통 Icon registry의 statusToneStyle 글리프(circle-info-fill, circle-check-fill, triangle-exclamation-fill, circle-close-fill)를 사용합니다. severity 글리프를 인라인 SVG로 새로 그리지 않습니다 — 같은 상태는 Callout·ValidationSummary와 같은 모양으로 표시되어야 합니다.

### 사용하지 않음

- 선택 기준 — 비동기 작업, 연결, 권한, 검증 결과처럼 상태가 바뀌며 사용자가 알아야 하는 정보에는 Banner를 사용합니다. 상태와 함께 다음 행동이 필요하면 action, 사용자가 숨겨도 되는 비차단 알림이면 onClose를 제공합니다. Banner는 기본적으로 live status이며 negative tone은 alert이므로, 처음부터 본문에 남아 있는 설명을 단지 색으로 강조하려는 용도로 사용하지 않습니다.
- Primer Banner의 card 안 flush 배치처럼, 컨테이너 상태는 별도의 둥근 카드로 중첩하지 않고 부모 표면의 폭에 결합합니다. LDS에서는 이를 variant="embedded"로 명시합니다.
- Carbon Notification usage가 notification과 callout을 목적·지속성·상호작용으로 구분하는 것처럼, LDS도 시각적 강조 정도가 아니라 동적 상태와 액션 여부로 Banner를 선택합니다. 외부 스타일을 복제하지 않고 LDS의 status tone, spacing, radius를 유지합니다.
- - 선택 기준 — 비동기 작업, 연결, 권한, 검증 결과처럼 상태가 바뀌며 사용자가 알아야 하는 정보에는 Banner를 사용합니다. 상태와 함께 다음 행동이 필요하면 action, 사용자가 숨겨도 되는 비차단 알림이면 onClose를 제공합니다. Banner는 기본적으로 live status이며 negative tone은 alert이므로, 처음부터 본문에 남아 있는 설명을 단지 색으로 강조하려는 용도로 사용하지 않습니다. - tone — canonical signal · positive · cautionary · negative를 받으며, 기존 info · succ….

## Anatomy

| Part | Contract |
| --- | --- |
| Root | Banner의 semantic role, layout containment와 전달받은 DOM 속성을 소유합니다. |
| Tone | 톤. @default "info" |
| Title | 굵은 헤드라인 줄. |
| Children | children 속성으로 제공되는 공개 슬롯 또는 표시 영역입니다. |
| Action | 끝의 액션 노드(예: 텍스트 Button). |
| Close Label | 닫기 버튼의 접근성 레이블. @default "닫기" |
| Title | title 속성으로 제공되는 공개 슬롯 또는 표시 영역입니다. |
| Icon | tone별 기본 아이콘을 교체합니다. 생략하거나 null을 전달해도 기본 아이콘은 유지됩니다. |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `tone` | `'signal' \| 'positive' \| 'cautionary' \| 'negative' \| 'info' \| 'success' \| 'warning' \| 'error'` | No | 톤. @default "info" |
| `variant` | `'standalone' \| 'embedded'` | No | 표면 배치. embedded는 부모 패널 내부의 edge-to-edge 상태 띠입니다. @default "standalone" |
| `title` | `React.ReactNode` | No | 굵은 헤드라인 줄. |
| `children` | `React.ReactNode` | No | 본문 메시지. |
| `action` | `React.ReactNode` | No | 끝의 액션 노드(예: 텍스트 Button). |
| `onClose` | `() = void` | No | 닫기 버튼 표시; 클릭 시 호출. |
| `closeLabel` | `string` | No | 닫기 버튼의 접근성 레이블. @default "닫기" |
| `tone` | `'signal' \| 'positive' \| 'cautionary' \| 'negative' \| 'navy'` | No | 공개 타입 계약에 정의된 속성입니다. |
| `title` | `React.ReactNode` | No | 공개 타입 계약에 정의된 속성입니다. |
| `icon` | `React.ReactElement \| null` | No | tone별 기본 아이콘을 교체합니다. 생략하거나 null을 전달해도 기본 아이콘은 유지됩니다. |
| `children` | `React.ReactNode` | No | 공개 타입 계약에 정의된 속성입니다. |

## States

| State | Contract |
| --- | --- |
| tone | 톤. @default "info" 타입 계약: 'signal' \| 'positive' \| 'cautionary' \| 'negative' \| 'info' \| 'success' \| 'warning' \| 'error' |
| variant | 표면 배치. embedded는 부모 패널 내부의 edge-to-edge 상태 띠입니다. @default "standalone" 타입 계약: 'standalone' \| 'embedded' |
| tone | 공개 타입 계약에 정의된 속성입니다. 타입 계약: 'signal' \| 'positive' \| 'cautionary' \| 'negative' \| 'navy' |
| 변형·상태 · 독립형과 결합형 안내 | variants-states 공개 스토리에서 렌더링 및 상호작용 증거를 유지합니다. |

## Behavior and interaction

- 선택 기준 — 비동기 작업, 연결, 권한, 검증 결과처럼 상태가 바뀌며 사용자가 알아야 하는 정보에는 Banner를 사용합니다. 상태와 함께 다음 행동이 필요하면 action, 사용자가 숨겨도 되는 비차단 알림이면 onClose를 제공합니다. Banner는 기본적으로 live status이며 negative tone은 alert이므로, 처음부터 본문에 남아 있는 설명을 단지 색으로 강조하려는 용도로 사용하지 않습니다.
- tone — canonical signal · positive · cautionary · negative를 받으며, 기존 info · success · warning · error도 별칭으로 계속 동작합니다. variant — standalone(기본) 또는 embedded. title / children — 헤드라인 + 선택적 보충 설명. action — 끝의 노드. onClose — 닫기 버튼 표시. 떠 있는 일시 메시지에는 Toast를 쓰세요.
- 패널 전체의 현재 gate/state를 짧게 알릴 때는 header 바로 아래에 variant="embedded"를 사용합니다. 정상·잠금처럼 설명이 없어도 이해되는 상태는 제목 한 줄로 유지하고, 오류 원인이나 복구 방법이 필요한 경우에만 본문을 추가합니다. 부모 표면 안에서 style로 border와 radius를 임의 덮어쓰지 않습니다.
- 독립된 동적 알림에는 standalone, 떠 있는 일시 메시지에는 Toast, 본문에 계속 남는 절차·주의·맥락 설명에는 Callout을 사용합니다. 액션이나 닫기가 필요하다는 이유만으로 정적 설명을 Banner로 바꾸지 말고, 실제로 상태가 변하는지 먼저 판단합니다.
- tone 아이콘은 공통 Icon registry의 statusToneStyle 글리프(circle-info-fill, circle-check-fill, triangle-exclamation-fill, circle-close-fill)를 사용합니다. severity 글리프를 인라인 SVG로 새로 그리지 않습니다 — 같은 상태는 Callout·ValidationSummary와 같은 모양으로 표시되어야 합니다.

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 명시 규칙 1 | 타입 스케일 정합: 제목 14.5px → --body2-size(15px), 본문 13.5px → --label1-size(14px)로 스냅했습니다. Toast 메시지(body2)·Snackbar 메시지(label1)와 같은 단계로 정렬됩니다. |
| 명시 규칙 2 | Fluent 2 MessageBar의 card-level 배치 원칙을 따라 패널 상태 Banner는 header 바로 아래, 제어 본문보다 먼저 읽히게 합니다. 상태·설명·액션의 순서도 DOM 순서와 일치시킵니다. |
| 명시 규칙 3 | - 선택 기준 — 비동기 작업, 연결, 권한, 검증 결과처럼 상태가 바뀌며 사용자가 알아야 하는 정보에는 Banner를 사용합니다. 상태와 함께 다음 행동이 필요하면 action, 사용자가 숨겨도 되는 비차단 알림이면 onClose를 제공합니다. Banner는 기본적으로 live status이며 negative tone은 alert이므로, 처음부터 본문에 남아 있는 설명을 단지 색으로 강조하려는 용도로 사용하지 않습니다. - tone — canonical signal · positive · cautionary · negative를 받으며, 기존 info · succ… |
| 명시 규칙 4 | - Primer Banner의 card 안 flush 배치처럼, 컨테이너 상태는 별도의 둥근 카드로 중첩하지 않고 부모 표면의 폭에 결합합니다. LDS에서는 이를 variant="embedded"로 명시합니다. - Fluent 2 MessageBar의 card-level 배치 원칙을 따라 패널 상태 Banner는 header 바로 아래, 제어 본문보다 먼저 읽히게 합니다. 상태·설명·액션의 순서도 DOM 순서와 일치시킵니다. - GNOME HIG Banners의 현재 view에 지속되는 중요 상태 패턴을 반영해, dialog를 열 정도는 아니지만 사용자가 다음 행동… |
| --body2-size | 15px |

## Responsive

- 320px 좁은 폭과 200% 텍스트 확대에서 페이지 가로 overflow 없이 의미 순서를 유지합니다.
- 고정 폭보다 부모 containment와 wrapping을 우선하고, 제품이 필요할 때 명시적으로 compact 표현을 선택합니다.

## Content and writing

- 선택 기준 — 비동기 작업, 연결, 권한, 검증 결과처럼 상태가 바뀌며 사용자가 알아야 하는 정보에는 Banner를 사용합니다. 상태와 함께 다음 행동이 필요하면 action, 사용자가 숨겨도 되는 비차단 알림이면 onClose를 제공합니다. Banner는 기본적으로 live status이며 negative tone은 alert이므로, 처음부터 본문에 남아 있는 설명을 단지 색으로 강조하려는 용도로 사용하지 않습니다.
- tone — canonical signal · positive · cautionary · negative를 받으며, 기존 info · success · warning · error도 별칭으로 계속 동작합니다. variant — standalone(기본) 또는 embedded. title / children — 헤드라인 + 선택적 보충 설명. action — 끝의 노드. onClose — 닫기 버튼 표시. 떠 있는 일시 메시지에는 Toast를 쓰세요.
- 패널 전체의 현재 gate/state를 짧게 알릴 때는 header 바로 아래에 variant="embedded"를 사용합니다. 정상·잠금처럼 설명이 없어도 이해되는 상태는 제목 한 줄로 유지하고, 오류 원인이나 복구 방법이 필요한 경우에만 본문을 추가합니다. 부모 표면 안에서 style로 border와 radius를 임의 덮어쓰지 않습니다.
- 독립된 동적 알림에는 standalone, 떠 있는 일시 메시지에는 Toast, 본문에 계속 남는 절차·주의·맥락 설명에는 Callout을 사용합니다. 액션이나 닫기가 필요하다는 이유만으로 정적 설명을 Banner로 바꾸지 말고, 실제로 상태가 변하는지 먼저 판단합니다.

## Accessibility

- native semantic을 우선하며 사용자에게 보이는 이름과 접근 가능한 이름이 같은 목적을 설명하게 합니다.
- 키보드 focus 순서, focus-visible 표시와 상태 ARIA가 시각 상태와 동시에 갱신되는지 공개 스토리에서 검증합니다.
- 색상, 모양 또는 아이콘 하나만으로 상태를 구분하지 않고 이름·텍스트·semantic state를 함께 제공합니다.

## Do / Don't

| Kind | Guidance |
| --- | --- |
| Do | 패널 전체의 현재 gate/state를 짧게 알릴 때는 header 바로 아래에 variant="embedded"를 사용합니다. 정상·잠금처럼 설명이 없어도 이해되는 상태는 제목 한 줄로 유지하고, 오류 원인이나 복구 방법이 필요한 경우에만 본문을 추가합니다. 부모 표면 안에서 style로 border와 radius를 임의 덮어쓰지 않습니다. |
| Don't | 선택 기준 — 비동기 작업, 연결, 권한, 검증 결과처럼 상태가 바뀌며 사용자가 알아야 하는 정보에는 Banner를 사용합니다. 상태와 함께 다음 행동이 필요하면 action, 사용자가 숨겨도 되는 비차단 알림이면 onClose를 제공합니다. Banner는 기본적으로 live status이며 negative tone은 alert이므로, 처음부터 본문에 남아 있는 설명을 단지 색으로 강조하려는 용도로 사용하지 않습니다. |
| Do | 독립된 동적 알림에는 standalone, 떠 있는 일시 메시지에는 Toast, 본문에 계속 남는 절차·주의·맥락 설명에는 Callout을 사용합니다. 액션이나 닫기가 필요하다는 이유만으로 정적 설명을 Banner로 바꾸지 말고, 실제로 상태가 변하는지 먼저 판단합니다. |
| Don't | Primer Banner의 card 안 flush 배치처럼, 컨테이너 상태는 별도의 둥근 카드로 중첩하지 않고 부모 표면의 폭에 결합합니다. LDS에서는 이를 variant="embedded"로 명시합니다. |

## Exceptions

- 패널 전체의 현재 gate/state를 짧게 알릴 때는 header 바로 아래에 variant="embedded"를 사용합니다. 정상·잠금처럼 설명이 없어도 이해되는 상태는 제목 한 줄로 유지하고, 오류 원인이나 복구 방법이 필요한 경우에만 본문을 추가합니다. 부모 표면 안에서 style로 border와 radius를 임의 덮어쓰지 않습니다.
- - 선택 기준 — 비동기 작업, 연결, 권한, 검증 결과처럼 상태가 바뀌며 사용자가 알아야 하는 정보에는 Banner를 사용합니다. 상태와 함께 다음 행동이 필요하면 action, 사용자가 숨겨도 되는 비차단 알림이면 onClose를 제공합니다. Banner는 기본적으로 live status이며 negative tone은 alert이므로, 처음부터 본문에 남아 있는 설명을 단지 색으로 강조하려는 용도로 사용하지 않습니다. - tone — canonical signal · positive · cautionary · negative를 받으며, 기존 info · succ….
- 제품 정책을 포함해야 하는 예외는 wrapper 또는 제품 저장소에서 조합하고 Banner의 범용 API에 넣지 않습니다.

## Related components

| Component | Relationship |
| --- | --- |
| `Callout` | 같은 페이지가 소유하는 공개 primitive 또는 조합 요소입니다. |
| `Button` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `EmptyState` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `Skeleton` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `Spinner` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |

## Examples

### 기본 조합

```jsx
<Banner tone="info" title="문서 업데이트" onClose={dismiss}>디자인 시스템 문서가 업데이트되었습니다.</Banner>
<Banner tone="warning">일부 항목에 검토가 필요합니다.</Banner>
<Banner variant="embedded" tone="warning" title="제어 대기">상위 패널의 상태를 설명합니다.</Banner>
```

## Tokens and API

### Tokens

- `--body2-size`
- `--color-semantic-label-neutral`
- `--color-semantic-label-normal`
- `--font-sans`
- `--fw-bold`
- `--label1-size`
- `--radius-lg`
- `--space-3`
- `--space-5`

### Source contracts

- `components/status/Banner.jsx`
- `components/status/Banner.d.ts`
- `components/status/Banner.prompt.md`
- `components/status/Callout.jsx`
- `components/status/Callout.d.ts`
- `components/status/Callout.prompt.md`
- `stories/StatusFeedback.stories.jsx`

## Migration

- tone — canonical signal · positive · cautionary · negative를 받으며, 기존 info · success · warning · error도 별칭으로 계속 동작합니다. variant — standalone(기본) 또는 embedded. title / children — 헤드라인 + 선택적 보충 설명. action — 끝의 노드. onClose — 닫기 버튼 표시. 떠 있는 일시 메시지에는 Toast를 쓰세요.
- 상태색은 statusToneStyle을 통해 --color-semantic-status- 계층을 직접 소비합니다. 과거의 --component-banner- 별칭 토큰은 값 없는 순수 참조여서 제거되었습니다(디자인 시스템이 상류이므로 소비자는 시맨틱 status 토큰을 채택합니다). 재도입 참조는 check:colors 가드가 차단합니다.
- - 선택 기준 — 비동기 작업, 연결, 권한, 검증 결과처럼 상태가 바뀌며 사용자가 알아야 하는 정보에는 Banner를 사용합니다. 상태와 함께 다음 행동이 필요하면 action, 사용자가 숨겨도 되는 비차단 알림이면 onClose를 제공합니다. Banner는 기본적으로 live status이며 negative tone은 alert이므로, 처음부터 본문에 남아 있는 설명을 단지 색으로 강조하려는 용도로 사용하지 않습니다. - tone — canonical signal · positive · cautionary · negative를 받으며, 기존 info · succ….
- 현재 prompt와 타입 계약에 기록되지 않은 legacy alias는 새 코드에서 도입하지 않습니다.

## Sources

- Banner prompt contract: `components/status/Banner.prompt.md`
- Storybook implementation evidence: `stories/StatusFeedback.stories.jsx`
- [Primer Banner](https://primer.style/product/components/banner/)
- [Fluent 2 MessageBar](https://fluent2.microsoft.design/components/web/react/core/messagebar/usage)
- [GNOME HIG Banners](https://developer.gnome.org/hig/patterns/feedback/banners.html)
- [Carbon Notification usage](https://carbondesignsystem.com/components/notification/usage/)
- [SEED Notices and Callouts benchmark](https://seed-design.io/components/page-banner)
