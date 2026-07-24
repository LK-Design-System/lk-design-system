# Avatar

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Core / Content |
| Owner | `Avatar` |
| Storybook | `LDS Core/Components/Content/Avatar` |
| Source | `../component-content.json#core-components-content-avatar` |

작성자, 담당자, 참여자처럼 동일한 종류의 주체를 빠르게 식별해야 하는 목록과 협업 화면에 적합합니다. 대상의 이름이 핵심이면 텍스트 레이블을 함께 제공하고, 상태나 범주를 나타낼 때는 Avatar 대신 Status Badge나 Content Badge를 사용하세요.

## 사용 판단

### 사용

- 작성자, 담당자, 참여자처럼 동일한 종류의 주체를 빠르게 식별해야 하는 목록과 협업 화면에 적합합니다. 대상의 이름이 핵심이면 텍스트 레이블을 함께 제공하고, 상태나 범주를 나타낼 때는 Avatar 대신 Status Badge나 Content Badge를 사용하세요.
- Avatar가 소유하는 Content 의미와 상태를 여러 제품 화면에서 동일하게 재사용할 때 사용합니다.
- 제품별 구현 대신 공개 Avatar API와 semantic token으로 일관성을 유지해야 할 때 사용합니다.

### 사용하지 않음

- status 점과 pushBadge는 색만으로 의미를 전달하지 않습니다(WCAG 1.4.1 / 1.1.1). 두 표식 모두 텍스트 대체를 갖습니다.
- aria-label을 주면 Avatar는 role="img"가 되고 하위 노드가 노출되지 않으므로, 대체 텍스트가 그 이름 뒤에 합쳐집니다 → "김한, 다른 용무 중, 읽지 않음 3건". 이름이 없으면 visually-hidden 텍스트로 문서 순서에 렌더됩니다. aria-labelledby만 준 경우에는 생성된 hidden 노드 id가 aria-labelledby에 자동으로 이어붙습니다.
- - status 점과 pushBadge는 색만으로 의미를 전달하지 않습니다(WCAG 1.4.1 / 1.1.1). 두 표식 모두 텍스트 대체를 갖습니다. - statusLabel — 기본값 online → "온라인", busy → "다른 용무 중", offline → "오프라인". - pushBadgeLabel — 기본값 pushBadge={true} → "새 알림 있음", 숫자/숫자 문자열 → "읽지 않음 N건". - 옆에 같은 의미의 텍스트가 이미 있으면 statusLabel={false} / pushBadgeLabel={false}로 중복 발화를 끄세요. - a….
- Avatar가 소유하지 않는 라우팅, 권한, 데이터 요청, 제품 임계값을 컴포넌트 내부에 넣지 않습니다.

## Anatomy

| Part | Contract |
| --- | --- |
| Root | Avatar의 semantic role, layout containment와 전달받은 DOM 속성을 소유합니다. |
| Status Label | Text alternative for the colour-only status dot (WCAG 1.4.1 / 1.1.1). Defaults to 온라인 / 다른 용무 중 / 오프라인. Pass false when a neighbouring text already conveys the status. |
| Interaction | Static interaction state for examples and visual parity checks. @default false |
| Push Badge Label | Text alternative for the pushBadge. Defaults to 새 알림 있음 for true and 읽지 않음 N건 for a count. Pass false to keep the badge decorative. |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `src` | `string` | No | Image URL. Falls back when omitted. |
| `alt` | `string` | No | 공개 타입 계약에 정의된 속성입니다. |
| `name` | `string` | No | Name used for initials and accessible image fallback text. |
| `variant` | `"person" \| "company" \| "academy" \| "education"` | No | avatar variant. person renders a circle; company/academy render rounded squares with size-graded radius. education is kept as a backwards-compatible alias for academy. @default 'person' |
| `size` | `number \| "xsmall" \| "small" \| "default" \| "medium" \| "large" \| "xlarge"` | No | Avatar diameter in px or size key. size keys map to xsmall 24, small 32, medium/default 40, large 48, xlarge 56. @default 40 |
| `status` | `"online" \| "busy" \| "offline"` | No | Optional status dot. Hidden when deactivated is true. |
| `statusLabel` | `string \| false \| null` | No | Text alternative for the colour-only status dot (WCAG 1.4.1 / 1.1.1). Defaults to 온라인 / 다른 용무 중 / 오프라인. Pass false when a neighbouring text already conveys the status. |
| `ring` | `boolean` | No | White halo for stacked avatars or image surfaces. @default false |
| `placeholder` | `boolean \| "initials" \| "person" \| "company" \| "academy" \| "education"` | No | Fallback rendering aligned to avatar resource placeholders. @default 'initials' |
| `deactivated` | `boolean` | No | Shows the deactivated slash treatment and suppresses the status dot. @default false |
| `interaction` | `false \| true \| "normal" \| "hovered" \| "focused" \| "pressed"` | No | Static interaction state for examples and visual parity checks. @default false |
| `pushBadge` | `boolean \| string \| number` | No | pushBadge state. true renders a dot; string/number renders compact text. @default false |
| `pushBadgeLabel` | `string \| false \| null` | No | Text alternative for the pushBadge. Defaults to 새 알림 있음 for true and 읽지 않음 N건 for a count. Pass false to keep the badge decorative. |
| `borderColor` | `string` | No | Optional customization hook matching the borderColor example. |
| `borderWeight` | `number \| string` | No | Optional customization hook matching the borderWeight example. |

