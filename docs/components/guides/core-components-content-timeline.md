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

- 검토 이력, 배포 기록, 장비 이벤트처럼 발생 시각과 순서가 중요한 읽기 전용 기록에 적합합니다. 사용자가 완료해야 할 절차는 Step List나 Stepper를, 단순 알림 목록은 List를 사용하고 상태 색만으로 사건의 의미를 구분하지 마세요.
- Timeline가 소유하는 Content 의미와 상태를 여러 제품 화면에서 동일하게 재사용할 때 사용합니다.
- 제품별 구현 대신 공개 Timeline API와 semantic token으로 일관성을 유지해야 할 때 사용합니다.

### 사용하지 않음

- 시각 표기는 로 감쌉니다. dateTime 을 주면 그 값이, 없으면 문자열 time 이 기계 판독 값이 됩니다 — "09:12", "2026-07-03" 처럼 유효한 형식을 쓰고, "2026.07.03" 같은 표기를 쓸 때는 dateTime 을 따로 주세요.
- - 시간순 기록은 ol li 로 렌더링합니다. div 나열은 순서·개수·현재 위치를 보조 기술에 전혀 전달하지 못합니다(WCAG 1.3.1). - 시각 표기는 로 감쌉니다. dateTime 을 주면 그 값이, 없으면 문자열 time 이 기계 판독 값이 됩니다 — "09:12", "2026-07-03" 처럼 유효한 형식을 쓰고, "2026.07.03" 같은 표기를 쓸 때는 dateTime 을 따로 주세요. - 점·레일은 장식이므로 aria-hidden 입니다. tone 색만으로 사건의 의미를 구분하지 말고 title·description 텍스트에도 담으세요.
- Timeline가 소유하지 않는 라우팅, 권한, 데이터 요청, 제품 임계값을 컴포넌트 내부에 넣지 않습니다.
- 동일한 목적을 더 단순한 native 요소나 기존 LDS primitive로 해결할 수 있으면 새 조합을 만들지 않습니다.

## Anatomy

| Part | Contract |
| --- | --- |
| Root | Timeline의 semantic role, layout containment와 전달받은 DOM 속성을 소유합니다. |
| Label | 내부 ol 의 접근 가능한 이름(한 화면에 기록이 여럿일 때 구분용). |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `items` | `TimelineItem[]` | Yes | 공개 타입 계약에 정의된 속성입니다. |
| `label` | `string` | No | 내부 ol 의 접근 가능한 이름(한 화면에 기록이 여럿일 때 구분용). |

## States

| State | Contract |
| --- | --- |
| Default | 별도 상태 머신을 만들지 않으며 전달된 콘텐츠와 semantic token으로 기본 표현을 구성합니다. |

## Behavior and interaction

- 시간순 기록은 ol li 로 렌더링합니다. div 나열은 순서·개수·현재 위치를 보조 기술에 전혀 전달하지 못합니다(WCAG 1.3.1).
- 시각 표기는 로 감쌉니다. dateTime 을 주면 그 값이, 없으면 문자열 time 이 기계 판독 값이 됩니다 — "09:12", "2026-07-03" 처럼 유효한 형식을 쓰고, "2026.07.03" 같은 표기를 쓸 때는 dateTime 을 따로 주세요.
- - 시간순 기록은 ol li 로 렌더링합니다. div 나열은 순서·개수·현재 위치를 보조 기술에 전혀 전달하지 못합니다(WCAG 1.3.1). - 시각 표기는 로 감쌉니다. dateTime 을 주면 그 값이, 없으면 문자열 time 이 기계 판독 값이 됩니다 — "09:12", "2026-07-03" 처럼 유효한 형식을 쓰고, "2026.07.03" 같은 표기를 쓸 때는 dateTime 을 따로 주세요. - 점·레일은 장식이므로 aria-hidden 입니다. tone 색만으로 사건의 의미를 구분하지 말고 title·description 텍스트에도 담으세요.
- Timeline의 controlled/uncontrolled 경계와 callback 순서는 공개 타입 계약을 따릅니다.
- 상태 변화 중에도 accessible name, focus 위치와 레이아웃 기준점을 예고 없이 잃지 않습니다.

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 명시 규칙 1 | 타입 스케일 정합: 제목 15.5px → --body2-size(15px, −0.5px), 설명 13.5px → --label2-size(13px, −0.5px)로 스냅했습니다. time(caption1)과 함께 전 사이트가 토큰 스케일 위에 있으며, 설명 lineHeight 1.6은 유지했습니다. |
| 명시 규칙 2 | 시간순 기록은 ol li 로 렌더링합니다. div 나열은 순서·개수·현재 위치를 보조 기술에 전혀 전달하지 못합니다(WCAG 1.3.1). |
| 명시 규칙 3 | 시각 표기는 로 감쌉니다. dateTime 을 주면 그 값이, 없으면 문자열 time 이 기계 판독 값이 됩니다 — "09:12", "2026-07-03" 처럼 유효한 형식을 쓰고, "2026.07.03" 같은 표기를 쓸 때는 dateTime 을 따로 주세요. |
| 명시 규칙 4 | - items — { id, time, dateTime, title, description, tone }. tone은 노드 색을 지정(signal · positive · cautionary · negative · neutral). label — ol 의 접근 가능한 이름. - 타입 스케일 정합: 제목 15.5px → --body2-size(15px, −0.5px), 설명 13.5px → --label2-size(13px, −0.5px)로 스냅했습니다. time(caption1)과 함께 전 사이트가 토큰 스케일 위에 있으며, 설명 lineHeight 1.6은 유지했습… |
| --body2-size | 15px |

## Responsive

