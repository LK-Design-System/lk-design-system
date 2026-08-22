# Link

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Core / Action |
| Owner | `Link` |
| Storybook | `LDS Core/Components/Action/Link` |
| Source | `../component-content.json#core-components-action-link` |

현재 콘텐츠와 관련된 내부 목적지나 외부 문서를 앵커 탐색으로 연결할 때 적합합니다. 저장·삭제처럼 현재 상태를 변경하거나 로딩 상태가 필요한 작업에는 Link 대신 Button 또는 Text Button을 사용하세요.

## 사용 판단

### 사용하지 않음

- href가 없으면 링크 역할도 포인터 커서도 주지 않습니다. 클릭 가능해 보이는 빈 앵커를 만들지 마세요.

## Anatomy

| Part | Contract |
| --- | --- |
| externalLabel | external일 때 접근 이름에 덧붙는 시각적 숨김 문구. @default "새 창에서 열림" |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `tone` | `'signal' \| 'neutral' \| 'inherit'` | No | 잉크. @default "signal" |
| `underline` | `'none' \| 'hover' \| 'always'` | No | 밑줄 동작. @default "hover" |
| `external` | `boolean` | No | 새 탭 + 외부 링크 화살표 + 안전한 rel + 접근 이름에 붙는 새 창 안내. @default false |
| `externalLabel` | `string` | No | external일 때 접근 이름에 덧붙는 시각적 숨김 문구. @default "새 창에서 열림" |
| `children` | `React.ReactNode` | No |  |

## States

| State | Contract |
| --- | --- |
| tone | 잉크. @default "signal" |

## 정량 규칙

| Subject | Rule |
| --- | --- |
| --color-semantic-label-neutral | light: rgba(46, 47, 51, 0.88); dark: rgba(194, 196, 200, 0.88) |
| --color-semantic-primary-normal | light: #3878B3; dark: #5390C9 |
| --fw-semibold | 600 |
| --space-1 | 4px |

## Content and writing

- Link는 밑줄 제어가 있는 앵커/내비게이션 전용입니다. 사이즈·로딩 상태가 필요한 버튼형 액션(독립형 텍스트 CTA)에는 TextButton을 쓰세요.

## Accessibility

- externalLabel — external일 때 접근 이름에 붙는 시각적 숨김 문구(기본 새 창에서 열림). 화살표 글리프는 aria-hidden이라 그것만으로는 새 창 이동이 보조기술에 전달되지 않습니다(WCAG G201 / H33). 문구를 바꿀 때만 지정하세요.

## Examples

### 기본 조합

```jsx
<Link href="/products">제품 보기</Link>
<Link href="https://example.com" external>외부 문서</Link>
```

## Tokens and API

### Tokens

- `--color-semantic-label-neutral`
- `--color-semantic-primary-normal`
- `--font-sans`
- `--fw-semibold`
- `--space-1`

### Source contracts

- `components/buttons/Link.jsx`
- `components/buttons/Link.d.ts`
- `components/buttons/Link.prompt.md`
- `stories/ActionLink.stories.jsx`

## Sources

- Link prompt contract: `components/buttons/Link.prompt.md`
- Storybook implementation evidence: `stories/ActionLink.stories.jsx`
