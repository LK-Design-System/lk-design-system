# Badges and Tags

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Core / Status |
| Owner | `Badge` |
| Storybook | `LDS Core/Components/Status/Badges and Tags` |
| Source | `../component-content.json#core-components-status-badges-and-tags` |

목록·아이콘·콘텐츠 옆에서 짧은 수량이나 분류를 보조하고 공간을 적게 써야 할 때 적합합니다. 현재 가동 상태처럼 의미가 정해진 실시간 상태에는 Status Badge를, 사용자가 선택하거나 해제하는 값에는 Chip을 사용하고 긴 문장이나 핵심 안내를 작은 표식에 넣지 마세요.

## 사용 판단

### 사용

- 목록·아이콘·콘텐츠 옆에서 짧은 수량이나 분류를 보조하고 공간을 적게 써야 할 때 적합합니다. 현재 가동 상태처럼 의미가 정해진 실시간 상태에는 Status Badge를, 사용자가 선택하거나 해제하는 값에는 Chip을 사용하고 긴 문장이나 핵심 안내를 작은 표식에 넣지 마세요.
- Badges and Tags가 소유하는 Status 의미와 상태를 여러 제품 화면에서 동일하게 재사용할 때 사용합니다.
- 제품별 구현 대신 공개 Badge API와 semantic token으로 일관성을 유지해야 할 때 사용합니다.

### 사용하지 않음

- dot — 점만으로 의미를 전달하지 않습니다(WCAG 1.4.1 Use of Color).
- max — 숫자(또는 숫자 문자열) children의 오버플로 클램프. 기본 99이며 초과 시 "99+"로 표시합니다. max={null}이면 클램프하지 않고, 텍스트 라벨("점검" 등)은 영향을 받지 않습니다. PushBadge의 max와 같은 규칙입니다.
- - tone — 의미 기반 signal · positive · cautionary · negative가 표준입니다. navy · steel은 장식 hue이고, amber · red는 기존 소비자를 위한 별칭입니다. - dot — 점만으로 의미를 전달하지 않습니다(WCAG 1.4.1 Use of Color). - children이 있으면 점 + 텍스트가 함께 보입니다(장애 → 점과 "장애"가 같이 읽힘). - children이 없는 단독 점은 기본적으로 장식이며 aria-hidden="true"가 됩니다. 옆에 이미 같은 의미의 텍스트가 있을 때만 쓰세요. - 단독….
- Badges and Tags가 소유하지 않는 라우팅, 권한, 데이터 요청, 제품 임계값을 컴포넌트 내부에 넣지 않습니다.

## Anatomy

