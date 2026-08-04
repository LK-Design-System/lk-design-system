# Bubble

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Product / Content |
| Owner | `Bubble` |
| Storybook | `LDS Product/Content/Bubble` |
| Source | `../component-content.json#product-content-bubble` |

코치 마크·지속형 설명·대화처럼 짧은 내용을 특정 방향의 대상에 연결할 때 적합합니다. hover에서만 보이는 한 줄 힌트나 즉시 대응할 시스템 오류에는 Bubble 대신 Tooltip 또는 Alert를 사용하세요.

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `tone` | `'navy' \| 'light'` | No | 서피스 채움. 대상 배경 위에서 읽히는 쪽을 고르는 시각 선택일 뿐, 화자·발신자 같은 의미를 담지 않습니다. @default "navy" |
| `tail` | `'top' \| 'bottom' \| 'left' \| 'right'` | No | 꼬리 방향 — 설명 대상을 가리킵니다. @default "bottom" |
| `children` | `React.ReactNode` | No |  |

## States

| State | Contract |
| --- | --- |
| tone | 서피스 채움. 대상 배경 위에서 읽히는 쪽을 고르는 시각 선택일 뿐, 화자·발신자 같은 의미를 담지 않습니다. @default "navy" |

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 명시 규칙 1 | 대화에는 쓰지 마세요. tone은 대상 배경 위에서 읽히는 서피스를 고르는 시각 선택일 뿐 화자 정보를 담지 않습니다. 두 화자를 navy/light로 나누면 발신자를 색으로만 구분하게 되어 WCAG 1.4.1에 걸립니다. 채팅·대화 기록은 작성자 이름과 역할을 텍스트로 유지하는 ConversationMessage(그리고 목록 컨테이너 MessageFeed)를 쓰세요. |
| 명시 규칙 2 | 폭은 최대 280px로 묶어 한 줄이 읽기 좋은 길이를 넘지 않게 합니다. 더 긴 본문이 필요하면 콜아웃이 아니라 Popover나 본문 영역으로 승격하세요. |
| --color-semantic-background-elevated-normal | light: #FFFFFF; dark: #212225 |
| --color-semantic-brand-surface | light: #05132B; dark: #05132B |
| --color-semantic-label-normal | light: #171718; dark: #F7F7F7 |

## Content and writing

- 사라지는 호버 힌트에는 Tooltip, 즉시 대응이 필요한 시스템 오류에는 Alert를 쓰세요. Bubble은 화면에 남아 있는 설명입니다.
- Bubble — 꼬리가 대상을 가리키는 지속형 콜아웃(코치 마크, 지도·화면 주석, 짧은 설명).

## Related components

| Component | Relationship |
| --- | --- |
| `Bookmark` | 대표 시나리오에서 조합 |

## Examples

### 기본 조합

```jsx
<Bubble tone="navy" tail="bottom">선택 항목의 설명을 표시합니다.</Bubble>
<Bubble tone="light" tail="left">여기를 눌러 대시보드로 이동</Bubble>
```

## Tokens and API

### Tokens

- `--color-semantic-background-elevated-normal`
- `--color-semantic-brand-surface`
- `--color-semantic-label-normal`
- `--color-semantic-line-solid-normal`
- `--color-semantic-static-white`
- `--font-sans`
- `--label1-size`
- `--radius-xl`
- `--shadow-md`

### Source contracts

- `components/content/Bubble.jsx`
- `components/content/Bubble.d.ts`
- `components/content/Bubble.prompt.md`
- `stories/ContentBubble.stories.jsx`

## Sources

- Bubble prompt contract: `components/content/Bubble.prompt.md`
- Storybook implementation evidence: `stories/ContentBubble.stories.jsx`
