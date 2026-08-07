# Prose

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Core / Content |
| Owner | `Prose` |
| Storybook | `LDS Core/Components/Content/Prose` |
| Source | `../component-content.json#core-components-content-prose` |

마크다운 출력·문서 본문·어시스턴트 rich response처럼 이미 파싱된 형식화 콘텐츠에 DS 문서 타이포그래피를 입힐 때 적합합니다. 마크다운 문자열을 파싱·정화하거나 편집이 필요할 때는 Prose를 사용하지 않고 제품의 파서·전용 편집기를 쓰며, 결과 노드만 넘기세요.

## 사용 판단

### 사용

- 색·치수는 semantic 토큰만 사용합니다(하드코딩 색 없음). 스타일은 문서에 한 번만 주입됩니다.
- 코드·인용을 별도 규칙으로 다시 그리지 않고 Code·Blockquote 토큰을 재사용하는 것은 산문 내부와 원자 사용처의 시각 언어를 하나로 유지하기 위함입니다.

### 사용하지 않음

- 파서·sanitizer를 번들하지 않는 것은 DS를 특정 파서에 묶지 않고 보안 경계를 제품에 두기 위함입니다.
- 외부 기준은 GitHub Flavored Markdown 명세(조판할 요소 집합의 권위 출처)와 마크다운 렌더 산문의 관용 타이포그래피(GitHub markdown-body, Tailwind Typography prose의 요소 계약)입니다. 이들은 카테고리 기대치 확인용이며 스타일을 그대로 복제하지 않습니다.

## Anatomy

| Part | Contract |
| --- | --- |
| children | 이미 렌더된 형식화 콘텐츠(마크다운을 파싱·정화한 React 노드, 문서 본문, 어시스턴트 rich response). Prose는 이 자식의 요소별 타이포그래피만 소유하며 파싱·정화·하이라이팅·편집은 제품 책임입니다. heading 레벨은 콘텐츠가 정하고 재번호하지 않으므로, 주변 문서 계층에 맞는 레벨을 넘기세요(WCAG 1.3.1). |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `children` | `React.ReactNode` | No | 이미 렌더된 형식화 콘텐츠(마크다운을 파싱·정화한 React 노드, 문서 본문, 어시스턴트 rich response). Prose는 이 자식의 요소별 타이포그래피만 소유하며 파싱·정화·하이라이팅·편집은 제품 책임입니다. heading 레벨은 콘텐츠가 정하고 재번호하지 않으므로, 주변 문서 계층에 맞는 레벨을 넘기세요(WCAG 1.3.1). |
| `measure` | `string` | No | 읽기 폭 상한(measure). 긴 줄이 가독성을 해치지 않도록 제한합니다. |

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 명시 규칙 1 | heading 레벨 — 콘텐츠가 정한 레벨(h1–h6)을 그대로 조판하고 재번호하지 않습니다. 문서 계층에 맞는 레벨을 제품이 emit해야 합니다(WCAG 1.3.1). 카드 heading의 headingLevel 선례와 정합. |
| --body1-size | {"fontSize":"16px","lineHeight":"24px","letterSpacing":"0.0057em"} |
| --color-semantic-fill-alternative | light: rgba(112, 115, 124, 0.05); dark: rgba(112, 115, 124, 0.12) |
| --color-semantic-fill-normal | light: rgba(112, 115, 124, 0.08); dark: rgba(112, 115, 124, 0.22) |
| --color-semantic-fill-strong | light: rgba(112, 115, 124, 0.16); dark: rgba(112, 115, 124, 0.28) |

## Accessibility

- 소유 경계 — Prose는 결과의 시각·접근성 계약만 소유합니다. 마크다운 문자열 파싱, 신뢰할 수 없는 입력의 sanitize(보안), 구문 하이라이팅 토크나이저, 편집은 제품/transport 책임입니다(ContentEditor가 리치 텍스트 엔진을 제품에 위임한 것과 같은 선). 근거와 전체 스코프는 PROSESURFACEPROPOSAL.md.

## Related components

| Component | Relationship |
| --- | --- |
| `Accordion` | 대표 시나리오에서 조합 |
| `Blockquote` | 대표 시나리오에서 조합 |
| `Code` | 대표 시나리오에서 조합 |
| `Collapsible` | 대표 시나리오에서 조합 |
| `ContentBadge` | 대표 시나리오에서 조합 |
| `Kbd` | 대표 시나리오에서 조합 |
| `ListCell` | 대표 시나리오에서 조합 |
| `Overline` | 대표 시나리오에서 조합 |

## Examples

### 기본 조합

```jsx
// 제품이 파싱·정화한 React 노드를 children으로 넘깁니다(파서·sanitizer는 제품 소유).
<Prose>{renderMarkdown(answer)}</Prose>
<Prose measure="72ch">{articleNodes}</Prose>
```

## Tokens and API

### Tokens

- `--body1-size`
- `--color-semantic-fill-alternative`
- `--color-semantic-fill-normal`
- `--color-semantic-fill-strong`
- `--color-semantic-inverse-background`
- `--color-semantic-inverse-label`
- `--color-semantic-label-alternative`
- `--color-semantic-label-neutral`
- `--color-semantic-label-normal`
- `--color-semantic-label-strong`
- `--color-semantic-line-normal-normal`
- `--color-semantic-primary-normal`
- `--font-mono`
- `--font-sans`
- `--fw-bold`
- `--fw-extra`
- `--heading1-size`
- `--heading2-size`
- `--headline1-size`
- `--headline2-size`
- `--label1-reading-line`
- `--label1-size`
- `--label1-spacing`
- `--label2-size`
- `--radius-lg`
- `--radius-md`
- `--radius-sm`
- `--space-2`
- `--space-3`
- `--space-4`
- `--space-5`
- `--space-8`

### Source contracts

- `components/content/Prose.jsx`
- `components/content/Prose.d.ts`
- `components/content/Prose.prompt.md`
- `stories/ContentProse.stories.jsx`

## Sources

- Prose prompt contract: `components/content/Prose.prompt.md`
- Storybook implementation evidence: `stories/ContentProse.stories.jsx`
- [GitHub Flavored Markdown 명세](https://github.github.com/gfm/)