## States

| State | Contract |
| --- | --- |
| variant | avatar variant. person renders a circle; company/academy render rounded squares with size-graded radius. education is kept as a backwards-compatible alias for academy. @default 'person' 타입 계약: "person" \| "company" \| "academy" \| "education" |
| status | Optional status dot. Hidden when deactivated is true. 타입 계약: "online" \| "busy" \| "offline" |
| statusLabel | Text alternative for the colour-only status dot (WCAG 1.4.1 / 1.1.1). Defaults to 온라인 / 다른 용무 중 / 오프라인. Pass false when a neighbouring text already conveys the status. 타입 계약: string \| false \| null |
| interaction | Static interaction state for examples and visual parity checks. @default false 타입 계약: false \| true \| "normal" \| "hovered" \| "focused" \| "pressed" |

## Behavior and interaction

- pushBadgeLabel — 기본값 pushBadge={true} → "새 알림 있음", 숫자/숫자 문자열 → "읽지 않음 N건".
- Avatar — 상태 점(옵션)이 있는 둥근 사진; 이니셜은 쿨 그레이 틴트로 폴백.
- - status 점과 pushBadge는 색만으로 의미를 전달하지 않습니다(WCAG 1.4.1 / 1.1.1). 두 표식 모두 텍스트 대체를 갖습니다. - statusLabel — 기본값 online → "온라인", busy → "다른 용무 중", offline → "오프라인". - pushBadgeLabel — 기본값 pushBadge={true} → "새 알림 있음", 숫자/숫자 문자열 → "읽지 않음 N건". - 옆에 같은 의미의 텍스트가 이미 있으면 statusLabel={false} / pushBadgeLabel={false}로 중복 발화를 끄세요. - a….
- Avatar의 controlled/uncontrolled 경계와 callback 순서는 공개 타입 계약을 따릅니다.
- 상태 변화 중에도 accessible name, focus 위치와 레이아웃 기준점을 예고 없이 잃지 않습니다.

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 명시 규칙 1 | status 점과 pushBadge는 색만으로 의미를 전달하지 않습니다(WCAG 1.4.1 / 1.1.1). 두 표식 모두 텍스트 대체를 갖습니다. |
| 명시 규칙 2 | aria-label을 주면 Avatar는 role="img"가 되고 하위 노드가 노출되지 않으므로, 대체 텍스트가 그 이름 뒤에 합쳐집니다 → "김한, 다른 용무 중, 읽지 않음 3건". 이름이 없으면 visually-hidden 텍스트로 문서 순서에 렌더됩니다. aria-labelledby만 준 경우에는 생성된 hidden 노드 id가 aria-labelledby에 자동으로 이어붙습니다. |
| 명시 규칙 3 | - status 점과 pushBadge는 색만으로 의미를 전달하지 않습니다(WCAG 1.4.1 / 1.1.1). 두 표식 모두 텍스트 대체를 갖습니다. - statusLabel — 기본값 online → "온라인", busy → "다른 용무 중", offline → "오프라인". - pushBadgeLabel — 기본값 pushBadge={true} → "새 알림 있음", 숫자/숫자 문자열 → "읽지 않음 N건". - 옆에 같은 의미의 텍스트가 이미 있으면 statusLabel={false} / pushBadgeLabel={false}로 중복 발화를 끄세요. - a… |
| --color-semantic-background-elevated-normal | light: #FFFFFF; dark: #212225 |
| --color-semantic-brand-ink | light: #0E1329; dark: #E7EAF2 |

## Responsive

- 320px 좁은 폭과 200% 텍스트 확대에서 페이지 가로 overflow 없이 의미 순서를 유지합니다.
- 고정 폭보다 부모 containment와 wrapping을 우선하고, 제품이 필요할 때 명시적으로 compact 표현을 선택합니다.

## Content and writing

- status 점과 pushBadge는 색만으로 의미를 전달하지 않습니다(WCAG 1.4.1 / 1.1.1). 두 표식 모두 텍스트 대체를 갖습니다.
- statusLabel — 기본값 online → "온라인", busy → "다른 용무 중", offline → "오프라인".
- pushBadgeLabel — 기본값 pushBadge={true} → "새 알림 있음", 숫자/숫자 문자열 → "읽지 않음 N건".
- 옆에 같은 의미의 텍스트가 이미 있으면 statusLabel={false} / pushBadgeLabel={false}로 중복 발화를 끄세요.

## Accessibility

