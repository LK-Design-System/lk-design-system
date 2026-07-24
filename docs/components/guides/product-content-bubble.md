# Bubble

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Product / Content |
| Owner | `Bubble` |
| Storybook | `LDS Product/Content/Bubble` |
| Source | `../component-content.json#product-content-bubble` |

코치 마크·지속형 설명·대화처럼 짧은 내용을 특정 방향의 대상에 연결할 때 적합합니다. hover에서만 보이는 한 줄 힌트나 즉시 대응할 시스템 오류에는 Bubble 대신 Tooltip 또는 Alert를 사용하세요.

## 사용 판단

### 사용

- 코치 마크·지속형 설명·대화처럼 짧은 내용을 특정 방향의 대상에 연결할 때 적합합니다. hover에서만 보이는 한 줄 힌트나 즉시 대응할 시스템 오류에는 Bubble 대신 Tooltip 또는 Alert를 사용하세요.
- Bubble가 소유하는 Content 의미와 상태를 여러 제품 화면에서 동일하게 재사용할 때 사용합니다.
- 제품별 구현 대신 공개 Bubble API와 semantic token으로 일관성을 유지해야 할 때 사용합니다.

### 사용하지 않음

- Bubble가 소유하지 않는 라우팅, 권한, 데이터 요청, 제품 임계값을 컴포넌트 내부에 넣지 않습니다.
- 동일한 목적을 더 단순한 native 요소나 기존 LDS primitive로 해결할 수 있으면 새 조합을 만들지 않습니다.
- 표현이 비슷하다는 이유만으로 상태 의미가 다른 sibling 컴포넌트를 서로 대체하지 않습니다.

## Anatomy

| Part | Contract |
| --- | --- |
| Root | Bubble의 semantic role, layout containment와 전달받은 DOM 속성을 소유합니다. |
| Children | children 속성으로 제공되는 공개 슬롯 또는 표시 영역입니다. |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `tone` | `'navy' \| 'light'` | No | 서피스 채움. 대상 배경 위에서 읽히는 쪽을 고르는 시각 선택일 뿐, 화자·발신자 같은 의미를 담지 않습니다. @default "navy" |
| `tail` | `'top' \| 'bottom' \| 'left' \| 'right'` | No | 꼬리 방향 — 설명 대상을 가리킵니다. @default "bottom" |
| `children` | `React.ReactNode` | No | 공개 타입 계약에 정의된 속성입니다. |

## States

| State | Contract |
| --- | --- |
| tone | 서피스 채움. 대상 배경 위에서 읽히는 쪽을 고르는 시각 선택일 뿐, 화자·발신자 같은 의미를 담지 않습니다. @default "navy" 타입 계약: 'navy' \| 'light' |

## Behavior and interaction

- 대화에는 쓰지 마세요. tone은 대상 배경 위에서 읽히는 서피스를 고르는 시각 선택일 뿐 화자 정보를 담지 않습니다. 두 화자를 navy/light로 나누면 발신자를 색으로만 구분하게 되어 WCAG 1.4.1에 걸립니다. 채팅·대화 기록은 작성자 이름과 역할을 텍스트로 유지하는 ConversationMessage(그리고 목록 컨테이너 MessageFeed)를 쓰세요.
- - tone — navy(솔리드) · light(화이트 + 헤어라인). tail — top | bottom | left | right. - 대화에는 쓰지 마세요. tone은 대상 배경 위에서 읽히는 서피스를 고르는 시각 선택일 뿐 화자 정보를 담지 않습니다. 두 화자를 navy/light로 나누면 발신자를 색으로만 구분하게 되어 WCAG 1.4.1에 걸립니다. 채팅·대화 기록은 작성자 이름과 역할을 텍스트로 유지하는 ConversationMessage(그리고 목록 컨테이너 MessageFeed)를 쓰세요. - 사라지는 호버 힌트에는 Tooltip, 즉시 대응이 필요….
- Bubble의 controlled/uncontrolled 경계와 callback 순서는 공개 타입 계약을 따릅니다.
- 상태 변화 중에도 accessible name, focus 위치와 레이아웃 기준점을 예고 없이 잃지 않습니다.
- 제품 데이터와 side effect는 callback으로 위임하고 Bubble는 표시·입력 상태만 소유합니다.

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 명시 규칙 1 | 대화에는 쓰지 마세요. tone은 대상 배경 위에서 읽히는 서피스를 고르는 시각 선택일 뿐 화자 정보를 담지 않습니다. 두 화자를 navy/light로 나누면 발신자를 색으로만 구분하게 되어 WCAG 1.4.1에 걸립니다. 채팅·대화 기록은 작성자 이름과 역할을 텍스트로 유지하는 ConversationMessage(그리고 목록 컨테이너 MessageFeed)를 쓰세요. |
| 명시 규칙 2 | 폭은 최대 280px로 묶어 한 줄이 읽기 좋은 길이를 넘지 않게 합니다. 더 긴 본문이 필요하면 콜아웃이 아니라 Popover나 본문 영역으로 승격하세요. |
| 명시 규칙 3 | - tone — navy(솔리드) · light(화이트 + 헤어라인). tail — top \| bottom \| left \| right. - 대화에는 쓰지 마세요. tone은 대상 배경 위에서 읽히는 서피스를 고르는 시각 선택일 뿐 화자 정보를 담지 않습니다. 두 화자를 navy/light로 나누면 발신자를 색으로만 구분하게 되어 WCAG 1.4.1에 걸립니다. 채팅·대화 기록은 작성자 이름과 역할을 텍스트로 유지하는 ConversationMessage(그리고 목록 컨테이너 MessageFeed)를 쓰세요. - 사라지는 호버 힌트에는 Tooltip, 즉시 대응이 필요… |
| --color-semantic-background-elevated-normal | light: #FFFFFF; dark: #212225 |
| --color-semantic-inverse-background | light: #1B1C1E; dark: #FFFFFF |