- 타입 스케일 정합: 제목 15.5px → --body2-size(15px, −0.5px), 설명 13.5px → --label2-size(13px, −0.5px)로 스냅했습니다. time(caption1)과 함께 전 사이트가 토큰 스케일 위에 있으며, 설명 lineHeight 1.6은 유지했습니다.
- - items — { id, time, dateTime, title, description, tone }. tone은 노드 색을 지정(signal · positive · cautionary · negative · neutral). label — ol 의 접근 가능한 이름. - 타입 스케일 정합: 제목 15.5px → --body2-size(15px, −0.5px), 설명 13.5px → --label2-size(13px, −0.5px)로 스냅했습니다. time(caption1)과 함께 전 사이트가 토큰 스케일 위에 있으며, 설명 lineHeight 1.6은 유지했습….
- 320px 좁은 폭과 200% 텍스트 확대에서 페이지 가로 overflow 없이 의미 순서를 유지합니다.
- 고정 폭보다 부모 containment와 wrapping을 우선하고, 제품이 필요할 때 명시적으로 compact 표현을 선택합니다.

## Content and writing

- items — { id, time, dateTime, title, description, tone }. tone은 노드 색을 지정(signal · positive · cautionary · negative · neutral). label — ol 의 접근 가능한 이름.
- 타입 스케일 정합: 제목 15.5px → --body2-size(15px, −0.5px), 설명 13.5px → --label2-size(13px, −0.5px)로 스냅했습니다. time(caption1)과 함께 전 사이트가 토큰 스케일 위에 있으며, 설명 lineHeight 1.6은 유지했습니다.
- 점·레일은 장식이므로 aria-hidden 입니다. tone 색만으로 사건의 의미를 구분하지 말고 title·description 텍스트에도 담으세요.
- - items — { id, time, dateTime, title, description, tone }. tone은 노드 색을 지정(signal · positive · cautionary · negative · neutral). label — ol 의 접근 가능한 이름. - 타입 스케일 정합: 제목 15.5px → --body2-size(15px, −0.5px), 설명 13.5px → --label2-size(13px, −0.5px)로 스냅했습니다. time(caption1)과 함께 전 사이트가 토큰 스케일 위에 있으며, 설명 lineHeight 1.6은 유지했습….

## Accessibility

- 시간순 기록은 ol li 로 렌더링합니다. div 나열은 순서·개수·현재 위치를 보조 기술에 전혀 전달하지 못합니다(WCAG 1.3.1).
- 점·레일은 장식이므로 aria-hidden 입니다. tone 색만으로 사건의 의미를 구분하지 말고 title·description 텍스트에도 담으세요.
- - 시간순 기록은 ol li 로 렌더링합니다. div 나열은 순서·개수·현재 위치를 보조 기술에 전혀 전달하지 못합니다(WCAG 1.3.1). - 시각 표기는 로 감쌉니다. dateTime 을 주면 그 값이, 없으면 문자열 time 이 기계 판독 값이 됩니다 — "09:12", "2026-07-03" 처럼 유효한 형식을 쓰고, "2026.07.03" 같은 표기를 쓸 때는 dateTime 을 따로 주세요. - 점·레일은 장식이므로 aria-hidden 입니다. tone 색만으로 사건의 의미를 구분하지 말고 title·description 텍스트에도 담으세요.
- native semantic을 우선하며 사용자에게 보이는 이름과 접근 가능한 이름이 같은 목적을 설명하게 합니다.
- 키보드 focus 순서, focus-visible 표시와 상태 ARIA가 시각 상태와 동시에 갱신되는지 공개 스토리에서 검증합니다.

## Do / Don't

| Kind | Guidance |
| --- | --- |
| Do | Timeline가 소유하는 Content 의미와 상태를 여러 제품 화면에서 동일하게 재사용할 때 사용합니다. |
| Don't | 시각 표기는 로 감쌉니다. dateTime 을 주면 그 값이, 없으면 문자열 time 이 기계 판독 값이 됩니다 — "09:12", "2026-07-03" 처럼 유효한 형식을 쓰고, "2026.07.03" 같은 표기를 쓸 때는 dateTime 을 따로 주세요. |
| Do | 제품별 구현 대신 공개 Timeline API와 semantic token으로 일관성을 유지해야 할 때 사용합니다. |
| Don't | - 시간순 기록은 ol li 로 렌더링합니다. div 나열은 순서·개수·현재 위치를 보조 기술에 전혀 전달하지 못합니다(WCAG 1.3.1). - 시각 표기는 로 감쌉니다. dateTime 을 주면 그 값이, 없으면 문자열 time 이 기계 판독 값이 됩니다 — "09:12", "2026-07-03" 처럼 유효한 형식을 쓰고, "2026.07.03" 같은 표기를 쓸 때는 dateTime 을 따로 주세요. - 점·레일은 장식이므로 aria-hidden 입니다. tone 색만으로 사건의 의미를 구분하지 말고 title·description 텍스트에도 담으세요. |

## Exceptions

- 제품 정책을 포함해야 하는 예외는 wrapper 또는 제품 저장소에서 조합하고 Timeline의 범용 API에 넣지 않습니다.
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

### Source contracts

- `components/content/Timeline.jsx`
- `components/content/Timeline.d.ts`
- `components/content/Timeline.prompt.md`
- `stories/ContentTimeline.stories.jsx`

## Migration

- 현재 prompt와 타입 계약에 기록되지 않은 legacy alias는 새 코드에서 도입하지 않습니다.
- 대체 컴포넌트가 생기면 기존 API의 제거 버전, 대응 prop과 자동·수동 전환 절차를 이 페이지에 기록합니다.

## Sources

- Timeline prompt contract: `components/content/Timeline.prompt.md`
- Storybook implementation evidence: `stories/ContentTimeline.stories.jsx`