| Part | Contract |
| --- | --- |
| Root | Badge의 semantic role, layout containment와 전달받은 DOM 속성을 소유합니다. |
| Children | children 속성으로 제공되는 공개 슬롯 또는 표시 영역입니다. |
| Label | 보조기술에 전달할 배지 텍스트. 감싼 컨트롤이 이미 접근 가능한 이름을 가지면 그 이름 뒤에 붙고("알림" → "알림 읽지 않음 7건"), 아니면 visually-hidden 텍스트로 렌더됩니다. 기본값: count가 있으면 "읽지 않음 N건"(클램프 시 "읽지 않음 99건 이상"), dot만 있으면 값이 없으므로 침묵합니다. label={false} 또는 label={null}로 완전히 장식 처리할 수 있습니다. |
| Children | children 속성으로 제공되는 공개 슬롯 또는 표시 영역입니다. |
| Children | children 속성으로 제공되는 공개 슬롯 또는 표시 영역입니다. |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `tone` | `'signal' \| 'positive' \| 'cautionary' \| 'negative' \| 'navy' \| 'steel' \| 'amber' \| 'red'` | No | 색상 톤. @default "signal" |
| `dot` | `boolean` | No | 톤 색상의 상태 점을 라벨 앞에 붙입니다. children이 있으면 텍스트가 점 옆에 그대로 보이며, children이 없는 단독 점은 장식(aria-hidden)입니다. 단독 점에 의미가 있으면 aria-label을 함께 전달해 role="img"로 이름을 부여하세요. @default false |
| `max` | `number \| null` | No | 카운트 클램프. 숫자(또는 숫자 문자열) children이 이 값을 넘으면 "max+"로 표시합니다. 텍스트 라벨은 클램프되지 않습니다. null이면 클램프 없음. |
| `children` | `React.ReactNode` | No | 공개 타입 계약에 정의된 속성입니다. |
| `count` | `number` | No | 표시할 숫자(dot과 함께 쓸 땐 생략). |
| `dot` | `boolean` | No | 숫자 대신 점만 표시. @default false |
| `max` | `number` | No | 클램프: 초과 값은 "max+"로 표시. @default 99 |
| `tone` | `'negative' \| 'signal' \| 'navy'` | No | 공개 타입 계약에 정의된 속성입니다. |
| `label` | `string \| false \| null` | No | 보조기술에 전달할 배지 텍스트. 감싼 컨트롤이 이미 접근 가능한 이름을 가지면 그 이름 뒤에 붙고("알림" → "알림 읽지 않음 7건"), 아니면 visually-hidden 텍스트로 렌더됩니다. 기본값: count가 있으면 "읽지 않음 N건"(클램프 시 "읽지 않음 99건 이상"), dot만 있으면 값이 없으므로 침묵합니다. label={false} 또는 label={null}로 완전히 장식 처리할 수 있습니다. |
| `children` | `React.ReactNode` | No | 공개 타입 계약에 정의된 속성입니다. |
| `tone` | `'signal' \| 'neutral' \| 'steel' \| 'amber' \| 'red'` | No | 색상 톤. @default "signal" |
| `solid` | `boolean` | No | 부드러운 틴트 대신 솔리드로 채움. @default false |
| `children` | `React.ReactNode` | No | 공개 타입 계약에 정의된 속성입니다. |

## States

| State | Contract |
| --- | --- |
| tone | 색상 톤. @default "signal" 타입 계약: 'signal' \| 'positive' \| 'cautionary' \| 'negative' \| 'navy' \| 'steel' \| 'amber' \| 'red' |
| tone | 공개 타입 계약에 정의된 속성입니다. 타입 계약: 'negative' \| 'signal' \| 'navy' |
| tone | 색상 톤. @default "signal" 타입 계약: 'signal' \| 'neutral' \| 'steel' \| 'amber' \| 'red' |

## Behavior and interaction

- max — 숫자(또는 숫자 문자열) children의 오버플로 클램프. 기본 99이며 초과 시 "99+"로 표시합니다. max={null}이면 클램프하지 않고, 텍스트 라벨("점검" 등)은 영향을 받지 않습니다. PushBadge의 max와 같은 규칙입니다.
- Badge — 작은 상태/카운트 토큰. dot은 톤 색상의 상태 점을 라벨 앞에 붙입니다.
- - tone — 의미 기반 signal · positive · cautionary · negative가 표준입니다. navy · steel은 장식 hue이고, amber · red는 기존 소비자를 위한 별칭입니다. - dot — 점만으로 의미를 전달하지 않습니다(WCAG 1.4.1 Use of Color). - children이 있으면 점 + 텍스트가 함께 보입니다(장애 → 점과 "장애"가 같이 읽힘). - children이 없는 단독 점은 기본적으로 장식이며 aria-hidden="true"가 됩니다. 옆에 이미 같은 의미의 텍스트가 있을 때만 쓰세요. - 단독….
- Badge의 controlled/uncontrolled 경계와 callback 순서는 공개 타입 계약을 따릅니다.
- 상태 변화 중에도 accessible name, focus 위치와 레이아웃 기준점을 예고 없이 잃지 않습니다.

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 명시 규칙 1 | dot — 점만으로 의미를 전달하지 않습니다(WCAG 1.4.1 Use of Color). |
| 명시 규칙 2 | max — 숫자(또는 숫자 문자열) children의 오버플로 클램프. 기본 99이며 초과 시 "99+"로 표시합니다. max={null}이면 클램프하지 않고, 텍스트 라벨("점검" 등)은 영향을 받지 않습니다. PushBadge의 max와 같은 규칙입니다. |
| 명시 규칙 3 | - tone — 의미 기반 signal · positive · cautionary · negative가 표준입니다. navy · steel은 장식 hue이고, amber · red는 기존 소비자를 위한 별칭입니다. - dot — 점만으로 의미를 전달하지 않습니다(WCAG 1.4.1 Use of Color). - children이 있으면 점 + 텍스트가 함께 보입니다(장애 → 점과 "장애"가 같이 읽힘). - children이 없는 단독 점은 기본적으로 장식이며 aria-hidden="true"가 됩니다. 옆에 이미 같은 의미의 텍스트가 있을 때만 쓰세요. - 단독… |
| --caption1-size | {"fontSize":"12px","lineHeight":"16px","letterSpacing":"0.0252em"} |
| --caption2-size | 11px |