## Responsive

- 320px 좁은 폭과 200% 텍스트 확대에서 페이지 가로 overflow 없이 의미 순서를 유지합니다.
- 고정 폭보다 부모 containment와 wrapping을 우선하고, 제품이 필요할 때 명시적으로 compact 표현을 선택합니다.

## Content and writing

- 대화에는 쓰지 마세요. tone은 대상 배경 위에서 읽히는 서피스를 고르는 시각 선택일 뿐 화자 정보를 담지 않습니다. 두 화자를 navy/light로 나누면 발신자를 색으로만 구분하게 되어 WCAG 1.4.1에 걸립니다. 채팅·대화 기록은 작성자 이름과 역할을 텍스트로 유지하는 ConversationMessage(그리고 목록 컨테이너 MessageFeed)를 쓰세요.
- 사라지는 호버 힌트에는 Tooltip, 즉시 대응이 필요한 시스템 오류에는 Alert를 쓰세요. Bubble은 화면에 남아 있는 설명입니다.
- Bubble — 꼬리가 대상을 가리키는 지속형 콜아웃(코치 마크, 지도·화면 주석, 짧은 설명).
- - tone — navy(솔리드) · light(화이트 + 헤어라인). tail — top | bottom | left | right. - 대화에는 쓰지 마세요. tone은 대상 배경 위에서 읽히는 서피스를 고르는 시각 선택일 뿐 화자 정보를 담지 않습니다. 두 화자를 navy/light로 나누면 발신자를 색으로만 구분하게 되어 WCAG 1.4.1에 걸립니다. 채팅·대화 기록은 작성자 이름과 역할을 텍스트로 유지하는 ConversationMessage(그리고 목록 컨테이너 MessageFeed)를 쓰세요. - 사라지는 호버 힌트에는 Tooltip, 즉시 대응이 필요….

## Accessibility

- 대화에는 쓰지 마세요. tone은 대상 배경 위에서 읽히는 서피스를 고르는 시각 선택일 뿐 화자 정보를 담지 않습니다. 두 화자를 navy/light로 나누면 발신자를 색으로만 구분하게 되어 WCAG 1.4.1에 걸립니다. 채팅·대화 기록은 작성자 이름과 역할을 텍스트로 유지하는 ConversationMessage(그리고 목록 컨테이너 MessageFeed)를 쓰세요.
- - tone — navy(솔리드) · light(화이트 + 헤어라인). tail — top | bottom | left | right. - 대화에는 쓰지 마세요. tone은 대상 배경 위에서 읽히는 서피스를 고르는 시각 선택일 뿐 화자 정보를 담지 않습니다. 두 화자를 navy/light로 나누면 발신자를 색으로만 구분하게 되어 WCAG 1.4.1에 걸립니다. 채팅·대화 기록은 작성자 이름과 역할을 텍스트로 유지하는 ConversationMessage(그리고 목록 컨테이너 MessageFeed)를 쓰세요. - 사라지는 호버 힌트에는 Tooltip, 즉시 대응이 필요….
- native semantic을 우선하며 사용자에게 보이는 이름과 접근 가능한 이름이 같은 목적을 설명하게 합니다.
- 키보드 focus 순서, focus-visible 표시와 상태 ARIA가 시각 상태와 동시에 갱신되는지 공개 스토리에서 검증합니다.
- 색상, 모양 또는 아이콘 하나만으로 상태를 구분하지 않고 이름·텍스트·semantic state를 함께 제공합니다.

## Do / Don't

| Kind | Guidance |
| --- | --- |
| Do | Bubble가 소유하는 Content 의미와 상태를 여러 제품 화면에서 동일하게 재사용할 때 사용합니다. |
| Don't | Bubble가 소유하지 않는 라우팅, 권한, 데이터 요청, 제품 임계값을 컴포넌트 내부에 넣지 않습니다. |
| Do | 제품별 구현 대신 공개 Bubble API와 semantic token으로 일관성을 유지해야 할 때 사용합니다. |
| Don't | 동일한 목적을 더 단순한 native 요소나 기존 LDS primitive로 해결할 수 있으면 새 조합을 만들지 않습니다. |

## Exceptions

- 제품 정책을 포함해야 하는 예외는 wrapper 또는 제품 저장소에서 조합하고 Bubble의 범용 API에 넣지 않습니다.
- 접근성 또는 안전 계약을 약화하는 예외는 허용하지 않으며 필요한 차이는 prompt와 Storybook 증거에 기록합니다.

## Related components

| Component | Relationship |
| --- | --- |
| `Bookmark` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |

## Examples

### 기본 조합

```jsx
<Bubble tone="navy" tail="bottom">선택 항목의 설명을 표시합니다.</Bubble>
<Bubble tone="light" tail="left">여기를 눌러 대시보드로 이동</Bubble>
```

## Tokens and API

### Tokens

- `--color-semantic-background-elevated-normal`
- `--color-semantic-inverse-background`
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

## Migration

- 현재 prompt와 타입 계약에 기록되지 않은 legacy alias는 새 코드에서 도입하지 않습니다.
- 대체 컴포넌트가 생기면 기존 API의 제거 버전, 대응 prop과 자동·수동 전환 절차를 이 페이지에 기록합니다.

## Sources

- Bubble prompt contract: `components/content/Bubble.prompt.md`
- Storybook implementation evidence: `stories/ContentBubble.stories.jsx`
