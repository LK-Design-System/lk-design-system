# Text Primitives

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Core / Content |
| Owner | `Blockquote` |
| Storybook | `LDS Core/Components/Content/Text Primitives` |
| Source | `../component-content.json#core-components-content-text-primitives` |

문서에서 일반 문장과 다른 의미를 가진 인용문, 출처, 코드, 키보드 입력을 정확히 표기할 때 적합합니다. 제목과 본문 위계는 Typography를 사용하고, 긴 코드 편집이나 실행 환경을 이 콘텐츠 요소로 대신하지 마세요.

## Anatomy

| Part | Contract |
| --- | --- |
| children | 출처 이름(링크되는 텍스트). |
| label | 구분자 앞의 모노 키커. @default "SOURCE" |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `attribution` | `React.ReactNode` | No | 사람이 읽는 출처 표기 줄. figcaption 으로 blockquote 바깥에 렌더링됩니다. |
| `cite` | `React.ReactNode` | No | attribution 의 레거시 별칭. HTML cite 속성(URL)과 이름이 겹치므로 새 코드에서는 attribution 을 쓰세요. |
| `citeUrl` | `string` | No | HTML cite 속성에 들어가는 출처 문서 URL. |
| `children` | `React.ReactNode` | No |  |
| `block` | `boolean` | No | 여러 줄 네이비 블록으로 렌더. @default false |
| `children` | `React.ReactNode` | No |  |
| `children` | `React.ReactNode` | No |  |
| `children` | `React.ReactNode` | No | 출처 이름(링크되는 텍스트). |
| `label` | `string` | No | 구분자 앞의 모노 키커. @default "SOURCE" |
| `href` | `string` | No | 설정하면 외부 링크로 렌더(새 탭으로 열리고 ↗ 표시). |
| `tone` | `'default' \| 'onDark'` | No | 'default'(라이트 서피스) 또는 'onDark'(네이비 서피스). @default "default" |

## States

| State | Contract |
| --- | --- |
| tone | 'default'(라이트 서피스) 또는 'onDark'(네이비 서피스). @default "default" |

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 명시 규칙 1 | 타입 스케일 정합: 출처 13.5px → --label2-size(13px)로 스냅했습니다(−0.5px, 인용문 대비 뮤트 위계 유지). 인용문(headline2)과 함께 전 사이트가 토큰 스케일 위에 있습니다. |
| --caption1-size | {"fontSize":"12px","lineHeight":"16px","letterSpacing":"0.0252em"} |
| --caption2-size | 11px |
| --color-semantic-background-elevated-normal | light: #FFFFFF; dark: #212225 |
| --color-semantic-fill-normal | light: rgba(112, 115, 124, 0.08); dark: rgba(112, 115, 124, 0.22) |

## Content and writing

- 이름 충돌 주의 — HTML 의 cite 속성은 사람이 읽는 이름이 아니라 출처 문서의 URL 입니다. 이 컴포넌트의 텍스트 출처는 attribution, URL 은 citeUrl 로 분리했습니다. 기존 코드 호환을 위해 cite prop 은 attribution 의 별칭으로 계속 동작하지만, 새 코드에서는 쓰지 마세요.
- 마크업 구조와 prop 이름.

## Related components

| Component | Relationship |
| --- | --- |
| `Code` | 같은 페이지가 소유 |
| `Kbd` | 같은 페이지가 소유 |
| `SourceTag` | 같은 페이지가 소유 |
| `Overline` | 대표 시나리오에서 조합 |
| `Accordion` | 대표 시나리오에서 조합 |
| `Collapsible` | 대표 시나리오에서 조합 |
| `ContentBadge` | 대표 시나리오에서 조합 |
| `ListCell` | 대표 시나리오에서 조합 |

## Examples

### 기본 조합

```jsx
<Blockquote attribution="문서 가이드">문서 화면에서는 상태, 조치, 결과가 같은 위계 안에서 읽혀야 합니다.</Blockquote>
<Blockquote attribution="LDS 접근성 가이드" citeUrl="https://example.com/a11y">…</Blockquote>
```

## Tokens and API

### Tokens

- `--caption1-size`
- `--caption2-size`
- `--color-semantic-background-elevated-normal`
- `--color-semantic-fill-normal`
- `--color-semantic-fill-strong`
- `--color-semantic-inverse-background`
- `--color-semantic-inverse-fill-normal`
- `--color-semantic-inverse-fill-strong`
- `--color-semantic-inverse-label`
- `--color-semantic-inverse-label-strong-soft`
- `--color-semantic-label-alternative`
- `--color-semantic-label-neutral`
- `--color-semantic-label-normal`
- `--color-semantic-line-normal-normal`
- `--color-semantic-primary-normal`
- `--component-tag-height`
- `--dur-fast`
- `--ease-out`
- `--font-mono`
- `--font-sans`
- `--fw-bold`
- `--fw-semibold`
- `--headline2-size`
- `--label2-size`
- `--radius-lg`
- `--radius-pill`
- `--radius-sm`
- `--space-3`

### Source contracts

- `components/content/Blockquote.jsx`
- `components/content/Blockquote.d.ts`
- `components/content/Blockquote.prompt.md`
- `components/content/Code.jsx`
- `components/content/Code.d.ts`
- `components/content/Code.prompt.md`
- `components/content/Kbd.jsx`
- `components/content/Kbd.d.ts`
- `components/content/Kbd.prompt.md`
- `components/content/SourceTag.jsx`
- `components/content/SourceTag.d.ts`
- `components/content/SourceTag.prompt.md`
- `stories/Content.stories.jsx`

## Sources

- Blockquote prompt contract: `components/content/Blockquote.prompt.md`
- Storybook implementation evidence: `stories/Content.stories.jsx`
