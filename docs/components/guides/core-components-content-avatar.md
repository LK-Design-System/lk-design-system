# Avatar

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Core / Content |
| Owner | `Avatar` |
| Storybook | `LDS Core/Components/Content/Avatar` |
| Source | `../component-content.json#core-components-content-avatar` |

작성자, 담당자, 참여자처럼 동일한 종류의 주체를 빠르게 식별해야 하는 목록과 협업 화면에 적합합니다. 대상의 이름이 핵심이면 텍스트 레이블을 함께 제공하고, 상태나 범주를 나타낼 때는 Avatar 대신 Status Badge나 Content Badge를 사용하세요.

## Anatomy

| Part | Contract |
| --- | --- |
| statusLabel | Text alternative for the colour-only status dot (WCAG 1.4.1 / 1.1.1). Defaults to 온라인 / 다른 용무 중 / 오프라인. Pass false when a neighbouring text already conveys the status. |
| interaction | Static interaction state for examples and visual parity checks. @default false |
| pushBadgeLabel | Text alternative for the pushBadge. Defaults to 새 알림 있음 for true and 읽지 않음 N건 for a count. Pass false to keep the badge decorative. |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `src` | `string` | No | Image URL. Falls back when omitted. |
| `alt` | `string` | No |  |
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
| variant | avatar variant. person renders a circle; company/academy render rounded squares with size-graded radius. education is kept as a backwards-compatible alias for academy. @default 'person' |
| status | Optional status dot. Hidden when deactivated is true. |
| statusLabel | Text alternative for the colour-only status dot (WCAG 1.4.1 / 1.1.1). Defaults to 온라인 / 다른 용무 중 / 오프라인. Pass false when a neighbouring text already conveys the status. |
| interaction | Static interaction state for examples and visual parity checks. @default false |

## Behavior and interaction

- Avatar — 상태 점(옵션)이 있는 둥근 사진; 이니셜은 쿨 그레이 틴트로 폴백.

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 명시 규칙 1 | status 점과 pushBadge는 색만으로 의미를 전달하지 않습니다(WCAG 1.4.1 / 1.1.1). 두 표식 모두 텍스트 대체를 갖습니다. |
| 명시 규칙 2 | aria-label을 주면 Avatar는 role="img"가 되고 하위 노드가 노출되지 않으므로, 대체 텍스트가 그 이름 뒤에 합쳐집니다 → "김한, 다른 용무 중, 읽지 않음 3건". 이름이 없으면 visually-hidden 텍스트로 문서 순서에 렌더됩니다. aria-labelledby만 준 경우에는 생성된 hidden 노드 id가 aria-labelledby에 자동으로 이어붙습니다. |
| --color-semantic-background-elevated-normal | light: #FFFFFF; dark: #212225 |
| --color-semantic-brand-ink | light: #1B2240; dark: #E7EAF2 |
| --color-semantic-interaction-inactive | light: #989BA2; dark: #5A5C63 |

## Content and writing

- statusLabel — 기본값 online → "온라인", busy → "다른 용무 중", offline → "오프라인".
- pushBadgeLabel — 기본값 pushBadge={true} → "새 알림 있음", 숫자/숫자 문자열 → "읽지 않음 N건".
- 옆에 같은 의미의 텍스트가 이미 있으면 statusLabel={false} / pushBadgeLabel={false}로 중복 발화를 끄세요.

## Related components

| Component | Relationship |
| --- | --- |
| `AvatarGroup` | 대표 시나리오에서 조합 |
| `Badge` | 대표 시나리오에서 조합 |
| `Chip` | 대표 시나리오에서 조합 |
| `Notification` | 대표 시나리오에서 조합 |
| `PushBadge` | 대표 시나리오에서 조합 |
| `Tag` | 대표 시나리오에서 조합 |

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

## Sources

- Avatar prompt contract: `components/feedback/Avatar.prompt.md`
- Storybook implementation evidence: `stories/Feedback.stories.jsx`
- [WCAG 1.4.1](https://www.w3.org/TR/WCAG22/#use-of-color)
- [1.1.1](https://www.w3.org/TR/WCAG22/#non-text-content)
