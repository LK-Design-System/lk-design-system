# Status Badge

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Core / Status |
| Owner | `StatusBadge` |
| Storybook | `LDS Core/Components/Status/Status Badge` |
| Source | `../component-content.json#core-components-status-status-badge` |

장치·서비스·작업의 가동, 점검, 오류, 오프라인처럼 현재 상태가 정해진 어휘로 반복 표시될 때 적합합니다. 단순 분류나 임의 키워드에는 Tag를, 변화의 원인과 다음 행동까지 설명해야 하면 Banner나 Notification을 사용하고 색상만으로 상태를 전달하지 마세요.

## 사용 판단

### 사용

- 장치·서비스·작업의 가동, 점검, 오류, 오프라인처럼 현재 상태가 정해진 어휘로 반복 표시될 때 적합합니다. 단순 분류나 임의 키워드에는 Tag를, 변화의 원인과 다음 행동까지 설명해야 하면 Banner나 Notification을 사용하고 색상만으로 상태를 전달하지 마세요.
- Status Badge가 소유하는 Status 의미와 상태를 여러 제품 화면에서 동일하게 재사용할 때 사용합니다.
- 제품별 구현 대신 공개 StatusBadge API와 semantic token으로 일관성을 유지해야 할 때 사용합니다.

### 사용하지 않음

- 모션은 prefers-reduced-motion에서 정지합니다. critical은 모션 없이도 읽히는 이중 정적 링과 보이는 라벨을 함께 사용하므로 negative와 pulse 하나만으로 구분하지 않습니다.
- - tone — positive/online · cautionary/warning · negative · offline · signal. pulse — 실시간 상태용 애니메이션 링. - 모션은 prefers-reduced-motion에서 정지합니다. critical은 모션 없이도 읽히는 이중 정적 링과 보이는 라벨을 함께 사용하므로 negative와 pulse 하나만으로 구분하지 않습니다. - 상태는 LK 아이코노그래피에 따라 (글리프가 아니라) 컬러 점을 씁니다.
- Status Badge가 소유하지 않는 라우팅, 권한, 데이터 요청, 제품 임계값을 컴포넌트 내부에 넣지 않습니다.
- 동일한 목적을 더 단순한 native 요소나 기존 LDS primitive로 해결할 수 있으면 새 조합을 만들지 않습니다.

## Anatomy

| Part | Contract |
| --- | --- |
| Root | StatusBadge의 semantic role, layout containment와 전달받은 DOM 속성을 소유합니다. |
| Children | children 속성으로 제공되는 공개 슬롯 또는 표시 영역입니다. |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `tone` | `'positive' \| 'online' \| 'cautionary' \| 'warning' \| 'negative' \| 'offline' \| 'signal' \| 'critical'` | No | 점 톤. @default "positive" |
| `pulse` | `boolean` | No | 부드러운 실시간 상태 링을 퍼뜨림. @default false |
| `children` | `React.ReactNode` | No | 공개 타입 계약에 정의된 속성입니다. |

## States

| State | Contract |
| --- | --- |
| tone | 점 톤. @default "positive" 타입 계약: 'positive' \| 'online' \| 'cautionary' \| 'warning' \| 'negative' \| 'offline' \| 'signal' \| 'critical' |

## Behavior and interaction

- tone — positive/online · cautionary/warning · negative · offline · signal. pulse — 실시간 상태용 애니메이션 링.
- 상태는 LK 아이코노그래피에 따라 (글리프가 아니라) 컬러 점을 씁니다.
- StatusBadge — 운영 상태를 나타내는 컬러 점 + 라벨. pulse는 부드러운 링을 퍼뜨려 실시간 "감지" 신호를 줍니다.
- - tone — positive/online · cautionary/warning · negative · offline · signal. pulse — 실시간 상태용 애니메이션 링. - 모션은 prefers-reduced-motion에서 정지합니다. critical은 모션 없이도 읽히는 이중 정적 링과 보이는 라벨을 함께 사용하므로 negative와 pulse 하나만으로 구분하지 않습니다. - 상태는 LK 아이코노그래피에 따라 (글리프가 아니라) 컬러 점을 씁니다.
- StatusBadge의 controlled/uncontrolled 경계와 callback 순서는 공개 타입 계약을 따릅니다.

## 정량 규칙

| Subject | Rule |
| --- | --- |
| --caption1-size | {"fontSize":"12px","lineHeight":"16px","letterSpacing":"0.0252em"} |
| --fw-semibold | 600 |

## Responsive

- 320px 좁은 폭과 200% 텍스트 확대에서 페이지 가로 overflow 없이 의미 순서를 유지합니다.
- 고정 폭보다 부모 containment와 wrapping을 우선하고, 제품이 필요할 때 명시적으로 compact 표현을 선택합니다.