## Responsive

- 320px 좁은 폭과 200% 텍스트 확대에서 페이지 가로 overflow 없이 의미 순서를 유지합니다.
- 고정 폭보다 부모 containment와 wrapping을 우선하고, 제품이 필요할 때 명시적으로 compact 표현을 선택합니다.

## Content and writing

- children이 있으면 점 + 텍스트가 함께 보입니다(장애 → 점과 "장애"가 같이 읽힘).
- children이 없는 단독 점은 기본적으로 장식이며 aria-hidden="true"가 됩니다. 옆에 이미 같은 의미의 텍스트가 있을 때만 쓰세요.
- 단독 점 자체가 유일한 의미 전달 수단이면 aria-label(또는 aria-labelledby)을 반드시 전달하세요. 이 경우 role="img"로 이름이 노출됩니다.
- max — 숫자(또는 숫자 문자열) children의 오버플로 클램프. 기본 99이며 초과 시 "99+"로 표시합니다. max={null}이면 클램프하지 않고, 텍스트 라벨("점검" 등)은 영향을 받지 않습니다. PushBadge의 max와 같은 규칙입니다.

## Accessibility

- dot — 점만으로 의미를 전달하지 않습니다(WCAG 1.4.1 Use of Color).
- children이 없는 단독 점은 기본적으로 장식이며 aria-hidden="true"가 됩니다. 옆에 이미 같은 의미의 텍스트가 있을 때만 쓰세요.
- 단독 점 자체가 유일한 의미 전달 수단이면 aria-label(또는 aria-labelledby)을 반드시 전달하세요. 이 경우 role="img"로 이름이 노출됩니다.
- - tone — 의미 기반 signal · positive · cautionary · negative가 표준입니다. navy · steel은 장식 hue이고, amber · red는 기존 소비자를 위한 별칭입니다. - dot — 점만으로 의미를 전달하지 않습니다(WCAG 1.4.1 Use of Color). - children이 있으면 점 + 텍스트가 함께 보입니다(장애 → 점과 "장애"가 같이 읽힘). - children이 없는 단독 점은 기본적으로 장식이며 aria-hidden="true"가 됩니다. 옆에 이미 같은 의미의 텍스트가 있을 때만 쓰세요. - 단독….
- native semantic을 우선하며 사용자에게 보이는 이름과 접근 가능한 이름이 같은 목적을 설명하게 합니다.

## Do / Don't

| Kind | Guidance |
| --- | --- |
| Do | Badges and Tags가 소유하는 Status 의미와 상태를 여러 제품 화면에서 동일하게 재사용할 때 사용합니다. |
| Don't | dot — 점만으로 의미를 전달하지 않습니다(WCAG 1.4.1 Use of Color). |
| Do | 제품별 구현 대신 공개 Badge API와 semantic token으로 일관성을 유지해야 할 때 사용합니다. |
| Don't | max — 숫자(또는 숫자 문자열) children의 오버플로 클램프. 기본 99이며 초과 시 "99+"로 표시합니다. max={null}이면 클램프하지 않고, 텍스트 라벨("점검" 등)은 영향을 받지 않습니다. PushBadge의 max와 같은 규칙입니다. |

## Exceptions

- 제품 정책을 포함해야 하는 예외는 wrapper 또는 제품 저장소에서 조합하고 Badge의 범용 API에 넣지 않습니다.
- 접근성 또는 안전 계약을 약화하는 예외는 허용하지 않으며 필요한 차이는 prompt와 Storybook 증거에 기록합니다.

## Related components