- status 점과 pushBadge는 색만으로 의미를 전달하지 않습니다(WCAG 1.4.1 / 1.1.1). 두 표식 모두 텍스트 대체를 갖습니다.
- aria-label을 주면 Avatar는 role="img"가 되고 하위 노드가 노출되지 않으므로, 대체 텍스트가 그 이름 뒤에 합쳐집니다 → "김한, 다른 용무 중, 읽지 않음 3건". 이름이 없으면 visually-hidden 텍스트로 문서 순서에 렌더됩니다. aria-labelledby만 준 경우에는 생성된 hidden 노드 id가 aria-labelledby에 자동으로 이어붙습니다.
- - status 점과 pushBadge는 색만으로 의미를 전달하지 않습니다(WCAG 1.4.1 / 1.1.1). 두 표식 모두 텍스트 대체를 갖습니다. - statusLabel — 기본값 online → "온라인", busy → "다른 용무 중", offline → "오프라인". - pushBadgeLabel — 기본값 pushBadge={true} → "새 알림 있음", 숫자/숫자 문자열 → "읽지 않음 N건". - 옆에 같은 의미의 텍스트가 이미 있으면 statusLabel={false} / pushBadgeLabel={false}로 중복 발화를 끄세요. - a….
- native semantic을 우선하며 사용자에게 보이는 이름과 접근 가능한 이름이 같은 목적을 설명하게 합니다.
- 키보드 focus 순서, focus-visible 표시와 상태 ARIA가 시각 상태와 동시에 갱신되는지 공개 스토리에서 검증합니다.

## Do / Don't

| Kind | Guidance |
| --- | --- |
| Do | Avatar가 소유하는 Content 의미와 상태를 여러 제품 화면에서 동일하게 재사용할 때 사용합니다. |
| Don't | status 점과 pushBadge는 색만으로 의미를 전달하지 않습니다(WCAG 1.4.1 / 1.1.1). 두 표식 모두 텍스트 대체를 갖습니다. |
| Do | 제품별 구현 대신 공개 Avatar API와 semantic token으로 일관성을 유지해야 할 때 사용합니다. |
| Don't | aria-label을 주면 Avatar는 role="img"가 되고 하위 노드가 노출되지 않으므로, 대체 텍스트가 그 이름 뒤에 합쳐집니다 → "김한, 다른 용무 중, 읽지 않음 3건". 이름이 없으면 visually-hidden 텍스트로 문서 순서에 렌더됩니다. aria-labelledby만 준 경우에는 생성된 hidden 노드 id가 aria-labelledby에 자동으로 이어붙습니다. |

## Exceptions

- 제품 정책을 포함해야 하는 예외는 wrapper 또는 제품 저장소에서 조합하고 Avatar의 범용 API에 넣지 않습니다.
- 접근성 또는 안전 계약을 약화하는 예외는 허용하지 않으며 필요한 차이는 prompt와 Storybook 증거에 기록합니다.

## Related components

| Component | Relationship |
| --- | --- |
| `AvatarGroup` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `Badge` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `Chip` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `Notification` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `PushBadge` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `Tag` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |

## Examples

### 기본 조합

```jsx
<Avatar src={url} name="Han Kim" size={48} status="online" />
<Avatar name="LK" size={40} />
<Avatar name="LK" size={40} status="busy" pushBadge={3} aria-label="김한" />
<Avatar name="LK" size={40} status="online" statusLabel={false} />
```

## Tokens and API

### Tokens

- `--color-semantic-background-elevated-normal`
- `--color-semantic-brand-ink`
- `--color-semantic-interaction-inactive`
- `--color-semantic-label-assistive`
- `--color-semantic-line-normal-normal`
- `--color-semantic-line-solid-normal`
- `--color-semantic-primary-normal`
- `--color-semantic-secondary-surface`
- `--color-semantic-static-white`
- `--color-semantic-status-negative`
- `--dur-fast`
- `--ease-out`
- `--font-sans`
- `--fw-bold`
- `--radius-10`
- `--radius-12`
- `--radius-14`
- `--radius-8`
- `--radius-pill`
- `--radius-sm`

### Source contracts

- `components/feedback/Avatar.jsx`
- `components/feedback/Avatar.d.ts`
- `components/feedback/Avatar.prompt.md`
- `stories/Feedback.stories.jsx`

## Migration

- 현재 prompt와 타입 계약에 기록되지 않은 legacy alias는 새 코드에서 도입하지 않습니다.
- 대체 컴포넌트가 생기면 기존 API의 제거 버전, 대응 prop과 자동·수동 전환 절차를 이 페이지에 기록합니다.

## Sources

- Avatar prompt contract: `components/feedback/Avatar.prompt.md`
- Storybook implementation evidence: `stories/Feedback.stories.jsx`
- [WCAG 1.4.1](https://www.w3.org/TR/WCAG22/#use-of-color)
- [1.1.1](https://www.w3.org/TR/WCAG22/#non-text-content)
- [SEED Avatar benchmark](https://seed-design.io/components/avatar)