## Content and writing

- 모션은 prefers-reduced-motion에서 정지합니다. critical은 모션 없이도 읽히는 이중 정적 링과 보이는 라벨을 함께 사용하므로 negative와 pulse 하나만으로 구분하지 않습니다.
- StatusBadge — 운영 상태를 나타내는 컬러 점 + 라벨. pulse는 부드러운 링을 퍼뜨려 실시간 "감지" 신호를 줍니다.
- - tone — positive/online · cautionary/warning · negative · offline · signal. pulse — 실시간 상태용 애니메이션 링. - 모션은 prefers-reduced-motion에서 정지합니다. critical은 모션 없이도 읽히는 이중 정적 링과 보이는 라벨을 함께 사용하므로 negative와 pulse 하나만으로 구분하지 않습니다. - 상태는 LK 아이코노그래피에 따라 (글리프가 아니라) 컬러 점을 씁니다.
- 사용자에게 보이는 Status Badge 문자열은 제품 번역 계층에서 제공하고 행동 또는 상태를 구체적으로 설명합니다.

## Accessibility

- native semantic을 우선하며 사용자에게 보이는 이름과 접근 가능한 이름이 같은 목적을 설명하게 합니다.
- 키보드 focus 순서, focus-visible 표시와 상태 ARIA가 시각 상태와 동시에 갱신되는지 공개 스토리에서 검증합니다.
- 색상, 모양 또는 아이콘 하나만으로 상태를 구분하지 않고 이름·텍스트·semantic state를 함께 제공합니다.

## Do / Don't

| Kind | Guidance |
| --- | --- |
| Do | Status Badge가 소유하는 Status 의미와 상태를 여러 제품 화면에서 동일하게 재사용할 때 사용합니다. |
| Don't | 모션은 prefers-reduced-motion에서 정지합니다. critical은 모션 없이도 읽히는 이중 정적 링과 보이는 라벨을 함께 사용하므로 negative와 pulse 하나만으로 구분하지 않습니다. |
| Do | 제품별 구현 대신 공개 StatusBadge API와 semantic token으로 일관성을 유지해야 할 때 사용합니다. |
| Don't | - tone — positive/online · cautionary/warning · negative · offline · signal. pulse — 실시간 상태용 애니메이션 링. - 모션은 prefers-reduced-motion에서 정지합니다. critical은 모션 없이도 읽히는 이중 정적 링과 보이는 라벨을 함께 사용하므로 negative와 pulse 하나만으로 구분하지 않습니다. - 상태는 LK 아이코노그래피에 따라 (글리프가 아니라) 컬러 점을 씁니다. |

## Exceptions

- 제품 정책을 포함해야 하는 예외는 wrapper 또는 제품 저장소에서 조합하고 StatusBadge의 범용 API에 넣지 않습니다.
- 접근성 또는 안전 계약을 약화하는 예외는 허용하지 않으며 필요한 차이는 prompt와 Storybook 증거에 기록합니다.

## Related components

| Component | Relationship |
| --- | --- |
| `Accordion` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `Blockquote` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `Code` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `Collapsible` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `ContentBadge` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `Kbd` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `ListCell` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `Overline` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |

## Examples

### 기본 조합

```jsx
<StatusBadge tone="positive" pulse>가동중 3대</StatusBadge>
<StatusBadge tone="warning">점검 중</StatusBadge>
<StatusBadge tone="offline">오프라인</StatusBadge>
```

## Tokens and API

### Tokens

- `--caption1-size`
- `--component-status-badge-cautionary-indicator`
- `--component-status-badge-critical-indicator`
- `--component-status-badge-foreground`
- `--component-status-badge-negative-indicator`
- `--component-status-badge-offline-indicator`
- `--component-status-badge-positive-indicator`
- `--component-status-badge-signal-indicator`
- `--component-status-badge-surface`
- `--ease-out`
- `--font-sans`
- `--fw-semibold`

### Source contracts

- `components/content/StatusBadge.jsx`
- `components/content/StatusBadge.d.ts`
- `components/content/StatusBadge.prompt.md`
- `stories/StatusStatusBadge.stories.jsx`

## Migration

- 현재 prompt와 타입 계약에 기록되지 않은 legacy alias는 새 코드에서 도입하지 않습니다.
- 대체 컴포넌트가 생기면 기존 API의 제거 버전, 대응 prop과 자동·수동 전환 절차를 이 페이지에 기록합니다.

## Sources

- StatusBadge prompt contract: `components/content/StatusBadge.prompt.md`
- Storybook implementation evidence: `stories/StatusStatusBadge.stories.jsx`