| Component | Relationship |
| --- | --- |
| `PushBadge` | 같은 페이지가 소유하는 공개 primitive 또는 조합 요소입니다. |
| `Tag` | 같은 페이지가 소유하는 공개 primitive 또는 조합 요소입니다. |
| `Icon` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `IconButton` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `Avatar` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `AvatarGroup` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `Chip` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `Notification` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |

## Examples

### 기본 조합

```jsx
<Badge tone="signal">3</Badge>
<Badge tone="negative" dot>장애</Badge>
<Badge tone="negative" dot aria-label="장애" />
<Badge tone="signal" max={99}>128</Badge>
```

## Tokens and API

### Tokens

- `--caption1-size`
- `--caption2-size`
- `--color-semantic-accent-foreground-blue`
- `--color-semantic-accent-foreground-red`
- `--color-semantic-background-elevated-normal`
- `--color-semantic-data-viz-series-4`
- `--color-semantic-data-viz-series-5`
- `--color-semantic-fill-strong`
- `--color-semantic-inverse-background`
- `--color-semantic-label-normal`
- `--color-semantic-label-strong`
- `--color-semantic-primary-normal`
- `--color-semantic-primary-surface-strong`
- `--color-semantic-secondary-normal`
- `--color-semantic-secondary-surface`
- `--color-semantic-static-black`
- `--color-semantic-static-white`
- `--color-semantic-status-cautionary-foreground`
- `--color-semantic-status-cautionary-text`
- `--color-semantic-status-negative-foreground`
- `--color-semantic-status-negative-text`
- `--color-semantic-status-positive-foreground`
- `--component-badge-cautionary-bg`
- `--component-badge-cautionary-fg`
- `--component-badge-navy-bg`
- `--component-badge-navy-fg`
- `--component-badge-negative-bg`
- `--component-badge-negative-fg`
- `--component-badge-positive-bg`
- `--component-badge-positive-fg`
- `--component-badge-signal-bg`
- `--component-badge-signal-fg`
- `--component-badge-steel-bg`
- `--component-badge-steel-fg`
- `--component-tag-height`
- `--font-sans`
- `--fs-caption`
- `--fw-bold`
- `--ls-caption`
- `--radius-pill`

### Source contracts

- `components/feedback/Badge.jsx`
- `components/feedback/Badge.d.ts`
- `components/feedback/Badge.prompt.md`
- `components/feedback/PushBadge.jsx`
- `components/feedback/PushBadge.d.ts`
- `components/feedback/PushBadge.prompt.md`
- `components/feedback/Tag.jsx`
- `components/feedback/Tag.d.ts`
- `components/feedback/Tag.prompt.md`
- `stories/FeedbackBadgesTags.stories.jsx`

## Migration

- tone — 의미 기반 signal · positive · cautionary · negative가 표준입니다. navy · steel은 장식 hue이고, amber · red는 기존 소비자를 위한 별칭입니다.
- - tone — 의미 기반 signal · positive · cautionary · negative가 표준입니다. navy · steel은 장식 hue이고, amber · red는 기존 소비자를 위한 별칭입니다. - dot — 점만으로 의미를 전달하지 않습니다(WCAG 1.4.1 Use of Color). - children이 있으면 점 + 텍스트가 함께 보입니다(장애 → 점과 "장애"가 같이 읽힘). - children이 없는 단독 점은 기본적으로 장식이며 aria-hidden="true"가 됩니다. 옆에 이미 같은 의미의 텍스트가 있을 때만 쓰세요. - 단독….
- 현재 prompt와 타입 계약에 기록되지 않은 legacy alias는 새 코드에서 도입하지 않습니다.
- 대체 컴포넌트가 생기면 기존 API의 제거 버전, 대응 prop과 자동·수동 전환 절차를 이 페이지에 기록합니다.

## Sources

- Badge prompt contract: `components/feedback/Badge.prompt.md`
- Storybook implementation evidence: `stories/FeedbackBadgesTags.stories.jsx`
- [WCAG 1.4.1 Use of Color](https://www.w3.org/TR/WCAG22/#use-of-color)
- [SEED Badges and Tags benchmark](https://seed-design.io/components/badge)
