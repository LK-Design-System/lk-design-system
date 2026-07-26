# Notification

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Core / Status |
| Owner | `Notification` |
| Storybook | `LDS Core/Components/Status/Notification` |
| Source | `../component-content.json#core-components-status-notification` |

사용자가 나중에 다시 확인할 수 있도록 제목, 설명, 발생 시각, 읽음 상태를 보존해야 하는 알림 센터나 활동 목록에 적합합니다. 잠시 보여주고 사라지는 결과에는 Toast를, 페이지 전체에 즉시 알려야 하는 현재 상태에는 Banner를 사용하세요.

## 사용 판단

### 사용하지 않음

- unread — 낮은 primary surface와 primary 점 하나로만 표현합니다. 오류색을 사용하지 않습니다.

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `icon` | `React.ReactNode` | No |  |
| `title` | `React.ReactNode` | No |  |
| `description` | `React.ReactNode` | No |  |
| `time` | `React.ReactNode` | No |  |
| `dateTime` | `string` | No | 으로 전달되는 기계 판독용 절대 시각(ISO 8601). |
| `tone` | `'positive' \| 'cautionary' \| 'negative' \| 'signal' \| 'offline'` | No | 리딩 아이콘 chip에 적용할 status tone. 생략하면 중립 chip입니다. |
| `unread` | `boolean` | No | 안읽음 primary 워시 + primary 점. @default false |
| `onClick` | `React.MouseEventHandler` | No | 제공하면 행을 키보드 접근 가능한 native button으로 렌더링합니다. |

## States

| State | Contract |
| --- | --- |
| tone | 리딩 아이콘 chip에 적용할 status tone. 생략하면 중립 chip입니다. |

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 명시 규칙 1 | icon / title / description / time — 콘텐츠. 시간은 제목 행 오른쪽에 배치하고, 상대 시각("2분 전")을 쓸 때는 dateTime으로 ISO 절대 시각을 함께 전달합니다. |
| 명시 규칙 2 | 리딩 아이콘은 36px 둥근 사각(radius-md) 타일입니다 — ListCell 등에서 쓰는 서명된 LK icon-tile 브랜드 패턴과 같은 문법이며, 원형 등 새 chip 모양을 만들지 않습니다. |
| 명시 규칙 3 | 알림 센터에서는 외부 ul만 테두리를 소유하고, 첫·마지막 li에 해당 모서리 radius를 적용해 행의 highlight/focus surface가 잘리지 않게 합니다. 행 사이는 1px divider로 구분한 뒤 ScrollArea 안에 쌓으세요. |
| --caption1-line | {"fontSize":"12px","lineHeight":"16px","letterSpacing":"0.0252em"} |
| --caption1-size | {"fontSize":"12px","lineHeight":"16px","letterSpacing":"0.0252em"} |

## Content and writing

- tone — positive · cautionary · negative · signal · offline. 리딩 아이콘 chip을 공통 statusToneStyle 문법(tone surface 배경 + tone text 전경)으로 칠합니다. 이벤트의 의미가 severity를 가질 때만 사용하고, 생략하면 중립 chip입니다.
- Notification — 알림 행(아이콘 · 제목 · 설명 · 시간 · 안읽음).

## Accessibility

- onClick — 키보드 접근 가능한 native button 행으로 전환합니다.

## Related components

| Component | Relationship |
| --- | --- |
| `Icon` | 대표 시나리오에서 조합 |
| `Avatar` | 대표 시나리오에서 조합 |
| `AvatarGroup` | 대표 시나리오에서 조합 |
| `Badge` | 대표 시나리오에서 조합 |
| `Chip` | 대표 시나리오에서 조합 |
| `PushBadge` | 대표 시나리오에서 조합 |
| `Tag` | 대표 시나리오에서 조합 |

## Examples

### 기본 조합

```jsx
<Notification icon={<Icon name="bell" />} title="펌웨어 업데이트 완료" description="LKR-SSAI v2.4" time="10분 전" unread />
```

## Tokens and API

### Tokens

- `--caption1-line`
- `--caption1-size`
- `--caption1-spacing`
- `--color-semantic-fill-alternative`
- `--color-semantic-fill-normal`
- `--color-semantic-focus-indicator`
- `--color-semantic-label-neutral`
- `--color-semantic-label-normal`
- `--color-semantic-primary-normal`
- `--color-semantic-primary-surface-strong`
- `--component-notification-unread-surface`
- `--font-sans`
- `--fw-bold`
- `--label1-line`
- `--label1-size`
- `--label1-spacing`
- `--label2-line`
- `--label2-size`
- `--label2-spacing`
- `--radius-md`
- `--space-1`
- `--space-2`
- `--space-3`
- `--space-4`

### Source contracts

- `components/feedback/Notification.jsx`
- `components/feedback/Notification.d.ts`
- `components/feedback/Notification.prompt.md`
- `stories/FeedbackNotifications.stories.jsx`

## Sources

- Notification prompt contract: `components/feedback/Notification.prompt.md`
- Storybook implementation evidence: `stories/FeedbackNotifications.stories.jsx`
